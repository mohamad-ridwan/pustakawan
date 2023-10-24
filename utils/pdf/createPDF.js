const paramsURL = new URLSearchParams(window.location.search)

// body pdf
let docDefinition = {
    footer: function (currentPage, pageCount) { return {text: currentPage.toString() + ' of ' + pageCount, margin: [20, 20, 20, 20], alignment: 'right'} },
    header: function (currentPage, pageCount, pageSize) {
        // you can apply any logic and return any valid pdfmake element

        return [
            { text: `Transkrip Data Pustakawan dari Kota (${paramsURL?.get('dataDaerah')})`, alignment: (currentPage % 2) ? 'left' : 'right', margin: [20, 20, 20, 20] },
            { canvas: [{ type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 }] }
        ]
    },
    content: [
        {
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
    ],
}

// untuk open tab pdf
// pdfMake.createPdf(dd).open()
// untuk download pdf
// pdfMake.createPdf(dd).download()

function openTabPDF(docDefinition) {
    pdfMake.createPdf(docDefinition).open({}, window)
}