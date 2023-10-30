const fontTable = 7
const fontSizeProperty = 'fontSize'
const color_header = '#bbd4e4'
const green_header = '#96d49b'

// pustakawan Daerah Kota
const H_DaerahKota = [createTextPDF('No.', true, fontTable, color_header), createTextPDF('Nama', true, fontTable, color_header), createTextPDF('Jabatan / Status Kedinasan', true, fontTable, color_header), createTextPDF('Instansi', true, fontTable, color_header), createTextPDF('Jenis Instansi', true, fontTable, color_header)]
const H_TABEL_STATIKSTIK = [createTextPDF('No.', true, fontTable, color_header), createTextPDF('Nama', true, fontTable, color_header), createTextPDF('Jabatan', true, fontTable, color_header), createTextPDF('Instansi', true, fontTable, color_header), createTextPDF('Jenis Instansi', true, fontTable, color_header)]
const STATUS_JABATAN_FUNGSIONAL = [
    'Pustakawan Terampil / Asisten Perpustakaan  Terampil',
    'Pustakawan Mahir / Asisten Perpustakaan Mahir',
    'Pustakawan Penyelia / Asisten Perpustakaan  Penyelia',
    'Pustakawan Ahli Pertama',
    'Pustakawan Ahli Muda',
    'Pustakawan Ahli Madya',
    'Pustakawan Ahli Utama',
    'Kepala Perpustakaan',
    'Pustakawan Swasta',
    'Pejabat Pimpinan Tinggi Pratama',
    'Pejabat Administrator',
    'Pejabat Pengawas',
    'Staf Administrasi (FU)',
    'Tenaga Teknis Komputer',
    'Tenaga Teknis A.V',
    'Ketatausahaan',
    'Administrasi Keuangan',
    'Petugas/Pengelola Perpustakaan',
    'Fungsional Tertentu Lainnya',
    'Sekretaris Utama',
    'Penyuluh Perpustakaan',
    'Pengawas Perpustakaan',
]
const PENDIDIKAN = ['SMA/SMK/MA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3', 'D4', 'SMP/MTs']
const JENIS_KELAMIN = ['Laki-laki', 'Perempuan']
const params = new URLSearchParams(window.location.search)

if (params?.get('dataDaerah')) {
    postFormDataAPI(POST_API_PUSTAKAWAN, {
        method: 'GET'
    })
        .then(async res => {
            if (res?.length > 0) {
                const usersData = res.filter(data => data.role == 'Users')
                if (usersData.length > 0) {
                    const daerahKota = usersData.filter(user => user.lokasi_instansi == params.get('dataDaerah'))
                    if (daerahKota.length > 0) {
                        const data_fungsional_pustakawan = daerahKota.filter(user => user.jabatan_fungsional !== 'null')
                        const data_tenaga_pustakawan = daerahKota.filter(user => user.status_dinas !== 'null')

                        const getData_FUNGSIONAL_PUSTAKAWAN = data_fungsional_pustakawan.map((user, index) => [createTextPDF(`${index + 1}.`, false, fontTable), createTextPDF(user.nama_users, false, fontTable), createTextPDF(user.jabatan_fungsional, false, fontTable), createTextPDF(user.istansi, false, fontTable), createTextPDF(user.jenis_instansi, false, fontTable)])
                        const getData_TENAGA_PUSTAKAWAN = data_tenaga_pustakawan.map((user, index) => [createTextPDF(`${getData_FUNGSIONAL_PUSTAKAWAN.length + 1}.`, false, fontTable), createTextPDF(user.nama_users, false, fontTable), createTextPDF(user.status_dinas, false, fontTable), createTextPDF(user.istansi, false, fontTable), createTextPDF(user.jenis_instansi, false, fontTable)])

                        // title jumlah pustakawan
                        docDefinition.content.push({ text: `Jumlah Pustakawan dari (${params.get('dataDaerah')}): ${daerahKota.length}`, margin: [0, 10, 0, 10] })

                        // tabel statistik
                        docDefinition.content.push(createTextPDF('TABEL STATISTIK', true, 10))
                        const newDataTable = createDataStatistik()
                        getDataFromJabatan(daerahKota).forEach(item => {
                            newDataTable.table.body.push(item)
                        })
                        newDataTable.table.body.push(getJumlahPerJenisInstansi(daerahKota))
                        // docDefinition.content.push({ text: '', margin: [0, 10, 0, 10], })
                        docDefinition.content.push(newDataTable)
                        // end tabel statistik

                        google.charts.load('current', { 'packages': ['corechart'] });
                        google.charts.setOnLoadCallback(drawChart)
                        function drawChart() {
                            // Create the data table.
                            var data = new google.visualization.DataTable();
                            data.addColumn('string', 'Topping');
                            data.addColumn('number', 'Slices');
                            data.addRows(getPustakawanBerdasarkanJabatan(daerahKota));

                            // Set chart options
                            var options = {
                                'title': '',
                                legend: 'none',
                                fontSize: 9,
                            };

                            // Instantiate and draw our chart, passing in some options.
                            var chart = new google.visualization.BarChart(document.getElementById('myChart'))
                            chart.draw(data, options)
                        }

                        await makeHTML2Canvas('myChart')
                            .then(async res => {
                                let imageURL = ''
                                imageURL = res.toDataURL('image/jpeg')
                                // GRAFIK
                                // TENAGA PERPUS BERDASARKAN JABATAN
                                docDefinition.content.push(createTextPDF('Tenaga Perpustakaan Berdasarkan Jabatan', true, 12, undefined, 'before', undefined, undefined, 'center', undefined))
                                docDefinition.content.push({
                                    image: imageURL,
                                    width: 550,
                                })

                                const calculation = calculationDataTenagaPerpus([...getData_FUNGSIONAL_PUSTAKAWAN, ...getData_TENAGA_PUSTAKAWAN], daerahKota.length)

                                const terbanyak = calculation.terbanyak.map(jabatan => `${jabatan.text}`).join(', ')
                                const sedikit = calculation.sedikit.map(jabatan => `${jabatan.text}`).join(', ')

                                docDefinition.content.push(createTextPDF(`Tenaga perpustakaan berdasarkan jenis jabatan atau status kedinasan pada Kota ${params.get('dataDaerah')} didominasi oleh ${terbanyak}, dan yang paling sedikit adalah ${sedikit}.`, false, 11, undefined, undefined, undefined, undefined, 'justify', undefined, 1.5))

                                // docDefinition.content.push(createTextPDF(`
                                // Tenaga perpustakaan berdasarkan jenis jabatan atau status kedinasan pada Kota ${params.get('dataDaerah')} didominasi oleh ${calculation[0].jabatan} sebanyak ${calculation[0].total} orang (${((calculation[0].total / daerahKota.length * 100).toFixed(2))}%), ${calculation[1] ? `sedangkan yang paling sedikit adalah ${calculation[1].jabatan} sebanyak ${calculation[1].total} orang (${((calculation[1].total / daerahKota.length) * 100).toFixed(2)})%` : '.'}
                                // `, false, 11, undefined, undefined, undefined, undefined, undefined, undefined))

                                // GRAFIK
                                // TENAGA PERPUS BERDASARKAN PENDIDIKAN
                                const getDataGrafikPendidikan = PENDIDIKAN.map(pendidikan => {
                                    const findUser = daerahKota.filter(user => user.pendidikan == pendidikan)
                                    return [pendidikan, findUser.length]
                                })

                                google.charts.load('current', { 'packages': ['corechart'] });
                                google.charts.setOnLoadCallback(chartPendidikan)
                                function chartPendidikan() {
                                    // Create the data table.
                                    var data = new google.visualization.DataTable();
                                    data.addColumn('string', 'Topping');
                                    data.addColumn('number', 'Slices');
                                    data.addRows(getDataGrafikPendidikan);

                                    // Set chart options
                                    var options = {
                                        'title': '',
                                        legend: 'none',
                                        fontSize: 9,
                                    };

                                    // Instantiate and draw our chart, passing in some options.
                                    var chart = new google.visualization.BarChart(document.getElementById('chartEducation'))
                                    chart.draw(data, options)
                                }

                                return await makeHTML2Canvas('chartEducation')
                            })
                            .then(async res => {
                                let imageURL = ''
                                imageURL = res.toDataURL('image/jpeg')
                                docDefinition.content.push(createTextPDF('Tenaga Perpustakaan Berdasarkan Pendidikan', true, 12, undefined, 'before', undefined, undefined, 'center', undefined, undefined))
                                docDefinition.content.push({
                                    image: imageURL,
                                    width: 550,
                                })

                                const calculation = calculationGrafikPendidikan(daerahKota)
                                const terbanyak = calculation.terbanyak.map(pendidikan => `${pendidikan.text}`).join(', ')
                                const sedikit = calculation.sedikit.map(pendidikan => `${pendidikan.text}`).join(', ')

                                docDefinition.content.push(createTextPDF(`Tenaga perpustakaan berdasarkan latar belakang pendidikan pada Kota ${params.get('dataDaerah')} didominasi oleh ${terbanyak}, dan yang paling sedikit adalah ${sedikit}.`, false, 11, undefined, undefined, undefined, undefined, 'justify', undefined, 1.5))

                                // TENAGA PERPUSTAKAAN BERDASARKAN JENIS KELAMIN
                                const getDataGrafikJenisKelamin = JENIS_KELAMIN.map(jenisKelamin => {
                                    const findUser = daerahKota.filter(user => user.jenis_kelamin == jenisKelamin)
                                    return [jenisKelamin, findUser.length]
                                })
                                google.charts.load('current', { 'packages': ['corechart'] });
                                google.charts.setOnLoadCallback(chartJenisKelamin)
                                function chartJenisKelamin() {
                                    // Create the data table.
                                    var data = new google.visualization.DataTable();
                                    data.addColumn('string', 'Topping');
                                    data.addColumn('number', 'Slices');
                                    data.addRows(getDataGrafikJenisKelamin);

                                    // Set chart options
                                    var options = {
                                        'title': '',
                                        legend: 'none',
                                        fontSize: 9,
                                    };

                                    // Instantiate and draw our chart, passing in some options.
                                    var chart = new google.visualization.BarChart(document.getElementById('chartGender'))
                                    chart.draw(data, options)
                                }

                                return await makeHTML2Canvas('chartGender')
                            })
                            .then(async res => {
                                let imageURL = ''
                                imageURL = res.toDataURL('image/jpeg')
                                docDefinition.content.push(createTextPDF('Tenaga Perpustakaan Berdasarkan Jenis Kelamin', true, 12, undefined, undefined, undefined, undefined, 'center', [0, 20, 0, 0], undefined))

                                docDefinition.content.push({
                                    image: imageURL,
                                    width: 550,
                                })

                                const calculation = calculationGrafikGender(daerahKota)
                                const terbanyak = calculation.terbanyak.map(jenis_kelamin => `${jenis_kelamin.text}`).join(', ')
                                const sedikit = calculation.sedikit.map(jenis_kelamin => `${jenis_kelamin.text}`).join(', ')

                                docDefinition.content.push(createTextPDF(`Tenaga perpustakaan berdasarkan jenis kelamin pada Kota ${params.get('dataDaerah')} didominasi oleh ${terbanyak}, kemudian ${sedikit}.`, false, 11, undefined, undefined, undefined, undefined, 'justify', undefined, 1.5))

                                // GRAFIK TENAGA PERPUS BERDASARKAN USIA
                                const dataAge = []
                                let useDataAge = []
                                daerahKota.forEach(user => {
                                    let years = ''
                                    const findAge = daerahKota.filter(userAge => {
                                        years = userAge.Tanggal_Lahir.split('-')[0]
                                        return userAge.Tanggal_Lahir.split('-')[0] === user.Tanggal_Lahir.split('-')[0]
                                    })
                                    const currentUser = findAge.map(user => {
                                        const years = user.Tanggal_Lahir.split('-')[0]
                                        return {
                                            age: years,
                                            total: findAge.length
                                        }
                                    })
                                    const checkAge = dataAge?.filter(age => age.age === currentUser[0].age)
                                    if (checkAge.length === 0) {
                                        dataAge.push(currentUser[0])
                                    }
                                })
                                dataAge.sort((a, b) => Number(a?.age) - Number(b?.age))
                                useDataAge = dataAge.map(data => [data?.age, data?.total])

                                google.charts.load('current', { 'packages': ['corechart'] });
                                google.charts.setOnLoadCallback(chartAge)
                                function chartAge() {
                                    // Create the data table.
                                    var data = new google.visualization.DataTable();
                                    data.addColumn('string', 'Topping');
                                    data.addColumn('number', 'Slices');
                                    data.addRows(useDataAge);

                                    // Set chart options
                                    var options = {
                                        'title': '',
                                        legend: 'none',
                                        fontSize: 9,
                                    };

                                    // Instantiate and draw our chart, passing in some options.
                                    var chart = new google.visualization.BarChart(document.getElementById('chartAge'))
                                    chart.draw(data, options)
                                }

                                return await makeHTML2Canvas('chartAge')
                            })
                            .then(res => {
                                let imageURL = ''
                                imageURL = res.toDataURL('image/jpeg')
                                docDefinition.content.push(createTextPDF('Tenaga Perpustakaan Berdasarkan Usia', true, 12, undefined, 'before', undefined, undefined, 'center', undefined, undefined))
                                docDefinition.content.push({
                                    image: imageURL,
                                    width: 550,
                                })

                                const dataAge = []
                                daerahKota.forEach(user => {
                                    let years = ''
                                    const findAge = daerahKota.filter(userAge => {
                                        years = userAge.Tanggal_Lahir.split('-')[0]
                                        return userAge.Tanggal_Lahir.split('-')[0] === user.Tanggal_Lahir.split('-')[0]
                                    })
                                    const currentUser = findAge.map(user => {
                                        const years = user.Tanggal_Lahir.split('-')[0]
                                        return {
                                            age: years,
                                            total: findAge.length
                                        }
                                    })
                                    const checkAge = dataAge?.filter(age => age.age === currentUser[0].age)
                                    if (checkAge.length === 0) {
                                        dataAge.push(currentUser[0])
                                    }
                                })
                                dataAge.sort((a, b) => Number(a?.age) - Number(b?.age))

                                const calculation = calculationGrafikAge(dataAge, daerahKota)
                                const terbanyak = calculation.terbanyak.map(age => `${age.text}`).join(', ')
                                const sedikit = calculation.sedikit.map(age => `${age.text}`).join(', ')
                                docDefinition.content.push(createTextPDF(`Tenaga perpustakaan berdasarkan usia pada Kota ${params.get('dataDaerah')} didominasi oleh usia ${terbanyak}, dan paling sedikit usia ${sedikit} (usia dihitung per tahun ${new Date().getFullYear()}).`, false, 11, undefined, undefined, undefined, undefined, 'justify', undefined, 1.5))

                                // tabel data tenaga pustakawan
                                const dataTableTenagaPustakawan = createTableTenagaPustakawan()
                                docDefinition.content.push(createTextPDF('TABEL DATA TENAGA PERPUSTAKAAN', true, 10, undefined, 'before'))
                                dataTableTenagaPustakawan.table.body.push(H_DaerahKota)
                                dataTableTenagaPustakawan.table.body.push([createTextPDF('FUNGSIONAL PUSTAKAWAN', true, fontTable, green_header, undefined, undefined, 5, undefined), {}, {}, {}, {}])
                                getData_FUNGSIONAL_PUSTAKAWAN.forEach(user => {
                                    dataTableTenagaPustakawan.table.body.push(user)
                                })
                                if (getData_TENAGA_PUSTAKAWAN.length > 0) {
                                    dataTableTenagaPustakawan.table.body.push([createTextPDF('TENAGA PUSTAKAWAN', true, fontTable, green_header, undefined, undefined, 5, undefined), {}, {}, {}, {}])
                                    getData_TENAGA_PUSTAKAWAN.forEach(user => {
                                        dataTableTenagaPustakawan.table.body.push(user)
                                    })
                                }
                                docDefinition.content.push(dataTableTenagaPustakawan)

                                const profilePustakawan = createTableTenagaPustakawan()
                                docDefinition.content.push(createTextPDF('DIREKTORI TENAGA PERPUSTAKAAN', true, 12, undefined, 'before', undefined, undefined, 'center', [0, 0, 0, 20], undefined))
                                profilePustakawan.layout = 'noBorders'
                                let indexPer3 = 0
                                daerahKota.forEach((user, index) => {
                                    if(indexPer3 === 3){
                                        indexPer3 = 0
                                    }
                                    indexPer3 = indexPer3 + 1
                                    profilePustakawan.table.body.push(
                                        [
                                            createTextPDF(index + 1, true, fontTable, undefined, undefined, undefined, 1, undefined, undefined, 0.9),
                                            {}
                                        ],
                                        [
                                            {
                                                image: getBase64Image(document.getElementById('imgProfile')),
                                                width: 60
                                            },
                                            {}
                                            // createTextPDF(`: `, false, fontTable, undefined, undefined, undefined, undefined, undefined, [40, 0, 0, 0], 0.9)
                                        ],
                                        [
                                            createTextPDF('Nama', true, fontTable, undefined, undefined, undefined, undefined, undefined, undefined, 0.9),
                                            createTextPDF(`: ${user.nama_users}`, true, fontTable, undefined, undefined, undefined, undefined, undefined, [40, 0, 0, 0], 0.9)
                                        ],
                                        [
                                            createTextPDF('Tahun Lahir', false, fontTable, undefined, undefined, undefined, undefined, undefined, undefined, 0.9),
                                            createTextPDF(`: ${user.Tanggal_Lahir.split('-')[0]}`, false, fontTable, undefined, undefined, undefined, undefined, undefined, [40, 0, 0, 0], 0.9)
                                        ],
                                        [
                                            createTextPDF('Jenis Kelamin', false, fontTable, undefined, undefined, undefined, undefined, undefined, undefined, 0.9),
                                            createTextPDF(`: ${user.jenis_kelamin}`, false, fontTable, undefined, undefined, undefined, undefined, undefined, [40, 0, 0, 0], 0.9)
                                        ],
                                        [
                                            createTextPDF('Pendidikan', false, fontTable, undefined, undefined, undefined, undefined, undefined, undefined, 0.9),
                                            createTextPDF(`: ${user.pendidikan}`, false, fontTable, undefined, undefined, undefined, undefined, undefined, [40, 0, 0, 0], 0.9)
                                        ],
                                        [
                                            createTextPDF('Bidang', false, fontTable, undefined, undefined, undefined, undefined, undefined, undefined, 0.9),
                                            createTextPDF(`: ${user.jurusan_bidangpendidikan
                                                }`, false, fontTable, undefined, undefined, undefined, undefined, undefined, [40, 0, 0, 0], 0.9)
                                        ],
                                        [
                                            createTextPDF('Pangkat', false, fontTable, undefined, undefined, undefined, undefined, undefined, undefined, 0.9),
                                            createTextPDF(`: ${user.jurusan_bidangpendidikan
                                                }`, false, fontTable, undefined, undefined, undefined, undefined, undefined, [40, 0, 0, 0], 0.9)
                                        ],
                                        [
                                            createTextPDF('Jabatan/Status Kedinasan', false, fontTable, undefined, undefined, undefined, undefined, undefined, undefined, 0.9),
                                            createTextPDF(`: ${user.jabatan_fungsional !== 'null' ? user.jabatan_fungsional : user.status_dinas}`, false, fontTable, undefined, undefined, undefined, undefined, undefined, [40, 0, 0, 0], 0.9)
                                        ],
                                        [
                                            createTextPDF('Nama Instansi', false, fontTable, undefined, undefined, undefined, undefined, undefined, undefined, 0.9),
                                            createTextPDF(`: ${user.istansi}`, false, fontTable, undefined, undefined, undefined, undefined, undefined, [40, 0, 0, 0], 0.9)
                                        ],
                                        [
                                            createTextPDF('Jenis Instansi', false, fontTable, undefined, undefined, undefined, undefined, undefined, undefined, 0.9),
                                            createTextPDF(`: ${user.jenis_instansi}`, false, fontTable, undefined, undefined, undefined, undefined, undefined, [40, 0, 0, 0], 0.9)
                                        ],
                                        [
                                            createTextPDF('Email', false, fontTable, undefined, undefined, undefined, undefined, undefined, undefined, 0.9),
                                            createTextPDF(`: ${user.email}`, false, fontTable, undefined, undefined, undefined, undefined, undefined, [40, 0, 0, 0], 0.9)
                                        ],
                                        [
                                            { text: '' },
                                            { text: '', margin: [0, 0, 0, 20], pageBreak: indexPer3 === 3 ? 'before': undefined }
                                        ]
                                    )
                                })
                                setTimeout(() => {
                                    docDefinition.content.push(profilePustakawan)
                                }, 0)
                                setTimeout(() => {
                                    openTabPDF(docDefinition)
                                    setTimeout(() => {
                                        window.close()
                                    }, 1500);
                                }, 50);
                            })
                        // end tabel data tenaga pustakawan
                    } else {
                        alert(`Data pustakawan tidak ditemukan dari "${params.get('dataDaerah')}"`)
                    }
                }
            }
        })
        .catch(err => {
            alert('terjadi kesalahan server.\nmohon coba beberapa saat lagi')
            console.log(err)
        })
}else{
    alert('invalid query')
    window.close()
}

function createTextPDF(text, isBold, fontSize, fillColor, pageBreak, rowSpan, colSpan, alignment, margin, lineHeight = 1) {
    return {
        text,
        bold: isBold ?? false,
        [fontSizeProperty]: fontSize,
        fillColor: fillColor,
        pageBreak: pageBreak,
        rowSpan: rowSpan,
        colSpan: colSpan,
        alignment: alignment,
        margin: margin,
        lineHeight: lineHeight
    }
}

function getDataFromJabatan(daerahKota) {
    const cekData = STATUS_JABATAN_FUNGSIONAL.map((jabatan, index) => {
        const perpusSekolah = daerahKota.filter(user => {
            const jabatan_fungsional = user.jabatan_fungsional.replace(/\s/g, '').toLowerCase() == jabatan.replace(/\s/g, '').toLowerCase() && user.jenis_instansi == 'PERPUSTAKAAN SEKOLAH'
            const status_dinas = user.status_dinas.replace(/\s/g, '').toLowerCase() == jabatan.replace(/\s/g, '').toLowerCase() && user.jenis_instansi == 'PERPUSTAKAAN SEKOLAH'
            return jabatan_fungsional || status_dinas
        })
        const perpusPerguruanTinggi = daerahKota.filter(user => {
            const jabatan_fungsional = user.jabatan_fungsional.replace(/\s/g, '').toLowerCase() == jabatan.replace(/\s/g, '').toLowerCase() && user.jenis_instansi == 'PERPUSTAKAAN PERGURUAN TINGGI'
            const status_dinas = user.status_dinas.replace(/\s/g, '').toLowerCase() == jabatan.replace(/\s/g, '').toLowerCase() && user.jenis_instansi == 'PERPUSTAKAAN PERGURUAN TINGGI'
            return jabatan_fungsional || status_dinas
        })
        const perpusUmum = daerahKota.filter(user => {
            const jabatan_fungsional = user.jabatan_fungsional.replace(/\s/g, '').toLowerCase() == jabatan.replace(/\s/g, '').toLowerCase() && user.jenis_instansi == 'PERPUSTAKAAN UMUM'
            const status_dinas = user.status_dinas.replace(/\s/g, '').toLowerCase() == jabatan.replace(/\s/g, '').toLowerCase() && user.jenis_instansi == 'PERPUSTAKAAN UMUM'
            return jabatan_fungsional || status_dinas
        })
        const perpusKhusus = daerahKota.filter(user => {
            const jabatan_fungsional = user.jabatan_fungsional.replace(/\s/g, '').toLowerCase() == jabatan.replace(/\s/g, '').toLowerCase() && user.jenis_instansi == 'PERPUSTAKAAN KHUSUS'
            const status_dinas = user.status_dinas.replace(/\s/g, '').toLowerCase() == jabatan.replace(/\s/g, '').toLowerCase() && user.jenis_instansi == 'PERPUSTAKAAN KHUSUS'
            return jabatan_fungsional || status_dinas
        })
        const jumlah = `${perpusSekolah.length + perpusPerguruanTinggi.length + perpusUmum.length + perpusKhusus.length}`

        return [createTextPDF(index + 1, false, fontTable, undefined, undefined, undefined, undefined, 'center'), createTextPDF(jabatan, false, fontTable, undefined, undefined, undefined, undefined, 'center'), createTextPDF(perpusSekolah.length, false, fontTable, undefined, undefined, undefined, undefined, 'center'), createTextPDF(perpusPerguruanTinggi.length, false, fontTable, undefined, undefined, undefined, undefined, 'center'), createTextPDF(perpusUmum.length, false, fontTable, undefined, undefined, undefined, undefined, 'center'), createTextPDF(perpusKhusus.length, false, fontTable, undefined, undefined, undefined, undefined, 'center'), createTextPDF(jumlah, false, fontTable, undefined, undefined, undefined, undefined, 'center')]
    })
    return cekData
}

function createDataStatistik() {
    const dataTable = {
        table: {
            body: [
                // H_TABEL_STATIKSTIK
                [createTextPDF('No.', true, fontTable, color_header, undefined, 2, undefined, 'center', [0, 10, 0, 0]), createTextPDF('Jabatan / Status Kedinasan', true, fontTable, color_header, undefined, 2, undefined, 'center', [0, 10, 0, 0]), createTextPDF('Jenis Perpustakaan', true, fontTable, color_header, undefined, undefined, 4, 'center'), {}, {}, {}, createTextPDF('Jumlah', true, fontTable, color_header, undefined, 2, undefined, 'center', [0, 10, 0, 0])],
                [{}, {}, createTextPDF('PERPUSTAKAAN SEKOLAH', true, fontTable, color_header, undefined, undefined, 1, 'center'), createTextPDF('PERPUSTAKAAN PERGURUAN TINGGI', true, fontTable, color_header, undefined, undefined, true, 'center'), createTextPDF('PERPUSTAKAAN UMUM', true, fontTable, color_header, undefined, undefined, 1, 'center'), createTextPDF('PERPUSTAKAAN KHUSUS', true, fontTable, color_header, undefined, undefined, 1, 'center')],
                //    ['1', 'Pustakawan Terampil / Asisten Perpustakaan  Terampil', '0', '0', '0', '0', '0'],
                //    ['2', 'Pustakawan Terampil / Asisten Perpustakaan  Terampil', '0', '0', '0', '0', '0'],
                //    ['3', 'Pustakawan Terampil / Asisten Perpustakaan  Terampil', '0', '0', '0', '0', '0'],
                //    ['4', 'Pustakawan Terampil / Asisten Perpustakaan  Terampil', '0', '0', '0', '0', '0'],
                //    ['5', 'Pustakawan Terampil / Asisten Perpustakaan  Terampil', '0', '0', '0', '0', '0'],
                //    ['6', 'Pustakawan Terampil / Asisten Perpustakaan  Terampil', '0', '0', '0', '0', '0'],
                //    ['7', 'Pustakawan Terampil / Asisten Perpustakaan  Terampil', '0', '0', '0', '0', '0'],
            ]
        }
    }
    return dataTable
}

function getJumlahPerJenisInstansi(daerahKota) {
    const j_perpustakaanSekolah = []
    const j_perpustakaanPerguruanTinggi = []
    const j_perpustakaanUmum = []
    const j_perpustakaanKhusus = []
    const data = getDataFromJabatan(daerahKota)
    data.forEach((item, index) => {
        j_perpustakaanSekolah.push(item[2].text)
        j_perpustakaanPerguruanTinggi.push(item[3].text)
        j_perpustakaanUmum.push(item[4].text)
        j_perpustakaanKhusus.push(item[5].text)
    })
    const jumlahData = `${eval(j_perpustakaanSekolah.join('+')) + eval(j_perpustakaanPerguruanTinggi.join('+')) + eval(j_perpustakaanUmum.join('+')) + eval(j_perpustakaanKhusus.join('+'))}`

    return [
        createTextPDF('Jumlah', false, fontTable, color_header, false, undefined, 2, 'center'),
        {},
        createTextPDF(eval(j_perpustakaanSekolah.join('+')), false, fontTable, color_header, false, undefined, undefined, 'center'),
        createTextPDF(eval(j_perpustakaanPerguruanTinggi.join('+')), false, fontTable, color_header, false, undefined, undefined, 'center'),
        createTextPDF(eval(j_perpustakaanUmum.join('+')), false, fontTable, color_header, false, undefined, undefined, 'center'),
        createTextPDF(eval(j_perpustakaanKhusus.join('+')), false, fontTable, color_header, false, undefined, undefined, 'center'),
        createTextPDF(eval(jumlahData), false, fontTable, color_header, false, undefined, undefined, 'center'),
    ]
}

function createTableTenagaPustakawan() {
    const data = {
        table: {
            body: [
                // ['Nama', 'NIP', 'NIK', 'Lokasi Instansi'],
                // ['Mohamad Ridwan Apriyadi', '197110031993032005', '3201132804010003', 'Bogor Barat'],
                // [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4'],
                // [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4'],
                // [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4'],
            ]
        }
    }
    return data
}

function getPustakawanBerdasarkanJabatan(data) {
    const newData = []
    const colors = [
        '#eb4034',
        '#eba834',
        '#eba834',
        '#348feb',
        '#348feb',
        '#eb34bd',
        '#34ebe8',
        '#34ebe8',
        '#eb345f',
        '#eb345f',
        '#34c6eb',
        '#1c3b42',
        '#311c42',
        '#7a0dd4',
        '#27212b',
        '#d1c9d6',
        '#6b6470',
        '#2a3b3b',
        '#0f4f4f',
        '#1ea8a8',
        '#4c8028',
        '#122604'
    ]
    STATUS_JABATAN_FUNGSIONAL.forEach((title, index) => {
        const pustakawan = data.filter(user => user.jabatan_fungsional !== 'null' ? user.jabatan_fungsional.replace(/\s/g, '').toLowerCase() == title.replace(/\s/g, '').toLowerCase() : user.status_dinas.replace(/\s/g, '').toLowerCase() == title.replace(/\s/g, '').toLowerCase())
        newData.push([title, pustakawan.length])
    })
    return newData
}

function calculationDataTenagaPerpus(
    dataFungsionalOrTenaga,
    totalDataPustakawan
) {
    const resultData = []
    STATUS_JABATAN_FUNGSIONAL.forEach(title => {
        const calculation = dataFungsionalOrTenaga.filter((user, index) => user[2].text.replace(/\s/g, '').toLowerCase() === title.replace(/\s/g, '').toLowerCase())
        resultData.push({ jabatan: title, total: calculation.length })
    })
    const jumlahSedikit = resultData.sort((a, b) => b.total - a.total).reverse()[0]
    const jumlahTerbanyak = resultData.sort((a, b) => b.total + a.total)[resultData.length - 1]
    // generate text dari jumlah yang terbanyak
    const getTerbanyak = resultData.sort((a, b) => b.total + a.total)[resultData.length - 1]
    // ambil yang lain jika yang terbanyak ada lebih dari 1
    const findOtherTerbanyak = resultData.filter(jabatan => jabatan.total == getTerbanyak.total)
    const generateTextTerbanyak = generateTextCalculation(findOtherTerbanyak, totalDataPustakawan, 'jabatan')
    // generate text dari jumlah yang sedikit
    const getSedikit = resultData.sort((a, b) => b.total - a.total).reverse()[0]
    // ambil yang lain jika yang terbanyak ada lebih dari 1
    const findOtherSedikit = resultData.filter(jabatan => jabatan.total === getSedikit.total)
    const generateTextSedikit = generateTextCalculation(findOtherSedikit, totalDataPustakawan, 'jabatan')

    return {
        terbanyak: generateTextTerbanyak,
        sedikit: generateTextSedikit
    }
}

function calculationGrafikPendidikan(daerahKota) {
    const resultData = []
    PENDIDIKAN.forEach(pendidikan => {
        const calculation = daerahKota.filter(user => user.pendidikan == pendidikan)
        resultData.push({ pendidikan, total: calculation.length })
    })
    const jumlahSedikit = resultData.sort((a, b) => b.total - a.total).reverse()[0]
    const jumlahTerbanyak = resultData.sort((a, b) => b.total + a.total)[resultData.length - 1]
    const getTerbanyak = resultData.sort((a, b) => b.total + a.total)[resultData.length - 1]
    // ambil yang lain jika yang terbanyak ada lebih dari 1
    const findOtherTerbanyak = resultData.filter(pendidikan => pendidikan.total == getTerbanyak.total)
    const generateTextTerbanyak = generateTextCalculation(findOtherTerbanyak, daerahKota.length, 'pendidikan')
    // generate text dari jumlah yang sedikit
    const getSedikit = resultData.sort((a, b) => b.total - a.total).reverse()[0]
    // ambil yang lain jika yang terbanyak ada lebih dari 1
    const findOtherSedikit = resultData.filter(pendidikan => pendidikan.total === getSedikit.total)
    const generateTextSedikit = generateTextCalculation(findOtherSedikit, daerahKota.length, 'pendidikan')

    return {
        terbanyak: generateTextTerbanyak,
        sedikit: generateTextSedikit
    }
}

function calculationGrafikGender(daerahKota) {
    const resultData = []
    JENIS_KELAMIN.forEach(jenis_kelamin => {
        const calculation = daerahKota.filter(user => user.jenis_kelamin == jenis_kelamin)
        resultData.push({ jenis_kelamin, total: calculation.length })
    })
    const jumlahSedikit = resultData.sort((a, b) => b.total - a.total).reverse()[0]
    const jumlahTerbanyak = resultData.sort((a, b) => b.total + a.total)[resultData.length - 1]
    const getTerbanyak = resultData.sort((a, b) => b.total + a.total)[resultData.length - 1]
    // ambil yang lain jika yang terbanyak ada lebih dari 1
    const findOtherTerbanyak = resultData.filter(jenis_kelamin => jenis_kelamin.total == getTerbanyak.total)
    const generateTextTerbanyak = generateTextCalculation(findOtherTerbanyak, daerahKota.length, 'jenis_kelamin')
    // generate text dari jumlah yang sedikit
    const getSedikit = resultData.sort((a, b) => b.total - a.total).reverse()[0]
    // ambil yang lain jika yang terbanyak ada lebih dari 1
    const findOtherSedikit = resultData.filter(jenis_kelamin => jenis_kelamin.total === getSedikit.total)
    const generateTextSedikit = generateTextCalculation(findOtherSedikit, daerahKota.length, 'jenis_kelamin')

    return {
        terbanyak: generateTextTerbanyak,
        sedikit: generateTextSedikit
    }
}

function calculationGrafikAge(ageData, daerahKota) {
    const resultData = []
    ageData.forEach(age => {
        const calculation = daerahKota.filter(user => user.Tanggal_Lahir.split('-')[0] === age.age)
        resultData.push({ age: `${new Date().getFullYear() - Number(age.age)} tahun`, total: calculation.length })
    })
    const jumlahSedikit = resultData.sort((a, b) => b.total - a.total).reverse()[0]
    const jumlahTerbanyak = resultData.sort((a, b) => b.total + a.total)[resultData.length - 1]
    const getTerbanyak = resultData.sort((a, b) => b.total + a.total)[resultData.length - 1]
    // ambil yang lain jika yang terbanyak ada lebih dari 1
    const findOtherTerbanyak = resultData.filter(age => age.total == getTerbanyak.total)
    const generateTextTerbanyak = generateTextCalculation(findOtherTerbanyak, daerahKota.length, 'age')
    // generate text dari jumlah yang sedikit
    const getSedikit = resultData.sort((a, b) => b.total - a.total).reverse()[0]
    // ambil yang lain jika yang terbanyak ada lebih dari 1
    const findOtherSedikit = resultData.filter(age => age.total === getSedikit.total)
    const generateTextSedikit = generateTextCalculation(findOtherSedikit, daerahKota.length, 'age')

    return {
        terbanyak: generateTextTerbanyak,
        sedikit: generateTextSedikit
    }
}

function generateTextCalculation(data, totalDataPustakawan, nameTitle) {
    const generateText = data.map(item => ({
        [nameTitle]: item[nameTitle],
        total: item.total,
        text: `${item[nameTitle]} sebanyak ${item.total} orang (${((item.total / totalDataPustakawan) * 100).toFixed(2)}%)`
    }))
    return generateText
}

function getBase64Image(img) {
    let canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    let dataURL = canvas.toDataURL('image/jpeg')
    return dataURL
}

async function makeHTML2Canvas(elementId) {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            html2canvas(document.getElementById(elementId), {
                onrendered: function (canvas) {
                    let data = canvas.toDataURL('image/jpeg')
                    return data
                }
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        }, 500);
    })
}
// end pustakawan Daerah Kota