export const handleErrorFirebase = (error) => {
    switch (error) {
        case 'auth/email-already-in-use':
            console.log('eccolo');
            
            return {
                title: 'Email già esistente',
                description: 'impossibile registrare la mail perchè già esistente'
            }
            break;
    
        default:
            break;
    }
}