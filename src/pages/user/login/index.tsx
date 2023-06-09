import { useLazyQuery, useMutation } from '@apollo/client';
import { UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import Loading from '../../../../components/molecules/Loading';
import Login_or_Registration, { UserInfo } from '../../../../components/organisms/Login_or_Registration'
import { handleErrorFirebase } from '../../../../components/utils/handleErrorFirebase';
import { setAuthTokenInSessionStorage } from '../../../../components/utils/setAuthTokenInSessionStorage';
import { auth, provider } from '../../../config/firebase';
import { Firebase_User } from '../../../interfaces/firebase_user.interface';
import { handleOpenModal, setModalTitleAndDescription } from '../../../store/reducers/modal_error';
import { login } from '../../../store/reducers/user';
import CREATE_USER from '../../../lib/apollo/mutations/createUser';
import GET_USER from '../../../lib/apollo/queries/getUser';
import { Box, Button, Divider, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Text } from '@chakra-ui/react';
import AuthenticationLayout from '../../../../components/atoms/AuthenticationLayout';
import { SubmitHandler, useForm } from 'react-hook-form';
import { EyeClose, EyeEmpty, Lock, Mail } from 'iconoir-react';
import LoginAndRegistrationForm, { InputFormLogin } from '../../../../components/organisms/LoginAndRegistrationForm';
import { signInUser } from '../../../../components/utils/signInUser';
import { sendEmailVerificationHanlder } from '../../../../components/utils/emailVerification';
import CREATE_BUSINESS_ACCOUNT from '../../../lib/apollo/mutations/createBusinessAccount';

type InputForm = {
  email: string,
  password: string,
  firstName: string,
  lastName: string
}

const index = () => {
  const router = useRouter()
  const { type, person } = router.query;
  const [isLoading, setIsLoading] = useState(false)
  const user: Firebase_User = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [createUser] = useMutation(CREATE_USER);
  const [getUser] = useLazyQuery(GET_USER);
  const [setBusinessAccount] = useMutation(CREATE_BUSINESS_ACCOUNT)



  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, reset, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<InputForm>({
    mode: "onBlur"
  });




  useEffect(() => {

    if (user && user?.isBusiness) {
      router.replace('/shop/home')
    }
  }, [user])




  // const handleSubmit = async (email: string, password: string, userInfo: UserInfo) => {
  //   console.log(userInfo);
  //   setIsLoading(true);


  //   if (typeForm === 'registration') {
  //     try {
  //       // Signed in 
  //       const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  //       //! age ora è Int, ma verrà gestita come date o string con rilascio
  //       const user = userCredential.user;
  //       let idToken = await userCredential.user.getIdToken(true);
  //       setAuthTokenInSessionStorage(idToken)
  //       console.log(userInfo);
  //       const response = await createUser({
  //         variables: {
  //           options: {
  //             ...userInfo,
  //           }
  //         }
  //       })
  //       console.log(response);
  //       idToken = await userCredential.user.getIdToken(true);
  //       setAuthTokenInSessionStorage(idToken)
  //       dispatch(
  //         login({
  //           email: userCredential.user.email,
  //           uid: userCredential.user.uid,
  //           idToken: idToken,
  //           emailVerified: false,
  //           createdAt: 'now',
  //           accountId: response?.data.createUser,
  //           userInfo: {
  //             name: userInfo.name
  //           }
  //         })
  //       );
  //       if (typeof router.query?.callbackUrl === 'string') {
  //         return router.replace(router.query?.callbackUrl)
  //       } else {
  //         return router.replace('/')
  //       }
  //     } catch (error: any) {
  //       console.log(error);
  //       setIsLoading(false)
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       //console.log(errorCode);
  //       console.log(errorCode);
  //       const errorForModal = handleErrorFirebase(error.code)
  //       dispatch(setModalTitleAndDescription({
  //         title: errorForModal?.title,
  //         description: errorForModal?.description
  //       }))
  //     }
  //   } else {
  //     try {
  //       const userCredential = await signInWithEmailAndPassword(auth, email, password)
  //       const tokenResult = await userCredential.user.getIdTokenResult();
  //       const isBusiness = tokenResult.claims.isBusiness ? true : false
  //       setIsLoading(false)

  //       if (typeof router.query?.callbackUrl === 'string') {
  //         return router.replace(router.query?.callbackUrl)
  //       }
  //       else if (!isBusiness) {
  //         return router.replace('/')
  //       }

  //       else if (isBusiness) {
  //         return router.replace('/shop/home')
  //       }
  //     } catch (error: any) {
  //       setIsLoading(true)
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       //console.log(errorCode);
  //       console.log(error);
  //       const errorForModal = handleErrorFirebase(errorMessage)
  //       dispatch(setModalTitleAndDescription({
  //         title: errorForModal?.title,
  //         description: errorForModal?.description
  //       }))
  //       setIsLoading(false)

  //       dispatch(handleOpenModal)
  //     }
  //   }
  // }







  const handleEvent = async (data: InputFormLogin) => {
    setIsLoading(true)
    if (type === 'login') {
      signInUser(data.email, data.password)
      try {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
        const tokenResult = await userCredential.user.getIdTokenResult();
        const isBusiness = tokenResult.claims.isBusiness ? true : false
        setIsLoading(false)

        if (typeof router.query?.callbackUrl === 'string') {
          return router.replace(router.query?.callbackUrl)
        }
        else if (!isBusiness) {
          return router.replace('/negozi')
        }
        else if (isBusiness) {
          return router.replace('/shop/home')
        }
      } catch (error: any) {
        setIsLoading(true)
        const errorCode = error.code;
        const errorMessage = error.message;
        //console.log(errorCode);
        console.log(error);
        const errorForModal = handleErrorFirebase(errorMessage)
        dispatch(setModalTitleAndDescription({
          title: errorForModal?.title,
          description: errorForModal?.description
        }))
        setIsLoading(false)

      }
    }
    else if (type === 'registration') {
      try {
        // Signedup
        if (person === 'user') {
          const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
          //! age ora è Int, ma verrà gestita come date o string con rilascio
          let idToken = await userCredential.user.getIdToken(true);
          const response = await createUser({
            variables: {
              options: {
                name: data.firstName,
                surname: data.lastName,
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
                name: data.firstName
              }
            })
          );
          setIsLoading(false)
          if (typeof router.query?.callbackUrl === 'string') {
            return router.replace(router.query?.callbackUrl)
          } else {
            return router.replace('/negozi')
          }
        } if (person === 'business') {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
            // Signed in 
            const idToken = await userCredential.user.getIdToken(true);
            setAuthTokenInSessionStorage(idToken)
            console.log(idToken);
            await sendEmailVerificationHanlder()
            const account = await setBusinessAccount()
            console.log(account);
            await router.replace('/shop/crea-business-account')
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
            setIsLoading(false)
          }
          setIsLoading(false)

        }

      } catch (error: any) {
        console.log(error);
        setIsLoading(false)
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
    }
  }



  const signInWithGoogle = async () => {
    if (person !== 'user') return
    setIsLoading(true)
    let result: UserCredential | undefined;
    try {
      result = await signInWithPopup(auth, provider)

    } catch (error: any) {
      const errorMessage = error.message;
      //console.log(errorCode);
      console.log(error);
      const errorForModal = handleErrorFirebase(errorMessage)
      dispatch(setModalTitleAndDescription({
        title: errorForModal?.title,
        description: errorForModal?.description
      }))
      setIsLoading(false)
    }


    if (result === undefined) return

    const fullName = result.user.displayName ? result.user.displayName.split(" ") : null;
    const idToken = await result.user.getIdToken(true);
    setAuthTokenInSessionStorage(idToken)
    createUser({
      variables: {
        options: {
          name: fullName ? fullName[0] : null,
          surname: fullName ? fullName?.slice(1).join(" ") : null
        }
      }
    }).then((response: any) => {
      console.log(response);
      dispatch(
        login({
          email: result ? result.user.email : '',
          uid: result ? result.user.uid : '',
          idToken: idToken,
          emailVerified: false,
          createdAt: 'now',
          accountId: response?.data.createUser,
          userInfo: {
            name: fullName ? fullName[0] : null
          }
        })
      );
      setIsLoading(false)

    }).catch((error) => {
      console.log(error);
      setIsLoading(false)

    })
    if (typeof router.query?.callbackUrl === 'string') {
      return router.replace(router.query?.callbackUrl)
    } else {
      return router.replace('/negozi')
    }
  }

  return (
    <AuthenticationLayout>

      <Button
        className='absolute top-3 left-1 lg:top-5 lg:left-3'
        fontSize={['25px', '3xl']}
        fontWeight={'black'}
        colorScheme='white'
        onClick={() => {
          router.replace('/negozi')
        }}
      >VEPLO</Button>
      <Box className='mt-[18vh]'>
        <LoginAndRegistrationForm
          isLoading={isLoading}
          type={(type === 'login' || type === 'registration' || type === 'reset_password') ? type : undefined}
          person={(person === 'business' || person === 'user') ? person : undefined}
          handleChangeTypeOrPerson={(type, person) => {
            router.replace(`/user/login?type=${type}&person=${person}`)
          }}
          handleEvent={handleEvent}
          signInWithGoogle={signInWithGoogle}
        />
      </Box>


      {/* <div className='flex w-full mt-8 md:mt-10' >
        <div className={`${loading ? '' : 'hidden'} m-auto`}>
          <Loading />
        </div>

        <div className={`lg:min-w-[60vh] md:p-3 space-y-4 m-auto ${loading ? 'hidden' : ''}`}>
          {router.query?.callbackUrl && <Box
            padding={4}
            background={'#F2F2F2'}
            borderRadius={'10px'}
          >
            <Text
              fontWeight={'semibold'}
              fontSize={'lg'}
            >
              per aggiungere prodotti alla borsa<br />bisogna effettuare l'accesso
            </Text>
          </Box>}
          <Login_or_Registration
            account='user'
            handleSubmitToPage={handleSubmit}
            handleType={(type: "registration" | "login" | "reset_password") => { settypeForm(type) }}
            handleGoogle={handleGoogle}
            type={typeForm} title={`${typeForm === 'login' ? 'Accedi al ' : ''}${typeForm === 'registration' ? 'Registra il ' : ''}${typeForm === 'reset_password' ? 'Resetta la password del ' : ''}tuo account`} />
        </div>
      </div> */}


    </AuthenticationLayout >
  )
}

export default index

