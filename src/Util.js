import L from 'leaflet';
import 'mapbox-gl';
import 'mapbox-gl-leaflet';
import { request } from 'esri-leaflet';

export function fetchMetadata (url, context) {
  request(url, {}, function (error, style) {
    if (!error) {
      request(style.sources.esri.url, {}, function (error, tileMetadata) {
        if (!error) {
          formatStyle(style, tileMetadata, url);
          context._mapboxGL = L.mapboxGL({
            accessToken: 'ezree',
            style: style
          });

          context._ready = true;
          context.fire('ready', {}, true);
        }
      }, context);
    } else {
      throw new Error('Unable to fetch vector tile style metadata');
    }
  }, context);
}

export function formatStyle (style, metadata, styleUrl, rasterBasemap) {
  // if a relative path is referenced, the default style can be found in a standard location
  if (style.sources.esri.url && style.sources.esri.url.indexOf('http') === -1) {
    style.sources.esri.url = styleUrl.replace('/resources/styles/root.json', '');
  }

  // right now ArcGIS Pro published vector services have a slightly different signature
  if (metadata.tiles && metadata.tiles[0].charAt(0) !== '/') {
    metadata.tiles[0] = '/' + metadata.tiles[0];
  }

  if (metadata.tileMap && metadata.tileMap.charAt(0) !== '/') {
    metadata.tileMap = '/' + metadata.tileMap;
  }

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
    name: metadata.name,
    maxzoom: metadata.maxzoom
  };

  var rasterBasemaps = {
    'esri-streets': {
      url: 'https://{subDomain}.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      subdomains: ['services', 'server']
    },
    'esri-satellite': {
      url: 'https://{subDomain}.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      subdomains: ['services', 'server']
    },
    'esri-hybrid': {
      url: 'https://{subDomain}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      subdomains: ['services', 'server']
    },
    'esri-topo': {
      url: 'https://{subDomain}.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      subdomains: ['services', 'server']
    },
    'esri-gray': {
      url: 'https://{subDomain}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      subdomains: ['services', 'server']
    },
    'esri-dark-gray': {
      url: 'https://{subDomain}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      subdomains: ['services', 'server']
    },
    'esri-oceans': {
      url: 'https://{subDomain}.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}',
      subdomains: ['services', 'server']
    },
    'esri-national-geographic': {
      url: 'https://{subDomain}.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
      subdomains: ['services', 'server']
    },
    'esri-terrain': {
      url: 'https://{subDomain}.arcgisonline.com/arcgis/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}',
      subdomains: ['services', 'server']
    },
    'mapbox-outdoors': {
      url: 'http://{subDomain}.tiles.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2hhZGMiLCJhIjoiZjRUSnJTYyJ9.gUL3T1N9m_twjfHArn-UNw',
      subdomains: ['a', 'b', 'c', 'd']
    },
    'mapbox-dark': {
      url: 'http://{subDomain}.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2hhZGMiLCJhIjoiZjRUSnJTYyJ9.gUL3T1N9m_twjfHArn-UNw',
      subdomains: ['a', 'b', 'c', 'd']
    },
    'mapbox-pirates': {
      url: 'http://{subDomain}.tiles.mapbox.com/v4/mapbox.pirates/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2hhZGMiLCJhIjoiZjRUSnJTYyJ9.gUL3T1N9m_twjfHArn-UNw',
      subdomains: ['a', 'b', 'c', 'd']
    },
    'mapbox-satellite': {
      url: 'http://{subDomain}.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2hhZGMiLCJhIjoiZjRUSnJTYyJ9.gUL3T1N9m_twjfHArn-UNw',
      subdomains: ['a', 'b', 'c', 'd']
    },
    'mapbox-run-bike-hike': {
      url: 'http://{subDomain}.tiles.mapbox.com/v4/mapbox.run-bike-hike/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2hhZGMiLCJhIjoiZjRUSnJTYyJ9.gUL3T1N9m_twjfHArn-UNw',
      subdomains: ['a', 'b', 'c', 'd']
    },
    'stamen-watercolor': {
      url: 'http://{subDomain}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
      subdomains: ['a', 'b', 'c', 'd']
    },
    'open-cycle-map': {
      url: 'http://{subDomain}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c']
    },
    'open-street-map': {
      url: 'http://{subDomain}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c']
    }
  };

  if (rasterBasemap) {
    style.sources.basemap = {
      type: 'raster',
      tileSize: 256
    };

    var basemap = rasterBasemaps[rasterBasemap];
    var tiles = [];
    for (var i = 0, len = basemap.subdomains.length; i < len; i++) {
      tiles.push(basemap.url.replace('{subDomain}', basemap.subdomains[i]));
    }
    style.sources.basemap.tiles = tiles;

    style.layers.unshift({
      id: 'basemap',
      type: 'raster',
      source: 'basemap'
    });
  }

  if (style.glyphs.indexOf('http') === -1) {
    // set paths to sprite and glyphs
    style.glyphs = styleUrl.replace('styles/root.json', style.glyphs.replace('../', ''));
    style.sprite = styleUrl.replace('styles/root.json', style.sprite.replace('../', ''));
  }
}

export var Util = {
  fetchMetadata: fetchMetadata,
  formatStyle: formatStyle
};

export default Util;
