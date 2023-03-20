export const setInLocalStorage = (element: any, value: any) => {
    if (typeof window !== 'undefined') {
        if (typeof value === 'object') {
            localStorage.setItem(element, JSON.stringify(value))
        }
        else {
            localStorage.setItem(element, value)
        }
    }
}