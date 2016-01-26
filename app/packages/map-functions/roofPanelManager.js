/**
 * RoofPanelManager class
 * This is used to manage the solar panel objects used to fill the roof polygon
 *
 * panelTypes - information about the panels (from DB)
 * map - the map used to display panels when they are visible
 * @constructor
 */
RoofPanelManager = function(roof, panelTypes) {

  /**
   * Initialise this roofPanelManager and do a "best fit" panel type option
   * @private
   */
  var resetPanelTypes = function() {
    roof.panelTypes = [];
    roof.panelTypeCapacity = [];
    roof.totalCapacityW = 0;
    roof.selectedPanelType = null;
    roof.selectedPanelTypeIndex = null;
  };

  // Clear on initialisation
  resetPanelTypes();
  roof.isAutoSelected = true;

  var RoofPanelTypeManager = function(roof, panelType, isRotated, panels) {
    var isVisible = true;

    return {
      panelType: panelType,
      rotated: isRotated,
      panelCount: panels.length,
      panelPower: panelType.power,
      capacityW: panels.length * panelType.power,
      panels: panels,
      hide: function() {
        if (!isVisible) return;
        panels.forEach( function(p, i) {
          p.setMap(null);
        });
        isVisible = false;
      },
      show: function() {
        if (isVisible) return;
        panels.forEach( function(p,i) {
          p.setMap(roof.getMap());
        });
        isVisible = true;
      },
      toString: function() {
        return this.capacityW + " [" + this.panelCount + ' x ' + this.panelPower + "] (" + this.panelType.brand + " " + this.panelType.code + (isVisible?" V":" ") + (this.rotated?"R":"") + ")";
      }
    }
  };

  var _fitPanelsToRoof = function() {
    // Clear existing panels
    if (roof.selectedPanelTypeIndex != null) {
      roof.selectedPanelType.hide();
    }

    resetPanelTypes();

    // Bounds poly must be visible for point-in-poly operations to work
    roof.boundsPoly.setMap(roof.getMap());

    panelTypes.forEach(function(_panelType, _panelTypeIndex) {
      panelLength = _panelType.length;
      panelWidth = _panelType.width;
      var panelsForArea = fillAreaWithRectangles(roof, roof.boundsPoly, panelLength/1000, panelWidth/1000);
      var isFinishedDrawing = true;
      var attempts = 0;
      while (!isFinishedDrawing) {
        panelsForArea.forEach(function () {
          isFinishedDrawing = isFinishedDrawing && !!panelsForArea.map;
        });
        if (!isFinishedDrawing && ++attempts < 99) console.warn("Still drawing panels... re-checking");
      }
      var panels = RoofPanelTypeManager(roof, _panelType, false, panelsForArea);
      roof.panelTypes.push(panels);
      roof.panelTypeCapacity[_panelType.order] = panels;
      showMostEfficientPanels(panels, roof, roof.panelTypes.length-1);

      // Now compute rotated capacity
      panelsForArea = fillAreaWithRectangles(roof, roof.boundsPoly, panelWidth/1000, panelLength/1000);
      isFinishedDrawing = true;
      attempts = 0;
      while (!isFinishedDrawing) {
        panelsForArea.forEach(function () {
          isFinishedDrawing = isFinishedDrawing && !!panelsForArea.map;
        });
        if (!isFinishedDrawing && ++attempts < 99) console.warn("Still drawing panels... re-checking");
      }
      panels = RoofPanelTypeManager(roof, _panelType, true, panelsForArea);
      roof.panelTypes.push(panels);
      if (panels.capacityW > roof.panelTypeCapacity[_panelType.order].capacityW) {
        roof.panelTypeCapacity[_panelType.order] = panels;
      }
      showMostEfficientPanels(panels, roof, roof.panelTypes.length-1);
    });
    roof.boundsPoly.setMap(null);
    roof.panelTypeCapacity[0] = roof.selectedPanelType;
  };

  var showMostEfficientPanels = function (panels, roof, thisIndex) {
//    console.log("showMostEfficientPanels called " + panels.capacityW + " vs " + roof.totalCapacityW);
    var capacity = panels.capacityW;
    if (capacity >= roof.totalCapacityW) {
      if (roof.selectedPanelTypeIndex != null) {
        roof.panelTypes[roof.selectedPanelTypeIndex].hide();
      }
      roof.totalCapacityW = capacity;
      roof.selectedPanelTypeIndex = thisIndex;
      roof.selectedPanelType = roof.panelTypes[roof.selectedPanelTypeIndex];
    } else {
      panels.hide();
    }
  };

  var fillAreaWithRectangles = function(roof, boundsPoly, panelLength, panelWidth) {
    var panels = [];
    path = boundsPoly.getPath();

    var startPt = path.getAt(2);
    var northPt = path.getAt(3);
    var eastPt = path.getAt(0);
    var nextRowStartPt = null;
    heading = google.maps.geometry.spherical.computeHeading(startPt, northPt);
    heading2 = google.maps.geometry.spherical.computeHeading(northPt, eastPt);

    var startOfRow = true;
    var newPolyPath = [];
    var isPolyInsideRoofArea = false;
    while (google.maps.geometry.poly.containsLocation(startPt, boundsPoly)) {
      var j = 0;
      while (google.maps.geometry.poly.containsLocation(startPt, boundsPoly)) {
//        console.log('Row Panel [' + j + '] - startPt (' + startPt.lat() + ',' + startPt.lng() + ')');
        newPolyPath = [];
        isPolyInsideRoofArea = false;
        newPolyPath.push(startPt); // Start at lower left bound
        newPolyPath.push(google.maps.geometry.spherical.computeOffset(newPolyPath[0], panelLength, heading));
        newPolyPath.push(google.maps.geometry.spherical.computeOffset(newPolyPath[1], panelWidth, heading2));
        newPolyPath.push(google.maps.geometry.spherical.computeOffset(newPolyPath[2], panelLength, heading + 180));
        var strokeColor = '#FFAA00';
        var fillColor = '#CCCCCC';
        var opacity = 0.45;
        if (google.maps.geometry.poly.containsLocation(newPolyPath[0], roof) && google.maps.geometry.poly.containsLocation(newPolyPath[1], roof)
          && google.maps.geometry.poly.containsLocation(newPolyPath[2], roof) && google.maps.geometry.poly.containsLocation(newPolyPath[3], roof)) {
          strokeColor = '#C7D0F0';
          fillColor = '#5C678C';
          opacity = 0.75;
          isPolyInsideRoofArea = true;
        }
        if (isPolyInsideRoofArea) {
          // Panel is inside roof polygon - include it
          newPolyPath.push(newPolyPath[0]);
          var panelPolygon = new google.maps.Polygon({
            paths: newPolyPath,
            strokeColor: strokeColor,
            strokeOpacity: opacity,
            strokeWeight: 1,
            fillColor: fillColor,
            fillOpacity: opacity,
            map: roof.getMap(),
            zIndex: 1
          });
          panels.push(panelPolygon);
        }
//        panelPolygon.setMap(boundsPoly.getMap());
//        this.panelPoly.push(panelPolygon);
//        }
        if (j == 0) nextRowStartPt = newPolyPath[3]; // Lower Right corner of first panel in row
        startPt = newPolyPath[1];
        j++;
      }
      startOfRow = true;
      startPt = nextRowStartPt;
    }
    return panels;
  };

  return {
    fitPanelsToRoof: function() {
      _fitPanelsToRoof();
    },
    show: function() {
      return roof.selectedPanelType && roof.selectedPanelType.show();
    },
    hide: function() {
      return roof.selectedPanelType && roof.selectedPanelType.hide();
    },
    getCapacityW: function() {
      return roof.selectedPanelType ? roof.selectedPanelType.capacityW : 0;
    },
    getPanelInfo: function() {
      return roof.selectedPanelType;
    },
    getPanels: function() {
      return roof.selectedPanelType ? roof.selectedPanelType.panels : [];
    },
    isRotated: function() {
      return roof.selectedPanelType && roof.selectedPanelType.rotated;
    },
    delete: function() {
      this.hide(); // Hide any selected panel first
      resetPanelTypes();
    }
  }
};