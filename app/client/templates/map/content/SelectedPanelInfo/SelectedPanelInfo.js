Template.selectedPanelInfo.helpers({

  //getSavingsImage: function () {
  //  return getSavingsImageFunction();
  //},
  getEstimatedCost: function () {
    return MapData.findOne().estimatedCost;
  },
  getEstimatedSavings: function () {
    if (Session.get('YearlyCost')) {
      var nightUsage = 75;
      if (Session.get('nightUsage')) {
        nightUsage = Session.get('nightUsage');
      }
      var dailyUsage = Math.round(parseInt(Math.abs(nightUsage - 100)));
      return Math.round(parseInt(Session.get('YearlyCost')) / dailyUsage);
    }
    return 0;
  },
  //add you helpers here
  selectedRoofClass: function() {
    if (MapData.findOne() == undefined || MapData.findOne().totalPanelCount == undefined) return "noRoofSelected";
    return MapData.findOne().selectedRoof == null ? "noRoofSelected" : "roofSelected";
  },
  getNumberColumns: function() {
    return 4;
  },
  getHeading: function() {
    if (MapData.findOne() == undefined || MapData.findOne().totalPanelCount == undefined) return "";
    return MapData.findOne().selectedRoof == null ? "All Roof Sections (Total)" : "Selected Roof";
  },
  getPanelCount: function () {
    if (MapData.findOne() == undefined || MapData.findOne().totalPanelCount == undefined) return "";
    return MapData.findOne().selectedRoof == null ? MapData.findOne().totalPanelCount : MapData.findOne().selectedRoof.panelCount;
  },
  getArea: function () {
    if (MapData.findOne() == undefined || MapData.findOne().totalPanelCount == undefined) return "";
    return (MapData.findOne().selectedRoof == null ? MapData.findOne().totalAreaSqm : MapData.findOne().selectedRoof.areaSqm).toFixed(1);
  },
  getSize: function () {
    if (MapData.findOne() == undefined || MapData.findOne().totalPanelCount == undefined) return "";
    return (MapData.findOne().selectedRoof == null ? MapData.findOne().systemCapacity: MapData.findOne().selectedRoof.size).toFixed(1);
  },
  getCapacity: function () {
    if (MapData.findOne() == undefined || MapData.findOne().systemCapacity == undefined) return "";
    return (MapData.findOne().selectedRoof == null ? MapData.findOne().systemCapacity : MapData.findOne().selectedRoof.capacity).toFixed(2);
  },
  getFacing: function () {
    if (MapData.findOne() == undefined || MapData.findOne().systemCapacity == undefined) return "";
    return MapData.findOne().selectedRoof == null ? 'N/A' : MapData.findOne().selectedRoof.facing;
  },
  getRoofTilt: function() {
    if (MapData.findOne() == undefined || MapData.findOne().systemCapacity == undefined) return 0;
    return MapData.findOne().selectedRoof == null ? 0 : MapData.findOne().selectedRoof.roofAngle;
  },
  getPanelPower: function() {
    if (MapData.findOne() == undefined || MapData.findOne().systemCapacity == undefined) return 0;
    return MapData.findOne().selectedRoof == null ? 0 : MapData.findOne().selectedRoof.power;
  }
});

Template.selectedPanelInfo.events({
  //add your events here
});

Template.selectedPanelInfo.onCreated(function () {
  //add your statement here
});

Template.selectedPanelInfo.onRendered(function () {
  //add your statement here
});

Template.selectedPanelInfo.onDestroyed(function () {
  //add your statement here
});

