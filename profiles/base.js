import config from '../node_modules/esri-leaflet/profiles/base.js';
import nodeResolve from 'rollup-plugin-node-resolve';

config.entry = 'src/EsriLeafletVector.js';
config.moduleName = 'L.esri.Vector';

// is there a way to bundle mapbox-gl w/o a jsnext:main field? mapbox/mapbox-gl-js/issues/3767
config.plugins[0] = nodeResolve({
  jsnext: true,
  main: true,
  browser: false,
  extensions: [ '.js', '.json' ]
});

export default config;
