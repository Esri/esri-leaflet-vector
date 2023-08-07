// export version
import packageInfo from '../package.json';
var version = packageInfo.version;
export { version as VERSION };

export { VectorBasemapLayer, vectorBasemapLayer } from './VectorBasemapLayer';
export { VectorTileLayer, vectorTileLayer } from './VectorTileLayer';
