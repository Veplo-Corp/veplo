import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';

const Shop_not_Allowed: React.FC<{ children: any }> = ({ children }) => {
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const router = useRouter();

    useEffect(() => {

        const abortController = new AbortController();
        //if (user && user.statusAuthentication === 'logged_in') return
        if (user?.isBusiness) {
            if (user.favouriteShop) {
                router.push('/shop/home/' + user.favouriteShop.id + '/ordini?statusOrder=tutti&page=1')
                return
            }
            router.push('/shop/home')
        }
        return () => {
            abortController.abort();
        };
    }, [user])



    return (
        <div>
            <>{children}</>
        </div>

    )
}

export default Shop_not_Allowed