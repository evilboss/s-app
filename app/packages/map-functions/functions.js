/**
 * Globally used map functions are declared here.
 */

/* globals MapFunctions: true */


MapFunctions = {

  /**
   * Initialise the map functions by extending Google Maps core classes
   * - LatLng.distanceTo(point)
   * - LatLng.rotate(angle, point)
   * - Point.rotate(angle, point)
   * - Polygon.getCenter()
   * - Polygon.rotate(angle, latLng, map)
   */
  init: _.once(function () {
    /**
     * google.maps.Polygon.rotate() - Calculates the Distance to another google.maps.LatLng object
     * @author Ahmad Nassri <ahmad@ahmadnassri.com> (http:/www.ahmadnassri.com/)
     * @repository https://github.com/ahmadnassri/google-maps-rotate
     * @license MIT
     *
     * @method distanceTo
     *
     * @param {Object} point A google.maps.LatLng object to compare to
     *
     * @return {Number} Returns distance in units
     */

    MapLabel.init();

    google.maps.LatLng.prototype.distanceTo = function (point) {
      var lat = Math.pow(this.lat() - point.lat(), 2);
      var lng = Math.pow(this.lng() - point.lng(), 2);

      return Math.sqrt(lat + lng);
    };


    /**
     * google.maps.Polygon.rotate() - Rotates a google.maps.LatLng relative to another google.maps.LatLng
     * @author Ahmad Nassri <ahmad@ahmadnassri.com> (http:/www.ahmadnassri.com/)
     * @repository https://github.com/ahmadnassri/google-maps-rotate
     * @license MIT
     *
     * @requires google.maps.LatLng.distanceTo
     *
     * @method rotate
     *
     * @param {Number} angle Degrees to rotate
     * @param {Object} point A google.maps.LatLng object to rotate relative to
     *
     * @return {Number} Returns A google.maps.LatLng with new coordinates
     */

    google.maps.LatLng.prototype.rotate = function (angle, origin) {
      var radianAngle = angle * (Math.PI / 180);

      var radius = this.distanceTo(origin);
      var theta = radianAngle + Math.atan2(this.lng() - origin.lng(), this.lat() - origin.lat());

      var x = origin.lat() + (radius * Math.cos(theta));
      var y = origin.lng() + (radius * Math.sin(theta));

      return new google.maps.LatLng(x, y);
    };

    /**
     * google.maps.Polygon.rotate() - Rotates a google.maps.Point relative to another google.maps.Point
     * @author Ahmad Nassri <ahmad@ahmadnassri.com> (http:/www.ahmadnassri.com/)
     * @repository https://github.com/ahmadnassri/google-maps-rotate
     * @license MIT
     *
     * @method rotate
     *
     * @param {Number} angle Degrees to rotate
     * @param {Object} point A google.maps.Point object to rotate relative to
     *
     * @return {Number} Returns A google.maps.Point with new coordinates
     */

    google.maps.Point.prototype.rotate = function (angle, origin) {
      var rad = angle * (Math.PI / 180);

      var x = this.x - origin.x;
      var y = this.y - origin.y;

      return new google.maps.Point(
        x * Math.cos(rad) - y * Math.sin(rad) + origin.x,
        x * Math.sin(rad) + y * Math.cos(rad) + origin.y
      );
    };

    /**
     * google.maps.Polyline.getBounds() - calculate a Polyline's bounds
     * Simpler version of Polygon.getBounds()
     */
    if (!google.maps.Polyline.prototype.getBounds) {
      google.maps.Polyline.prototype.getBounds = function () {
        var bounds = new google.maps.LatLngBounds(),
          path = this.getPath(),
          i;

        for (i = 0; i < path.getLength(); i++) {
          bounds.extend(path.getAt(i));
        }

        return bounds;
      };
    }

    /**
     * google.maps.Polygon.rotate() - Calculates a polygon's center point
     * @author Ahmad Nassri <ahmad@ahmadnassri.com> (http:/www.ahmadnassri.com/)
     * @repository https://github.com/ahmadnassri/google-maps-rotate
     * @license MIT
     *
     * @method getCenter
     *
     * @return {Object} A google.maps.LatLng object
     */
    if (!google.maps.Polygon.prototype.getCenter) {
      google.maps.Polygon.prototype.getCenter = function () {
        var coords = this.getPath().getArray();

        var bounds = new google.maps.LatLngBounds();

        coords.forEach(function (point, index) {
          bounds.extend(coords[index]);
        });

        return bounds.getCenter();
      };
    }

    /**
     * google.maps.Polygon.rotate() - Rotate a google.maps.Polygon relative to a google.maps.LatLng
     * @author Ahmad Nassri <ahmad@ahmadnassri.com> (http:/www.ahmadnassri.com/)
     * @repository https://github.com/ahmadnassri/google-maps-rotate
     * @license MIT
     *
     * @requires google.maps.LatLng.rotate
     * @requires google.maps.Polygon.getCenter
     *
     * @method rotate
     *
     * @param {Number} angle Degrees to rotate
     * @param {Object} point A google.maps.LatLng object to rotate relative to
     *
     * @return {Number} Returns A google.maps.LatLng with new coordinates
     */
    if (!google.maps.Polygon.prototype.rotate) {
      google.maps.Polygon.prototype.rotate = function (angle, latLng, map) {
        map = map || this.getMap();

        if (map === undefined) {
          console.warn('No valid google maps object found');
          return;
        }

        latLng = latLng || this.getCenter();

        var coords = this.getPath().getArray();
        var projection = map.getProjection();
        var origin = projection.fromLatLngToPoint(latLng);

        coords.forEach(function (point, index) {
          var pixelCoord = projection.fromLatLngToPoint(point).rotate(angle, origin);

          coords[index] = projection.fromPointToLatLng(pixelCoord);
        });

        this.setPaths(coords);
      };
    }

    /**
     * Rotate polygon remaining in LatLong space (ie. without LL->pixel->LL conversions
     * @param angle
     * @param latLng
     * @param map
     */
    if (!google.maps.Polygon.prototype.rotateLatLng) {
      google.maps.Polygon.prototype.rotateLatLng = function (angle, latLng, map) {
        map = map || this.getMap();

        if (map === undefined) {
          console.warn('No valid google maps object found');
          return;
        }

        latLng = latLng || this.getCenter();

        var coords = this.getPath().getArray();

        //var projection = map.getProjection();
        //var origin = projection.fromLatLngToPoint(latLng);

        coords.forEach(function (point, index) {
          coords[index] = point.rotate(angle, latLng);

          //coords[index] = projection.fromPointToLatLng(pixelCoord);
        });

        this.setPaths(coords);
      };
    }

    if (!google.maps.Polygon.prototype.getLongestEdge) {
      google.maps.Polygon.prototype.getLongestEdge = function() {
        var path = this.getPath().getArray();
        var longest = 0, edgeLength = 0, edgePath = [], longEdgePath = [];
        for (p=0; p<path.length; p++) {
          if (p<path.length-1) {
            edgeLength = path[p].distanceTo(path[p+1]);
            edgePath = [path[p],path[p+1]];
          } else {
            edgeLength = path[p].distanceTo(path[0]);
            edgePath = [path[p], path[0]];
          }
          if (edgeLength > longest) {
            longest = edgeLength;
            longEdgePath = edgePath;
          }
        }
        return new google.maps.Polyline({path: longEdgePath});
      }
    }
    // Polygon getBounds extension - google-maps-extensions
    // https://github.com/tparkin/Google-Maps-Point-in-Polygon
    // http://code.google.com/p/google-maps-extensions/source/browse/google.maps.Polygon.getBounds.js
    if (!google.maps.Polygon.prototype.getBounds) {
      google.maps.Polygon.prototype.getBounds = function () {
        var bounds = new google.maps.LatLngBounds(),
          paths = this.getPaths(),
          path,
          p, i;

        for (p = 0; p < paths.getLength(); p++) {
          path = paths.getAt(p);
          for (i = 0; i < path.getLength(); i++) {
            bounds.extend(path.getAt(i));
          }
        }

        return bounds;
      };
    }

    /**
     * google.maps.Polygon.getAreaSqm() - calculate area of polygon in sq. meters
     * Convenience wrapper around spherical computeArea(...)
     */
    if (!google.maps.Polygon.prototype.getAreaSqm) {
      google.maps.Polygon.prototype.getAreaSqm = function () {
        return google.maps.geometry.spherical.computeArea(this.getPath());
      }
    }

    // Polygon containsLatLng - method to determine if a latLng is within a polygon
    google.maps.Polygon.prototype.containsLatLng = function (latLng) {
      // Exclude points outside of bounds as there is no way they are in the poly

      var inPoly = false,
        bounds, lat, lng,
        numPaths, p, path, numPoints,
        i, j, vertex1, vertex2;

      // Arguments are a pair of lat, lng variables
      if (arguments.length == 2) {
        if (
          typeof arguments[0] == "number" &&
          typeof arguments[1] == "number"
        ) {
          lat = arguments[0];
          lng = arguments[1];
        }
      } else if (arguments.length == 1) {
        bounds = this.getBounds();

        if (!bounds && !bounds.contains(latLng)) {
          return false;
        }
        lat = latLng.lat();
        lng = latLng.lng();
      } else {
        console.log("Wrong number of inputs in google.maps.Polygon.prototype.contains.LatLng");
      }

      // Raycast point in polygon method

      numPaths = this.getPaths().getLength();
      for (p = 0; p < numPaths; p++) {
        path = this.getPaths().getAt(p);
        numPoints = path.getLength();
        j = numPoints - 1;

        for (i = 0; i < numPoints; i++) {
          vertex1 = path.getAt(i);
          vertex2 = path.getAt(j);

          if (
            vertex1.lng() < lng &&
            vertex2.lng() >= lng ||
            vertex2.lng() < lng &&
            vertex1.lng() >= lng
          ) {
            if (
              vertex1.lat() +
              (lng - vertex1.lng()) /
              (vertex2.lng() - vertex1.lng()) *
              (vertex2.lat() - vertex1.lat()) <
              lat
            ) {
              inPoly = !inPoly;
            }
          }

          j = i;
        }
      }

      return inPoly;
    };
  })
};
