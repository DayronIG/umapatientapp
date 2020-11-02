import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Check from '@material-ui/icons/Check';

const TrackingStepper = ({active}) => (
    <Stepper activeStep={active} orientation="vertical" className="tracking__stepperBar">
        <Step className="tracking__step">
            <StepLabel className="tracking__stepLabel" StepIconComponent={Check}>En preparación</StepLabel>
            <StepContent className="tracking__stepContent">
                El personal de salud está preparando su equipo
            </StepContent>
        </Step>
        <Step className="tracking__step">
            <StepLabel className="tracking__stepLabel" StepIconComponent={Check}>En camino</StepLabel>
            <StepContent className="tracking__stepContent">
                Tu enfermero Juan Rodríguez está en camino
            </StepContent>
        </Step>
        <Step className="tracking__step">
            <StepLabel className="tracking__stepLabel" StepIconComponent={Check}>En domicilio</StepLabel>
            <StepContent className="tracking__stepContent">
                Tu enfermero Juan Rodríguez ha llegado a tu domicilio
            </StepContent>
        </Step>
        <Step className="tracking__step">
            <StepLabel className="tracking__stepLabel" StepIconComponent={Check}>Hisopado</StepLabel>
            <StepContent className="tracking__stepContent">
                Se ha realizado el hisopado 
            </StepContent>
        </Step>
        <Step className="tracking__step">
            <StepLabel className="tracking__stepLabel" StepIconComponent={Check}>Resultado</StepLabel>
            <StepContent className="tracking__stepContent">
                Se ha cargado el resultado 
            </StepContent>
        </Step>
    </Stepper>
);

export default TrackingStepper;