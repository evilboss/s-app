Template.checkItem.helpers({
  //add you helpers here
  isChecked: function(id) {
    console.log("checking: " + id);
    var currentProfile = MapData.findOne().userProfile;
    var currentState = [];
    if (!!currentProfile) {
      currentState = currentProfile.usageProfile;
    }
    console.dir(currentState);
    return _.contains(currentState, id)?"checked":"";
  }
});

Template.checkItem.events({
  //add your events here
});

Template.checkItem.onCreated(function () {
  //add your statement here
});

Template.checkItem.onRendered(function () {
  //add your statement here
});

Template.checkItem.onDestroyed(function () {
  //add your statement here
});

