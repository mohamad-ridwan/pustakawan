const SERVICE_ID_EMAILJS = 'service_n6ulit7'
const TEMPLATE_ID_VERIF_EMAILJS = 'template_l8kxjzi'
const TEMPLATE_ID_REVISI_TENAGA = 'template_md6t49q'
const TEMPLATE_ID_REVISI_FUNGSIONAL = 'template_bqxbitg'
const PUBLIC_KEY_EMAILJS = 'fvB99jFfi8z5-c4X-'

const SERVICE_ID_PUSTAKAWAN_2 = 'service_9lrsuyl'
const TEMPLATE_ID_PUSTAKAWAN_2 = 'template_2x24mkn'
const PUBLIC_KEY_PUSTAKAWAN_2 = 'vp2Hnw7CBezjyJEWN'

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