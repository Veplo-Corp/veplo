export const numberOfLineText = (ref: any) => {
    const lineHeight = parseInt(getComputedStyle(ref).lineHeight);
    const numberOfLines = Math.ceil(ref.scrollHeight / lineHeight);
    return numberOfLines
}