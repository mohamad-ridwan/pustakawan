function openFileImg() {
    document.getElementById('fileClientImg').click()
}

let imgData = {
    files: null,
    imgURL: ''
}

const clientImg = document.getElementById('clientImg')
const btnDeleteClientImg = document.getElementById('deleteClientImg')

const elemImgFile = document.getElementById('fileClientImg')
elemImgFile.addEventListener('change', (e) => {
    const files = e.target.files
    if (files !== undefined) {
        validateImgExt(files)
    }
})

function validateImgExt(file) {
    const getTypeFile = file[0].type.split('/')[1]
    if (
        getTypeFile.toLowerCase() === 'jpg' ||
        getTypeFile.toLowerCase() === 'jpeg' ||
        getTypeFile.toLowerCase() === 'png' ||
        getTypeFile.toLowerCase() === 'webp'
    ) {
        createImgToWebp(file[0])
            .then(res => {
                compressClientImg(res.file)
                    .then(resCompressed => {
                        imgData.files = resCompressed
                    })
                    .catch(err => console.log(err))
                imgData.imgURL = res.webpImage
                changeLocalClientImg(res.webpImage)
            })
            .catch(err => console.log(err))
    } else {
        alert('File Harus berupa .jpg/.jpeg/.png/.webp')
    }
}

// convert img file to .webp
async function createImgToWebp(file) {
    let src = URL.createObjectURL(file)

    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')

    let newImg = new Image()
    newImg.src = src

    let newSrc = ''

    return await new Promise((resolve, reject) => {
        newImg.onload = () => {
            canvas.width = newImg.width
            canvas.height = newImg.height
            ctx?.drawImage(newImg, 0, 0)
            // convert canvas
            let webpImage = canvas.toDataURL('image/webp', 1)
            let img = new Image()
            img.src = webpImage
            newSrc = img.src

            const fetchImage = fetch(img.src)
            fetchImage.then(res => res.blob())
                .then(blob => {
                    const fileImg = new File([blob], `${new Date().getTime()}`, blob)
                    resolve({ file: fileImg, webpImage })
                })
                .catch(err => reject(err))
        }
    })
}

// compress img
async function compressClientImg(imgFile) {
    return await new Promise((resolve, reject) => {
        const controller = new AbortController()

        const options = {
            maxSizeMB: 1,
            signal: controller.signal,
            maxWidthOrHeight: 150,
            useWebWorker: true,
        }

        imageCompression(imgFile, options)
            .then((compressedFile) => resolve(compressedFile))
            .catch(err => reject(err))

        setTimeout(() => {
            controller.abort(new Error('I just want to stop'))
        }, 1500);
    })
}

function changeLocalClientImg(imgBlobUrl) {
    clientImg.setAttribute('src', imgBlobUrl)
    btnDeleteClientImg.style.display = 'flex'
}

function deleteClientImg() {
    clientImg.setAttribute('src', '/images/noimg.png')
    btnDeleteClientImg.style.display = 'none'
    imgData = {
        files: null,
        imgURL: ''
    }
}

// datepicker
$(function () {
    $("#tanggalLahirDP").datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date());
});
$(function () {
    $("#tamatPangkatDP").datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date());
});
$(function () {
    $("#tamatJabatanDP").datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date());
});

const dataNamaKolom = {
    jenisKelamin: {
        id: 'jenisKelamin',
        data: [
            {
                data_tokens: 'laki-laki',
                value: 'Laki-laki'
            },
            {
                data_tokens: 'perempuan',
                value: 'Perempuan'
            },
        ]
    },
    pendidikanTerakhir: {
        id: 'pendidikanTerakhir',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
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
    },
    jurusBidangPendidikan: {
        id: 'jurusBidangPendidikan',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
            },
            {
                data_tokens: 'non-perpustakaan',
                value: 'Non Perpustakaan'
            },
            {
                data_tokens: 'perpustakaan',
                value: 'Perpustakaan'
            },
            {
                data_tokens: '-',
                value: '-'
            },
            {
                data_tokens: 'pustakawan-disertakan',
                value: 'Pustakawan Disertakan'
            }
        ]
    },
    pangkat: {
        id: 'pangkat',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
            },
            {
                data_tokens: 'pengatur-muda-tk-I-(II/b)',
                value: 'Pengatur Muda Tk.I (II/b)'
            },
            {
                data_tokens: 'pengatur-(II/c)',
                value: 'Pengatur (II/c)'
            },
            {
                data_tokens: 'pengatur-tk-I-(II/d)',
                value: 'Pengatur Tk.I (II/d)'
            },
            {
                data_tokens: 'penata-muda-(III/a)',
                value: 'Penata Muda (III/a)'
            },
            {
                data_tokens: 'penata-muda-tk-I-(III/b)',
                value: 'Penata Muda Tk.I (III/b)'
            },
            {
                data_tokens: 'penata-(III/c)',
                value: 'Penata (III/c)'
            },
            {
                data_tokens: 'penata-tk-I-(III/d)',
                value: 'Penata Tk.I (III/d)'
            },
            {
                data_tokens: 'pembina-(IV/a)',
                value: 'Pembina (IV/a)'
            },
            {
                data_tokens: 'pembina-tk-I-(IV/b)',
                value: 'Pembina Tk.I (IV/b)'
            },
            {
                data_tokens: 'pembina-utama-muda-(IV/c)',
                value: 'Pembina Utama Muda (IV/c)'
            },
            {
                data_tokens: 'pembina-utama-madya-(IV/d)',
                value: 'Pembina Utama Madya (IV/d)'
            },
            {
                data_tokens: 'pembina-utama-(IV/e)',
                value: 'Pembina Utama (IV/e)'
            },
            {
                data_tokens: '-',
                value: '-'
            },
            {
                data_tokens: 'pengatur-muda-(II/a)',
                value: 'Pengatur Muda (II/a)'
            }
        ]
    },
    jabatanFungsional: {
        id: 'jabatanFungsional',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
            },
            {
                data_tokens: 'pustakawan-terampil-asisten-perpustakaan-terampil',
                value: 'Pustakawan Terampil / Asisten Perpustakaan  Terampil'
            },
            {
                data_tokens: 'pustakawan-mahir-asisten-perpustakaan-mahir',
                value: 'Pustakawan Mahir / Asisten Perpustakaan Mahir'
            },
            {
                data_tokens: 'pustakawan-penyelia-asisten-perpustakaan-penyelia',
                value: 'Pustakawan Penyelia / Asisten Perpustakaan  Penyelia'
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
                data_tokens: 'pustakawan-ahli-madya',
                value: 'Pustakawan Ahli Madya'
            },
            {
                data_tokens: 'pustakawan-ahli-utama',
                value: 'Pustakawan Ahli Utama'
            }
        ]
    },
    statusJabatan: {
        id: 'statusJabatan',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
            },
            {
                data_tokens: 'aktif',
                value: 'Aktif'
            },
            {
                data_tokens: 'dbs',
                value: 'DBS'
            }
        ]
    },
    diklatFungsional: {
        id: 'diklatFungsional',
        data: [
            {
                data_tokens: 'tidak-pernah',
                value: 'Tidak Pernah'
            },
            {
                data_tokens: 'diklat-cpta',
                value: 'Diklat CPTA'
            },
            {
                data_tokens: 'diklat-cptt',
                value: 'Diklat CPTT'
            },
            {
                data_tokens: 'diklat-alih-kategori',
                value: 'Diklat Alih Kategori'
            }
        ]
    },
    instansi: {
        id: 'instansi',
        data: [
            {
                data_tokens: 'silahkan-pilih',
                value: 'Silahkan Pilih'
            }
        ]
    }
}

function loadCreateSelect(elementId, data) {
    const elem = document.getElementById(elementId)
    if (elem) {
        data.forEach(item => {
            let node = document.createElement('option')
            node.setAttribute('data-tokens', item.data_tokens)
            const textNode = document.createTextNode(item.value)
            node.appendChild(textNode)
            elem.appendChild(node)
        })
    }
}

function setOptionElement() {
    Object.entries(dataNamaKolom).forEach(item => loadCreateSelect(item[1].id, item[1].data))
}

setOptionElement()