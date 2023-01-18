export const deleteAuthTokenInSessionStorage =  () => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('authorization_token');
    }
}