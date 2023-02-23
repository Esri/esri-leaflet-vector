import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import config from './base.js';

config.output.file = 'dist/esri-leaflet-vector.js';
config.output.sourcemap = true;

// use a Regex to preserve copyright text
config.plugins.push(terser({ format: { comments: /Institute, Inc/ } }));

// bundle maplibre-gl for production
config.plugins.push(
  commonjs()
);

export default config;
