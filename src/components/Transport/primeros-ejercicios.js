// EJERCICIO NRO 1
function convertir(input){
    var semanas, dias, horas = 0;
    semanas = (input - (input % 24)) / (24*7);
    dias = (input - (semanas *7*24)) / 24;
    horas = (input - (semanas*7*24) - (dias*24));
 
    alert(input + 'hs. equivalen a:' + semanas + ' semanas, ' + dias + ' dias, ' + horas + ' horas.');
 
 }
 
 
 
 input = prompt('Ingrese la cantidad de horas a convertir:');
 
 convertir(input);
 
 

// EJERCICIO NRO 2
// a true
// b true
// c true
// e true
// EJERCICIO NRO 3
// a true
// b true
// c false
// d true
// e true
// f false
// EJERCICIO NRO 4
// a=21
// b=9
// e=20
// f=2
// EJERCICIO NRO 5
// a false
// b false
// c false
// d true
// e true
// f true
// EJERCICIO NRO 6
// a 7
// b 7
// c 3
