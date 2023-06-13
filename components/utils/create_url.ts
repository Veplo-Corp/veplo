
const createUrlSchema = (parameters: string[] | undefined) => {
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