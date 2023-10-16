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

// form submit fungsional
document.getElementById('submitFormFungsional')?.addEventListener('click', () => {
    setTimeout(() => {
        const getLocalStorage = localStorage.getItem('result-data-fs')
        if (getLocalStorage == 'success') {
            const {
                files,
                skPustakawanTerakhir,
                skKenaikanPangkatTerakhir,
                dokumen1,
                dokumen2,
                dokumen3
            } = resultFormData()
            Promise.all([
                pushUpload(files, 'files'),
                pushUpload(skPustakawanTerakhir[0], 'skPustakawanTerakhir'),
                pushUpload(skKenaikanPangkatTerakhir[0], 'skKenaikanPangkatTerakhir'),
                pushUpload(dokumen1[0], 'dokumen1'),
                pushUpload(dokumen2[0], 'dokumen2'),
                pushUpload(dokumen3[0], 'dokumen3'),
            ])
                .then(res => {
                    let resultData = resultFormData()
                    resultData.files = res[0].files
                    resultData.skPustakawanTerakhir = res[1].skPustakawanTerakhir
                    resultData.skKenaikanPangkatTerakhir = res[2].skKenaikanPangkatTerakhir
                    resultData.dokumen1 = res[3].dokumen1
                    resultData.dokumen2 = res[4].dokumen2
                    resultData.dokumen3 = res[5].dokumen3
                    delete resultData.imgURL
                    console.log(resultData)
                    postFungsionalData(dataFungsionalForPostAPI(resultData), 'result-data-to-db')
                        .then(res => {
                            console.log(res)
                            alert('Data berhasil dikirim')
                        })
                        .catch(err => console.log(err))
                    localStorage.removeItem('result-data-fs')
                })
        }
    }, 0)
})

// form submit tenaga
document.getElementById('submitFormTenaga')?.addEventListener('click', () => {
    setTimeout(() => {
        const getLocalStorage = localStorage.getItem('result-data-tenaga')
        if (getLocalStorage == 'success') {
            const {
                files,
                skKenaikanPangkatTerakhir,
                dokumen1,
                dokumen2,
                dokumen3
            } = resultFormDataTenaga()
            Promise.all([
                pushUpload(files, 'files'),
                pushUpload(skKenaikanPangkatTerakhir[0], 'skKenaikanPangkatTerakhir'),
                pushUpload(dokumen1[0], 'dokumen1'),
                pushUpload(dokumen2[0], 'dokumen2'),
                pushUpload(dokumen3[0], 'dokumen3'),
            ])
                .then(res => {
                    let resultData = resultFormDataTenaga()
                    resultData.files = res[0].files
                    resultData.skKenaikanPangkatTerakhir = res[1].skKenaikanPangkatTerakhir
                    resultData.dokumen1 = res[2].dokumen1
                    resultData.dokumen2 = res[3].dokumen2
                    resultData.dokumen3 = res[4].dokumen3
                    delete resultData.imgURL
                    console.log(resultData)
                    postFungsionalData(dataTenagaForPostAPI(resultData), 'result-data-to-db-data-tenaga')
                        .then(res => {
                            console.log(res)
                            alert('Data berhasil dikirim')
                        })
                        .catch(err => console.log(err))
                    localStorage.removeItem('result-data-tenaga')
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

async function postFungsionalData(dataSubmit, textMsg) {
    try {
        const api = await fetch(POST_API_PUSTAKAWAN, {
            method: 'POST',
            body: JSON.stringify(dataSubmit)
        })
        const data = await api.json(res => res)
        console.log(textMsg, dataSubmit)
        return data
    } catch (error) {
        return error
    }
}

function dataFungsionalForPostAPI(data) {
    const {
        files,
        nip,
        namaLengkap,
        tempatLahir,
        tanggalLahir,
        jenisKelamin,
        nomorHP,
        email,
        pendidikanTerakhir,
        jurusanBidangPendidikan,
        pangkat,
        tamatPangkat,
        jabatanFungsional,
        tamatJabatan,
        statusJabatan,
        instansi,
        diklatFungsionalPustakawan,
        dataDiklat,
        dataKaryaTulis,
        dataOrganisasi,
        skPustakawanTerakhir,
        skKenaikanPangkatTerakhir,
        dokumen1,
        dokumen2,
        dokumen3,
        lokasi_instansi,
        keteranganTambahan,
        namaPengirim,
        emailPengirim,
        telpPengirim
    } = data

    return {
        gambar_users: files,
        nip,
        nama_users: namaLengkap,
        username: namaLengkap,
        password: nomorHP,
        Tempat_Lahir: tempatLahir,
        Tanggal_Lahir: `${createDateFormat(new Date(tanggalLahir)).split('/').join('-')}`,
        jenis_kelamin: jenisKelamin,
        no_hp: nomorHP,
        email,
        pendidikan: pendidikanTerakhir,
        jurusan_bidangpendidikan: jurusanBidangPendidikan,
        pangkat,
        tamat_pangkat: `${createDateFormat(new Date(tamatPangkat)).split('/').join('-')}`,
        jabatan_fungsional: jabatanFungsional,
        tamat_jabatan: `${createDateFormat(new Date(tamatJabatan)).split('/').join('-')}`,
        status_jabatan: statusJabatan,
        istansi: instansi,
        diklat: diklatFungsionalPustakawan,
        catatan: keteranganTambahan,
        waktu_daftar: `${createDateFormat(new Date()).split('/').join('-')} ${createHourFormat(new Date())}`,
        status: 'tes',
        status_dinas: 'tes',
        dokumen_pendukung: dokumen1,
        dokumen_pendukung2: dokumen2,
        dokumen_pendukung3: dokumen3,
        role: 'fungsional',
        pekerjaan: 'tes',
        lokasi_instansi: lokasi_instansi,
        judul_kti: dataKaryaTulis,
        organisasi: dataOrganisasi,
        sk_pustakawan: skPustakawanTerakhir,
        sk_pangkat: skKenaikanPangkatTerakhir
    }
}

function dataTenagaForPostAPI(data) {
    const {
        files,
        nip,
        namaLengkap,
        tempatLahir,
        tanggalLahir,
        jenisKelamin,
        nomorHP,
        email,
        pendidikanTerakhir,
        jurusanBidangPendidikan,
        pangkat,
        statusDinas,
        instansi,
        lokasi_instansi,
        diklatFungsionalPustakawan,
        dataDiklat,
        dataOrganisasi,
        skKenaikanPangkatTerakhir,
        dokumen1,
        dokumen2,
        dokumen3,
        keteranganTambahan,
    } = data

    return {
        gambar_users: files,
        nip,
        nama_users: namaLengkap,
        username: namaLengkap,
        password: nomorHP,
        Tempat_Lahir: tempatLahir,
        Tanggal_Lahir: `${createDateFormat(new Date(tanggalLahir)).split('/').join('-')}`,
        jenis_kelamin: jenisKelamin,
        no_hp: nomorHP,
        email,
        pendidikan: pendidikanTerakhir,
        jurusan_bidangpendidikan: jurusanBidangPendidikan,
        pangkat,
        tamat_pangkat: '-',
        jabatan_fungsional: '-',
        tamat_jabatan: '-',
        status_jabatan: '-',
        istansi: instansi,
        diklat: diklatFungsionalPustakawan,
        catatan: keteranganTambahan,
        waktu_daftar: `${createDateFormat(new Date()).split('/').join('-')} ${createHourFormat(new Date())}`,
        status: 'tes',
        status_dinas: statusDinas,
        dokumen_pendukung: dokumen1,
        dokumen_pendukung2: dokumen2,
        dokumen_pendukung3: dokumen3,
        role: 'tenaga-perpus',
        pekerjaan: 'tes',
        lokasi_instansi: lokasi_instansi,
        judul_kti: '-',
        organisasi: dataOrganisasi,
        sk_pustakawan: '-',
        sk_pangkat: skKenaikanPangkatTerakhir
    }
}