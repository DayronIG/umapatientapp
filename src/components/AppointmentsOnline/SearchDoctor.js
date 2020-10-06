import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GenericHeader, BackButton } from '../GeneralComponents/Headers';
import FooterBtn from '../GeneralComponents/FooterBtn';
import { DoctorCardOffice } from '../OnlineDoctor/WhenScreen/DoctorCard';
import { Loader } from '../global/Spinner/Loaders';
import { getDoctors } from '../../store/actions/firebaseQueries';
import { shuffleArr } from '../Utils/appointmentsUtils';
import '../../styles/appointmentsonline/searchDoctor.scss';

const SearchDoctor = (props) => {
    const patient = useSelector(state => state.queries.patient)
    const [doctors, setDoctors] = useState([])
    const [filteredDocs, setFilteredDocs] = useState([])
    const [loading, setLoading] = useState(false)
    const { dni } = props.match.params

    useEffect(() => {
        if (!!patient) {
            // console.log(patient)
            setLoading(true)
            try {
                getDoctors('especialista_online')
                    .then(docs => {
                        const always = patient.always && patient.always[0]
                        const filteredDocs = docs.filter((doc, index) => {
                            // console.log(doc)
                            if (doc.firstname.toLowerCase() !== 'test' && (doc.social_work && doc.social_work.includes(patient.corporate_norm))) {
                                return doc
                            }
                        })
                        setDoctors(filteredDocs)
                        setFilteredDocs(shuffleArr(filteredDocs).filter((doc, index) => index < 10 && doc))
                    })
                    .catch(error => { throw error })
            } catch (error) {
                console.error(error)
            } finally {
                setTimeout(() => setLoading(false), 3000)
            }
        }
    }, [])

    function handleSearch(str) {
        if (str.length > 3) {
            const matches = doctors.filter(doctor => doctor.fullname.toLowerCase().includes(str.toLowerCase()))
            setFilteredDocs(matches)
        } else {
            setFilteredDocs(shuffleArr(doctors).filter((doc, index) => index < 10 && doc))
        }
    }

    return (
        <>
            <GenericHeader children='Buscar médico' />
            <div className='searchDoctor_container'>
                <BackButton customTarget={`/${dni}/`} />
                <div className='searchDoctor__input'>
                    <input type='text' name='search-doctor' placeholder='Ingrese el nombre del médico'
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                {(doctors.length === 0 && !loading) && <div className='text-center mt-4'>No se encontraron médicos para tu obra social en este momento.</div>}
                {!loading ?
                    <>
                        {/* eslint-disable-next-line array-callback-return */}
                        {!!(filteredDocs.length > 0) && filteredDocs.map((doc, index) => {
                            return (
                                <div className='searchDoctor_results' key={index}
                                    onClick={() => props.history.push(`/${dni}/appointmentsonline/${doc.cuit}/calendar`)}>
                                    <DoctorCardOffice doctor={doc} />
                                </div>
                            )
                        })}
                    </>
                    :
                    <div className='text-center mt-5'>
                        <Loader />
                    </div>
                }
                <FooterBtn mode='single' text='Ver todos' callback={() => setFilteredDocs(doctors)} />
            </div>
        </>
    )
}

export default SearchDoctor;
