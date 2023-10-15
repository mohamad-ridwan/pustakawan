function createDateFormat(date){
    const days = dayjs(date).format('MM/DD/YYYY')
    return days
}