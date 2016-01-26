/**
 * Created by gilbertor on 11/13/15.
 */
Meteor.publish("lead", function (leadId) {
  return Leads.find(leadId);
});

Meteor.publish("lead-map-data", function(leadId) {
  return LeadsMapData.find({leadId: leadId, revision: 1});
});
