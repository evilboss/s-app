getLocalData = function () {
    console.log(MapData.findOne());
    return MapData.findOne();
}
Template.mapFooter.helpers({
    isActiveOrb: function (step) {
        if (Session.get('currentStep') == step) {
            return 'load-active';
        }
    },
    isActiveStep: function (step) {
        if (Session.get('currentStep') == step) {
            return 'active';
        }
    },
    getPanelCount: function () {
        var localData = MapData.findOne();
        return localData.totalPanelCount;

    },
    getArea: function () {
        var localData = MapData.findOne();
        return Math.round(localData.totalAreaSqm);

    },
    getSize: function () {
        var localData = MapData.findOne();
        return localData.systemCapacity;

    },
    getCapacity: function () {
        var localData = MapData.findOne();
        return localData.systemCapacity;

    },
    getFacing: function () {

    }
});
Template.mapFooter.onCreated(function () {
    //add your statement here
});

Template.mapFooter.onRendered(function () {
    //add your statement here
});

Template.mapFooter.onDestroyed(function () {
    //add your statement here
});

