import config from '../node_modules/esri-leaflet/profiles/base.js';
import nodeResolve from 'rollup-plugin-node-resolve';

config.entry = 'src/EsriLeafletVector.js';
config.moduleName = 'L.esri.Vector';

// to do: try and wrap ol' mapbox-gl w/o a jsnext:main field
config.plugins[0] = nodeResolve({
  jsnext: true,
  main: true,
  browser: false,
  extensions: [ '.js', '.json' ]
});

export default config;
