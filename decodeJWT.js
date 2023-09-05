window.onload = ()=>{
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('akses')
    // decode jwt
    let newToken = {}
    newToken.payload = JSON.parse(window.atob(token.split('.')[1]))
    console.log(newToken)
}