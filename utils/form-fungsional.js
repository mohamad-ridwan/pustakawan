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
    if(files !== undefined){
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
        .then(res=>{
            compressClientImg(res.file)
            .then(resCompressed=>{
                imgData.files = resCompressed
            })
            .catch(err=>console.log(err))
            imgData.imgURL = res.webpImage
            changeLocalClientImg(res.webpImage)
        })
        .catch(err=>console.log(err))
    }else{
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

    let newSrc= ''

    return await new Promise((resolve, reject)=>{
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
            fetchImage.then(res=>res.blob())
            .then(blob=>{
                const fileImg = new File([blob], `${new Date().getTime()}`, blob)
                resolve({file: fileImg, webpImage})
            })
            .catch(err=>reject(err))
        }
    })
}

// compress img
async function compressClientImg(imgFile){
    return await new Promise((resolve, reject)=>{
        const controller = new AbortController()

        const options = {
            maxSizeMB: 1,
            signal: controller.signal,
            maxWidthOrHeight: 150,
            useWebWorker: true,
        }
    
        imageCompression(imgFile, options)
        .then((compressedFile)=>resolve(compressedFile))
        .catch(err=>reject(err))
    
        setTimeout(() => {
            controller.abort(new Error('I just want to stop'))
        }, 1500);
    })
}

function changeLocalClientImg(imgBlobUrl){
    clientImg.setAttribute('src', imgBlobUrl)
    btnDeleteClientImg.style.display = 'flex'
}

function deleteClientImg(){
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