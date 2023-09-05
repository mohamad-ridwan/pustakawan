const specialCharacter = /[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/g
const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const phoneRegex = /[^0-9.]/g

let errForm = {
    nama: 'Harus di isi',
    email: 'Harus di isi',
    telepon: 'Harus di isi',
    checkbox: 'Mohon ceklis di cekbox',
}

function checkReadySubmit() {
    if (Object.keys(errForm).length === 0) {
        document.getElementById('btnSubmitForm').style.cursor = 'pointer'
    }
}

function recaptchaCallback() {
    const check = grecaptcha && grecaptcha.getResponse().length > 0
    if (check) {
        putErrInput('errCaptcha', '')
        delete errForm.checkbox
        checkReadySubmit()
    }
}

function recaptchaExpiredCallback() {
    document.getElementById('btnSubmitForm').style.cursor = 'not-allowed'
}

function isCaptchaChecked() {
    return grecaptcha && grecaptcha.getResponse().length !== 0
}

window.onload = () => {
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
) {
    var encodedSource
    function base64url(source) {
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
    ) {
        let stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header))
        let encodedHeader = base64url(stringifiedHeader)
        let stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data))
        let encodedData = base64url(stringifiedData)
        let token = encodedHeader + '.' + encodedData
        if (!secret) return token
        let signature = CryptoJS.HmacSHA256(token, secret)
        signature = base64url(signature)
        return encodedHeader + '.' + encodedData + '.' + signature
    }
    const secrets = "john@99";
    // jwt result
    const token = createJWT(header, data, secrets)
    return token
}

function changeInput(nameInput) {
    const value = document.getElementById(nameInput).value
    return value
}
function putErrInput(errId, textErr) {
    document.getElementById(errId).textContent = textErr
}

document.getElementById('nama').addEventListener('change', (e) => {
    if (!specialCharacter.test(e.target.value)) {
        delete errForm.nama
        checkReadySubmit()
        putErrInput('errNama', '')
    }
})
document.getElementById('email').addEventListener('change', (e) => {
    delete errForm.email
    checkReadySubmit()
    putErrInput('errEmail', '')
})
document.getElementById('telepon').addEventListener('change', (e) => {
    if (!phoneRegex.test(e.target.value)) {
        delete errForm.telepon
        checkReadySubmit()
        putErrInput('errTelepon', '')
    }
})

function createExpiredTime(date, hours) {
    date.setHours(date.getHours() + hours)
    return date
}
const currentDate = new Date()

function submitForm() {
    let data = {}
    data.name = changeInput('nama')
    data.email = changeInput('email')
    data.telpon = changeInput('telepon')
    data.time = `${createExpiredTime(currentDate, 2)}`
    return data
}

function submit() {
    if (validateForm() && isCaptchaChecked()) {
        window.open(`pilih-menu.html?akses=${createJWTToken(
            header,
            submitForm()
        )}`)
    } else {
        errForm.checkbox = 'please check the checkbox'
        putErrInput('errCaptcha', 'Harus di isi')
    }
}

function validateForm() {
    let err = {}
    if (!changeInput('nama')?.trim()) {
        errForm.nama = 'Harus di isi'
        err.nama = 'Harus di isi'
        putErrInput('errNama', 'Harus di isi')
    } else if (specialCharacter.test(changeInput('nama'))) {
        errForm.nama = 'Nama hanya bisa berupa huruf abjad'
        err.nama = 'Nama hanya bisa berupa huruf abjad'
        putErrInput('errNama', 'Nama hanya bisa berupa huruf abjad')
    }
    if (!changeInput('email')?.trim()) {
        errForm.email = 'Harus di isi'
        err.email = 'Harus di isi'
        putErrInput('errEmail', 'Harus di isi')
    } else if (!mailRegex.test(changeInput('email'))) {
        errForm.email = 'Alamat email tidak valid'
        err.email = 'Alamat email tidak valid'
        putErrInput('errEmail', 'Alamat email tidak valid')
    }
    if (!changeInput('telepon')?.trim()) {
        errForm.telepon = 'Harus di isi'
        err.telepon = 'Harus di isi'
        putErrInput('errTelepon', 'Harus di isi')
    } else if (phoneRegex.test(changeInput('telepon'))) {
        errForm.telepon = 'Masukkan nomor telepon yang benar (081..)'
        err.telepon = 'Masukkan nomor telepon yang benar (081..)'
        putErrInput('errTelepon', 'Masukkan nomor telepon yang benar (081..)')
    }
    if (Object.keys(err).length !== 0) {
        return
    }
    return 'sukses'
}