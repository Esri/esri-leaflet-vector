import { latLng, latLngBounds } from 'leaflet';
import { request, Support, Util } from 'esri-leaflet';

export function loadStyle (idOrUrl, options, callback) {
  var httpRegex = /^https?:\/\//;
  var serviceRegex = /\/VectorTileService\/?$/;

  if (httpRegex.test(idOrUrl) && serviceRegex.test(idOrUrl)) {
    var serviceUrl = idOrUrl;
    loadStyleFromService(serviceUrl, options, callback);
  } else {
    var itemId = idOrUrl;
    loadStyleFromItem(itemId, options, callback);
  }
}

export function loadService (serviceUrl, options, callback) {
  var params = options.token ? { token: options.token } : {};
  request(serviceUrl, params, callback);
}

function loadItem (itemId, options, callback) {
  var params = options.token ? { token: options.token } : {};
  var url = 'https://www.arcgis.com/sharing/rest/content/items/' + itemId;
  request(url, params, callback);
}

function loadStyleFromItem (itemId, options, callback) {
  var itemStyleUrl =
    'https://www.arcgis.com/sharing/rest/content/items/' +
    itemId +
    '/resources/styles/root.json';

  loadStyleFromUrl(itemStyleUrl, options, function (error, style) {
    if (error) {
      loadItem(itemId, options, function (error, item) {
        if (error) {
          console.error(error);
        }
        loadStyleFromService(item.url, options, callback);
      });
    } else {
      loadService(style.sources.esri.url, options, function (error, service) {
        callback(error, style, service, style.sources.esri.url);
      });
    }
  });
}

function loadStyleFromService (serviceUrl, options, callback) {
  loadService(serviceUrl, options, function (error, service) {
    if (error) {
      console.error(error);
    }
    loadStyleFromUrl(serviceUrl + service.defaultStyles, options, function (
      error,
      style
    ) {
      if (error) {
        console.error(error);
      }
      callback(null, style, service, serviceUrl);
    });
  });
}

function loadStyleFromUrl (styleUrl, options, callback) {
  var params = options.token ? { token: options.token } : {};
  request(styleUrl, params, callback);
}

export function formatStyle (style, metadata, token) {
  var styleUrl = style.sources.esri.url;

  // if a relative path is referenced, the default style can be found in a standard location
  if (style.sources.esri.url && style.sources.esri.url.indexOf('http') === -1) {
    style.sources.esri.url = styleUrl.replace(
      '/resources/styles/root.json',
      ''
    );
  }

  // right now ArcGIS Pro published vector services have a slightly different signature
  if (metadata.tiles && metadata.tiles[0].charAt(0) !== '/') {
    metadata.tiles[0] = '/' + metadata.tiles[0];
  }

  style.sources.esri = {
    type: 'vector',
    scheme: 'xyz',
    tilejson: metadata.tilejson || '2.0.0',
    format: (metadata.tileInfo && metadata.tileInfo.format) || 'pbf',
    tiles: [
      style.sources.esri.url +
        metadata.tiles[0] +
        (token ? '?token=' + token : '')
    ],
    description: metadata.description,
    name: metadata.name
  };

  if (style.glyphs.indexOf('http') === -1) {
    // set paths to sprite and glyphs
    style.glyphs = styleUrl.replace(
      'styles/root.json',
      style.glyphs.replace('../', '')
    );

    style.sprite = styleUrl.replace(
      'styles/root.json',
      style.sprite.replace('../', '')
    );
  }

  return style;
}

export function getAttributionData(url, map) {
  if (Support.cors) {
    request(url, {}, function (error, attributions) {
      if (error) {
        return;
      }
      map._esriAttributions = map._esriAttributions || [];
      for (var c = 0; c < attributions.contributors.length; c++) {
        var contributor = attributions.contributors[c];

        for (var i = 0; i < contributor.coverageAreas.length; i++) {
          var coverageArea = contributor.coverageAreas[i];
          var southWest = latLng(coverageArea.bbox[0], coverageArea.bbox[1]);
          var northEast = latLng(coverageArea.bbox[2], coverageArea.bbox[3]);
          map._esriAttributions.push({
            attribution: contributor.attribution,
            score: coverageArea.score,
            bounds: latLngBounds(southWest, northEast),
            minZoom: coverageArea.zoomMin,
            maxZoom: coverageArea.zoomMax
          });
        }
      }

      map._esriAttributions.sort(function (a, b) {
        return b.score - a.score;
      });

      // pass the same argument as the map's 'moveend' event
      var obj = { target: map };
      Util._updateMapAttribution(obj);
    });
  }
}
