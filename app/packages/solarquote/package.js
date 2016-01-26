Package.describe({
  name: 'solarquote:core',
  version: '0.1.0',
  summary: 'Defines the global namespaces and the application configuration.'
});

Package.onUse(function (api) {
  api.addFiles('common.js');
  api.addFiles('currentLocationManager.js');
  api.addFiles('utils.js');
  api.export('SolarQuote');
});