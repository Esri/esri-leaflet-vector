/* eslint-env mocha */

describe('VectorTileLayer', function () {
  // These must be vars (instead of const) due to how the unit tests are run:
  const itemId = '1c365daf37a744fbad748b67aa69dac8';
  const apikey = 'dcba4321';
  const serviceUrl =
    'https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Microsoft_Building_Footprints/VectorTileServer';
  const token = '1234abcd';
  let server;

  // for layers hosted in ArcGIS Enterprise instead of ArcGIS Online
  const onPremisePortalUrl = 'https://PATH/TO/ARCGIS/ENTERPRISE'; // defaults to https://www.arcgis.com
  const onPremiseItemId = '1c365daf37a744fbad748b67aa69dac8';
  const onPremiseServiceUrl =
    'https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Microsoft_Building_Footprints/VectorTileServer';

  beforeEach(function () {
    server = sinon.fakeServer.create();
  });

  afterEach(function () {
    server.restore();
    map = null;
    sinon.restore();
  });

  it('should have a L.esri.vectorTileLayer alias', function () {
    console.log('L.esri.Vector.vectorTileLayer', L.esri.Vector.vectorTileLayer);

    expect(L.esri.Vector.vectorTileLayer(itemId)).to.be.instanceof(
      L.esri.Vector.VectorTileLayer
    );
  });

  it('should save the key from the constructor - itemId', function () {
    const layer = L.esri.Vector.vectorTileLayer(itemId);

    expect(layer.options.key).to.equal(itemId);
  });

  it('should save the key from the constructor - serviceUrl', function () {
    const layer = L.esri.Vector.vectorTileLayer(serviceUrl);

    expect(layer.options.key).to.equal(serviceUrl);
  });

  it('should error if no key itemId or serviceUrl', function () {
    expect(function () {
      L.esri.Vector.vectorTileLayer();
    }).to.throw('An ITEM ID or SERVICE URL is required for vectorTileLayer.');

    expect(function () {
      L.esri.Vector.vectorTileLayer(false, {});
    }).to.throw('An ITEM ID or SERVICE URL is required for vectorTileLayer.');
  });

  it('should save the token from the constructor', function () {
    const layer = new L.esri.Vector.VectorTileLayer(itemId, {
      token: token
    });

    expect(layer.options.token).to.equal(token);
  });

  it('should save the api key as token from the constructor', function () {
    const layer = L.esri.Vector.vectorTileLayer(itemId, {
      apikey: apikey
    });

    expect(layer.options.token).to.equal(apikey);
  });

  it('should default to the "overlayPane"', function () {
    const layer = L.esri.Vector.vectorTileLayer(itemId);

    expect(layer.options.pane).to.equal('overlayPane');
  });

  it('should let the default pane be changed in the constructor', function () {
    const otherPane = 'shadowPane';
    const layer = L.esri.Vector.vectorTileLayer(itemId, {
      pane: otherPane
    });

    expect(layer.options.pane).to.equal(otherPane);
  });

  it('should default to ArcGIS Online as the base "portalUrl" for loading the style - itemId', function () {
    const layer = L.esri.Vector.vectorTileLayer(itemId);

    expect(layer.options.portalUrl).to.equal('https://www.arcgis.com');
  });

  it('should default to ArcGIS Online as the base "portalUrl" for loading the style - serviceUrl', function () {
    const layer = L.esri.Vector.vectorTileLayer(serviceUrl);

    expect(layer.options.portalUrl).to.equal('https://www.arcgis.com');
  });

  it('should let the base "portalUrl" be changed in the constructor for loading an on-premise style - itemId', function () {
    const layer = L.esri.Vector.vectorTileLayer(onPremiseItemId, {
      portalUrl: onPremisePortalUrl
    });

    expect(layer.options.portalUrl).to.equal(onPremisePortalUrl);
  });

  it('should let the base "portalUrl" be changed in the constructor for loading an on-premise style - serviceUrl', function () {
    const layer = L.esri.Vector.vectorTileLayer(onPremiseServiceUrl, {
      portalUrl: onPremisePortalUrl
    });

    expect(layer.options.portalUrl).to.equal(onPremisePortalUrl);
  });

  it('should emit load-error for invalid itemID', function (done) {
    server.respondWith(
      'GET',
      'https://esri.maps.arcgis.com/sharing/rest/content/items/75f4dfdff19e445395653121a95a85db_WRONG/resources/styles/root.json?f=json',
      JSON.stringify({
        error: {
          code: 400,
          messageCode: 'CONT_0001',
          message: 'Item does not exist or is inaccessible.',
          details: []
        }
      })
    );

    server.respondWith(
      'GET',
      'https://esri.maps.arcgis.com/sharing/rest/content/items/75f4dfdff19e445395653121a95a85db_WRONG?f=json',
      JSON.stringify({
        error: {
          code: 400,
          messageCode: 'CONT_0001',
          message: 'Item does not exist or is inaccessible.',
          details: []
        }
      })
    );

    const layer = new L.esri.Vector.vectorTileLayer(
      '75f4dfdff19e445395653121a95a85db_WRONG',
      {
        portalUrl: 'https://esri.maps.arcgis.com'
      }
    );
    layer.on('load-error', function (e) {
      expect(e.type).to.equal('load-error');
      done();
    });
    server.respond();
    server.respond();
  });

  it('should emit load-error for bad service url', function (done) {
    server.respondWith(
      'GET',
      'https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Microsoft_Building_Footprints_WRONG/VectorTileServer?f=json',
      JSON.stringify({
        error: {
          code: 404,
          message: 'Requested Service not available.',
          details: null
        }
      })
    );

    const layer = new L.esri.Vector.vectorTileLayer(
      'https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Microsoft_Building_Footprints_WRONG/VectorTileServer'
    );
    layer.on('load-error', function (e) {
      expect(e.type).to.equal('load-error');
      done();
    });
    server.respond();
  });
});
