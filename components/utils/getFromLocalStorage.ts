
export const getFromLocalStorage = (element: string) => {
    if (typeof window !== "undefined") {
        const value = localStorage.getItem(element)
        return value
    }
    return
}