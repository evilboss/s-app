FlowRouter.route('/reports', {
  name: 'reports',
  triggersEnter: [],
  subscriptions: function (params, queryParams) {

  },
  action: function (params, queryParams) {

    BlazeLayout.render("pdfLayout");
  },
  triggersExit: []
});

FlowRouter.route('/area-chart', {
  name: 'area-chart',
  triggersEnter: [],
  subscriptions: function (params, queryParams) {

  },
  action: function (params, queryParams) {

    BlazeLayout.render("appLayout", {area: "AreaChart"});
  },
  triggersExit: []
});
FlowRouter.route('/bar-chart', {
  name: 'bar-chart',
  triggersEnter: [],
  subscriptions: function (params, queryParams) {

  },
  action: function (params, queryParams) {

    BlazeLayout.render("appLayout", {area: "UsageBarChart"});
  },
  triggersExit: []
});

FlowRouter.route('/reports/:leadId', {
  name: 'generateReport',
  triggersEnter: [],
// SJO - moved subscriptions into template per best practise
// See https://kadira.io/academy/meteor-routing-guide/content/subscriptions-and-data-management/with-blaze
//  subscriptions: function (params, queryParams) {
////        console.log(params.id);
//    this.register('lead', Meteor.subscribe('lead', params.id));
//
//  },
  action: function () {
    BlazeLayout.render("pdfLayout"); //, {lead: params.id}
  },
  triggersExit: []
});