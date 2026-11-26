// export version
import packageInfo from "../package.json";
import { autoSetMaplibreWorkerUrl } from "./MaplibreGLLayer.js";

// For direct CDN usage of the production bundle, this points MapLibre at the
// colocated worker file unless the app already configured a worker URL.
autoSetMaplibreWorkerUrl();

const version = packageInfo.version;
export { version as VERSION };

export {
  VectorBasemapLayer,
  vectorBasemapLayer,
} from "./VectorBasemapLayer.js";
export { VectorTileLayer, vectorTileLayer } from "./VectorTileLayer.js";
export { EsriUtil as Util } from "./Util.js";
export {
  autoSetMaplibreWorkerUrl,
  getMaplibreWorkerUrl,
  MaplibreGLJSLayer,
  maplibreGLJSLayer,
  setMaplibreWorkerUrl,
} from "./MaplibreGLLayer.js";
