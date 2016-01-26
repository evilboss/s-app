Template.MyRoof.helpers({
  loading: function() {
    return !Template.instance().ready;
  },
  angles: function () {
    return RoofAngles.find({});
  }
});

Template.MyRoof.events({
  'click .pitch input': function (e) {
    MapData.update({}, {$set: {pitchSettings: e.currentTarget.value}});
  }
});


Template.MyRoof.onCreated(function () {
  var self = this;
  self.ready = new ReactiveVar();
  self.autorun(function () {
    var handle = homeSubs.subscribe('roof_angles');
    self.ready.set(handle.ready());
  });

});

Template.MyRoof.onRendered(function () {
  Session.set("closeTab", true);
});

Template.MyRoof.onDestroyed(function () {
  Session.set("closeTab", false);
});
