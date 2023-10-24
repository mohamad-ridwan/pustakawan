const wrap = document.getElementById('grafikPangkat')

const optionsBar = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
    },
}
const labelBar = ['Pengatur Muda Tk.I (II/b)', 'Pengatur (II/c)', 'Pengatur Tk.I (II/d)', 'Penata Muda (III/a)', 'Penata Muda Tk.I (III/b)', 'Penata (III/c)', 'Penata Tk.I (III/d)', 'Pembina (IV/a)', 'Pembina Tk.I (IV/b)', 'Pembina Utama Muda (IV/c)', 'Pembina Utama Madya (IV/d)', 'Pembina Utama (IV/e)', '-', 'Pengatur Muda (II/a)']
let dataPustakawan = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// let persentaseData = [0, 0, 0, 0, 0, 0]

// const tesHitung = ((910 / 5451) * 100).toFixed(2)

const headTableGrafik = ['Pangkat', 'Total Data', 'Persentase']
let dataTableGrafik = []

postFormDataAPI(POST_API_PUSTAKAWAN, {
    method: 'GET'
})
    .then(res => {
        if (res?.length > 0) {
            const getUsers = res.filter(user => user?.role == 'Users')
            document.getElementById('tileGrafik').innerText = `Grafik Berdasarkan Pangkat / Golongan (${getUsers.length})`
            const totalDataPustakawan = getUsers.length
            dataPustakawan = labelBar.map(pangkat => getDataPerDaerah(getUsers, pangkat))
            // persentaseData = labelBar.map(kota => `${((Number(getDataPerDaerah(getUsers, kota)) / totalDataPustakawan) * 100).toFixed(2)}%`)
            // console.log(persentaseData)

            // const newLabelsBar = labelBar.map(pangkat=> `${pangkat.length > 30 ? pangkat.substr(0, 30) + '...' : pangkat}`)

            dataTableGrafik = labelBar.map(pangkat => {
                return {
                    pangkat: pangkat,
                    jumlah: getDataPerDaerah(getUsers, pangkat),
                    persentase: `${((Number(getDataPerDaerah(getUsers, pangkat)) / totalDataPustakawan) * 100).toFixed(2)}%`
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

function getDataPerDaerah(data, pangkat) {
    const findData = data.filter(user => user.pangkat == pangkat)
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
        const pangkat = document.createElement('td')
        const jumlah = document.createElement('td')
        const persentase = document.createElement('td')

        pangkat.innerText = item.pangkat
        jumlah.innerText = item.jumlah
        persentase.innerText = item.persentase
        tr.appendChild(pangkat)
        tr.appendChild(jumlah)
        tr.appendChild(persentase)
        document.getElementById('tableGrafik').appendChild(tr)
    })
}