import React, { useEffect } from 'react';
import { useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts"
import { FaExclamationTriangle } from 'react-icons/fa'
import { post_biomarkers } from "../../config/endpoints"
import axios from "axios"
import moment from "moment"
 
const ChartAudiometry = ({
    leftEarResults,
    rightEarResults,
    freqs,
    modal = true,
    compensation = 115,
    linkConsulta = "/"
    }) => {
    const { dni, ws } = useSelector(state => state.queries.patient) 
    const token = localStorage.getItem('token');
    const dBHL = [-13.5/20, -7.5/20, -9/20, -12/20];

    for(var i = 0; i < dBHL.length; i++){
        leftEarResults[i] = leftEarResults[i] + dBHL[i]
        rightEarResults[i] = rightEarResults[i] + dBHL[i]
    }

    const formatterEarData = (value) => {
        return (Math.ceil(value * 20) + compensation)
    } 

    useEffect(()=>{
        let data = {
            data: {
                leftEarResults: leftEarResults.map(x => formatterEarData(x)),
                rightEarResults: rightEarResults.map(x => formatterEarData(x))
            },
            date: moment().format("YYYY-MM-DD_HH-mm-ss"),
            dni: dni,
            links: {},
            type: "audiometry",
            ws: ws
        }
        var headers = { 'Authorization': token, 'Content-Type': 'Application/Json' }
        axios.post(`${post_biomarkers}/${dni}`, data, {headers})
    }, [])

    var message;
    var oido;

    for (var i = 0; i < leftEarResults.length; i++){
        if (Math.abs(leftEarResults[i] * 20 - rightEarResults[i] * 20) > 20){
            if (leftEarResults[i] > rightEarResults[i]){oido = "derecho"}
            if (leftEarResults[i] < rightEarResults[i]){oido = "izquierdo"}
            message = 
            <>
            <FaExclamationTriangle className="icon"/>
            <p>Es probable que tenga un problema en el oido <b>{oido}</b>, 
            haga click <a href={linkConsulta}>aquí</a> para realizar una 
            consulta con un otorrinolaringólogo.</p>
            </>
        }
    }

    const dataL = {
        series: [{
            name: "Umbral",
            data: leftEarResults
        }],
        options: {
            colors:["#4ECDC4"],
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false  
            },
            stroke: {
                curve: 'straight'
            },
            title: {
                text: 'Oido Izquierdo',
                align: 'left'
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
                // column: {
                //     colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                //     opacity: 0.5
                // },
                xaxis: {
                    // lines: {
                    //     show: true
                    // }
                },   
                yaxis: {
                    lines: {
                        show: true
                    },
                }, 
            },
            markers: {
                size: [4, 7]
            },
            xaxis: {
            categories: freqs,
            logarithmic: true,
            labels: {
                    formatter: function (value) {
                        return value + "Hz";
                    },
            }
            },
            yaxis: {
                logarithmic: true,
                reversed: true,
                labels: {
                    formatter: function (value) {
                    return formatterEarData(value) + "dBHL";
                    // return Math.ceil(value * 20) + "dB"; DBFS
                    }
                },
                },
        }, 
        }; 

    const dataR = {
        series: [{
            name: "Umbral",
            data: rightEarResults
        }],
        options: {
            colors:["#69D2E7"],
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false  
            },
            stroke: {
                curve: 'straight'
            },
            title: {
                text: 'Oido Derecho',
                align: 'left'
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
                // column: {
                //     colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                //     opacity: 0.5
                // },
                xaxis: {
                    // lines: {
                    //     show: true
                    // }
                },   
                yaxis: {
                    lines: {
                        show: true
                    }
                }, 
            },
            markers: {
                size: [4, 7],
            },
            xaxis: {
            categories: freqs,
            logarithmic: true,
                labels: {
                    formatter: function (value) {
                        return value + "Hz";
                    },
            }
            },
            yaxis: {
                logarithmic: true,
                reversed: true,
                labels: {
                    formatter: function (value) {
                        return formatterEarData(value) + "dBHL";
                    }
                },
                },
        }, 
        };   
    
      return (
        <div id="chart">
            <div style={{fontSize: "1.2rem"}} className={`title ${modal? "results": ""} ${message? "message--derivation": ""}`} >
            {message? message: "Resultados"}</div>
            <ReactApexChart
                options={dataL.options}
                series={dataL.series}
                type="line"
                height={180}
                className={`${message? "chart--message": ""}`}
            />
            <ReactApexChart
                options={dataR.options}
                series={dataR.series}
                type="line"
                height={180}
                className={`${message? "chart--message": ""}`}
            />
            <br></br>
            <div className={`${message? "chart--message title warning--audiometry": "title warning--audiometry"}`} style={{borderRadius: 0}}>
               <p style={{fontSize:"0.5rem"}}>Tenga en cuenta que los resultados obtenidos son relativos (dBFS). No se asuste. Puede tener un problema en sus auriculares/celular. Le enviaremos la orden de un estudio personal de ser necesario.</p>
            </div>
        </div>
        );
      }
      
export default ChartAudiometry;

{/* <FaExclamationTriangle /> */}