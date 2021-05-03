import * as service from '../types/servicesTypes'

export const setAllServices = (data) => ({
    type: service.SET_ALL_SERVICE,
    payload: data,
})

export const setNewService = (data) => ({
    type: service.SET_NEW_SERVICE,
    payload: data,
})