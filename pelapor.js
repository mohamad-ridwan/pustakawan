function recaptchaCallback() {
    const check = grecaptcha && grecaptcha.getResponse().length > 0
    if(check){
        document.getElementById('btnSubmitForm').style.cursor = 'pointer'
    }
}

function recaptchaExpiredCallback() {
    document.getElementById('btnSubmitForm').style.cursor = 'not-allowed'
}

function isCaptchaChecked() {
    return grecaptcha && grecaptcha.getResponse().length !== 0
}

window.onload = ()=>{
    document.getElementById('btnSubmitForm').style.cursor = 'not-allowed'
}

const header = {
    "alg": "HS256",
    "typ": "JWT"
};

// create jwt
function createJWTToken(
    header,
    data,
    secret = undefined
){
    var encodedSource
    function base64url(source){
        encodedSource = CryptoJS.enc.Base64.stringify(source)
        encodedSource = encodedSource.replace(/=+$/, '')
        encodedSource = encodedSource.replace(/\+/g, '')
        encodedSource = encodedSource.replace(/\//g, '')
        return encodedSource
    }

    function createJWT(
        header,
        data,
        secret = undefined
    ){
        let stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header))
        let encodedHeader = base64url(stringifiedHeader)
        let stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data))
        let encodedData = base64url(stringifiedData)
        let token = encodedHeader + '.' + encodedData
        if(!secret)return token
        let signature = CryptoJS.HmacSHA256(token, secret)
        signature = base64url(signature)
        return encodedHeader + '.' + encodedData + '.' + signature
    }
    const secrets = "john@99";
    // jwt result
    const token = createJWT(header, data, secrets)
    return token
}

function changeInput(nameInput){
    const value = document.getElementById(nameInput).value
    return value
}

function submitForm(){
    let data = {}
    data.name = changeInput('nama')
    data.email = changeInput('email')
    data.telpon = changeInput('telepon')
    const createTime = new Date()
    createTime.setHours(7)
    data.time = `${createTime}`
    return data
}

// submit
// document.getElementById('formPengajuan').addEventListener('click', (e)=>{
//     window.open(`pilih-menu.html?akses=${createJWTToken(
//         header,
//         submitForm()
//     )}`)
// })

function submit() {
    if(isCaptchaChecked()){
        window.open(`pilih-menu.html?akses=${createJWTToken(
            header,
            submitForm()
        )}`)
    }else{
        console.log('please check the checkbox')
    }
}