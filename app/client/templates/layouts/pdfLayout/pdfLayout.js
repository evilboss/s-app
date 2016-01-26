var templates = [];

var sessionId = function () {
  var id = MapData.findOne()._id;
  if (MapData.find().count() > 1) {
    console.log("MULTIPLE MapData records found!!");
  }
  return id;
};

for (var i = 1; i <= 10; i++) {
  templates.push(Template['page' + i]);
}
var data;
setData = function (newData) {
  data = newData;
};

Template.pdfLayout.helpers({
  loading: function() {
    return !Template.instance().ready;
  },
  getTemplateList: function (newData) {
    setData(newData);
    console.log(templates);
    return templates;
  },
  getData: function () {
    return data;
  },
  tester: function (test) {
    console.log(test);
  },
  lead: function () {
//        console.log(Leads.find().fetch());
    var leadId = FlowRouter.getParam('leadId');
    if (!leadId) return 'nda';

    return Leads.findOne({_id: leadId});
    //console.log(lead);
    //var leadData = LeadsMapData.findOne({leadId: leadId});
    //console.log(leadData);
    //
    //MapData.update({
    //  _id: sessionId()
    //}, {
    //  $set: {
    //    mapCoordinates: Leads.findOne({_id: leadId})
    //  }
    //});
    //if (leadId) return Leads.findOne({_id: leadId});
    //else return 'nda';
  },
  mapController: function() {
    return reportMapController;
  }
});

Template.pdfLayout.events({
  //add your events here
});

Template.pdfLayout.onCreated(function () {
  var self = this;
  self.ready = new ReactiveVar();
  self.autorun(function () {
    var leadId = FlowRouter.getParam('leadId');
    var handle = homeSubs.subscribe('panels');
    var leadHandle = self.subscribe('lead', leadId);
    var leadMapDataHandle = self.subscribe('lead-map-data', leadId);

    var mapDataReady = false;
    if (leadMapDataHandle.ready() && GoogleMaps.loaded()) {
      var leadData = LeadsMapData.findOne();
      MapData.remove({});
      MapData.insert(leadData.data);
      self.ready.set(leadMapDataHandle.ready());
    }
  });
});

Template.pdfLayout.onRendered(function () {
  //add your statement here
});

Template.pdfLayout.onDestroyed(function () {
  //add your statement here
});
