import React, { useEffect, useReducer, useState } from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import { Button } from '@chakra-ui/react'
import BlackButton from '../../../../components/atoms/BlackButton'
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '../../../config/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from '../../../store/reducers/user'
import { sendEmailVerificationHanlder } from '../../../../components/utils/emailVerification'
import resetPassword from '../../../../components/utils/resetPassword'
import { useMutation, useQuery } from '@apollo/client'
import DELETE_PRODUCT from '../../../lib/apollo/mutations/deleteProduct'
import { setAuthTokenInSessionStorage } from '../../../../components/utils/setAuthTokenInSessionStorage'
import GET_SINGLE_PRODUCT from '../../../lib/apollo/queries/getSingleProduct'
import { initApollo } from '../../../lib/apollo'
import Modal_Error_Shop from '../../../../components/organisms/Modal_Error_Shop'
import { handleErrorFirebase } from '../../../../components/utils/handleErrorFirebase'
import { setModalTitleAndDescription, handleOpenModal } from '../../../store/reducers/modal_error'
import { useRouter } from 'next/router'
import { Firebase_User } from '../../../interfaces/firebase_user.interface'
import Login_or_Registration, { UserInfo } from '../../../../components/organisms/Login_or_Registration'
import CREATE_BUSINESS_ACCOUNT from '../../../lib/apollo/mutations/createBusinessAccount';

import Loading from '../../../../components/molecules/Loading'
import PostMeta from '../../../../components/organisms/PostMeta'
import List_Explanation_Veplo_Shop from '../../../../components/molecules/List_Explanation_Veplo_Shop'




const index = () => {
  const router = useRouter()
  const { type }: any /* 'registration' | 'login' | 'reset_password' */ = router.query
  //const [setIsShop] = useMutation(SET_IS_SHOP)
  const [setBusinessAccount] = useMutation(CREATE_BUSINESS_ACCOUNT)
  const [loading, setLoading] = useState(false)
  // const [showPassword, setshowPassword] = useState<boolean>(false)
  // const [email, setemail] = useState<string>('')
  // const [isValidEmail, setisValidEmail] = useState<boolean | null>(null)
  // const [isValidPassword, setisValidPassword] = useState<boolean | null>(null)
  const [typeForm, settypeForm] = useState<'registration' | 'login' | 'reset_password'>('registration')
  const user: Firebase_User = useSelector((state: any) => state.user.user);

  const dispatch = useDispatch();


  useEffect(() => {
    const abortController = new AbortController();

    //! da risolvere
    if (user && !user.Not_yet_Authenticated_Request) {
      console.log(user);

      if (typeof user.shopId === 'string') {
        router.push('/shop/prodotti')
      } else if (user?.isBusiness === true) {
        router.push('/shop/home')
      }
    }
    if (type) {
      settypeForm(type)
    }

    return () => {
      abortController.abort();
    };
  }, [type, user])


  // const [password, setpassword] = useState<string>('')
  //const [openModalMath, setOpenModalMath] = useState(1);


  // const emailHandler = (event) => {
  //   setemail(event.target.value)
  //   if (/\S+@\S+\.\S+/.test(event.target.value)) {
  //     return setisValidEmail(true)
  //   }
  // }

  // const emailErrorHandler = () => {
  //   if (/\S+@\S+\.\S+/.test(email)) {
  //     return setisValidEmail(true)
  //   }
  //   setisValidEmail(false)
  // }

  // const passwordHandler = (event) => {
  //   setpassword(event.target.value)
  //   if (event.target.value.length >= 8) {
  //     return setisValidPassword(true)
  //   }
  // }


  // const passwordErrorHandler = () => {
  //   if (password.length >= 8) {
  //     return setisValidPassword(true)
  //   } else {
  //     return setisValidPassword(false)
  //   }
  // }


  const handleSubmit = async (email: string, password: string, userInfo: UserInfo) => {
    setLoading(true)
    if (typeForm === 'registration') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        // Signed in 
        const idToken = await userCredential.user.getIdToken(true);
        setAuthTokenInSessionStorage(idToken)
        console.log(idToken);
        await sendEmailVerificationHanlder()

        //!deprecated
        // await setIsShop({
        //   variables: {
        //     isBusiness: true
        //   }
        // })


        const account = await setBusinessAccount()
        console.log(account);
        await router.push('/shop/crea-business-account')
        router.reload()
        // setemail('')
        // setpassword('')
      } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        //console.log(errorCode);
        console.log(errorCode);
        const errorForModal = handleErrorFirebase(error.code)
        dispatch(setModalTitleAndDescription({
          title: errorForModal?.title,
          description: errorForModal?.description
        }))
        setLoading(false)
      }
      setLoading(false)
    } else if (typeForm === 'login') {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const tokenResult = await userCredential.user.getIdTokenResult();
        const isBusiness = tokenResult.claims.isBusiness ? true : false
        if (!isBusiness) {
          // const errorForModal = handleErrorFirebase('auth/user-not-shop')
          // dispatch(setModalTitleAndDescription({
          //   title: errorForModal?.title,
          //   description: errorForModal?.description
          // }))
          router.push('/')
          throw new Error('auth/user-not-shop', { cause: 'err' })
        }

      } catch (error: any) {
        const errorMessage = error.message;
        console.log(errorMessage);
        const errorForModal = handleErrorFirebase(errorMessage)
        dispatch(setModalTitleAndDescription({
          title: errorForModal?.title,
          description: errorForModal?.description
        }))
        dispatch(handleOpenModal);
        setLoading(false)

      }
      setLoading(false)
    }
  }

  // const LoginButton = () => {
  //   return (
  //     <>
  //       <p className='mr-1 text-black	'>hai già un account?</p>
  //       <Button className='underline' onClick={() => {
  //         settypeForm('login')
  //       }
  //       } variant='link' colorScheme={'black'}>
  //         Accedi
  //       </Button>

  //     </>
  //   )
  // }



  return (
    <>
      {
        loading ?
          (
            <Loading />
          )
          :
          (
            <Desktop_Layout>
              <PostMeta
                canonicalUrl='https://www.veplo.it/shop/login'
                title={`Login Negozio | Veplo Shop`}
                subtitle={`accedi o registra un negozio  | Veplo.it`}
                image={''}
                description={`accedi o registra un negozio  | Veplo.it`}
              />
              <div className='max-w-md mx-auto md:max-w-full md:flex md:m-auto  w-full mt-8 md:mt-10 md:justify-between' >
                <div className={`md:p-3 w-full md:w-3/4 my-auto space-y-4 max-w-md mx-auto`}>
                  <Login_or_Registration
                    account='business'
                    handleSubmitToPage={handleSubmit} handleType={(type: "registration" | "login" | "reset_password") => { settypeForm(type) }} type={typeForm} title={`${typeForm === 'login' ? 'Accedi al ' : ''}${typeForm === 'registration' ? 'Registra il ' : ''}${typeForm === 'reset_password' ? 'Resetta la password del ' : ''}tuo negozio`} />
                </div>
                {typeForm === 'registration' &&
                  <div className='md:my-auto md:w-5/12 md:mr-10 mt-10 md:mt-0'>
                    <List_Explanation_Veplo_Shop />
                  </div>
                }
              </div>
            </Desktop_Layout>
          )
      }
    </>
    /* <div className='flex justify-between w-full'>
      <form className="p-3 space-y-4 w-full md:w-1/2" onSubmit={handleSubmit}>
        <h1 className="font-black text-xl md:text-3xl italic text-black-900  ">Iscrivi il tuo negozio</h1>
        <div>
          <div className="mt-1 flex rounded-sm md:w-96">
            <span className="inline-flex items-center rounded-l-md border-r-0 border-2 border-gray-900  bg-black px-3 text-sm text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
            <input
              onBlur={emailErrorHandler}
              value={email}
              autoComplete={'on'}
              onChange={emailHandler}
              type="text" name="email" id="email" className="block flex-1 rounded-r-md border-2 p-2 py-3 border-gray-900
              focus:outline-none
              sm:text-sm placeholder-black" placeholder="email" />
          </div>
          {isValidEmail === false && <p className='text-sm md:text-xs text-red-600'>email non corretta</p>}
        </div>
        {typeForm !== 'reset_password' && <div>
          <div className="mt-1 flex rounded-sm md:w-96">
            <span className="inline-flex items-center rounded-l-md border-r-0 border-2 border-gray-900  bg-black px-3 text-sm text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </span>
            <input
              onBlur={passwordErrorHandler}
              value={password}
              onChange={passwordHandler}
              autoComplete={'on'}
              type={showPassword ? 'text' : 'password'} name="password" id="password" className="block md:w-80 flex-1 border-2 border-r-0	 p-2 py-3 border-gray-900
              focus:outline-none
              sm:text-sm placeholder-black" placeholder="password" />
            <span className="inline-flex items-center rounded-r-md border-l-0 border-2 border-black   px-3 text-sm text-black" onClick={() => setshowPassword(!showPassword)}>
              {!showPassword && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>}
              {showPassword && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
              }
            </span>
          </div>
          {isValidPassword === false && <p className='text-sm md:text-xs text-red-600'>la password deve contentere almeno 8 caratteri</p>}
        </div>}
        {typeForm !== 'reset_password' &&
          <div className='w-full flex md:w-96 justify-end pt-2 md:pt-1'>
            <BlackButton disabled={!isValidEmail || !isValidPassword} typeButton='submit' element={typeForm == 'registration' ? 'registrati' : 'accedi'} borderRadius={10} size={'md'}></BlackButton>
          </div>}
        {typeForm === 'reset_password' && <div className='w-full flex justify-end pt-2 md:pt-1 md:w-96' onClick={() => resetPassword(email)}>
          <Button disabled={isValidEmail == null || false} onClick={() => resetPassword(email)} colorScheme={'orange'} borderRadius={10} size={'md'}>resetta password</Button>
        </div>}
        <div className='flex'>
          {(typeForm === 'registration') && <LoginButton openModalMath={openModalMath} />}
          {(typeForm === 'reset_password') && <LoginButton openModalMath={openModalMath} />}

          {typeForm === 'login' &&
            <div className='grid'>
              <p className=' text-black	'>non hai ancora un account?
                <Button className='underline ml-1' onClick={() => settypeForm('registration')} variant='link' colorScheme={'black'}>
                  Registrati
                </Button>
              </p>
              <p className='mt-1 text-black	'>hai dimenticato la tua password?
                <Button className='underline md:ml-1' onClick={() => settypeForm('reset_password')} variant='link' colorScheme={'black'}>
                  Resetta password
                </Button>
              </p>
            </div>
          }
        </div>
      </form>
    </div> */
  )



}

export default index;