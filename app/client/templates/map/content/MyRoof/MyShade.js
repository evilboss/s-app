Template.MyShade.helpers({
    'isChecked': function (name, t) {
        var currentProfile = MapData.findOne();
        return currentProfile.shadeSettings == name ? 'checked' : '';
    }
});

Template.MyShade.events({
    'click .shade input': function (e) {
        MapData.update({}, {$set: {shadeSettings: e.currentTarget.value}});

    }
});

Template.MyShade.onCreated(function () {
    //add your statement here
});

Template.MyShade.onRendered(function () {
    Session.set("closeTab", true);
});

Template.MyShade.onDestroyed(function () {
    Session.set("closeTab", false);
});
