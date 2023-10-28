const wrap = document.getElementById('grafikJenisInstansi')

const optionsBar = {
    animation: false
}
const labelBar = ['PERPUSTAKAAN SEKOLAH', 'PERPUSTAKAAN PERGURUAN TINGGI', 'PERPUSTAKAAN UMUM', 'PERPUSTAKAAN KHUSUS']
let dataPustakawan = [0, 0, 0, 0]
let persentaseData = [0, 0, 0, 0]

// const tesHitung = ((910 / 5451) * 100).toFixed(2)

const headTableGrafik = ['Jenis Instansi', 'Total Data', 'Persentase']
let dataTableGrafik = []

postFormDataAPI(POST_API_PUSTAKAWAN, {
    method: 'GET'
})
    .then(res => {
        if (res?.length > 0) {
            const getUsers = res.filter(user => user?.role == 'Users')
            document.getElementById('tileGrafik').innerText = `Grafik Berdasarkan Jenis Instansi (${getUsers.length})`
            const totalDataPustakawan = getUsers.length
            dataPustakawan = labelBar.map(jenis_instansi => getDataPerDaerah(getUsers, jenis_instansi))
            persentaseData = labelBar.map(jenis_instansi => `${((Number(getDataPerDaerah(getUsers, jenis_instansi)) / totalDataPustakawan) * 100).toFixed(2)}%`)
            // console.log(persentaseData)

            dataTableGrafik = labelBar.map(jenis_instansi => {
                return {
                    jenis_instansi: jenis_instansi,
                    jumlah: getDataPerDaerah(getUsers, jenis_instansi),
                    persentase: `${((Number(getDataPerDaerah(getUsers, jenis_instansi)) / totalDataPustakawan) * 100).toFixed(2)}%`
                }
            })

            document.getElementById('tableGrafik').appendChild(createHeadTable(headTableGrafik))
            createBodyTable(dataTableGrafik)

            new Chart(wrap, {
                type: 'bar',
                data: {
                    labels: labelBar,
                    datasets: [
                        {
                            label: 'Total Data',
                            data: dataPustakawan
                        },
                        // {
                        //     label: 'Persentase Data',
                        //     data: persentaseData
                        // }
                    ]
                }
            })
        } else {
            console.log(res)
        }
    })
    .catch(err => {
        alert('Terjadi kesalahan server.\nTidak dapat memuat data daerah')
        console.log(err)
    })

function getDataPerDaerah(data, jenis_instansi) {
    const findData = data.filter(user => user.jenis_instansi == jenis_instansi)
    return findData.length
}

function createHeadTable(headData) {
    const tr = document.createElement('tr')
    let count = 0
    headData.forEach(item => {
        count = count + 1
        const textNode = document.createTextNode(item)
        const th = document.createElement('th')
        th.appendChild(textNode)
        tr.appendChild(th)
    })
    if (count === headData.length) {
        return tr
    }
    return null
}

function createBodyTable(bodyData) {
    bodyData.forEach(item => {
        const tr = document.createElement('tr')
        const jenis_instansi = document.createElement('td')
        const jumlah = document.createElement('td')
        const persentase = document.createElement('td')

        jenis_instansi.innerText = item.jenis_instansi
        jumlah.innerText = item.jumlah
        persentase.innerText = item.persentase
        tr.appendChild(jenis_instansi)
        tr.appendChild(jumlah)
        tr.appendChild(persentase)
        document.getElementById('tableGrafik').appendChild(tr)
    })
}