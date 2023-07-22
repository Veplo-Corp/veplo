
const createUrlSchema = (parameters: string[] | any | undefined | null) => {

    if (!parameters) return ''
    let url = ''
    for (const parameter of parameters) {
        if (url === '') {
            url += parameter
        } else {
            url += '-' + parameter
        }
    }
    return url.replace(/\s+/g, '-').toLowerCase();

}

export default createUrlSchema