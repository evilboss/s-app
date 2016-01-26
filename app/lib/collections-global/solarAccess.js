SolarAccess = new Mongo.Collection('solar_access');

// Static dataset - created once in migrations - not updateable
SolarAccess.allow({
  insert: function (userId, doc) {
    return false;
  },
  update: function (userId, doc, fieldNames, modifier) {
    return false;
  },

  remove: function (userId, doc) {
    return false;
  }
});
