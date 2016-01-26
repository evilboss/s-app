Meteor.publish("solar-access", function (city) {
  return SolarAccess.find({name:city});
});

Meteor.startup(function () {
  SolarAccess._ensureIndex({ "name": 1, "azimuth": 1}, {unique:true});
});