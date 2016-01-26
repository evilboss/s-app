Meteor.publish("cities", function () {
  return Cities.find();
});

Meteor.startup(function () {
  Cities._ensureIndex({ "name": 1}, {unique: true});
});