
export const removeFromLocalStorage = (element: string) => {
    if (typeof window !== "undefined") {
        const value = localStorage.removeItem(element)
        return value
    }
    return
}