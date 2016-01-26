/*
// JavaScript Document

//assumption



/!*alert('sunshine:'+localStorage.getItem("sunshine"));

 alert('localStorage.getItem("inflaton"):'+localStorage.getItem("inflaton"));

 alert('localStorage.getItem("inflaton"):'+localStorage.getItem("sugg_sys_size"));*!/







var start_year = 2015;

var for_year = 25;

var sunshine = parseFloat(localStorage.getItem("sunshine"));//3.43;

var zone = 4;

var inflaton = parseFloat(localStorage.getItem("inflaton"));//5;//in percent %

var system_size = parseFloat(localStorage.getItem("sugg_sys_size"));//5; //in KW

var consumption = parseFloat(localStorage.getItem("usage"));//900;//in KWH

var consuption_rise =parseFloat(localStorage.getItem("consuption_rise"));// 3;// in % per year

var efficiency = parseFloat(localStorage.getItem("efficiency"));//87; // in %

var weighted_tarrif = parseFloat(localStorage.getItem("weighted_tarrif"))/100 ; //30/100;

//alert(weighted_tarrif);

// in cents/100 in $

var export_price = parseFloat(localStorage.getItem("export_price"))/100 ; //8/100;

// in cents /100 in $

var loan_int_per_annum = 0; // in per

var amount = 0; // in $

var period = 0;//in year

var loan_bal = 0;

var yearly_loan_amt = (amount*loan_int_per_annum)/100;

var service_charge = parseFloat(localStorage.getItem("service_charge"));

//end of assumption

console.log('localStorage');

console.log(localStorage);



var no = 1;

var years = [];

var A = [];//year e.x : 1 , 2 , 3

var B = [];//Traffi in ($)

var C = [];//consumption monthly in kWH

var D = [];//PV output montly in KWH

var E = [];//net Power montly in KWH

var F = [];//savings montly in $

var G = [];//export shortfall in $

var H = [];//gross savings montly inc exp year in $

var I = [];//gross savings year in $

var J = [];//gross cimalative savings in $

var K = [];//Loan bal in $

var L = [];//loan reply monthly in $

var M = [];//interest per month in $

var N = [];//net savings per year in $

var O = [];//commulative savings per year in $

var P = [];//PV monthly net cash bill in $

var Q = [];//No PV monthly bill in $

var R = [];//P vs Q in $





////////////////////////////////////////////////////////////////////////////////////////////////////////////

var load_value = [];

var pv_output = [];

var import_value = [];

var export_value = [];



var prod =[0.00,0.00,0.00,0.00,0.00,0.42,3.05,6.19,31.59,42.03,60.00,69.64,74.70,58.91,55.53,35.30,9.69,3.20,0.00,0.00,0.00,0.00,0.00,0.00];

var profile = [3.41,2.80,2.70,2.45,2.25,2.65,2.60,3.85,4.00,4.30,4.30,3.85,4.05,3.60,3.95,3.75,3.70,5.05,5.90,7.50,6.35,6.15,5.70,4.85];

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

    var a = (localStorage.getItem("sugg_sys_size")) * (prod[i]/100) ;

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

        var a = pv_output[i] - load_value[i];

        var b = parseFloat(Math.round(a * 100) / 100).toFixed(2);

        export_value.push(b);

    }

}

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

//small table calculation

var sum_of_import = 0;

if(localStorage.getItem('per_kw_cents') == null)

    var rate =  0.3;

else

    var rate = localStorage.getItem('per_kw_cents') /100;



for(var i = 0 ;i<import_value.length;i++){

    sum_of_import = sum_of_import + parseFloat(import_value[i]);

}

//$('#grid').text(parseFloat(Math.round((sum_of_import*rate) * 100) / 100).toFixed(2));

var sum_of_load = 0;

for(var i = 0 ;i<load_value.length;i++){

    sum_of_load = sum_of_load + parseFloat(load_value[i]);

}

var solar = sum_of_load - sum_of_import;

//$('#solar').text(parseFloat(Math.round((solar*rate) * 100) / 100).toFixed(2));

var sum_of_export = 0;

for(var i = 0 ;i<export_value.length;i++){

    sum_of_export = sum_of_export + parseFloat(export_value[i]);

}

var sum_of_pv_output = 0;

for(var i = 0 ;i<pv_output.length;i++){

    sum_of_pv_output = sum_of_pv_output + parseFloat(pv_output[i]);

}

//alert('sum_of_load:'+sum_of_load);alert('sum_of_export:'+sum_of_export);

var exportValue = (sum_of_export / sum_of_pv_output)*100;

console.log('exportValue:'+exportValue)



var solarValue = ((sum_of_load - sum_of_import)/sum_of_load)*100;

console.log('solarValue:'+solarValue)



var grideValue= (sum_of_import / sum_of_load)*100;

console.log('GrideValue:'+grideValue);



var usedValue = 100 - exportValue;

console.log('usedValue'+usedValue);

//$('#export').text(parseFloat(Math.round((sum_of_export*0.08) * 100) / 100).toFixed(2));

//var you_pay = 1 + (sum_of_import*rate) - (sum_of_export*0.08);

//$('#youpay').text(parseFloat(Math.round((you_pay) * 100) / 100).toFixed(2));

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



var last_B = weighted_tarrif;

var last_C = consumption;

var last_D = (sunshine*(system_size*30)*efficiency)/100;

var last_E =last_D - (((last_D*usedValue) / 100) ) ;

var last_F = Math.round(last_B*(last_C*solarValue/100));

if(last_E>0){

    var last_G =  Math.round(last_E * export_price);

}else{

    var last_G = Math.round(0);

}



if(last_G > 0){

    var last_H = (Math.round(last_F)+Math.round(last_G));

}else{

    var last_H = (Math.round(last_F));

}



var last_I = Math.round(last_H) * 12;

var last_J = last_I;

var last_K = amount;

if(last_K > 0){

    var last_M = (last_K * (loan_int_per_annum/100)) / 12;

}else{

    var last_M = 0;

}



var last_N = last_I - (last_M * 12);



var last_O = last_I;

var last_L = 0;

var last_P = last_H - last_L - last_M;

var last_Q = (last_B * last_C)+30 // 30 is service_charge for monthly;

var last_R =  Math.round(last_Q - last_P);



for(var i = start_year; i<(start_year+for_year);i++){

    years.push(i);

    A.push(no);no++;



    B.push(Math.round(last_B * 100) / 100);

    last_B =(last_B+((last_B*inflaton)/100));

    C.push(Math.round(last_C));

    last_C = last_C+((last_C*consuption_rise)/100);



    D.push(Math.round(last_D));

    last_D = last_D * 0.99 ;





    E.push(last_E);

    last_E = last_D - (((last_D*usedValue) / 100) ) ;



    F.push(last_F);

    if(last_E>0)

        last_F =  Math.round(last_B*(last_C*solarValue/100));

    else

        last_F = Math.round(0);



    G.push(last_G);

    if(last_E>0){

        last_G =  Math.round(last_E * export_price);

    }else{

        last_G = Math.round(0);

    }



    H.push(last_H);

    if(last_G > 0){

        last_H = (Math.round(last_F)+Math.round(last_G));

    }else{

        last_H = (Math.round(last_F));

    }





    I.push(last_I);

    last_I = Math.round(last_H * 12);



    J.push(last_J);

    last_J = last_J + last_I;



    K.push(last_K);

    last_K = last_K - yearly_loan_amt;



    L.push(yearly_loan_amt/12);

    var last_L = yearly_loan_amt/12;



    M.push(last_M);

    if(last_K > 0){

        last_M = (last_K * (loan_int_per_annum/100)) / 12;

    }else{

        last_M = 0;

    }



    N.push(last_N);

    last_N = last_I - (last_M * 12);



    O.push(last_O);

    last_O = last_O + last_N;



    P.push(last_P);

    last_P = last_H - last_L - last_M;



    Q.push(Math.round(last_Q));

    last_Q = (last_B * last_C)+30; // 30 is service_charge for monthly





    R.push(last_R);

    last_R = Math.round(last_Q) - Math.round(last_P);

}

console.log('B:'+B);

console.log('C:'+C);

console.log('D:'+D);

console.log('E:'+E);

console.log('F:'+F);

console.log('G:'+G);

console.log('H:'+H);

console.log('I:'+I);

console.log('J:'+J);

console.log('K:'+K);

console.log('L:'+L);

console.log('M:'+M);

console.log('N:'+N);

console.log('O:'+O);

console.log('P:'+P);

console.log('Q:'+Q);

console.log('R:'+R);



function numberWithCommas(x) {

    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    //alert(x);

    /!*x=x.toString();

     var lastThree = x.substring(x.length-3);

     var otherNumbers = x.substring(0,x.length-3);

     if(otherNumbers != '')

     lastThree = ',' + lastThree;

     var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

     //alert(res);

     return res;*!/

}





    /!*function commaSeparateNumber(val){

     var x=val;

     alert(x);

     x=x.toString();

     var lastThree = x.substring(x.length-3);

     var otherNumbers = x.substring(0,x.length-3);

     if(otherNumbers != '')

     lastThree = ',' + lastThree;

     var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;



     alert(res);

     return res;

     }  *!/

*/
