const SERVICE_ID_EMAILJS = 'service_n6ulit7'
const TEMPLATE_ID_VERIF_EMAILJS = 'template_l8kxjzi'
const PUBLIC_KEY_EMAILJS = 'fvB99jFfi8z5-c4X-'

async function sendDataToEmail(
    serviceId,
    templateId,
    data,
    publicKey
){
    return await new Promise((resolve, reject)=>{
        emailjs.send(
            serviceId,
            templateId,
            data,
            publicKey
        )
        .then(res=>{
            resolve(res)
        }, (err)=>{
            reject(err)
        })
    })
}