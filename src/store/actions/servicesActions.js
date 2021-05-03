import * as service from '../types/servicesTypes'

export const getExistingDeliveryServices = (data) => ({
    type: service.GET_EXISTING_DELIVERY_SERVICES,
    payload: data,
})

export const getExistingOnSiteServices = (data) => ({
    type: service.GET_EXISTING_ON_SITE_SERVICES,
    payload: data,
})

export const setAllDeliveryServices = (data) => ({
    type: service.SET_ALL_DELIVERY_SERVICE,
    payload: data,
})

export const setAllOnSiteServices = (data) => ({
    type: service.SET_ALL_ON_SITE_SERVICE,
    payload: data,
})

export const setNewDeliveryServices = (data) => ({
    type: service.SET_NEW_DELIVERY_SERVICE,
    payload: data,
})

export const setNewOnSiteServices = (data) => ({
    type: service.SET_NEW_ON_SITE_SERVICE,
    payload: data,
})