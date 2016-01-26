Meteor.publish("chart_data", function () {
  return ChartData.find();
});