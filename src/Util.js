import { latLng, latLngBounds } from 'leaflet';
import { request, Support, Util } from 'esri-leaflet';

/*
  utility to establish a URL for the basemap styles API
  used primarily by VectorBasemapLayer.js
*/
export function getBasemapStyleUrl (key, apikey) {
  var url = 'https://basemaps-api.arcgis.com/arcgis/rest/services/styles/' + key + '?type=style';
  if (apikey) {
    url = url + '&apikey=' + apikey;
  }
  return url;
}

/*
  utilities to communicate with custom user styles via an ITEM ID or SERVICE URL
  used primarily by VectorTileLayer.js
*/
export function loadStyle (idOrUrl, options, callback) {
  var httpRegex = /^https?:\/\//;
  var serviceRegex = /\/VectorTileServer\/?$/;

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
        callback(error, style, itemStyleUrl, service, style.sources.esri.url);
      });
    }
  });
}

function loadStyleFromService (serviceUrl, options, callback) {
  loadService(serviceUrl, options, function (error, service) {
    if (error) {
      console.error(error);
    }

    var defaultStylesUrl;
    if (
      serviceUrl.charAt(0) !== '/' &&
      service.defaultStyles.charAt(service.defaultStyles.length - 1) !== '/'
    ) {
      defaultStylesUrl = serviceUrl + '/' + service.defaultStyles + '/root.json';
    } else {
      defaultStylesUrl = serviceUrl + service.defaultStyles + '/root.json';
    }

    loadStyleFromUrl(defaultStylesUrl, options, function (
      error,
      style
    ) {
      if (error) {
        console.error(error);
      }
      callback(null, style, defaultStylesUrl, service, serviceUrl);
    });
  });
}

function loadStyleFromUrl (styleUrl, options, callback) {
  var params = options.token ? { token: options.token } : {};
  request(styleUrl, params, callback);
}

export function formatStyle (style, styleUrl, metadata, token) {
  // transforms style object in place and also returns it

  // modify each source in style.sources
  var sourcesKeys = Object.keys(style.sources);
  for (var sourceIndex = 0; sourceIndex < sourcesKeys.length; sourceIndex++) {
    var source = style.sources[sourcesKeys[sourceIndex]];

    // if a relative path is referenced, the default style can be found in a standard location
    if (source.url.indexOf('http') === -1) {
      source.url = styleUrl.replace(
        '/resources/styles/root.json',
        ''
      );
    }

    // add tiles property if missing
    if (!source.tiles) {
      // right now ArcGIS Pro published vector services have a slightly different signature
      // the '/' is needed in the URL string concatenation below for source.tiles
      if (metadata.tiles && metadata.tiles[0].charAt(0) !== '/') {
        metadata.tiles[0] = '/' + metadata.tiles[0];
      }

      source.tiles = [
        source.url +
        metadata.tiles[0]
      ];
    }

    // add the token to the source url and tiles properties as a query param
    source.url += (token ? '?token=' + token : '');
    source.tiles[0] += (token ? '?token=' + token : '');

    // add minzoom and maxzoom to each source based on the service metadata
    source.minzoom = metadata.tileInfo.lods[0].level;
    source.maxzoom = metadata.tileInfo.lods[metadata.tileInfo.lods.length - 1].level;
  }

  // add the attribution and copyrightText properties to the last source in style.sources based on the service metadata
  var lastSource = style.sources[sourcesKeys[sourcesKeys.length - 1]];
  lastSource.attribution = metadata.copyrightText || '';
  lastSource.copyrightText = metadata.copyrightText || '';

  // if any layer in style.layers has a layout.text-font property (it will be any array of strings) remove all items in the array after the first
  for (var layerIndex = 0; layerIndex < style.layers.length; layerIndex++) {
    var layer = style.layers[layerIndex];
    if (layer.layout && layer.layout['text-font'] && layer.layout['text-font'].length > 1) {
      layer.layout['text-font'] = [layer.layout['text-font'][0]];
    }
  }

  // resolve absolute URLs for style.sprite and style.glyphs
  if (style.sprite.indexOf('http') === -1) {
    style.sprite = styleUrl.replace(
      'styles/root.json',
      style.sprite.replace('../', '')
    );
  }

  if (style.glyphs.indexOf('http') === -1) {
    style.glyphs = styleUrl.replace(
      'styles/root.json',
      style.glyphs.replace('../', '')
    );
  }

  // add the token to the style.sprite and style.glyphs properties as a query param
  style.sprite += (token ? '?token=' + token : '');
  style.glyphs += (token ? '?token=' + token : '');

  return style;
}

/*
  utility to assist with dynamic attribution data
  used primarily by VectorBasemapLayer.js
*/
export function getAttributionData (url, map) {
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
