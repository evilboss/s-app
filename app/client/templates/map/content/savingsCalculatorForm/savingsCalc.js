Template.savingsCalc.helpers({

});

Template.savingsCalc.events({

});

Template.savingsCalc.onCreated(function () {
    //add your statement here
});

Template.savingsCalc.onRendered(function () {
  Session.set("closeTab",true );

});

Template.savingsCalc.onDestroyed(function () {
  Session.set("closeTab",false );
});
