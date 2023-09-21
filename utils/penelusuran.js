// regex
const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const phoneRegex = /[^0-9.]/g

// email services
const serviceID = 'service_n6ulit7'
const templateID = 'template_ji9i1zk'
const publicKey = 'fvB99jFfi8z5-c4X-'

function setStyleSelect() {
    const elem = document.getElementsByClassName('bootstrap-select')
    if (elem) {
        for (let i = 0; i < elem.length; i++) {
            elem[i].style.width = '100%'
        }
    }
}

const instansiData = {
    instansi1: {
        id: 'instansi1',
        data: [
            {
                data_tokens: 'pemerintah',
                value: 'Pemerintah'
            },
            {
                data_tokens: 'swasta',
                value: 'Swasta'
            },
        ]
    },
    instansi2: {
        id: 'instansi2',
        data: [
            {
                data_tokens: 'jabatan',
                value: 'Jabatan'
            },
            {
                data_tokens: 'pustakawan-terampil-asisten-perpustakaan-terampil',
                value: 'Pustakawan Terampil / Asisten Perpustakaan'
            },
            {
                data_tokens: 'pustakawan-mahir-asisten-perpustakaan-mahir',
                value: 'Pustakawan Mahir / Asisten Perpustakaan Mahir'
            },
            {
                data_tokens: 'pustakawan-penyelia-asisten-perpustakaan-penyelia',
                value: 'Pustakawan Penyelia / Asisten Perpustakaan Penyelia'
            },
            {
                data_tokens: 'pustakawan-ahli-pertama',
                value: 'Pustakawan Ahli Pertama'
            },
            {
                data_tokens: 'pustakawan-ahli-muda',
                value: 'Pustakawan Ahli Muda'
            },
            {
                data_tokens: 'pustakawan-ahli-utama',
                value: 'Pustakawan Ahli Utama'
            },
            {
                data_tokens: 'pustakawan-tingkat-terampil',
                value: 'Pustakawan Tingkat Terampil'
            },
            {
                data_tokens: 'pustakawan-tingkat-ahli',
                value: 'Pustakawan Tingkat Ahli'
            },
        ]
    },
    instansi3: {
        id: 'instansi3',
        data: [
            {
                data_tokens: 'pendidikan',
                value: 'Pendidikan'
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
    }
}

const perpustakaanData = {
    perpus1: {
        id: 'perpus1',
        data: [
            {
                data_tokens: 'pustakawan',
                value: 'Pustakawan'
            },
            {
                data_tokens: 'tenaga-perpustakaan',
                value: 'Tenaga Perpustakaan'
            }
        ]
    },
    perpus2: {
        id: 'perpus2',
        data: [
            {
                data_tokens: 'pangkat',
                value: 'Pangkat'
            },
            {
                data_tokens: 'pengatur-muda-tk.l-(ll/b)',
                value: 'Pengatur Muda Tk.l (ll/b)'
            },
            {
                data_tokens: 'pengatur-(ll/c)',
                value: 'Pengatur (ll/c)'
            },
            {
                data_tokens: 'pengatur-tk.l-(ll/d)',
                value: 'Pengatur Tk.l (ll/d)'
            },
            {
                data_tokens: 'penata-muda-(lll/a)',
                value: 'Penata Muda (lll/a)'
            },
            {
                data_tokens: 'penata-muda-tk.l-(lll/b)',
                value: 'Penata Muda Tk.l (lll/b)'
            },
            {
                data_tokens: 'penata-(lll/c)',
                value: 'Penata (lll/c)'
            },
            {
                data_tokens: 'penata-tk.l-(lll/d)',
                value: 'Penata Tk.l (lll/d)'
            },
            {
                data_tokens: 'pembina-(IV/a)',
                value: 'Pembina (IV/a)'
            },
            {
                data_tokens: 'pembina-tk.l-(IV/b)',
                value: 'Pembina Tk.l (IV/b)'
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
                data_tokens: 'pengatur-muda-(ll/a)',
                value: 'Pengatur Muda (ll/a)'
            },
        ]
    },
    perpus3: {
        id: 'perpus3',
        data: [
            {
                data_tokens: 'bidang',
                value: 'Bidang'
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
                data_tokens: 'pustakawan-disetarakan',
                value: 'Pustakawan Disetarakan'
            },
        ]
    },
    perpus4: {
        id: 'perpus4',
        data: [
            {
                data_tokens: 'aktif',
                value: 'AKTIF'
            },
            {
                data_tokens: 'dbs',
                value: 'DBS'
            },
        ]
    },
    perpus5: {
        id: 'perpus5',
        data: [
            {
                data_tokens: 'jenis-perpustakaan',
                value: 'Jenis Perpustakaan'
            },
            {
                data_tokens: 'perpustakaan-nasional-ri-(pnri)',
                value: 'Perpustakaan Nasional RI (PNRI)'
            },
            {
                data_tokens: 'perpustakaan-umum-(provinsi)-(provinsi)',
                value: 'Perpustakaan Umum (Provinsi) (Provinsi)'
            },
            {
                data_tokens: 'perpustakaan-umum-(kab/kota)-(kab/kota)',
                value: 'Perpustakaan Umum (Kab/Kota) (Kab/Kota)'
            },
            {
                data_tokens: 'perpustakaan-khusus-(pk)',
                value: 'Perpustakaan Khusus (PK)'
            },
            {
                data_tokens: 'perpustakaan-perguruan-tinggi-(ppt)',
                value: 'Perpustakaan Perguruan Tinggi (PPT)'
            },
            {
                data_tokens: 'perpustakaan-sekolah-(sd)-(ps-sd)',
                value: 'Perpustakaan Sekolah (SD) (PS SD)'
            },
            {
                data_tokens: 'perpustakaan-sekolah-(sltp)-(ps-sltp)',
                value: 'Perpustakaan Sekolah (SLTP) (PS SLTP)'
            },
            {
                data_tokens: 'perpustakaan-sekolah-(slta)-(ps-slta)',
                value: 'Perpustakaan Sekolah (SLTA) (PS SLTA)'
            },
            {
                data_tokens: 'perpustakaan-komunitas-(pkom)',
                value: 'Perpustakaan Komunitas (PKom)'
            },
            {
                data_tokens: 'perpustakaan-umum-(kelurahan/desa)-(kelurahan/desa)',
                value: 'Perpustakaan Umum (Kelurahan/Desa) (Kelurahan/Desa)'
            },
            {
                data_tokens: 'perpustakaan-umum-(kecamatan)-(kecamatan)',
                value: 'Perpustakaan Umum (kecamatan) (kecamatan)'
            },
        ]
    }
}

const pengajuanUpdateData = {
    pilihUpdate1: {
        id: 'pilihUpdate1',
        data: [
            {
                data_tokens: 'pangkat',
                value: 'Pangkat'
            },
            {
                data_tokens: 'pengatur-muda-tk.l-(ll/b)',
                value: 'Pengatur Muda Tk.l (ll/b)'
            },
            {
                data_tokens: 'pengatur-(ll/c)',
                value: 'Pengatur (ll/c)'
            },
            {
                data_tokens: 'pengatur-tk.l-(ll/d)',
                value: 'Pengatur Tk.l (ll/d)'
            },
            {
                data_tokens: 'penata-muda-(lll/a)',
                value: 'Penata Muda (lll/a)'
            },
            {
                data_tokens: 'penata-muda-tk.l-(lll/b)',
                value: 'Penata Muda Tk.l (lll/b)'
            },
            {
                data_tokens: 'penata-(lll/c)',
                value: 'Penata (lll/c)'
            },
            {
                data_tokens: 'penata-tk.l-(lll/d)',
                value: 'Penata Tk.l (lll/d)'
            },
            {
                data_tokens: 'pembina-(IV/a)',
                value: 'Pembina (IV/a)'
            },
            {
                data_tokens: 'pembina-tk.l-(IV/b)',
                value: 'Pembina Tk.l (IV/b)'
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
                data_tokens: 'pengatur-muda-(ll/a)',
                value: 'Pengatur Muda (ll/a)'
            },
        ]
    },
    pilihUpdate2: {
        id: 'pilihUpdate2',
        data: [
            {
                data_tokens: 'jabatan',
                value: 'Jabatan'
            },
            {
                data_tokens: 'pustakawan-terampil-asisten-perpustakaan-terampil',
                value: 'Pustakawan Terampil / Asisten Perpustakaan'
            },
            {
                data_tokens: 'pustakawan-mahir-asisten-perpustakaan-mahir',
                value: 'Pustakawan Mahir / Asisten Perpustakaan Mahir'
            },
            {
                data_tokens: 'pustakawan-penyelia-asisten-perpustakaan-penyelia',
                value: 'Pustakawan Penyelia / Asisten Perpustakaan Penyelia'
            },
            {
                data_tokens: 'pustakawan-ahli-pertama',
                value: 'Pustakawan Ahli Pertama'
            },
            {
                data_tokens: 'pustakawan-ahli-muda',
                value: 'Pustakawan Ahli Muda'
            },
            {
                data_tokens: 'pustakawan-ahli-utama',
                value: 'Pustakawan Ahli Utama'
            },
            {
                data_tokens: 'pustakawan-tingkat-terampil',
                value: 'Pustakawan Tingkat Terampil'
            },
            {
                data_tokens: 'pustakawan-tingkat-ahli',
                value: 'Pustakawan Tingkat Ahli'
            },
        ]
    },
    pilihUpdate3: {
        id: 'pilihUpdate3',
        data: [
            {
                data_tokens: 'bidang',
                value: 'Bidang'
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
                data_tokens: 'pustakawan-disetarakan',
                value: 'Pustakawan Disetarakan'
            },
        ]
    },
    pilihUpdate4: {
        id: 'pilihUpdate4',
        data: [
            {
                data_tokens: 'pendidikan',
                value: 'Pendidikan'
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
    pilihUpdate5: {
        id: 'pilihUpdate5',
        data: [
            {
                data_tokens: 'aktif',
                value: 'AKTIF'
            },
            {
                data_tokens: 'dbs',
                value: 'DBS'
            },
        ]
    }
}

// API wilayah indonesia
const provinsiAPI = 'https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json'

// provinsi API
async function getProvinsiAPI() {
    try {
        const fetchData = await fetch(provinsiAPI)
        const data = await fetchData.json()
        return data
    } catch (error) {
        return error
    }
}

// kab/kota API
async function getKabOrKotaAPI(daerahId, provinsiId) {
    try {
        const fetchData = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/${daerahId}/${provinsiId}.json`)
        const data = await fetchData.json()
        return data
    } catch (error) {
        return error
    }
}

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

function setOptionElement() {
    // instansi
    Object.entries(instansiData).forEach((item, index) => loadCreateSelect(item[1].id, item[1].data))
    // provinsi API
    const loadingElem = document.getElementById('loadingWilayah')
    if (loadingElem) {
        loadingElem.style.display = 'flex'
    }
    getProvinsiAPI()
        .then(res => {
            if (res?.length > 0) {
                const data = res.map(provinsi => ({
                    data_tokens: provinsi.id,
                    value: provinsi.name
                }))
                loadCreateSelect('instansi4', data)
                removeDropdownMenu(8)
                const newData = [
                    {
                        data_tokens: 'provinsi',
                        value: 'Provinsi'
                    },
                    ...data
                ]
                setTimeout(() => {
                    createMenuDropdown(newData, 8, 'provinsi')
                    loadingElem.style.display = 'none'
                }, 500);
                return data
            }
        })
        .catch(err => {
            console.log('error', err)
        })
    // tenaga perpustakaan
    Object.entries(perpustakaanData).forEach((item, index) => loadCreateSelect(item[1].id, item[1].data))
    // pengajuan untuk update
    Object.entries(pengajuanUpdateData).forEach((item, index) => loadCreateSelect(item[1].id, item[1].data))
}

// load dan membuat menu select options
setOptionElement()

window.onload = () => {
    setStyleSelect()
}

const dataInputInstansi = {
    pemerintah: 'Pemerintah',
    nipNama: '',
    jabatan: '',
    pendidikan: '',
    namaInstansi: ''
}

const dataInputTenagaPerpus = {
    pustakawan: 'Pustakawan',
    pangkat: '',
    bidang: '',
    aktif: 'AKTIF',
    jenisPerpustakaan: ''
}

const dataWilayah = {
    provinsi: '',
    kabkota: '',
    kecamatan: '',
    kelurahan: '',
    rt: '',
    rw: ''
}

const tokensWilayah = {
    provinsi: null,
    kabkota: null,
    kecamatan: null,
    kelurahan: null
}

// get select value from wilayah
function onSelectWilayah(selectId, loadDataAPI, loadingId) {
    const elem = document.getElementById(selectId)
    const loadingElem = document.getElementById(loadingId)
    const btnText = document.getElementsByClassName('filter-option')
    if (elem) {
        const indexOption = elem.selectedIndex
        // dataset (tokens) options yang dipilih
        const tokens = elem.children[indexOption].dataset.tokens
        // const data_tokens = optionElem.getAttribute('data-tokens')
        const value = elem.options[elem.selectedIndex].value
        if (selectId === 'instansi4' && loadDataAPI === 'provinsi') {
            loadDataAPIAfterSelect(
                'instansi5',
                loadingElem,
                'regencies',
                9,
                tokens !== 'provinsi' ? tokens : 'no-select',
                9,
                {
                    data_tokens: 'kabkota',
                    value: 'Kab/Kota'
                },
                'kabkota'
            )
            dataWilayah.provinsi = value
            tokensWilayah.provinsi = tokens !== 'provinsi' ? tokens : null

            setManualNameBtn(9, 'Kab/Kota', 'kabkota')
            loadDataAPIAfterSelect(
                'instansi6',
                loadingElem,
                'districts',
                10,
                'no-select',
                10,
                {
                    data_tokens: 'kecamatan',
                    value: 'Kecamatan'
                },
                'kecamatan'
            )
            setManualNameBtn(10, 'Kecamatan', 'kecamatan')
            loadDataAPIAfterSelect(
                'instansi7',
                loadingElem,
                'villages',
                11,
                'no-select',
                11,
                {
                    data_tokens: 'kelurahan',
                    value: 'Kelurahan'
                },
                'kelurahan'
            )
            setManualNameBtn(11, 'Kelurahan', 'kelurahan')

            if (tokens === 'provinsi') {
                dataWilayah.provinsi = ''
                tokensWilayah.provinsi = null
            }
        } else if (selectId === 'instansi5' && loadDataAPI === 'kabupaten/kota') {
            loadDataAPIAfterSelect(
                'instansi6',
                loadingElem,
                'districts',
                10,
                tokens !== 'kabkota' ? tokens : 'no-select',
                10,
                {
                    data_tokens: 'kecamatan',
                    value: 'Kecamatan'
                },
                'kecamatan'
            )
            dataWilayah.kabkota = value
            tokensWilayah.kabkota = tokens !== 'kabkota' ? tokens : null

            setManualNameBtn(10, 'Kecamatan', 'kecamatan')
            loadDataAPIAfterSelect(
                'instansi7',
                loadingElem,
                'villages',
                11,
                'no-select',
                11,
                {
                    data_tokens: 'kelurahan',
                    value: 'Kelurahan'
                },
                'kelurahan'
            )
            setManualNameBtn(11, 'Kelurahan', 'kelurahan')

            if (tokens === 'kabkota') {
                dataWilayah.kabkota = ''
                tokensWilayah.kabkota = null
            }
        } else if (selectId === 'instansi6' && loadDataAPI === 'kecamatan') {
            loadDataAPIAfterSelect(
                'instansi7',
                loadingElem,
                'villages',
                11,
                tokens !== 'kecamatan' ? tokens : 'no-select',
                11,
                {
                    data_tokens: 'kelurahan',
                    value: 'Kelurahan'
                },
                'kelurahan'
            )
            dataWilayah.kecamatan = value
            tokensWilayah.kecamatan = tokens !== 'kecamatan' ? tokens : null

            setManualNameBtn(11, 'Kelurahan', 'kelurahan')

            if (tokens === 'kecamatan') {
                dataWilayah.kecamatan = ''
                tokensWilayah.kecamatan = null
            }
        } else if (selectId === 'instansi7' && loadDataAPI === 'kelurahan') {
            dataWilayah.kelurahan = value === 'Kelurahan' ? '' : value
            tokensWilayah.kelurahan = tokens !== 'kelurahan' ? tokens : null
        }
    }
}

function loadDataAPIAfterSelect(
    instansiId,
    loadingElem,
    daerahId,
    indexRemoveDropdownMenu,
    tokens,
    indexElement,
    defaultDataOpt,
    daerah
) {
    removeOptions(instansiId)
    removeDropdownMenu(indexRemoveDropdownMenu)
    if (tokens !== 'no-select') {
        loadingElem.style.display = 'flex'
        getKabOrKotaAPI(daerahId, tokens)
            .then(res => {
                const data = res.map(provinsi => ({
                    data_tokens: provinsi.id,
                    value: provinsi.name
                }))
                const newData = [
                    defaultDataOpt,
                    ...data
                ]
                setTimeout(() => {
                    createMenuDropdown(newData, indexElement, daerah)
                    loadCreateSelect(instansiId, newData)
                    loadingElem.style.display = 'none'
                }, 500)
            })
            .catch(err => {
                console.log(err)
            })
    } else {
        const defaultOption = [
            defaultDataOpt
        ]
        setTimeout(() => {
            loadCreateSelect(instansiId, defaultOption)
            createMenuDropdown(defaultOption, indexElement, daerah)
        }, 500);
    }
}

// remove options
function removeOptions(elementId) {
    var select = document.getElementById(elementId)
    var children = select.lastElementChild
    while (children) {
        select.removeChild(children)
        children = select.lastElementChild
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
function createMenuDropdown(data, indexElement, daerah) {
    const elem = document.getElementsByClassName('dropdown-menu inner selectpicker')

    if (elem && data.length > 0) {
        currentDataMenu = data
        indexElementDropdown = indexElement
        const instansi = elem[indexElement]
        wrapBtnGroup = document.getElementsByClassName('btn-group bootstrap-select')
        wrapBtnGroup = wrapBtnGroup[indexElement]
        searchElem = document.getElementsByClassName('input-block-level form-control')
        searchElem = searchElem[indexElement]
        searchElem?.setAttribute('onkeydown', 'clickSearch()')
        btnDropdown = document.getElementsByClassName('btn dropdown-toggle selectpicker btn-default')
        btnDropdown = btnDropdown[indexElement]
        btnDropdown?.setAttribute('onclick', `clickBtnDropdown(${indexElement}, '${daerah}')`)

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

// set manual nama btn wilayah
function setManualNameBtn(indexElem, text, nameInput) {
    let elem = document.getElementsByClassName('filter-option pull-left')
    if (elem?.length > 0) {
        elem[indexElem].innerText = text
        dataWilayah[nameInput] = ''
        tokensWilayah[nameInput] = null
    }
}

function clickSearch(daerah) {
    loadSearchDataDropdown(indexElementDropdown, searchElem.value, searchElem, daerah)
}

function loadSearchDataDropdown(
    indexElement,
    inputValue,
    event,
    daerah
) {
    const elem = document.getElementsByClassName('dropdown-menu inner selectpicker')
    // event.addEventListener('keyup', (e) => {
    //     if (e?.code === 'Enter') {
    //         console.log('sukses')
    //     }
    // })
    if (currentDataMenu?.length > 0) {
        const instansi = elem[indexElement]
        const childList = instansi.children
        currentDataMenu.forEach((_, index) => {
            const textItem = childList[index]?.innerText
            if (childList[index] && inputValue.length > 0) {
                childList[index].setAttribute('class', 'hide')
                const checkItem =
                    textItem?.toLowerCase()?.includes(inputValue.toLowerCase()) ||
                    textItem?.includes(inputValue)
                if (checkItem) {
                    childList[index].setAttribute('class', '')
                }
            } else if (childList[index]) {
                childList[index].removeAttribute('class')
                if (!dataWilayah[daerah]) {
                    childList[0].setAttribute('class', 'selected active')
                }
                if (daerah && dataWilayah[daerah].length > 0) {
                    const checkItem =
                        textItem?.toLowerCase() == dataWilayah[daerah].toLowerCase() ||
                        textItem == dataWilayah[daerah]
                    if (checkItem) {
                        childList[index].setAttribute('class', 'selected active')
                    }
                }
            }
        })
    }
}

function clickBtnDropdown(indexElement, daerah) {
    indexElementDropdown = indexElement
    searchElem = document.getElementsByClassName('input-block-level form-control')
    setTimeout(() => {
        searchElem = searchElem[indexElement]
        searchElem.setAttribute('onkeydown', `clickSearch('${daerah}')`)
    }, 0)
    const loadingElem = document.getElementById('loadingWilayah')
    if (daerah === 'provinsi') {
        if (loadingElem) {
            loadingElem.style.display = 'flex'
        }

        getProvinsiAPI()
            .then(res => {
                const data = res.map(provinsi => ({
                    data_tokens: provinsi.id,
                    value: provinsi.name
                }))
                const newData = [
                    {
                        data_tokens: 'provinsi',
                        value: 'Provinsi'
                    },
                    ...data
                ]
                currentDataMenu = newData
                clickSearch(daerah)
                loadingElem.style.display = 'none'
            })
            .catch(err => console.log(err))
    } else if (daerah === 'kabkota') {
        if (tokensWilayah.provinsi) {
            resetCurrentData('regencies', tokensWilayah.provinsi, {
                data_tokens: 'kabkota',
                value: 'Kab/Kota'
            }, daerah)
        } else {
            setTimeout(() => {
                loadSearchDataDropdown(indexElementDropdown, searchElem.value, searchElem, daerah)
            }, 0)
        }
    } else if (daerah === 'kecamatan' && tokensWilayah.kabkota) {
        resetCurrentData('districts', tokensWilayah.kabkota, {
            data_tokens: 'kecamatan',
            value: 'Kecamatan'
        }, daerah)
    } else if (daerah === 'kelurahan' && tokensWilayah.kecamatan) {
        resetCurrentData('villages', tokensWilayah.kecamatan, {
            data_tokens: 'kelurahan',
            value: 'Kelurahan'
        }, daerah)
    }
}

function resetCurrentData(wilayahId, tokens, defaultDataOpt, daerah) {
    const loadingElem = document.getElementById('loadingWilayah')
    if (loadingElem) {
        loadingElem.style.display = 'flex'
    }

    getKabOrKotaAPI(wilayahId, tokens)
        .then(res => {
            const data = res.map(provinsi => ({
                data_tokens: provinsi.id,
                value: provinsi.name
            }))
            const newData = [
                defaultDataOpt,
                ...data
            ]
            currentDataMenu = newData
            clickSearch(daerah)
            loadingElem.style.display = 'none'
        })
        .catch(err => console.log(err))
}

const dataInputUpdate = {
    nipNama: '',
    pangkat: '',
    tamatPangkat: '',
    jabatan: '',
    tamatJabatan: '',
    bidang: '',
    pendidikan: '',
    statusJabatan: 'AKTIF',
    namaInstansi: ''
}

const dataPengirim = {
    nama: '',
    email: '',
    telp: ''
}

// change input text
function changeInputTxt(elemId, nameInput, formName) {
    const elem = document.getElementById(elemId)
    if (formName === 'INSTANSI') {
        dataInputInstansi[nameInput] = elem.value
    } else if (formName === 'WILAYAH') {
        dataWilayah[nameInput] = elem.value
    } else if (formName === 'PENGAJUAN-UPDATE') {
        dataInputUpdate[nameInput] = elem.value
    } else if (formName === 'DATA-PENGIRIM') {
        dataPengirim[nameInput] = elem.value
    }
}

function onSelectGroup(selectId, nameInput, actionType) {
    const elem = document.getElementById(selectId)
    if (elem) {
        const indexOption = elem.selectedIndex
        // dataset (tokens) options yang dipilih
        const tokens = elem.children[indexOption].dataset.tokens
        const value = elem.options[elem.selectedIndex].value
        if (actionType == 'INSTANSI') {
            dataInputInstansi[nameInput] = value
        } else if (actionType == 'TENAGA-PERPUS') {
            dataInputTenagaPerpus[nameInput] = value
        } else if (actionType == 'PENGAJUAN-UPDATE') {
            dataInputUpdate[nameInput] = value
        }
    }
}

$(function () {
    $("#tamatPangkatDP").datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date());
});
$(function () {
    $("#tamatJabatanDP").datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date());
});

function isCaptchaChecked() {
    return grecaptcha && grecaptcha.getResponse().length !== 0
}

function validateCaptcha() {
    const elem = document.getElementById('errCaptcha')
    if (!isCaptchaChecked() && elem) {
        elem.innerText = 'Mohon ceklis cekbox'
        return
    } else {
        elem.innerText = ''
        return 'sukses'
    }
}

function clickSubmit() {
    dataInputUpdate.tamatPangkat = document.getElementById('tamatPangkat').value
    dataInputUpdate.tamatJabatan = document.getElementById('tamatJabatan').value
    const {
        provinsi,
        kabkota,
        kecamatan,
        kelurahan
    } = dataWilayah
    const result = document.getElementById('result')
    var wrapList = document.createElement('ul')
    var list = document.createElement('li')
    list.textContent = `provinsi:${provinsi}, kabkota:${kabkota}, kecamatan:${kecamatan}, kelurahan:${kelurahan}`
    wrapList.appendChild(list)
    let resultCaptcha
    if (!validateCaptcha()) {
        resultCaptcha
    } else {
        resultCaptcha = true
    }
    validateForm()
        .then(res => {
            let value
            res.forEach(item => {
                if (item == undefined) {
                    value = 'failed'
                }
            })
            return value
        })
        .then(res => {
            if (res !== 'failed' && resultCaptcha) {
                result.appendChild(wrapList)
                sendToEmail()
                console.log('instansi', dataInputInstansi)
                console.log('tenaga perpus', dataInputTenagaPerpus)
                console.log('wilayah', dataWilayah)
                console.log('pengajuan update', dataInputUpdate)
                console.log('data-pengirim', dataPengirim)
            }
        })
}

async function validateForm() {
    return await Promise.all([
        validateFormInstansi(),
        validateFormTenagaPerpus(),
        validateFormWilayah(),
        validatePengajuanUpdt(),
        validateDataPengirim()
    ])
}

// data untuk kirim ke email
function sendDataToMail() {
    const { nama, email, telp } = dataPengirim
    const {
        pemerintah,
        nipNama,
        jabatan,
        pendidikan,
        namaInstansi
    } = dataInputInstansi
    const {
        pustakawan,
        pangkat,
        bidang,
        aktif,
        jenisPerpustakaan
    } = dataInputTenagaPerpus
    const {
        provinsi,
        kabkota,
        kecamatan,
        kelurahan,
        rt,
        rw
    } = dataWilayah
    const {
        nipNama: u_nipNama,
        pangkat: u_pangkat,
        tamatPangkat,
        jabatan: u_jabatan,
        tamatJabatan,
        bidang: u_bidang,
        pendidikan: u_pendidikan,
        statusJabatan,
        namaInstansi: u_namaInstansi
    } = dataInputUpdate
    const frontData = {
        from_name: nama,
        from_email: email
    }
    const dataInstansi = {
        pemerintah,
        nip_nama: nipNama,
        jabatan,
        pendidikan,
        nama_instansi: namaInstansi
    }
    const dataTenagaPerpus = {
        pustakawan,
        pangkat,
        bidang,
        status_jabatan: aktif,
        jenis_perpustakaan: jenisPerpustakaan
    }
    const wilayah = {
        provinsi,
        kabkota,
        kecamatan,
        kelurahan,
        rt,
        rw
    }
    const dataUpdate = {
        u_nama: u_nipNama,
        u_pangkat: u_pangkat,
        u_tamat_pangkat: tamatPangkat,
        u_jabatan,
        u_tamat_jabatan: tamatJabatan,
        u_bidang,
        u_pendidikan,
        u_status_jabatan: statusJabatan,
        u_nama_instansi: u_namaInstansi
    }
    const dataPengirim = {
        client_name: nama,
        client_email: email,
        client_phone: telp
    }
    const data = {
        ...frontData,
        ...dataInstansi,
        ...dataTenagaPerpus,
        ...wilayah,
        ...dataUpdate,
        ...dataPengirim
    }
    return data
}

// kirim ke email
function sendToEmail(){
    emailjs.send(
        serviceID,
        templateID,
        sendDataToMail(),
        publicKey
    )
    .then(res=>{
        alert('Data Anda telah terkirim\nData ini akan kami proses')
        setTimeout(() => {
            window.location.reload()
        }, 0)
    }, (err)=>console.log('emailjs-error', err))
}

const errText = 'Mohon di isi!'

// validate instansi
function validateFormInstansi() {
    let errInstansi = {}
    errInstansi = {}
    const {
        pemerintah,
        nipNama,
        jabatan,
        pendidikan,
        namaInstansi
    } = dataInputInstansi
    if (!pemerintah.trim()) {
        errInstansi.errInstansi1 = errText
    }
    if (!nipNama.trim()) {
        errInstansi.errInstansi2 = errText
    }
    if (!jabatan || jabatan == 'Jabatan') {
        errInstansi.errInstansi3 = errText
    }
    if (!pendidikan || pendidikan == 'Pendidikan') {
        errInstansi.errInstansi4 = errText
    }
    if (!namaInstansi.trim()) {
        errInstansi.errInstansi5 = errText
    }
    resetErr(5, 'errInstansi')
    if (Object.keys(errInstansi).length > 0) {
        setErrForm(errInstansi)
        return
    }
    return 'success'
}

// validate tenaga perpus
function validateFormTenagaPerpus() {
    let errTenagaPerpus = {}
    errTenagaPerpus = {}
    const {
        pustakawan,
        pangkat,
        bidang,
        aktif,
        jenisPerpustakaan
    } = dataInputTenagaPerpus
    if (!pustakawan.trim()) {
        errTenagaPerpus.errPerpus1 = errText
    }
    if (!pangkat || pangkat == 'Pangkat') {
        errTenagaPerpus.errPerpus2 = errText
    }
    if (!bidang || bidang == 'Bidang') {
        errTenagaPerpus.errPerpus3 = errText
    }
    if (!aktif.trim()) {
        errTenagaPerpus.errPerpus4 = errText
    }
    if (!jenisPerpustakaan || jenisPerpustakaan == 'Jenis Perpustakaan') {
        errTenagaPerpus.errPerpus5 = errText
    }
    resetErr(5, 'errPerpus')
    if (Object.keys(errTenagaPerpus).length > 0) {
        setErrForm(errTenagaPerpus)
        return
    }
    return 'success'
}

// validate wilayah
function validateFormWilayah() {
    let errWilayah = {}
    errWilayah = {}
    const {
        provinsi,
        kabkota,
        kecamatan,
        kelurahan,
        rt,
        rw
    } = dataWilayah
    if (!provinsi || provinsi == 'Provinsi') {
        errWilayah.errWilayah1 = errText
    }
    if (!kabkota || kabkota == 'Kab/Kota') {
        errWilayah.errWilayah2 = errText
    }
    if (!kecamatan || kecamatan == 'Kecamatan') {
        errWilayah.errWilayah3 = errText
    }
    if (!kelurahan || kelurahan == 'Kelurahan') {
        errWilayah.errWilayah4 = errText
    }
    if (!rt.trim()) {
        errWilayah.errWilayah5 = errText
    }
    if (!rw.trim()) {
        errWilayah.errWilayah6 = errText
    }
    resetErr(6, 'errWilayah')
    if (Object.keys(errWilayah).length > 0) {
        setErrForm(errWilayah)
        return
    }
    return 'success'
}

// validate pengajuan update
function validatePengajuanUpdt() {
    let err = {}
    err = {}
    const {
        nipNama,
        pangkat,
        tamatPangkat,
        jabatan,
        tamatJabatan,
        bidang,
        pendidikan,
        statusJabatan,
        namaInstansi
    } = dataInputUpdate
    if (!nipNama.trim()) {
        err.errUpdate1 = errText
    }
    if (!pangkat.trim()) {
        err.errUpdate2 = errText
    }
    if (!tamatPangkat.trim()) {
        err.errUpdate3 = errText
    }
    if (!jabatan || jabatan == 'Jabatan') {
        err.errUpdate4 = errText
    }
    if (!tamatJabatan.trim()) {
        err.errUpdate5 = errText
    }
    if (!bidang || bidang == 'Bidang') {
        err.errUpdate6 = errText
    }
    if (!pendidikan || pendidikan == 'Pendidikan') {
        err.errUpdate7 = errText
    }
    if (!statusJabatan.trim()) {
        err.errUpdate8 = errText
    }
    if (!namaInstansi.trim()) {
        err.errUpdate9 = errText
    }
    resetErr(9, 'errUpdate')
    if (Object.keys(err).length > 0) {
        setErrForm(err)
        return
    }
    return 'success'
}

// validate data pengirm
function validateDataPengirim() {
    let err = {}
    err = {}
    const {
        nama,
        email,
        telp
    } = dataPengirim
    if (!nama.trim()) {
        err.errDataP1 = errText
    }
    if (!email.trim()) {
        err.errDataP2 = errText
    } else if (!mailRegex.test(email)) {
        err.errDataP2 = 'Alamat email tidak valid!'
    }
    if (!telp.trim()) {
        err.errDataP3 = errText
    } else if (phoneRegex.test(telp)) {
        err.errDataP3 = 'Nomor telpon tidak valid!'
    }
    resetErr(3, 'errDataP')
    if (Object.keys(err).length > 0) {
        setErrForm(err)
        return
    }
    return 'success'
}

function resetErr(length, elemId) {
    for (let i = 0; i < length; i++) {
        let elem = document.getElementById(`${elemId}${i + 1}`)
        if (elem) elem.innerText = ''
    }
}

function setErrForm(data) {
    Object.entries(data).forEach(err => {
        let elem = document.getElementById(err[0])
        if (elem) elem.innerText = err[1]
    })
}