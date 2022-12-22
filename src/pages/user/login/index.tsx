import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import Loading from '../../../../components/molecules/Loading';
import Login_or_Registration from '../../../../components/organisms/Login_or_Registration'
import { handleErrorFirebase } from '../../../../components/utils/handleErrorFirebase';
import { setAuthTokenInLocalStorage } from '../../../../components/utils/setAuthTokenInLocalStorage';
import { auth } from '../../../config/firebase';
import { Firebase_User } from '../../../interfaces/firebase_user.interface';
import { handleOpenModal, setModalTitleAndDescription } from '../../../store/reducers/modal_error';
import { login } from '../../../store/reducers/user';

const index = () => {
  const router = useRouter()
  const { type }: any /* 'registration' | 'login' | 'reset_password' */ = router.query;
  const [loading, setLoading] = useState(false)
  const [typeForm, settypeForm] = useState<'registration' | 'login' | 'reset_password'>('registration')
  const user: Firebase_User = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user?.shopId) {
      router.push('/shop/prodotti')
    } if (user && !user?.Not_yet_Authenticated_Request) {
      router.push('/')
    }
    if (type) {
      settypeForm(type)
    }
  }, [type])

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true)

    if (typeForm === 'registration') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        // Signed in 
        const user = userCredential.user;
        const idToken = await userCredential.user.getIdToken(true);
        setAuthTokenInLocalStorage(idToken)
        console.log(user);
        return router.push('/')
      } catch (error: any) {
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
        const isShop = tokenResult.claims.isShop ? true : false
        // setemail('')
        // setpassword('')
        return router.push('/')
        setLoading(false)

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
          <Login_or_Registration handleSubmitToPage={handleSubmit} handleType={(type: "registration" | "login" | "reset_password") => { settypeForm(type) }} type={typeForm} title={`${typeForm === 'login' ? 'Accedi al ' : ''}${typeForm === 'registration' ? 'Registra il ' : ''}${typeForm === 'reset_password' ? 'Resetta la password del ' : ''}tuo account`} />
        )
      }
    </Desktop_Layout>
  )
}

export default index