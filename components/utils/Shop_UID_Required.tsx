import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const Shop_UID_Required = ({ children }) => {

    const user = useSelector((state) => state.user.user);
    //console.log(user);
    const router = useRouter();

    useEffect(() => {
        const abortController = new AbortController();
        if(user && user.Not_yet_Authenticated_Request === true) return
        if ( !user || !user.isShop) {
            router.push('/shop/login')
            //return console.log('redirect to login');
        } else {
            //console.log(user);
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