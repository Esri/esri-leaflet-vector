import {latLng, latLngBounds} from 'leaflet';
import {request, Support, Util} from 'esri-leaflet';

/*
  utility to establish a URL for the basemap styles API
  used primarily by VectorBasemapLayer.js
*/
export function getBasemapStyleUrl(style, apikey) {
	if (style.includes('/')) {
		throw new Error(
			`${style  } is a v2 style enumeration. Set version:2 to request this style`
		);
	}

	let url =
    `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${style}?type=style`;
	if (apikey) {
		url = `${url  }&token=${  apikey}`;
	}
	return url;
}

/**
 * Utility to establish a URL for the basemap styles API v2
 *
 * @param {string} style
 * @param {string} token
 * @param {Object} [options] Optional list of options: language, worldview, or places.
 * @returns {string} the URL
 */
export function getBasemapStyleV2Url(style, token, options) {
	if (style.startsWith('osm/')) {
		console.log(
			'L.esri.Vector.vectorBasemapLayer: All \'osm/*\' styles are retired are no longer receiving updates and were last updated in 2024. Please use \'open/*\' styles instead.'
		);
	}

	if (style.includes(':')) {
		throw new Error(
			`${style  } is a v1 style enumeration. Set version:1 to request this style`
		);
	}

	let url =
    options.baseUrl ||
    'https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/';

	if (
		!(
			style.startsWith('open/') ||
      style.startsWith('osm/') ||
      style.startsWith('arcgis/')
		) &&
    style.length === 32
	) {
		// style is an itemID
		url = `${url  }items/${  style}`;

		if (options.language) {
			throw new Error(
				'The \'language\' parameter is not supported for custom basemap styles'
			);
		}
	} else {
		url = url + style;
	}

	if (!token) { throw new Error('A token is required to access basemap styles.'); }

	url = `${url  }?token=${  token}`;
	if (options.language) {
		url = `${url  }&language=${  options.language}`;
	}
	if (options.worldview) {
		url = `${url  }&worldview=${  options.worldview}`;
	}
	if (options.places) {
		url = `${url  }&places=${  options.places}`;
	}
	return url;
}
/*
  utilities to communicate with custom user styles via an ITEM ID or SERVICE URL
  used primarily by VectorTileLayer.js
*/
export function loadStyle(idOrUrl, options, callback) {
	const httpRegex = /^https?:\/\//;
	const serviceRegex = /\/VectorTileServer\/?$/;

	if (httpRegex.test(idOrUrl) && serviceRegex.test(idOrUrl)) {
		const serviceUrl = idOrUrl;
		loadStyleFromService(serviceUrl, options, callback);
	} else {
		const itemId = idOrUrl;
		loadStyleFromItem(itemId, options, callback);
	}
}

export function loadService(serviceUrl, options, callback) {
	const params = options.token ? {token: options.token} : {};
	request(serviceUrl, params, callback);
}

function loadItem(itemId, options, callback) {
	const params = options.token ? {token: options.token} : {};
	const url = `${options.portalUrl  }/sharing/rest/content/items/${  itemId}`;
	request(url, params, callback);
}

function loadStyleFromItem(itemId, options, callback) {
	const itemStyleUrl = toCdnUrl(
		`${options.portalUrl
		}/sharing/rest/content/items/${
			itemId
		}/resources/styles/root.json`
	);

	loadStyleFromUrl(itemStyleUrl, options, (error, style) => {
		if (error) {
			loadItem(itemId, options, (error, item) => {
				if (error) {
					callback(error);
					return;
				}
				loadStyleFromService(item.url, options, callback);
			});
		} else {
			loadItem(itemId, options, (error, item) => {
				if (error) {
					callback(error);
					return;
				}
				loadService(item.url, options, (error, service) => {
					callback(error, style, itemStyleUrl, service, item.url);
				});
			});
		}
	});
}

function loadStyleFromService(serviceUrl, options, callback) {
	loadService(serviceUrl, options, (error, service) => {
		if (error) {
			callback(error);
			return;
		}

		let sanitizedServiceUrl = serviceUrl;
		// a trailing "/" may create invalid paths
		if (serviceUrl.charAt(serviceUrl.length - 1) === '/') {
			sanitizedServiceUrl = serviceUrl.slice(0, serviceUrl.length - 1);
		}

		let defaultStylesUrl;
		// inadvertently inserting more than 1 adjacent "/" may create invalid paths
		if (service.defaultStyles.charAt(0) === '/') {
			defaultStylesUrl =
        `${sanitizedServiceUrl + service.defaultStyles  }/root.json`;
		} else {
			defaultStylesUrl =
        `${sanitizedServiceUrl  }/${  service.defaultStyles  }/root.json`;
		}

		loadStyleFromUrl(defaultStylesUrl, options, (error, style) => {
			if (error) {
				callback(error);
				return;
			}
			callback(null, style, defaultStylesUrl, service, serviceUrl);
		});
	});
}

function loadStyleFromUrl(styleUrl, options, callback) {
	const params = options.token ? {token: options.token} : {};
	request(styleUrl, params, callback);
}

function isSameTLD(url1, url2) {
	return new URL(url1).hostname === new URL(url2).hostname;
}

/**
 * Converts an ArcGIS Online URL to a CDN URL to reduce latency and server load. This will not
 * convert a ArcGIS Enterprise URL since they will be hosting their own resources.
 *
 * Borrowed from the JS API.
 */
function toCdnUrl(url) {
	if (!url) {
		return url || null;
	}

	let outUrl = url;

	if (outUrl) {
		outUrl = normalizeArcGISOnlineOrgDomain(outUrl);
		outUrl = outUrl.replace(
			/^https?:\/\/www\.arcgis\.com/,
			'https://cdn.arcgis.com'
		);
		outUrl = outUrl.replace(
			/^https?:\/\/devext\.arcgis\.com/,
			'https://cdndev.arcgis.com'
		);
		outUrl = outUrl.replace(
			/^https?:\/\/qaext\.arcgis\.com/,
			'https://cdnqa.arcgis.com'
		);
	}

	return outUrl;
}

/**
 * Replaces the AGOL org domains with non-org domains.
 *
 * Borrowed from the JS API.
 */
function normalizeArcGISOnlineOrgDomain(url) {
	const prdOrg = /^https?:\/\/(?:cdn|[a-z\d-]+\.maps)\.arcgis\.com/i; // https://cdn.arcgis.com or https://x.maps.arcgis.com
	const devextOrg =
    /^https?:\/\/(?:cdndev|[a-z\d-]+\.mapsdevext)\.arcgis\.com/i; // https://cdndev.arcgis.com or https://x.mapsdevext.arcgis.com
	const qaOrg = /^https?:\/\/(?:cdnqa|[a-z\d-]+\.mapsqa)\.arcgis\.com/i; // https://cdnqa.arcgis.com or https://x.mapsqa.arcgis.com

	// replace AGOL org domains with non-org domains
	if (prdOrg.test(url)) {
		url = url.replace(prdOrg, 'https://www.arcgis.com');
	} else if (devextOrg.test(url)) {
		url = url.replace(devextOrg, 'https://devext.arcgis.com');
	} else if (qaOrg.test(url)) {
		url = url.replace(qaOrg, 'https://qaext.arcgis.com');
	}

	return url;
}

export function formatStyle(style, styleUrl, metadata, token) {
	// transforms style object in place and also returns it

	// modify each source in style.sources
	const sourcesKeys = Object.keys(style.sources);

	for (let sourceIndex = 0; sourceIndex < sourcesKeys.length; sourceIndex++) {
		const source = style.sources[sourcesKeys[sourceIndex]];

		// if a relative path is referenced, the default style can be found in a standard location
		if (source.url.indexOf('http') === -1) {
			source.url = styleUrl.replace('/resources/styles/root.json', '');
		}

		// a trailing "/" may create invalid paths
		if (source.url.charAt(source.url.length - 1) === '/') {
			source.url = source.url.slice(0, source.url.length - 1);
		}

		// add tiles property if missing
		if (!source.tiles) {
			// right now ArcGIS Pro published vector services have a slightly different signature
			// the '/' is needed in the URL string concatenation below for source.tiles
			if (metadata.tiles && metadata.tiles[0].charAt(0) !== '/') {
				metadata.tiles[0] = `/${  metadata.tiles[0]}`;
			}

			source.tiles = [source.url + metadata.tiles[0]];
		}

		// some VectorTileServer endpoints may default to returning f=html,
		// specify f=json to account for that behavior
		source.url += '?f=json';

		// add the token to the source url and tiles properties as a query param
		source.url += token ? `&token=${  token}` : '';
		source.tiles[0] += token ? `?token=${  token}` : '';
		// add minzoom and maxzoom to each source based on the service metadata
		// prefer minLOD/maxLOD if it exists since that is the level that tiles are cooked too
		// MapLibre will overzoom for LODs that are not cooked
		source.minzoom = metadata.minLOD || metadata.tileInfo.lods[0].level;
		source.maxzoom =
      metadata.maxLOD ||
      metadata.tileInfo.lods[metadata.tileInfo.lods.length - 1].level;
	}

	// add the attribution and copyrightText properties to the last source in style.sources based on the service metadata
	const lastSource = style.sources[sourcesKeys[sourcesKeys.length - 1]];
	lastSource.attribution = metadata.copyrightText || '';
	lastSource.copyrightText = metadata.copyrightText || '';

	// if any layer in style.layers has a layout.text-font property (it will be any array of strings) remove all items in the array after the first
	for (let layerIndex = 0; layerIndex < style.layers.length; layerIndex++) {
		const layer = style.layers[layerIndex];
		if (
			layer.layout &&
      layer.layout['text-font'] &&
      layer.layout['text-font'].length > 1
		) {
			layer.layout['text-font'] = [layer.layout['text-font'][0]];
		}
	}

	if (style.sprite && style.sprite.indexOf('http') === -1) {
		// resolve absolute URL for style.sprite
		style.sprite = styleUrl.replace(
			'styles/root.json',
			style.sprite.replace('../', '')
		);
	}

	// Convert the style.glyphs and style.sprite URLs to CDN URLs if possable
	if (style.glyphs) {
		style.glyphs = toCdnUrl(style.glyphs);
	}

	if (style.sprite) {
		style.sprite = toCdnUrl(style.sprite);
	}

	// a trailing "/" may create invalid paths
	if (style.sprite && token) {
		// add the token to the style.sprite property as a query param, only if same domain (for token security)
		if (isSameTLD(styleUrl, style.sprite)) {
			style.sprite += `?token=${  token}`;
		} else {
			console.warn(
				'Passing a token but sprite URL is not on same base URL, so you must pass the token manually.'
			);
		}
	}

	if (style.glyphs && style.glyphs.indexOf('http') === -1) {
		// resolve absolute URL for style.glyphs
		style.glyphs = styleUrl.replace(
			'styles/root.json',
			style.glyphs.replace('../', '')
		);
	}

	if (style.glyphs && token) {
		// add the token to the style.glyphs property as a query param
		if (isSameTLD(styleUrl, style.glyphs)) {
			style.glyphs += `?token=${  token}`;
		} else {
			console.warn(
				'Passing a token but glyph URL is not on same base URL, so you must pass the token manually.'
			);
		}
	}

	return style;
}

/*
  utility to assist with dynamic attribution data
  used primarily by VectorBasemapLayer.js
*/
export function getAttributionData(url, map) {
	if (Support.cors) {
		request(url, {}, (error, attributions) => {
			if (error) {
				return;
			}
			map._esriAttributions = map._esriAttributions || [];
			for (let c = 0; c < attributions.contributors.length; c++) {
				const contributor = attributions.contributors[c];

				for (let i = 0; i < contributor.coverageAreas.length; i++) {
					const coverageArea = contributor.coverageAreas[i];
					const southWest = latLng(coverageArea.bbox[0], coverageArea.bbox[1]);
					const northEast = latLng(coverageArea.bbox[2], coverageArea.bbox[3]);
					map._esriAttributions.push({
						attribution: contributor.attribution,
						score: coverageArea.score,
						bounds: latLngBounds(southWest, northEast),
						minZoom: coverageArea.zoomMin,
						maxZoom: coverageArea.zoomMax
					});
				}
			}

			map._esriAttributions.sort((a, b) => b.score - a.score);

			// pass the same argument as the map's 'moveend' event
			const obj = {target: map};
			Util._updateMapAttribution(obj);
		});
	}
}

/*
  utility to check if a service's tileInfo spatial reference is in Web Mercator
  used primarily by VectorTileLayer.js
*/
const WEB_MERCATOR_WKIDS = [3857, 102100, 102113];

export function isWebMercator(wkid) {
	return WEB_MERCATOR_WKIDS.indexOf(wkid) >= 0;
}

export const EsriUtil = {
	formatStyle
};

export default EsriUtil;
