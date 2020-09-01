import { Layer, setOptions } from 'leaflet';
import { Support, Util } from 'esri-leaflet';
import {
  loadStyle,
  formatStyle,
  getAttributionData
} from './Util';
import { mapboxGLJSLayer } from './MapBoxGLLayer';

export var VectorTileLayer = Layer.extend({
  statics: {
    URLPREFIX: 'https://www.arcgis.com/sharing/rest/content/items/',
    URLSUFFIX: '/resources/styles/root.json',
    STYLES: {
      OpenStreetMap: {
        id: '3e1a00aeae81496587988075fe529f71',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/OpenStreetMap_v2'
          ]
        }
      },
      Streets: {
        id: 'de26a3cf4cc9451298ea173c4b324736',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      StreetsNight: {
        id: '86f556a2d1fd468181855a35e344567f',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      StreetsRelief: {
        id: 'b266e6d17fc345b498345613930fbd76',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ],
          raster: [
            'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}.png'
          ]
        }
      },
      Navigation: {
        id: '63c47b7177f946b49902c24129b87252',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      NavigationDark: {
        id: 'b69e76a446ac479998ff31de839ba323',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      Topographic: {
        id: '7dc6cea0b1764a1f9af2e679f642f0f5',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ],
          raster: [
            'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}.png'
          ]
        }
      },
      Imagery: {
        id: '30d6b8271e1849cd9c3042060001f425',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/World_Imagery',
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ],
          raster: [
            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png'
          ]
        }
      },
      MidCentury: {
        id: '7675d44bb1e4428aa2c30a9b68f97822',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      ModernAntique: {
        id: 'effe3475f05a4d608e66fd6eeb2113c0',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      ChartedTerritory: {
        id: '1c365daf37a744fbad748b67aa69dac8',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ],
          raster: [
            'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}.png'
          ]
        }
      },
      HumanGeographyBase: {
        id: '2afe5b807fa74006be6363fd243ffb30',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      HumanGeographyDetail: {
        id: '97fa1365da1e43eabb90d0364326bc2d',
        options: {
          opacity: 0.6,
          pane: Support.pointerEvents ? 'esri-detail' : 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      HumanGeographyLabel: {
        id: 'ba52238d338745b1a355407ec9df6768',
        options: {
          opacity: 1,
          pane: Support.pointerEvents ? 'esri-labels' : 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      HumanGeographyDarkBase: {
        id: 'd7397603e9274052808839b70812be50',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      HumanGeographyDarkDetail: {
        id: '1ddbb25aa29c4811aaadd94de469856a',
        options: {
          opacity: 0.6,
          pane: Support.pointerEvents ? 'esri-detail' : 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      HumanGeographyDarkLabel: {
        id: '4a3922d6d15f405d8c2b7a448a7fbad2',
        options: {
          opacity: 1,
          pane: Support.pointerEvents ? 'esri-labels' : 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      ColoredPencil: {
        id: '4cf7e1fb9f254dcda9c8fbadb15cf0f8',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      Terrain: {
        id: '33064a20de0c48d2bb61efa8faca93a8',
        options: {
          opacity: 1,
          pane: 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ],
          raster: [
            'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}.png'
          ]
        }
      },
      TerrainLabels: {
        id: '14fbc125ccc9488888b014db09f35f67',
        options: {
          opacity: 1,
          pane: Support.pointerEvents ? 'esri-labels' : 'tilePane',
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      Community: {
        id: '273bf8d5c8ac400183fc24e109d20bcf',
        options: {
          opacity: 1,
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      NationalGeographic: {
        id: '3d1a30626bbc46c582f148b9252676ce',
        options: {
          opacity: 1,
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ],
          raster: [
            'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}.png',
            'https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/NatGeoStyleBase/MapServer/tile/{z}/{y}/{x}.png'
          ]
        }
      },
      Newspaper: {
        id: 'dfb04de5f3144a80bc3f9f336228d24a',
        options: {
          opacity: 1,
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      Nova: {
        id: '75f4dfdff19e445395653121a95a85db',
        options: {
          opacity: 1,
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      Watercolor: {
        id: 'fdf540eef40344b79ead3c0c49be76a9',
        options: {
          opacity: 1,
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      Gray: {
        id: '8a2cba3b0ebf4140b7c0dc5ee149549a',
        options: {
          opacity: 1,
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      GrayBase: {
        id: '291da5eab3a0412593b66d384379f89f',
        options: {
          opacity: 1,
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      GrayLabels: {
        id: '1768e8369a214dfab4e2167d5c5f2454',
        options: {
          opacity: 1,
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      DarkGray: {
        id: 'c11ce4f7801740b2905eb03ddc963ac8',
        options: {
          opacity: 1,
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      DarkGrayBase: {
        id: '5e9b3685f4c24d8781073dd928ebda50',
        options: {
          opacity: 1,
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      },
      DarkGrayLabels: {
        id: '747cb7a5329c478cbe6981076cc879c5',
        options: {
          opacity: 1,
          attributionUrls: [
            'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
          ]
        }
      }
    }
  },

  options: {
    key: 'OpenStreetMap'
  },

  initialize: function (key, options) {
    if (typeof key === 'string') {
      options = options || {};
      options.key = key;
    }

    if (
      typeof options.key === 'string' &&
      VectorTileLayer.STYLES[options.key]
    ) {
      setOptions(this, VectorTileLayer.STYLES[options.key].options);
      setOptions(this, {
        styleId: VectorTileLayer.STYLES[options.key].id
      });
      setOptions(this, options);
    } else if (typeof options.key === 'string') {
      setOptions(this, { styleId: options.key });
      setOptions(this, options);
    }

    loadStyle(
      this.options.styleId || this.options.key,
      this.options,
      function (error, style, service, serviceUrl) {
        if (error) {
          console.error(error);
        }
        this._setupStyle(style, service, serviceUrl);
      }.bind(this)
    );
  },

  _setupStyle: function (style, service, serviceUrl) {
    if (this.options.raster) {
      for (let index = 0; index < this.options.raster.length; index++) {
        const id =
          'esri-leaflet-vector-basemap-raster-' +
          this.options.styleId +
          '-' +
          index;

        style.sources[id] = {
          type: 'raster',
          tiles: [this.options.raster[index]],
          tileSize: 256
        };

        style.layers.unshift({
          type: 'raster',
          id: id,
          source: id
        });
      }
    }

    if (!this.options.attributionUrls) {
      if (
        serviceUrl ===
        'https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer'
      ) {
        this.options.attributionUrls = [
          'https://static.arcgis.com/attribution/Vector/OpenStreetMap_v2'
        ];
        this._setupAttribution();
      }

      if (
        serviceUrl ===
        'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer'
      ) {
        this.options.attributionUrls = [
          'https://static.arcgis.com/attribution/Vector/World_Basemap_v2'
        ];
        this._setupAttribution();
      }
    }

    this._mapboxGL = mapboxGLJSLayer({
      style: formatStyle(style, service, this.options.token),
      pane: this.options.pane,
      opacity: this.options.opacity,
      transformRequest: function (url, resourceType) {
        if (
          resourceType === 'Glyphs' ||
          resourceType === 'SpriteImage' ||
          resourceType === 'SpriteJSON'
        ) {
          return {
            url:
              url + (this.options.token ? '?token=' + this.options.token : '')
          };
        }

        return {
          url: url
        };
      }.bind(this)
    });

    this._ready = true;
    this.fire('ready', {}, true);
  },

  _setupAttribution: function () {
    var map = this._map;

    if (this._map && this.options.attributionUrls) {
      Util.setEsriAttribution(map);

      if (this._map.attributionControl) {
        for (
          let index = 0;
          index < this.options.attributionUrls.length;
          index++
        ) {
          const attributionUrl = this.options.attributionUrls[index];
          getAttributionData(attributionUrl, map);
        }

        map.attributionControl.addAttribution(
          '<span class="esri-dynamic-attribution"></span>'
        );
      }
      Util._updateMapAttribution({ target: this._map });
    }
  },

  onAdd: function (map) {
    this._map = map;

    this._setupAttribution();

    if (this.options.pane !== 'tilePane') {
      this._initPane();
    }

    if (this._ready) {
      this._asyncAdd();
    } else {
      this.once(
        'ready',
        function () {
          this._asyncAdd();
        },
        this
      );
    }
  },

  _initPane: function () {
    if (!this._map.getPane(this.options.pane)) {
      var pane = this._map.createPane(this.options.pane);
      pane.style.pointerEvents = 'none';
      pane.style.zIndex = this.options.pane === 'esri-labels' ? 550 : 500;
    }
  },

  onRemove: function (map) {
    map.off('moveend', Util._updateMapAttribution);
    map.removeLayer(this._mapboxGL);

    if (map.attributionControl) {
      var vectorAttribution = document.getElementsByClassName(
        'esri-dynamic-attribution'
      )[0].outerHTML;

      // this doesn't work, not sure why.
      map.attributionControl.removeAttribution(vectorAttribution);
    }
  },

  _asyncAdd: function () {
    var map = this._map;

    // set the background color of the map to the background color of the tiles
    if (this._mapboxGL.options.style.layers[0].type === 'background') {
      map.getContainer().style.background = this._mapboxGL.options.style.layers[0].paint['background-color'];
    }

    map.on('moveend', Util._updateMapAttribution);

    this._mapboxGL.addTo(map, this);
  }
});

export function vectorTileLayer (key, options) {
  return new VectorTileLayer(key, options);
}

export default VectorTileLayer;
