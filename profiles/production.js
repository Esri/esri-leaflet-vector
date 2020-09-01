import uglify from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';
import config from './base.js';

config.output.file = 'dist/esri-leaflet-vector.js';
config.output.sourcemap = true;

// use a Regex to preserve copyright text
config.plugins.push(uglify({ output: { comments: /Institute, Inc/ } }));

// bundle mapbox-gl for production
config.plugins.push(
  commonjs({
    namedExports: {
      // left-hand side can be an absolute path, a path
      // relative to the current directory, or the name
      // of a module in node_modules                        
      'mapbox-gl': ['mapboxgl']
    }
  })
);

export default config;
