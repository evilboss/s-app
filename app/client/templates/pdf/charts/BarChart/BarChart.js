var chartData = [['General', 25], ['Non-solar (night-time)', 75]];
Template.BarChart.helpers({
    BarChartNightData: function () {
        data = chartData;
        return {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'column'
            },
            credits: {enabled: false},
            title: {
                text: ''
            },

            yAxis: {
                title: 'Cost'
                ,
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black'
                        }
                    }
                }
            },
            legend: {
                enabled: false
            },

            series: [
                {
                    name: '327W panels',
                    data: [20,30,40,13]
                },
                {
                    name: '315W NeON2', data: [1,2,3,13]
                },
                {
                    name: 'CS6P',
                    data: [13]
                },
                {
                    name: 'Virtus®II Solar Module', data: [0,2,4,3]
                }]

        }
    },

});

Template.BarChart.events({
    //add your events here
});

Template.BarChart.onCreated(function () {
    //add your statement here
});

Template.BarChart.onRendered(function () {
    //add your statement here
});

Template.BarChart.onDestroyed(function () {
    //add your statement here
});

