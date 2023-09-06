const headerJwt = {
    "alg": "HS256",
    "typ": "JWT"
};

// const base64regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{4}|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}={2})$/gm

const secrets = "john@99";

function redirectToPelapor() {
    window.location.replace('pelapor-pengajuan-mandiri.html')
}

const parseTokenUrl = async (token) => {
    try {
        const obj = JSON.parse(token)
        return obj
    } catch (error) {
        redirectToPelapor()
    }
}

// decode from token url
async function decodeFromTokenUrl() {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('akses')
    if (!token) {
        redirectToPelapor()
        return
    }
    // payload from token url
    const getToken = token?.includes('.') ? window.atob(token.split('.')[1]) : window.atob(token)
    const base64HeaderUrl = token?.includes('.') ? window.atob(token.split('.')[0]) : window.atob(token)

    const resultObjTokenUrl = await parseTokenUrl(getToken).then(res => res)
    const headerJwtFromUrl = JSON.parse(base64HeaderUrl)
    const wordArrayHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(headerJwtFromUrl))
    const base64Header = CryptoJS.enc.Base64.stringify(wordArrayHeader)

    const wordArrayPayload = CryptoJS.enc.Utf8.parse(JSON.stringify(resultObjTokenUrl))
    const base64Payload = CryptoJS.enc.Base64.stringify(wordArrayPayload)
    const signatueToStr = CryptoJS.HmacSHA256(base64Header + '.' + base64Payload, secrets).toString(CryptoJS.enc.Base64)
    return {signature: signatueToStr, time: resultObjTokenUrl.time}
}

async function decodeFromTokenLocalStg() {
    // local storage
    const aksesClientP = localStorage.getItem('akses-client-p')
    if (!aksesClientP) {
        redirectToPelapor()
        return
    }
    const getTokenLocalStg = aksesClientP?.includes('.') ? window.atob(aksesClientP.split('.')[1]) : window.atob(aksesClientP)
    const resultObjTokenLocalStg = await parseTokenUrl(getTokenLocalStg).then(res => res)
    // header jwt
    // from local storage
    const headerFromLocalStg = JSON.parse(window.atob(aksesClientP.split('.')[0]))
    const wordArrayHeaderLocalStg = CryptoJS.enc.Utf8.parse(JSON.stringify(headerFromLocalStg))
    const base64HeaderFromLocalStg = CryptoJS.enc.Base64.stringify(wordArrayHeaderLocalStg)

    // base64 payload from local storage
    const wordArrayPayloadLocalStg = CryptoJS.enc.Utf8.parse(JSON.stringify(resultObjTokenLocalStg))
    const base64PayloadLocalStg = CryptoJS.enc.Base64.stringify(wordArrayPayloadLocalStg)

    // signature from local storage
    const signatureLocalStgToStr = CryptoJS.HmacSHA256(base64HeaderFromLocalStg + '.' + base64PayloadLocalStg, secrets).toString(CryptoJS.enc.Base64)
    return {signature: signatureLocalStgToStr, time: resultObjTokenLocalStg.time}
}

async function jwtTokenVerify() {
    // const isValid = decodeFromTokenUrl() == decodeFromTokenLocalStg()
    // if (isValid) {
    //     return true
    // }
    // return false
    return Promise.all([decodeFromTokenUrl(), decodeFromTokenLocalStg()]).then(res=>{
        const time = new Date(res[1].time).valueOf()
        const validTime = new Date().valueOf() < time
        const validToken = res[0].signature == res[1].signature && validTime

        return validToken
    })
}

window.onload = () => {
    jwtTokenVerify()
    .then(res=>{
        if(res){
            console.log('masuk')
        }else{
            redirectToPelapor()
        }
    })
    .catch(err=>redirectToPelapor())
    // if (jwtTokenVerify()) {
    //     console.log('masuk')
    // } else {
    //     redirectToPelapor()
    // }
}