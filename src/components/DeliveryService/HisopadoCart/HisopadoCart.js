import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronLeft, FaChevronDown, FaChevronUp, FaPencilAlt } from 'react-icons/fa';
import './../../../styles/deliveryService/HisopadoCart.scss';

const HisopadoCart = (props) => {
  const history = useHistory();
  const [openUser, setOpenUser] = useState(false);

  return(
    <>
      <div className="HisopadoCart">
        <div className="HisopadoCart__container">
          <div className="HisopadoCart__goBack">
            <FaChevronLeft onClick={() => history.goBack()} />
          </div>
          
          <div className="HisopadoCart__header">
            <h1 className="HisopadoCart__title">Tu compra</h1>
            <p className="HisopadoCart__text">Comprando ahora, nuestro personal de salud llegará a tu domicilio en las próximas <span>4 horas.</span></p>
            <p className="HisopadoCart__text">Datos del usuario</p>
          </div>
          
          <section className="HisopadoCart__userSection">
            <div className="HisopadoCart__users">
              <article className="HisopadoCart__user">
                <div className="HisopadoCart__userTitle" onClick={() => {
                  setOpenUser(!openUser);
                }}>
                 <p className="HisopadoCart__userName">Fernando Díaz</p>
                 {
                   !openUser ?
                   <FaChevronDown /> :
                   <FaChevronUp />

                 }
                </div>
                <div className={`HisopadoCart__userData ${openUser ? 'open' : ''}`}>
                  <div>
                    <label>Nombre y apellido</label>
                    <input type="text" />
                    <FaPencilAlt />
                  </div>

                  <div>
                    <label>Identificación, cédula o DNI</label>
                    <input type="text" />
                    <FaPencilAlt />
                  </div>
                  
                  <div>
                    <label>N° de celular</label>
                    <input type="text" />
                    <FaPencilAlt />
                  </div> 

                  <div>
                    <div>
                      <label>Fecha de nacimiento</label>
                      <input type="date" />
                    </div>
                    <div>
                      <label>Sexo</label>
                      <input type="text" />
                    </div>
                  </div>

                  <div>
                    <label>Domicilio</label>
                    <input type="text" />
                    <FaPencilAlt />
                  </div> 

                  <div>
                    <div>
                      <label>Piso</label>
                      <input type="text" />
                      <FaPencilAlt /> 
                    </div>
                    <div>
                      <label>Departamento</label>
                      <input type="text" />
                      <FaPencilAlt /> 
                    </div>
                  </div>

                  <div>
                    <label>Observaciones</label>
                    <input type="text" />
                    <FaPencilAlt />
                  </div>  
                  
                  <button className="HisopadoCart__btnConfirm">Continuar</button>
                  <button className="HisopadoCart__btnDelete">Eliminar hisopado</button>
                </div>

              </article>
            </div>

            <div className="HisopadoCart__addContainer">
              <span 
                onClick={()=> props.history.push('/hisopado/destinatario/:ws?')}
                className="HisopadoCart__btnContainer"
              >
              
                <button className="HisopadoCart__addBTn">+</button>
                <span className="HisopadoCart__addMsg">Agregar otro hisopado</span>
              </span>
            </div>
          </section>
        </div>

        <div className="HisopadoCart__payment">
          <div className="HisopadoCart__payDetails">
            <div className="HisopadoCart__payDetail">
              <span>Subtotal</span>
              <span>$3499</span>
            </div>
            <div className="HisopadoCart__payDetail">
              <span>Descuento</span>
              <span>$0</span>
            </div>
            <div className="HisopadoCart__payDetail">
              <span>
                <strong>Total</strong>
              </span>
              <span>
                <strong>$3499</strong>
              </span>
            </div>
          </div>

          <div className="HisopadoCart__payBtn">
            <i className="fas fa-credit-card"></i> Pagar $3499
          </div>
        </div>
      </div>
    </>
  )
}

export default HisopadoCart;