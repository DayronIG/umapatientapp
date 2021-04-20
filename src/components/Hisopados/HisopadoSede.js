import React from 'react'
import { GenericHeader } from '../GeneralComponents/Headers'
import { useSelector } from 'react-redux'

const HisopadoSede = () => {
    const { fullname } = useSelector(state => state.user)

    return (
        <>
            <GenericHeader children={fullname} />

            <section>
                <label>
                    Sede 1
                    <input type="radio" name="sede" checked/>
                </label>
                <label>
                    Sede 2
                    <input type="radio" name="sede"/>
                </label>
                <label>
                    Sede 3
                    <input type="radio" name="sede"/>
                </label>

                <button>Continuar</button>
            </section>
        </>
    )
}

export default HisopadoSede