// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_6wHXM8b9RRsSiR59xadrE1fgtupIl2M",
    authDomain: "e-learning-rp.firebaseapp.com",
    projectId: "e-learning-rp",
    storageBucket: "e-learning-rp.appspot.com",
    messagingSenderId: "780681977622",
    appId: "1:780681977622:web:f4909c8296f45413aa7a37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

const rootFolderPustakawan = 'pustakawan'

const POST_API_PUSTAKAWAN = 'http://localhost/pustakawanbogor/api/pustakawan.php'

async function uploadImgToFirebase(rootFolder, nameFile, FILE, nameInput) {
    return await new Promise((resolve, reject) => {
        const storageRef = ref(storage, `${rootFolder}/${nameFile}`)
        uploadBytes(storageRef, FILE)
            .then((snapshot) => {
                getDownloadURL(ref(storage, snapshot.metadata.fullPath))
                    .then(urlFile => {
                        resolve({ [nameInput]: urlFile })
                    })
                    .catch(err => reject({
                        errMsg: 'err-download-file-firebase',
                        errFirebase: err
                    }))
            })
            .catch(err => {
                reject({
                    errMsg: 'err-upload-file-firebase',
                    errFirebase: err
                })
            })
    })
}

let loadingSubmitFungsional = false

// form submit fungsional
document.getElementById('submitFormFungsional')?.addEventListener('click', () => {
    if (loadingSubmitFungsional === false) {
        Promise.all([
            validateFormNamaKolom(),
            validateFormAddCard(),
            validateFormLampiranData(),
        ])
            .then(res => {
                const checkValidate = res.filter(validate => validate === undefined)
                if (checkValidate.length > 0) {
                    createAlert('Mohon lengkapi formulir Anda!.')
                    return 'failed'
                }
                return 'success'
            })
            .then(res => {
                if (res === 'success' && window.confirm('Ingin mendaftarkan sebagai Fungsional Pustakawan?')) {
                    spinnerGlobalLoading('flex')
                    submitFungsional()
                } else {
                    spinnerGlobalLoading('none')
                    loadingSubmitFungsional = false
                    console.log(res)
                }
            })
            .catch(err => {
                console.log('err-submit-form', err)
                loadingSubmitFungsional = false
            })
    }

})

function submitFungsional() {
    loadingSubmitFungsional = true
    const {
        gambar_users,
        nip,
        nik,
        sk_pustakawan,
        sk_pangkat,
        dokumen1,
        dokumen2,
        dokumen3
    } = dataFungsionalForPostAPI(resultFormData())

    validateNIPFungsional(nip !== 'null' && nip !== null ? nip : nik, nip !== 'null' && nip !== null ? 'NIP' : 'NIK')
        .then(res => {
            if (res?.message == 'success') {
                if (sk_pangkat !== 'null') {
                    Promise.all([
                        pushUpload(gambar_users, 'gambar_users'),
                        pushUpload(sk_pustakawan[0], 'sk_pustakawan'),
                        pushUpload(sk_pangkat[0], 'sk_pangkat'),
                    ])
                        .then(res => {
                            let resultData = dataFungsionalForPostAPI(resultFormData())
                            resultData.gambar_users = res[0].gambar_users
                            resultData.sk_pustakawan = res[1].sk_pustakawan
                            resultData.sk_pangkat = res[2].sk_pangkat
                            delete resultData.imgURL
                            postFungsionalData(resultData)
                                .then(res => {
                                    setLocalStorageForSubmit(REMOVE_ITEM, nmStorageFungsional)
                                    alert('Data berhasil ditambah.\nSilahkan Login dengan Ketentuan "password" adalah "tanggal lahir" (YYYY/MM/DD) yang anda cantumkan.')
                                    window.location.replace('http://localhost/pustakawanbogor/page/login.php')
                                    loadingSubmitFungsional = false
                                })
                                .catch(err => {
                                    alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
                                    spinnerGlobalLoading('none')
                                    loadingSubmitFungsional = false
                                    console.log(err)
                                })
                        })
                } else {
                    Promise.all([
                        pushUpload(gambar_users, 'gambar_users'),
                        pushUpload(sk_pustakawan[0], 'sk_pustakawan'),
                    ])
                        .then(res => {
                            let resultData = dataFungsionalForPostAPI(resultFormData())
                            resultData.gambar_users = res[0].gambar_users
                            resultData.sk_pustakawan = res[1].sk_pustakawan
                            delete resultData.imgURL
                            postFungsionalData(resultData)
                                .then(res => {
                                    setLocalStorageForSubmit(REMOVE_ITEM, nmStorageFungsional)
                                    alert('Data berhasil ditambah.\nSilahkan Login dengan Ketentuan "password" adalah "tanggal lahir" (YYYY/MM/DD) yang anda cantumkan.')
                                    window.location.replace('http://localhost/pustakawanbogor/page/login.php')
                                    loadingSubmitFungsional = false
                                })
                                .catch(err => {
                                    alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
                                    spinnerGlobalLoading('none')
                                    loadingSubmitFungsional = false
                                    console.log(err)
                                })
                        })
                        .catch(err => {
                            alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
                            console.log(err)
                            loadingSubmitFungsional = false
                        })
                }
            } else {
                spinnerGlobalLoading('none')
                loadingSubmitFungsional = false
                console.log(res)
            }
        })
        .catch(err => {
            alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
            console.log(err)
            loadingSubmitFungsional = false
            spinnerGlobalLoading('none')
        })
}

let loadingSubmitTenaga = false

// form submit tenaga
document.getElementById('submitFormTenaga')?.addEventListener('click', () => {
    if (loadingSubmitTenaga === false) {
        Promise.all([
            validateFormNamaKolom(),
            validateFormAddCard(),
            validateFormLampiranData()
        ])
            .then(res => {
                const checkValidate = res.filter(validate => validate === undefined)
                if (checkValidate.length > 0) {
                    createAlert('Mohon lengkapi formulir Anda!.')
                    return 'failed'
                }
                return 'success'
            })
            .then(res => {
                if (res === 'success' && window.confirm('Ingin mendaftarkan sebagai Tenaga Perpustakaan?')) {
                    spinnerGlobalLoading('flex')
                    submitTenaga()
                } else {
                    spinnerGlobalLoading('none')
                    loadingSubmitTenaga = false
                    console.log(res)
                }
            })
            .catch(err => {
                console.log('err-submit-form', err)
                loadingSubmitTenaga = false
            })
    }
})

function submitTenaga() {
    loadingSubmitTenaga = true
    const {
        gambar_users,
        sk_pangkat,
        nip,
        nik
    } = dataTenagaForPost(resultFormDataTenaga())

    validateNIPTenaga(nip !== 'null' && nip !== null ? nip : nik, nip !== 'null' && nip !== null ? 'NIP' : 'NIK')
        .then(res => {
            if (res?.message == 'success') {
                Promise.all([
                    pushUpload(gambar_users, 'gambar_users'),
                    pushUpload(sk_pangkat[0], 'sk_pangkat'),
                ])
                    .then(res => {
                        let resultData = dataTenagaForPost(resultFormDataTenaga())
                        resultData.gambar_users = res[0].gambar_users
                        resultData.sk_pangkat = res[1].sk_pangkat
                        delete resultData.imgURL
                        postFungsionalData(resultData)
                            .then(res => {
                                setLocalStorageForSubmit(REMOVE_ITEM, nmStorageTenaga)
                                loadingSubmitTenaga = false
                                alert('Data berhasil ditambah.\nSilahkan Login dengan Ketentuan "password" adalah "tanggal lahir" (YYYY/MM/DD) yang anda cantumkan.')
                                window.location.replace('http://localhost/pustakawanbogor/page/login.php')
                            })
                            .catch(err => {
                                spinnerGlobalLoading('none')
                                loadingSubmitTenaga = false
                                console.log(err)
                                alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
                            })
                    })
                    .catch(err => {
                        alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
                        console.log(err)
                        loadingSubmitTenaga = false
                    })
            } else {
                spinnerGlobalLoading('none')
                loadingSubmitTenaga = false
                console.log(res)
                alert(res?.text)
            }
        })
        .catch(err => {
            alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
            console.log(err)
            loadingSubmitTenaga = false
            spinnerGlobalLoading('none')
        })
}

let loadingSubmitRevisiTenaga = false

let currentTokenClient = null

// form submit revisi tenaga
let updateFirebaseRevisiTenaga = {
    gambar_users: null,
    sk_pangkat: null
}
document.getElementById('submitFormRevisiTenaga')?.addEventListener('click', () => {
    if (currentExpQuery && !validateExpToken(currentExpQuery)) {
        alert('Akses revisi Anda telah berakhir.\nSilahkan input kembali.')
        window.location.replace(window.location.origin)
        return
    }
    if (loadingSubmitRevisiTenaga === false) {
        Promise.all([
            validateFormNamaKolom(),
            validateFormAddCard(),
            // validateFormLampiranData(),
            validateDataPengirim(),
            // validateCaptcha()
        ])
            .then(res => {
                const checkValidate = res.filter(validate => validate === undefined)
                if (checkValidate.length > 0) {
                    createAlert('Mohon lengkapi formulir Anda!.')
                    return 'failed'
                }
                return 'success'
            })
            .then(res => {
                if (res === 'success' && window.confirm('Ingin mengajukan revisi data?')) {
                    spinnerGlobalLoading('flex')
                    submitRevisiTenaga()
                    // setLocalStorageForSubmit(SET_ITEM, nmStorageRevisiTenaga, defaultValueStgSubmit)
                } else if (res == 'failed') {
                    spinnerGlobalLoading('none')
                    loadingSubmitRevisiTenaga = false
                    console.log(res)
                }
            })
            .catch(err => {
                console.log('err-submit-form', err)
                loadingSubmitRevisiTenaga = false
            })
    }

})

function submitRevisiTenaga() {
    loadingSubmitRevisiTenaga = true
    const {
        nip,
        nik,
        gambar_users,
        sk_pangkat
    } = dataRevisiTenagaForPost(resultFormDataRevisiTenaga())

    const {
        namaPengirim,
        emailPengirim,
        telpPengirim
    } = dataInputPengirim

    generateTokenClient()
    const resultJWTToken = createJWTToken(headerJWTToken, { tokenClient: currentTokenClient })
    const dataToken = resultDataToken(resultJWTToken)
    const dataFormBody = createReqBody(dataToken)
    const {
        token,
        tokenClient,
        exp
    } = dataToken

    validateNIPRevisiTenaga(nip !== 'null' ? nip : nik, optionNIPORNIK)
        .then(res => {
            if (res?.message == 'success') {
                Promise.all([
                    gambar_users?.name ? pushUpload(gambar_users, 'gambar_users') : { gambar_users },
                    sk_pangkat?.length === 1 ? pushUpload(sk_pangkat[0], 'sk_pangkat') : { sk_pangkat }
                ])
                    .then(res => {
                        updateFirebaseRevisiTenaga.gambar_users = res[0].gambar_users
                        updateFirebaseRevisiTenaga.sk_pangkat = res[1].sk_pangkat
                        return postFormDataAPI(`${POST_VERIFIKASI}token=${tokenClient}&exp=${exp}&tokenClient=${token}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: dataFormBody
                        })
                    })
                    .then(res => sendDataToEmail(
                        SERVICE_ID_PUSTAKAWAN_2,
                        TEMPLATE_ID_PUSTAKAWAN_2,
                        {
                            to_email: emailPengirim,
                            tokenClient
                        },
                        PUBLIC_KEY_PUSTAKAWAN_2
                    ))
                    .then(res => {
                        document.getElementById('deskVerifikasi').innerHTML = `Kami mengirimkan kode verifikasi melalui "<strong>${emailPengirim}</strong>".`
                        document.getElementById('btnModalVerifikasi').click()
                    })
                    .catch(err => {
                        alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
                        console.log(err)
                        loadingSubmitRevisiTenaga = false
                        spinnerGlobalLoading('none')
                    })
            } else {
                spinnerGlobalLoading('none')
                loadingSubmitRevisiTenaga = false
                console.log(res)
                alert(res?.text)
            }
        })
        .catch(err => {
            alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
            console.log(err)
            loadingSubmitRevisiTenaga = false
            spinnerGlobalLoading('none')
        })
}

// submit verifikasi tenaga
document.getElementById('submitVerifikasi')?.addEventListener('click', () => {
    if (currentExpQuery && validateExpToken(currentExpQuery)) {
        verifikasiRevisiTenaga()
        return
    }
    alert('Akses revisi Anda telah berakhir.\nSilahkan input kembali.')
    setTimeout(() => {
        window.location.replace(window.location.origin)
    }, 0)
})
function verifikasiRevisiTenaga() {
    document.getElementById('submitVerifikasi').setAttribute('disabled', 'true')
    const value = document.getElementById('inputVerifikasi').value
    postFormDataAPI(GET_VERIFIKASI)
        .then(res => {
            if (res?.length > 0) {
                const findData = res.find(data => data.tokenClient == value && validateExpToken(data.exp))
                if (findData) {
                    sendResultRevisiTenagaToMail()
                } else {
                    alert('Token tidak valid')
                    document.getElementById('submitVerifikasi').removeAttribute('disabled')
                }
            } else {
                alert('Token tidak valid.\nSilahkan melakukan pengajuan ulang.')
                loadingSubmitRevisiTenaga = false
                spinnerGlobalLoading('none')
                document.getElementById('closeModal').click()
                document.getElementById('submitVerifikasi').removeAttribute('disabled')
            }
        })
        .catch(err => {
            alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
            console.log(err)
            loadingSubmitRevisiTenaga = false
            spinnerGlobalLoading('none')
            document.getElementById('submitVerifikasi').removeAttribute('disabled')
        })
}
document.getElementById('closeModal')?.addEventListener('click', () => {
    setLocalStorageForSubmit(REMOVE_ITEM, nmStorageRevisiTenaga)
    loadingSubmitRevisiTenaga = false
    spinnerGlobalLoading('none')
    loadingSubmit = false
    document.getElementById('inputVerifikasi').value = ''
    document.getElementById('submitVerifikasi').removeAttribute('disabled')
})
// end form submit revisi tenaga

// form submit revisi fungsional
let loadingSubmitRevisiFs = false
document.getElementById('submitRevisiFungsional')?.addEventListener('click', () => {
    if (currentExpQuery && !validateExpToken(currentExpQuery)) {
        alert('Akses revisi Anda telah berakhir.\nSilahkan input kembali.')
        window.location.replace(window.location.origin)
        return
    }
    if (loadingSubmitRevisiFs === false) {
        Promise.all([
            validateFormNamaKolom(),
            validateFormAddCard(),
            // validateFormLampiranData(),
            validateDataPengirim(),
            // validateCaptcha()
        ])
            .then(res => {
                const checkValidate = res.filter(validate => validate === undefined)
                if (checkValidate.length > 0) {
                    createAlert('Mohon lengkapi formulir Anda!.')
                    return 'failed'
                }
                return 'success'
            })
            .then(res => {
                if (res === 'success' && window.confirm('Ingin mengajukan revisi data?')) {
                    loadingSubmitRevisiFs = true
                    spinnerGlobalLoading('flex')
                    prosesSubmitRevisiFS()
                } else {
                    spinnerGlobalLoading('none')
                    loadingSubmitRevisiFs = false
                    console.log(res)
                }
            })
            .catch(err => {
                console.log('err-submit-form', err)
                loadingSubmitRevisiFs = false
            })
    }
})
let updateFirebaseRevisiFS = {
    gambar_users: null,
    sk_pustakawan: null,
    sk_pangkat: null
}

function prosesSubmitRevisiFS() {
    const {
        nip,
        nik,
        gambar_users,
        sk_pangkat,
        sk_pustakawan
    } = dataFungsionalForPostAPI(resultFormData())

    const {
        namaPengirim,
        emailPengirim,
        telpPengirim
    } = dataInputPengirim

    generateTokenClient()

    const resultJWTToken = createJWTToken(headerJWTToken, { tokenClient: currentTokenClient })
    const dataToken = resultDataToken(resultJWTToken)
    const dataFormBody = createReqBody(dataToken)
    const {
        token,
        tokenClient,
        exp
    } = dataToken

    validateNIPFungsional(nip !== 'null' ? nip : nik, optionNIPORNIK)
        .then(res => {
            if (res?.message == 'success') {
                Promise.all([
                    gambar_users?.name ? pushUpload(gambar_users, 'gambar_users') : { gambar_users },
                    sk_pustakawan?.length === 1 ? pushUpload(sk_pustakawan[0], 'sk_pustakawan') : { sk_pustakawan },
                    sk_pangkat?.length === 1 ? pushUpload(sk_pangkat[0], 'sk_pangkat') : { sk_pangkat },
                ])
                    .then(res => {
                        updateFirebaseRevisiFS.gambar_users = res[0].gambar_users
                        updateFirebaseRevisiFS.sk_pustakawan = res[1].sk_pustakawan
                        updateFirebaseRevisiFS.sk_pangkat = res[2].sk_pangkat
                        return postFormDataAPI(`${POST_VERIFIKASI}token=${tokenClient}&exp=${exp}&tokenClient=${token}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: dataFormBody
                        })
                    })
                    .then(res => sendDataToEmail(
                        SERVICE_ID_PUSTAKAWAN_2,
                        TEMPLATE_ID_PUSTAKAWAN_2,
                        {
                            to_email: emailPengirim,
                            tokenClient
                        },
                        PUBLIC_KEY_PUSTAKAWAN_2
                    ))
                    .then(res => {
                        document.getElementById('deskVerifikasi').innerHTML = `Kami mengirimkan kode verifikasi melalui "<strong>${emailPengirim}</strong>".`
                        document.getElementById('btnModalVerifikasi').click()
                    })
                    .catch(err => {
                        alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
                        console.log(err)
                        loadingSubmitRevisiFs = false
                        spinnerGlobalLoading('none')
                    })
            } else {
                spinnerGlobalLoading('none')
                loadingSubmitRevisiFs = false
                console.log(res)
                alert(res?.text)
            }
        })
        .catch(err => {
            alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
            console.log(err)
            loadingSubmitRevisiFs = false
            spinnerGlobalLoading('none')
        })
}

// submit verifikasi fungsional
document.getElementById('submitVerifikasiRevisiFS')?.addEventListener('click', () => {
    if (currentExpQuery && validateExpToken(currentExpQuery)) {
        verifikasiRevisiFungsional()
        return
    }
    alert('Akses revisi Anda telah berakhir.\nSilahkan input kembali.')
    setTimeout(() => {
        window.location.replace(window.location.origin)
    }, 0)
})

function verifikasiRevisiFungsional() {
    document.getElementById('submitVerifikasiRevisiFS').setAttribute('disabled', 'true')
    const value = document.getElementById('inputVerifikasi').value
    postFormDataAPI(GET_VERIFIKASI)
        .then(res => {
            if (res?.length > 0) {
                const findData = res.find(data => data.tokenClient == value && validateExpToken(data.exp))
                if (findData) {
                    sendResultRevisiFungsionalToMail()
                } else {
                    alert('Token tidak valid')
                    document.getElementById('submitVerifikasiRevisiFS').removeAttribute('disabled')
                }
            } else {
                alert('Token tidak valid.\nSilahkan melakukan pengajuan ulang.')
                loadingSubmitRevisiFs = false
                spinnerGlobalLoading('none')
                document.getElementById('closeModalVerifikasiRevisiFS').click()
                document.getElementById('submitVerifikasiRevisiFS').removeAttribute('disabled')
            }
        })
        .catch(err => {
            alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
            console.log(err)
            loadingSubmitRevisiFs = false
            spinnerGlobalLoading('none')
            document.getElementById('submitVerifikasiRevisiFS').removeAttribute('disabled')
        })
}
document.getElementById('closeModalVerifikasiRevisiFS')?.addEventListener('click', () => {
    loadingSubmitRevisiFs = false
    spinnerGlobalLoading('none')
    document.getElementById('inputVerifikasi').value = ''
    document.getElementById('submitVerifikasiRevisiFS').removeAttribute('disabled')
})
// end form submit revisi fungsional

function validateExpToken(expToken) {
    const cekExp = (new Date()).valueOf() < (new Date(expToken)).valueOf()
    return cekExp
}

async function pushUpload(file, nameInput) {
    return await uploadImgToFirebase(
        rootFolderPustakawan,
        `${new Date().getTime()}`,
        file,
        nameInput
    )
}

async function postFungsionalData(dataSubmit) {
    try {
        const api = await fetch(POST_API_PUSTAKAWAN, {
            method: 'POST',
            body: JSON.stringify(dataSubmit)
        })
        const data = await api.json(res => res)
        return data
    } catch (error) {
        return error
    }
}

function generateTokenClient() {
    const token1 = Math.floor(Math.random() * 9)
    const token2 = Math.floor(Math.random() * 9)
    const token3 = Math.floor(Math.random() * 9)
    const token4 = Math.floor(Math.random() * 9)

    currentTokenClient = `${token1}${token2}${token3}${token4}`
}

function resultDataToken(jwtToken) {
    const setTo1Hours = new Date()
    const currentHours = new Date().getHours()
    setTo1Hours.setHours(currentHours + 1)
    return {
        token: jwtToken,
        tokenClient: currentTokenClient,
        exp: `${setTo1Hours}`
    }
}

function sendResultRevisiFungsionalToMail() {
    const {
        username,
        nama_users,
        Tempat_Lahir,
        Tanggal_Lahir,
        jenis_kelamin,
        no_hp,
        email,
        pendidikan,
        jurusan_bidangpendidikan,
        pangkat,
        tamat_pangkat,
        jabatan_fungsional,
        tamat_jabatan,
        status_jabatan,
        istansi,
        lokasi_instansi,
        jenis_instansi,
        diklat,
        data_diklat,
        judul_kti,
        organisasi,
        catatan
    } = dataFungsionalForPostAPI(resultFormData())

    const sendData = {
        username: prevDataPustakawan.username,
        nama_users: prevDataPustakawan.nama_users,
        email: prevDataPustakawan.email,
        no_hp: prevDataPustakawan.no_hp,
        gambar_users: updateFirebaseRevisiFS.gambar_users,
        p_nip_or_nik: username.length === 18 ? 'NIP' : 'NIK',
        username_to_change: username,
        nama_users_to_change: nama_users,
        Tempat_Lahir,
        Tanggal_Lahir,
        jenis_kelamin,
        no_hp_to_change: no_hp,
        email_to_change: email,
        pendidikan,
        jurusan_bidangpendidikan,
        pangkat,
        tamat_pangkat,
        jabatan_fungsional,
        tamat_jabatan,
        status_jabatan,
        istansi,
        lokasi_instansi,
        jenis_instansi,
        diklat,
        data_diklat,
        judul_kti,
        organisasi,
        sk_pustakawan: updateFirebaseRevisiFS.sk_pustakawan,
        sk_pangkat: updateFirebaseRevisiFS.sk_pangkat,
        catatan,
        nama_pengirim: dataInputPengirim.namaPengirim,
        email_pengirim: dataInputPengirim.emailPengirim,
        telp_pengirim: dataInputPengirim.telpPengirim
    }

    sendDataToEmail(
        SERVICE_ID_EMAILJS,
        TEMPLATE_ID_REVISI_FUNGSIONAL,
        sendData,
        PUBLIC_KEY_EMAILJS
    )
        .then(res => {
            alert('Data telah berhasil dikirim.\n"Maksimal 1 minggu pengerjaan".\nMohon menunggu dan cek kembali apakah sudah diperbarui data Anda.')
            loadingSubmitRevisiFs = false
            spinnerGlobalLoading('none')
            setTimeout(() => {
                window.location.reload()
            }, 0);
        })
        .catch(err => {
            alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
            console.log(err)
            loadingSubmitRevisiFs = false
            spinnerGlobalLoading('none')
        })
}

function sendResultRevisiTenagaToMail() {
    const {
        gambar_users,
        username,
        nip,
        nik,
        nama_users,
        Tempat_Lahir,
        Tanggal_Lahir,
        jenis_kelamin,
        no_hp,
        email,
        pendidikan,
        jurusan_bidangpendidikan,
        pangkat,
        status_dinas,
        istansi,
        lokasi_instansi,
        jenis_instansi,
        diklat,
        data_diklat,
        organisasi,
        sk_pangkat,
        catatan
    } = dataRevisiTenagaForPost(resultFormDataRevisiTenaga())

    const sendData = {
        username: prevDataPustakawan.username,
        nama_users: prevDataPustakawan.nama_users,
        email: prevDataPustakawan.email,
        no_hp: prevDataPustakawan.no_hp,
        gambar_users: updateFirebaseRevisiTenaga.gambar_users,
        p_nip_or_nik: username.length === 18 ? 'NIP' : 'NIK',
        username_to_change: username,
        nama_users_to_change: nama_users,
        Tempat_Lahir,
        Tanggal_Lahir,
        jenis_kelamin,
        no_hp_to_change: no_hp,
        email_to_change: email,
        pendidikan,
        jurusan_bidangpendidikan,
        pangkat,
        status_dinas,
        istansi,
        lokasi_instansi,
        jenis_instansi,
        diklat,
        data_diklat,
        organisasi,
        sk_pangkat: updateFirebaseRevisiTenaga.sk_pangkat,
        catatan,
        nama_pengirim: dataInputPengirim.namaPengirim,
        email_pengirim: dataInputPengirim.emailPengirim,
        telp_pengirim: dataInputPengirim.telpPengirim
    }

    sendDataToEmail(
        SERVICE_ID_EMAILJS,
        TEMPLATE_ID_REVISI_TENAGA,
        sendData,
        PUBLIC_KEY_EMAILJS
    )
        .then(res => {
            alert('Data telah berhasil dikirim.\n"Maksimal 1 minggu pengerjaan".\nMohon menunggu dan cek kembali apakah sudah diperbarui data Anda.')
            loadingSubmitRevisiTenaga = false
            spinnerGlobalLoading('none')
            setTimeout(() => {
                window.location.reload()
            }, 0);
        })
        .catch(err => {
            alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
            console.log(err)
            loadingSubmitRevisiTenaga = false
            spinnerGlobalLoading('none')
        })
}