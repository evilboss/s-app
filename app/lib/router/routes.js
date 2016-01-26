// Note: @global homesubs Subscription manager -  see: https://github.com/kadirahq/subs-manager
homeSubs = new SubsManager({cacheLimit: 9999, expireIn: 9999});
homeSubs.subscribe('panels');
homeSubs.subscribe('cities');
homeSubs.subscribe('chart_data');
homeSubs.subscribe('roof_angles');

FlowRouter.route(['/', '/home'], {
  name: 'home',
  action: function (params) {
    BlazeLayout.render("appLayout", {area: "home"});
  }
});

FlowRouter.route('/map', {
  name: 'map',
  action: function (params, queryParams) {
    BlazeLayout.render("mapLayout", {area: "map", controlls: 'Usage'});
  }
});

// See also router/reports/report-routes.js for more routes



// TODO - Are these routes actually used in the app - if not, then remove?
FlowRouter.route('/pdf', {
  name: 'pdf',
  action: function (params, queryParams) {
    BlazeLayout.render("pdfLayout", {area: "pdf", content: 'page1'});
  }
});

FlowRouter.route(['/usage'], {
  name: 'usage',
  action: function (params) {
    BlazeLayout.render("appLayout", {area: "UsageBarChart"});
  }
});

FlowRouter.route(['/thankyou'], {
  name: 'thankYou',
  action: function (params) {
    BlazeLayout.render("appLayout", {area: "thankYou"});
  }
});

FlowRouter.route('/dashboard', {
  action: function (params) {
    BlazeLayout.render("appLayout", {area: "dashboard"});
  }

});