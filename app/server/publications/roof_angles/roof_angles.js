Meteor.publish("roof_angles", function () {
  return RoofAngles.find();
});