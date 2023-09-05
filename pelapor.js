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

function recaptchaCallback(){
    console.log('recaptcha-response',grecaptcha.getResponse())
}

function recaptchaExpiredCallback(){
    console.log('recaptcha is expired')
}

function isCaptchaChecked(){
    return grecaptcha && grecaptcha.getResponse().length !== 0
}

function submit(){
    console.log('submit is clicked')
}

const btnSubmit = document.getElementById('submit')

if(isCaptchaChecked() && btnSubmit){
    btnSubmit.style.cursor = 'pointer'
}else if(btnSubmit){
    btnSubmit.style.cursor = 'not-allowed'
}