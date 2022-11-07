export const setAuthTokenInLocalStorage =  (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('authorization_token', token);
    }
}