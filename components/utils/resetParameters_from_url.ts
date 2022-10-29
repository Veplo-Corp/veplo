
const resetParametersFromUrl = (parameters:string) => {
    
    return parameters.replace(/-/g, ' ').toLowerCase();
    
}

export default resetParametersFromUrl