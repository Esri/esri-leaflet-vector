import { request } from 'esri-leaflet';

export function fetchMetadata (url, context) {
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

          // if urls are provided using relative paths, we need to qualify them
          if (style.glyphs.indexOf('http') === -1) {
            // set paths to sprite and glyphs
            style.glyphs = url.replace('styles/root.json', style.glyphs.replace('../', ''));
            style.sprite = url.replace('styles/root.json', style.sprite.replace('../', ''));
          }

          // set index
          style.index = metadata.tileInfo.tileMap;

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

export var Util = {
  fetchMetadata: fetchMetadata
};

export default Util;