
export const getAddressFromLocalStorage = () => {
    if (typeof window !== "undefined") {
        const address = localStorage.getItem('address')
        console.log('indirizzo è ',address);
        
        if(address !== undefined && address !== null && address !== 'undefined') {return JSON.parse(address)}

      }
}