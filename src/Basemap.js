import L from 'leaflet';
import { Util } from 'esri-leaflet';
import { fetchMetadata } from './Util';

export var Basemap = L.Layer.extend({
  statics: {
    URLPREFIX: 'https://www.arcgis.com/sharing/rest/content/items/',
    URLSUFFIX: '/resources/styles/root.json',
    STYLES: {
      'DarkGray': '57436c01bc754dbb87dfb636b6484022',
      'Gray': '1e47168d181248e491541ffd5a91c0de',
      'Hybrid': 'af6063d6906c4eb589dfe03819610660',
      'Navigation': 'e19e9330bf08490ca8353d76b5e2e658',
      'Streets': 'a60a37a27cc140ddad15f919cd5a69f2',
      'StreetsNight': '92c551c9f07b4147846aae273e822714',
      'StreetsRelief': '78c0a9ab4fbf4198a8b951848aab19d8',
      'Topographic': '86d5ed4b6dc741de9dad5f0fbe09ae95',
      'Spring': '763884983d3544c0a418a97992881fce',
      'Newspaper': '4f4843d99c34436f82920932317893ae',
      'MidCentury': '267f44f08a844c7abee2b62b00600540',
      'ModernAntique': '996d9e7a3aac4514bb692ce7a990f1c1',
      'BlackAndWhite': '3161443179244702a5e0449010013b54'
    }
  },

  initialize: function (options) {
    // L.Layer expects a JSON object literal to be passed in constructor
    options = {
      key: options
    };

    if (typeof options.key === 'string' && Basemap.STYLES[options.key]) {
      var url = Basemap.URLPREFIX + Basemap.STYLES[options.key] + Basemap.URLSUFFIX;
      fetchMetadata(url, this);
    } else {
      throw new Error('L.esri.Vector.Basemap: Invalid parameter. Use one of "DarkGray", "Gray", "Hybrid", "Navigation", "Streets", "StreetsNight", "StreetsRelief", "Topographic"');
    }
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
