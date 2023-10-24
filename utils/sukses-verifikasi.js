const loadingPages = document.getElementById('loadingPages')
loadingPages.style.display = 'flex'

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
                                        loadingPages.style.display = 'none'
                                        return
                                    }
                                    window.location.replace(`${window.location.origin}/pages/verifikasi/verifikasi.html?access=${findToken.token}`)
                                }
                                window.location.replace(`${window.location.origin}/pages/verifikasi/verifikasi.html?access=${findToken.token}`)
                            })
                            .catch(err => {
                                alert('terjadi kesalahan server\nmohon coba lagi nanti')
                                setTimeout(() => {
                                    window.location.replace(`${window.location.origin}/pages/login/login.html`)
                                }, 0);
                                console.log(err)
                            })
                    } else {
                        alert('token tidak valid')
                        setTimeout(() => {
                            window.location.replace(`${window.location.origin}/pages/login/login.html`)
                        }, 0);
                    }
                } else {
                    alert('token tidak valid')
                    setTimeout(() => {
                        window.location.replace(`${window.location.origin}/pages/login/login.html`)
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
            window.location.replace(`${window.location.origin}/pages/login/login.html`)
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