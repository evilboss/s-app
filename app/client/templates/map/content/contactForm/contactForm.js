Template.contactForm.helpers({
  //add you helpers here
});

Template.contactForm.events({
  //add your events here
});

Template.contactForm.onCreated(function () {
  //add your statement here
});

Template.contactForm.onRendered(function () {
  //add your statement here
});

Template.contactForm.onDestroyed(function () {
  //add your statement here
});
var addLeadsHook = {
  before: {
    insert: function (doc) {
      var bounds = mapController.getRoofController().getBoundingBox();
      doc.address = Session.get("location");
      //Added extra test for bounds
      if (bounds) {
        doc.bounds = JSON.stringify(bounds.toJSON());
      }
      Session.set('emailSet', true);

      return doc;
    }
  },
  after: {
    insert: function (doc) {
      $('.ui.modal').modal('hide');
    }
  },
  onSuccess: function (formType, result) {
    if (Meteor.isClient) {
      Session.set('leadId', result);
      window.open(Meteor.absoluteUrl() + 'reports/' + result, '_blank');
    }
  }
};

AutoForm.addHooks(['insertLeadForm'], addLeadsHook);
