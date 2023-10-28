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
const params = new URLSearchParams(window.location.search)

if (params?.get('dataDaerah')) {
    postFormDataAPI(POST_API_PUSTAKAWAN, {
        method: 'GET'
    })
        .then(res => {
            if (res?.length > 0) {
                const usersData = res.filter(data => data.role == 'Users')
                if (usersData.length > 0) {
                    const daerahKota = usersData.filter(user => user.lokasi_instansi == params.get('dataDaerah'))
                    if (daerahKota.length > 0) {
                        const data_fungsional_pustakawan = daerahKota.filter(user=>user.jabatan_fungsional !== 'null')
                        const data_tenaga_pustakawan = daerahKota.filter(user=>user.status_dinas !== 'null')

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

                        // tabel data tenaga pustakawan
                        const dataTableTenagaPustakawan = createTableTenagaPustakawan()
                        docDefinition.content.push(createTextPDF('TABEL DATA TENAGA PERPUSTAKAAN', true, 10, undefined, 'before'))
                        dataTableTenagaPustakawan.table.body.push(H_DaerahKota)
                        dataTableTenagaPustakawan.table.body.push([createTextPDF('FUNGSIONAL PUSTAKAWAN', true, fontTable, green_header, undefined, undefined, 5, undefined), {}, {}, {}, {}])
                        getData_FUNGSIONAL_PUSTAKAWAN.forEach(user => {
                            dataTableTenagaPustakawan.table.body.push(user)
                        })
                        dataTableTenagaPustakawan.table.body.push([createTextPDF('TENAGA PUSTAKAWAN', true, fontTable, green_header, undefined, undefined, 5, undefined), {}, {}, {}, {}])
                        getData_TENAGA_PUSTAKAWAN.forEach(user => {
                            dataTableTenagaPustakawan.table.body.push(user)
                        })
                        docDefinition.content.push(dataTableTenagaPustakawan)
                        openTabPDF(docDefinition)
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
}

function createTextPDF(text, isBold, fontSize, fillColor, pageBreak, rowSpan, colSpan, alignment) {
    return {
        text,
        bold: isBold ?? false,
        [fontSizeProperty]: fontSize,
        fillColor: fillColor,
        pageBreak: pageBreak,
        rowSpan: rowSpan,
        colSpan: colSpan,
        alignment: alignment,
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
                [createTextPDF('No.', true, fontTable, color_header, undefined, 2, undefined, 'center'), createTextPDF('Jabatan / Status Kedinasan', true, fontTable, color_header, undefined, 2, undefined, 'center'), createTextPDF('Jenis Perpustakaan', true, fontTable, color_header, undefined, undefined, 4, 'center'), {}, {}, {}, createTextPDF('Jumlah', true, fontTable, color_header, undefined, 2, undefined, 'center')],
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
// end pustakawan Daerah Kota