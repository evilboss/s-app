Template.page1.onRendered(function () {

  var handle = this.autorun(function () {
    // Load the Google Maps API on startup
    // Wait for API to be loaded

    if (GoogleMaps.loaded()) {
      MapFunctions.init(); // add extra prototype to Google Maps classes e.g. Polygon.rotate(...)
      reportMapController.init(Panels.find().fetch()); // Initialize mapController object
      reportMapController.renderReport(document.getElementById('map_report'), MapData.findOne());
      if (typeof(handle) != 'undefined') handle.stop();
    }
  });

});
