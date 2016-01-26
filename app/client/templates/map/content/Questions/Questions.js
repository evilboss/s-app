var getChartData = function () {
  var currentProfile = userProfileManager.getUserProfile();
  var currentState = [];
  if (!!currentProfile && !!currentProfile.usageProfile) {
    currentState = currentProfile.usageProfile;
  }

  var nightTimeUsage = 75;
  var graphData = [['General', 25], ['Non-solar (night-time)', 75]];

  var chartData = ChartData.find({_id: {$in: currentState}}).fetch();

  var groups = [];

  chartData.forEach(function (usageType, idx) {
    if (usageType.usageType === 'day') {
      if (!_.contains(groups, usageType.group)) {
        groups.push(usageType.group);
        graphData.push([usageType.name, usageType.percentage]);
        nightTimeUsage -= usageType.percentage;
      }
    }
  });

  graphData[1][1] = nightTimeUsage;

  currentProfile.usageGraphData = graphData;
  MapData.update({},
    {
      $set: {userProfile: currentProfile}
    });

  return graphData;
};

Template.Questions.helpers({
  loading: function () {
    return !Template.instance().ready;
  },
  questions: function () {
    // TODO - replace with MapData.findOne.buildingType when buildingType is being set
    return ChartData.find({type: 'residential'});
  },
  isCommercial: function () {
    return MapData.findOne().buildingType === 'Commercial';
  },
  powerGenerationChart: function () {
    data = getChartData();
    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'

      },
      credits: {enabled: false},
      title: {
        text: "Your Power Usage Profile"
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>'
      },
      //pool - 25%, aircon - 20%, fridge - 10%, office - 5%, hot water - 5%
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            },
            connectorColor: 'silver',

          },
          showInLegend: true
        }
      },
      series: [{
        type: 'pie',
        name: 'genre',
        data: data
      }]
    }
  }
});

Template.Questions.events({
  'click .ui.checkbox': function (e) {
    var checkId = $(e.currentTarget).attr('data-id');

    var currentProfile = MapData.findOne().userProfile;
    var currentState = [];
    if (!!currentProfile && !!currentProfile.usageProfile) {
      currentState = currentProfile.usageProfile;
    }
    clickedItem = ChartData.findOne({_id: checkId});
    if (clickedItem) {
      if (_.contains(currentState, checkId)) {
        currentState = _.without(currentState, checkId);
      } else {
        currentState.push(checkId);
      }
    }

    currentProfile.usageProfile = currentState;
    MapData.update({},
      {
        $set: {userProfile: currentProfile}
      });

  }
});

Template.Questions.onCreated(function () {
  var self = this;
  self.ready = new ReactiveVar();
  self.autorun(function () {
    var handle = homeSubs.subscribe('chart_data');
    self.ready.set(handle.ready());
  });
});

Template.Questions.onRendered(function () {
// TODO - can this go??
  $('#potentialSavings').attr('style', "display: block !important;");
  $('.map-float-container').attr('style', "width:100%; ");
  $(window).resize();

  //add your statement here
  Session.set("closeTab", true);


});

Template.Questions.onDestroyed(function () {
  Session.set("closeTab", false);
});
