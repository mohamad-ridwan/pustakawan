function createDateFormat(date){
    const days = dayjs(date).format('YYYY/MM/DD')
    return days
}