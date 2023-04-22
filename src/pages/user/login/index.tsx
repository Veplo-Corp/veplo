import { useLazyQuery, useMutation } from '@apollo/client';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import Loading from '../../../../components/molecules/Loading';
import Login_or_Registration, { UserInfo } from '../../../../components/organisms/Login_or_Registration'
import { handleErrorFirebase } from '../../../../components/utils/handleErrorFirebase';
import { setAuthTokenInSessionStorage } from '../../../../components/utils/setAuthTokenInSessionStorage';
import { auth } from '../../../config/firebase';
import { Firebase_User } from '../../../interfaces/firebase_user.interface';
import { handleOpenModal, setModalTitleAndDescription } from '../../../store/reducers/modal_error';
import { login } from '../../../store/reducers/user';
import CREATE_USER from '../../../lib/apollo/mutations/createUser';
import GET_USER from '../../../lib/apollo/queries/getUser';

const index = () => {
  const router = useRouter()
  const { type }: any /* 'registration' | 'login' | 'reset_password' */ = router.query;
  const [loading, setLoading] = useState(true)
  const [typeForm, settypeForm] = useState<'registration' | 'login' | 'reset_password'>('registration')
  const user: Firebase_User = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [createUser] = useMutation(CREATE_USER);
  const [getUser] = useLazyQuery(GET_USER);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, [])


  useEffect(() => {

    if (user && user?.shopId) {
      router.push('/shop/prodotti')
    }
    //da rivedere la logica
    if (user?.uid && user.statusAuthentication === 'logged_out') {
      router.push('/')
    }
    if (type) {
      settypeForm(type)
    }
  }, [type])

  const handleSubmit = async (email: string, password: string, userInfo: UserInfo) => {
    console.log(userInfo);
    setLoading(true)

    if (typeForm === 'registration') {
      try {
        // Signed in 
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        //! age ora è Int, ma verrà gestita come date o string con rilascio
        const user = userCredential.user;
        let idToken = await userCredential.user.getIdToken(true);
        setAuthTokenInSessionStorage(idToken)
        console.log(userInfo);
        const response = await createUser({
          variables: {
            options: {
              ...userInfo,
            }
          }
        })
        console.log(response);
        idToken = await userCredential.user.getIdToken(true);
        setAuthTokenInSessionStorage(idToken)
        dispatch(
          login({
            email: userCredential.user.email,
            uid: userCredential.user.uid,
            idToken: idToken,
            emailVerified: false,
            createdAt: 'now',
            accountId: response?.data.createUser,
            userInfo: {
              name: userInfo.name
            }
          })
        );
        if (typeof router.query?.callbackUrl === 'string') {
          return router.push(router.query?.callbackUrl)
        } else {
          return router.push('/')

        }
      } catch (error: any) {
        console.log(error);
        setLoading(false)
        const errorCode = error.code;
        const errorMessage = error.message;
        //console.log(errorCode);
        console.log(errorCode);
        const errorForModal = handleErrorFirebase(error.code)
        dispatch(setModalTitleAndDescription({
          title: errorForModal?.title,
          description: errorForModal?.description
        }))
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const tokenResult = await userCredential.user.getIdTokenResult();
        const isBusiness = tokenResult.claims.isBusiness ? true : false
        setLoading(false)

        if (typeof router.query?.callbackUrl === 'string') {
          return router.push(router.query?.callbackUrl)
        }
        else if (!isBusiness) {
          return router.push('/')
        }

        else if (isBusiness) {
          return router.push('/shop/home')
        }
      } catch (error: any) {
        setLoading(true)
        const errorCode = error.code;
        const errorMessage = error.message;
        //console.log(errorCode);
        console.log(error);
        const errorForModal = handleErrorFirebase(errorMessage)
        dispatch(setModalTitleAndDescription({
          title: errorForModal?.title,
          description: errorForModal?.description
        }))
        setLoading(false)

        dispatch(handleOpenModal)
      }
    }
  }

  return (
    <Desktop_Layout>
      {loading ?
        (
          <Loading />
        )
        :
        (
          <div className='flex w-full mt-8 md:mt-10' >
            <div className='md:p-3 space-y-4 m-auto'>
              <Login_or_Registration
                account='user'
                handleSubmitToPage={handleSubmit} handleType={(type: "registration" | "login" | "reset_password") => { settypeForm(type) }} type={typeForm} title={`${typeForm === 'login' ? 'Accedi al ' : ''}${typeForm === 'registration' ? 'Registra il ' : ''}${typeForm === 'reset_password' ? 'Resetta la password del ' : ''}tuo account`} />
            </div>
          </div>
        )
      }
    </Desktop_Layout>
  )
}

export default index