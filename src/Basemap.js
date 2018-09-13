import L from 'leaflet';
import { Util } from 'esri-leaflet';
import { fetchMetadata } from './Util';

export var Basemap = L.Layer.extend({
  statics: {
    URLPREFIX: 'https://www.arcgis.com/sharing/rest/content/items/',
    URLSUFFIX: '/resources/styles/root.json',
    STYLES: {
      'OpenStreetMap': '3e1a00aeae81496587988075fe529f71',
      // v2
      'Streets': 'de26a3cf4cc9451298ea173c4b324736',
      'StreetsRelief': 'b266e6d17fc345b498345613930fbd76',
      // 7dc6cea0b1764a1f9af2e679f642f0f5 doesnt pass validation
      'Topographic': '7a6bf0e8cb5a418085e66c0485e74d19',
      // 86f556a2d1fd468181855a35e344567f doesnt pass validation
      'StreetsNight': '93554006894c45a88136127535878fca',
      'Newspaper': 'dfb04de5f3144a80bc3f9f336228d24a',
      'Navigation': '63c47b7177f946b49902c24129b87252',
      'Nova': '75f4dfdff19e445395653121a95a85db',
      'ColoredPencil': '4cf7e1fb9f254dcda9c8fbadb15cf0f8',
      'Hybrid': '30d6b8271e1849cd9c3042060001f425',
      'Gray': '291da5eab3a0412593b66d384379f89f', // no labels
      'DarkGray': '5e9b3685f4c24d8781073dd928ebda50', // no labels
      'HumanGeography': '2afe5b807fa74006be6363fd243ffb30', // no labels
      'HumanGeographyDetail': '97fa1365da1e43eabb90d0364326bc2d', // no labels
      'DarkHumanGeography': 'd7397603e9274052808839b70812be50' // no labels
      // 'ModernAntique': 'effe3475f05a4d608e66fd6eeb2113c0', // throws mismatched image size error
    }
  },

  initialize: function (options) {
    // L.Layer expects a JSON object literal to be passed in constructor
    options = {
      key: options
    };

    this._basemap = options.key;

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
      if (this._basemap === 'OpenStreetMap') {
        map.attributionControl.setPrefix('<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');
        map.attributionControl.addAttribution('<span class="esri-dynamic-attribution">&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, map layer by Esri</span>');
      } else {
        Util._getAttributionData('https://static.arcgis.com/attribution/World_Street_Map', map);
        map.attributionControl.addAttribution('<span class="esri-dynamic-attribution">USGS, NOAA</span>');
      }
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
    // thought it was just me, but apparently its not easy to mixin two different styles
    // https://github.com/mapbox/mapbox-gl-js/issues/4000

    // set the background color of the map to the background color of the tiles
    map.getContainer().style.background = this._mapboxGL.options.style.layers[0].paint['background-color'];

    map.on('moveend', Util._updateMapAttribution);
    this._mapboxGL.addTo(map, this);
    // map._gl = this._mapboxGL;
  }
});

export function basemap (key) {
  return new Basemap(key);
}

export default Basemap;
