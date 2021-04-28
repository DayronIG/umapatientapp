import React from 'react'
import moment from 'moment-timezone';
import { EditButton } from './EditComponent';
import { FaUser } from 'react-icons/fa';


export const UserPic = ({patient}) => {
    return(
        patient.profile_pic ?
            <div className='pic-container'>
                <img className='profile-pic' 
                    src={patient.profile_pic} 
                    alt='Perfil' 
                /> 
                <EditButton section='pic' className='btn-edit' clase='pic' />
            </div>
        : 
            <div className='pic-container'>
                <FaUser size='3.5rem' color='#fff' />
                <EditButton section='pic' className='btn-edit' clase='pic' />
            </div>
    )
}

export const UserProfile = ({patient}) => {

    const personalData = [
		{
			item: 1,
			field: 'Nombre/s',
			data: `${patient.fullname}`
		},
		{
			item: 2,
			field: 'Teléfono',
			data: `${patient.ws}`
		}, 
		{
			item: 3,
			field: 'DNI / Número de documento',
			data: `${patient.dni}`
		}, 
		{
			item: 4,
			field: 'Fecha de nacimiento',
			data: `${moment(patient.dob).format('DD-MM-YYYY')}`
		},
		{
			item: 5,
			field: 'Cobertura de salud',
			data: `${patient.corporate == '' ? 'No posee' : patient.corporate}`
		},
		{
			item: 6,
			field: 'Sexo',
			data: 
			`${
				patient.sex === 'F' && 'Femenino' || 
				patient.sex === 'M' && 'Masculino' ||
				patient.sex === 'O' && 'Otro'
			}`
		},
		{
			item: 7,
			field: 'Dirección',
			data: `${patient.address}`
		},
		{
			item: 8,
			field: 'Piso/Dpto',
			data: `${patient.piso}`
		}
	]

    return (
        personalData.map((item) => {
            return (
                <div className='data-field' key={item.item}>
                    <p className='field'>{item.field}</p>
                    <p className='data'>{item.data}</p>
                </div>
            )
        })
    )
}
