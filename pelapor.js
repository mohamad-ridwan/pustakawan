const verifyCallback = (res)=>{
    console.log(res)
}

const sitekey = '6LeAY_4nAAAAAG4mEOA8_sXdkoXMSHb7MKLoqcgh'

let captcha
const onloadCallback = ()=>{
    captcha = grecaptcha.render('recaptcha-pustakawan', {
        'sitekey' : sitekey,
        'callback': verifyCallback()
    })
    grecaptcha.render('recaptcha-pustakawan', {
        'sitekey' : sitekey,
        'callback': verifyCallback()
    })
}

// document.getElementById('formPengajuan').addEventListener('submit', (e)=>{
//     console.log(grecaptcha.getResponse(captcha))
//     e.preventDefault()
// })

function submit(){
    console.log(grecaptcha.getResponse(captcha))
}