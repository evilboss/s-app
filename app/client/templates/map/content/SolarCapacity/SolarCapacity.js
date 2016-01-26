var getNightUsage = function () {
  var nightUsage = 65;

  var currentProfile = MapData.findOne().userProfile;
  if (!!currentProfile && !!currentProfile.usageGraphData) {
    nightUsage = currentProfile.usageGraphData[1][1];
  }

  return Math.ceil(nightUsage * .9,0);
};

Template.SolarCapacity.helpers({
  getNightCap: function () {
    return getNightUsage();
  },
  getDayCap: function () {
    return parseInt(Math.abs(getNightUsage() - 90));
  },
  /**
   * getPanelPercentage returns panel percentage and gives our custom bar graph its height,
   * if the computed value is greater than 100 it will default to 100
   * @method getPanelPercentage
   */
  getPanelPercentage: function () {
//        var localData = MapData.findOne();

    if (! MapData.findOne().panelCapacity) return 0;
    if ( MapData.findOne().panelCapacity.length < 1) return 0;

    var panelCapacity = MapData.findOne().panelCapacity[0].capacityW;
    var dailyUsage = userProfileManager.getUserProfile().kwh;

    if (typeof(dailyUsage) == 'undefined') dailyUsage = 21.0;

    var totalSystemOutput = Math.max(1.111, Math.min(Math.round((panelCapacity / dailyUsage) * 100), 100));

    // Scale the total output
    // If we are making more than we need, then set to 97% (i.e. most of future usage)
    // If we are still within dailyUsage range, then scale by 90% to allow for 10% height of Future Usage section
    return panelCapacity > dailyUsage ? 97 : .9 * totalSystemOutput;
  },
  getPanelArray: function () {
    return MapData.findOne();
  },
  isGeneric: function (index) {
    if (index == 5) {
      return true;
    }
  },
  isYourSystem: function (index) {
    if (index == 0) {
      return true;
    }
  },

  getAdjustedIndex: function (index) {
    return parseInt(index) + 1;
  }
});

Template.SolarCapacity.events({
  //add your events here
});

Template.SolarCapacity.onCreated(function () {
  //add your statement here
});

Template.SolarCapacity.onRendered(function () {
  //add your statement here
});

Template.SolarCapacity.onDestroyed(function () {
  //add your statement here
});

