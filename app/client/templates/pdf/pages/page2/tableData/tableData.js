Template.tableData.helpers({
    isNumber: function (txt) {
        if(!isNaN(txt.value)){
            return txt.value;
        }else{
          return false;
        }

    },
    toValue:function(val){
        return val.value;
    }

});

Template.tableData.events({
    //add your events here
});

Template.tableData.onCreated(function () {
    //add your statement here
});

Template.tableData.onRendered(function () {
    //add your statement here
});

Template.tableData.onDestroyed(function () {
    //add your statement here
});

