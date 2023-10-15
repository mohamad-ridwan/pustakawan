function createHourFormat(date) {
    const hours = date.getHours().toString().length === 1 ? `0${date.getHours()}` : date.getHours()
    const minutes = date.getMinutes().toString().length === 1 ? `0${date.getMinutes()}` : date.getMinutes()
    const seconds = date.getSeconds().toString().length === 1 ? `0${date.getSeconds()}` : date.getSeconds()
    const clock = `${hours}:${minutes}:${seconds}`

    return clock
}