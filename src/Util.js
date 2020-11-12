import { latLng, latLngBounds } from "leaflet";
import { request, Support, Util } from "esri-leaflet";

export function getBasemapStyleUrl(key, apiKey) {
  var url = "https://basemapsdev-api-nocdn.arcgis.com/styles/" + key;
  if (apiKey) {
    url = url + "?apiKey=" + apiKey;
  }
  return url;
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
            maxZoom: coverageArea.zoomMax,
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
