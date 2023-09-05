// const verifyCallback = (res)=>{
//     console.log(res)
// }

// const sitekey = '6LeAY_4nAAAAAG4mEOA8_sXdkoXMSHb7MKLoqcgh'

// let captcha
// const onloadCallback = ()=>{
//     captcha = grecaptcha.render('recaptcha-pustakawan', {
//         'sitekey' : sitekey,
//         'callback': verifyCallback()
//     })
//     grecaptcha.render('recaptcha-pustakawan', {
//         'sitekey' : sitekey,
//         'callback': verifyCallback()
//     })
// }

function recaptchaCallback() {
    return grecaptcha && grecaptcha.getResponse().length > 0
}

function recaptchaExpiredCallback() {
    console.log('recaptcha is expired')
}

function isCaptchaChecked() {
    return grecaptcha && grecaptcha.getResponse().length !== 0
}

function submit() {
    if(isCaptchaChecked()){
        window.open('pilih-menu.html')
    }else{
        console.log('please check the checkbox')
    }
}

if (recaptchaCallback()) {
    document.getElementById('submit').style.cursor = 'pointer'
} else {
    document.getElementById('submit').style.cursor = 'not-allowed'
}