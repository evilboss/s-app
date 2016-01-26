Template.home.helpers({
  geolocationError: function () {
    var error = Geolocation.error();
    return error && error.message;
  },
  currentLocation: function () {
    return SolarQuote.Utils.CurrentLocationManager.getLocation();
  },
  geoLocationSet: function () {
    var curLocation = SolarQuote.Utils.CurrentLocationManager.getLocation();
    var dirtyFlag = SolarQuote.Utils.CurrentLocationManager.isLocationDirty();
    return (curLocation && !dirtyFlag) ? '' : 'disabled';
  }
});

Template.home.events({

  'click .current-location': function () {
    var _tpt = Template.instance();

    if (GoogleMaps.loaded()) {
      _tpt.$('#roofLocation').prop('placeholder', 'Attempting to match your current location...');
      _tpt.$('#roofLocation').val('');
      SolarQuote.Utils.CurrentLocationManager.clearLocation();
      MapData.remove({}); // Clear MapData
      MapData.insert({}); // Re-initialise MapData store

      var geocodePoller = {
        // How frequently to check - in milliseconds
        interval: 300,

        attempts: 0,

        init: function () {
          setTimeout(
            $.proxy(this.tryGeocode, this),
            this.interval
          );
        },

        tryGeocode: function () {
          var self = this;

          var latlng = Geolocation.latLng();

          if (latlng == null) {
            // Note: Does not affect current location or locationDirtyFlag - so existing location is NOT overwritten on failure
            self.attempts++;
            if (self.attempts < 25) {
              self.init();
            } else {
              _tpt.$('#roofLocation').prop('placeholder', 'Unable to match your location. Please enter your address or try again');
              console.warn("Too many attempts or blocked by browser permissions - geolocation failed!");
            }
          } else {
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({
              location: latlng
            }, function (results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                if (results) {
                  for (var i in results) {
                    if ($.inArray('street_address', results[i].types) == 0) {
                      SolarQuote.Utils.CurrentLocationManager.setLocation(results[i]);
                      break;
                    }
                    // SJO - Removed match on just street
                    //if ($.inArray('route', results[i].types) == 0) {
                    //  Session.set('location', results[i].formatted_address);
                    //  Session.set('locationDirtyFlag', false);
                    //  break;
                    //}
                  }
                  _tpt.$('#roofLocation').val(results[i].formatted_address);
                  _tpt.$('#roofLocation').prop('placeholder', "Enter Your Address to Create Your Free Custom Solar Power Plan...");
                } else {
                  _tpt.$('#roofLocation').prop('placeholder', 'Unable to match your location. Please enter your address');
                  SolarQuote.Utils.CurrentLocationManager.clearLocation();
                  _tpt.$('#roofLocation').val('');
                }
              } else {
                _tpt.$('#roofLocation').prop('placeholder', 'Unable to match your location. Please enter your address');
                SolarQuote.Utils.CurrentLocationManager.clearLocation();
                _tpt.$('#roofLocation').val('');
                //This is intentionaly removed because we dont want an error when the geolocation is turned off
                // window.alert('Geocoder failed due to: ' + status);
              }

            });
          }
        }
      };
      // Kick off the geocoder attempts
      geocodePoller.init();
    }
  },

  'click #lookAtMap': function () {
    var _tpt = Template.instance();

    Session.set('currentStep', 'MyRoof');
    var address = $('#roofLocation').val();
    if (address) {
      var geocoder = new google.maps.Geocoder;
      geocoder.geocode({
        address: address,
        componentRestrictions: {country: 'AU'},
        region: 'AU'
      }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          var currentMap = MapData.findOne();
          MapData.update({_id: currentMap._id}, {
            $set: {
              location: address,
              buildingType: Session.get('buildingType')
            }
          });
          FlowRouter.go('map');
          return;
        } else {
          _tpt.$('#roofLocation').prop('placeholder', 'Unable to verify location. Please try again.');
          SolarQuote.Utils.CurrentLocationManager.clearLocation();
          _tpt.$('#roofLocation').val('');
        }
      });
    } else {
      //window.alert('We must get your address');
    }
  },
  'keyup #roofLocation': function () {
    var address = ($('#roofLocation').val()).trim();
    if (address == '') {
      Session.set('location', null);
    } else {
      // If user has edited previously geocompleted address, then set locationDirtyFlag (disables "next" button)
      curLocation = Session.get('location');
      if (address != curLocation) {
        Session.set('locationDirtyFlag', true);
      } else {
        Session.set('locationDirtyFlag', false);
      }
    }
  },
  'blur #roofLocation': function () {
    var _tpt = Template.instance();

    var address = (_tpt.$('#roofLocation').val()).trim();
    if (address == '') {
      SolarQuote.Utils.CurrentLocationManager.clearLocation();
    }

    if (address.length < 6) return; // Do NOT geocode really short addresses

    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({
      address: address,
      componentRestrictions: {country: 'AU'},
      region: 'AU'
    }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        Session.set('locationDirtyFlag', true); // Force to only accept geocoded results
        for (var i in results) {
          if ($.inArray('street_address', results[i].types) == 0) {
            SolarQuote.Utils.CurrentLocationManager.setLocation(results[i]);
            $('#roofLocation').val(results[i].formatted_address);
            Session.set('locationDirtyFlag', false);
            break;
          }
          //if ($.inArray('route', results[i].types) == 0) {
          //  Session.set('location', results[i].formatted_address);
          //  Session.set('locationDirtyFlag', false);
          //  break;
          //}
        }

        _tpt.$('#roofLocation').prop('placeholder', "Enter Your Address to Create Your Free Custom Solar Power Plan...");
      } else {
        SolarQuote.Utils.CurrentLocationManager.clearLocation();
      }
    });
  }
});

Template.home.onRendered(function () {
  Session.setDefault('currentStep', 'MyRoof');
  if (MapData.find().count() == 0) MapData.insert({});
  $('.ui.accordion').accordion();
  this.autorun(function () {
    if (GoogleMaps.loaded()) {
      $('#roofLocation').geocomplete({
          componentRestrictions: {country: 'au'},
          types: ['address'],
          region: 'au',
          country: 'au'
        })
        .bind("geocode:result", function (event, result) {
          SolarQuote.Utils.CurrentLocationManager.setLocation(result);
        });

    }
  });

});
