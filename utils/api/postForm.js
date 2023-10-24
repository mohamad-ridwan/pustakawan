const urlAPI = 'http://localhost/pustakawanbogor'

const POST_API_PUSTAKAWAN = 'api/pustakawan.php'
// post verifikasi
// http://localhost/pustakawanbogor/api/api_verifikasi.php?token=345353453&exp=20-10-2023&tokenClient=fsdfsdf4r534523dfgdfgqwer3
const POST_VERIFIKASI = 'api/api_verifikasi.php?'
const GET_VERIFIKASI = 'api/api_verifikasi.php'

async function postFormDataAPI(endpoint, objRequired) {
    try {
        const api = await fetch(`${urlAPI}/${endpoint}`, objRequired)
        const data = await api.json(res => res)
        return data
    } catch (error) {
        return error
    }
}

function createReqBody(data){
    var formBody = []
    for(var property in data){
        var encodedKey =  encodeURIComponent(property)
        var encodedValue = encodeURIComponent(data[property])
        formBody.push(encodedKey + '=' + encodedValue)
    }
    formBody = formBody.join('&')
    return formBody
}