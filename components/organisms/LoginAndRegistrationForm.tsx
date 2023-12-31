import { Box, Button, ButtonGroup, Input, InputGroup, InputLeftElement, InputRightElement, Spinner, Text } from '@chakra-ui/react';
import { UserCredential, createUserWithEmailAndPassword, deleteUser, getAuth, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, updateProfile } from 'firebase/auth';
import { EyeClose, EyeEmpty, Lock, Mail } from 'iconoir-react';
import { useRouter } from 'next/router';
import React, { FC, memo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { handleErrorFirebase } from '../utils/handleErrorFirebase';
import { openModal } from '../../src/store/reducers/globalModal';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import CREATE_USER from '../../src/lib/apollo/mutations/createUser';
import CREATE_BUSINESS_ACCOUNT from '../../src/lib/apollo/mutations/createBusinessAccount';
import { auth, facebookProvider, provider } from '../../src/config/firebase';
import { setAuthTokenInSessionStorage } from '../utils/setAuthTokenInSessionStorage';
import { sendEmailVerificationHanlder } from '../utils/emailVerification';
import { login } from '../../src/store/reducers/user';
import resetPassword from '../utils/resetPassword';
import { ToastOpen } from '../utils/Toast';
import Link from 'next/link';
import { Cart } from '../../src/lib/apollo/generated/graphql';
import EDIT_CART from '../../src/lib/apollo/mutations/editCart';
import { CustomWindow, gtag } from '../../src/lib/analytics/gtag';
import { useAnalytics } from '../../src/lib/analytics/hooks/useAnalytics';
import { GTMEventType } from '../../src/lib/analytics/eventTypes';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';
import { getGender } from '../utils/getGender';

export type InputFormLogin = {
    email: string,
    password: string,
    firstName: string,
    lastName: string
}


const LoginAndRegistrationForm: FC<{
    shopId?: string,
    type: 'login' | 'registration' | 'reset_password' | undefined, person: 'user' | 'business' | undefined,
    handleChangeTypeOrPerson: (type: 'login' | 'registration' | 'reset_password', person: 'user' | 'business') => void,
    open?: 'modal' | 'fullPage' | undefined,
    closeModal?: () => void
}> =
    ({ type, person, handleChangeTypeOrPerson, open, shopId, closeModal }) => {
        const [isLoading, setIsLoading] = useState(false)
        const cartsDispatchProduct: Cart[] = useSelector((state: any) => state.carts.carts);

        const router = useRouter();
        const { register, handleSubmit, reset, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<InputFormLogin>({
            mode: "onBlur"
        });
        const dispatch = useDispatch();
        const [createUser] = useMutation(CREATE_USER);
        const [setBusinessAccount] = useMutation(CREATE_BUSINESS_ACCOUNT)
        const [showPassword, setShowPassword] = useState(false)
        const { addToast } = ToastOpen();
        const [editCart] = useMutation(EDIT_CART);




        const onSubmit: SubmitHandler<InputFormLogin> = (data, e) => {
            handleEvent(data)
        }

        const handleCartInLocalStorage = async () => {
            let cartId: string = '';
            if (cartsDispatchProduct.length <= 0) return
            for await (const cart of cartsDispatchProduct) {
                if (!cart?.productVariations) return
                for await (const variation of cart?.productVariations) {
                    try {
                        const result = await editCart({
                            variables: {
                                productVariationId: variation?.id,
                                size: variation?.size,
                                quantity: variation?.quantity
                            }
                        })


                        if (cart.shopInfo?.id === shopId) {
                            cartId = result?.data.editCart
                        }
                    }
                    catch {
                        //TODO gestire errore
                    }
                }
            }
            if (cartId.length > 0) {
                router.replace('/checkout/' + cartId)
            }

        }

        const redirectUser = (isBusiness: boolean) => {
            // rimani nella stessa pagina in modal
            localStorage.removeItem('carts')


            if (open === 'modal' && typeof closeModal === 'function') {

                closeModal()
                setTimeout(() => {
                    router.reload()
                }, 200);
                return
            }
            if (typeof router.query?.callbackUrl === 'string') {
                router.replace(router.query?.callbackUrl)
                if (cartsDispatchProduct.length > 0) {
                    setTimeout(() => {
                        router.reload()
                    }, 200);
                }
                return
            }
            else if (!isBusiness) {
                const genderName = getGender()
                if (!genderName) {
                    router.replace('/profili/brand')
                } else {
                    router.replace(`/cerca/abbigliamento/${genderName}-tutto/tutto/rilevanza`)
                }
                if (cartsDispatchProduct.length > 0) {
                    setTimeout(() => {
                        router.reload()
                    }, 200);
                }
                return
            }
            else if (isBusiness) {
                return router.replace('/shop/home')
            }
        }




        const handleEvent = async (data: InputFormLogin) => {
            setIsLoading(true)
            if (type === 'login') {
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
                    if (!userCredential) return
                    const tokenResult = await userCredential?.user?.getIdTokenResult();
                    const isBusiness = tokenResult.claims.isBusiness ? true : false;
                    setAuthTokenInSessionStorage(tokenResult.token)
                    gtag({
                        command: GTMEventType.login,
                        args: {
                            email: data.email,
                            // firebaseId: userCredential.user.uid,
                            method: 'Email',
                            userType: isBusiness ? 'Business' : 'Customer'
                        }
                    })
                    await handleCartInLocalStorage()

                    setIsLoading(false)

                    redirectUser(isBusiness)
                    setIsLoading(false)

                } catch (error: any) {
                    setIsLoading(true)
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    const errorForModal = handleErrorFirebase(errorMessage)
                    dispatch(openModal({
                        title: errorForModal?.title,
                        description: errorForModal?.description
                    }))
                    setIsLoading(false)
                }
            }
            else if (type === 'registration') {
                try {
                    // SignUp
                    if (person === 'user') {
                        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
                        //! age ora è Int, ma verrà gestita come date o string con rilascio
                        const idToken = await userCredential.user.getIdToken(true);
                        setAuthTokenInSessionStorage(idToken)
                        if (!idToken) return
                        updateProfile(userCredential.user, {
                            displayName: data.firstName
                        })
                        const response = await createUser({
                            variables: {
                                options: {
                                    name: data.firstName,
                                    surname: data.lastName,
                                }
                            }
                        })
                        //token editato
                        const newIdToken = await userCredential.user.getIdToken(true);
                        setAuthTokenInSessionStorage(newIdToken)

                        gtag({
                            command: GTMEventType.signUp,
                            args: {
                                email: data.email,
                                // firstName: data.firstName,
                                // lastName: data.lastName,
                                // firebaseId: userCredential.user.uid,
                                // mongoId: response?.data.createUser ? response?.data.createUser : 'userId_non_trovato',
                                method: 'Email',
                                userType: 'Customer'
                            }
                        })

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
                                },
                                statusAuthentication: 'logged_in',
                                favouriteShops: []
                            })
                        );
                        await handleCartInLocalStorage()

                        setIsLoading(false)
                        redirectUser(false)

                    } if (person === 'business') {
                        try {
                            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
                            // Signed in 
                            const idToken = await userCredential.user.getIdToken(true);
                            if (!idToken) return
                            setAuthTokenInSessionStorage(idToken)
                            //await sendEmailVerificationHanlder()
                            await setBusinessAccount()
                            //nuovo idtoken con claims aggiunti
                            const newIdToken = await userCredential.user.getIdToken(true);
                            setAuthTokenInSessionStorage(newIdToken)
                            gtag({
                                command: GTMEventType.signUp,
                                args: {
                                    email: data.email,
                                    // firebaseId: userCredential.user.uid,
                                    method: 'Email',
                                    userType: 'Business',
                                    // mongoId: account?.data.createBusinessStep1
                                }
                            })
                            await router.replace('/shop/crea-business-account')
                            // router.reload()
                            // setemail('')
                            // setpassword('')
                        } catch (error: any) {

                            const errorForModal = handleErrorFirebase(error.code)
                            dispatch(openModal({
                                title: errorForModal?.title,
                                description: errorForModal?.description
                            }))
                            setIsLoading(false)
                        }
                        setIsLoading(false)
                    }

                } catch (error: any) {
                    setIsLoading(false)
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    const errorForModal = handleErrorFirebase(error.code)
                    if (
                        errorMessage === 'email already used by another user' ||
                        errorMessage === 'ID token must be a non-empty string' ||
                        errorMessage === 'idToken is not defined' ||
                        errorMessage === "can't create user" ||
                        errorMessage === 'not authenticated' ||
                        errorMessage === 'no user exists with the uid: \"\"'
                        //TODO inserire errori corretti
                        //typeof errorMessage === 'string' && !errorMessage.includes('Firebase')
                    ) {
                        const user = auth.currentUser;
                        //elimina user se da questo errore
                        if (user) {
                            await deleteUser(user)
                        }
                    }
                    dispatch(openModal({
                        title: errorForModal?.title,
                        description: errorForModal?.description
                    }))
                }
            }
            else if (type === 'reset_password') {
                setIsLoading(true)
                try {
                    const result = await resetPassword(data.email)
                    setIsLoading(false)
                    return addToast({
                        position: 'top', title: 'controlla la casella mail', description: 'ti abbiamo inviato una mail per resettare la password', status: 'success', duration: 5000, isClosable: true,
                        variant: "customSuccess"
                    })
                } catch (e) {
                    setIsLoading(false)
                }
            }
        }

        const signInWithGoogle = async (type: 'Google' | 'Facebook') => {
            if (person !== 'user') return
            let result: UserCredential | undefined;
            try {
                result = await signInWithPopup(auth, type === 'Facebook' ? facebookProvider : provider)
                setIsLoading(true)
            } catch (error: any) {
                setIsLoading(false)
                const errorMessage = error.message;
                const errorForModal = handleErrorFirebase(errorMessage)
            }


            if (result === undefined) return

            const fullName = result.user.displayName ? result.user.displayName.split(" ") : [''];
            const idToken = await result.user.getIdToken(true);
            setAuthTokenInSessionStorage(idToken)


            const surname = fullName?.slice(1).join(" ")

            try {

                const response = await createUser({
                    variables: {
                        options: {
                            name: typeof fullName?.[0] === 'string' ? fullName[0] : '',
                            surname: surname ? surname : " "
                        }
                    }
                })
                const newIdToken = await result.user.getIdToken(true);
                setAuthTokenInSessionStorage(newIdToken)
                gtag({
                    command: GTMEventType.signUp,
                    args: {
                        email: result.user.email,
                        // firebaseId: userCredential.user.uid,
                        method: 'Google',
                        userType: 'Customer',
                        // mongoId: account?.data.createBusinessStep1
                    }
                })
                //update display name con firstname
                updateProfile(result.user, {
                    displayName: typeof fullName?.[0] === 'string' ? fullName[0] : ''
                })
                dispatch(
                    login({
                        email: result.user.email,
                        uid: result.user.uid,
                        idToken: idToken,
                        emailVerified: false,
                        createdAt: 'now',
                        accountId: response?.data.createUser,
                        userInfo: {
                            name: fullName ? fullName[0] : 'nome',
                        },
                        statusAuthentication: 'logged_in',
                        favouriteShops: []
                    })
                );
                await handleCartInLocalStorage()

                setIsLoading(false)
                redirectUser(false)
            } catch (error: any) {
                const errorMessage = error.message;
                setIsLoading(false)
                if (!result) return

                if (
                    errorMessage === "can't create user"
                    ||
                    errorMessage === 'not authenticated'
                ) {
                    const user = auth.currentUser;
                    //elimina user se da questo errore
                    if (user) {
                        await deleteUser(user)
                    }
                    return
                }
                if (errorMessage === 'email already used by another user') {
                    const tokenResult = await result.user.getIdTokenResult(true);
                    const isBusiness = tokenResult.claims.isBusiness ? true : false;
                    gtag({
                        command: GTMEventType.login,
                        args: {
                            email: result.user.email,
                            // firebaseId: userCredential.user.uid,
                            method: 'Google',
                            userType: isBusiness ? 'Business' : 'Customer'
                        }
                    })

                    await handleCartInLocalStorage()
                    redirectUser(isBusiness)
                }

            }
        }


        const ButtonRedirectPage: FC<{ text: string, onClick: () => void, buttonText: string }> = ({ text, onClick, buttonText }) => {
            return (
                <Box
                    display={'flex'}
                    gap={0.5}
                    fontSize={'15px'}
                >
                    <Text
                        color={'inputLoginColor.text'}
                        className='mr-1 text-black	'>{text}</Text>
                    <Button
                        color={'primaryBlack.text'}
                        onClick={onClick}
                        variant='link'
                        fontSize={'16px'}
                    >
                        {buttonText}
                    </Button>

                </Box>)
        }



        if (type === undefined || person === undefined) {
            return (
                <></>
            )
        }




        return (
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='m-auto'
            >

                <Box
                    marginX={'auto'}
                    marginY={'auto'}
                    zIndex={'10'}
                    width={['full', 'fit-content']}
                >
                    <Text
                        fontSize={'27px'}
                        fontWeight={'black'}
                        mb={1.5}
                    >
                        {type === 'registration' && 'Benvenuto in '}
                        {type === 'reset_password' && 'Resetta password'}
                        {type === 'login' && 'Bentornato in '}
                        {(type === 'registration' || type === 'login') && <span className='text-[#FF5A78]'>Veplo</span>}
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
                            autoComplete="username"
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
                    {
                        type !== 'reset_password' &&
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
                                autoComplete="current-password"

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

                        </InputGroup>}
                    {errors.password && <Text
                        pl={2}
                        mt={0.5}
                        fontSize={'sm'}
                        fontWeight={'medium'}
                        role="alert">{errors.password.message}</Text>}
                    {(person !== 'business' && type === 'registration') && <InputGroup
                        mt={3}
                        fontWeight={'medium'}
                        fontSize={'12px'}
                        size={'lg'}
                        borderRadius={'3xl'}
                        borderWidth={0}
                        gap={3}
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
                                required: true,
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
                                required: true,
                            })}
                            type="text"
                        >
                        </Input>
                    </InputGroup>}
                    <Button
                        mt={3}
                        mb={3}
                        type={"submit"}
                        borderRadius={'xl'}
                        size={'lg'}
                        fontWeight={'extrabold'}
                        padding={5}
                        paddingInline={10}
                        width={'full'}
                        height={'55px'}
                        color={'white'}
                        variant="primary"
                        _disabled={{
                            bg: 'primary.bg'
                        }}
                        _hover={{
                            color: 'primary.text'
                        }}
                        isDisabled={isLoading}
                    >
                        {!isLoading &&
                            <Box
                                display={'flex'}
                                gap={2}
                            >
                                <span>
                                    {type === 'registration' && 'Registrati'}
                                    {type === 'reset_password' && 'Invia mail'}
                                    {type === 'login' && 'Accedi'}
                                </span>
                                {(type === 'registration' || type === 'login') && <img
                                    className='w-[18px] my-auto mb-[2px]'
                                    alt=''
                                    src='https://em-content.zobj.net/thumbs/240/apple/354/bellhop-bell_1f6ce-fe0f.png'
                                />}

                            </Box>

                        }

                        {isLoading && <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='primary.bg'
                            color='white'
                            size='lg'
                        />}

                    </Button>
                    {type === 'registration' &&
                        <Text
                            mb={4}
                            mt={-2}
                            fontSize={['xs', 'xs']}
                            color={'inputLoginColor.text'}
                            width={['full', 96]}
                        >
                            Registrandoti per un account, accetti i nostri <Link href='/informative/termini-e-condizioni' className='underline'>Termini di utilizzo</Link>{person === 'business' ? <span> e i <Link href='/informative/termini-e-condizioni-vendita' className='underline'>Termini e Condizioni di Vendita</Link></span> : ''}. Si prega di consultare la nostra <a href='https://www.iubenda.com/privacy-policy/62612516' className='underline'>Privacy Policy</a>.
                        </Text>
                    }
                    {type !== 'reset_password' && person !== 'business' &&
                        <>
                            <div className="relative flex py-0 items-center">
                                <div className="flex-grow border-t border-[#F2F2F2]"></div>
                                <span className="flex-shrink mx-4 text-[#A19F9F] font-medium">o {type === 'registration' ? 'registrati' : 'accedi'} con</span>
                                <div className="flex-grow border-t border-[#F2F2F2]"></div>
                            </div>
                            <ButtonGroup
                                mt={3}
                                mb={2}
                                width={'full'}
                            >
                                <Button
                                    fontFamily="Inter, sans-serif"

                                    type={"button"}
                                    borderRadius={'xl'}
                                    size={'md'}
                                    fontWeight={'semibold'}
                                    padding={5}
                                    width={'full'}
                                    height={'55px'}
                                    variant="whitePrimary"
                                    onClick={() => signInWithGoogle('Google')}
                                    isDisabled={isLoading}
                                    _disabled={{
                                        bg: '#FFFFFF'
                                    }}
                                    _hover={{
                                        color: '#A19F9F'
                                    }}
                                >
                                    <svg
                                        className='w-6 h-6 mr-2'
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                                    Google
                                </Button>
                                {/* 
                                va ultimata la configurazione con Facebook
                                https://forum.freecodecamp.org/t/facebook-login-auth-with-firebase/613541
                                <Button
                                    fontFamily="Inter, sans-serif"

                                    type={"button"}
                                    borderRadius={'xl'}
                                    size={'md'}
                                    fontWeight={'semibold'}
                                    padding={5}

                                    width={'full'}
                                    height={'55px'}
                                    variant="whitePrimary"
                                    onClick={() => signInWithGoogle('Facebook')}
                                    isDisabled={isLoading}
                                    _disabled={{
                                        bg: '#FFFFFF'
                                    }}
                                    _hover={{
                                        color: '#A19F9F'
                                    }}
                                >
                                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                                        <linearGradient id="a" x1="-277.375" x2="-277.375" y1="406.6018" y2="407.5726" gradientTransform="matrix(40 0 0 -39.7778 11115.001 16212.334)" gradientUnits="userSpaceOnUse">
                                            <stop offset="0" stopColor="#0062e0" />
                                            <stop offset="1" stopColor="#19afff" />
                                        </linearGradient>
                                        <path fill="url(#a)" d="M16.7 39.8C7.2 38.1 0 29.9 0 20 0 9 9 0 20 0s20 9 20 20c0 9.9-7.2 18.1-16.7 19.8l-1.1-.9h-4.4l-1.1.9z" />
                                        <path fill="#fff" d="m27.8 25.6.9-5.6h-5.3v-3.9c0-1.6.6-2.8 3-2.8H29V8.2c-1.4-.2-3-.4-4.4-.4-4.6 0-7.8 2.8-7.8 7.8V20h-5v5.6h5v14.1c1.1.2 2.2.3 3.3.3 1.1 0 2.2-.1 3.3-.3V25.6h4.4z" />
                                    </svg>

                                    Facebook
                                </Button> */}
                            </ButtonGroup>

                        </>
                    }

                    {(type !== 'login') &&
                        <Box
                            mt={2}

                        >
                            <ButtonRedirectPage
                                text={'hai già un account?'}
                                onClick={() => { handleChangeTypeOrPerson('login', person) }}
                                buttonText={'Accedi'}
                            />
                        </Box>
                    }

                    {type === 'login' &&
                        <Box
                            mt={[2, 2]}
                            display={'grid'}
                            gap={0.5}
                        //mb={[8, 0]}
                        //className={`${person === 'business' ? 'mb-20' : 'mb-8'}`}
                        >
                            <ButtonRedirectPage
                                text={'non hai ancora un account?'}
                                onClick={() => { handleChangeTypeOrPerson('registration', person) }}
                                buttonText={'registrati'}
                            />
                            <ButtonRedirectPage
                                text={'password dimenticata?'}
                                onClick={() => { handleChangeTypeOrPerson('reset_password', person) }}
                                buttonText={'resetta password'}
                            />
                        </Box>
                    }
                </Box>

            </form >
        )
    }

export default memo(LoginAndRegistrationForm)
