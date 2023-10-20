function createRangeOfYears() {
    const dataYears = [{
        data_tokens: 'silahkan-pilih',
        value: 'Silahkan Pilih'
    }]
    const currentYears = new Date().getFullYear()
    let count = 0
    for (let i = 1800; i < parseInt(currentYears) + 1; i++) {
        dataYears.push({
            data_tokens: `${i}`,
            value: `${i}`
        })
        count = i + 1
    }
    if (count - 1 === parseInt(currentYears)) {
        return dataYears
    }
    return [{
        data_tokens: currentYears,
        value: currentYears
    }]
}