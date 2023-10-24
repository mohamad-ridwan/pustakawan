const wrap = document.getElementById('grafikJabatan')

const optionsBar = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
    },
}
const labelBar = ['1. Pustakawan Terampil / Asisten Perpustakaan  Terampil', '2. Pustakawan Mahir / Asisten Perpustakaan Mahir', '3. Pustakawan Penyelia / Asisten Perpustakaan  Penyelia', '4. Pustakawan Ahli Pertama', '5. Pustakawan Ahli Muda', '6. Pustakawan Ahli Madya', '7. Pustakawan Ahli Utama']
let dataPustakawan = [0, 0, 0, 0, 0, 0, 0]
// let persentaseData = [0, 0, 0, 0, 0, 0]

// const tesHitung = ((910 / 5451) * 100).toFixed(2)

const headTableGrafik = ['Jabatan', 'Total Data', 'Persentase']
let dataTableGrafik = []

postFormDataAPI(POST_API_PUSTAKAWAN, {
    method: 'GET'
})
    .then(res => {
        if (res?.length > 0) {
            const getUsers = res.filter(user => user?.role == 'Users')
            document.getElementById('tileGrafik').innerText = `Grafik Berdasarkan Jabatan (${getUsers.length})`
            const totalDataPustakawan = getUsers.length
            dataPustakawan = labelBar.map((jabatan, index) => getDataPerDaerah(getUsers, jabatan.replace(`${index + 1}.`, '')))
            // persentaseData = labelBar.map(kota => `${((Number(getDataPerDaerah(getUsers, kota)) / totalDataPustakawan) * 100).toFixed(2)}%`)
            // console.log(persentaseData)

            const newLabelsBar = labelBar.map(jabatan=> `${jabatan.length > 30 ? jabatan.substr(0, 30) + '...' : jabatan}`)

            dataTableGrafik = labelBar.map((jabatan, index) => {
                return {
                    jabatan: jabatan,
                    jumlah: getDataPerDaerah(getUsers, jabatan.replace(`${index + 1}.`, '')),
                    persentase: `${((Number(getDataPerDaerah(getUsers, jabatan.replace(`${index + 1}.`, ''))) / totalDataPustakawan) * 100).toFixed(2)}%`
                }
            })

            document.getElementById('tableGrafik').appendChild(createHeadTable(headTableGrafik))
            createBodyTable(dataTableGrafik)

            new Chart(wrap, {
                type: 'bar',
                data: {
                    labels: newLabelsBar,
                    datasets: [
                        {
                            label:['Total Data'],
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

function getDataPerDaerah(data, jabatan) {
    const findData = data.filter(user => user.jabatan_fungsional.replace(/\s/g, '') == jabatan.replace(/\s/g, ''))
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
        const jabatan = document.createElement('td')
        const jumlah = document.createElement('td')
        const persentase = document.createElement('td')

        jabatan.innerText = item.jabatan
        jumlah.innerText = item.jumlah
        persentase.innerText = item.persentase
        tr.appendChild(jabatan)
        tr.appendChild(jumlah)
        tr.appendChild(persentase)
        document.getElementById('tableGrafik').appendChild(tr)
    })
}