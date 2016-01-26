/**
 * Created by steveovens on 7/10/2015.
 */


SolarQuote.Utils = {
  selectedRoofArea: null, // Currently selected roof area polygon
  roofArea: [], // All roof area polygons

  CurrentLocationManager: CurrentLocationManager(),

  selectedPoly: null, // Currently selected area polygon
  polyArray: [], // All area polygons
  panelPoly: [], // All panel polygons

  getSelectedPoly: function () {
    return this.selectedPoly;
  },
  getPolyArray: function () {
    return this.polyArray;
  },
  addNewArea: function (poly) {
    this.polyArray.push(poly);
  },
  clearExisting: function () {
    if (this.selectedPoly) {
      this.deleteSelectedPoly();
    }
    for (i = this.polyArray.length - 1; i >= 0; --i) {
      this.polyArray[i].setMap(null);
      this.polyArray[i] = null;
    }
    this.polyArray = [];
    for (i = this.panelPoly.length - 1; i >= 0; --i) {
      this.panelPoly[i].setMap(null);
      this.panelPoly[i] = null;
    }
  },

  selectPolyFromPoint: function (latLng) {
    for (var i = this.polyArray.length - 1; i >= 0; --i) {
      if (this.polyArray[i].containsLatLng(latLng)) {
        return this.polyArray[i];
      }
    }

    //for (var i = this.panelPoly.length-1; i >= 0; --i) {
    //    if (this.panelPoly[i].containsLatLng(latLng)) {
    //        return this.panelPoly[i];
    //    }
    //}
  },

  showSelectedPoly: function (newPoly) {
    if (this.selectedPoly == newPoly) return; // Nothing has changed
    if (this.selectedPoly) {
      this.selectedPoly.setOptions({fillColor: 'red', strokeColor: 'red', strokeWeight: 4});
    }
    this.selectedPoly = newPoly;
    if (newPoly) {
      newPoly.setOptions({fillColor: 'green', strokeColor: 'green', strokeWeight: 6});
    }
  },

  deleteSelectedPoly: function () {
    if (this.selectedPoly) {
      for (var i = this.polyArray.length - 1; i >= 0; --i) {
        if (this.polyArray[i] === this.selectedPoly) {
          this.polyArray.splice(i, 1);
          break;
        }
      }
      this.selectedPoly.setMap(null);
      this.selectedPoly = null;
    }
  },

  getCorners: function (bounds) {
    if (!bounds) return null;

    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();
    var southWest = new google.maps.LatLng(sw.lat(), sw.lng());
    var northEast = new google.maps.LatLng(ne.lat(), ne.lng());
    var southEast = new google.maps.LatLng(sw.lat(), ne.lng());
    var northWest = new google.maps.LatLng(ne.lat(), sw.lng());
    return [southWest, northWest, northEast, southEast];
  },

  /*
   * Compute the sq. m of a rectangle based on spherical coords (lat/long)
   */
  computeRectangleArea: function (bounds) {
    if (!bounds) {
      return 0;
    }
    return google.maps.geometry.spherical.computeArea(this.getCorners(bounds));
  },

  /**
   * Returns the length and width of a given
   * @param bounds
   * @returns {*}
   */
  computeLengthWidth: function (bounds) {
    if (!bounds) return null;

    var corners = this.getCorners(bounds); // corners[] starts lower-left - runs [sw, nw, ne, se]

    // edge1 = northwest to southwest corner = length
    // edge2 = northwest to northeast corner = width
    var edge1 = google.maps.geometry.spherical.computeDistanceBetween(corners[1], corners[0]) * 1000;
    var edge2 = google.maps.geometry.spherical.computeDistanceBetween(corners[1], corners[2]) * 1000;

    return {length: edge1, width: edge2};
  },

  convertRectangleToPolygon: function (bounds) {
    if (!bounds) {
      return null;
    }

    var corners = this.getCorners(bounds);

    corners.push(corners[0]); // Close the polygon - add first corner to end of array

    //// Define the LatLng coordinates for the polygon's path.
    //var polyCoords = [
    //    corners[0],
    //    corners[1],
    //    corners[2],
    //    corners[3],
    //    corners[0]
    //];

    // Construct the polygon.
    var thePolygon = new google.maps.Polygon({
      paths: corners,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });
    //thePolygon.setMap(map);
    return thePolygon;
  },

  convertRectangleToPolygonJSON: function (bounds) {
    if (!bounds) {
      return null;
    }

    var corners = this.getCorners(bounds);

    corners.push(corners[0]);

    //var sw = bounds.getSouthWest();
    //var ne = bounds.getNorthEast();

    return {
      "type": "Feature",
      "id": 1234,
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            corners
            //[sw.lng(), sw.lat()], [ne.lng(), sw.lat()], [ne.lng(), ne.lat()], [sw.lng(), ne.lat()],
            //[sw.lng(), sw.lat()]
          ]
        ]
      }
    }
  },

  fitPanelsToArea: function (areaBounds, panelLength, panelWidth) {
    if (!areaBounds) return null;

    lengthWidth = this.computeLengthWidth(areaBounds);

    // See if panel can fit in rectangle user has drawn

    // If first edge is smaller than panel length or second edge is less than panel length
    // then panel will not fit unrotated.

    // if first edge is smaller than panel width or second edge is is less than panel length
    // then panel will not fit rotated

    // If panel will not fit unrotated AND panel will not fit rotated
    // then panel does not fit area
    var panelFitsUnrotated = true;
    var panelFitsRotated = true;
    if ((lengthWidth.length < panelLength) ||
      (lengthWidth.width < panelWidth)) {
      panelFitsUnrotated = false;
    }

    if ((lengthWidth.length < panelWidth) ||
      (lengthWidth.width < panelLength)) {
      panelFitsRotated = false;
    }

    if (!(panelFitsRotated || panelFitsUnrotated)) {
      return {
        unrotated: {
          fits: panelFitsUnrotated
        },
        rotated: {
          fits: panelFitsRotated
        }
      };
    }

    var panelsAcrossUnrotated = Math.floor(lengthWidth.width / panelWidth);
    var panelsDownUnrotated = Math.floor(lengthWidth.length / panelLength);
    var remainingSpaceAcrossUnrotated = lengthWidth.width - (panelsAcrossUnrotated * panelWidth);
    var remainingSpaceDownUnrotated = lengthWidth.length - (panelsDownUnrotated * panelLength);
    var unrotatedExtraAcrossPanelsAcross = 0;
    var unrotatedExtraAcrossPanelsDown = 0;

    if (remainingSpaceAcrossUnrotated > panelLength && lengthWidth.length > panelWidth) {
      // Can fit at least one panel rotated on it's side beside the panel array
      unrotatedExtraAcrossPanelsAcross = Math.floor(remainingSpaceAcrossUnrotated / panelLength); // Usually = 1
      unrotatedExtraAcrossPanelsDown = Math.floor(lengthWidth.length / panelWidth);
    }

    var panelsAcrossRotated = Math.floor(lengthWidth.width / panelLength);
    var panelsDownRotated = Math.floor(lengthWidth.length / panelWidth);
    var remainingSpaceAcrossRotated = lengthWidth.width - (panelsAcrossRotated * panelLength);
    var remainingSpaceDownRotated = lengthWidth.length - (panelsDownRotated * panelWidth);
    var rotatedExtraDownPanelsAcross = 0;
    var rotatedExtraDownPanelsDown = 0;

    if (remainingSpaceDownRotated > panelLength && lengthWidth.width > panelWidth) {
      // Can fit at least one panel rotated on it's side above the panel array
      rotatedExtraDownPanelsAcross = Math.floor(lengthWidth.width / panelWidth);
      rotatedExtraDownPanelsDown = Math.floor(remainingSpaceDownRotated / panelLength); // Usually = 1

    }

    return {
      unrotated: {
        fits: panelFitsUnrotated,
        across: panelsAcrossUnrotated,
        down: panelsDownUnrotated,
        extraPanelsAcross: unrotatedExtraAcrossPanelsAcross,
        extraPanelsDown: unrotatedExtraAcrossPanelsDown,
        remainingSpaceAcross: remainingSpaceAcrossUnrotated,
        remainingSpaceDown: remainingSpaceDownUnrotated,
        totalPanels: (panelsAcrossUnrotated * panelsDownUnrotated)
        // + (unrotatedExtraAcrossPanelsAcross * unrotatedExtraAcrossPanelsDown)
      },
      rotated: {
        fits: panelFitsRotated,
        across: panelsAcrossRotated,
        down: panelsDownRotated,
        extraPanelsDown: rotatedExtraDownPanelsDown,
        extraPanelsAcross: rotatedExtraDownPanelsAcross,
        remainingSpaceAcross: remainingSpaceAcrossRotated,
        remainingSpaceDown: remainingSpaceDownRotated,
        totalPanels: (panelsAcrossRotated * panelsDownRotated)
        // + (rotatedExtraDownPanelsAcross * rotatedExtraDownPanelsDown)
      }
    };
  },

  fillPolyWithPanels: function (poly, panelLength, panelWidth) {
    if (!poly || !poly.panelFit) return;
    panelLength /= 1000.0;
    panelWidth /= 1000.0;
    var isRotated = false;
    var across = poly.panelFit.unrotated.across;
    var down = poly.panelFit.unrotated.down;
    var extraAcross = poly.panelFit.unrotated.extraPanelsAcross;
    var extraDown = poly.panelFit.unrotated.extraPanelsDown;
    if (poly.panelFit.rotated.totalPanels > poly.panelFit.unrotated.totalPanels) {
      // Panel fits better rotated - swap panel length/width
      var tmpPanelLength = panelLength;
      panelLength = panelWidth;
      panelWidth = tmpPanelLength;
      isRotated = true;
      across = poly.panelFit.rotated.across;
      down = poly.panelFit.rotated.down;
      extraAcross = poly.panelFit.rotated.extraPanelsAcross;
      extraDown = poly.panelFit.rotated.extraPanelsDown;
    }
    path = poly.getPath();
    var startPt = path.getAt(0);
    var northPt = path.getAt(1);
    var eastPt = path.getAt(2);
    var nextRowStartPt = null;
    var extraRowStartPt = null;
    heading = google.maps.geometry.spherical.computeHeading(startPt, northPt);
    heading2 = google.maps.geometry.spherical.computeHeading(northPt, eastPt);

    for (i = 0; i < across; i++) {
      for (j = 0; j < down; j++) {
        var newPolyPath = [];
        newPolyPath.push(startPt); // Start at lower left bound
        newPolyPath.push(google.maps.geometry.spherical.computeOffset(newPolyPath[0], panelLength, heading));
        newPolyPath.push(google.maps.geometry.spherical.computeOffset(newPolyPath[1], panelWidth, heading2));
        newPolyPath.push(google.maps.geometry.spherical.computeOffset(newPolyPath[2], panelLength, heading + 180));
        newPolyPath.push(newPolyPath[0]);
        var panelPolygon = new google.maps.Polygon({
          paths: newPolyPath,
          strokeColor: '#FFFFFF',
          strokeOpacity: 0.7,
          strokeWeight: 1,
          fillColor: '#222222',
          fillOpacity: 0.75
        });
        panelPolygon.setMap(poly.getMap());
        this.panelPoly.push(panelPolygon);
        if (j == 0) nextRowStartPt = newPolyPath[3]; // Lower Right corner of first panel in row
        startPt = newPolyPath[1];
      }
      if (isRotated && i == 0) {
        extraRowStartPt = newPolyPath[1]; // Top Left corner of top panel
      }
      startPt = nextRowStartPt;
    }
    /*
     // SJO - remove "extra" rows - we would burn out the micro-inverter if we did this!
     if (!isRotated) extraRowStartPt = nextRowStartPt;
     startPt = extraRowStartPt;
     // Flip panel length / width (rotate panel for drawing)
     var tmpPanelLength = panelLength;
     panelLength = panelWidth;
     panelWidth = tmpPanelLength;

     for (i = 0; i < extraAcross; i++) {
     for (j = 0; j < extraDown; j++) {
     var newPolyPath = [];
     newPolyPath.push(startPt); // Start at lower left bound
     newPolyPath.push(google.maps.geometry.spherical.computeOffset(newPolyPath[0], panelLength, heading));
     newPolyPath.push(google.maps.geometry.spherical.computeOffset(newPolyPath[1], panelWidth, heading2));
     newPolyPath.push(google.maps.geometry.spherical.computeOffset(newPolyPath[2], panelLength, heading+180));
     newPolyPath.push(newPolyPath[0]);
     var panelPolygon = new google.maps.Polygon({
     paths: newPolyPath,
     strokeColor: '#FFFFFF',
     strokeOpacity: 0.7,
     strokeWeight: 1,
     fillColor: '#222222',
     fillOpacity: 0.75
     });
     panelPolygon.setMap(poly.getMap());
     if (j == 0) nextRowStartPt = newPolyPath[3]; // Lower Right corner of first panel in row
     startPt = newPolyPath[1];
     }
     startPt = nextRowStartPt;
     }
     */
    poly.setMap(null);
  }
};