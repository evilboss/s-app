Panels = new Mongo.Collection('panels');

Panels.attachSchema(new SimpleSchema({
  brand: {
    optional: false,
    type: String,
    label: "Brand",
    max: 50
  },
  code: {
    optional: false,
    type: String,
    label: "Code",
    max: 50
  },
  power:{
    optional: false,
    type: Number
  },
  length:{
    optional: false,
    type: Number
  },
  width:{
    optional: false,
    type: Number
  },
  order: {
    optional: true,
    type: Number
  }
}));

// Static dataset - created once in migrations.js - NOT updateable by client/app
Panels.allow({
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