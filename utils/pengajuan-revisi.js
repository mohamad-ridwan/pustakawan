const phoneRegex = /^\d*$/

let currentOption = 'Silahkan Pilih'
let searchValue = ''

const searchInput = document.getElementById('searchRevisi')

function changeSelectOptRevisi() {
    currentOption = document.getElementById('selectSearchRevisi').value
    if (currentOption !== 'Silahkan Pilih') {
        setInputSearch(true)
    } else {
        setInputSearch(false)
    }
    searchInput.value = ''
    setErr('')
}

function setInputSearch(isDisabled) {
    if (isDisabled) {
        document.getElementById('searchRevisi').removeAttribute('disabled')
    } else {
        document.getElementById('searchRevisi').setAttribute('disabled', 'true')
    }
}

// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter, errMsg, inputTYPE) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
        textbox.addEventListener(event, function (e) {
            if (inputTYPE === 'NIP' && currentOption === 'NIP' && this.value.length > 18) {
                this.setCustomValidity('Maksimal NIP 18 digit');
                this.reportValidity();
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                return
            } else if (inputTYPE === 'NIP' && currentOption === 'NIK' && this.value.length > 16) {
                this.setCustomValidity('Maksimal NIK 16 digit');
                this.reportValidity();
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
            if (inputFilter(this.value)) {
                // Accepted value
                if (["keydown", "mousedown", "focusout"].indexOf(e.type) >= 0) {
                    this.classList.remove("input-error");
                    this.setCustomValidity("");
                }
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                // Rejected value - restore the previous one
                this.classList.add("input-error");
                this.setCustomValidity(errMsg);
                this.reportValidity();
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                // Rejected value - nothing to restore
                this.value = "";
            }
        });
    });
}

setInputFilter(searchInput, (value) => phoneRegex.test(value), "Harus berupa angka", 'NIP');

let loadingSubmit = false

document.getElementById('submitSearch').addEventListener('click', () => {
    if (loadingSubmit == false) {
        validateSubmit()
            .then(res => {
                loadingSubmit = true
                document.getElementById('submitSearch').setAttribute('disabled', 'true')
                validateNIPRevisi(searchInput.value, currentOption == 'NIP' ? 'NIP' : 'NIK')
                    .then(res => {
                        if (res?.message == 'success') {
                            setErr(`Data ${currentOption} tidak terdaftar. Silahkan daftar pada menu Form Fungsional/Tenaga untuk menjadi Pustakawan.`)
                            document.getElementById('submitSearch').removeAttribute('disabled')
                            loadingSubmit = false
                        } else if (res?.message == 'error') {
                            const setTo1Hours = new Date()
                            const currentHours = new Date().getHours()
                            setTo1Hours.setHours(currentHours + 1)
                            const jwtToken = createJWTToken(
                                headerJWTToken,
                                {
                                    id: res.data.id,
                                    exp: `${setTo1Hours}`
                                },
                            )
                            if (res?.data?.pekerjaan == 'Fungsional Pustakawan') {
                                window.location.replace(`${window.location.origin}/pages/revisi-fungsional/revisi-fungsional.html?id=${jwtToken}`)
                            } else if (res?.data?.pekerjaan == 'Tenaga Perpustakaan') {
                                window.location.replace(`${window.location.origin}/pages/revisi-tenaga/revisi-tenaga.html?id=${jwtToken}`)
                            }
                        }
                    })
            })
            .catch(err => {
                setErr(err)
            })
    }
})

async function validateSubmit() {
    let err = {}
    setErr('')
    if (currentOption === 'Silahkan Pilih') {
        err.err = 'Harus diisi'
    } else if (currentOption === 'NIP' && searchInput.value.length < 18) {
        err.err = 'Maksimal NIP 18 digit'
    } else if (currentOption === 'NIK' && searchInput.value.length < 16) {
        err.err = 'Maksimal NIK 16 digit'
    }
    return await new Promise((resolve, reject) => {
        if (Object.keys(err).length !== 0) {
            reject(err.err)
        } else {
            resolve('success')
        }
    })
}

function setErr(err) {
    document.getElementById('errSearch').innerText = err
}

async function validateNIPRevisi(value, actionTYPE) {
    return await new Promise((resolve, reject) => {
        fetch(`http://localhost/pustakawanbogor/api/pustakawan.php`)
            .then(res => res.json())
            .then(res => {
                const data = filtersNIPORNIK(res, actionTYPE, value)
                if (res.length > 0) {
                    if (data.type == 'NIP') {
                        if (data.value) {
                            resolve({ message: 'error', text: 'Data NIP ini telah terdaftar didatabase. Apabila ingin melihat/mengupdate data, silakan pilih menu Revisi Data.', data: data.data })
                        } else {
                            resolve({ message: 'success', text: 'NIP bisa digunakan' })
                        }
                    } else if (data.type == 'NIK') {
                        if (data.value) {
                            resolve({ message: 'error', text: 'Data NIK ini telah terdaftar didatabase. Apabila ingin melihat/mengupdate data, silakan pilih menu Revisi Data.', data: data.data })
                        } else {
                            resolve({ message: 'success', text: 'NIK bisa digunakan' })
                        }
                    }
                } {
                    resolve({ message: 'success', text: `${actionTYPE} bisa digunakan` })
                }
            })
            .catch(err => {
                alert('Terjadi kesalahan server. Mohon coba lagi nanti')
                console.log(err)
            })
    })
}

function filtersNIPORNIK(data, actionTYPE, value) {
    if (actionTYPE === 'NIP') {
        const cekNIP = data.find(item => item.nip === value)
        if (cekNIP) {
            return {
                type: 'NIP',
                value: true,
                data: cekNIP
            }
        }
        return {
            type: 'NIP',
            value: false,
            data: {}
        }
    } else {
        const cekNIK = data.find(item => item.nik === value)
        if (cekNIK) {
            return {
                type: 'NIK',
                value: true,
                data: cekNIK
            }
        }
        return {
            type: 'NIK',
            value: false,
            data: {}
        }
    }
}