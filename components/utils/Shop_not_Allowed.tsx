import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';

const Shop_not_Allowed: React.FC<{ children: any }> = ({ children }) => {
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const router = useRouter();

    useEffect(() => {
        console.log(user);

        const abortController = new AbortController();
        if (user && user.Not_yet_Authenticated_Request === true) return
        if (user?.isBusiness) {
            router.push('/shop/home')
        }
        return () => {
            abortController.abort();
        };
    }, [user])



    return (
        <div>
            {!user || (!user?.isBusiness && !user.Not_yet_Authenticated_Request) && <>{children}</>}
        </div>

    )
}

export default Shop_not_Allowed