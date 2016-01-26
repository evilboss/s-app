Template.RoofAngles.helpers({
    'isChecked': function (name, t) {
        var currentProfile = MapData.findOne();
        return currentProfile.pitchSettings == name ? 'checked' : '';
    },
});

Template.RoofAngles.events({
    'click .pitch input': function (e) {
        console.log('click');
        MapData.update({}, {$set: {pitchSettings: e.currentTarget.value}});
    }
});

Template.RoofAngles.onCreated(function () {
    //add your statement here
});

Template.RoofAngles.onRendered(function () {
    //add your statement here
});

Template.RoofAngles.onDestroyed(function () {
    //add your statement here
});

