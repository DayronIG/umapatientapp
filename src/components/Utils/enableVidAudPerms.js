import { log_info } from '../../config/endpoints';
import Axios from 'axios';
import swal from 'sweetalert';

export default async function (dni) {
    let headers = { 'Content-Type': 'Application/Json'/* , 'Authorization': localStorage.getItem('token') */ }
    navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
    let constraints = { audio: true, video: true }
    const gumSuccess = stream => {
        Axios.post(log_info, { ws: dni, data: `[${dni}] Permisos habilitados ok` }, headers)
        return stream.getTracks().forEach(function (track) {
            track.stop()
            return 'enabled';
        })
    }
    const gumFail = err => {
        Axios.post(log_info, { data: `[${dni}] Falló habilitar: ${err}` }, headers )
        alert('Tu dispositivo tiene bloqueado el acceso a la cámara o el micrófono y no podemos activarlo. Por favor verifique los permisos de su dispositivo, borre datos temporales o intentelo con otro navegador.')
    }
    if (navigator.mediaDevices) {
        return navigator.mediaDevices
            .getUserMedia(constraints)
            .then(gumSuccess)
            .catch(gumFail)
    } else if (navigator.getUserMedia) {
        return navigator.getUserMedia(constraints, gumSuccess, gumFail)
    } else {
        return swal('Aviso',
            'La aplicación no es compatible con esta versión del navegador. Actualicelo o ingrese con otro navegador.',
            'warning')
    }
}