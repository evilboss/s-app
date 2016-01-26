var chartData = [['General', 25], ['Non-solar (night-time)', 75]];

Template.AreaChart.helpers({
    AreaChartValues: function (year) {
        data = chartData;
        return {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'area',
                height: 400

            },
            credits: {enabled: false},
            title: {
                text: null
            },
            xAxis: {
                title:'Years',
                categories: _.uniq(SolarApp.yearValues)
            },
            yAxis: {
                title:'Cost'

            },


            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'

            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },

            series: [{
                name: 'No Solar',
                data: _.uniq(SolarApp.noSolarData)
            }, {
                name: 'Solar',
                data: _.uniq(SolarApp.solarData)
            },
                {
                    name: 'Solar + Battery',
                    data: _.uniq(SolarApp.solarBatteryData)
                }
            ]
        }
    },
});
Template.AreaChart.events({
    //add your events here
});
Template.AreaChart.onCreated(function () {
    //add your statement here
});
Template.AreaChart.onRendered(function () {
    //add your statement here
});
Template.AreaChart.onDestroyed(function () {
    //add your statement here
});

