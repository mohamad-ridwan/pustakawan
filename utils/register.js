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
        let newData = dataRegister
        delete newData.confirmPassword
        window.location.replace(`${window.location.origin}/pages/verifikasi/verifikasi.html?access=${createJWTToken(headerJWTToken, newData)}`)
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
    return {
        jwtToken,
        tokenClient: `${token1}${token2}${token3}${token4}`,
        exp: `${new Date()}`
    }
}