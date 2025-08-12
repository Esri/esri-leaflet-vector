/* eslint-env mocha */
const itemId = '287c07ef752246d08bb4712fd4b74438';
const apikey = '1234';
const basemapKey = 'ArcGIS:Streets';
const basemapKeyV2 = 'arcgis/streets';
const customBasemap = 'f04f33b9626240f084cb52f0b08758ef';
const language = 'zh_s';
const worldview = 'morocco';
const places = 'attributed';

describe('VectorBasemapLayer', () => {
	it('should have a L.esri.vectorBasemapLayer alias', () => {
		console.log(
			'L.esri.Vector.vectorBasemapLayer',
			L.esri.Vector.vectorBasemapLayer
		);

		expect(
			L.esri.Vector.vectorBasemapLayer(itemId, {
				apikey
			})
		).to.be.instanceof(L.esri.Vector.VectorBasemapLayer);
	});

	it('should save the key from the constructor - itemID', () => {
		const layer = L.esri.Vector.vectorBasemapLayer(itemId, {
			apikey
		});

		expect(layer.options.key).to.equal(itemId);
	});

	it('should error if no api key or token', () => {
		expect(() => {
			L.esri.Vector.vectorBasemapLayer(basemapKey, {});
		}).to.throw('API Key or token is required for vectorBasemapLayer.');
	});

	it('should save the key from the constructor - enumeration basemap key', () => {
		const layer = L.esri.Vector.vectorBasemapLayer(basemapKey, {
			apikey
		});

		expect(layer.options.key).to.equal(basemapKey);
	});

	it('should save the api key from the constructor', () => {
		const layer = L.esri.Vector.vectorBasemapLayer(basemapKey, {
			apikey
		});

		expect(layer.options.apikey).to.equal(apikey);
	});

	it('should save the token as apikey from the constructor', () => {
		const layer = new L.esri.Vector.VectorBasemapLayer(basemapKey, {
			token: apikey
		});

		expect(layer.options.apikey).to.equal(apikey);
	});

	it('should create basemap styles in the \'tilePane\' by default', () => {
		const layer = new L.esri.Vector.VectorBasemapLayer(basemapKey, {
			apikey
		});
		const layerV2 = new L.esri.Vector.VectorBasemapLayer(basemapKeyV2, {
			apikey,
			version: 2
		});

		expect(layer.options.pane).to.equal('tilePane');
		expect(layerV2.options.pane).to.equal('tilePane');
	});

	it('should add \'Labels\' styles to the \'esri-labels\' pane by default', () => {
		const layer = new L.esri.Vector.VectorBasemapLayer(
			'ArcGIS:Imagery:Labels',
			{
				apikey
			}
		);

		const layerV2 = new L.esri.Vector.VectorBasemapLayer(
			'arcgis/imagery/labels',
			{
				apikey,
				version: 2
			}
		);

		// These label styles use a different endpoint (/label instead of /labels, for some reason)
		const humanGeoLayer = new L.esri.Vector.VectorBasemapLayer(
			'ArcGIS:HumanGeography:Label',
			{
				apikey
			}
		);
		const humanGeoLayerV2 = new L.esri.Vector.VectorBasemapLayer(
			'arcgis/human-geography/label',
			{
				apikey,
				version: 2
			}
		);

		expect(layer.options.pane).to.equal('esri-labels');
		expect(layerV2.options.pane).to.equal('esri-labels');
		expect(humanGeoLayer.options.pane).to.equal('esri-labels');
		expect(humanGeoLayerV2.options.pane).to.equal('esri-labels');
	});

	it('should add \'Detail\' styles to the \'esri-detail\' pane by default', () => {
		const layer = new L.esri.Vector.VectorBasemapLayer(
			'ArcGIS:Terrain:Detail',
			{
				apikey
			}
		);
		const layerV2 = new L.esri.Vector.VectorBasemapLayer(
			'arcgis/terrain/detail',
			{
				apikey,
				version: 2
			}
		);

		expect(layer.options.pane).to.equal('esri-detail');
		expect(layerV2.options.pane).to.equal('esri-detail');
	});

	it('should save the service version from the constructor', () => {
		const layer = new L.esri.Vector.VectorBasemapLayer(basemapKeyV2, {
			apikey,
			version: 2
		});

		expect(layer.options.version).to.equal(2);
	});

	it('should load a v1 basemap from a v1 style key without needing to specify a version', () => {
		const layer = new L.esri.Vector.VectorBasemapLayer(basemapKey, {
			apikey
		});

		expect(layer.options.version).to.equal(1);
	});

	it('should load a v2 basemap from a v2 style key without needing to specify a version', () => {
		const layer = new L.esri.Vector.VectorBasemapLayer(basemapKeyV2, {
			apikey
		});

		expect(layer.options.version).to.equal(2);
	});

	it('should save the language and worldview parameters from the constructor', () => {
		const layer = new L.esri.Vector.VectorBasemapLayer(basemapKeyV2, {
			apikey,
			version: 2,
			language,
			worldview,
			places
		});

		expect(layer.options.language).to.equal(language);
		expect(layer.options.worldview).to.equal(worldview);
		expect(layer.options.places).to.equal(places);
	});

	it('should error if a language is provided when accessing the v1 service', () => {
		expect(() => {
			L.esri.Vector.vectorBasemapLayer(basemapKey, {
				apikey,
				language
			});
		}).to.throw(
			'The language parameter is only supported by the basemap styles service v2. Provide a v2 style enumeration to use this option.'
		);
	});

	it('should error if a worldview is provided when accessing the v1 service', () => {
		expect(() => {
			L.esri.Vector.vectorBasemapLayer(basemapKey, {
				apikey,
				worldview
			});
		}).to.throw(
			'The worldview parameter is only supported by the basemap styles service v2. Provide a v2 style enumeration to use this option.'
		);
	});

	it('should error if a places parameter is provided when accessing the v1 service', () => {
		expect(() => {
			L.esri.Vector.vectorBasemapLayer(basemapKey, {
				apikey,
				places
			});
		}).to.throw(
			'The places parameter is only supported by the basemap styles service v2. Provide a v2 style enumeration to use this option.'
		);
	});

	it('should not accept a v2 style enumeration when accessing the v1 service', () => {
		expect(() => {
			L.esri.Vector.vectorBasemapLayer(basemapKeyV2, {
				apikey,
				version: 1
			});
		}).to.throw(
			`${basemapKeyV2
			} is a v2 style enumeration. Set version:2 to request this style`
		);
	});

	it('should not accept a v1 style enumeration when accessing the v2 service', () => {
		expect(() => {
			L.esri.Vector.vectorBasemapLayer(basemapKey, {
				apikey,
				version: 2
			});
		}).to.throw(
			`${basemapKey
			} is a v1 style enumeration. Set version:1 to request this style`
		);
	});

	it('should load a custom basemap style from an item ID when using the v1 service', () => {
		const customLayer = L.esri.Vector.vectorBasemapLayer(customBasemap, {
			apikey,
			version: 1
		});
		expect(customLayer._maplibreGL.options.style).to.equal(
			`https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${customBasemap}?type=style&token=${apikey}`
		);
	});

	it('should load a custom basemap style from an item ID when using the v2 service', () => {
		const customLayer = L.esri.Vector.vectorBasemapLayer(customBasemap, {
			apikey,
			version: 2
		});
		expect(customLayer._maplibreGL.options.style).to.equal(
			`https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/items/${customBasemap}?token=${apikey}`
		);
	});

	it('should error if a language is provided when loading a custom basemap style', () => {
		expect(() => {
			L.esri.Vector.vectorBasemapLayer(customBasemap, {
				apikey,
				version: 2,
				language
			});
		}).to.throw(
			'The \'language\' parameter is not supported for custom basemap styles'
		);
	});

	describe('_getAttributionUrls', () => {
		it('should handle OSM keys', () => {
			const key = 'OSM:Standard';
			const layer = new L.esri.Vector.VectorBasemapLayer(key, {
				token: apikey
			});
			const attributionUrls = layer._getAttributionUrls(key);
			expect(attributionUrls.length).to.equal(1);
			expect(attributionUrls[0]).to.equal(
				'https://static.arcgis.com/attribution/Vector/OpenStreetMap_v2'
			);
		});

		it('should handle ArcGIS Imagery keys', () => {
			const key = 'ArcGIS:Imagery';
			const layer = new L.esri.Vector.VectorBasemapLayer(key, {
				token: apikey
			});
			const attributionUrls = layer._getAttributionUrls(key);
			expect(attributionUrls.length).to.equal(2);
			expect(attributionUrls[0]).to.equal(
				'https://static.arcgis.com/attribution/World_Imagery'
			);
			expect(attributionUrls[1]).to.equal(
				'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
			);
		});

		it('should handle ArcGIS non-Imagery keys', () => {
			const key = 'ArcGIS:Streets';
			const layer = new L.esri.Vector.VectorBasemapLayer(key, {
				token: apikey
			});
			const attributionUrls = layer._getAttributionUrls(key);
			expect(attributionUrls.length).to.equal(1);
			expect(attributionUrls[0]).to.equal(
				'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
			);
		});
	});

	describe('_setupAttribution', () => {
		it('should add attribution for non itemId item', () => {
			const key = 'ArcGIS:Streets';
			const layer = new L.esri.Vector.VectorBasemapLayer(key, {
				token: apikey
			});
			layer._ready = false;
			let attributionValue = '';
			const fakeMap = {
				attributionControl: {
					setPrefix() {},
					_container: {className: '', querySelector: () => {}},
					addAttribution() {
						attributionValue = arguments[0]; // eslint-disable-line prefer-rest-params
					}
				},
				getSize() {
					return {x: 0, y: 0};
				},
				on() {}
			};
			layer.onAdd(fakeMap);
			layer._setupAttribution();
			expect(attributionValue).to.be.equal(
				'<span class="esri-dynamic-attribution"></span>'
			);
		});

		it('should add attribution for itemId item', () => {
			const key = '3e1a00aeae81496587988075fe529f71';
			const layer = new L.esri.Vector.VectorBasemapLayer(key, {
				token: apikey
			});
			layer._ready = false;
			let attributionValue = '?';
			const fakeMap = {
				attributionControl: {
					setPrefix() {},
					_container: {className: '', querySelector: () => {}},
					addAttribution() {
						attributionValue = arguments[0]; // eslint-disable-line prefer-rest-params
					}
				},
				getSize() {
					return {x: 0, y: 0};
				},
				on() {}
			};
			layer.onAdd(fakeMap);
			layer._maplibreGL.getMaplibreMap = function () {
				return {
					style: {
						stylesheet: {
							sources: {
								one: {
									attribution: '@ my attribution',
									copyrightText: '@ my copyright text'
								}
							}
						}
					}
				};
			};

			layer._setupAttribution();
			const expectedAttributionValue =
        '<span class="esri-dynamic-attribution">Powered by <a href="https://www.esri.com">Esri</a> | @ my attribution, @ my copyright text</span>';
			expect(attributionValue).to.be.equal(expectedAttributionValue);
		});
	});

	describe('onRemove', () => {
		it('should call esri-leaflet and attributionControl remove attribution methods', () => {
			const key = 'ArcGIS:Streets';
			const layer = new L.esri.Vector.VectorBasemapLayer(key, {
				token: apikey
			});
			layer._ready = false;
			const fakeMap = {
				attributionControl: {
					removeAttribution() {}
				},
				off() {},
				removeLayer() {}
			};

			const attributionControlSpy = sinon.spy(fakeMap.attributionControl);
			const utilSpy = sinon.spy(L.esri.Util, 'removeEsriAttribution');

			sinon.stub(document, 'getElementsByClassName').callsFake(() => [{outerHTML: '<div>'}]);

			layer.onRemove(fakeMap);
			document.getElementsByClassName.restore();

			expect(utilSpy.calledWith(fakeMap)).to.be.equal(true);
			expect(attributionControlSpy.removeAttribution.callCount).to.be.equal(2);
		});
	});
});
