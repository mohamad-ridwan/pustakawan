const wrap = document.getElementById('grafikDaerah')

const optionsBar = {
    animation: false
}
const labelBar = ['Bogor Selatan', 'Bogor Timur', 'Bogor Utara', 'Bogor Tengah', 'Bogor Barat', 'Tanah Sareal']
let dataPustakawan = [0, 0, 0, 0, 0, 0]
let persentaseData = [0, 0, 0, 0, 0, 0]

// const tesHitung = ((910 / 5451) * 100).toFixed(2)

const headTableGrafik = ['Nama Kota', 'Total Data', 'Persentase']
let dataTableGrafik = []

postFormDataAPI(POST_API_PUSTAKAWAN, {
    method: 'GET'
})
    .then(res => {
        if (res?.length > 0) {
            const getUsers = res.filter(user => user?.role == 'Users')
            document.getElementById('tileGrafik').innerText = `Grafik Berdasarkan kota (${getUsers.length})`
            const totalDataPustakawan = getUsers.length
            dataPustakawan = labelBar.map(kota => getDataPerDaerah(getUsers, kota))
            persentaseData = labelBar.map(kota => `${((Number(getDataPerDaerah(getUsers, kota)) / totalDataPustakawan) * 100).toFixed(2)}%`)
            // console.log(persentaseData)

            dataTableGrafik = labelBar.map(kota => {
                return {
                    namaKota: kota,
                    jumlah: getDataPerDaerah(getUsers, kota),
                    persentase: `${((Number(getDataPerDaerah(getUsers, kota)) / totalDataPustakawan) * 100).toFixed(2)}%`
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

function getDataPerDaerah(data, kota) {
    const findData = data.filter(user => user.lokasi_instansi == kota)
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
        const namaKota = document.createElement('td')
        const jumlah = document.createElement('td')
        const persentase = document.createElement('td')

        namaKota.innerText = item.namaKota
        jumlah.innerText = item.jumlah
        persentase.innerText = item.persentase
        tr.appendChild(namaKota)
        tr.appendChild(jumlah)
        tr.appendChild(persentase)
        document.getElementById('tableGrafik').appendChild(tr)
    })
}