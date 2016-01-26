Meteor.methods({
  saveLeadData: function (doc, mapData) {
    mapData.revision = 1;
    mapData.leadId = doc._id;
    LeadsMapData.insert({leadId:doc._id, revision: 1, data: mapData})
  }
});
