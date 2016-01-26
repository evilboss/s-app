Template.page4.helpers({
  area: function() {
    var data = MapData.findOne();
    return Math.round(data.totalAreaSqm);
  },
  capacity: function() {
    var data = MapData.findOne();
    return Math.round(data.systemCapacity);
  },
  totalPanel: function() {
    var data = MapData.findOne();
    return data.totalPanelCount;
  },

});
