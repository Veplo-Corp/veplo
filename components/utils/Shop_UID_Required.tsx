import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';

const Shop_UID_Required: React.FC<{ children: any }> = ({ children }) => {
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const router = useRouter();

    useEffect(() => {
        const abortController = new AbortController();
        if ((user.statusAuthentication === 'logged_in' && !user.isBusiness) || (user.statusAuthentication === 'logged_out')) {
            router.push('/user/login?type=login&person=business')
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