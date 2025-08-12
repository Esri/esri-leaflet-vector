// export version
import packageInfo from '../package.json';
const version = packageInfo.version;
export {version as VERSION};

export {VectorBasemapLayer, vectorBasemapLayer} from './VectorBasemapLayer.js';
export {VectorTileLayer, vectorTileLayer} from './VectorTileLayer.js';
export {EsriUtil as Util} from './Util.js';
export {MaplibreGLJSLayer, maplibreGLJSLayer, setRTLTextPlugin} from './MaplibreGLLayer.js';
