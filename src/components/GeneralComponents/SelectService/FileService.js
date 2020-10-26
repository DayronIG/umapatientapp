import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope, faHeartbeat, faDeaf, faFileMedicalAlt, faInfo, faAllergies, faBriefcaseMedical } from '@fortawesome/free-solid-svg-icons';
import lungs from '../../../assets/icons/lungs.svg';
import AudioInput from '../../Inputs/Audio';
import Audiometry from "../../Audiometry"

const FileService = (props) => {
    if (props.type === "amb") {
        return (
            <div className="fileService">
                <div className="fileService__container">
                    <p className="fileService__container--text">
                        El servicio de <span className="important">URGENCIAS Y EMERGENCIAS</span> es de suscripción mensual y consta de:
                </p>
                </div>
                <div className="fileService__container">
                    <ul className="fileService__container--list">
                        <li>Atención "in situ" por personal altamente cualificado</li>
                        <li>Traslado al hospital/centro médico, si fuera necesario, en ambulancia u otro vehículo según grado de urgencia y complejidad</li>
                        <li>Visita médica domiciliaria</li>
                        <li>Consulta médica online</li>
                    </ul>
                </div>
            </div>
        )
    } else if (props.type === "vmd") {
        return (
            <div className="fileService">
                <div className="fileService__container">
                    <p className="fileService__container--text">
                        El servicio de <span className="important">Visita Médica Domiciliaria</span> es de suscripción mensual y consta de:
                    </p>
                </div>
                <div className="fileService__container">
                    <ul className="fileService__container--list">
                        <li>Atención "in situ" por personal altamente cualificado</li>
                        <li>Visita médica domiciliaria</li>
                        <li>Consulta médica online</li>
                    </ul>
                </div>
            </div>
        )
    } else if (props.type === "cmo") {
        return (
            <div className="fileService">
                <div className="fileService__container">
                    <p className="fileService__container--text">
                        El servicio de <span className="important">Consulta Médica Online</span> es de suscripción mensual y consta de:
                    </p>
                </div>
                <div className="fileService__container">
                    <ul className="fileService__container--list">
                        <li>Consulta médica online, 24 horas por día, los 365 días del año</li>
                    </ul>
                </div>
            </div>
        )
    } else if (props.type === "biomarker") {
        return (
            <div className="fileService">
                <div className="fileService__container">
                    <div className="fileService__container--text">
                        {props.title === "sthethoscop" &&
                            <div>
                                <span className="fileService__container--icon">
                                    <FontAwesomeIcon icon={faStethoscope} />
                                </span> 
                                <br />
                                {
                                !!window.chrome?
                                <AudioInput wellness={true} modal={true} finalAction={() => props.modalClose()} upload_url_prop={`${props.patient.dni}/wellness/heartbeat`}/>
                                : "Abra la aplicación desde Google Chrome para probar este servicio"}
                            </div>
                        }
                        {props.title === "heartbeat" &&
                            <div>
                                <span className="fileService__container--icon">
                                    <FontAwesomeIcon icon={faHeartbeat} />
                                </span> <br />
                                <span>
                                    Análisis de la frecuencia cardíaco y detección de arritmias
                                </span>
                            </div>
                        }
                        {props.title === "frank" &&
                            <div>
                                {/* <span className="fileService__container--icon">
                                    <FontAwesomeIcon icon={faDeaf} />
                                </span> <br /> */}
                                <Audiometry modal={true} />
                            </div>
                        }
                        {props.title === "file" &&
                            <div>
                                <span className="fileService__container--icon">
                                    <FontAwesomeIcon icon={faFileMedicalAlt} />
                                </span> <br />
                                <span>Interpretación de análisis clínicos</span>
                            </div>
                        }
                        {props.title === "laringitis" &&
                            <div>
                                <span className="fileService__container--icon">
                                    <FontAwesomeIcon icon={faBriefcaseMedical} />
                                </span> <br />
                                <span>
                                    Análisis de la voz para identificación de patologías laringeas
                                </span>
                            </div>
                        }
                        {props.title === "allergies" &&
                            <div>
                                <span className="fileService__container--icon">
                                    <FontAwesomeIcon icon={faAllergies} />
                                </span> <br />
                                <span>Análisis de manchas y lesiones en la piel</span>
                            </div>
                        }
                        {props.title === "lungs" &&
                            <div>
                                <span className="fileService__container--icon SVGContainer">
                                    {/* <img src={lungs} alt="Respiratorias" /> */}
                                    <svg width="640" className="svgBiomarker" height="480" xmlns="http://www.w3.org/2000/svg" xmlnsSvg="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <title>lungs</title>
                                        <defs>
                                            <symbol viewBox="0 0 514.327 514.327" y="0px" x="0px" id="svg_2" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
                                                <g>
                                                    <g>
                                                        <path d="m454.982,130.327c-22.109,-31.418 -52.364,-47.709 -91.927,-47.709c-34.909,0 -60.509,26.764 -67.491,73.309c-2.327,17.455 -1.164,31.418 0,44.218c1.164,9.309 1.164,17.455 1.164,26.764c-16.291,-10.473 -29.091,-23.273 -29.091,-39.564l0,-162.909c0,-6.982 -4.655,-11.636 -11.636,-11.636c-6.982,0 -11.636,4.655 -11.636,11.636l0,162.909c0,16.291 -12.8,30.255 -29.091,39.564c0,-9.309 0,-18.618 1.164,-26.764c1.164,-13.964 2.327,-27.927 0,-44.218c-6.982,-46.545 -32.582,-73.309 -67.491,-73.309c-39.564,0 -69.818,16.291 -90.764,47.709c-29.092,41.891 -58.183,98.909 -58.183,209.455c0,59.345 5.818,129.164 46.545,152.436c6.982,4.655 19.782,9.309 37.236,9.309c59.345,0 118.691,-54.691 139.636,-93.091c5.818,-12.8 9.309,-29.091 9.309,-52.364c0,-24.436 -3.491,-45.382 -6.982,-65.164c-1.164,-5.818 -6.982,-10.473 -13.964,-9.309c-5.818,1.164 -10.473,6.982 -9.309,13.964c3.491,18.618 6.982,38.4 6.982,61.673c0,18.618 -2.327,33.745 -6.982,41.891c-17.455,32.582 -69.818,80.291 -118.691,80.291c-12.8,0 -20.945,-3.491 -26.764,-5.818c-34.909,-19.782 -34.909,-104.727 -34.909,-132.655c0,-103.564 26.764,-157.091 53.527,-196.655c18.618,-26.764 41.891,-38.4 73.309,-38.4c23.273,0 39.564,19.782 45.382,53.527c2.327,13.964 1.164,25.6 0,38.4s-2.327,25.6 -1.164,40.727c-6.982,3.491 -15.127,5.818 -20.945,6.982s-10.473,8.145 -8.145,13.964c1.164,4.655 5.818,8.146 11.636,8.146c1.164,0 2.327,0 3.491,0c11.636,-3.491 57.018,-16.291 77.964,-46.545c22.109,30.255 67.491,43.055 77.964,46.545c1.164,0 2.327,0 3.491,0c4.655,0 9.309,-3.491 11.636,-8.146c1.164,-5.818 -2.327,-12.8 -8.145,-13.964s-13.964,-4.655 -20.945,-6.982c1.164,-15.127 0,-27.927 -1.164,-40.727s-2.327,-24.436 0,-38.4c5.818,-33.745 22.109,-53.527 45.382,-53.527c31.418,0 54.691,11.636 72.146,37.236c26.764,38.4 53.527,93.091 53.527,196.655c0,27.927 0,112.873 -34.909,132.655c-4.655,2.327 -13.964,5.818 -26.764,5.818c-48.873,0 -101.236,-47.709 -118.691,-80.291c-4.655,-8.145 -6.982,-23.273 -6.982,-41.891c0,-23.273 3.491,-41.891 6.982,-61.673c1.164,-5.818 -3.491,-12.8 -9.309,-13.964c-5.818,-1.164 -12.8,3.491 -13.964,9.309c-3.491,19.782 -6.982,40.727 -6.982,65.164c0,23.273 3.491,40.727 9.309,52.364c19.782,39.564 80.291,93.091 139.636,93.091c17.455,0 30.255,-4.655 38.4,-9.309c40.727,-23.273 46.545,-94.255 46.545,-152.436c-2.325,-109.382 -31.416,-166.4 -59.343,-208.291z" />
                                                    </g>
                                                </g>
                                                <g>
                                                    <g>
                                                        <path d="m359.564,285.091c-5.818,-5.818 -12.8,-5.818 -17.455,-2.327c-4.655,3.491 -5.818,11.636 -1.164,16.291c12.8,16.291 20.945,34.909 20.945,51.2c0,6.982 4.655,11.636 11.636,11.636s11.636,-4.655 11.636,-11.636c0.002,-20.946 -9.307,-45.382 -25.598,-65.164z" />
                                                    </g>
                                                </g>
                                                <g>
                                                    <g>
                                                        <path d="m422.4,281.6l-34.909,-11.636c-5.818,-2.327 -12.8,1.164 -13.964,6.982c-2.327,5.818 1.164,12.8 6.982,15.127l34.909,11.636c1.164,0 2.327,1.164 3.491,1.164c4.655,0 9.309,-3.491 10.473,-8.145c2.327,-5.819 -1.164,-12.801 -6.982,-15.128z" />
                                                    </g>
                                                </g>
                                                <g>
                                                    <g>
                                                        <path d="m415.418,202.473c-4.655,-4.655 -11.636,-4.655 -16.291,0l-34.909,34.909c-4.655,4.655 -4.655,11.636 0,16.291c2.327,2.327 5.818,3.491 8.145,3.491s5.818,-1.164 8.145,-3.491l34.909,-34.909c4.656,-4.655 4.656,-11.637 0.001,-16.291z" />
                                                    </g>
                                                </g>
                                                <g>
                                                    <g>
                                                        <path d="m171.055,282.764c-4.655,-3.491 -12.8,-3.491 -16.291,1.164c-17.455,20.945 -26.764,45.381 -26.764,66.327c0,6.982 4.655,11.636 11.636,11.636s11.636,-4.655 11.636,-11.636c0,-16.291 8.146,-34.909 20.945,-51.2c3.492,-4.655 3.492,-12.8 -1.162,-16.291z" />
                                                    </g>
                                                </g>
                                                <g>
                                                    <g>
                                                        <path d="m138.473,275.782c-2.327,-5.818 -8.145,-9.309 -15.127,-6.982l-34.909,11.636c-4.655,2.327 -8.145,9.309 -5.818,15.127c1.164,4.655 5.818,8.145 10.473,8.145c1.164,0 2.327,0 3.491,-1.164l34.909,-11.636c5.817,-2.326 9.308,-8.144 6.981,-15.126z" />
                                                    </g>
                                                </g>
                                                <g>
                                                    <g>
                                                        <path d="m147.782,237.382l-34.909,-34.909c-4.655,-4.655 -11.636,-4.655 -16.291,0s-4.655,11.636 0,16.291l34.909,34.909c2.327,2.327 4.655,3.491 8.145,3.491s5.818,-1.164 8.145,-3.491c4.655,-4.655 4.655,-11.637 0.001,-16.291z" />
                                                    </g>
                                                </g>
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                                <g />
                                            </symbol>
                                        </defs>
                                        <g>
                                            <title>Layer 1</title>
                                            <use x="28.465707" y="-4.744284" fill="#ffffff" transform="matrix(0.9992530894096703,0,0,0.9992530894096703,-53.763534085214815,5.308517839515105) " xlinkHref="#svg_2" id="svg_3" />
                                            <g id="svg_4" />
                                        </g>
                                    </svg>
                                </span> <br />
                                <span>Identificación de enfermedades respiratorias.</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default FileService;