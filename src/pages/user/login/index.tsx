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

type InputForm = {
  email: string,
  password: string,
  firstName: string,
  lastName: string
}

const index = () => {
  const router = useRouter()
  const { type }: any = router.query;
  const [loading, setLoading] = useState(true)
  const [typeForm, settypeForm] = useState<'registration' | 'login' | 'reset_password'>('registration')
  const user: Firebase_User = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [createUser] = useMutation(CREATE_USER);
  const [getUser] = useLazyQuery(GET_USER);



  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, reset, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<InputForm>({
    mode: "onBlur"
  });


  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, [])


  useEffect(() => {

    if (user && user?.shopId) {
      router.replace('/shop/prodotti')
    }
    //da rivedere la logica
    if (user?.uid && user.statusAuthentication === 'logged_out') {
      router.replace('/')
    }
    if (type) {
      settypeForm(type)
    }
  }, [type])




  // const handleSubmit = async (email: string, password: string, userInfo: UserInfo) => {
  //   console.log(userInfo);
  //   setLoading(true);


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
  //         return router.push(router.query?.callbackUrl)
  //       } else {
  //         return router.push('/')
  //       }
  //     } catch (error: any) {
  //       console.log(error);
  //       setLoading(false)
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
  //       setLoading(false)

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
  //       setLoading(true)
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       //console.log(errorCode);
  //       console.log(error);
  //       const errorForModal = handleErrorFirebase(errorMessage)
  //       dispatch(setModalTitleAndDescription({
  //         title: errorForModal?.title,
  //         description: errorForModal?.description
  //       }))
  //       setLoading(false)

  //       dispatch(handleOpenModal)
  //     }
  //   }
  // }

  const handleGoogle = async () => {
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
      setLoading(false)
    }


    console.log(result);
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

    }).catch((error) => {
      console.log(error);
    })
    if (typeof router.query?.callbackUrl === 'string') {
      return router.push(router.query?.callbackUrl)
    } else {
      return router.push('/')
    }
  }

  const onSubmit: SubmitHandler<InputForm> = (data, e) => {
    console.log(data, e);
  }

  const LoginButton = () => {
    return (
      <Box
        mt={3}
        display={'flex'}
        gap={0.5}
        fontSize={'16px'}
      >
        <Text
          color={'inputLoginColor.text'}
          className='mr-1 text-black	'>hai già un account?</Text>
        <Button

          color={'primaryBlack.text'}
          onClick={() => {
            //handleType('login')
          }
          }
          variant='link'
          fontSize={'16px'}
        >
          Accedi
        </Button>

      </Box>
    )
  }

  return (
    <AuthenticationLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='h-screen w-full flex'
      >
        <Box
          px={[4, 0]}
          margin={'auto'}
          zIndex={'10'}
        >
          <Text
            fontSize={'27px'}
            fontWeight={'black'}
            mb={1.5}
          >
            Benvenuto in <span className='text-[#FF5A78]'>Veplo</span>
          </Text>
          <InputGroup
            fontWeight={'medium'}
            bg={'inputLoginColor.bg'}
            fontSize={'12px'}
            size={'lg'}
            width={['full', '96']}
            borderRadius={'3xl'}
            borderWidth={0}
          >
            <Input
              borderWidth={0}
              focusBorderColor='primary.text'
              borderRadius={'10px'}
              placeholder='email'
              _placeholder={{
                color: 'inputLoginColor.text',
                fontWeight: '500'
              }}
              height={14}
              id="email"
              {...register("email", {
                required: true,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Inserisci una mail corretta",
                },
              })}
              type="email"
            >
            </Input>
            <InputLeftElement
              mt={1}
              ml={1}
              pointerEvents='none'
              children={
                <Mail
                  color='#A19F9F'
                  fontSize={16}
                  strokeWidth={1.4}
                />
              }
            />

          </InputGroup>
          {errors.email && <Text
            pl={2}
            mt={0.5}
            fontSize={'sm'}
            fontWeight={'medium'}
            role="alert">{errors.email.message}</Text>}
          <InputGroup
            mt={3}
            fontWeight={'medium'}
            bg={'inputLoginColor.bg'}
            fontSize={'12px'}
            size={'lg'}
            width={['full', '96']}
            borderRadius={'3xl'}
            borderWidth={0}
          >
            <Input
              borderWidth={0}
              focusBorderColor='primary.text'
              borderRadius={'10px'}
              placeholder='password'
              _placeholder={{
                color: 'inputLoginColor.text',
                fontWeight: '500'
              }}
              height={14}
              id="password"
              {...register("password", {
                required: true,
                minLength: {
                  value: 8,
                  message: 'La password deve essere di almeno 8 caratteri',
                },
              })}
              type={showPassword ? "text" : "password"}
            >
            </Input>
            <InputLeftElement
              mt={1}
              ml={1}
              pointerEvents='none'
              children={
                <Lock
                  color='#A19F9F'
                  fontSize={16}
                  strokeWidth={1.4}
                />
              }
            />
            <InputRightElement
              mt={1}
              ml={1}
              cursor={'pointer'}
              onClick={() => {
                setShowPassword(prevstate => {
                  return !prevstate
                })
              }}
              children={
                showPassword ? (<EyeEmpty
                  color='#A19F9F'
                  fontSize={16}
                  strokeWidth={1.4}
                />) : (
                  <EyeClose
                    color='#A19F9F'
                    fontSize={16}
                    strokeWidth={1.4}
                  />
                )
              }
            />

          </InputGroup>
          {errors.password && <Text
            pl={2}
            mt={0.5}
            fontSize={'sm'}
            fontWeight={'medium'}
            role="alert">{errors.password.message}</Text>}
          <InputGroup
            mt={3}
            fontWeight={'medium'}
            fontSize={'12px'}
            size={'lg'}
            borderRadius={'3xl'}
            borderWidth={0}
            gap={2}
            width={['full', '96']}
          >
            <Input
              bg={'inputLoginColor.bg'}
              borderWidth={0}
              focusBorderColor='primary.text'
              borderRadius={'10px'}
              placeholder='nome'
              _placeholder={{
                color: 'inputLoginColor.text',
                fontWeight: '500'
              }}
              height={14}
              id="firstName"
              {...register("firstName", {
                required: false,
              })}
              type="text"
            >
            </Input>
            <Input
              bg={'inputLoginColor.bg'}
              borderWidth={0}
              focusBorderColor='primary.text'
              borderRadius={'10px'}
              placeholder='cognome'
              _placeholder={{
                color: 'inputLoginColor.text',
                fontWeight: '500'
              }}
              height={14}
              id="lastName"
              {...register("lastName", {
                required: false,
              })}
              type="text"
            >
            </Input>
          </InputGroup>
          <Button
            mt={3}
            mb={3}
            type={"submit"}
            borderRadius={'xl'}
            size={'lg'}
            fontWeight={'bold'}
            padding={5}
            paddingInline={10}
            width={'full'}
            height={'55px'}
            color={'white'}
            variant="primary"
            _disabled={{
              bg: 'primary'
            }}
            _hover={{
              color: 'primary.text'
            }}
            disabled={!isValid}
          >Accedi</Button>
          <div className="relative flex py-0 items-center">
            <div className="flex-grow border-t border-[#F2F2F2]"></div>
            <span className="flex-shrink mx-4 text-[#A19F9F] font-medium">o accedi con</span>
            <div className="flex-grow border-t border-[#F2F2F2]"></div>
          </div>
          <Button
            fontFamily="Inter, sans-serif"
            mt={4}
            mb={3}
            type={"button"}
            borderRadius={'xl'}
            size={'md'}
            fontWeight={'semibold'}
            padding={5}
            paddingInline={10}
            width={'full'}
            height={'55px'}
            variant="whitePrimary"
          >
            <svg
              className='w-6 h-6 mr-2'
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
            Google
          </Button>
          {(type === 'registration') && <LoginButton />}
          {(type === 'reset_password') && <LoginButton />}
        </Box>

      </form>

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

