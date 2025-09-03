import config from "./base.js";

// do not bundle maplibre-gl for dev/debug
// otherwise build process is too slow during active development
// dev sample pages must globally load maplibre-gl to work
config.external.push("maplibre-gl");
config.output.globals["maplibre-gl"] = "maplibregl";

config.output.file = "dist/esri-leaflet-vector-debug.js";
config.output.sourcemap = true;

export default config;
