import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

const HisopadoCartItem = ({patient, id}) => {
    const [openUser, setOpenUser] = useState(false);

    return (
        <article className="HisopadoCart__user">
            <div className="HisopadoCart__userTitle" onClick={() => {
                setOpenUser(!openUser);
            }}>
                <p className="HisopadoCart__userName">{patient.fullname}</p>
                {
                !openUser ?
                <FaChevronDown /> :
                <FaChevronUp />

                }
            </div>
            <div className={`HisopadoCart__userData ${openUser ? 'open' : ''}`}>
                <div>
                    <label>Nombre y apellido</label>
                    <input type="text" value={patient.fullname} />
                    <FaPencilAlt />
                </div>

                <div>
                    <label>Identificación, cédula o DNI</label>
                    <input type="text" value={patient.dni} />
                    <FaPencilAlt />
                </div>
                
                <div>
                    <label>N° de celular</label>
                    <input type="text" value={patient.ws} />
                    <FaPencilAlt />
                </div> 

                <div className="columns">
                    <div>
                        <label>Fecha de nacimiento</label>
                        <input type="date" value={patient.dob} />
                    </div>
                    <div>
                        <label>Sexo</label>
                        <select value={patient.sex} name="sexo">
                            <option selected disabled>- Seleccionar -</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label>Observaciones</label>
                    <input type="text" placeholder="Aclaración para el personal médico" />
                    <FaPencilAlt />
                </div>  

                <div>
                    <label>Domicilio</label>
                    <input type="text" value={patient.address} />
                    <FaPencilAlt />
                </div> 

                <div className="columns">
                    <div>
                        <label>Piso</label>
                        <input type="text" value={patient.piso} />
                        <FaPencilAlt /> 
                    </div>
                    <div>
                        <label>Departamento</label>
                        <input type="text" value={patient.depto} />
                        <FaPencilAlt /> 
                    </div>
                </div>

                <button className="HisopadoCart__btnAddress">Cambiar domicilio</button>
                
                <button className="HisopadoCart__btnConfirm">Aceptar</button>
                <button className="HisopadoCart__btnDelete"><FaTrashAlt /></button>
            </div>
        </article>
    )
}

export default HisopadoCartItem;