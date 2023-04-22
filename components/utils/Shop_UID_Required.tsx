import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';

const Shop_UID_Required: React.FC<{ children: any }> = ({ children }) => {
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const router = useRouter();

    useEffect(() => {
        const abortController = new AbortController();
        if (user && user.statusAuthentication === 'logged_in') return
        if (!user || !user.isBusiness) {
            router.push('/shop/login?type=login')
            //return console.log('redirect to login');
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