const header = {
    "alg": "HS256",
    "typ": "JWT"
};

const secrets = "john@99";

function decodeJWTVerify(){
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('akses')
    // payload from token url
    let newToken = {}
    const getToken = window.atob(token.split('.')[1])
    const parseTokenUrl = async (token)=>{
        try {
            const obj = JSON.parse(token)
            return obj
        } catch (error) {
            window.open('pelapor-pengajuan-mandiri.html')
        }
    }
    parseTokenUrl(getToken)
    .then(res=>{
        newToken.payload = res
    })
    // local storage
    let payloadFromTokenStg = {}
    const aksesClientP = localStorage.getItem('akses-client-p')
    const getTokenLocalStg = window.atob(aksesClientP.split('.')[1])
    parseTokenUrl(getTokenLocalStg)
    .then(res=>{
        payloadFromTokenStg.payload = res
    })
    // header jwt
    // from url
    // decode jwt
    const wordArrayHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header))
    const base64Header = CryptoJS.enc.Base64.stringify(wordArrayHeader)
    // header jwt
    // from local storage
    const headerFromLocalStg = JSON.parse(window.atob(aksesClientP.split('.')[0]))
    const wordArrayHeaderLocalStg = CryptoJS.enc.Utf8.parse(JSON.stringify(headerFromLocalStg))
    const base64HeaderFromLocalStg = CryptoJS.enc.Base64.stringify(wordArrayHeaderLocalStg)
    
    // base64 payload from url
    const wordArrayPayload = CryptoJS.enc.Utf8.parse(JSON.stringify(newToken.payload))
    const base64Payload = CryptoJS.enc.Base64.stringify(wordArrayPayload)

    // base64 payload from local storage
    const wordArrayPayloadLocalStg = CryptoJS.enc.Utf8.parse(JSON.stringify(payloadFromTokenStg.payload))
    const base64PayloadLocalStg = CryptoJS.enc.Base64.stringify(wordArrayPayloadLocalStg)

    // signature
    // const signatue = CryptoJS.HmacSHA256(base64Header + '.' + base64Payload, secrets)
    // const base64Sign = CryptoJS.enc.Base64.stringify(signatue)
    const signatueToStr = CryptoJS.HmacSHA256(base64Header + '.' + base64Payload, secrets).toString(CryptoJS.enc.Base64)
    // const valid = signatueToStr == base64Sign

    // signature from local storage
    // const signatureLocalStg= CryptoJS.HmacSHA256(base64HeaderFromLocalStg + '.' + base64PayloadLocalStg, secrets)
    // const base64SignLocalStg = CryptoJS.enc.Base64.stringify(signatureLocalStg)
    const signatureLocalStgToStr = CryptoJS.HmacSHA256(base64HeaderFromLocalStg + '.' + base64PayloadLocalStg, secrets).toString(CryptoJS.enc.Base64)
    const isValid = signatueToStr == signatureLocalStgToStr
    if(isValid){
        return true
    }
    return false
}

window.onload = ()=>{
    if(decodeJWTVerify()){
        console.log('masuk')
    }else{
        window.open('pelapor-pengajuan-mandiri.html')
        setTimeout(() => {
            alert('token tidak valid')
        }, 500);
    }
}