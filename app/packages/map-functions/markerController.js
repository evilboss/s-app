/**
 * MarkerController - used to manage direction markers on roof edges
 * @param drawingManager
 * @constructor
 */
MarkerController = function(map) {
  var options = {
    icon: {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 4,
      strokeColor: "#ffFF00",
      strokeWeight: 3
    },
    draggable: true,
    map: map
  };

  var polylineController = PolylineController(map);

  var _addDirectionMarker = function(roof, angle, pointLatLng) {
    // Extend default markerOptions to add marker rotation and position
    var markerOptions = $.extend($.extend(options, $.extend(options.icon, {rotation: angle.degrees})), {position: pointLatLng});
    var marker = new google.maps.Marker(markerOptions);

    // Add a link back to the roof object to which this marker is attached
    marker.roof = roof;

    roof.roofInfo.directionMarker = marker;

    // The polyline is created already in the roofPolygonManager - so here we just add it to the polylineController
    polylineController.addCurrentEdge(roof);

    // Set closest edge info against the roof
    _findClosestEdge(roof,pointLatLng);

    // Add listener for direction marker drag
    google.maps.event.addListener(marker, 'dragstart', function(event) {
      $('body').addClass('inDragMode');
      // Hide current panels
      marker.roof.roofPanelManager.hide();
    });

    // Add listener for direction marker drag
    google.maps.event.addListener(marker, 'drag', function(event) {
      // show the current edge (make visible)

      _findClosestEdge(marker.roof, event.latLng);

    });

    // Add listener for when user stops dragging - recompute angle
    google.maps.event.addListener(marker, 'dragend', function(event) {
      $('body').removeClass('inDragMode');
      var centerPt = marker.roof.roofInfo.directionPolyline.getBounds().getCenter();

      marker.roof.setDirectionMarkerPoint(centerPt);
    });
  };

  /**
   * Find the closest edge in the polygon to the given point
   * @param roof
   * @param latLng
   * @private
   */
  var _findClosestEdge = function(roof, latLng) {

    roof.findClosestEdge(latLng);
  };

  return {
    addDirectionMarker: function(roof, angle, pointLatLng) {
      _addDirectionMarker(roof, angle, pointLatLng);
    }
  }
};