const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const spaceRegex = /\s/g

let dataRegister = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
}

const usernameElem = document.getElementById('username')
const emailElem = document.getElementById('email')
const passwordElem = document.getElementById('password')
const confirmPasswordElem = document.getElementById('confirmPassword')

function changeInputRegister(element, inputFilter, nameInput, errMsg) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
        element.addEventListener(event, function (e) {
            if(nameInput !== 'username'){
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
                dataRegister[nameInput] = this.value
            }else{
                if (nameInput == 'username' && inputFilter(this.value)) {
                    // Accepted value
                    if (["keydown", "mousedown", "focusout"].indexOf(e.type) >= 0) {
                        this.setCustomValidity("");
                    }
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                    dataRegister[nameInput] = this.value
                } else if (this.hasOwnProperty("oldValue")) {
                    // Rejected value - restore the previous one
                    this.setCustomValidity(errMsg);
                    this.reportValidity();
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                } else {
                    // Rejected value - nothing to restore
                    this.value = "";
                }
            }
        })
    })
}

changeInputRegister(usernameElem, (value)=>!spaceRegex.test(value), 'username', 'username tidak boleh menggunakan spasi')
changeInputRegister(emailElem, undefined, 'email', undefined)
changeInputRegister(passwordElem, undefined, 'password', undefined)
changeInputRegister(confirmPasswordElem, undefined, 'confirmPassword', undefined)

function submitRegister() {
    if (validateFormRegister()) {
        onDisabledBtn(true)
        let newData = {
            username: dataRegister.username,
            email: dataRegister.email,
            password: dataRegister.password
        }
        const resultJWTToken = createJWTToken(headerJWTToken, newData)
        const dataVerifikasi = resultDataToken(resultJWTToken)
        const dataFormBody = createReqBody(dataVerifikasi)
        postFormDataAPI(POST_API_PUSTAKAWAN, {
            method: 'GET',
        })
        .then(res=>{
            if(res?.length > 0){
                const findUser = res.find(user=>user.email == dataRegister.email)
                if(!findUser){
                    return postFormDataAPI(`${POST_VERIFIKASI}token=${resultJWTToken}&exp=${dataVerifikasi.exp}&tokenClient=${dataVerifikasi.tokenClient}`, {
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: dataFormBody
                    })
                }
                return null
            }else{
               return postFormDataAPI(`${POST_VERIFIKASI}token=${resultJWTToken}&exp=${dataVerifikasi.exp}&tokenClient=${dataVerifikasi.tokenClient}`, {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: dataFormBody
                })
            }
        })
        .then(res=>{
            if(res?.message){
                return sendDataToEmail(SERVICE_ID_EMAILJS, TEMPLATE_ID_VERIF_EMAILJS, {
                    to_email: dataRegister.email,
                    tokenClient: dataVerifikasi.tokenClient,
                    urlVerifikasi: `${window.location.origin}/pages/verifikasi/verifikasi.html?access=${resultJWTToken}`
                }, PUBLIC_KEY_EMAILJS)
            }else {
                document.getElementById('errRegister4').innerText = 'Akun dengan email ini sudah terdaftar'
                return
            }
        })
        .then(res=>{
            if(res !== undefined){
                window.location.replace(`${window.location.origin}/pages/verifikasi/verifikasi.html?access=${resultJWTToken}`)
                return
            }
            alert('terjadi kesalahan server')
            onDisabledBtn(false)
            console.log(res)
        })
        .catch(err=>{
            alert('terjadi kesalahan server')
            onDisabledBtn(false)
            console.log(err)
        })
    }
}

const textErr = 'harus diisi'

function validateFormRegister() {
    let err = {}
    const { username, email, password, confirmPassword } = dataRegister
    const errData = ['errRegister1', 'errRegister2', 'errRegister3', 'errRegister4']
    removeErrInputForm(errData)

    if (!username.trim()) {
        err.errRegister1 = textErr
    }
    if (!email.trim()) {
        err.errRegister2 = textErr
    } else if (!mailRegex.test(email)) {
        err.errRegister2 = 'alamat email tidak valid'
    }
    if (!password.trim()) {
        err.errRegister3 = textErr
    }
    if (!confirmPassword.trim()) {
        err.errRegister4 = textErr
    } else if (
        password.trim() &&
        confirmPassword.trim() &&
        confirmPassword !== password
    ) {
        err.errRegister4 = 'confirm password harus sama dengan password'
    }

    if (Object.keys(err).length > 0) {
        Object.entries(err).forEach(err => document.getElementById(err[0]).innerText = err[1])
        return
    }
    return 'success'
}

function removeErrInputForm(data) {
    data.forEach(elementId => document.getElementById(elementId).innerText = '')
}

function resultDataToken(jwtToken){
    const token1 = Math.floor(Math.random() * 9)
    const token2 = Math.floor(Math.random() * 9)
    const token3 = Math.floor(Math.random() * 9)
    const token4 = Math.floor(Math.random() * 9)

    const setTo1Hours = new Date()
    const currentHours = new Date().getHours()
    setTo1Hours.setHours(currentHours + 1)
    return {
        token: jwtToken,
        tokenClient: `${token1}${token2}${token3}${token4}`,
        exp: `${setTo1Hours}`
    }
}

function onDisabledBtn(isDisabled) {
    if (isDisabled) {
        document.getElementById('submit').setAttribute('disabled', 'true')
        document.getElementById('submit').innerText = 'Loading..'
    } else {
        document.getElementById('submit').removeAttribute('disabled')
        document.getElementById('submit').innerText = 'Register'
    }
}