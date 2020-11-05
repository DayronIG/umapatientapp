import { post, get } from 'axios';
import * as URLs from '../../config/endpoints';
import { parseXMLResponse } from '../../components/Utils/xmlUtils';
import moment from 'moment-timezone';


const dateISO = moment()
	.tz('America/Argentina/Buenos_Aires')
	.toISOString()
	.split('.')[0];
// const todayWithoutHyphen = moment().tz('America/Argentina/Buenos_Aires').format("YYYYMMDD")
const todayWithHyphen = moment()
	.tz('America/Argentina/Buenos_Aires')
	.format('YYYY-MM-DD');
const config = { headers: { 'Content-Type': 'application/json' } };
const configGet = { headers: { Accept: 'application/json' } };
const { validate_up_dni, validate_up_dni_type2, post_up_ELG, post_up_AP, write_os } = URLs;

// 95988373 - 1530027
export function validateUPAffDni(dni = '') {
	return new Promise(function(resolve, reject) {
		try {
			return get(`${validate_up_dni}&document=${dni}`, configGet)
				.then(function(res) {
					// console.log(res.data)
					if (res.data.origin === 'up' || res.data.origin === 'ac') {
						return resolve(true);
					} else {
						return reject(false);
					}
				})
				.catch(function(error) {
					// console.error(error)
					return reject(false);
				});
		} catch (error) {
			// console.error(error)
			return reject(false);
		}
	});
}

export function validateUPAff_byDocType(dni = '', docTypes) {
	return new Promise(async function(resolve, reject) {
		try {
			for (let i = 0; i < docTypes.length; i++) {
				const docType = docTypes[i];
				const helper = await get(
					`${validate_up_dni_type2}&document=${dni}&document_type=${docType}`,
					configGet
				);
				const { data } = helper;
				if (docTypes.length === i + 1) {
					return resolve('');
				} else if (!!data?.accounts?.length > 0) {
					return resolve(data.accounts[0].credential_number);
				} else {
					continue;
				}
			}
		} catch (error) {
			console.error(error);
			return reject(false);
		}
	});
}

// 54715300 , 265007800 -> testing
export function transcELG(n_afiliado = '') {
	return new Promise(function(resolve, reject) {
		try {
			return post(post_up_ELG, { n_afiliado, dateISO, todayWithHyphen }, config)
				.then(function(res) {
					const { resStatusText: status = '' } = parseXMLResponse(res.data);
					// console.log(status)
					if (status === 'OK') {
						return resolve(true);
					} else {
						return reject(false);
					}
				})
				.catch(function(error) {
					// console.log(error)
					return reject(false);
				});
		} catch (error) {
			// console.error(error)
			return reject(false);
		}
	});
}

export function transcAP(n_afiliado) {
	return new Promise(function(resolve, reject) {
		try {
			return post(post_up_AP, { dateISO, todayWithHyphen, n_afiliado }, config)
				.then(function(res) {
					const { resStatusText: status = '' } = parseXMLResponse(res.data);
					if (status === 'OK') return resolve(true);
					else return reject(false);
				})
				.catch(function(error) {
					// console.error(error)
					return reject(false);
				});
		} catch (error) {
			// console.error(error)
			return reject(false);
		}
	});
}

export function writeOSData(data) {
	return new Promise(function(resolve, reject) {
		try {
			return post(write_os, data, config)
				.then(function(res) {
					if (res.data === 'ok') {
						return resolve(true);
					} else {
						return reject(false);
					}
				})
				.catch(function(err) {
					return reject(false);
				});
		} catch (error) {
			// console.error(error)
			return reject(false);
		}
	});
}
