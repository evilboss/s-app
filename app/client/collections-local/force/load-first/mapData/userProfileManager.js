/**
 * UserProfileManager
 * Stores the current user's profile in the local MapData store
 * This is the current state of the UI - and is used for all reactive UI elements
 * Data is copied to the Leads collection once user enters email address
 * Data is loaded from the Leads collection to display reports and allow changes
 * Profile is reset on change of address
 * @returns {{initializeUserProfile: initializeUserProfile, getUserProfile: getUserProfile, updateUserProfile: updateUserProfile}}
 * @constructor
 */
UserProfileManager = function() {
  var _defaultProfile = {
    monthlyCost: 200,
    usageGraphData: [['General', 25],['Non-solar (night-time)', 75]]
    //kwh: 21.00,
    //isKwhSetByUser: false
  };

  var _getProfile = function() {
    if (typeof (MapData.findOne()) == 'undefined' || typeof(MapData.findOne().userProfile) == 'undefined') return _defaultProfile;
    return MapData.findOne().userProfile;
  };

  var _saveProfile = function(newProfile) {
    var updProfile = {};
    $.extend(updProfile, _defaultProfile);
    $.extend(updProfile, _getProfile());
    $.extend(updProfile, newProfile);
    var id = MapData.findOne()._id;
    MapData.update({_id: id},
      {
        $set: {
          userProfile: updProfile
        }
      });
  };

  return {
    initializeUserProfile: function() {
      _saveProfile();
    },
    getUserProfile: function() {
      return _getProfile();
    },
    updateUserProfile: function(newVals) {
      _saveProfile(newVals);
    }
  }
};
userProfileManager = UserProfileManager();
