const POST_API_PUSTAKAWAN = 'http://localhost/pustakawanbogor/api/pustakawan.php'

async function postFormDataAPI(dataSubmit) {
    try {
        const api = await fetch(POST_API_PUSTAKAWAN, {
            method: 'POST',
            body: JSON.stringify(dataSubmit)
        })
        const data = await api.json(res => res)
        return data
    } catch (error) {
        return error
    }
}