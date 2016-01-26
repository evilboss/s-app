/*
function summer(){

    var prod =[0.00,0.00,0.00,0.00,0.00,1.00,7.33,13.00,35.67,36.00,62.33,80.33,94.33,72.33,74.00,55.33,20.00,7.67,0.00,0.00,0.00,0.00,0.00,0.00];

    var profile = [3.70,2.80,2.70,2.45,2.25,2.65,2.60,3.85,4.00,4.30,4.30,3.85,4.05,3.60,3.95,3.75,3.70,5.05,5.90,7.50,6.35,6.15,5.70,4.85,100.00];

    load_value.length = 0;

    pv_output.length = 0;

    import_value.length = 0;

    export_value.length = 0;



    for(var i=0;i<profile.length;i++){

        var a = (localStorage.getItem('usage')/30)*(profile[i]/100);

        //var a = (20)*parseFloat(profile[i]/100);

        var b = parseFloat(Math.round(a * 100) / 100).toFixed(2) ;

        load_value.push(b);

    }

    for(var i=0;i<prod.length;i++){

        var a = Math.round(localStorage.getItem("sugg_sys_size")) * (prod[i]/100) ;

        //var a = Math.round(5) * (prod[i]/100) ;



        pv_output.push(a);

    }





    for(var i=0;i<prod.length;i++){



        if(load_value[i] > pv_output[i]){

            var a = load_value[i] - pv_output[i];

            var b = parseFloat(Math.round(a * 100) / 100).toFixed(2);

            import_value.push(b);

        }else{

            import_value.push(0.00);

        }

    }





    for(var i=0;i<prod.length;i++){



        if(load_value[i] > pv_output[i]){

            var a = parseFloat(0);

            export_value.push(a);

        }else{

            var a = load_value[i] - pv_output[i];

            var b = parseFloat(Math.round(a * 100) / 100).toFixed(2);

            export_value.push(b);

        }

    }

    console.log('Q');

    console.log(Q);

    console.log('pv_output');

    console.log(pv_output);

    console.log('load_value');

    console.log(load_value);

    console.log('import_value');

    console.log(import_value);

    console.log('export_value');

    console.log(export_value);



    //alert(hours.length);

    //alert(load_value.length);

    //alert(pv_output.length);

    for(var i = 0; i < hours.length-1; i++){

        PvsQ.setValue(i, 1, parseFloat(load_value[i]).toFixed(1))

        PvsQ.setValue(i, 2, parseFloat(pv_output[i]).toFixed(1))

        //PvsQ.setValue(i, columnIndex, value)

        //PvsQ.addRow([hours[i].toString(),parseFloat(load_value[i]),pv_output[i]]);

    }



    //small table calculation

    var sum_of_import = 0;

    if(localStorage.getItem('per_kw_cents') == null)

        var rate =  0.3;

    else

        var rate = localStorage.getItem('per_kw_cents') /100;



    for(var i = 0 ;i<import_value.length;i++){

        sum_of_import = sum_of_import + parseFloat(import_value[i]);

    }

    $('#grid').text(parseFloat(Math.round((sum_of_import*rate) * 100) / 100).toFixed(2));



    var sum_of_load = 0;

    for(var i = 0 ;i<load_value.length;i++){

        sum_of_load = sum_of_load + parseFloat(load_value[i]);

    }

    var solar = sum_of_load - sum_of_import;

    $('#solar').text(parseFloat(Math.round((solar*rate) * 100) / 100).toFixed(2));



    var sum_of_export = 0;

    for(var i = 0 ;i<export_value.length;i++){

        sum_of_export = sum_of_export + parseFloat(export_value[i]);

    }

    $('#export').text(parseFloat(Math.round((sum_of_export*0.08) * 100) / 100).toFixed(2));



    var you_pay = 1 + (sum_of_import*rate) - (sum_of_export*0.08);

    $('#youpay').text(parseFloat(Math.round((you_pay) * 100) / 100).toFixed(2));



    draw_chart()

}

function winter(){

    var prod =[0.00,0.00,0.00,0.00,0.00,0.00,0.00,1.33,28.67,46.33,58.33,62.00,60.67,49.33,42.33,21.00,2.33,0.00,0.00,0.00,0.00,0.00,0.00,0.00];

    var profile = [3.70,2.80,2.70,2.45,2.25,2.65,2.60,3.85,4.00,4.30,4.30,3.85,4.05,3.60,3.95,3.75,3.70,5.05,5.90,7.50,6.35,6.15,5.70,4.85,100.00];

    load_value.length = 0;

    pv_output.length = 0;

    import_value.length = 0;

    export_value.length = 0;

    //alert(localStorage.getItem('usage')/30);

    for(var i=0;i<prod.length;i++){

        var a = (localStorage.getItem('usage')/30)*(profile[i]/100);

        var b = parseFloat(Math.round(a * 100) / 100).toFixed(2) ;

        load_value.push(b);

    }





    for(var i=0;i<prod.length;i++){

        var a = Math.round(localStorage.getItem("sugg_sys_size")) * (prod[i]/100) ;

        pv_output.push(a);

    }





    for(var i=0;i<prod.length;i++){



        if(load_value[i] > pv_output[i]){

            var a = load_value[i] - pv_output[i];

            var b = parseFloat(Math.round(a * 100) / 100).toFixed(2);

            import_value.push(b);

        }else{

            import_value.push(0.00);

        }

    }





    for(var i=0;i<prod.length;i++){



        if(load_value[i] > pv_output[i]){

            var a = parseFloat(0);

            export_value.push(a);

        }else{

            var a = load_value[i] - pv_output[i];

            var b = parseFloat(Math.round(a * 100) / 100).toFixed(2);

            export_value.push(b);

        }

    }

    console.log('winter Q');

    console.log(Q);

    console.log('winter pv_output');

    console.log(pv_output);

    console.log('winter load_value');

    console.log(load_value);

    console.log('winter import_value');

    console.log(import_value);

    console.log('winter export_value');

    console.log(export_value);

    console.log('winter profile_value');

    console.log(profile);



    for(var i = 0; i < hours.length-1; i++){

        PvsQ.setValue(i, 1, parseFloat(load_value[i]).toFixed(2))

        PvsQ.setValue(i, 2, parseFloat(pv_output[i]).toFixed(2))

        //PvsQ.setValue(i, columnIndex, value)

        //PvsQ.addRow([hours[i].toString(),parseFloat(load_value[i]),pv_output[i]]);

    }



    //small table calculation

    var sum_of_import = 0;

    if(localStorage.getItem('per_kw_cents') == null)

        var rate =  0.3;

    else

        var rate = localStorage.getItem('per_kw_cents') /100;



    for(var i = 0 ;i<import_value.length;i++){

        sum_of_import = sum_of_import + parseFloat(import_value[i]);

    }

    $('#grid').text(parseFloat(Math.round((sum_of_import*rate) * 100) / 100).toFixed(2));



    var sum_of_load = 0;

    for(var i = 0 ;i<load_value.length;i++){

        sum_of_load = sum_of_load + parseFloat(load_value[i]);

    }

    var solar = sum_of_load - sum_of_import;

    $('#solar').text(parseFloat(Math.round((solar*rate) * 100) / 100).toFixed(2));



    var sum_of_export = 0;

    for(var i = 0 ;i<export_value.length;i++){

        sum_of_export = sum_of_export + parseFloat(export_value[i]);

    }

    $('#export').text(parseFloat(Math.round((sum_of_export*0.08) * 100) / 100).toFixed(2));



    var you_pay = 1 + (sum_of_import*rate) - (sum_of_export*0.08);

    $('#youpay').text(parseFloat(Math.round((you_pay) * 100) / 100).toFixed(2));



    draw_chart()

}
//--------------- PIE CHART -------------------

$(document).ready(function(e) {
    google.load("visualization", "1", {packages:["corechart"]});
    google.setOnLoadCallback(drawChart1);
    function drawChart1() {
        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['From Solar', Math.round(solarValue)],
            ['From Grid',  Math.round(grideValue)]
        ]);

        var options = {
            title: 'Daily Power Usage',
            titleTextStyle : {fontSize: 12},
            is3D: true,
            colors: ['#cda013','#896B0B'],
            legend: 'none',
            pieSliceText: 'label',
            pieHole: 0.3,
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart1'));
        chart.draw(data, options);
        $("text:contains(" + options.title + ")").attr({'x':'60', 'y':'20'})
    }
});
$(document).ready(function(e) {
    google.load("visualization", "1", {packages:["corechart"]});
    google.setOnLoadCallback(drawChart2);
    function drawChart2() {
        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Used',  Math.round(usedValue)],
            ['Exported', Math.round(exportValue)]
        ]);

        var options = {
            title: 'Solar Production',
            titleTextStyle : {fontSize: 12},
            colors: ['#cda013','#A88619'],
            legend: 'none',
            pieSliceText: 'label',
            is3D: true,
            pieHole: 0.3,
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart2'));
        chart.draw(data, options);
        $("text:contains(" + options.title + ")").attr({'x':'60', 'y':'20'})
    }

});
*/
