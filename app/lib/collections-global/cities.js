Cities = new Mongo.Collection('cities');

// Static dataset - created once in migrations - not updateable
Cities.allow({
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