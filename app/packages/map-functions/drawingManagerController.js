/**
 * DrawingManagerController class
 * Controls "drawing mode" for the map view.
 * This is used to allow the user to sketch their roof area
 *
 * @param drawingManager - a Google Drawing Manager instance
 * @constructor
 */
DrawingManagerController = function(drawingManager) {

  var options = { // Initial options
    drawingControl: false, // Turn off other polygon drawing options for user
    drawingMode: null, // Drawing mode is initially "off"
    polygonOptions: { // How roof area polygons are initially displayed when drawn
      zindex: 1
    }
  };

  /**
   * Initialise the drawing manager with default options
   * Private
   */
  var init = function() {
    drawingManager.setOptions(options);
  };

  init();

  return {
    /**
     * Turn off drawing mode (prevent user sketching roof area)
     */
    disableDrawingMode: function () {
      drawingManager.setDrawingMode(null);
      $('body').removeClass('inDrawMode');
    },

    /**
     * Turn on drawing mode (allow user to sketch roof area)
     */
    enableDrawingMode: function () {
      $('body').addClass('inDrawMode');
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    },

    /**
     * Associate a Google Map object with the drawing manager
     * This tells us which map the user can sketch in
     * @param map
     */
    setMap: function (map) {
      drawingManager.setMap(map);
    }
  };
};