export const removeSpecialCharacters = (string: string) => {
    return string.replace(/[^A-zÀ-ú_ ]/g, '');
}