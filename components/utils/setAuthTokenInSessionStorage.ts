export const setAuthTokenInSessionStorage = (token: string) => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('authorization_token', token);
    }
}

