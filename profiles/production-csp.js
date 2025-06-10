import alias from '@rollup/plugin-alias';
import copy from 'rollup-plugin-copy';
import config from './production.js';
import resolve from 'resolve/sync';
config.output.file = 'dist/esri-leaflet-vector-csp.js';
console.log(resolve('maplibre-gl/dist/maplibre-gl-csp.js'));
// bundle maplibre-gl-csp for production
config.plugins.push(
  alias({
    entries: [
      {
        find: 'maplibre-gl',
        replacement: resolve('maplibre-gl/dist/maplibre-gl-csp.js')
      }
    ]
  }),
  copy({
    targets: [
      {
        src: 'node_modules/maplibre-gl/dist/maplibre-gl-csp-worker.js',
        dest: 'dist',
        rename: 'esri-leaflet-vector-csp-worker.js'
      },
      {
        src: 'node_modules/maplibre-gl/dist/maplibre-gl-csp-worker.js.map',
        dest: 'dist',
        rename: 'esri-leaflet-vector-csp-worker.js.map'
      }
    ]
  })
);

export default config;
