import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import swal from 'sweetalert';

function ValidateAction(props) {
    const history = useHistory()
    // props: action, field, moduleAction, children, msg
    const { plan } = useSelector(state => state.queries)
    const [activated, setActivated] = React.useState(false)

    React.useEffect(() => {
        if (props.field && plan?.plan?.[props.field] === true)
            setActivated(true)
        else
            setActivated(false)
    }, [props, plan])

    const launchAction = () => {
        switch (props.action) {
            case 'not-clickable':
                return swal('Aviso', !!props.msg ? props.msg : 'No tiene acceso este módulo.', 'warning')
            case 'moduleAction':
                return props.moduleAction()
            case 'redirect':
                return history.push('/accessDenied')
            default:
                return swal('Aviso', 'No tiene acceso este módulo.', 'warning')
        }
    }

    return (
        <>
            {activated ?
                <> {props.children} </> :
                <> {React.cloneElement(props.children, { onClick: launchAction })} </>
            }
        </>
    )
}

export default ValidateAction;