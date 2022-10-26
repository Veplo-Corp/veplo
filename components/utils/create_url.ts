
const createUrlSchema = (parameters:string[]) => {
    let url = ''
    for (const parameter of parameters) {
        if(url === ''){
            url += parameter
        } else {
            url += '-'+parameter
        }
    }
    return url.replace(/\s+/g, '-').toLowerCase();
    
}

export default createUrlSchema