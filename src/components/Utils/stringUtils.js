import moment from 'moment-timezone';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export function replaceDiacritics(str) {
    var diacritics = [
        { char: 'A', base: /[\300-\306]/g },
        { char: 'a', base: /[\340-\346]/g },
        { char: 'E', base: /[\310-\313]/g },
        { char: 'e', base: /[\350-\353]/g },
        { char: 'I', base: /[\314-\317]/g },
        { char: 'i', base: /[\354-\357]/g },
        { char: 'O', base: /[\322-\330]/g },
        { char: 'o', base: /[\362-\370]/g },
        { char: 'U', base: /[\331-\334]/g },
        { char: 'u', base: /[\371-\374]/g },
        { char: 'N', base: /[\321]/g },
        { char: 'n', base: /[\361]/g },
        { char: 'C', base: /[\307]/g },
        { char: 'c', base: /[\347]/g }
    ]
    diacritics.forEach(function (letter) {
        str = str.replace(letter.base, letter.char);
    });
    return str;
};

export function validateInput(type, value) {
    let isValid = false;
    switch (type) {
        case 'tel':
            if(!!value && /^\d+$/.test && value.length >= 13){              
                isValid = true;
            } 
            return isValid;
        case 'text':
            if(!!value && value.length > 2) {
                isValid  = true;
            }
            return isValid;
        case 'number':
            value = parseInt(value)
            if(value.toString().length === 4){
                if(!!value && /^\d+$/.test && value > 1900 && value <= moment().format("YYYY")){
                    isValid = true
                }
            } else if(!!value && /^\d+$/.test){
                isValid = true
            }
            return isValid;
        // case 'password':
        //     break;
        default:
            break;
    }
}

export function capitalizeName(name) {
    const length = name.length
    const firstLetter = name.slice(0, 1).toUpperCase()
    const restOfTheLetters = name.slice(1, length).toLowerCase()
    return `${firstLetter}${restOfTheLetters}`
}

export function checkNum(phone) {
    if(phone.slice(0, 3) === '011') {
        phone = phone.slice(1, phone.length);
    }
    let validPhone = `${parseInt(phone)}`
    if(/^(\(54\))?[\d -]{10,20}$/.test(validPhone)) {
        if (validPhone.slice(0, 2) === '54') {
            if (validPhone.slice(2, 4) === '15' && validPhone.length < 13) {
                validPhone = `${validPhone.slice(0, 2)}911${validPhone.slice(4, validPhone.length)}`
            } else if (validPhone.slice(2, 4) === '11' && validPhone.length < 13) {
                validPhone = `${validPhone.slice(0, 2)}9${validPhone.slice(2, validPhone.length)}`
            } else if (validPhone.slice(2, 4) !== '11' && validPhone.slice(2, 4) !== '15' && validPhone.length >= 10 && validPhone.length <= 12) {
                validPhone = `${validPhone.slice(0, 2)}911${validPhone.slice(2, validPhone.length)}`
            }
        } else if(validPhone.length === 10 && validPhone.slice(0, 2) === '15') {
            validPhone = `54911${validPhone.slice(2, validPhone.length)}`
        } else if(validPhone.length === 10 && validPhone.slice(3, 4) !== '15') {
            validPhone = `549${validPhone}`
        }
    } else if (phone.length >= 11) {
        return phone
    } else {
        console.log("Teléfono inválido")
        return false;
    }
    return validPhone
}

export function spacesToUnderscore(str) {
    try {
        const strArr = str.split(' ')
        let finalResult = ''
        if (strArr.length > 0) {
            strArr.forEach((word, index) => {
                if (index === 0) {
                    finalResult = `${word}`
                } else {
                    finalResult = `${finalResult}_${word}`
                }
            })
        } else {
            finalResult = str
        }
        return finalResult
    } catch (error) {
        console.error(error)
    }
}

export function underscoreToSpaces(str) {
    try {
        const strArr = str?.split('_')
        let finalResult = ''
        if (strArr?.length > 0) {
            strArr.forEach((word, index) => {
                if (index === 0) {
                    finalResult = `${word}`
                } else {
                    finalResult = `${finalResult} ${word}`
                }
            })
        } else {
            finalResult = str
        }
        return finalResult
    } catch (error) {
        console.error(error)
    }
}

export function genTransportId({ dni }) {
	return `${moment().format('YYYYMMDDhhmm')}_${dni}`;
}

export function getDay(index) {
	return days[index];
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}