/**
 * CurrentLocationManager
 * Class to manage the user's current address (location) for geocompletion / geocoding
 * @returns {{clearLocation: clearLocation, setLocation: setLocation, getLocation: getLocation, isLocationDirty: isLocationDirty}}
 * @constructor
 */
CurrentLocationManager = function() {
  return {
    clearLocation: function () {
      Session.set('location', null);
      Session.set('locationAddress', null);
      Session.set('locationLL', null);
      Session.set('locationDirtyFlag', false);
    },
    setLocation: function (result) {
      if (result == null || typeof(result) == 'undefined' || typeof(result.geometry) == 'undefined'
        || result.geometry == null) {
        this.clearLocation();
      } else {
        Session.set('location', result.formatted_address);
        Session.set('locationAddress', result.address_components);
        Session.set('locationLL', {lng: result.geometry.location.lng(), lat: result.geometry.location.lat()});
        Session.set('locationDirtyFlag', false);
      }
    },
    getLocation: function () {
      return Session.get('location');
    },
    getLocationAddress: function() {
      return Session.get('locationAddress');
    },
    getLocationLL: function() {
      return Session.get('locationLL');
    },
    isLocationDirty: function () {
      return (Session.get('locationDirtyFlag') == true);
    }
  }
};