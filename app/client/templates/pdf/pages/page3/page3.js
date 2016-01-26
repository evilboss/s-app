
Template.page3.onRendered(function() {

  var handle = this.autorun(function() {
    // Load the Google Maps API on startup
    // Wait for API to be loaded

    if (GoogleMaps.loaded()) {
      MapFunctions.init(); // add extra prototype to Google Maps classes e.g. Polygon.rotate(...)

      reportMapController2.init(Panels.find().fetch()); // Initialize mapController object

      reportMapController2.renderReport(document.getElementById('map_report2'), MapData.findOne());

      if (typeof(handle) != 'undefined') handle.stop();

    }
  });

});

var panelData = function() {
  var panels = MapData.findOne().panelCapacity;
  var x = 0;
  var len = panels.length
  while(x < len){
      panels[x] = panels[x].toFixed(2);
      x++;
  }
  return panels;
};

Template.page3.helpers({
  panelDatas: function() {
    return panelData();
  },

});
