const fontTable = 7
const fontSizeProperty = 'fontSize'

// pustakawan Daerah Kota
const H_DaerahKota = [createTextPDF('No.', true), createTextPDF('Nama', true), createTextPDF('Jabatan', true), createTextPDF('Pangkat', true), createTextPDF('Instansi', true)]
const params = new URLSearchParams(window.location.search)

if(params?.get('dataDaerah')){
    postFormDataAPI(POST_API_PUSTAKAWAN, {
        method: 'GET'
    })
    .then(res=>{
        if(res?.length > 0){
            const usersData = res.filter(data=>data.role == 'Users')
            if(usersData.length > 0){
                const daerahKota = usersData.filter(user=>user.lokasi_instansi == params.get('dataDaerah'))
                if(daerahKota.length > 0){
                    const newData = daerahKota.map((user, index)=>[createTextPDF(`${index + 1}.`), createTextPDF(user.nama_users), createTextPDF(user.jabatan_fungsional), createTextPDF(user.pangkat), createTextPDF(user.istansi)])
                    docDefinition.content.unshift({text: `Jumlah Pustakawan dari Kota (${params.get('dataDaerah')}): ${daerahKota.length}`, margin: [0, 10, 0, 10]})
                    docDefinition.content[1].table.body.push(H_DaerahKota)
                    let count = 0
                    newData.forEach(user=>{
                        count = count + 1
                        docDefinition.content[1].table.body.push(user)
                    })
                    if(count === newData.length){
                        openTabPDF(docDefinition)
                    }
                }else{
                    alert(`Data pustakawan tidak ditemukan dari kota "${params.get('dataDaerah')}"`)
                }
            }
        }
    })
    .catch(err=>{
        alert('terjadi kesalahan server.\nmohon coba beberapa saat lagi')
        console.log(err)
    })
}

function createTextPDF(text, isBold){
    return {
        text,
        bold: isBold ?? false,
        [fontSizeProperty]: fontTable,
    }
}
// end pustakawan Daerah Kota