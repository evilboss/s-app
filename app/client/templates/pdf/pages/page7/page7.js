Template.page7.helpers({
  getStateShortname: function() {
    var state = MapData.findOne().addressParts[2].short_name;
    return state.toLowerCase();
  },
  getState: function() {
    var state = MapData.findOne().addressParts[2].long_name;
    return state.toLowerCase();
  }
});
