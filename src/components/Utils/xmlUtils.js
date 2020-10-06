export const parseXMLResponse = (xml) => {
  try {
    let xml_data = xml
    if (xml_data.indexOf('&lt;') > 0) {
      xml_data = xml_data.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    }
    let resStatusText = '', resMSGText = '', resMSGGadicText = '', resRSPMSGPText = ''
    const htmlDoc = new DOMParser().parseFromString(xml_data, 'text/xml')
    try {
      resStatusText = htmlDoc.getElementsByTagName('STATUS')[0].innerHTML
    } catch (error) { }
    try {
      resMSGText = htmlDoc.getElementsByTagName('RSPMSGG')[0].innerHTML
    } catch (error) { }
    try {
      resMSGGadicText = htmlDoc.getElementsByTagName('RSPMSGGADIC')[0].innerHTML
    } catch (error) { }
    try {
      resRSPMSGPText = htmlDoc.getElementsByTagName('RSPMSGP')[0].innerHTML
    } catch (error) { }
    return {
      resStatusText,
      resMSGText,
      resMSGGadicText,
      resRSPMSGPText
    }
  } catch (error) {
    const errMsg = new Error('Error al parsear respuesta XML')
    console.error(errMsg, error)
    return false
  }
}