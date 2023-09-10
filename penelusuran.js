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
    loadCreateSelect('instansi1', instansiData.instansi1)
    loadCreateSelect('instansi2', instansiData.instansi2)
    loadCreateSelect('instansi3', instansiData.instansi3)
    // provinsi API
    const loadingElem = document.getElementById('loadingInstansi3')
    const loadingElem4 = document.getElementById('loadingInstansi4')
    const loadingElem5 = document.getElementById('loadingInstansi5')
    if (loadingElem) {
        loadingElem.style.display = 'flex'
        // loadingElem4.style.display = 'flex'
        // loadingElem5.style.display = 'flex'
    }
    getProvinsiAPI()
        .then(res => {
            if (res?.length > 0) {
                const data = res.map(provinsi => ({
                    data_tokens: provinsi.id,
                    value: provinsi.name
                }))
                loadCreateSelect('instansi4', data)
                setTimeout(() => {
                    createMenuDropdown(data, 3)
                    loadingElem.style.display = 'none'
                }, 500);
                return data
            }
            return []
        })
        // .then(data => {
        //     return getKabOrKotaAPI('regencies', data[0].data_tokens)
        // })
        // .then(res=>{
        //     const data = res.map(provinsi => ({
        //         data_tokens: provinsi.id,
        //         value: provinsi.name
        //     }))
        //     loadCreateSelect('instansi5', data)
        //     setTimeout(() => {
        //         createMenuDropdown(data, 4)
        //         loadingElem4.style.display = 'none'
        //     }, 500);
        //     return data
        // })
        // .then(data=>{
        //     return getKabOrKotaAPI('districts', data[0].data_tokens)
        // })
        // .then(res=>{
        //     const data = res.map(provinsi => ({
        //         data_tokens: provinsi.id,
        //         value: provinsi.name
        //     }))
        //     loadCreateSelect('instansi6', data)
        //     setTimeout(() => {
        //         createMenuDropdown(data, 5)
        //         loadingElem5.style.display = 'none'
        //     }, 500);
        //     return data
        // })
        .catch(err => {
            console.log('error', err)
        })
}

setOptionElement()

window.onload = () => {
    setStyleSelect()
}

// get select value
function onSelectInstansi(selectId, loadDataAPI, loadingId) {
    const elem = document.getElementById(selectId)
    const loadingElem = document.getElementById(loadingId)
    const btnText = document.getElementsByClassName('filter-option')
    console.log(elem)
    console.log(selectId)
    if (elem) {
        const indexOption = elem.selectedIndex
        const optionElem = elem.childNodes[indexOption]
        const data_tokens = optionElem.getAttribute('data-tokens')
        console.log(data_tokens)
        const value = elem.options[elem.selectedIndex].value
        if (selectId === 'instansi4' && loadDataAPI === 'provinsi') {
            loadDataAPIAfterSelect(
                'instansi5',
                loadingElem,
                'regencies',
                4,
                data_tokens,
                4
            )
            // removeOptions('instansi5')
            // removeDropdownMenu(4)
            // loadingElem.style.display = 'flex'
            // getKabOrKotaAPI('regencies', data_tokens)
            //     .then(res => {
            //         const data = res.map(provinsi => ({
            //             data_tokens: provinsi.id,
            //             value: provinsi.name
            //         }))
            //         loadCreateSelect('instansi5', data)
            //         setTimeout(() => {
            //             createMenuDropdown(data, 4)
            //             loadingElem.style.display = 'none'
            //         }, 500)
            //     })
            //     .catch(err => {
            //         console.log(err)
            //     })
        }else if (selectId === 'instansi5' && loadDataAPI === 'kabupaten/kota') {
            loadDataAPIAfterSelect(
                'instansi6',
                loadingElem,
                'districts',
                5,
                data_tokens,
                5
            )
        }else if (selectId === 'instansi6' && loadDataAPI === 'kecamatan') {
            loadDataAPIAfterSelect(
                'instansi7',
                loadingElem,
                'villages',
                6,
                data_tokens,
                6
            )
        }
    }
}

function loadDataAPIAfterSelect(
    instansiId,
    loadingElem,
    daerahId,
    indexRemoveDropdownMenu,
    data_tokens,
    indexElement,
) {
    removeOptions(instansiId)
    removeDropdownMenu(indexRemoveDropdownMenu)
    loadingElem.style.display = 'flex'
    getKabOrKotaAPI(daerahId, data_tokens)
        .then(res => {
            const data = res.map(provinsi => ({
                data_tokens: provinsi.id,
                value: provinsi.name
            }))
            loadCreateSelect(instansiId, data)
            setTimeout(() => {
                createMenuDropdown(data, indexElement)
                loadingElem.style.display = 'none'
            }, 500)
        })
        .catch(err => {
            console.log(err)
        })
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
    var currentElem = elem[indexElement]
    var children = currentElem.lastElementChild
    while (children) {
        currentElem.removeChild(children)
        children = currentElem.lastElementChild
    }
}

// create menu dropdown
function createMenuDropdown(data, indexElement) {
    const elem = document.getElementsByClassName('dropdown-menu inner selectpicker')
    const btnText = document.getElementsByClassName('filter-option')
    if (elem && data.length > 0) {
        data.forEach((item, index) => {
            const instansi = elem[indexElement]
            // list element
            var li = document.createElement('li')
            li.setAttribute('data-original-index', index)
            li.setAttribute('class', index === 0 ? 'selected' : '')
            // change btn text
            // if (indexElement === 3 && index === 0) {
            //     btnText[3].innerHTML = item.value
            // }
            // if (indexElement === 4 && index === 0) {
            //     btnText[4].innerHTML = item.value
            // }
            // if (indexElement === 5 && index === 0) {
            //     btnText[5].innerHTML = item.value
            // }
            // if (indexElement === 6 && index === 0) {
            //     btnText[6].innerHTML = item.value
            // }
            // tag a element
            var tagA = document.createElement('a')
            tagA.setAttribute('tabindex', '0')
            tagA.setAttribute('class', '')
            tagA.setAttribute('data-normalized-text', `<span class=&quot;text&quot;>${item.value}</span>`)
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