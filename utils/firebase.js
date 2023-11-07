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
    setTimeout(() => {
        const getLocalStorage = localStorage.getItem(nmStorageFungsional)
        if (getLocalStorage == 'success' && loadingSubmitFungsional === false) {
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

            validateNIPFungsional(nip !== 'null' && nip !== null ? nip : nik, nip  !== 'null' && nip !== null ? 'NIP' : 'NIK')
                .then(res => {
                    if (res?.message == 'success') {
                        // dataFungsionalForPostAPI(resultFormData())

                        // return postFormDataAPI(POST_API_PUSTAKAWAN, {
                        //     method: 'POST',
                        //     body: JSON.stringify(dataFungsionalForPostAPI(resultFormData()))
                        // })
                        if (sk_pangkat !== 'null') {
                            Promise.all([
                                pushUpload(gambar_users, 'gambar_users'),
                                pushUpload(sk_pustakawan[0], 'sk_pustakawan'),
                                pushUpload(sk_pangkat[0], 'sk_pangkat'),
                                // pushUpload(dokumen1[0], 'dokumen1'),
                                // pushUpload(dokumen2[0], 'dokumen2'),
                                // pushUpload(dokumen3[0], 'dokumen3'),
                            ])
                                .then(res => {
                                    let resultData = dataFungsionalForPostAPI(resultFormData())
                                    resultData.gambar_users = res[0].gambar_users
                                    resultData.sk_pustakawan = res[1].sk_pustakawan
                                    resultData.sk_pangkat = res[2].sk_pangkat
                                    // resultData.dokumen1 = res[3].dokumen1
                                    // resultData.dokumen2 = res[4].dokumen2
                                    // resultData.dokumen3 = res[5].dokumen3
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
                                // pushUpload(dokumen1[0], 'dokumen1'),
                                // pushUpload(dokumen2[0], 'dokumen2'),
                                // pushUpload(dokumen3[0], 'dokumen3'),
                            ])
                                .then(res => {
                                    let resultData = dataFungsionalForPostAPI(resultFormData())
                                    resultData.gambar_users = res[0].gambar_users
                                    resultData.sk_pustakawan = res[1].sk_pustakawan
                                    // resultData.dokumen1 = res[3].dokumen1
                                    // resultData.dokumen2 = res[4].dokumen2
                                    // resultData.dokumen3 = res[5].dokumen3
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
                        }
                    } else {
                        spinnerGlobalLoading('none')
                        loadingSubmitFungsional = false
                        console.log(res)
                    }
                })
                // .then(res => {
                //     if (res?.message == 'error') {
                //         alert(res.text)
                //         spinnerGlobalLoading('none')
                //         loadingSubmit = false
                //     } else if (res?.message == 'Data yang diperlukan tidak lengkap.') {
                //         alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
                //         spinnerGlobalLoading('none')
                //         loadingSubmit = false
                //     } else {
                //         alert('Data berhasil ditambah.\nSilahkan Login dengan Ketentuan "password" adalah "tanggal lahir" yang anda cantumkan.')
                //         spinnerGlobalLoading('none')
                //         loadingSubmit = false
                //         window.location.reload()
                //     }
                // })
                .catch(err => {
                    alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
                    console.log(err)
                    loadingSubmitFungsional = false
                    spinnerGlobalLoading('none')
                })
        }
    }, 0)
})

let loadingSubmitTenaga = false

// form submit tenaga
document.getElementById('submitFormTenaga')?.addEventListener('click', () => {
    setTimeout(() => {
        const getLocalStorage = localStorage.getItem(nmStorageTenaga)
        if (getLocalStorage == 'success' && loadingSubmitTenaga === false) {
            loadingSubmitTenaga = true
            const {
                gambar_users,
                sk_pangkat,
                nip,
                nik
                // dokumen1,
                // dokumen2,
                // dokumen3
            } = dataTenagaForPost(resultFormDataTenaga())

            validateNIPTenaga(nip !== 'null' && nip !== null ? nip : nik, nip  !== 'null' && nip !== null ? 'NIP' : 'NIK')
                .then(res => {
                    if (res?.message == 'success') {
                        // localStorage.setItem('result-data-fs', 'success')
                        // return postFormDataAPI(POST_API_PUSTAKAWAN, {
                        //     method: 'POST',
                        //     body: JSON.stringify(dataTenagaForPost(resultFormDataTenaga()))
                        // })

                        Promise.all([
                            pushUpload(gambar_users, 'gambar_users'),
                            pushUpload(sk_pangkat[0], 'sk_pangkat'),
                            // pushUpload(dokumen1[0], 'dokumen1'),
                            // pushUpload(dokumen2[0], 'dokumen2'),
                            // pushUpload(dokumen3[0], 'dokumen3'),
                        ])
                            .then(res => {
                                let resultData = dataTenagaForPost(resultFormDataTenaga())
                                resultData.gambar_users = res[0].gambar_users
                                resultData.sk_pangkat = res[1].sk_pangkat
                                // resultData.dokumen1 = res[2].dokumen1
                                // resultData.dokumen2 = res[3].dokumen2
                                // resultData.dokumen3 = res[4].dokumen3
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
                    } else {
                        spinnerGlobalLoading('none')
                        loadingSubmitTenaga = false
                        console.log(res)
                        alert(res?.text)
                    }
                })
                // .then(res => {
                //     if (res?.message == 'error') {
                //         alert(res.text)
                //         spinnerGlobalLoading('none')
                //         loadingSubmit = false
                //     } else if (res?.message == 'Data yang diperlukan tidak lengkap.') {
                //         alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
                //         spinnerGlobalLoading('none')
                //         loadingSubmit = false
                //     } else {
                //         alert('Data berhasil ditambah.\nSilahkan Login dengan Ketentuan "password" adalah "tanggal lahir" yang anda cantumkan.')
                //         spinnerGlobalLoading('none')
                //         loadingSubmit = false
                //         window.location.reload()
                //     }
                // })
                .catch(err => {
                    alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
                    console.log(err)
                    loadingSubmitTenaga = false
                    spinnerGlobalLoading('none')
                })
        }
    }, 0)
})

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

// function dataFungsionalForPostAPI(data) {
//     const {
//         files,
//         nip,
//         namaLengkap,
//         tempatLahir,
//         tanggalLahir,
//         jenisKelamin,
//         nomorHP,
//         email,
//         pendidikanTerakhir,
//         jurusanBidangPendidikan,
//         pangkat,
//         tamatPangkat,
//         jabatanFungsional,
//         tamatJabatan,
//         statusJabatan,
//         instansi,
//         diklatFungsionalPustakawan,
//         dataDiklat,
//         dataKaryaTulis,
//         dataOrganisasi,
//         skPustakawanTerakhir,
//         skKenaikanPangkatTerakhir,
//         dokumen1,
//         dokumen2,
//         dokumen3,
//         lokasi_instansi,
//         keteranganTambahan,
//         namaPengirim,
//         emailPengirim,
//         telpPengirim
//     } = data

//     return {
//         gambar_users: files,
//         nip,
//         nama_users: namaLengkap,
//         username: namaLengkap,
//         password: nomorHP,
//         Tempat_Lahir: tempatLahir,
//         Tanggal_Lahir: `${createDateFormat(new Date(tanggalLahir)).split('/').join('-')}`,
//         jenis_kelamin: jenisKelamin,
//         no_hp: nomorHP,
//         email,
//         pendidikan: pendidikanTerakhir,
//         jurusan_bidangpendidikan: jurusanBidangPendidikan,
//         pangkat,
//         tamat_pangkat: `${createDateFormat(new Date(tamatPangkat)).split('/').join('-')}`,
//         jabatan_fungsional: jabatanFungsional,
//         tamat_jabatan: `${createDateFormat(new Date(tamatJabatan)).split('/').join('-')}`,
//         status_jabatan: statusJabatan,
//         istansi: instansi,
//         diklat: diklatFungsionalPustakawan,
//         catatan: keteranganTambahan,
//         waktu_daftar: `${createDateFormat(new Date()).split('/').join('-')} ${createHourFormat(new Date())}`,
//         status: 'tes',
//         status_dinas: 'tes',
//         dokumen_pendukung: dokumen1,
//         dokumen_pendukung2: dokumen2,
//         dokumen_pendukung3: dokumen3,
//         role: 'fungsional',
//         pekerjaan: 'tes',
//         lokasi_instansi: lokasi_instansi,
//         judul_kti: dataKaryaTulis,
//         organisasi: dataOrganisasi,
//         sk_pustakawan: skPustakawanTerakhir,
//         sk_pangkat: skKenaikanPangkatTerakhir
//     }
// }

// function dataTenagaForPostAPI(data) {
//     const {
//         files,
//         nip,
//         namaLengkap,
//         tempatLahir,
//         tanggalLahir,
//         jenisKelamin,
//         nomorHP,
//         email,
//         pendidikanTerakhir,
//         jurusanBidangPendidikan,
//         pangkat,
//         statusDinas,
//         instansi,
//         lokasi_instansi,
//         diklatFungsionalPustakawan,
//         dataDiklat,
//         dataOrganisasi,
//         skKenaikanPangkatTerakhir,
//         dokumen1,
//         dokumen2,
//         dokumen3,
//         keteranganTambahan,
//     } = data

//     return {
//         gambar_users: files,
//         nip,
//         nama_users: namaLengkap,
//         username: namaLengkap,
//         password: nomorHP,
//         Tempat_Lahir: tempatLahir,
//         Tanggal_Lahir: `${createDateFormat(new Date(tanggalLahir)).split('/').join('-')}`,
//         jenis_kelamin: jenisKelamin,
//         no_hp: nomorHP,
//         email,
//         pendidikan: pendidikanTerakhir,
//         jurusan_bidangpendidikan: jurusanBidangPendidikan,
//         pangkat,
//         tamat_pangkat: '-',
//         jabatan_fungsional: '-',
//         tamat_jabatan: '-',
//         status_jabatan: '-',
//         istansi: instansi,
//         diklat: diklatFungsionalPustakawan,
//         catatan: keteranganTambahan,
//         waktu_daftar: `${createDateFormat(new Date()).split('/').join('-')} ${createHourFormat(new Date())}`,
//         status: 'tes',
//         status_dinas: statusDinas,
//         dokumen_pendukung: dokumen1,
//         dokumen_pendukung2: dokumen2,
//         dokumen_pendukung3: dokumen3,
//         role: 'tenaga-perpus',
//         pekerjaan: 'tes',
//         lokasi_instansi: lokasi_instansi,
//         judul_kti: '-',
//         organisasi: dataOrganisasi,
//         sk_pustakawan: '-',
//         sk_pangkat: skKenaikanPangkatTerakhir
//     }
// }