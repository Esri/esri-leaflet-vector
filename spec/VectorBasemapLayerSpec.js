/* eslint-env mocha */
const itemId = '287c07ef752246d08bb4712fd4b74438';
const apikey = '1234';
const basemapKey = 'ArcGIS:Streets';
const basemapKeyV2 = 'arcgis/streets';
const customBasemap = 'f04f33b9626240f084cb52f0b08758ef'
const language = 'zh_s';

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
    const layer = new L.esri.Vector.vectorBasemapLayer(basemapKey, {
      token: apikey
    });

    expect(layer.options.apikey).to.equal(apikey);
  });

  it('should save the service version from the constructor', function () {
    const layer = new L.esri.Vector.vectorBasemapLayer(basemapKeyV2, {
      apikey: apikey,
      version:2
    });

    expect(layer.options.version).to.equal(2);
  });

  it('should set the service version to \'1\' when a version is not provided', function () {
    const layer = new L.esri.Vector.vectorBasemapLayer(basemapKey, {
      apikey: apikey
    })

    expect(layer.options.version).to.equal(1);
  });

  it('should save the language from the constructor', function () {
    const layer = new L.esri.Vector.vectorBasemapLayer(basemapKeyV2, {
      apikey: apikey,
      version:2,
      language:language
    })

    expect(layer.options.language).to.equal(language);
  });

  it('should error if a language is provided when accessing the v1 service', function () {
    expect(function () {
      L.esri.Vector.vectorBasemapLayer(basemapKey, {
        apikey:apikey,
        language:language
      });
    }).to.throw('The language parameter is only supported by the basemap styles service v2. Set version:2 to use this property.');
  });

  it('should not accept a v2 style enumeration when accessing the v1 service', function () {
    expect(function () {
      L.esri.Vector.vectorBasemapLayer(basemapKeyV2, {
        apikey:apikey
      });
    }).to.throw(basemapKeyV2 + ' is a v2 style enumeration. Set version:2 to request this style')
  })

  it('should not accept a v1 style enumeration when accessing the v2 service', function () {
    expect(function () {
      L.esri.Vector.vectorBasemapLayer(basemapKey, {
        apikey:apikey,
        version:2
      });
    }).to.throw(basemapKey + ' is a v1 style enumeration. Set version:1 to request this style')
  })

  it('should load a custom basemap style from an item ID when using the v1 service', function () {
    const customLayer =  L.esri.Vector.vectorBasemapLayer(customBasemap, {
      apikey:apikey,
      version:1
    })
    expect(customLayer._maplibreGL.options.style).to.equal(`https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${customBasemap}?type=style&token=${apikey}`)
  })

  it('should load a custom basemap style from an item ID when using the v2 service', function () {
    const customLayer =  L.esri.Vector.vectorBasemapLayer(customBasemap, {
      apikey:apikey,
      version:2
    })
    expect(customLayer._maplibreGL.options.style).to.equal(`https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/items/${customBasemap}?token=${apikey}`)
  })

  it('should error if a language is provided when loading a custom basemap style', function () {
    expect(function () {
      L.esri.Vector.vectorBasemapLayer(customBasemap, {
        apikey,apikey,
        version:2,
        language:language
      })
    }).to.throw('The \'language\' parameter is not supported for custom basemap styles')
  })

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
