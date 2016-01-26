Package.describe({
  name: 'map-functions',
  version: '0.1.0',
  summary: 'Common mapping functions used in the application.'
});

Package.onUse(function (api) {
  api.use([
    'templating',
    'reactive-var',
    'underscore', 'dburles:google-maps']);
  api.addFiles('drawingManagerController.js');
  api.addFiles('markerController.js');
  api.addFiles('polylineController.js');
  api.addFiles('roofPanelManager.js');
  api.addFiles('roofPolygonManager.js');
  api.addFiles('mapController.js');
  api.addFiles('functions.js');
  api.addFiles('maplabel.js');
  api.export('MapFunctions');
  api.export('MapLabel');
  api.export('mapController'); // global mapController instance
  api.export('reportMapController'); // global mapController instance for reports
  api.export('reportMapController2'); // global mapController instance for reports
});
