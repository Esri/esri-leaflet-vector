import config from './base.js';

// do not bundle mapbox-gl for dev/debug
// otherwise build process is too slow during active development
// dev sample pages must globally load mapbox-gl to work
config.external.push('mapbox-gl');
config.output.globals['mapbox-gl'] = 'mapboxgl';

config.output.file = 'dist/esri-leaflet-vector-debug.js';
config.output.sourcemap = true;

export default config;
