import {
  DomEvent,
  DomUtil,
  extend,
  latLngBounds,
  Layer,
  setOptions,
  Util
} from 'leaflet';
import mapboxgl from 'mapbox-gl';

export var MapboxGLJSLayer = Layer.extend({
  options: {
    updateInterval: 32,
    // How much to extend the overlay view (relative to map size)
    // e.g. 0.1 would be 10% of map view in each direction
    padding: 0.1,
    // whether or not to register the mouse and keyboard
    // events on the mapbox overlay
    interactive: false,
    opacity: 1
  },

  initialize: function (options) {
    setOptions(this, options);

    // setup throttling the update event when panning
    this._throttledUpdate = Util.throttle(
      this._update,
      this.options.updateInterval,
      this
    );
  },

  onAdd: function (map) {
    if (!this._container) {
      this._initContainer();
    }

    this.getPane().appendChild(this._container);

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

  onRemove: function (map) {
    if (this._map._proxy && this._map.options.zoomAnimation) {
      DomEvent.off(
        this._map._proxy,
        DomUtil.TRANSITION_END,
        this._transitionEnd,
        this
      );
    }

    this.getPane().removeChild(this._container);
    this._glMap.remove();
    this._glMap = null;
  },

  getEvents: function () {
    return {
      move: this._throttledUpdate, // sensibly throttle updating while panning
      zoomanim: this._animateZoom, // applys the zoom animation to the <canvas>
      zoom: this._pinchZoom, // animate every zoom event for smoother pinch-zooming
      zoomstart: this._zoomStart, // flag starting a zoom to disable panning
      zoomend: this._zoomEnd
    };
  },

  getMapboxMap: function () {
    return this._glMap;
  },

  getCanvas: function () {
    return this._glMap.getCanvas();
  },

  getSize: function () {
    return this._map.getSize().multiplyBy(1 + this.options.padding * 2);
  },

  getOpacity: function () {
    return this.options.opacity;
  },

  setOpacity: function (opacity) {
    this.options.opacity = opacity;
    this._container.style.opacity = opacity;
  },

  getBounds: function () {
    var halfSize = this.getSize().multiplyBy(0.5);
    var center = this._map.latLngToContainerPoint(this._map.getCenter());
    return latLngBounds(
      this._map.containerPointToLatLng(center.subtract(halfSize)),
      this._map.containerPointToLatLng(center.add(halfSize))
    );
  },

  getContainer: function () {
    return this._container;
  },

  _initContainer: function () {
    var container = (this._container = DomUtil.create(
      'div',
      'leaflet-gl-layer'
    ));

    var size = this.getSize();
    var offset = this._map.getSize().multiplyBy(this.options.padding);
    container.style.width = size.x + 'px';
    container.style.height = size.y + 'px';
    container.style.position = 'absolute';
    container.style.opacity = this.options.opacity;
    var topLeft = this._map.containerPointToLayerPoint([0, 0]).subtract(offset);

    DomUtil.setPosition(container, topLeft);
  },

  _initGL: function () {
    var center = this._map.getCenter();

    var options = extend({}, this.options, {
      container: this._container,
      center: [center.lng, center.lat],
      zoom: this._map.getZoom() - 1,
      attributionControl: false
    });

    this._glMap = new mapboxgl.Map(options);

    // Fire event for MapboxGL "styledata" event.
    this._glMap.once('styledata', function (res) {
      this.fire('styleLoaded');
    }.bind(this));

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
    var canvas = this._glMap._actualCanvas;
    DomUtil.addClass(canvas, 'leaflet-image-layer');
    DomUtil.addClass(canvas, 'leaflet-zoom-animated');
    if (this.options.interactive) {
      DomUtil.addClass(canvas, 'leaflet-interactive');
    }
    if (this.options.className) {
      DomUtil.addClass(canvas, this.options.className);
    }
  },

  _update: function (e) {
    // update the offset so we can correct for it later when we zoom
    this._offset = this._map.containerPointToLayerPoint([0, 0]);

    if (this._zooming) {
      return;
    }

    var size = this.getSize();
    var container = this._container;
    var gl = this._glMap;
    var offset = this._map.getSize().multiplyBy(this.options.padding);
    var topLeft = this._map.containerPointToLayerPoint([0, 0]).subtract(offset);

    DomUtil.setPosition(container, topLeft);

    this._transformGL(gl);

    if (gl.transform.width !== size.x || gl.transform.height !== size.y) {
      container.style.width = size.x + 'px';
      container.style.height = size.y + 'px';
      if (gl._resize !== null && gl._resize !== undefined) {
        gl._resize();
      } else {
        gl.resize();
      }
    } else {
      // older versions of mapbox-gl surfaced update publicly
      if (gl._update !== null && gl._update !== undefined) {
        gl._update();
      } else {
        gl.update();
      }
    }
  },

  _transformGL: function (gl) {
    var center = this._map.getCenter();

    // gl.setView([center.lat, center.lng], this._map.getZoom() - 1, 0);
    // calling setView directly causes sync issues because it uses requestAnimFrame

    var tr = gl.transform;
    tr.center = mapboxgl.LngLat.convert([center.lng, center.lat]);
    tr.zoom = this._map.getZoom() - 1;
  },

  // update the map constantly during a pinch zoom
  _pinchZoom: function (e) {
    this._glMap.jumpTo({
      zoom: this._map.getZoom() - 1,
      center: this._map.getCenter()
    });
  },

  // borrowed from L.ImageOverlay
  // https://github.com/Leaflet/Leaflet/blob/master/src/layer/ImageOverlay.js#L139-L144
  _animateZoom: function (e) {
    var scale = this._map.getZoomScale(e.zoom);
    var padding = this._map.getSize().multiplyBy(this.options.padding * scale);
    var viewHalf = this.getSize()._divideBy(2);
    // corrections for padding (scaled), adapted from
    // https://github.com/Leaflet/Leaflet/blob/master/src/map/Map.js#L1490-L1508
    var topLeft = this._map
      .project(e.center, e.zoom)
      ._subtract(viewHalf)
      ._add(this._map._getMapPanePos().add(padding))
      ._round();
    var offset = this._map
      .project(this._map.getBounds().getNorthWest(), e.zoom)
      ._subtract(topLeft);

    DomUtil.setTransform(
      this._glMap._actualCanvas,
      offset.subtract(this._offset),
      scale
    );
  },

  _zoomStart: function (e) {
    this._zooming = true;
  },

  _zoomEnd: function () {
    var scale = this._map.getZoomScale(this._map.getZoom());

    DomUtil.setTransform(
      this._glMap._actualCanvas,
      null,
      scale
    );

    this._zooming = false;

    this._update();
  },

  _transitionEnd: function (e) {
    Util.requestAnimFrame(function () {
      var zoom = this._map.getZoom();
      var center = this._map.getCenter();
      var offset = this._map.latLngToContainerPoint(
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
        center: center,
        zoom: zoom - 1
      });
    }, this);
  }
});

export function mapboxGLJSLayer (options) {
  return new MapboxGLJSLayer(options);
}
