//Global variables

//Global Functions

var deparam = function (queryString) {
  var i, obj, pairs, split;
  obj = {};
  pairs = queryString.split('&');
  for (i in pairs) {
    split = pairs[i].split('=');
    obj[decodeURIComponent(split[0])] = decodeURIComponent(split[1]);
  }
  return obj;
};
var pathFor = function (path, view) {
  var query;
  if (!path) {
    throw new Error('no path defined');
  }
  query = view.hash.query ? deparam(view.hash.query) : {};
  return FlowRouter.path(path, view.hash, query);
};
var urlFor = function (path, view) {
  var relativePath;
  relativePath = pathFor(path, view);
  return Meteor.absoluteUrl(relativePath.substr(0));
};
var truncate = function (string, length) {
  var cleanString = _(string).stripTags();
  return _(cleanString).truncate(length);
};
var toArray = function (obj) {
  result = [];
  for (var key in obj) {
    result.push({name: key, value: obj[key]});
  }
  return result;

};

//Global Helpers
Template.registerHelper('truncate', truncate);
Template.registerHelper('pathFor', pathFor);
Template.registerHelper('urlFor', urlFor);
Template.registerHelper('toArray', toArray);


//Global Events
Template.body.events({});