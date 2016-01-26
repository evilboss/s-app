Template.Usage.helpers({});

Template.Usage.events({


});

Template.Usage.onCreated(function () {
    //add your statement here
});

Template.Usage.onRendered(function () {
  Session.set("closeTab",true );

    //add your statement here
});

Template.Usage.onDestroyed(function () {
  Session.set("closeTab",false );
});
