/* eslint-env mocha */
// These must be vars (instead of const) due to how the unit tests are run:
var itemId = '287c07ef752246d08bb4712fd4b74438';
var apikey = '1234';
const basemapKey = 'ArcGIS:Streets';

describe('VectorBasemapLayer', function () {
  it('should have a L.esri.vectorBasemapLayer alias', function () {
    console.log('L.esri.Vector.vectorBasemapLayer', L.esri.Vector.vectorBasemapLayer);

    expect(L.esri.Vector.vectorBasemapLayer(itemId, {
      apikey: apikey
    })).to.be.instanceof(L.esri.Vector.VectorBasemapLayer);
  });

  it('should save the key from the constructor - itemID', function () {
    const layer = L.esri.Vector.vectorBasemapLayer(itemId, {
      apikey: apikey
    });

    expect(layer.options.key).to.equal(itemId);
  });

  it('should error if no api key or token', function () {
    expect(function () {
      L.esri.Vector.vectorBasemapLayer(basemapKey, {});
    }).to.throw('API Key or token is required for vectorBasemapLayer.');
  });

  it('should save the key from the constructor - enumeration basemap key', function () {
    const layer = L.esri.Vector.vectorBasemapLayer(basemapKey, {
      apikey: apikey
    });

    expect(layer.options.key).to.equal(basemapKey);
  });

  it('should save the api key from the constructor', function () {
    const layer = L.esri.Vector.vectorBasemapLayer(basemapKey, {
      apikey: apikey
    });

    expect(layer.options.apikey).to.equal(apikey);
  });

  it('should save the token as apikey from the constructor', function () {
    const layer = new L.esri.Vector.VectorBasemapLayer(basemapKey, {
      token: apikey
    });

    expect(layer.options.apikey).to.equal(apikey);
  });

  describe('_getAttributionUrls', function () {
    it('should handle OSM keys', function () {
      const key = 'OSM:Standard';
      const layer = new L.esri.Vector.VectorBasemapLayer(key, {
        token: apikey
      });
      const attributionUrls = layer._getAttributionUrls(key);
      expect(attributionUrls.length).to.equal(1);
      expect(attributionUrls[0]).to.equal('https://static.arcgis.com/attribution/Vector/OpenStreetMap_v2');
    });

    it('should handle ArcGIS Imagery keys', function () {
      const key = 'ArcGIS:Imagery';
      const layer = new L.esri.Vector.VectorBasemapLayer(key, {
        token: apikey
      });
      const attributionUrls = layer._getAttributionUrls(key);
      expect(attributionUrls.length).to.equal(2);
      expect(attributionUrls[0]).to.equal('https://static.arcgis.com/attribution/World_Imagery');
      expect(attributionUrls[1]).to.equal('https://static.arcgis.com/attribution/Vector/World_Basemap_v2');
    });

    it('should handle ArcGIS non-Imagery keys', function () {
      const key = 'ArcGIS:Streets';
      const layer = new L.esri.Vector.VectorBasemapLayer(key, {
        token: apikey
      });
      const attributionUrls = layer._getAttributionUrls(key);
      expect(attributionUrls.length).to.equal(1);
      expect(attributionUrls[0]).to.equal('https://static.arcgis.com/attribution/Vector/World_Basemap_v2');
    });
  });
});
