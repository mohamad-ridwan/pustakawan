let kodeInput = ''

const loadingPageElem = document.getElementById('loadingPages')
loadingPageElem.style.display = 'flex'

document.getElementById('kode')?.addEventListener('change', (e) => {
    kodeInput = e.target.value
})

document.getElementById('submitVerif').addEventListener('click', (e) => {
    document.getElementById('errVerif').innerText = ''

    if (kodeInput.length < 4) {
        document.getElementById('errVerif').innerText = 'mohon isi dengan 4 digit token Anda'
        return
    }
    getDataToken()
})

function getDataToken() {
    onDisabledBtn(true)
    postFormDataAPI(GET_VERIFIKASI, {
        method: 'GET'
    })
        .then(res => {
            if (res?.length > 0) {
                const findToken = res.find(data => data.tokenClient == kodeInput)
                if (findToken?.exp && validateExpToken(findToken.exp)) {
                    postFormDataAPI(POST_API_PUSTAKAWAN, {
                        method: 'GET'
                    })
                        .then(res => {
                            if (res?.length > 0) {
                                const findUser = res.find(item =>
                                    item.role == 'Users' &&
                                    item.username == decodeJWT(findToken.token)?.username &&
                                    item.email == decodeJWT(findToken.token)?.email &&
                                    item.password == decodeJWT(findToken.token)?.password
                                )
                                if (findUser) {
                                    window.location.replace(`${window.location.origin}/pages/sukses-verifikasi/sukses-verifikasi.html?access=${findToken.token}`)
                                    return
                                }
                                pushToPostUserData(decodeJWT(findToken.token), findToken.token)
                            } else {
                                window.location.replace(`${window.location.origin}/pages/sukses-verifikasi/sukses-verifikasi.html?access=${findToken.token}`)
                            }
                        })
                        .catch(err => {
                            alert('terjadi kesalahan server\nmohon coba lagi nanti')
                            onDisabledBtn(false)
                            console.log(err)
                        })
                } else if (findToken?.exp) {
                    alert('token sudah kedaluwarsa.\nmohon registrasi ulang')
                    setTimeout(() => {
                        window.location.replace(`${window.location.origin}/pages/register/register.html`)
                    }, 0);
                } else {
                    alert('token tidak valid')
                    onDisabledBtn(false)
                }
            } else {
                alert('token sudah kedaluwarsa.\nmohon registrasi ulang')
                setTimeout(() => {
                    window.location.replace(`${window.location.origin}/pages/register/register.html`)
                }, 0);
            }
        })
        .catch(err => {
            alert('terjadi kesalahan server.\nmohon coba beberapa saat lagi')
            onDisabledBtn(false)
            console.log(err)
        })
}

window.onload = () => {
    if (getParams()) {
        postFormDataAPI(GET_VERIFIKASI, {
            method: 'GET'
        })
            .then(res => {
                if (res?.length > 0) {
                    const findToken = res.find(data => data.token == getParams())
                    if (findToken?.exp && validateExpToken(findToken.exp)) {
                        postFormDataAPI(POST_API_PUSTAKAWAN, {
                            method: 'GET'
                        })
                            .then(res => {
                                if (res?.length > 0) {
                                    const findUser = res.find(item =>
                                        item.role == 'Users' &&
                                        item.username == decodeJWT(findToken.token)?.username &&
                                        item.email == decodeJWT(findToken.token)?.email &&
                                        item.password == decodeJWT(findToken.token)?.password
                                    )
                                    if (findUser) {
                                        window.location.replace(`${window.location.origin}/pages/sukses-verifikasi/sukses-verifikasi.html?access=${findToken.token}`)
                                        return
                                    }
                                    document.getElementById('emailUser').innerText = decodeJWT(findToken.token)?.email
                                    loadingPageElem.style.display = 'none'
                                    return
                                }
                                document.getElementById('emailUser').innerText = decodeJWT(findToken.token)?.email
                                loadingPageElem.style.display = 'none'
                            })
                            .catch(err => {
                                alert('terjadi kesalahan server\nmohon coba lagi nanti')
                                setTimeout(() => {
                                    window.location.replace(`${window.location.origin}/pages/login/login.html`)
                                }, 0);
                                console.log(err)
                            })
                    } else {
                        alert('token sudah kedaluwarsa.\nmohon registrasi ulang')
                        setTimeout(() => {
                            window.location.replace(`${window.location.origin}/pages/register/register.html`)
                        }, 0);
                    }
                } else {
                    alert('token sudah kedaluwarsa.\nmohon registrasi ulang')
                    setTimeout(() => {
                        window.location.replace(`${window.location.origin}/pages/register/register.html`)
                    }, 0);
                }
            })
            .catch(err => {
                alert('terjadi kesalahan server.\nmohon coba beberapa saat lagi')
                console.log(err)
            })
    } else {
        alert('akses tidak valid')
        setTimeout(() => {
            window.location.replace(`${window.location.origin}/pages/register/register.html`)
        }, 0);
    }
}

function getParams() {
    const params = new URLSearchParams(window.location.search)
    if (params.get('access')) {
        return params.get('access')
    }
    return null
}

function validateExpToken(expToken) {
    const cekExp = (new Date()).valueOf() < (new Date(expToken)).valueOf()
    return cekExp
}

function onDisabledBtn(isDisabled) {
    if (isDisabled) {
        document.getElementById('submitVerif').setAttribute('disabled', 'true')
        document.getElementById('submitVerif').innerText = 'Loading..'
    } else {
        document.getElementById('submitVerif').removeAttribute('disabled')
        document.getElementById('submitVerif').innerText = 'Verifikasi'
    }
}

function postUserData(data) {
    const {
        username,
        email,
        password
    } = data

    return {
        gambar_users: 'null',
        nip: 'null',
        nama_users: 'null',
        username,
        password,
        Tempat_Lahir: 'null',
        Tanggal_Lahir: 'null',
        jenis_kelamin: 'null',
        no_hp: 'null',
        email,
        pendidikan: 'null',
        jurusan_bidangpendidikan: 'null',
        pangkat: 'null',
        tamat_pangkat: 'null',
        jabatan_fungsional: 'null',
        tamat_jabatan: 'null',
        status_jabatan: 'null',
        istansi: 'null',
        diklat: 'null',
        catatan: 'null',
        waktu_daftar: `${createDateFormat(new Date()).split('/').join('-')} ${createHourFormat(new Date())}`,
        status: 'null',
        status_dinas: 'null',
        dokumen_pendukung: 'null',
        dokumen_pendukung2: 'null',
        dokumen_pendukung3: 'null',
        role: 'Users',
        pekerjaan: 'null',
        lokasi_instansi: 'null',
        judul_kti: 'null',
        organisasi: 'null',
        sk_pustakawan: 'null',
        sk_pangkat: 'null'
    }
}

function pushToPostUserData(data, token) {
    postFormDataAPI(POST_API_PUSTAKAWAN, {
        method: 'POST',
        body: JSON.stringify(postUserData(data))
    })
        .then(res => {
            console.log(res)
            if (res?.message == 'Data yang diperlukan tidak lengkap.') {
                alert('terjadi kesalahan server\nmohon coba beberapa saat lagi')
                onDisabledBtn(false)
            }else if(res?.message == 'Data users berhasil ditambahkan.'){
                window.location.replace(`${window.location.origin}/pages/sukses-verifikasi/sukses-verifikasi.html?access=${token}`)
            }else{
                alert('terjadi kesalahan server\nmohon coba beberapa saat lagi')
                onDisabledBtn(false)
            }
        })
        .catch(err => {
            alert('terjadi kesalahan server\nmohon coba beberapa saat lagi')
            onDisabledBtn(false)
            console.log(err)
        })
}