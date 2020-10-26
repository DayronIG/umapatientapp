import React from 'react'

export default function ConfirmationHisopado({finalAction}) {
    return (
        <div>
            <div className="hisopados-flux-container">
                <h1>¡Perfecto!</h1>
                <p>Su pago es ..., será redirigido a la pantalla de pago.</p>
            </div>
            <div onClick={() => finalAction()} className="hisopados-button hisopados-blue-background">
                Confirmar Hisopado
            </div>
            <div onClick={() => finalAction()} className="hisopados-button hisopados-blue-color">
                Cancelar Hisopado
            </div>
        </div>
    )
}
