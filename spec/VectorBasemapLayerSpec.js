/* eslint-env mocha */

var itemId = "287c07ef752246d08bb4712fd4b74438";
var basemapKey = "ArcGIS:Streets";
var apiKey = '1234';

describe('VectorBasemapLayer', function () {

  it('should have a L.esri.vectorBasemapLayer alias', function () {
    console.log('L.esri.Vector.vectorBasemapLayer', L.esri.Vector.vectorBasemapLayer);

    expect(L.esri.Vector.vectorBasemapLayer(itemId, {
      apiKey: apiKey
    })).to.be.instanceof(L.esri.Vector.VectorBasemapLayer);
  });

  it('should save the key from the constructor - itemID', function () {

    const layer = L.esri.Vector.vectorBasemapLayer(itemId, {
      apiKey: apiKey
    });

    expect(layer.options.key).to.equal(itemId);
  });


  it('should error if no api key or token', function () {
    expect(function () {
      L.esri.Vector.vectorBasemapLayer(basemapKey, {});
    }).to.throw("API Key or token is required for vectorBasemapLayer.");
  });

  it('should save the key from the constructor - enumeration basemap key', function () {

    const layer = L.esri.Vector.vectorBasemapLayer(basemapKey, {
      apiKey: apiKey
    });

    expect(layer.options.key).to.equal(basemapKey);
  });

  it('should save the api key from the constructor', function () {

    const layer = L.esri.Vector.vectorBasemapLayer(basemapKey, {
      apiKey: apiKey
    });

    expect(layer.options.apiKey).to.equal(apiKey);
  });

  it('should save the token as apiKey from the constructor', function () {

    var layer = new L.esri.Vector.VectorBasemapLayer(basemapKey, {
      token: apiKey
    });

    expect(layer.options.apiKey).to.equal(apiKey);
  });

  describe('_getAttributionUrls', function () {
    it('should handle OSM keys', function () {
      var key = "OSM:Standard";
      var layer = new L.esri.Vector.VectorBasemapLayer(key, {
        token: apiKey
      });
      var attributionUrls = layer._getAttributionUrls(key);
      expect(attributionUrls.length).to.equal(1);
      expect(attributionUrls[0]).to.equal('https://static.arcgis.com/attribution/Vector/OpenStreetMap_v2');
    });

    it('should handle ArcGIS Imagery keys', function () {
      var key = "ArcGIS:Imagery";
      var layer = new L.esri.Vector.VectorBasemapLayer(key, {
        token: apiKey
      });
      var attributionUrls = layer._getAttributionUrls(key);
      expect(attributionUrls.length).to.equal(2);
      expect(attributionUrls[0]).to.equal('https://static.arcgis.com/attribution/World_Imagery');
      expect(attributionUrls[1]).to.equal('https://static.arcgis.com/attribution/Vector/World_Basemap_v2');
    });

    it('should handle ArcGIS non-Imagery keys', function () {
      var key = "ArcGIS:Streets";
      var layer = new L.esri.Vector.VectorBasemapLayer(key, {
        token: apiKey
      });
      var attributionUrls = layer._getAttributionUrls(key);
      expect(attributionUrls.length).to.equal(1);
      expect(attributionUrls[0]).to.equal('https://static.arcgis.com/attribution/Vector/World_Basemap_v2');
    });
  });


});
