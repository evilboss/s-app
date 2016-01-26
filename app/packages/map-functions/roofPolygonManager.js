/**
 * RoofPolygonManager class
 * This is used to manage the array of roof polygons that the user has sketched
 *
 * @param roofPolygonArray
 * @param map
 * @param markerController
 * @param panelTypes
 * @constructor
 */
RoofPolygonManager = function (roofPolygonArray, map, markerController, panelTypes, updateHandler) {
  var selectedRoofPolygon = null;

  var options = {
    selectedOptions: {
      fillColor: 'green', strokeColor: 'lightgreen', strokeWeight: 3, opacity: 0.3, fillOpacity: 0.1, zIndex: 2
    },
    deselectedOptions: {
      fillColor: 'grey', strokeColor: 'white', strokeWeight: 2, opacity: 0.1, fillOpacity: 0.0, zIndex: 10
    }
  };

  /**
   * Sets the initial direction (angle) of the roof based on the first edge in the polygon path
   * @param roof
   */
  var setInitialRoofAngle = function (roof) {
    if (!roof.roofInfo.directionMarker) {
      // Roof needs a direction Marker
      //TODO var firstEdge = roof.getLongestEdge();
      var firstEdge = roof.getPath().getArray().slice(0, 2);

      // Set the direction polyline to the first edge
      roof.roofInfo.directionPolyline = new google.maps.Polyline({path: firstEdge});

      roof.setRoofAngleFromSelectedEdge();

      var centerPt = roof.roofInfo.directionPolyline.getBounds().getCenter();
      markerController.addDirectionMarker(roof, roof.roofInfo.angle, centerPt);

      roof.computeBoundsPolygon();
    }
  };

  /**
   * Extend roof polygon with roof-specific functionality
   * Called once when the roof polygon is added to roofPolygonManager
   * @param roof
   */
  var addRoofFunctions = function (roof) {
    roof.roofInfo.polylineController = PolylineController(map);

    roof.findClosestEdge = function(latLng) {

      roof = this;

      // reset closest distance
      this.roofInfo.selectedEdge.distance = 0;

      var previousIndex = this.roofInfo.selectedEdge.edgeIndex;

      var vertices = this.getPath().getArray();

      var line = new google.maps.Polyline();
      var edge = [];
      // loop over vertices to create edges for comparison
      for (i=0; i<vertices.length; i++) {
        edge[0] = vertices[i];
        edge[1] = (i==vertices.length-1) ? vertices[0] : vertices[i+1]; // close the polygon - last edge is (vx[n],vx[0])
        line.setPath(edge);

        var centerPt = line.getBounds().getCenter();
        var distance = centerPt.distanceTo(latLng);

        if (this.roofInfo.selectedEdge.distance > distance || i == 0) {
          this.roofInfo.selectedEdge.edgeVertices.clear();
          this.roofInfo.selectedEdge.edgeVertices.push(edge[0]);
          this.roofInfo.selectedEdge.edgeVertices.push(edge[1]);
          this.roofInfo.selectedEdge.edgeIndex = i;
          this.roofInfo.selectedEdge.distance = distance;
        }
      }

      if (previousIndex != this.roofInfo.selectedEdge.edgeIndex) {
        this.roofInfo.directionPolyline.setPath(this.roofInfo.selectedEdge.edgeVertices);
        this.roofInfo.polylineController.showCurrentEdge(roof);
      }
    };
    // extend roof polygon so it can calculate it's own angle
    roof.setRoofAngleFromSelectedEdge = function () {
      polyline = this.roofInfo.directionPolyline;
      if (polyline) {
        edge = [polyline.getPath().getAt(0), polyline.getPath().getAt(1)];

        this.roofInfo.angle = getAngle(edge[1].lat() - edge[0].lat(), edge[1].lng() - edge[0].lng());

        // If polygon winding is clockwise, flip the marker so it's inside the roof
        if (this.roofInfo.isWindingClockwise) {
          this.roofInfo.angle.degrees += 180;
        }

        var degrees = this.roofInfo.angle.degrees;

        // normalise back to 0...360 range
        while (degrees < 0) degrees += 360;
        while (degrees > 360) degrees -= 360;

        roof.roofInfo.azimuth = Math.round(degrees);
      }
    };

    /**
     * Computes a bounding polygonal rectangle for the roof ready to fill with panels.
     * Method:
     * Clone the roof polygon and rotate so angle = 0 (i.e. points north)
     * Create a bounding box (polygon) around the cloned roof polygon
     * Rotate the bounding box (polygon) back to the original angle
     *
     */
    roof.computeBoundsPolygon = function () {
      if (this.boundsPoly) {
        this.boundsPoly.setMap(null);
        this.boundsPoly = null;
      }
      var clonedPath = [];
      this.getPath().forEach(function (point, index) {
        clonedPath.push(new google.maps.LatLng(point.lat(), point.lng()));
      });
      var clonedPoly = new google.maps.Polygon({
        paths: clonedPath,
        strokeColor: '#0000FF',
        strokeWeight: 2,
        zIndex: 10
      });
      clonedPoly.setMap(this.getMap());
      clonedPoly.rotateLatLng(-this.roofInfo.angle.degrees, this.roofInfo.directionMarker.getPosition());
      var corners = getCorners(clonedPoly.getBounds());
      corners.push(corners[0]); // Close the polygon - add first corner to end of array

      // Remove clonedPoly from map
      clonedPoly.setMap(null);
      clonedPoly = null;
      clonedPath = null;

      this.boundsPoly = new google.maps.Polygon({
        path: corners,
        strokeColor: '#0000F0',
        strokeWeight: 2,
        map: this.getMap()
      });

      this.boundsPoly.rotateLatLng(this.roofInfo.angle.degrees, this.roofInfo.directionMarker.getPosition());

      this.boundsPoly.setMap(null); // make invisible
    };

    /**
     * Set the position and rotation of the direction marker from the center point of an edge of the roof polygon
     * @param centerPt
     */
    roof.setDirectionMarkerPoint = function(centerPt) {
      var marker = this.roofInfo.directionMarker;

      if (marker == null || typeof(marker) === 'undefined') {
        console.log("Marker is null");
        console.dir(this);
        return;
      }

      this.findClosestEdge(centerPt);
      marker.setPosition(centerPt);
      var icon = marker.get('icon'); // get the icon so we can adjust rotation
      this.setRoofAngleFromSelectedEdge();
      icon.rotation = this.roofInfo.angle.degrees;
      marker.set('icon', icon);
      this.computeBoundsPolygon(); // Recompute the bounds polygon
      this.roofPanelManager.fitPanelsToRoof();
      if (updateHandler != null) updateHandler();
    }
  };

  /**
   * Use atan2 to get angle in the right quadrant
   * see: http://gamedev.stackexchange.com/questions/14602/what-are-atan-and-atan2-used-for-in-games
   * @param lat
   * @param lng
   * @returns {{degrees: number, radians: number}}
   */
  var getAngle = function (lat, lng) {
    var radians = Math.atan2(lat, lng);
    var degrees = -(radians * (180 / Math.PI)); // use negative to 'correct' marker rotation
    return {
      degrees: degrees,
      radians: radians
    };
  };

  var getCorners = function (bounds) {
    if (!bounds) return null;

    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();
    var southWest = new google.maps.LatLng(sw.lat(), sw.lng());
    var northEast = new google.maps.LatLng(ne.lat(), ne.lng());
    var southEast = new google.maps.LatLng(sw.lat(), ne.lng());
    var northWest = new google.maps.LatLng(ne.lat(), sw.lng());
    return [southWest, northWest, northEast, southEast];
  };


  return {
    /**
     * Adds a newly sketched polygon to the roof array and selects it
     * @param newPolygon
     */
    addRoofPolygon: function (newPolygon, suppressSelect) {
      var self = this;

      var isSelectSuppressed = !!suppressSelect;

      addRoofFunctions(newPolygon);
      roofPolygonArray.push(newPolygon);
      setInitialRoofAngle(newPolygon);


      newPolygon.roofPanelManager = RoofPanelManager(newPolygon, panelTypes);


      // Initialise by fitting panels to roof
      newPolygon.roofPanelManager.fitPanelsToRoof();

      // TODO - we need to make sure fitPanelsToRoof has FINISHED before proceeding

      if (!isSelectSuppressed) {
        // Select the newly drawn roof
        self.selectRoof(newPolygon);
      }

      if (newPolygon.totalCapacityW == 0) {
        if (typeof(sAlert.warning == 'function')) {
          sAlert.warning('Roof area is too small');
        }
        console.warn('Capacity is 0 - deleting this roof!');
        if (isSelectSuppressed) {
          // We HAVE to select it to delete it
          self.selectRoof(newPolygon);
        }
        self.deleteSelectedRoof();
      } else {
        // This is a valid roof - save the encoding with backslash protected
        newPolygon.roofInfo.encoded = google.maps.geometry.encoding.encodePath(newPolygon.getPath()).replace(/\\/g,"\\\\");

        // Set a listener for user "click" to select the roof area polygon
        google.maps.event.addListener(newPolygon, 'click', function (e) {
          //console.log('Roof polygon clicked!');
          self.selectRoof(this);
          e.stop(); // Prevent 'click' event going any further
        });
      }
      if (updateHandler != null) updateHandler();
    },
    /**
     * Make the given roofPolygon the currently selected roof
     * @param roofPolygon
     */
    selectRoof: function (roofPolygon) {
      this.clearSelectedRoof(true); // Make sure nothing selected
      selectedRoofPolygon = roofPolygon;
      selectedRoofPolygon.setOptions(options.selectedOptions);
      if (updateHandler != null) updateHandler();
    },
    /**
     * Clear currently selected roof
     */
    clearSelectedRoof: function (suppressUpdate) {
      if (selectedRoofPolygon) {
        selectedRoofPolygon.setOptions(options.deselectedOptions);
        selectedRoofPolygon = null;
        if (!suppressUpdate && updateHandler != null) updateHandler();

      }
    },
    /**
     * Returns currently selected Roof polygon (mostly here for testing/dev)
     * @returns {*}
     */
    getSelectedRoof: function () {
      return selectedRoofPolygon;
    },
    deleteSelectedRoof: function () {
      // clear selected roof direction marker, polyline and then polygon
      if (selectedRoofPolygon) {
        var foundIdx = -1;
        roofPolygonArray.forEach(function (roof, i) {
          if (roof == selectedRoofPolygon) {
            foundIdx = i;
          }
        });
        if (foundIdx > -1) {
          roofPolygonArray.removeAt(foundIdx);
          selectedRoofPolygon.roofInfo.directionMarker.setMap(null);
          selectedRoofPolygon.roofInfo.directionPolyline.setMap(null);
          selectedRoofPolygon.roofInfo.directionMarker = null;
          selectedRoofPolygon.roofInfo.directionPolyline = null;
          selectedRoofPolygon.roofPanelManager.delete();
          selectedRoofPolygon.setMap(null);
          selectedRoofPolygon = null;
          if (updateHandler != null) updateHandler();
        }
      }
    },
    deleteAllRoofs: function() {
      while(roofPolygonArray.length > 0) {
        this.selectRoof(roofPolygonArray.getAt(0))
        this.deleteSelectedRoof();
      }
    },
    getRoofs: function () {
      return roofPolygonArray;
    },
    getBoundingBox: function () {
      var bounds = null;
      roofPolygonArray.forEach(function (roof, i) {
        if (i == 0) {
          bounds = roof.getBounds()
        } else {
          bounds.union(roof.getBounds());
        }
      });
      return bounds;
    },
    getTotalAreaSqm: function () {
      var area = 0;
      roofPolygonArray.forEach(function (roof, i) {
        area += roof.roofInfo.areaSqM;
      });
      return area;
    },
    getTotalPanelCount: function() {
      var count = 0;
      roofPolygonArray.forEach(function (roof, i) {
        count += roof.selectedPanelType.panelCount;
      });
      return count;
    },
    /**
     * How many roof areas have we currently defined
     * @returns {*}
     */
    count: function () {
      return roofPolygonArray.length;
    }

  }
};