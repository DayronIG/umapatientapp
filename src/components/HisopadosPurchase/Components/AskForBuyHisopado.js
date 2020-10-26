import React from 'react'

export default function AskForBuyHisopado({finalAction}) {
    return (
        <div>
            <div className="hisopados-flux-container">
                <p className="hisopados-title">¡Comprá tu hisopado a domicilio!</p>
            </div>
            <p className="frequent-questions">Preguntas frecuentes</p>
            <div onClick={() => finalAction()} className="hisopados-button hisopados-blue-background">
                Comprar hisopado
			</div>
            <div onClick={() => finalAction()} className="hisopados-button hisopados-blue-color">
                Volver
			</div>
        </div>
    )
}
