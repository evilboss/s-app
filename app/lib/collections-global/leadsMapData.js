// Stores all configuration data for this lead at time of creation
// Used to restore user configuration for reporting
LeadsMapData = new Mongo.Collection('leads-map-data');

Meteor.startup(function() {
  if (Meteor.isServer) {
    LeadsMapData._ensureIndex({"leadId": 1, "revision": 1}, {unique: 1});
  }
});