const header = {
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
function decodeFromTokenUrl() {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('akses')
    if (!token) {
        redirectToPelapor()
        return
    }
    // payload from token url
    let newToken = {}
    const getToken = token?.includes('.') ? window.atob(token.split('.')[1]) : window.atob(token)
    parseTokenUrl(getToken)
        .then(res => {
            newToken.payload = res
        })
    const wordArrayHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header))
    const base64Header = CryptoJS.enc.Base64.stringify(wordArrayHeader)

    const wordArrayPayload = CryptoJS.enc.Utf8.parse(JSON.stringify(newToken.payload))
    const base64Payload = CryptoJS.enc.Base64.stringify(wordArrayPayload)
    const signatueToStr = CryptoJS.HmacSHA256(base64Header + '.' + base64Payload, secrets).toString(CryptoJS.enc.Base64)
    return signatueToStr
}

function decodeFromTokenLocalStg() {
    // local storage
    let payloadFromTokenStg = {}
    const aksesClientP = localStorage.getItem('akses-client-p')
    if (!aksesClientP) {
        redirectToPelapor()
        return
    }
    const getTokenLocalStg = aksesClientP?.includes('.') ? window.atob(aksesClientP.split('.')[1]) : window.atob(aksesClientP)
    parseTokenUrl(getTokenLocalStg)
        .then(res => {
            payloadFromTokenStg.payload = res
        })
    // header jwt
    // from local storage
    const headerFromLocalStg = JSON.parse(window.atob(aksesClientP.split('.')[0]))
    const wordArrayHeaderLocalStg = CryptoJS.enc.Utf8.parse(JSON.stringify(headerFromLocalStg))
    const base64HeaderFromLocalStg = CryptoJS.enc.Base64.stringify(wordArrayHeaderLocalStg)

    // base64 payload from local storage
    const wordArrayPayloadLocalStg = CryptoJS.enc.Utf8.parse(JSON.stringify(payloadFromTokenStg.payload))
    const base64PayloadLocalStg = CryptoJS.enc.Base64.stringify(wordArrayPayloadLocalStg)

    // signature from local storage
    const signatureLocalStgToStr = CryptoJS.HmacSHA256(base64HeaderFromLocalStg + '.' + base64PayloadLocalStg, secrets).toString(CryptoJS.enc.Base64)
    return signatureLocalStgToStr
}

function jwtTokenVerify() {    
    const isValid = decodeFromTokenUrl() == decodeFromTokenLocalStg()
    if (isValid) {
        return true
    }
    return false
}

window.onload = () => {
    if (jwtTokenVerify()) {
        console.log('masuk')
    } else {
        redirectToPelapor()
    }
}