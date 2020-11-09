import moment from 'moment';

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
            if(!!value && /^\d+$/.test && value.length >= 10){              
                isValid = true;
            } 
            return isValid;
        case 'text':
            if(!!value && value.length > 2) {
                isValid  = true;
            }
            return isValid;
        case 'number':
            if(!!value && value.length >= 2 && /^\d+$/.test){
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