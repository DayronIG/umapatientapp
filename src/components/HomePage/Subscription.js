import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getBills } from "../../store/actions/firebaseQueries";
import '../../styles/home/subscription.scss';

const Subscription = (props) => {
    const dispatch = useDispatch()
    const patient = useSelector(state => state.queries.patient);

    return (
        <section className="subscription-container">
            <div className="subscription-module">
                <div className="subscription-plan">
                    <b>Suscripción</b>
                    <span>{(patient.suscription && patient.suscription.toUpperCase()) || "-"}</span>
                </div>
                <div className="subscription-expire">
                    <b>Finalización</b>
                    <span> - {/* bills && bills.vcto || "-" */}</span>
                </div>
                <div className="subscription-points">
                    <b>Puntos</b>
                    <span>{patient.points || "0"}</span>
                </div>
            </div>
        </section>
    )
}

export default withRouter(Subscription);