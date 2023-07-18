const toUpperCaseFirstLetter = (string: string | undefined | null) => {
    if (!string) return
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default toUpperCaseFirstLetter