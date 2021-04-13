import React, { useEffect } from 'react'

export default function MPbutton({ data }){
    useEffect(()=>{
        const script = document.createElement('script'); //Crea un elemento html script
        const attr_data_preference = document.createAttribute('data-preference-id') //Crea un nodo atribute
        attr_data_preference.value = data.id //Le asigna como valor el id que devuelve MP

        //Agrega atributos al elemento script
        script.src="https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js"; 
        script.setAttributeNode(attr_data_preference) 

        const texto = document.createAttribute('data-button-label')
        texto.value = 'COMPRAR'
        script.setAttributeNode(texto)
        const colorElements = document.createAttribute('data-elements-color')
        colorElements.value = '#0A6DD7'
        script.setAttributeNode(colorElements)

        //Agrega el script como nodo hijo del elemento form
        document.getElementById('form1').appendChild(script)

        return () =>{
        //Elimina el script como nodo hijo del elemento form
        document.getElementById('form1').removeChild(script);
        } 
    },[data])
    
    return(
        <div>
            <button id='form1' style={{backgroundColor: 'white', border: 'none'}} data-button-label="Comprar"></button>
        </div>
    )
}
