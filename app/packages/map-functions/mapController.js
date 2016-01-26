/**
 * MapController class
 * This is the main class that handles and controls the roof area sketching and panel-fill operations
 *
 * @constructor
 */
MapController = function () {

  var isInitialised = false;

  var map = null;
  var roofPolygons = null;
  var isDrawingCancelled = false;

  // TODO - Add user message (instruction) and alert elements
  var instructionPanelElement = null;
  var alertPanelElement = null;

  var options = {
    maxPanelAreaSqm: 700 // Default max panel area is size of a typical residential block (700 sq.m)
  };

  var helpers = {
    drawingManagerController: null,
    roofPolygonManager: null,
    directionMarkerController: null,
    polylineController: null,
    panelTypes: null,
    updateHandler: function () {
      console.log('Map update happened [default handler]');
    },
    updateHandlerPaused: false
  };

  /**
   * Initialises the panel types data - holds information about brands of panel, dimensions and capacity
   * @param panelTypes
   * @private
   */
  var _init = function (panelTypes) {
    if (isInitialised) return;
    roofPolygons = new google.maps.MVCArray();
    helpers.panelTypes = panelTypes;
    isInitialised = true;
  };

  var initialiseRoofPolygon = function (newRoofPolygon) {
// Initialise panels array for this roof area
    newRoofPolygon.panels = [];

    // Extend polygon object with roofInfo
    newRoofPolygon.roofInfo = {
      areaSqM: newRoofPolygon.getAreaSqm(),
      azimuth: 0, // direction panels are facing
      directionMarker: null,
      directionPolyline: null,
      isWindingClockwise: (google.maps.geometry.spherical.computeSignedArea(newRoofPolygon.getPath()) > 0),
      selectedEdge: { // This is the selected edge where the direction marker is attached
        edgeVertices: new google.maps.MVCArray(), // This holds the points for the selected edge
        distance: 0, // distance from marker point to the selected edge
        edgeIndex: 0 // this is the index into the polygon path for the selected edge
      }
    };

  };

  var addListeners = function (drawingManager) {

    // Clear any existing listeners
    google.maps.event.clearListeners(drawingManager.getMap(), 'click');
    google.maps.event.clearListeners(drawingManager, 'overlaycomplete');

    // Add new listeners

    // Set a listener for user "click" on map to select the underlying roof area polygon
    // Only need to do this once
    google.maps.event.addListener(drawingManager.getMap(), 'click', function (e) {
      helpers.roofPolygonManager.clearSelectedRoof();
    });

    // Set a listener for user hitting 'esc' key to cancel drawing polygon
    google.maps.event.addDomListener(document, 'keyup', function (e) {

      var code = (e.keyCode ? e.keyCode : e.which);

      if (code === 27) {
        isDrawingCancelled = true;
        drawingManager.setDrawingMode(null);
        $('body').removeClass('inDrawMode');
      }
    });

    // Set listener for polygon completion
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
      if (event.type == google.maps.drawing.OverlayType.POLYGON) {
        $('body').removeClass('inDrawMode');

        var newRoofPolygon = event.overlay;

        // If user has hit 'esc' key or selected another UI control button, then cancel this polygon
        if (isDrawingCancelled) {
          newRoofPolygon.setMap(null);
          isDrawingCancelled = false;
          drawingManager.setDrawingMode(null);
          return;
        }

        // Make sure there are enough vertices (minimum of 3 points)
        if (newRoofPolygon.getPath().getArray().length < 3) {
          newRoofPolygon.setMap(null);
          // TODO User alert??
          return;
        }

        initialiseRoofPolygon(newRoofPolygon);

        console.log('Area (sqm): ' + newRoofPolygon.roofInfo.areaSqM);

        if (newRoofPolygon.roofInfo.areaSqM > options.maxPanelAreaSqm) {
          // User has sketched an area that is too big for the type of property
          newRoofPolygon.setMap(null);
          newRoofPolygon = null;
          if (typeof(sAlert.warning) == 'function') {
            sAlert.warning('Roof area is too big');
          }
          return;
        }

        helpers.roofPolygonManager.addRoofPolygon(newRoofPolygon);

        drawingManager.setDrawingMode(null);

      }
    });
  };

  /**
   * Set the map for the mapController
   *
   * Sets the local 'map' variable as well as the map for the drawingManager
   * @param _map
   * @private
   */
  var _setMap = function (_map) {
    _init(); // Make sure we are initialised - wrapped in _.once(...) so can call multiple times safely
    map = _map;
    var drawingManager = new google.maps.drawing.DrawingManager();
    helpers.drawingManagerController = DrawingManagerController(drawingManager);
    helpers.polylineController = PolylineController(map);
    helpers.directionMarkerController = MarkerController(map, helpers.polylineController);
    helpers.roofPolygonManager = RoofPolygonManager(roofPolygons, map, helpers.directionMarkerController, helpers.panelTypes, _notifyUpdateHandler);
    helpers.drawingManagerController.setMap(_map);
    addListeners(drawingManager);
  };

  /**
   * Enable roof drawing 'sketch' mode
   * @private
   */
  var _enableDrawingMode = function () {
    _disableDrawingMode(); // Disable first to clear any existing polygon in progress
    helpers.drawingManagerController.enableDrawingMode();
  };

  /**
   * Disable roof drawing 'sketch' mode - will also cancel any 'in progress' polygon
   * @private
   */
  var _disableDrawingMode = function () {
    isDrawingCancelled = true;
    helpers.drawingManagerController.disableDrawingMode();
    isDrawingCancelled = false; // Ensure this is reset
  };

  var _registerForUpdates = function (updHandler) {
    helpers.updateHandler = updHandler;
  };

  var _pauseUpdateHandler = function () {
    helpers.updateHandlerPaused = true;
  };

  var _unpauseUpdateHandler = function () {
    helpers.updateHandlerPaused = false;
  };

  var _notifyUpdateHandler = function () {
    return ( helpers.updateHandlerPaused == false && helpers.updateHandler != null && helpers.updateHandler() )
  };

  return {
    init: function (panelTypes) {
//      console.dir(panelTypes);
      _init(panelTypes);
    },
    setMap: function (map) {
      _setMap(map);
    },
    isReady: function () {
      return (helpers.roofPolygonManager != null);
    },
    getMap: function () {
      return map;
    },
    enableDrawingMode: function () {
      return _enableDrawingMode();
    },
    disableDrawingMode: function () {
      return _disableDrawingMode();
    },
    setMaxPanelArea: function (maxAreaSqm) {
      options.maxPanelAreaSqm = maxAreaSqm;
    },
    getSelectedRoof: function () {
      return helpers.roofPolygonManager.getSelectedRoof();
    },
    deleteSelectedRoof: function () {
      helpers.roofPolygonManager.deleteSelectedRoof();
    },
    getRoofs: function () {
      return helpers.roofPolygonManager.getRoofs();
    },
    getRoofController: function () {
      return helpers.roofPolygonManager;
    },
    getHelpers: function () {
      return helpers;
    },
    notifyUpdateHandler: function () {
      return _notifyUpdateHandler();
    },
    registerForUpdates: function (updateHandler) {
      _registerForUpdates(updateHandler);
    },
    restore: function (panels, directionMarkerPoints) {
      var self = this;

      _pauseUpdateHandler();

      self.getRoofController().deleteAllRoofs();

      var newRoofPolygon = [];
      panels.forEach(function (panel, idx) {
        newRoofPolygon[idx] = new google.maps.Polygon({path: JSON.parse(panel).j, map: self.getMap()});
        // If map is currently updating (e.g. from zoom/pan operation), or polygon if complex,
        // then setMap(...) can take some time to actually set the  map attribute on the polygon.
        // Before it is correctly set, map will remain set as null
        // It is important not to call any functions that rely on newRoofPolygon.map being set
        // until it is actually available
      });

      var controller = self;
      // Every 300ms check until all newRoofPolygon objects have their map property set
      var mapPoller = {

        // How frequently to check - in milliseconds
        interval: 300,

        attempts: 0,

        init: function () {
          setTimeout(
            $.proxy(this.checkForMapSet, this),
            this.interval
          );
        },
        initMarkers: function () {
          setTimeout(
            $.proxy(this.addDirectionMarkers, this),
            this.interval
          )
        },
        addDirectionMarkers: function () {
          var self = this;

          var isMapSet = true;

          newRoofPolygon.forEach(function (panel, idx) {
            isMapSet = isMapSet && panel.roofInfo.directionPolyline && panel.roofInfo.directionMarker && panel.roofInfo.directionPolyline.map && panel.roofInfo.directionMarker.map;
          });
          if (isMapSet) {
            newRoofPolygon.forEach(function (panel, idx) {
              var centerPt = new google.maps.LatLng(JSON.parse(directionMarkerPoints[idx]));
              panel.setDirectionMarkerPoint(centerPt);
              helpers.roofPolygonManager.selectRoof(panel);
            });
            _unpauseUpdateHandler();
            controller.notifyUpdateHandler();
          } else {
            // Recurse on map not yet ready (ie. map = null on direction polyline or marker)
            self.attempts++;
            if (self.attempts < 10) {
              self.initMarkers();
            } else {
              console.warn("Too many attempts - restore failed!");
            }
          }
        },
        checkForMapSet: function () {
          var self = this;

          var isMapSet = true;
          newRoofPolygon.forEach(function (panel, idx) {
            isMapSet = isMapSet && !!panel.map;
          });

          if (isMapSet) {
            newRoofPolygon.forEach(function (panel, idx) {
              initialiseRoofPolygon(panel);
              helpers.roofPolygonManager.addRoofPolygon(panel, true);
            });
            // OK - now try adding direction markers
            self.initMarkers();
          } else {
            // Recurse on map not yet ready (ie. map = null on roofPolys)
            self.init();
          }
        }
      };
      mapPoller.init();
    },
    renderReport: function (mapElement, data) {
      var self = this;

      var mapCoordinates = data.mapCoordinates;

      var address = mapCoordinates.address;
      var bounds = JSON.parse(mapCoordinates.bounds);
      var map = new google.maps.Map(mapElement, {
        location: address,
        scrollwheel: false,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        draggable: false,
        tilt: 0
      });

      // When map has finished panning, only THEN can we remove direction markers, polylines and roof outlines
      var listenerHandle;
      listenerHandle = google.maps.event.addListener(map, 'idle', function () {
        // We only want this to trigger ONCE - so immediately remove event listener
        google.maps.event.removeListener(listenerHandle);

        self.setMap(map);
        self.getRoofController().deleteAllRoofs();
        var panels = data.panels;
        var markerPts = data.directionMarkerPoints;

        self.restore(panels, markerPts);

        Meteor.setTimeout(function () {
          var roofs = self.getRoofs();
          // Get rid of direction markers and roof outline - just leave panels
          roofs.forEach(function (roof) {
            if (roof.roofInfo.directionMarker) {
              roof.roofInfo.directionMarker.setMap(null);
            }
            if (roof.roofInfo.directionPolyline) {
              roof.roofInfo.directionPolyline.setMap(null);
            }
            roof.setMap(null);
          });
        }, 3000);
      });

      var newBounds = new google.maps.LatLngBounds(new google.maps.LatLng(bounds.south, bounds.west), new google.maps.LatLng(bounds.north, bounds.east));
      map.fitBounds(newBounds);
      map.setZoom(19);

    }
  }
};

mapController = MapController();
reportMapController = MapController();
reportMapController2 = MapController();

mapController.registerForUpdates(function () {
  console.log('mapController update happened')
});
// Suppress updates for report map controllers
reportMapController.registerForUpdates(function () {
  console.log('reportMapController update suppressed')
});
reportMapController2.registerForUpdates(function () {
  console.log('reportMapController2 update suppressed')
});
