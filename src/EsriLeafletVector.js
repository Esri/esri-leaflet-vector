// export version
import packageInfo from '../package.json';
const version = packageInfo.version;
export { version as VERSION };

export { VectorBasemapLayer, vectorBasemapLayer } from './VectorBasemapLayer';
export { VectorTileLayer, vectorTileLayer } from './VectorTileLayer';
export { EsriUtil as Util } from './Util';
export { MaplibreGLJSLayer, maplibreGLJSLayer } from './MaplibreGLLayer';
