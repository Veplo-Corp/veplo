import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';

const Shop_UID_Required = ({ children }) => {

    const user: Firebase_User = useSelector((state) => state.user.user);
    //console.log(user);
    const router = useRouter();

    useEffect(() => {
        const abortController = new AbortController();
        if(user && user.Not_yet_Authenticated_Request === true) return
        if ( !user || !user.isShop) {            
             router.push('/shop/login')
            //return console.log('redirect to login');
        } else if(user && user.shopId === null) {
             router.push('/shop/crea-shop')
        }
        return () => {
            abortController.abort();
        };
    }, [user])



    return (
        <div>{children}</div>
    )
}

export default Shop_UID_Required