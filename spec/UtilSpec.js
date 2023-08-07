/* eslint-env mocha */
const metadata = {
  tiles: ['tile/{z}/{y}/{x}.pbf'],
  tileInfo: {
    lods: [
      {
        level: 0,
        resolution: 78271.516964,
        scale: 295828763.7957775
      }
    ]
  }
};

describe('Util', function () {
  it('should include the token in the sprite URL when the the URL does not start with http', function () {
    const spriteUrl = '../sprites/sprite';
    const token = 'asdf';
    const styleUrl =
      'https://tiles.arcgis.com/tiles/test/arcgis/rest/services/test/VectorTileServer/resources/styles/root.json';
    const fullSpriteUrl =
      'https://tiles.arcgis.com/tiles/test/arcgis/rest/services/test/VectorTileServer/resources/sprites/sprite';

    const style = L.esri.Vector.Util.formatStyle(
      {
        version: 8,
        sprite: spriteUrl,
        glyphs: '../fonts/{fontstack}/{range}.pbf',
        sources: {
          esri: {
            type: 'vector',
            attribution: 'test',
            bounds: [-180, -85.0511, 180, 85.0511],
            minzoom: 0,
            maxzoom: 19,
            scheme: 'xyz',
            url: '../../'
          }
        },
        layers: []
      },
      styleUrl,
      metadata,
      token
    );

    // console.log("style.sprite", style.sprite);
    expect(style.sprite).to.equal(`${fullSpriteUrl}?token=${token}`);
  });

  it('should include the token in the sprite URL when the the URL does start with http', function () {
    const spriteUrl =
      'https://www.arcgis.com/sharing/rest/content/items/123456789/resources/sprites/sprite-1679474043120';
    const token = 'asdf';

    const style = L.esri.Vector.Util.formatStyle(
      {
        version: 8,
        sprite: spriteUrl,
        glyphs: '../fonts/{fontstack}/{range}.pbf',
        sources: {
          esri: {
            type: 'vector',
            attribution: 'test',
            bounds: [-180, -85.0511, 180, 85.0511],
            minzoom: 0,
            maxzoom: 19,
            scheme: 'xyz',
            url: '../../'
          }
        },
        layers: []
      },
      'nope',
      metadata,
      token
    );

    expect(style.sprite).to.equal(`${spriteUrl}?token=${token}`);
  });

  it('should include the token in the glyph URL when the the URL does not start with http', function () {
    const token = 'asdf';
    const styleUrl =
      'https://tiles.arcgis.com/tiles/test/arcgis/rest/services/test/VectorTileServer/resources/styles/root.json';
    const fullGlyphUrl =
      'https://tiles.arcgis.com/tiles/test/arcgis/rest/services/test/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf';

    const style = L.esri.Vector.Util.formatStyle(
      {
        version: 8,
        sprite: 'https://www.arcgis.com/sharing/rest/content/items/123456789/resources/sprites/sprite-1679474043120',
        glyphs: '../fonts/{fontstack}/{range}.pbf',
        sources: {
          esri: {
            type: 'vector',
            attribution: 'test',
            bounds: [-180, -85.0511, 180, 85.0511],
            minzoom: 0,
            maxzoom: 19,
            scheme: 'xyz',
            url: '../../'
          }
        },
        layers: []
      },
      styleUrl,
      metadata,
      token
    );

    expect(style.glyphs).to.equal(`${fullGlyphUrl}?token=${token}`);
  });

  it('should include the token in the glyph URL when the the URL does start with http', function () {
    const token = 'asdf';
    const glyphUrl = 'https://tiles.arcgis.com/tiles/U2DMZtrcqfn913et/arcgis/rest/services/DynamicConsumerMapWebMercator/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf';

    const style = L.esri.Vector.Util.formatStyle(
      {
        version: 8,
        sprite: 'https://www.arcgis.com/sharing/rest/content/items/123456789/resources/sprites/sprite-1679474043120',
        glyphs: glyphUrl,
        sources: {
          esri: {
            type: 'vector',
            attribution: 'test',
            bounds: [-180, -85.0511, 180, 85.0511],
            minzoom: 0,
            maxzoom: 19,
            scheme: 'xyz',
            url: '../../'
          }
        },
        layers: []
      },
      'nope',
      metadata,
      token
    );

    expect(style.glyphs).to.equal(`${glyphUrl}?token=${token}`);
  });
});
