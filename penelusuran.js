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
async function getKabOrKotaAPI(provinsiId){
    try {
        const fetchData = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinsiId}.json`)
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
    loadCreateSelect('instansi1', instansiData.instansi1)
    loadCreateSelect('instansi2', instansiData.instansi2)
    loadCreateSelect('instansi3', instansiData.instansi3)
    // provinsi API
    const loadingElem = document.getElementById('loadingInstansi3')
    if(loadingElem){
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
            getKabOrKotaAPI(data[0].data_tokens)
            .then(res=>{
                const data = res.map(provinsi => ({
                    data_tokens: provinsi.id,
                    value: provinsi.name
                }))
                loadCreateSelect('instansi5', data)
            })
            .catch(err=>{
                console.log(err)
            })
            loadingElem.style.display = 'none'
        }
    })
    .catch(err => {
        console.log('error', err)
    })
}

setOptionElement()

window.onload = () => {
    setStyleSelect()
}

const rowLeft = document.getElementById('rowLeft')

// get select value
function onSelectInstansi(selectId, loadDataAPI, loadingId, onIdxOption){
    const elem = document.getElementById(selectId)
    const loadingElem = document.getElementById(loadingId)
    if(elem){
        const indexOption = elem.selectedIndex
        const optionElem = elem.childNodes[onIdxOption ?? indexOption]
        const data_tokens = optionElem.getAttribute('data-tokens')
        const value = elem.options[elem.selectedIndex].value
        if(data_tokens !== 'provinsi' && loadDataAPI === 'kabupaten/kota'){
            loadingElem.style.display = 'flex'
            getKabOrKotaAPI(data_tokens)
            .then(res=>{
                const data = res.map(provinsi => ({
                    data_tokens: provinsi.id,
                    value: provinsi.name
                }))
                loadCreateSelect('instansi5', data)
                loadingElem.style.display = 'none'
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }
}

// function createInstansi5HTML(){
//     var div = document.createElement('div')
//     div.setAttribute('class', 'wrap-input')
//     div.setAttribute('id', 'wrapInstansi5')
//     var select = document.createElement('select')
//     select.setAttribute('id', 'instansi5')
//     select.setAttribute('class', 'selectpicker')
//     select.setAttribute('data-live-search', 'true')
//     select.setAttribute('onchange', `onSelectInstansi('instansi5')`)
//     div.appendChild(select)

//     rowLeft.appendChild(div)
// }

// create menu dropdown
function createMenuDropdown(){
    const elem = document.getElementsByClassName('wrapp-menu')
    if(elem){
        elem[6]
    }
}