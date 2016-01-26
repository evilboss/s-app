/**
 * Polyline controller for managing display of selected roof edge polylines
 * @param map
 * @constructor
 */
PolylineController = function(map) {
  // thin yellow line
  var options = {
    strokeColor: '#ffff00',
    strokeWeight: 3,
    zIndex: 3
  };



  return {
    getCurrentEdge: function(roof) {
      return roof.roofInfo.directionPolyline;
    },
    addCurrentEdge: function(roof) {
      if (roof.roofInfo.directionPolyline) {
        roof.roofInfo.directionPolyline.setOptions(options);
        roof.roofInfo.directionPolyline.setMap(map);
      }
    },
    showCurrentEdge: function(roof) {
      if (roof.roofInfo.directionPolyline) {
        roof.roofInfo.directionPolyline.setMap(map);
      }
    },
    hideCurrentEdge: function(roof) {
      if (roof.roofInfo.directionPolyline) {
        roof.roofInfo.directionPolyline.setMap(null);
      }
    },
    removeSelectedEdge: function(roof) {
      roof.roofInfo.directionPolyline = null;
    }
  }
};