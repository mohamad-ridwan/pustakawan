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
    console.log('callback')
    console.log('recaptcha-response',grecaptcha.getResponse())
}

// document.getElementById('formPengajuan').addEventListener('submit', (e)=>{
//     console.log(grecaptcha.getResponse(captcha))
//     e.preventDefault()
// })

function submit(){
    console.log('submit is clicked')
}

function isCaptchaChecked(){
    return grecaptcha && grecaptcha.getResponse().length !== 0
}

const btnSubmit = document.getElementById('submit')

if(isCaptchaChecked() && btnSubmit){
    btnSubmit.style.cursor = 'not-allowed'
}else{
    if(btnSubmit){
        btnSubmit.style.cursor = 'pointer'
    }
}