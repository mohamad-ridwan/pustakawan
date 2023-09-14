function setStyleSelect() {
    const elem = document.getElementsByClassName('bootstrap-select')
    if (elem) {
        for (let i = 0; i < elem.length; i++) {
            elem[i].style.width = '100%'
        }
    }
}

const instansiData = {
    instansi1: [
        {
            data_tokens: 'pemerintah',
            value: 'Pemerintah'
        },
        {
            data_tokens: 'swasta',
            value: 'Swasta'
        },
    ],
    instansi2: [
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
    ],
    instansi3: [
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

const perpustakaanData = {
    perpus1: [
        {
            data_tokens: 'pustakawan',
            value: 'Pustakawan'
        },
        {
            data_tokens: 'tenaga-perpustakaan',
            value: 'Tenaga Perpustakaan'
        }
    ],
    perpus2: [
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
    ],
    perpus3: [
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
    ],
    perpus4: [
        {
            data_tokens: 'aktif',
            value: 'AKTIF'
        },
        {
            data_tokens: 'dbs',
            value: 'DBS'
        },
    ],
    perpus5: [
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
    loadCreateSelect('instansi1', instansiData.instansi1)
    loadCreateSelect('instansi2', instansiData.instansi2)
    loadCreateSelect('instansi3', instansiData.instansi3)
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
                    createMenuDropdown(newData, 8)
                    loadingElem.style.display = 'none'
                }, 500);
                return data
            }
        })
        .catch(err => {
            console.log('error', err)
        })
    // tenaga perpustakaan
    loadCreateSelect('perpus1', perpustakaanData.perpus1)
    loadCreateSelect('perpus2', perpustakaanData.perpus2)
    loadCreateSelect('perpus3', perpustakaanData.perpus3)
    loadCreateSelect('perpus4', perpustakaanData.perpus4)
    loadCreateSelect('perpus5', perpustakaanData.perpus5)
}

// load dan membuat menu select options
setOptionElement()

window.onload = () => {
    setStyleSelect()
}

let dataWilayah = {}

// get select value
function onSelectInstansi(selectId, loadDataAPI, loadingId) {
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
            )
            dataWilayah.provinsi = value
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
            )
            dataWilayah.kabkota = value
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
            )
            dataWilayah.kecamatan = value
        } else if (selectId === 'instansi7' && loadDataAPI === 'kelurahan') {
            dataWilayah.kelurahan = value
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
    defaultDataOpt
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
                    createMenuDropdown(newData, indexElement)
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
            createMenuDropdown(defaultOption, indexElement)
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
        var children = currentElem.lastElementChild
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
function createMenuDropdown(data, indexElement) {
    const elem = document.getElementsByClassName('dropdown-menu inner selectpicker')

    if (elem && data.length > 0) {
        currentDataMenu = data
        indexElementDropdown = indexElement
        const instansi = elem[indexElement]
        wrapBtnGroup = document.getElementsByClassName('btn-group bootstrap-select')
        wrapBtnGroup = wrapBtnGroup[indexElement]
        searchElem = document.getElementsByClassName('input-block-level form-control')
        searchElem = searchElem[indexElement]
        searchElem.setAttribute('onkeydown', 'clickSearch()')
        btnDropdown = document.getElementsByClassName('btn dropdown-toggle selectpicker btn-default')
        btnDropdown = btnDropdown[indexElement]
        btnDropdown.setAttribute('onclick', `clickBtnDropdown(${indexElement})`)

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
            instansi.appendChild(li)
        })
    }
}

function clickSearch() {
    loadSearchDataDropdown(indexElementDropdown, searchElem.value, searchElem)
}

function loadSearchDataDropdown(
    indexElement,
    inputValue,
    event
) {
    const elem = document.getElementsByClassName('dropdown-menu inner selectpicker')
    event.addEventListener('keyup', (e) => {
        if (e?.code === 'Enter') {
            console.log('sukses')
        }
    })
    if (currentDataMenu?.length > 0) {
        const instansi = elem[indexElement]
        const childList = instansi.children
        currentDataMenu.forEach((_, index) => {
            const textItem = childList[index]?.innerText
            childList[index].setAttribute('class', 'hide')
            const checkItem =
                textItem?.toLowerCase()?.includes(inputValue.toLowerCase()) ||
                textItem?.includes(inputValue)
            if (checkItem) {
                childList[index].setAttribute('class', '')
            }
            if (inputValue.length === 0) {
                childList[0].setAttribute('class', 'selected active')
                childList[index].removeAttribute('class')
            }
        })
    }
}

function clickBtnDropdown(indexElement) {
    indexElementDropdown = indexElement
    searchElem = document.getElementsByClassName('input-block-level form-control')
    searchElem = searchElem[indexElement]
    searchElem.setAttribute('onkeydown', 'clickSearch()')
    clickSearch()
}

function clickSubmit() {
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
    result.appendChild(wrapList)
}