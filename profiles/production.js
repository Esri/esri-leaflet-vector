import uglify from 'rollup-plugin-uglify';
import config from './base.js';

config.output.file = 'dist/esri-leaflet-vector.js';
config.output.sourcemap = true;

// use a Regex to preserve copyright text
config.plugins.push(uglify({ output: { comments: /Institute, Inc/ } }));

export default config;
