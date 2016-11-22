import L from 'leaflet';
import { request, Util } from 'esri-leaflet';
import { fetchMetadata, formatStyle } from './Util';

export var Layer = L.Layer.extend({
  statics: {
    URLPREFIX: 'https://www.arcgis.com/sharing/rest/content/items/'
  },

  initialize: function (options) {
    // L.Layer expects a JSON object literal to be passed in constructor
    options = {
      id: options
    };

    if (typeof options.id === 'string') {
      var itemMetadataUrl = Layer.URLPREFIX + options.id;
      var tileUrl;
      var styleUrl;

      request(itemMetadataUrl, {}, function (error, metadata) {
        if (!error) {
          tileUrl = metadata.url;

          // custom tileset published using ArcGIS Pro
          if (tileUrl.indexOf('basemaps.arcgis.com') === -1) {
            this._customTileset = true;
            // if copyright info was published, display it.
            if (metadata.accessInformation) {
              this._copyrightText = metadata.accessInformation;
            }
            request(tileUrl, {}, function (error, tileMetadata) {
              if (!error) {
                // right now ArcGIS Pro published vector services have a slightly different signature
                if (tileMetadata.defaultStyles.charAt(0) !== '/') {
                  tileMetadata.defaultStyles = '/' + tileMetadata.defaultStyles;
                }

                styleUrl = tileUrl + tileMetadata.defaultStyles + '/root.json';
                request(styleUrl, {}, function (error, style) {
                  if (!error) {
                    formatStyle(style, tileMetadata, styleUrl);

                    this._mapboxGL = L.mapboxGL({
                      accessToken: 'ezree',
                      style: style
                    });

                    this._ready = true;
                    this.fire('ready', {}, true);
                  }
                }, this);
              }
            }, this);
          } else {
            // custom symbology applied to hosted basemap tiles
            fetchMetadata(itemMetadataUrl + '/resources/styles/root.json', this);
          }
        }
      }, this);
    } else {
      throw new Error('L.esri.Vector.Layer: Invalid parameter. Use the id of an ArcGIS Online vector tile item');
    }
  },

  onAdd: function (map) {
    this._map = map;
    Util.setEsriAttribution(map);

    if (this._ready) {
      this._asyncAdd();
    } else {
      this.once('ready', function () {
        this._asyncAdd();
      }, this);
    }
  },

  onRemove: function (map) {
    map.off('moveend', Util._updateMapAttribution);
    map.removeLayer(this._mapboxGL);

    if (map.attributionControl) {
      var vectorAttribution = document.getElementsByClassName('esri-dynamic-attribution')[0].outerHTML;
      // this doesn't work, not sure why.
      map.attributionControl.removeAttribution(vectorAttribution);
    }
  },

  _asyncAdd: function () {
    var map = this._map;
    if (map.attributionControl) {
      if (this._customTileset) {
        if (this._copyrightText) {
          // pull static copyright text for services published with Pro
          map.attributionControl.addAttribution('<span class="esri-dynamic-attribution">' + this._copyrightText + '</span>');
        }
      } else {
        // provide dynamic attribution for Esri basemaps
        Util._getAttributionData('https://static.arcgis.com/attribution/World_Street_Map', map);
        map.attributionControl.addAttribution('<span class="esri-dynamic-attribution">USGS, NOAA</span>');
        map.on('moveend', Util._updateMapAttribution);
      }
    }

    // set the background color of the map to the background color of the tiles
    map.getContainer().style.background = this._mapboxGL.options.style.layers[0].paint['background-color'];
    this._mapboxGL.addTo(map, this);
  }
});

export function layer (id) {
  return new Layer(id);
}

export default Layer;
