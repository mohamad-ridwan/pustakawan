const wrapCard = document.getElementById('wrapCard')

postFormDataAPI(POST_API_PUSTAKAWAN, {
    method: 'GET'
})
    .then(res => {
        if (res?.length > 0) {
            const usersData = res.filter(data => data.role == 'Users')
            if (usersData.length > 0) {
                const removeDuplicateKota = usersData.filter((v, i, s) =>
                    i === s.findIndex((t) => (
                        t.lokasi_instansi === v.lokasi_instansi
                    ))
                )
                removeDuplicateKota.forEach(user => {
                    let createDiv = document.createElement('div')
                    createDiv.setAttribute('class', 'col-sm-6 col-md-5')

                    createDiv.innerHTML = `
                    <div class="thumbnail">
                    <div class="caption">
                        <a href="${window.location.origin}/pages/generate-pdf/generate-pdf.html?dataDaerah=${user.lokasi_instansi}" target="_blank">
                            <div class="thumb-icon">
                                <img src="/images/pdf.webp"/>
                            </div>
                        </a>
                        <h3><strong>Direktori Tenaga Perpustakaan Daerah Kota (${user.lokasi_instansi})</strong></h3>
                        <p>Direktori Tenaga Perpustakaan dari masing-masing Daerah Kota.</p>
                        <div style="display: flex; justify-content: flex-end;">
                            <p><a href="${window.location.origin}/pages/generate-pdf/generate-pdf.html?dataDaerah=${user.lokasi_instansi}" target="_blank" class="btn btn-primary"
                                    role="button">Unduh</a></p>
                        </div>
                    </div>
                </div>
                    `
                    wrapCard.appendChild(createDiv)
                })
            } else {
                alert('tidak ada data pustakawan yang tersedia')
            }
        } else {
            alert('tidak ada data pustakawan yang tersedia')
        }
    })
    .catch(err => {
        alert('terjadi kesalahan server.\nmohon coba beberapa saat lagi')
        console.log(err)
    })