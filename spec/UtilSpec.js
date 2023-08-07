/* eslint-env mocha */

describe('Util', function () {
  it('should include the token in the sprite URL when the the URL does not start with http', function () {
    const spriteUrl = '../sprites/sprite';
    const token = 'asdf';

    const style = L.esri.Vector.Util.formatStyle({ version: 8, sprite: spriteUrl, glyphs: '../fonts/{fontstack}/{range}.pbf', sources: { esri: { type: 'vector', attribution: 'test', bounds: [-180, -85.0511, 180, 85.0511], minzoom: 0, maxzoom: 19, scheme: 'xyz', url: '../../' } }, layers: [] }, 'nope', {}, token);

    expect(style.sprite).to.equal(`${spriteUrl}?token=${token}`);
  });

  it('should include the token in the sprite URL when the the URL does start with http', function () {
    const spriteUrl = 'https://www.arcgis.com/sharing/rest/content/items/123456789/resources/sprites/sprite-1679474043120';
    const token = 'asdf';

    const style = L.esri.Vector.Util.formatStyle({ version: 8, sprite: spriteUrl, glyphs: '../fonts/{fontstack}/{range}.pbf', sources: { esri: { type: 'vector', attribution: 'test', bounds: [-180, -85.0511, 180, 85.0511], minzoom: 0, maxzoom: 19, scheme: 'xyz', url: '../../' } }, layers: [] }, 'nope', {}, token);

    expect(style.sprite).to.equal(`${spriteUrl}?token=${token}`);
  });
});
