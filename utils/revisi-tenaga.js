const API_PUSTAKAWAN = 'http://localhost/pustakawanbogor/api/pustakawan.php'

const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
// const phoneRegex = /[^0-9.]/g
const phoneRegex = /^\d*$/

// DATA DATA INPUT FORM
let imgData = {
    files: null,
    imgURL: ''
}
const dataInputNamaKolom = {
    ...imgData,
    nip: null,
    nik: null,
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki',
    nomorHP: '',
    email: '',
    pendidikanTerakhir: 'Silahkan Pilih',
    jurusanBidangPendidikan: 'Silahkan Pilih',
    pangkat: 'Silahkan Pilih',
    statusDinas: 'Silahkan Pilih',
    instansi: 'Silahkan Pilih',
    lokasi_instansi: 'Silahkan Pilih',
    jenis_instansi: 'Silahkan Pilih',
    diklatFungsionalPustakawan: 'Tidak Pernah',
    status: 'Pending',
    pekerjaan: 'Tenaga Perpustakaan'
}

// ORGANISASI
let inputDataOrganisasi = {
    namaOrganisasi: '',
    jabatanOrganisasi: 'Silahkan Pilih'
}

// DIKLAT
let inputDataAddDiklat = {
    namaDiklat: '',
    tahunDiklat: 'Silahkan Pilih',
    jumlahJamPelatihan: ''
}

// prev data tenaga
let prevDataPustakawan = {
    nip: null,
    nik: null,
    imgURL: '',
    sk_pangkat: null,
    nama_users: '',
    email: '',
    no_hp: '',
    username: 'null'
}

let currentExpQuery = null

// cek query dan validasi data
window.onload = () => {
    setTimeout(async () => {
        const params = new URLSearchParams(window.location.search)
        if (!params.get('id')) {
            alert('Query tidak valid')
            setTimeout(() => {
                window.location.replace(window.location.origin)
            }, 0);
        } else{
            const decode = await decodeJWT(params.get('id'))
            const {
                id,
                exp
            } = decode
            currentExpQuery = exp
            if(id && exp && validateExpToken(exp)){
                postFormDataAPI(POST_API_PUSTAKAWAN)
                .then(res => {
                    if (res?.length > 0) {
                        const findData = res.find(user => user.id == id)
                        if (!findData) {
                            alert('Tidak dapat ditemukan data Pustakawan pada query id tersebut.')
                            setTimeout(() => {
                                window.location.replace(window.location.origin)
                            }, 0)
                        } else {
                            setUpdtToForm(findData)
                            return
                        }
                    } else {
                        alert('Tidak dapat menemukan data Pustakawan yang terdaftar.\nSilahkan lakukan pendaftaran melalui Form Fungsional/Tenaga.')
                        setTimeout(() => {
                            window.location.replace(window.location.origin)
                        }, 0);
                    }
                })
                .catch(err => {
                    alert('Terjadi kesalahan server.\nMohon coba beberapa saat lagi')
                    setTimeout(() => {
                        window.location.replace(window.location.origin)
                    }, 0)
                })
            }else{
                alert('Akses tidak valid atau sesi akses Anda telah berakhir!.\nSilahkan inputkan kembali.')
                window.location.replace(window.location.origin)
            }
        }
    }, 500);
}

const globalLoading = document.getElementById('secGlobalLoading')

// fetch data instansi sekolah/mahasiswa
async function getSekolah() {
    try {
        const getData = await fetch('https://api-sekolah-indonesia.vercel.app/sekolah?page=1&perPage=500')
        const data = await getData.json(res => res)
        return data
    } catch (err) {
        return err
    }
}

// globalLoading.style.display = 'none'

function spinnerGlobalLoading(display) {
    globalLoading.style.display = display
}

function errDataInstansi(display) {
    document.getElementById('errDataInstansi').style.display = display
}

getSekolah()
    .then(res => {
        if (res?.dataSekolah?.length > 0) {
            const data = res.dataSekolah.map((item) => ({
                data_tokens: item.id,
                value: item.sekolah
            }))
            loadCreateSelect('instansi', data)
            removeDropdownMenu(6)
            const newData = [
                {
                    data_tokens: 'silahkan-pilih',
                    value: 'Silahkan Pilih'
                },
                ...data
            ]
            setTimeout(() => {
                createMenuDropdown(newData, 6, 'instansi')
                spinnerGlobalLoading('none')
            }, 500);
            errDataInstansi('none')
        }
    })
    .catch(err => {
        console.log('error data sekolah', err)
        errDataInstansi('flex')
        spinnerGlobalLoading('none')
    })

// CASE FOR INPUT IMG PROFILE
let loadingClientImg

function openFileImg() {
    if (!loadingClientImg) {
        document.getElementById('fileClientImg').click()
    }
}

const clientImg = document.getElementById('clientImg')
const btnDeleteClientImg = document.getElementById('deleteClientImg')

function deleteClientImg() {
    clientImg.setAttribute('src', '/images/noimg.png')
    btnDeleteClientImg.style.display = 'none'
    imgData = {
        files: null,
        imgURL: ''
    }
    dataInputNamaKolom['files'] = null
    dataInputNamaKolom['imgURL'] = ''
}

const elemImgFile = document.getElementById('fileClientImg')
elemImgFile.addEventListener('change', (e) => {
    const files = e.target.files
    if (files !== undefined) {
        validateImgExt(files)
    }
})

function validateImgExt(file) {
    const getTypeFile = file[0].type.split('/')[1]
    if (!getTypeFile || getTypeFile.length === 0) {
        alert('File Harus berupa .jpg /.jpeg /.png ')
        return
    }
    if (
        getTypeFile.toLowerCase() === 'jpg' ||
        getTypeFile.toLowerCase() === 'jpeg' ||
        getTypeFile.toLowerCase() === 'png'
    ) {
        onLoadingClientImg('flex', true)
        createImgToWebp(file[0])
            .then(res => {
                compressClientImg(res.file)
                    .then(resCompressed => {
                        dataInputNamaKolom.imgURL = res.webpImage
                        changeLocalClientImg(res.webpImage)
                        onLoadingClientImg('none', false)
                        dataInputNamaKolom.files = resCompressed
                    })
                    .catch(err => {
                        console.log(err)
                        alert('Ukuran gambar terlalu besar!')
                    })
            })
            .catch(err => console.log(err))
    } else {
        alert('File Harus berupa .jpg /.jpeg /.png')
    }
}

// on loading client img
function onLoadingClientImg(display, isLoading) {
    document.getElementById('loader').style.display = display
    loadingClientImg = isLoading
}

// convert img file to .webp
async function createImgToWebp(file) {
    let src = URL.createObjectURL(file)

    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')

    let newImg = new Image()
    newImg.src = src

    let newSrc = ''

    return await new Promise((resolve, reject) => {
        newImg.onload = () => {
            canvas.width = newImg.width
            canvas.height = newImg.height
            ctx?.drawImage(newImg, 0, 0)
            // convert canvas
            let webpImage = canvas.toDataURL('image/jpeg', 1)
            let img = new Image()
            img.src = webpImage
            newSrc = img.src

            const fetchImage = fetch(img.src)
            fetchImage.then(res => res.blob())
                .then(blob => {
                    const fileImg = new File([blob], `${new Date().getTime()}`, blob)
                    resolve({ file: fileImg, webpImage })
                })
                .catch(err => reject(err))
        }
    })
}

// compress img
async function compressClientImg(imgFile) {
    return await new Promise((resolve, reject) => {
        const controller = new AbortController()

        const options = {
            maxSizeMB: 1,
            signal: controller.signal,
            maxWidthOrHeight: 150,
            useWebWorker: true,
        }

        imageCompression(imgFile, options)
            .then((compressedFile) => resolve(compressedFile))
            .catch(err => reject(err))

        setTimeout(() => {
            controller.abort(new Error('I just want to stop'))
        }, 1500);
    })
}

function changeLocalClientImg(imgBlobUrl) {
    clientImg.setAttribute('src', imgBlobUrl)
    btnDeleteClientImg.style.display = 'flex'
}
// END CASE FOR INPUT IMG PROFILE

let optionNIPORNIK = null

// CASE FOR INPUT NAMA KOLOM
// change input text nama kolom
function changeTxtInputNmKolom(elementId, nameInput) {
    const elem = document.getElementById(elementId)
    if (elem) {
        if (elementId == 'nip' && optionNIPORNIK == 'NIP') {
            dataInputNamaKolom['nip'] = elem.value
            dataInputNamaKolom['nik'] = null
        } else if (elementId == 'nip' && optionNIPORNIK == 'NIK') {
            dataInputNamaKolom['nik'] = elem.value
            dataInputNamaKolom['nip'] = null
        } else {
            dataInputNamaKolom[nameInput] = elem.value
        }
    }
}

function changeNIPORNIK() {
    const elem = document.getElementById('nipornik')
    if (elem && elem.value !== 'Silahkan Pilih') {
        optionNIPORNIK = elem.value
        document.getElementById('nip').removeAttribute('readonly')
        if (elem.value === 'NIP') {
            document.getElementById('errNmKolom1').innerText = 'NIP harus terdiri dari 18 Digit'
            document.getElementById('errNmKolom1').style.color = '#ff0000'
            changeDisableInput(formControll, 'true')
        } else {
            document.getElementById('errNmKolom1').innerText = 'NIK harus terdiri dari 16 Digit'
            document.getElementById('errNmKolom1').style.color = '#ff0000'
            changeDisableInput(formControll, 'true')
        }
    } else {
        document.getElementById('nip').setAttribute('readonly', 'true')
        document.getElementById('errNmKolom1').innerText = 'harus diisi'
        document.getElementById('errNmKolom1').style.color = '#ff0000'
        changeDisableInput(formControll, 'true')
    }
    document.getElementById('nip').value = ''
}

const nipElement = document.getElementById('nip')
const phoneElement = document.getElementById('telpPengirim')
const nomorHPElement = document.getElementById('nomorHp')
const namaDiklatElement = document.getElementById('namaDiklat')
const jumlahJamPelatihanEl = document.getElementById('jumlahJamPelatihan')
const namaOrganisasiEl = document.getElementById('namaOrganisasi')

// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter, errMsg, inputTYPE) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
        textbox.addEventListener(event, function (e) {
            if (inputTYPE === 'NIP' && optionNIPORNIK === 'NIP' && this.value.length > 18) {
                this.setCustomValidity('Maksimal NIP 18 digit');
                this.reportValidity();
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                return
            } else if (inputTYPE === 'NIP' && optionNIPORNIK === 'NIK' && this.value.length > 16) {
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

const errKarakterAddCard = 'Tidak dapat menggunakan karakter ; dan ,'
setInputFilter(nipElement, (value) => phoneRegex.test(value), "Harus berupa angka", 'NIP')
setInputFilter(phoneElement, (value) => phoneRegex.test(value), "Harus berupa angka")
setInputFilter(nomorHPElement, (value) => phoneRegex.test(value), "Harus berupa angka")
setInputFilter(namaDiklatElement, (value) => validateTxtAddCard(value), errKarakterAddCard)
setInputFilter(jumlahJamPelatihanEl, (value)=> validateTxtAddCard(value), errKarakterAddCard)
setInputFilter(namaOrganisasiEl, (value)=> validateTxtAddCard(value), errKarakterAddCard)

function validateTxtAddCard(value){
    return !value.includes(',') && !value.includes(';')
}

const formControll = document.getElementsByClassName('form-control')

function changeDisableInput(elements, isDisabled, isRemoveDisabled) {
    const btnSelect = document.getElementsByClassName('dropdown-toggle')
    const btnDisabled = document.getElementsByClassName('btn dropdown-toggle selectpicker disabled btn-default')
    const disabledEl = document.getElementsByClassName('disabled')
    const btnAddCard = document.getElementsByClassName('btn-add-card')
    const dropdownMenu = document.getElementsByClassName('dropdown-menu inner selectpicker')
    if (isRemoveDisabled) {
        removeDisabledAttr(document.getElementsByClassName('form-control input-grup'), 1)
        removeDisabledAttr(document.getElementsByClassName('btn dropdown-toggle selectpicker btn-default'), 1)
        removeDisabledAttr(document.getElementsByClassName('input-tanggal'), 0)
        removeDisabledAttr(btnAddCard, 0)
    } else if (isDisabled) {
        addDisabledAttr(document.getElementsByClassName('form-control input-grup'), isDisabled, 1)
        addDisabledAttr(document.getElementsByClassName('btn dropdown-toggle selectpicker btn-default'), isDisabled, 1)
        addDisabledAttr(document.getElementsByClassName('input-tanggal'), isDisabled, 0)
        addDisabledAttr(btnAddCard, isDisabled, 0)
    }
    setTimeout(() => {
        removeClassDisabled(disabledEl)
        removeClassDisabled(btnDisabled)
        removeDisabledOfMenu(dropdownMenu)
    }, 1500);
}

function addDisabledAttr(element, isDisabled, starIdx) {
    for (let i = starIdx; i < element.length; i++)
        element[i].setAttribute('disabled', isDisabled)
}
function removeDisabledAttr(element, starIdx) {
    for (let i = starIdx; i < element.length; i++)
        element[i].removeAttribute('disabled')
}

function removeClassDisabled(element) {
    for (let i = 0; i < element.length; i++) {
        element[i].classList.remove('disabled')
    }
}
function removeDisabledOfMenu(element) {
    for (let i = 0; i < element.length; i++) {
        for (let iChild = 0; iChild < element[i].childNodes.length; iChild++) {
            element[i].childNodes[iChild].classList.remove('disabled')
        }
    }
}

// window.onload = () => {
//     changeDisableInput(document.getElementsByClassName('form-control input-grup'), 'true')
// }

// cek nip apakah sudah ada di db
nipElement.addEventListener('change', async (e) => {
    if (optionNIPORNIK === 'NIP' && e.target.value.length === 18) {
        document.getElementById('secGlobalLoading').style.display = 'flex'
        await validateNIPRevisiTenaga(e.target.value, optionNIPORNIK)
            .then(res => {
                document.getElementById('errNmKolom1').innerText = res.text
                if (res.message === 'error') {
                    document.getElementById('errNmKolom1').style.color = '#ff0000'
                    changeDisableInput(formControll, 'true')
                } else {
                    document.getElementById('errNmKolom1').style.color = '#46923c'
                    changeDisableInput(formControll, null, true)
                }
                document.getElementById('secGlobalLoading').style.display = 'none'
            })
    } else if (optionNIPORNIK === 'NIK' && e.target.value.length === 16) {
        document.getElementById('secGlobalLoading').style.display = 'flex'
        await validateNIPRevisiTenaga(e.target.value, optionNIPORNIK)
            .then(res => {
                document.getElementById('errNmKolom1').innerText = res.text
                if (res.message === 'error') {
                    document.getElementById('errNmKolom1').style.color = '#ff0000'
                    changeDisableInput(formControll, 'true')
                } else {
                    document.getElementById('errNmKolom1').style.color = '#46923c'
                    changeDisableInput(formControll, null, true)
                }
                document.getElementById('secGlobalLoading').style.display = 'none'
            })
    } else if (optionNIPORNIK === 'NIP') {
        changeDisableInput(formControll, 'true')
        document.getElementById('errNmKolom1').innerText = 'NIP harus terdiri dari 18 Digit'
        document.getElementById('errNmKolom1').style.color = '#ff0000'
    } else if (optionNIPORNIK === 'NIK') {
        changeDisableInput(formControll, 'true')
        document.getElementById('errNmKolom1').innerText = 'NIK harus terdiri dari 16 Digit'
        document.getElementById('errNmKolom1').style.color = '#ff0000'
    }
})

async function validateNIPRevisiTenaga(value, actionTYPE) {
    return await new Promise((resolve, reject) => {
        fetch(API_PUSTAKAWAN)
            .then(res => res.json())
            .then(res => {
                const data = filtersNIPORNIK(res, actionTYPE, value)
                if (res.length > 0) {
                    if (data.type == 'NIP') {
                        if (data.value) {
                            resolve({ message: 'error', text: 'Data NIP ini telah terdaftar didatabase. Apabila ingin melihat/mengupdate data, silakan pilih menu Revisi Data.' })
                        } else {
                            resolve({ message: 'success', text: 'NIP bisa digunakan' })
                        }
                    } else if (data.type == 'NIK') {
                        if (data.value) {
                            resolve({ message: 'error', text: 'Data NIK ini telah terdaftar didatabase. Apabila ingin melihat/mengupdate data, silakan pilih menu Revisi Data.' })
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
                spinnerGlobalLoading('none')
            })
    })
}

function filtersNIPORNIK(data, actionTYPE, value) {
    if (actionTYPE === 'NIP') {
        if (value !== prevDataPustakawan.nip) {
            const cekNIP = data.find(item => item.nip === value)
            if (cekNIP) {
                return {
                    type: 'NIP',
                    value: true
                }
            }
            return {
                type: 'NIP',
                value: false
            }
        }
        return {
            type: 'NIP',
            value: false
        }
    } else {
        if (value !== prevDataPustakawan.nik) {
            const cekNIK = data.find(item => item.nik === value)
            if (cekNIK) {
                return {
                    type: 'NIK',
                    value: true
                }
            }
            return {
                type: 'NIK',
                value: false
            }
        }
        return {
            type: 'NIK',
            value: false
        }
    }
}

// datepicker
$(function () {
    $("#tanggalLahirDP").datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date());
});
// end datepicker

// create menu dropdown btn select
function loadCreateSelect(elementId, data) {
    const instansi = document.getElementById(elementId)
    if (instansi) {
        data.forEach(item => {
            let node = document.createElement('option')
            node.setAttribute('data-tokens', item.data_tokens)
            const textNode = document.createTextNode(item.value)
            node.appendChild(textNode)
            instansi.appendChild(node)
        })
    }
}

// remove dropdown menu
function removeDropdownMenu(indexElement) {
    const elem = document.getElementsByClassName('dropdown-menu inner selectpicker')
    setTimeout(() => {
        var currentElem = elem[indexElement]
        var children = currentElem?.lastElementChild
        while (children) {
            currentElem.removeChild(children)
            children = currentElem.lastElementChild
        }
    }, 500);
}

// untuk load data search menu dropdown
let currentDataMenu
let indexElementDropdown

var btnDropdown = document.getElementsByClassName('btn dropdown-toggle selectpicker btn-default')
var searchElem = document.getElementsByClassName('input-block-level form-control')
var wrapBtnGroup = document.getElementsByClassName('btn-group bootstrap-select')

// create menu dropdown
function createMenuDropdown(data, indexElement, type) {
    const elem = document.getElementsByClassName('dropdown-menu inner selectpicker')

    if (elem && data.length > 0) {
        currentDataMenu = data
        indexElementDropdown = indexElement
        const instansi = elem[indexElement]
        wrapBtnGroup = document.getElementsByClassName('btn-group bootstrap-select')
        wrapBtnGroup = wrapBtnGroup[indexElement]
        searchElem = document.getElementsByClassName('input-block-level form-control')
        searchElem = searchElem[indexElement]
        // searchElem?.setAttribute('onkeydown', `clickSearch('${daerah}')`)
        searchElem?.setAttribute('onkeydown', `searchInputOpt('${type}')`)
        btnDropdown = document.getElementsByClassName('btn dropdown-toggle selectpicker btn-default')
        btnDropdown = btnDropdown[indexElement]
        btnDropdown?.setAttribute('onclick', `clickBtnDropdown(${indexElement}, '${type}')`)

        data.forEach((item, index) => {
            // list element
            var li = document.createElement('li')
            li.setAttribute('data-original-index', index)
            li.setAttribute('class', index === 0 ? 'selected active' : '')
            // tag a element
            var tagA = document.createElement('a')
            tagA.setAttribute('data-normalized-text', `<span class=&quot;text&quot;>${item.value}</span>`)
            tagA.setAttribute('tabindex', '0')
            tagA.setAttribute('class', '')
            // children tag a
            // span with text content
            var spanChild = document.createElement('span')
            spanChild.setAttribute('class', 'text')
            spanChild.innerHTML = item.value
            var spanChild2 = document.createElement('span')
            spanChild2.setAttribute('class', 'glyphicon glyphicon-ok check-mark')
            tagA.appendChild(spanChild)
            tagA.appendChild(spanChild2)
            li.appendChild(tagA)
            instansi?.appendChild(li)
        })
    }
}
// end create menu dropdown btn select

const dataNamaKolom = {
    jenisKelamin: {
        id: 'jenisKelamin',
        data: [
            {
                data_tokens: 'laki-laki',
                value: 'Laki-laki'
            },
            {
                data_tokens: 'perempuan',
                value: 'Perempuan'
            },
        ]
    },
    pendidikanTerakhir: {
        id: 'pendidikanTerakhir',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
            },
            {
                data_tokens: 'sma-smk-ma',
                value: 'SMA/SMK/MA'
            },
            {
                data_tokens: 'd1',
                value: 'D1'
            },
            {
                data_tokens: 'd2',
                value: 'D2'
            },
            {
                data_tokens: 'd3',
                value: 'D3'
            },
            {
                data_tokens: 'd4',
                value: 'D4'
            },
            {
                data_tokens: 'smp-mts',
                value: 'SMP/MTs'
            },
            {
                data_tokens: 's1',
                value: 'S1'
            },
            {
                data_tokens: 's2',
                value: 'S2'
            },
            {
                data_tokens: 's3',
                value: 'S3'
            },
        ]
    },
    jurusBidangPendidikan: {
        id: 'jurusBidangPendidikan',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
            },
            {
                data_tokens: 'non-perpustakaan',
                value: 'Non Perpustakaan'
            },
            {
                data_tokens: 'perpustakaan',
                value: 'Perpustakaan'
            },
            {
                data_tokens: '-',
                value: '-'
            },
            {
                data_tokens: 'pustakawan-disertakan',
                value: 'Pustakawan Disertakan'
            }
        ]
    },
    pangkat: {
        id: 'pangkat',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
            },
            {
                data_tokens: 'pengatur-muda-tk-I-(II/b)',
                value: 'Pengatur Muda Tk.I (II/b)'
            },
            {
                data_tokens: 'pengatur-(II/c)',
                value: 'Pengatur (II/c)'
            },
            {
                data_tokens: 'pengatur-tk-I-(II/d)',
                value: 'Pengatur Tk.I (II/d)'
            },
            {
                data_tokens: 'penata-muda-(III/a)',
                value: 'Penata Muda (III/a)'
            },
            {
                data_tokens: 'penata-muda-tk-I-(III/b)',
                value: 'Penata Muda Tk.I (III/b)'
            },
            {
                data_tokens: 'penata-(III/c)',
                value: 'Penata (III/c)'
            },
            {
                data_tokens: 'penata-tk-I-(III/d)',
                value: 'Penata Tk.I (III/d)'
            },
            {
                data_tokens: 'pembina-(IV/a)',
                value: 'Pembina (IV/a)'
            },
            {
                data_tokens: 'pembina-tk-I-(IV/b)',
                value: 'Pembina Tk.I (IV/b)'
            },
            {
                data_tokens: 'pembina-utama-muda-(IV/c)',
                value: 'Pembina Utama Muda (IV/c)'
            },
            {
                data_tokens: 'pembina-utama-madya-(IV/d)',
                value: 'Pembina Utama Madya (IV/d)'
            },
            {
                data_tokens: 'pembina-utama-(IV/e)',
                value: 'Pembina Utama (IV/e)'
            },
            {
                data_tokens: '-',
                value: '-'
            },
            {
                data_tokens: 'pengatur-muda-(II/a)',
                value: 'Pengatur Muda (II/a)'
            }
        ]
    },
    diklatFungsional: {
        id: 'diklatFungsional',
        data: [
            {
                data_tokens: 'tidak-pernah',
                value: 'Tidak Pernah'
            },
            {
                data_tokens: 'diklat-cpta',
                value: 'Diklat CPTA'
            },
            {
                data_tokens: 'diklat-cptt',
                value: 'Diklat CPTT'
            },
            {
                data_tokens: 'diklat-alih-kategori',
                value: 'Diklat Alih Kategori'
            }
        ]
    },
    statusDinas: {
        id: 'statusDinas',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
            },
            {
                data_tokens: 'kepala-perpustakaan',
                value: 'Kepala Perpustakaan'
            },
            {
                data_tokens: 'pustakawan-swasta',
                value: 'Pustakawan Swasta'
            },
            {
                data_tokens: 'pejabat-pimpinan-tinggi-pratama',
                value: 'Pejabat Pimpinan Tinggi Pratama'
            },
            {
                data_tokens: 'pejabat-administrator',
                value: 'Pejabat Administrator'
            },
            {
                data_tokens: 'pejabat-pengawas',
                value: 'Pejabat Pengawas'
            },
            {
                data_tokens: 'staf-administrasi-(fu)',
                value: 'Staf Administrasi (FU)'
            },
            {
                data_tokens: 'tenaga-teknis-komputer',
                value: 'Tenaga Teknis Komputer'
            },
            {
                data_tokens: 'tenaga-teknis-av',
                value: 'Tenaga Teknis A.V'
            },
            {
                data_tokens: 'ketatausahaan',
                value: 'Ketatausahaan'
            },
            {
                data_tokens: 'administrasi-keuangan',
                value: 'Administrasi Keuangan'
            },
            {
                data_tokens: 'petugas-pengelola-perpustakaan',
                value: 'Petugas/Pengelola Perpustakaan'
            },
            {
                data_tokens: 'fungsional-tertentu-lainnya',
                value: 'Fungsional Tertentu Lainnya'
            },
            {
                data_tokens: 'sekretaris-utama',
                value: 'Sekretaris Utama'
            },
            {
                data_tokens: 'penyuluh-perpustakaan',
                value: 'Penyuluh Perpustakaan'
            },
            {
                data_tokens: 'pengawas-perpustakaan',
                value: 'Pengawas Perpustakaan'
            },
        ]
    },
    nipornik: {
        id: 'nipornik',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
            },
            {
                data_tokens: 'nip',
                value: 'NIP'
            },
            {
                data_tokens: 'nik',
                value: 'NIK'
            },
        ]
    },
    instansi: {
        id: 'instansi',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
            }
        ]
    },
    lokasi_instansi: {
        id: 'lokasi_instansi',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
            },
            {
                data_tokens: 'kabupaten-bogor',
                value: 'Kabupaten Bogor'
            },
            {
                data_tokens: 'kota-bogor',
                value: 'Kota Bogor'
            },
            {
                data_tokens: 'kota-depok',
                value: 'Kota Depok'
            },
        ]
    },
    jenis_instansi: {
        id: 'jenis_instansi',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
            },
            {
                data_tokens: 'perpustakaan-sekolah',
                value: 'PERPUSTAKAAN SEKOLAH'
            },
            {
                data_tokens: 'perpustakaan-perguruan-tinggi',
                value: 'PERPUSTAKAAN PERGURUAN TINGGI'
            },
            {
                data_tokens: 'perpustakaan-umum',
                value: 'PERPUSTAKAAN UMUM'
            },
            {
                data_tokens: 'perpustakaan-khusus',
                value: 'PERPUSTAKAAN KHUSUS'
            },
        ]
    },
    tahunDiklat: {
        id: 'tahunDiklat',
        data: createRangeOfYears()
    },
    jabatanOrganisasi: {
        id: 'jabatanOrganisasi',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
            },
            {
                data_tokens: 'pengurus',
                value: 'Pengurus'
            },
            {
                data_tokens: 'anggota',
                value: 'Anggota'
            },
        ]
    }
}

function setOptionElement() {
    Object.entries(dataNamaKolom).forEach(item => loadCreateSelect(item[1].id, item[1].data))
}

setOptionElement()

function searchInputOpt(type) {
    loadSearchDataDropdown(indexElementDropdown, searchElem.value, searchElem, type)
}

function loadSearchDataDropdown(
    indexElement,
    inputValue,
    event,
    type
) {
    const elem = document.getElementsByClassName('dropdown-menu inner selectpicker')
    // event.addEventListener('keyup', (e) => {
    //     if (e?.code === 'Enter') {
    //         console.log('sukses')
    //     }
    // })

    if (isTextSelected(event) && currentDataMenu?.length > 0) {
        aturSelection(elem, indexElement, '', type)
    } else if (currentDataMenu?.length > 0) {
        aturSelection(elem, indexElement, inputValue, type)
    }
}

function isTextSelected(input) {
    if (input.selectionStart !== undefined) {
        return input.selectionStart === 0 && input.selectionEnd === input.value.length
    } else {
        return false
    }
}

function aturSelection(
    elem,
    indexElement,
    inputValue,
    type,
) {
    const instansi = elem[indexElement]
    const childList = instansi.children
    currentDataMenu.forEach((_, index) => {
        const textItem = childList[index]?.innerText
        if (childList[index] && inputValue.length > 0) {
            childList[index].setAttribute('class', 'hide')
            const checkItem =
                textItem.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
                textItem.indexOf(inputValue) > -1
            if (checkItem) {
                childList[index].setAttribute('class', '')
            }
        } else if (childList[index]) {
            childList[index].removeAttribute('class')
            if (type === 'instansi') {
                if (dataInputNamaKolom.instansi !== 'Silahkan Pilih') {
                    const checkItem =
                        textItem?.toLowerCase() == dataInputNamaKolom.instansi.toLowerCase() ||
                        textItem == dataInputNamaKolom.instansi
                    if (checkItem) {
                        childList[index].setAttribute('class', 'selected active')
                    }
                } else {
                    childList[0].setAttribute('class', 'selected active')
                }
            }
        }
    })
}

function clickBtnDropdown(indexElement, type) {
    indexElementDropdown = indexElement
    searchElem = document.getElementsByClassName('input-block-level form-control')
    setTimeout(() => {
        searchElem = searchElem[indexElement]
        searchElem.removeAttribute('onkeydown')
        searchElem.setAttribute('onkeydown', `searchInputOpt('${type}')`)
    }, 0)

    if (type === 'instansi') {
        spinnerGlobalLoading('flex')
        getSekolah()
            .then(res => {
                const data = res.dataSekolah.map(item => ({
                    data_tokens: item.id,
                    value: item.name
                }))
                const newData = [
                    {
                        data_tokens: 'silahkan-pilih',
                        value: 'Silahkan Pilih'
                    },
                    ...data
                ]
                currentDataMenu = newData
                searchInputOpt(type)
                spinnerGlobalLoading('none')
            })
            .catch(err => console.log(err))
    }
}

// on selection value from instansi
function onSelectionFromAPI(selectId, type) {
    const elem = document.getElementById(selectId)
    // const loadingElem = document.getElementById(loadingId)
    if (elem) {
        const indexOption = elem.selectedIndex
        // dataset (tokens) options yang dipilih
        const tokens = elem.children[indexOption].dataset.tokens
        // const data_tokens = optionElem.getAttribute('data-tokens')
        const value = elem.options[elem.selectedIndex].value
        if (type === 'instansi') {
            dataInputNamaKolom.instansi = value
        }
    }
}

function checkBoxInstansi(elementId) {
    const elem = document.getElementById(elementId)
    if (elem) {
        if (elem.checked) {
            document.getElementById('secOptInstansi').style.display = 'none'
            document.getElementById('textInstansi').style.display = 'flex'
            dataInputNamaKolom.instansi = document.getElementById('textInstansi').value
        } else {
            document.getElementById('secOptInstansi').style.display = 'flex'
            document.getElementById('textInstansi').style.display = 'none'
            dataInputNamaKolom.instansi = document.getElementById('instansi').value
        }
    }
}
// END CASE FOR INPUT NAMA KOLOM

// CASE CARD INPUT ADD DATA
// RESULT INPUT ADD DATA
let resultDataDiklat = []
let resultDataKaryaTulis = []
let resultDataOrganisasi = []

// PROSES ADD CARD
function createCardResultAdd(dataInput, lengthData, indexNumber, inputType, funcDelete, funcUpdate) {
    // create wrap card
    var wrapCard = document.createElement('div')
    wrapCard.setAttribute('class', 'add-card-group')
    // create wrap action
    var wrapAction = document.createElement('div')
    wrapAction.setAttribute('style', 'display: flex; justify-content: space-between; margin-bottom: 1rem;')
    // create btn action
    // create number
    var number = document.createElement('span')
    number.innerText = `${indexNumber}.`
    // create container icon
    var containerIcon = document.createElement('div')
    // btn update
    var pencil = document.createElement('i')
    pencil.setAttribute('class', 'fa-solid fa-pencil')
    pencil.setAttribute('style', 'color: #428bca; cursor: pointer; margin-right: 1rem; font-size: 12.5px;')
    pencil.setAttribute('onclick', `${funcUpdate}(${indexNumber})`)
    // btn delete
    var deleteBtn = document.createElement('i')
    deleteBtn.setAttribute('class', 'fa-solid fa-trash')
    deleteBtn.setAttribute('style', 'color: #ff0000; cursor: pointer; font-size: 12.5px;')
    deleteBtn.setAttribute('onclick', `${funcDelete}(${indexNumber})`)
    containerIcon.appendChild(pencil)
    containerIcon.appendChild(deleteBtn)
    wrapAction.appendChild(number)
    wrapAction.appendChild(containerIcon)
    // create body content
    var bodyContent = document.createElement('div')
    bodyContent.setAttribute('style', 'display: flex; flex-direction: column;')
    let count = 0
    Object.entries(dataInput).forEach((item) => {
        count = count + 1
        bodyContent.appendChild(createBodyContentCard(item[0], item[1], inputType))
    })
    wrapCard.appendChild(wrapAction)
    if (count === lengthData) {
        wrapCard.appendChild(bodyContent)
        return wrapCard
    }
}

function createBodyContentCard(titleValue, descValue, inputType) {
    // container
    let div = document.createElement('div')
    div.setAttribute('style', 'margin: 3px 0;')
    // title
    let title = document.createElement('h5')
    title.setAttribute('style', 'text-align: start; margin: 0;')
    // text bold
    let strong = document.createElement('strong')
    if (inputType == 'DIKLAT') {
        if (titleValue == 'namaDiklat') {
            strong.innerText = 'Nama Diklat'
        } else if (titleValue == 'tahunDiklat') {
            strong.innerText = 'Tahun'
        } else if (titleValue == 'jumlahJamPelatihan') {
            strong.innerText = 'Jumlah Jam Pelatihan'
        }
    } else if (inputType === 'KARYA-TULIS-ILMIAH') {
        if (titleValue == 'judulBuku') {
            strong.innerText = 'Judul Buku'
        } else if (titleValue == 'tahunTerbit') {
            strong.innerText = 'Tahun Terbit'
        }
    } else if (inputType === 'ORGANISASI') {
        if (titleValue == 'namaOrganisasi') {
            strong.innerText = 'Nama Organisasi'
        } else if (titleValue == 'jabatanOrganisasi') {
            strong.innerText = 'Jabatan Organisasi'
        }
    }
    title.appendChild(strong)
    // deskripsi
    let span = document.createElement('span')
    span.setAttribute('style', 'font-size: 13px;')
    span.innerText = descValue
    div.appendChild(title)
    div.appendChild(span)
    return div
}

// DIKLAT
const titleAddDiklat = document.getElementById('titleAddDiklat')
const btnSubmitDiklat = document.getElementById('btnSubmitDiklat')

function clickAddDiklat() {
    const elem = document.getElementsByClassName('modal-backdrop fade in')
    setTimeout(() => {
        if (elem?.length > 0) {
            elem[0].style.display = 'none'
        }
    }, 0);
    titleAddDiklat.innerText = 'Tambah Diklat Teknis Kepustakawan'
    btnSubmitDiklat.setAttribute('onclick', 'prosesTambahDiklat()')
    btnSubmitDiklat.innerText = 'Tambah'
    inputDataAddDiklat = {
        namaDiklat: '',
        tahunDiklat: 'Silahkan Pilih',
        jumlahJamPelatihan: ''
    }
    removeValueInput('namaDiklat')
    // removeValueInput('tahunDiklat')
    removeValueSelection('tahunDiklat', 10, 'Silahkan Pilih')
    removeValueInput('jumlahJamPelatihan')
    removeErrModalInput('errNmDiklat')
    removeErrModalInput('errThDiklat')
    removeErrModalInput('errJmDiklat')
}

const wrapListDiklat = document.getElementById('wrapListDiklat')

function prosesTambahDiklat() {
    if (validateFormAddDiklat()) {
        btnSubmitDiklat.setAttribute('data-dismiss', 'modal')
        const lengthInputDiklat = Object.entries(inputDataAddDiklat).map(e => e).length
        resultDataDiklat.push(inputDataAddDiklat)
        while (wrapListDiklat.hasChildNodes()) {
            wrapListDiklat.removeChild(wrapListDiklat.firstChild)
        }
        resultDataDiklat.forEach((_, index) => {
            wrapListDiklat.appendChild(createCardResultAdd(resultDataDiklat[index], lengthInputDiklat, index + 1, 'DIKLAT', 'removeCardDiklat', 'updateDiklat'))
        })
        inputDataAddDiklat = {
            namaDiklat: '',
            tahunDiklat: 'Silahkan Pilih',
            jumlahJamPelatihan: ''
        }
        // removeValueInput('namaDiklat')
        // removeValueInput('tahunDiklat')
        // removeValueInput('jumlahJamPelatihan')
        // removeErrModalInput('errNmDiklat')
        // removeErrModalInput('errThDiklat')
        // removeErrModalInput('errJmDiklat')
    } else {
        btnSubmitDiklat.removeAttribute('data-dismiss')
    }
}

function removeCardDiklat(index) {
    const checkItem = resultDataDiklat.filter((_, i) => (i + 1) !== index)
    resultDataDiklat = checkItem
    const lengthInputDiklat = Object.entries(inputDataAddDiklat).map(e => e).length
    while (wrapListDiklat.hasChildNodes()) {
        wrapListDiklat.removeChild(wrapListDiklat.firstChild)
    }
    if (resultDataDiklat.length > 0) {
        resultDataDiklat.forEach((_, index) => {
            wrapListDiklat.appendChild(createCardResultAdd(resultDataDiklat[index], lengthInputDiklat, index + 1, 'DIKLAT', 'removeCardDiklat', 'updateDiklat'))
        })
    }
}

let currentIdxUpdtDiklat = null

function updateDiklat(index) {
    currentIdxUpdtDiklat = index
    removeErrModalInput('errNmDiklat')
    removeErrModalInput('errThDiklat')
    removeErrModalInput('errJmDiklat')
    document.getElementById('clickAddDiklat').click()
    titleAddDiklat.innerText = `Perbarui No. ${index}`
    btnSubmitDiklat.setAttribute('onclick', 'updateInputDiklat()')
    btnSubmitDiklat.innerText = 'Simpan'

    const findData = resultDataDiklat.find((_, i) => (i + 1) === index)
    document.getElementById('namaDiklat').value = findData.namaDiklat
    document.getElementById('tahunDiklat').value = findData.tahunDiklat
    document.getElementById('jumlahJamPelatihan').value = findData.jumlahJamPelatihan
    inputDataAddDiklat = {
        namaDiklat: document.getElementById('namaDiklat').value = findData.namaDiklat,
        tahunDiklat: document.getElementById('tahunDiklat').value = findData.tahunDiklat,
        jumlahJamPelatihan: document.getElementById('jumlahJamPelatihan').value = findData.jumlahJamPelatihan
    }
    updateValueSelection('tahunDiklat', 10, findData.tahunDiklat)
}

function updateInputDiklat() {
    if (validateFormAddDiklat()) {
        btnSubmitDiklat.setAttribute('data-dismiss', 'modal')
        const { namaDiklat, tahunDiklat, jumlahJamPelatihan } = inputDataAddDiklat
        resultDataDiklat[currentIdxUpdtDiklat - 1] = {
            namaDiklat,
            tahunDiklat,
            jumlahJamPelatihan
        }
        const lengthInputDiklat = Object.entries(inputDataAddDiklat).map(e => e).length
        while (wrapListDiklat.hasChildNodes()) {
            wrapListDiklat.removeChild(wrapListDiklat.firstChild)
        }
        if (resultDataDiklat.length > 0) {
            resultDataDiklat.forEach((_, index) => {
                wrapListDiklat.appendChild(createCardResultAdd(resultDataDiklat[index], lengthInputDiklat, index + 1, 'DIKLAT', 'removeCardDiklat', 'updateDiklat'))
            })
        }
        inputDataAddDiklat = {
            namaDiklat: '',
            tahunDiklat: 'Silahkan Pilih',
            jumlahJamPelatihan: ''
        }
        // removeValueInput('namaDiklat')
        // removeValueInput('tahunDiklat')
        // removeValueInput('jumlahJamPelatihan')
    } else {
        btnSubmitDiklat.removeAttribute('data-dismiss')
    }
}
// END DIKLAT

// ORGANISASI
const titleAddOrganisasi = document.getElementById('titleAddOrganisasi')
const btnSubmitOrganisasi = document.getElementById('btnSubmitOrganisasi')

const wrapListAddOrganisasi = document.getElementById('listAddOrganisasi')

function clickAddOrganisasi() {
    const elem = document.getElementsByClassName('modal-backdrop fade in')
    setTimeout(() => {
        if (elem?.length > 0) {
            elem[0].style.display = 'none'
        }
    }, 0);
    titleAddOrganisasi.innerText = 'Tambahkan Organisasi Profesi'
    btnSubmitOrganisasi.setAttribute('onclick', 'prosesTambahOrganisasi()')
    btnSubmitOrganisasi.innerText = 'Tambah'
    removeValueInput('namaOrganisasi')
    // removeValueInput('jabatanOrganisasi')
    removeValueSelection('jabatanOrganisasi', 11, 'Silahkan Pilih')
    inputDataOrganisasi = {
        namaOrganisasi: '',
        jabatanOrganisasi: 'Silahkan Pilih'
    }
    removeErrModalInput('errNmOrganisasi')
    removeErrModalInput('errJbtOrganisasi')
}

function prosesTambahOrganisasi() {
    if (validateFormAddOrganisasi()) {
        btnSubmitOrganisasi.setAttribute('data-dismiss', 'modal')
        const lengthInputOrganisasi = Object.entries(inputDataOrganisasi).map(e => e).length
        resultDataOrganisasi.push(inputDataOrganisasi)
        while (wrapListAddOrganisasi.hasChildNodes()) {
            wrapListAddOrganisasi.removeChild(wrapListAddOrganisasi.firstChild)
        }
        resultDataOrganisasi.forEach((_, index) => {
            wrapListAddOrganisasi.appendChild(createCardResultAdd(resultDataOrganisasi[index], lengthInputOrganisasi, index + 1, 'ORGANISASI', 'removeCardOrganisasi', 'updateCardOrganisasi'))
        })
        inputDataOrganisasi = {
            namaOrganisasi: '',
            jabatanOrganisasi: 'Silahkan Pilih'
        }
        // removeValueInput('namaOrganisasi')
        // removeValueInput('jabatanOrganisasi')
    } else {
        btnSubmitOrganisasi.removeAttribute('data-dismiss')
    }
}

function removeCardOrganisasi(index) {
    const checkItem = resultDataOrganisasi.filter((_, i) => (i + 1) !== index)
    resultDataOrganisasi = checkItem
    const lengthInputOrganisasi = Object.entries(inputDataOrganisasi).map(e => e).length
    while (wrapListAddOrganisasi.hasChildNodes()) {
        wrapListAddOrganisasi.removeChild(wrapListAddOrganisasi.firstChild)
    }
    if (resultDataOrganisasi.length > 0) {
        resultDataOrganisasi.forEach((_, index) => {
            wrapListAddOrganisasi.appendChild(createCardResultAdd(resultDataOrganisasi[index], lengthInputOrganisasi, index + 1, 'ORGANISASI', 'removeCardOrganisasi', 'updateCardOrganisasi'))
        })
    }
}

let currentIdxUptdOrganisasi = null

function updateCardOrganisasi(index) {
    currentIdxUptdOrganisasi = index
    document.getElementById('clickAddOrganisasi').click()
    titleAddOrganisasi.innerText = `Perbarui No. ${index}`
    btnSubmitOrganisasi.setAttribute('onclick', 'submitUpdtOrganisasi()')
    btnSubmitOrganisasi.innerText = 'Simpan'

    const findData = resultDataOrganisasi.find((_, i) => (i + 1) === index)
    document.getElementById('namaOrganisasi').value = findData.namaOrganisasi
    document.getElementById('jabatanOrganisasi').value = findData.jabatanOrganisasi
    inputDataOrganisasi = {
        namaOrganisasi: document.getElementById('namaOrganisasi').value = findData.namaOrganisasi,
        jabatanOrganisasi: document.getElementById('jabatanOrganisasi').value = findData.jabatanOrganisasi,
    }
    removeErrModalInput('errNmOrganisasi')
    removeErrModalInput('errJbtOrganisasi')
    updateValueSelection('jabatanOrganisasi', 11, findData.jabatanOrganisasi)
}

function submitUpdtOrganisasi() {
    if (validateFormAddOrganisasi()) {
        btnSubmitOrganisasi.setAttribute('data-dismiss', 'modal')
        const { namaOrganisasi, jabatanOrganisasi } = inputDataOrganisasi
        resultDataOrganisasi[currentIdxUptdOrganisasi - 1] = {
            namaOrganisasi,
            jabatanOrganisasi
        }
        const lengthInputOrganisasi = Object.entries(inputDataOrganisasi).map(e => e).length
        while (wrapListAddOrganisasi.hasChildNodes()) {
            wrapListAddOrganisasi.removeChild(wrapListAddOrganisasi.firstChild)
        }
        if (resultDataOrganisasi.length > 0) {
            resultDataOrganisasi.forEach((_, index) => {
                wrapListAddOrganisasi.appendChild(createCardResultAdd(resultDataOrganisasi[index], lengthInputOrganisasi, index + 1, 'ORGANISASI', 'removeCardOrganisasi', 'updateCardOrganisasi'))
            })
        }
        inputDataOrganisasi = {
            namaOrganisasi: '',
            jabatanOrganisasi: 'Silahkan Pilih'
        }
        // removeValueInput('namaOrganisasi')
        // removeValueInput('jabatanOrganisasi')
    } else {
        btnSubmitOrganisasi.removeAttribute('data-dismiss')
    }
}
// END ORGANISASI

// VALIDATE ADD INPUT DATA
const errText = 'Harus diisi'

// VALIDATE DIKLAT
function validateFormAddDiklat() {
    let err = {}
    const { namaDiklat, tahunDiklat, jumlahJamPelatihan } = inputDataAddDiklat
    if (!namaDiklat.trim()) {
        err.errNmDiklat = errText
    }
    if (tahunDiklat == 'Silahkan Pilih') {
        err.errThDiklat = errText
    }
    if (!jumlahJamPelatihan.trim()) {
        err.errJmDiklat = errText
    }
    if (namaDiklat.length > 0) {
        removeErrModalInput('errNmDiklat')
    }
    if (tahunDiklat !== 'Silahkan Pilih') {
        removeErrModalInput('errThDiklat')
    }
    if (jumlahJamPelatihan.length > 0) {
        removeErrModalInput('errJmDiklat')
    }
    if (Object.keys(err).length > 0) {
        Object.entries(err).forEach(text => document.getElementById(text[0]).innerText = text[1])
        return
    }
    return 'success'
}

// VALIDATE ORGANISASI
function validateFormAddOrganisasi() {
    let err = {}
    const { namaOrganisasi, jabatanOrganisasi } = inputDataOrganisasi
    if (!namaOrganisasi.trim()) {
        err.errNmOrganisasi = errText
    }
    if (jabatanOrganisasi == 'Silahkan Pilih') {
        err.errJbtOrganisasi = errText
    }
    if (namaOrganisasi.length > 0) {
        removeErrModalInput('errNmOrganisasi')
    }
    if (jabatanOrganisasi !== 'Silahkan Pilih') {
        removeErrModalInput('errJbtOrganisasi')
    }
    if (Object.keys(err).length > 0) {
        Object.entries(err).forEach(text => document.getElementById(text[0]).innerText = text[1])
        return
    }
    return 'success'
}

function removeErrModalInput(elementId) {
    const elem = document.getElementById(elementId)
    if (elem) {
        elem.innerText = ''
    }
}

function changeInputAdd(elementId, nameInput, type) {
    const elem = document.getElementById(elementId)
    if (type === 'DIKLAT') {
        inputDataAddDiklat[nameInput] = elem.value
    } else if (type === 'KARYA-TULIS-ILMIAH') {
        // inputDataKaryaTulis[nameInput] = elem.value
    } else if (type === 'ORGANISASI') {
        inputDataOrganisasi[nameInput] = elem.value
    }
}
// END CASE CARD INPUT ADD DATA

// CASE LAMPIRAN DATA PENDUKUNG
let inputLampiranData = {
    skKenaikanPangkatTerakhir: null,
    dokumen1: null,
    dokumen2: null,
    dokumen3: null,
}

const inputKenaikanPangkatTerakhir = document.getElementById('kenaikanPangkatTerakhir')
const inputLampiranData1 = document.getElementById('lampiranData1')
const inputLampiranData2 = document.getElementById('lampiranData2')
const inputLampiranData3 = document.getElementById('lampiranData3')
// btn delete
const deleteKenaikanPangkat = document.getElementById('deleteKenaikanPangkat')
const deleteLampiranData1 = document.getElementById('deleteLampiranData1')
const deleteLampiranData2 = document.getElementById('deleteLampiranData2')
const deleteLampiranData3 = document.getElementById('deleteLampiranData3')

// SK Kenaikan Pangkat Terakhir
inputKenaikanPangkatTerakhir.addEventListener('change', (e) => {
    const files = e.target.files
    changeFilesLampiranGroup(
        files,
        'skKenaikanPangkatTerakhir',
        inputKenaikanPangkatTerakhir,
        deleteKenaikanPangkat
    )
})
// Dokumen 1
// inputLampiranData1.addEventListener('change', (e) => {
//     const files = e.target.files
//     changeFilesLampiranGroup(
//         files,
//         'dokumen1',
//         inputLampiranData1,
//         deleteLampiranData1
//     )
// })
// Dokumen 2
// inputLampiranData2.addEventListener('change', (e) => {
//     const files = e.target.files
//     changeFilesLampiranGroup(
//         files,
//         'dokumen2',
//         inputLampiranData2,
//         deleteLampiranData2
//     )
// })
// Dokumen 3
// inputLampiranData3.addEventListener('change', (e) => {
//     const files = e.target.files
//     changeFilesLampiranGroup(
//         files,
//         'dokumen3',
//         inputLampiranData3,
//         deleteLampiranData3
//     )
// })

function changeFilesLampiranGroup(
    files,
    propertyData,
    element,
    btnDeleteElement
) {
    if (files[0] && validateLampiranFile(files)) {
        if (validateSizeLampiranFiles(files)) {
            inputLampiranData[propertyData] = files
            changeStyleBtnDeleteFile(btnDeleteElement, 'pointer', 'btn btn-danger')
            document.getElementById('prevFileDoc').style.display = 'none'
        } else {
            alert('Maaf, tidak bisa input file dengan ukuran lebih dari 2MB')
            if (inputLampiranData[propertyData]?.[0]?.name) {
                element.files = inputLampiranData[propertyData]
            } else {
                element.value = null
            }
        }
    } else if (files[0]) {
        alert('File Harus berupa .pdf /.jpg /.jpeg /.png')
        if (inputLampiranData[propertyData]?.[0]?.name) {
            element.files = inputLampiranData[propertyData]
        } else {
            element.value = null
        }
    } else if (!files[0] && inputLampiranData[propertyData]) {
        element.files = inputLampiranData[propertyData]
    }
}

function validateLampiranFile(files) {
    const getTypeFile = files[0].type.split('/')[1]
    if (!getTypeFile || getTypeFile.length === 0) {
        return
    }
    if (
        getTypeFile.toLowerCase() === 'jpg' ||
        getTypeFile.toLowerCase() === 'jpeg' ||
        getTypeFile.toLowerCase() === 'png' ||
        getTypeFile.toLowerCase() === 'pdf'
    ) {
        return 'success'
    } else {
        return
    }
}

function validateSizeLampiranFiles(files) {
    const sizeOfFile = files[0].size
    if (sizeOfFile >= 2000000) {
        return
    }
    return 'success'
}

function changeStyleBtnDeleteFile(
    element,
    cursor,
    className
) {
    element.style.cursor = cursor
    element.setAttribute('class', className)
}

function deleteFileLampiran(actionType) {
    if (actionType === 'SK_PUSTAKAWAN_TERAKHIR') {
        inputPustakawanTerakhir.value = null
        inputLampiranData.skPustakawanTerakhir = null
        changeStyleBtnDeleteFile(deletePustakawanTerakhir, 'not-allowed', 'btn btn-secondary')
    } else if (actionType === 'SK_KENAIKAN_PANGKAT_TERAKHIR') {
        inputKenaikanPangkatTerakhir.value = null
        inputLampiranData.skKenaikanPangkatTerakhir = null
        changeStyleBtnDeleteFile(deleteKenaikanPangkat, 'not-allowed', 'btn btn-secondary')
        document.getElementById('prevFileDoc').style.display = 'flex'
    } else if (actionType === 'DOKUMEN_1') {
        inputLampiranData1.value = null
        inputLampiranData.dokumen1 = null
        changeStyleBtnDeleteFile(deleteLampiranData1, 'not-allowed', 'btn btn-secondary')
    } else if (actionType === 'DOKUMEN_2') {
        inputLampiranData2.value = null
        inputLampiranData.dokumen2 = null
        changeStyleBtnDeleteFile(deleteLampiranData2, 'not-allowed', 'btn btn-secondary')
    } else if (actionType === 'DOKUMEN_3') {
        inputLampiranData3.value = null
        inputLampiranData.dokumen3 = null
        changeStyleBtnDeleteFile(deleteLampiranData3, 'not-allowed', 'btn btn-secondary')
    }
}
// END CASE LAMPIRAN DATA PENDUKUNG

// KETERANGAN TAMBAHAN
let dataKeteranganTambahan = ''
document.getElementById('keteranganTambahan').addEventListener('change', (e) => {
    dataKeteranganTambahan = e.target.value
})
// END KETERANGAN TAMBAHAN

// CASE INPUT DATA PENGIRIM
let dataInputPengirim = {
    namaPengirim: '',
    emailPengirim: '',
    telpPengirim: ''
}

function changeInputDataPengirim(elementId, nameInput) {
    const elem = document.getElementById(elementId)
    if (elem) dataInputPengirim[nameInput] = elem.value
}
// END CASE INPUT DATA PENGIRIM

setLocalStorageForSubmit(REMOVE_ITEM, nmStorageRevisiTenaga)

let loadingSubmit = false

// SUBMIT FORM
function submitFormRevisiTenaga() {
    if(currentExpQuery && !validateExpToken(currentExpQuery)){
        alert('Akses revisi Anda telah berakhir.\nSilahkan input kembali.')
        window.location.replace(window.location.origin)
        return
    }
    if (loadingSubmit === false) {
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
                    loadingSubmit = true
                    spinnerGlobalLoading('flex')
                    setLocalStorageForSubmit(SET_ITEM, nmStorageRevisiTenaga, defaultValueStgSubmit)
                } else if(res == 'failed') {
                    spinnerGlobalLoading('none')
                    loadingSubmit = false
                    console.log(res)
                }
            })
            .catch(err => {
                console.log('err-submit-form', err)
                loadingSubmit = false
            })
    }
}

function validateExpToken(expToken) {
    const cekExp = (new Date()).valueOf() < (new Date(expToken)).valueOf()
    return cekExp
}

function resultFormDataRevisiTenaga() {
    const diklat = resultDataDiklat.map(item => `${item.namaDiklat},${item.tahunDiklat},${item.jumlahJamPelatihan}`)
    const organisasi = resultDataOrganisasi.map(item => `${item.namaOrganisasi},${item.jabatanOrganisasi}`)

    const dataDiklat = diklat.join(';')
    const dataOrganisasi = organisasi.join(';')
    return {
        ...dataInputNamaKolom,
        dataDiklat,
        dataOrganisasi,
        ...inputLampiranData,
        keteranganTambahan: dataKeteranganTambahan,
        ...dataInputPengirim,
    }
}

function dataRevisiTenagaForPost(data) {
    const {
        files,
        nip,
        nik,
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
        jenis_instansi,
        diklatFungsionalPustakawan,
        dataDiklat,
        dataOrganisasi,
        skKenaikanPangkatTerakhir,
        dokumen1,
        dokumen2,
        dokumen3,
        keteranganTambahan,
        pekerjaan,
        status
    } = data

    return {
        gambar_users: dataInputNamaKolom.files ?? prevDataPustakawan.imgURL,
        nip: nip ?? 'null',
        nik: nik ?? 'null',
        nama_users: namaLengkap,
        username: nip !== null || nip?.length > 0 ? nip : nik,
        password: `${createDateFormat(new Date(tanggalLahir)).split('/').join('-')}`,
        Tempat_Lahir: tempatLahir,
        Tanggal_Lahir: `${createDateFormat(new Date(tanggalLahir)).split('/').join('-')}`,
        jenis_kelamin: jenisKelamin,
        no_hp: nomorHP,
        email,
        pendidikan: pendidikanTerakhir,
        jurusan_bidangpendidikan: jurusanBidangPendidikan,
        pangkat,
        tamat_pangkat: 'null',
        jabatan_fungsional: 'null',
        tamat_jabatan: 'null',
        status_jabatan: 'null',
        istansi: instansi,
        diklat: diklatFungsionalPustakawan,
        catatan: keteranganTambahan.trim() ? keteranganTambahan : 'null',
        waktu_daftar: `${createDateFormat(new Date()).split('/').join('-')} ${createHourFormat(new Date())}`,
        status: status,
        status_dinas: statusDinas,
        dokumen_pendukung: 'null',
        dokumen_pendukung2: 'null',
        dokumen_pendukung3: 'null',
        role: 'Users',
        pekerjaan: pekerjaan,
        lokasi_instansi: lokasi_instansi,
        jenis_instansi,
        judul_kti: 'null',
        data_diklat: dataDiklat,
        organisasi: dataOrganisasi,
        sk_pustakawan: 'null',
        sk_pangkat: skKenaikanPangkatTerakhir ?? prevDataPustakawan.sk_pangkat
    }
}

function validateFormNamaKolom() {
    let err = {}
    const {
        files,
        imgURL,
        nip,
        nik,
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
        jenis_instansi,
        lokasi_instansi,
        diklatFungsionalPustakawan
    } = dataInputNamaKolom
    let errData = []
    for (let i = 0; i <= 14; i++) {
        errData.push(`errNmKolom${i}`)
        if (
            document.getElementById(`errNmKolom${i}`).id == 'errNmKolom1' &&
            document.getElementById(`errNmKolom${i}`).innerText !== 'Harus diisi'
        ) {
            const removeErrNIP = errData.filter(item => item !== 'errNmKolom1')
            errData = removeErrNIP
        }
    }

    if (imgURL !== prevDataPustakawan.imgURL && !files) {
        err.errNmKolom0 = errText
    }
    if (nip == null && nik == null) {
        err.errNmKolom1 = errText
        document.getElementById('errNmKolom1').style.color = '#ff0000'
    }
    if (optionNIPORNIK == 'NIP' && nip == null || optionNIPORNIK == 'NIP' && !nip.trim()) {
        err.errNmKolom1 = errText
        document.getElementById('errNmKolom1').style.color = '#ff0000'
    } else if (optionNIPORNIK == 'NIP' && nip.length !== 18) {
        err.errNmKolom1 = 'NIP harus terdiri dari 18 Digit'
        document.getElementById('errNmKolom1').style.color = '#ff0000'
    }
    if (optionNIPORNIK == 'NIK' && nik == null || optionNIPORNIK == 'NIK' && !nik.trim()) {
        err.errNmKolom1 = errText
        document.getElementById('errNmKolom1').style.color = '#ff0000'
    } else if (optionNIPORNIK == 'NIK' && nik.length !== 16) {
        err.errNmKolom1 = 'NIK harus terdiri dari 16 Digit'
        document.getElementById('errNmKolom1').style.color = '#ff0000'
    }
    if (!namaLengkap.trim()) {
        err.errNmKolom2 = errText
    }
    if (!tempatLahir.trim()) {
        err.errNmKolom3 = errText
    }
    if (!tanggalLahir.trim()) {
        err.errNmKolom4 = errText
    }
    if (!jenisKelamin.trim()) {
        err.errNmKolom5 = errText
    }
    if (!nomorHP.trim()) {
        err.errNmKolom6 = errText
    } else if (!phoneRegex.test(nomorHP)) {
        err.errNmKolom6 = 'Nomor telpon tidak valid!'
    }
    if (!email.trim()) {
        err.errNmKolom7 = errText
    } else if (!mailRegex.test(email)) {
        err.errNmKolom7 = 'Alamat email tidak valid!'
    }
    if (pendidikanTerakhir === 'Silahkan Pilih') {
        err.errNmKolom8 = errText
    }
    if (jurusanBidangPendidikan === 'Silahkan Pilih') {
        err.errNmKolom9 = errText
    }
    if (pangkat === 'Silahkan Pilih') {
        err.errNmKolom10 = errText
    }
    if (statusDinas === 'Silahkan Pilih') {
        err.errNmKolom11 = errText
    }
    if (!instansi.trim() || instansi === 'Silahkan Pilih') {
        err.errNmKolom12 = errText
    }
    if (lokasi_instansi === 'Silahkan Pilih') {
        err.errNmKolom13 = errText
    }
    if (jenis_instansi === 'Silahkan Pilih') {
        err.errNmKolom14 = errText
    }
    removeErrInputForm(errData)
    if (Object.keys(err).length > 0) {
        Object.entries(err).forEach(err => document.getElementById(err[0]).innerText = err[1])
        return
    }
    return 'success'
}

function validateFormAddCard() {
    let err = {}
    const errData = ['errDiklat', 'errAddOrganisasi']
    if (resultDataDiklat.length === 0) {
        err.errDiklat = errText
    }
    if (resultDataOrganisasi.length === 0) {
        err.errAddOrganisasi = errText
    }
    removeErrInputForm(errData)
    if (Object.keys(err).length > 0) {
        Object.entries(err).forEach(err => document.getElementById(err[0]).innerText = err[1])
        return
    }
    return 'success'
}

function validateFormLampiranData() {
    let err = {}
    const errData = ['errKenaikanPangkatTerakhir']
    const {
        skKenaikanPangkatTerakhir,
        dokumen1,
        dokumen2,
        dokumen3
    } = inputLampiranData
    if (!skKenaikanPangkatTerakhir) {
        err.errKenaikanPangkatTerakhir = errText
    }
    // if (!dokumen1) {
    //     err.errLampiranData1 = errText
    // }
    // if (!dokumen2) {
    //     err.errLampiranData2 = errText
    // }
    // if (!dokumen3) {
    //     err.errLampiranData3 = errText
    // }
    removeErrInputForm(errData)
    if (Object.keys(err).length > 0) {
        Object.entries(err).forEach(err => document.getElementById(err[0]).innerText = err[1])
        return
    }
    return 'success'
}

function validateDataPengirim() {
    let err = {}
    const { namaPengirim, emailPengirim, telpPengirim } = dataInputPengirim
    const errData = []
    for (let i = 0; i < 3; i++) {
        errData.push(`errDataP${i + 1}`)
    }
    if (!namaPengirim.trim()) {
        err.errDataP1 = errText
    }
    if (!emailPengirim.trim()) {
        err.errDataP2 = errText
    } else if (!mailRegex.test(emailPengirim)) {
        err.errDataP2 = 'Alamat email tidak valid'
    }
    if (!telpPengirim.trim()) {
        err.errDataP3 = errText
    }
    removeErrInputForm(errData)
    if (Object.keys(err).length > 0) {
        Object.entries(err).forEach(err => document.getElementById(err[0]).innerText = err[1])
        return
    }
    return 'success'
}

function isCaptchaChecked() {
    return grecaptcha && grecaptcha.getResponse().length !== 0
}

function validateCaptcha() {
    const elem = document.getElementById('errCaptcha')
    if (!isCaptchaChecked()) {
        elem.innerText = 'Mohon ceklis cekbox'
        return
    }
    elem.innerText = ''
    return 'success'
}
// END SUBMIT FORM

function removeValueInput(elementId) {
    const elem = document.getElementById(elementId)
    elem.value = ''
}

function removeErrInputForm(data) {
    data.forEach(elementId => document.getElementById(elementId).innerText = '')
}

let prevDataOrganisasi = []
let prevDataDiklat = []

function setUpdtToForm(data) {
    const {
        gambar_users,
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
        catatan,
        pekerjaan,
        status
    } = data

    prevDataPustakawan.nip = nip
    prevDataPustakawan.nik = nik
    optionNIPORNIK = nip !== 'null' ? 'NIP' : 'NIK'
    prevDataPustakawan.username = nip !== 'null' ? nip : nik

    imgData.imgURL = gambar_users
    prevDataPustakawan.imgURL = gambar_users
    dataInputNamaKolom.imgURL = gambar_users
    if (nip == 'null') {
        dataInputNamaKolom.nik = nik
    } else if (nik == 'null') {
        dataInputNamaKolom.nip = nip
    }
    dataInputNamaKolom.namaLengkap = nama_users
    dataInputNamaKolom.tempatLahir = Tempat_Lahir
    dataInputNamaKolom.tanggalLahir = Tanggal_Lahir
    dataInputNamaKolom.jenisKelamin = jenis_kelamin
    dataInputNamaKolom.nomorHP = no_hp
    dataInputNamaKolom.email = email
    dataInputNamaKolom.pendidikanTerakhir = pendidikan
    dataInputNamaKolom.jurusanBidangPendidikan = jurusan_bidangpendidikan
    dataInputNamaKolom.pangkat = pangkat
    dataInputNamaKolom.statusDinas = status_dinas
    dataInputNamaKolom.instansi = istansi
    dataInputNamaKolom.lokasi_instansi = lokasi_instansi
    dataInputNamaKolom.jenis_instansi = jenis_instansi
    dataInputNamaKolom.diklatFungsionalPustakawan = diklat
    dataInputNamaKolom.pekerjaan = pekerjaan
    dataInputNamaKolom.status = status

    setUpdtDataDiklat(data_diklat)
    setUpdtDataOrganisasi(organisasi)

    inputLampiranData.skKenaikanPangkatTerakhir = sk_pangkat
    prevDataPustakawan.sk_pangkat = sk_pangkat
    dataKeteranganTambahan = catatan

    prevDataPustakawan.nama_users = nama_users
    prevDataPustakawan.email = email
    prevDataPustakawan.no_hp = no_hp

    setUpdtToFormHTML()
}

function setUpdtDataDiklat(text) {
    if (text.includes(';')) {
        const arrText = text.split(';')
        arrText.forEach(item => {
            inputDataAddDiklat.namaDiklat = item.split(',')[0]
            inputDataAddDiklat.tahunDiklat = item.split(',')[1]
            inputDataAddDiklat.jumlahJamPelatihan = item.split(',')[2]
            prevDataDiklat.push(inputDataAddDiklat)
            inputDataAddDiklat = {
                namaDiklat: '',
                tahunDiklat: '',
                jumlahJamPelatihan: ''
            }
        })
    } else {
        inputDataAddDiklat.namaDiklat = text.split(',')[0]
        inputDataAddDiklat.tahunDiklat = text.split(',')[1]
        inputDataAddDiklat.jumlahJamPelatihan = text.split(',')[2]
        prevDataDiklat.push(inputDataAddDiklat)
        inputDataAddDiklat = {
            namaDiklat: '',
            tahunDiklat: '',
            jumlahJamPelatihan: ''
        }
    }
}

function setUpdtDataOrganisasi(text) {
    if (text.includes(';')) {
        const arrText = text.split(';')
        arrText.forEach(item => {
            inputDataOrganisasi.namaOrganisasi = item.split(',')[0]
            inputDataOrganisasi.jabatanOrganisasi = item.split(',')[1]
            prevDataOrganisasi.push(inputDataOrganisasi)
            inputDataOrganisasi = {
                namaOrganisasi: '',
                jabatanOrganisasi: ''
            }
        })
    } else {
        inputDataOrganisasi.namaOrganisasi = text.split(',')[0]
        inputDataOrganisasi.jabatanOrganisasi = text.split(',')[1]
        prevDataOrganisasi.push(inputDataOrganisasi)
        inputDataOrganisasi = {
            namaOrganisasi: '',
            jabatanOrganisasi: ''
        }
    }
}

function setUpdtToFormHTML() {
    const {
        namaLengkap,
        imgURL,
        nip,
        nik,
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
        jenis_instansi,
        diklatFungsionalPustakawan,
    } = dataInputNamaKolom

    document.getElementById('titleUserName').innerText = namaLengkap
    document.getElementById('clientImg').src = imgURL
    if (`${nip}` !== 'null') {
        setUpdateInputForm('nip', nip)
    }
    if (`${nik}` !== 'null') {
        setUpdateInputForm('nip', nik)
    }
    const splitTglLahir = tanggalLahir.split('-')
    const newTglLahir = `${splitTglLahir[1]}-${splitTglLahir[2]}-${splitTglLahir[0]}`
    setUpdateInputForm('namaLengkap', namaLengkap)
    setUpdateInputForm('tempatLahir', tempatLahir)
    setUpdateInputForm('tanggalLahir', newTglLahir)
    setUpdateInputForm('nomorHp', nomorHP)
    setUpdateInputForm('email', email)
    setUpdtOptions(0, nip !== null ? 'NIP' : 'NIK')
    setUpdtOptions(1, jenisKelamin)
    setUpdtOptions(2, pendidikanTerakhir)
    setUpdtOptions(3, jurusanBidangPendidikan)
    setUpdtOptions(4, pangkat)
    setUpdtOptions(5, statusDinas)
    setTimeout(() => {
        setUpdtOptions(6, instansi)
    }, 1500);
    setUpdtOptions(7, lokasi_instansi)
    setUpdtOptions(8, jenis_instansi)
    setUpdtOptions(9, diklatFungsionalPustakawan)

    prevDataDiklat.forEach(item => {
        inputDataAddDiklat.namaDiklat = item.namaDiklat
        inputDataAddDiklat.tahunDiklat = item.tahunDiklat
        inputDataAddDiklat.jumlahJamPelatihan = item.jumlahJamPelatihan
        prosesTambahDiklat()
    })

    prevDataOrganisasi.forEach(item => {
        inputDataOrganisasi.namaOrganisasi = item.namaOrganisasi
        inputDataOrganisasi.jabatanOrganisasi = item.jabatanOrganisasi
        prosesTambahOrganisasi()
    })

    document.getElementById('btnPrevFile').setAttribute('href', inputLampiranData.skKenaikanPangkatTerakhir)
    setUpdateInputForm('keteranganTambahan', dataKeteranganTambahan)
}

function setUpdateInputForm(elementId, value) {
    document.getElementById(elementId).value = value
}

function setUpdtOptions(idxElem, value) {
    const elem = document.getElementsByClassName('dropdown-menu inner selectpicker')[idxElem]
    const buttonName = document.getElementsByClassName('filter-option pull-left')[idxElem]
    const selectpicker = document.getElementsByClassName('selectpicker form-control')[idxElem]
    let optInstansiActive = true
    let currentIdxInstansi = null
    if (elem) {
        const childrens = elem.children
        childrens[0].removeAttribute('class')
        for (let i = 0; i < childrens.length; i++) {
            const thisValue = childrens[i].lastElementChild.firstElementChild.innerText
            if (thisValue == value) {
                if(idxElem === 6){
                    currentIdxInstansi = i
                }
                childrens[i].setAttribute('class', 'selected active')
                optInstansiActive = true
            }
        }

        if(idxElem === 6 && currentIdxInstansi === null){
            document.getElementById('checkboxInstansi').click()
            setUpdateInputForm('textInstansi', value)
            optInstansiActive = false
            dataInputNamaKolom.instansi = value
        }

        if(optInstansiActive){
            if (buttonName) {
                buttonName.innerText = value
            }
            if (selectpicker) {
                selectpicker.value = value
            }
        }
    }
}