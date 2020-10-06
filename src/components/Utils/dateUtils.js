import moment from 'moment'
var d = new Date()

export function currentDate() {
  var currentMonth = ('0' + (d.getMonth() + 1)).substr(-2)
  var currentDay = ('0' + d.getDate()).substr(-2)
  var currentHours = ('0' + (d.getHours())).substr(-2)
  var currentMinutes = ('0' + d.getMinutes()).substr(-2)
  var currentSeconds = ('0' + d.getSeconds()).substr(-2)
  const currentDate = [d.getFullYear(), currentMonth, currentDay].join('-') + ' ' +
    [currentHours, currentMinutes, currentSeconds].join(':');
  return currentDate
}

export function dateWoHour() {
  var currentMonth = ('0' + (d.getMonth() + 1)).substr(-2)
  var currentDay = ('0' + d.getDate()).substr(-2)
  const dateWoHour = [d.getFullYear(), currentMonth, currentDay].join('-')
  return dateWoHour
}
export function dateWoHourPlus() {
  let currentMonth = ('0' + (d.getMonth() + 1)).substr(-2)
  let nextDay = (parseInt(('0' + d.getDate()).substr(-2)) + 1).toString()
  const dateWoHour = [d.getFullYear(), currentMonth, nextDay].join('-')
  return dateWoHour
}


export function timeWoDate() {
  var currentHours = ('0' + (d.getHours())).substr(-2)
  var currentMinutes = ('0' + d.getMinutes()).substr(-2)
  const currentDate = [currentHours, currentMinutes].join(':')
  return currentDate
}

export function yearAndMonth() {
  var currentMonth = ('0' + (d.getMonth() + 1)).substr(-2)
  const currentYandM = [d.getFullYear(), currentMonth].join('');
  return currentYandM
}

export function dateToRemaining(dateToRemain) {
  if (dateToRemain) {
    var minutesRemaining = (dateToRemain - Date.now()) / 60000 + 1
  }
  let remaining
  if (typeof minutesRemaining === "number") {
    remaining = parseInt(minutesRemaining)
  } else {
    remaining = minutesRemaining
  }
  return remaining
}

export function calculateAge(dob) {
  try {
    let dt = dob.replace('-', '')
    dt = dt.replace('-', '')
    dt = parseInt(dt)
    return dt < 20040000 ? true : false
  } catch (error) {
    console.error(error)
    return true
  }
}

export function calcReaminingHrsMins(remainingTime) {
  const remainingHoursFloat = parseFloat(remainingTime / 60)
  const remainingHours = parseInt(remainingHoursFloat)
  const reaminingMinutesFloat = (remainingHoursFloat - remainingHours).toFixed(2)
  const reaminingMinutes = Math.round(reaminingMinutesFloat * 60)
  return { remainingHours, reaminingMinutes }
}