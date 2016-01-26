Template.BuildingType.helpers({
    //add you helpers here
});

Template.BuildingType.events({
    'click .toggle': function (e) {
        //console.log($(".toggle input[type='checkbox']").is(":checked"));
        if ($(".toggle input[type='checkbox']").is(":checked")) {
            Session.set('buildingType', 'Commercial');
        } else {
            Session.set('buildingType', 'Residential');
        }
    }
});
Template.BuildingType.onCreated(function () {
    //add your statement here
});

Template.BuildingType.onRendered(function () {
    //add your statement here
});

Template.BuildingType.onDestroyed(function () {
    //add your statement here
});

Template.BuildingType.rendered = function () {
    $('.ui.dropdown').dropdown();
    Session.setDefault('buildingType', 'Residential');
}
