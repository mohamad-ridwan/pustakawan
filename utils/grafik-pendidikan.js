const wrap = document.getElementById('grafikPendidikan')

const optionsBar = {
    animation: false
}
const labelBar = ['SMA/SMK/MA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3', 'D4', 'SMP/MTs']
let dataPustakawan = [0, 0, 0, 0, 0, 0, 0, 0, 0]
// let persentaseData = [0, 0, 0, 0, 0, 0]

// const tesHitung = ((910 / 5451) * 100).toFixed(2)

const headTableGrafik = ['Pendidikan', 'Total Data', 'Persentase']
let dataTableGrafik = []

postFormDataAPI(POST_API_PUSTAKAWAN, {
    method: 'GET'
})
    .then(res => {
        if (res?.length > 0) {
            const getUsers = res.filter(user => user?.role == 'Users')
            document.getElementById('tileGrafik').innerText = `Grafik Berdasarkan Pendidikan (${getUsers.length})`
            const totalDataPustakawan = getUsers.length
            dataPustakawan = labelBar.map(pendidikan => getDataPerDaerah(getUsers, pendidikan))
            // persentaseData = labelBar.map(kota => `${((Number(getDataPerDaerah(getUsers, kota)) / totalDataPustakawan) * 100).toFixed(2)}%`)
            // console.log(persentaseData)

            dataTableGrafik = labelBar.map(pendidikan => {
                return {
                    pendidikan: pendidikan,
                    jumlah: getDataPerDaerah(getUsers, pendidikan),
                    persentase: `${((Number(getDataPerDaerah(getUsers, pendidikan)) / totalDataPustakawan) * 100).toFixed(2)}%`
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

function getDataPerDaerah(data, pendidikan) {
    const findData = data.filter(user => user.pendidikan == pendidikan)
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
        const pendidikan = document.createElement('td')
        const jumlah = document.createElement('td')
        const persentase = document.createElement('td')

        pendidikan.innerText = item.pendidikan
        jumlah.innerText = item.jumlah
        persentase.innerText = item.persentase
        tr.appendChild(pendidikan)
        tr.appendChild(jumlah)
        tr.appendChild(persentase)
        document.getElementById('tableGrafik').appendChild(tr)
    })
}