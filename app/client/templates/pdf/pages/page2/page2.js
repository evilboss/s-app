var date = new Date();
var year = date.getFullYear();
var toNumericString = function(number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
Template.page2.helpers({

    getTotal: function (detail) {
        return toNumericString (SolarApp[detail][SolarApp[detail].length- 1]);

    },
    getSavings:function(detail){
        return toNumericString (SolarApp.noSolarData[SolarApp.noSolarData.length- 1]-SolarApp[detail][SolarApp[detail].length- 1]);

    },

    yearValues: function () {
        return SolarApp.yearIncrements;
    },
    nonSolar: function (year) {
        var baseData = MapData.findOne();
        //var monthlyCost = data.userProfile.monthlyCost;
        year = parseInt(year);
        var monthlyCost = baseData.userProfile.monthlyCost;
        var anualCost = monthlyCost * 12;
        var annualSupplyCharge = 1.16 * 365;
        var supplyChargePercentageIncrease = .05;
        var powerSupplyPercentageIncrease = .07;
        var nonSolar = Math.round((annualSupplyCharge * ((( Math.pow((1 + supplyChargePercentageIncrease), year) ) - 1) / (supplyChargePercentageIncrease))) + ((anualCost - annualSupplyCharge) * ((( Math.pow((1 + powerSupplyPercentageIncrease), year) ) - 1) / (powerSupplyPercentageIncrease))), 0);
        SolarApp.noSolarData.push(nonSolar);
        return toNumericString(nonSolar);
    },

    withSolar: function (year) {
        var baseData = MapData.findOne();
        //var monthlyCost = data.userProfile.monthlyCost;
        year = parseInt(year);
        var monthlyCost = baseData.userProfile.monthlyCost;
        var anualCost = monthlyCost * 12;
        var annualSupplyCharge = 1.16 * 365;
        var supplyChargePercentageIncrease = .05;
        var powerSupplyPercentageIncrease = .07;
        //NonSolar  =($E$5 * ((((1+$B$3)^A7)-1)/($B$3))) + (($E$4 - $E$5) * ((((1+$B$4)^A7)-1)/($B$4)))
        //With Solar =($E$5 * ((((1+$B$3)^A7)-1)/($B$3))) + ((($E$4 - $E$5) * (1-$H$3)) * ((((1+$B$4)^A7)-1)/($B$4)))
        var withSolar = Math.round((annualSupplyCharge * ((( Math.pow((1 + supplyChargePercentageIncrease), year) ) - 1) / (supplyChargePercentageIncrease))) + (((anualCost - annualSupplyCharge) * (1 * 0.5)) * ((( Math.pow((1 + powerSupplyPercentageIncrease), year) ) - 1) / (powerSupplyPercentageIncrease))), 0);
        SolarApp.solarData.push(withSolar);
        return toNumericString(withSolar);
    },
    solarBattery: function (year) {
        var baseData = MapData.findOne();
        year = parseInt(year);
        var monthlyCost = baseData.userProfile.monthlyCost;
        var anualCost = monthlyCost * 12;
        var annualSupplyCharge = 1.16 * 365;
        var supplyChargePercentageIncrease = .05;
        var powerSupplyPercentageIncrease = .07;
        var solarPercentage = 4;
        var solarBattery;
        //With Solar =($E$5 *    ((((1+$B$3)^A7)-1)/($B$3))) + ((($E$4 - $E$5) * (1-$H$3)) * ((((1+$B$4)^A7)-1)/($B$4)))
        //solarBattery = ($E$5 * ((((1+$B$3)^A12)-1)/($B$3))) + ((($E$4 - $E$5) * (1 - $H$4)) * ((((1+$B$4)^A12)-1)/($B$4))) + ((($E$4 - $E$5) * (1 - $H$3)) * ((((1+$B$4)^$H$5)-1)/($B$4)))
        if (year <= 4) {
            solarBattery = Math.round((annualSupplyCharge * ((( Math.pow((1 + supplyChargePercentageIncrease), year) ) - 1) / (supplyChargePercentageIncrease))) + (((anualCost - annualSupplyCharge) * (1 * 0.5)) * ((( Math.pow((1 + powerSupplyPercentageIncrease), year) ) - 1) / (powerSupplyPercentageIncrease))), 0);
        } else {
            solarBattery = Math.round((annualSupplyCharge * ((( Math.pow((1 + supplyChargePercentageIncrease), year) ) - 1) / (supplyChargePercentageIncrease))) + (((anualCost - annualSupplyCharge) * (1 * 0.5)) * ((( Math.pow((1 + powerSupplyPercentageIncrease), 4) ) - 1) / (powerSupplyPercentageIncrease))) + (((anualCost - annualSupplyCharge) * 0) * ((Math.pow((1 + powerSupplyPercentageIncrease), solarPercentage) - 1) / (powerSupplyPercentageIncrease))), 0);
        }
        SolarApp.solarBatteryData.push(solarBattery);
        return toNumericString(solarBattery);


    },
    getYear: function (year) {
        if (year === 1) {
            year = 0;
        }
        var today = new Date(new Date().setYear(new Date().getFullYear() + year));
        SolarApp.yearValues.push(today.getFullYear());
        return today.getFullYear();
    },
    dataTable: function () {
        var data = MapData.findOne();
        var withSolar = .5;
        var monthlyCost = data.userProfile.monthlyCost;
        var anualCost = monthlyCost * 12;
        var supplyCharge = 1.16 * 365;
        var supply = .05;
        var power = .07;
        var currentYear = year;
        var noSolar = anualCost;
        var batteryAfterYear = 4;

        var solar = ((anualCost - supplyCharge) * supply) + supplyCharge;

        dataTableInfo = {
            1: {
                year: currentYear,
                noSolar: noSolar,
                solar: solar,
                solarBattery: solar,
                anualCost: anualCost,
                supplyCharge: supplyCharge
            }
        };

        for (c = 2; c <= 10; c++) {
            var increasSupplyCharge = dataTableInfo[c - 1].supplyCharge * (1 + supply);
            noSolar = (dataTableInfo[c - 1].anualCost - dataTableInfo[c - 1].supplyCharge) * (1 + power) + increasSupplyCharge;
            if (c <= batteryAfterYear) {
                solarBattery = solar;
            } else {
                solarBattery = noSolar - ((noSolar - increasSupplyCharge) * power);
            }
            solar = ((noSolar - increasSupplyCharge) * withSolar) + increasSupplyCharge;
            dataTableInfo[c] = {
                year: dataTableInfo[c - 1].year + 1,
                noSolar: noSolar,
                solar: solar,
                solarBattery: solarBattery,
                anualCost: noSolar,
                supplyCharge: increasSupplyCharge,
            }
        }


        console.log(dataTableInfo);
        return dataTableInfo;
    },



});


Template.page2.onRendered(function () {


});
