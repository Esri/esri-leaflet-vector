declare module "esri-leaflet-vector" {
  export function vectorBasemapLayer(key: any, options: any): any;
  export var VectorBasemapLayer: any;
  export function vectorTileLayer(key: any, options: any): any;
  export var VectorTileLayer: any;
  export function maplibreGLJSLayer(options: any): any;
  export var MaplibreGLJSLayer: any;
  export function autoSetMaplibreWorkerUrl(scriptUrl?: string): boolean;
  export function getMaplibreWorkerUrl(): string;
  export function setMaplibreWorkerUrl(url: string): void;
}
