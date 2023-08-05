export const onChangeNumberPrice = (e: any) => {
    let inputValue: string = e.target.value.replace(',', '.');
    inputValue = inputValue.replace(/[^0-9\.|]/g, '')
    if (inputValue === '.') {
        return ''
    }
    if (inputValue.split('.')[1]) {
        if (inputValue.split('.')[1].length > 2) {
            const value = inputValue.slice(0, -1)
            inputValue = value.replace('.', ',')
            return inputValue
        }
    }
    inputValue = inputValue.replace('.', ',')
    inputValue = inputValue.replace('.', '')
    return inputValue
}