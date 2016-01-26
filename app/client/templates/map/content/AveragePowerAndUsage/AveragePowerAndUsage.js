Template.AveragePowerAndUsage.helpers({
    getkwh: function () {
        if (Session.get('kwh')) {
            return Session.get('kwh');
        } else {
            return 0;
        }
    },
    //add you helpers here
    trueData: function () {
        if (Session.get('kwhSet')) {
            return "readonly"
        } else {
            return "disabled";
        }
    }
});

Template.AveragePowerAndUsage.events({
    //add your events here
});

Template.AveragePowerAndUsage.onCreated(function () {
    //add your statement here
});

Template.AveragePowerAndUsage.onRendered(function () {
    //add your statement here
});

Template.AveragePowerAndUsage.onDestroyed(function () {
    //add your statement here
});
