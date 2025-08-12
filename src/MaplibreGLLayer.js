import {
	DomEvent,
	DomUtil,
	extend,
	latLngBounds,
	Layer,
	setOptions,
	Util
} from 'leaflet';
import maplibregl from 'maplibre-gl';

export const setRTLTextPlugin = (url, callback, deferred) => {
	maplibregl.setRTLTextPlugin(url, callback, deferred);
};

export const MaplibreGLJSLayer = Layer.extend({
	options: {
		updateInterval: 32,
		// How much to extend the overlay view (relative to map size)
		// e.g. 0.1 would be 10% of map view in each direction
		padding: 0.1,
		// whether or not to register the mouse and keyboard
		// events on the mapbox overlay
		interactive: false,
		// set the tilepane as the default pane to draw gl tiles
		pane: 'tilePane'
	},

	initialize(options) {
		setOptions(this, options);

		// setup throttling the update event when panning
		this._throttledUpdate = Util.throttle(
			this._update,
			this.options.updateInterval,
			this
		);
	},

	onAdd(map) {
		if (!this._container) {
			this._initContainer();
		}

		const paneName = this.getPaneName();
		map.getPane(paneName).appendChild(this._container);

		this._initGL();

		this._offset = this._map.containerPointToLayerPoint([0, 0]);

		// work around https://github.com/mapbox/mapbox-gl-leaflet/issues/47
		if (map.options.zoomAnimation) {
			DomEvent.on(
				map._proxy,
				DomUtil.TRANSITION_END,
				this._transitionEnd,
				this
			);
		}
	},

	onRemove(map) {
		if (this._map._proxy && this._map.options.zoomAnimation) {
			DomEvent.off(
				this._map._proxy,
				DomUtil.TRANSITION_END,
				this._transitionEnd,
				this
			);
		}

		const paneName = this.getPaneName();

		map.getPane(paneName).removeChild(this._container);
		this._container = null;

		this._glMap.remove();
		this._glMap = null;
	},

	getEvents() {
		return {
			move: this._throttledUpdate, // sensibly throttle updating while panning
			zoomanim: this._animateZoom, // applies the zoom animation to the <canvas>
			zoom: this._pinchZoom, // animate every zoom event for smoother pinch-zooming
			zoomstart: this._zoomStart, // flag starting a zoom to disable panning
			zoomend: this._zoomEnd,
			resize: this._resize
		};
	},

	getMaplibreMap() {
		return this._glMap;
	},

	getCanvas() {
		return this._glMap.getCanvas();
	},

	getSize() {
		return this._map.getSize().multiplyBy(1 + this.options.padding * 2);
	},

	getOpacity() {
		return this.options.opacity;
	},

	setOpacity(opacity) {
		this.options.opacity = opacity;
		this._container.style.opacity = opacity;
	},

	getBounds() {
		const halfSize = this.getSize().multiplyBy(0.5);
		const center = this._map.latLngToContainerPoint(this._map.getCenter());
		return latLngBounds(
			this._map.containerPointToLatLng(center.subtract(halfSize)),
			this._map.containerPointToLatLng(center.add(halfSize))
		);
	},

	getContainer() {
		return this._container;
	},

	// returns the pane name set in options if it is a valid pane, defaults to tilePane
	getPaneName() {
		return this._map.getPane(this.options.pane) ?
			this.options.pane :
			'tilePane';
	},

	_resize() {
		return this._glMap._resize;
	},

	_initContainer() {
		if (this._container) {
			return;
		}

		this._container = DomUtil.create('div', 'leaflet-gl-layer');

		const size = this.getSize();
		const offset = this._map.getSize().multiplyBy(this.options.padding);
		this._container.style.width = `${size.x  }px`;
		this._container.style.height = `${size.y  }px`;

		const topLeft = this._map
			.containerPointToLayerPoint([0, 0])
			.subtract(offset);

		DomUtil.setPosition(this._container, topLeft);
	},

	_initGL() {
		if (this._glMap) {
			return;
		}

		const center = this._map.getCenter();

		const options = extend({}, this.options, {
			container: this._container,
			center: [center.lng, center.lat],
			zoom: this._map.getZoom() - 1,
			attributionControl: false
		});

		this._glMap = new maplibregl.Map(options);

		// Listen for style data error (401 Unauthorized)
		this._glMap.on('error', (error) => {
			if (error.error && error.error.status === 401) {
				console.warn(
					'Invalid or expired API key. Please check that API key is not expired and has the basemaps privilege assigned.'
				);
			}
		});

		// Fire event for Maplibre "styledata" event.
		this._glMap.once(
			'styledata',
			() => {
				this.fire('styleLoaded');
			}
		);

		// allow GL base map to pan beyond min/max latitudes
		this._glMap.transform.latRange = null;
		this._glMap.transform.maxValidLatitude = Infinity;

		this._transformGL(this._glMap);

		if (this._glMap._canvas.canvas) {
			// older versions of mapbox-gl surfaced the canvas differently
			this._glMap._actualCanvas = this._glMap._canvas.canvas;
		} else {
			this._glMap._actualCanvas = this._glMap._canvas;
		}

		// treat child <canvas> element like L.ImageOverlay
		const canvas = this._glMap._actualCanvas;
		DomUtil.addClass(canvas, 'leaflet-image-layer');
		DomUtil.addClass(canvas, 'leaflet-zoom-animated');
		if (this.options.interactive) {
			DomUtil.addClass(canvas, 'leaflet-interactive');
		}
		if (this.options.className) {
			DomUtil.addClass(canvas, this.options.className);
		}
	},

	_update() {
		// update the offset, so we can correct for it later when we zoom
		this._offset = this._map.containerPointToLayerPoint([0, 0]);

		if (this._zooming) {
			return;
		}

		const size = this.getSize();
		const container = this._container;
		const gl = this._glMap;
		const offset = this._map.getSize().multiplyBy(this.options.padding);
		const topLeft = this._map
			.containerPointToLayerPoint([0, 0])
			.subtract(offset);

		DomUtil.setPosition(container, topLeft);

		this._transformGL(gl);

		if (gl.transform.width !== size.x || gl.transform.height !== size.y) {
			container.style.width = `${size.x  }px`;
			container.style.height = `${size.y  }px`;
			if (gl._resize !== null && gl._resize !== undefined) {
				gl._resize();
			} else {
				gl.resize();
			}
		} else {
			// older versions of mapbox-gl surfaced update publicly
			gl._update();
		}
	},

	_transformGL(gl) {
		const center = this._map.getCenter();

		// gl.setView([center.lat, center.lng], this._map.getZoom() - 1, 0);
		// calling setView directly causes sync issues because it uses requestAnimFrame

		const tr = gl.transform;
		tr.center = maplibregl.LngLat.convert([center.lng, center.lat]);
		tr.zoom = this._map.getZoom() - 1;
	},

	// update the map constantly during a pinch zoom
	_pinchZoom() {
		this._glMap.jumpTo({
			zoom: this._map.getZoom() - 1,
			center: this._map.getCenter()
		});
	},

	// borrowed from L.ImageOverlay
	// https://github.com/Leaflet/Leaflet/blob/master/src/layer/ImageOverlay.js#L139-L144
	_animateZoom(e) {
		const scale = this._map.getZoomScale(e.zoom);
		const padding = this._map
			.getSize()
			.multiplyBy(this.options.padding * scale);
		const viewHalf = this.getSize()._divideBy(2);
		// corrections for padding (scaled), adapted from
		// https://github.com/Leaflet/Leaflet/blob/master/src/map/Map.js#L1490-L1508
		const topLeft = this._map
			.project(e.center, e.zoom)
			._subtract(viewHalf)
			._add(this._map._getMapPanePos().add(padding))
			._round();
		const offset = this._map
			.project(this._map.getBounds().getNorthWest(), e.zoom)
			._subtract(topLeft);

		DomUtil.setTransform(
			this._glMap._actualCanvas,
			offset.subtract(this._offset),
			scale
		);
	},

	_zoomStart() {
		this._zooming = true;
	},

	_zoomEnd() {
		const scale = this._map.getZoomScale(this._map.getZoom());

		DomUtil.setTransform(this._glMap._actualCanvas, null, scale);

		this._zooming = false;

		this._update();
	},

	_transitionEnd() {
		Util.requestAnimFrame(function () {
			const zoom = this._map.getZoom();
			const center = this._map.getCenter();
			const offset = this._map.latLngToContainerPoint(
				this._map.getBounds().getNorthWest()
			);

			// reset the scale and offset
			DomUtil.setTransform(this._glMap._actualCanvas, offset, 1);

			// enable panning once the gl map is ready again
			this._glMap.once(
				'moveend',
				Util.bind(function () {
					this._zoomEnd();
				}, this)
			);

			// update the map position
			this._glMap.jumpTo({
				center,
				zoom: zoom - 1
			});
		}, this);
	}
});

export function maplibreGLJSLayer(options) {
	return new MaplibreGLJSLayer(options);
}
