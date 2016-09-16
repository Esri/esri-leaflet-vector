export { version as VERSION } from '../package.json';

import 'mapbox-gl-leaflet';
import 'mapbox-gl';

import { request, Util } from 'esri-leaflet';
import L from 'leaflet';

export var Basemap = L.Layer.extend({
  statics: {
    URLPREFIX: 'https://www.arcgis.com/sharing/rest/content/items/',
    URLSUFFIX: '/resources/styles/root.json',
    STYLES: {
      'DarkGray': '850db44b9eb845d3bd42b19e8aa7a024',
      'Gray': '0e02e6f86d02455091796eaae811d9b5',
      'Hybrid': '8fad42206b6d4efcbd02623dba4554e4',
      'Navigation': 'dcbbba0edf094eaa81af19298b9c6247',
      'Streets': '4e1133c28ac04cca97693cf336cd49ad',
      'StreetsNight': 'bf79e422e9454565ae0cbe9553cf6471',
      'StreetsRelief': '2e063e709e3446459f8538ed6743f879',
      'Topographic': '6f65bc1351b7411588a8cb43fe23dad7',
      'Spring': '763884983d3544c0a418a97992881fce',
      'Newspaper': '4f4843d99c34436f82920932317893ae',
      'MidCentury': '267f44f08a844c7abee2b62b00600540'
    }
  },

  initialize: function (options) {
    // L.Layer expects a JSON object literal to be passed in constructor
    options = {
      key: options
    };

    var url;

    if (typeof options.key === 'string' && Basemap.STYLES[options.key]) {
      url = Basemap.URLPREFIX + Basemap.STYLES[options.key] + Basemap.URLSUFFIX;
    } else {
      throw new Error('L.esri.Vector.Basemap: Invalid parameter. Use one of "DarkGray", "Gray", "Hybrid", "Navigation", "Streets", "StreetsNight", "StreetsRelief", "Topographic"');
    }

    request(url, {}, function (error, style) {
      if (!error) {
        request(style.sources.esri.url, {}, function (error, metadata) {
          if (!error) {
            style.sources.esri = {
              type: 'vector',
              scheme: 'xyz',
              tilejson: metadata.tilejson || '2.0.0',
              format: (metadata.tileInfo && metadata.tileInfo.format) || 'pbf',
              index: metadata.tileMap ? style.sources.esri.url + metadata.tileMap : null,
              tiles: [
                style.sources.esri.url + metadata.tiles[0]
              ],
              description: metadata.description,
              name: metadata.name
            };

            // set paths to sprite and glyphs
            style.glyphs = url.replace('styles/root.json', style.glyphs.replace('../', ''));
            style.sprite = url.replace('styles/root.json', style.sprite.replace('../', ''));

            // set index
            style.index = metadata.tileInfo.tileMap;

            this._mapboxGL = L.mapboxGL({
              accessToken: 'ezree',
              style: style
            });

            this._ready = true;
            this.fire('ready', {}, true);
          }
        }, this);
      } else {
        throw new Error('Unable to fetch vector tile style metadata');
      }
    }, this);
  },

  onAdd: function (map) {
    this._map = map;

    Util.setEsriAttribution(map);

    if (map.attributionControl) {
      // 95% sure this is the right static attribution url
      Util._getAttributionData('https://static.arcgis.com/attribution/World_Street_Map', map);
      map.attributionControl.addAttribution('<span class="esri-dynamic-attribution">USGS, NOAA</span>');
    }

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

    // set the background color of the map to the background color of the tiles
    map.getContainer().style.background = this._mapboxGL.options.style.layers[0].paint['background-color'];

    map.on('moveend', Util._updateMapAttribution);
    this._mapboxGL.addTo(map, this);
  }
});

export function basemap (key) {
  return new Basemap(key);
}

export default Basemap;
