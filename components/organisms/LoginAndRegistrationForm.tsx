import { Box, Button, Input, InputGroup, InputLeftElement, InputRightElement, Spinner, Text } from '@chakra-ui/react';
import { UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { EyeClose, EyeEmpty, Lock, Mail } from 'iconoir-react';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { handleErrorFirebase } from '../utils/handleErrorFirebase';
import { setModalTitleAndDescription } from '../../src/store/reducers/modal_error';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import CREATE_USER from '../../src/lib/apollo/mutations/createUser';
import CREATE_BUSINESS_ACCOUNT from '../../src/lib/apollo/mutations/createBusinessAccount';
import { auth, provider } from '../../src/config/firebase';
import { setAuthTokenInSessionStorage } from '../utils/setAuthTokenInSessionStorage';
import { sendEmailVerificationHanlder } from '../utils/emailVerification';
import { login } from '../../src/store/reducers/user';
import resetPassword from '../utils/resetPassword';
import { ToastOpen } from '../utils/Toast';
import Link from 'next/link';
import { Cart } from '../../src/lib/apollo/generated/graphql';
import EDIT_CART from '../../src/lib/apollo/mutations/editCart';

export type InputFormLogin = {
    email: string,
    password: string,
    firstName: string,
    lastName: string
}

const LoginAndRegistrationForm: FC<{
    type: 'login' | 'registration' | 'reset_password' | undefined, person: 'user' | 'business' | undefined,
    handleChangeTypeOrPerson: (type: 'login' | 'registration' | 'reset_password', person: 'user' | 'business') => void,
    open?: 'modal' | 'fullPage' | undefined
}> =
    ({ type, person, handleChangeTypeOrPerson, open }) => {
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
            console.log(data);
            handleEvent(data)
        }

        const handleCartInLocalStorage = async () => {
            if (cartsDispatchProduct.length <= 0) return
            for await (const cart of cartsDispatchProduct) {
                if (!cart?.productVariations) return
                for await (const variation of cart?.productVariations) {
                    try {
                        await editCart({
                            variables: {
                                productVariationId: variation.variationId,
                                size: variation.size,
                                quantity: variation.quantity
                            }
                        })
                    }
                    catch {
                        console.log('errore cart');
                    }
                }
            }


        }

        const redirectUser = (isBusiness: boolean) => {
            // rimani nella stessa pagina in modal
            localStorage.removeItem('carts')
            if (open === 'modal') {
                setTimeout(() => {
                    router.reload()
                }, 1000);
                return

            }
            if (typeof router.query?.callbackUrl === 'string') {
                router.replace(router.query?.callbackUrl)
                if (cartsDispatchProduct.length > 0) {
                    setTimeout(() => {
                        router.reload()
                    }, 1000);
                }
                return
            }
            else if (!isBusiness) {
                router.replace('/negozi')
                if (cartsDispatchProduct.length > 0) {
                    setTimeout(() => {
                        router.reload()
                    }, 1000);

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
                    const tokenResult = await userCredential.user.getIdTokenResult();
                    const isBusiness = tokenResult.claims.isBusiness ? true : false;
                    setAuthTokenInSessionStorage(tokenResult.token)
                    await handleCartInLocalStorage()
                    setIsLoading(false)

                    redirectUser(isBusiness)
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
                        await handleCartInLocalStorage()
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
                        redirectUser(false)

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
            else if (type === 'reset_password') {
                setIsLoading(true)
                try {
                    const result = await resetPassword(data.email)
                    setIsLoading(false)

                    return addToast({ position: 'top', title: 'controlla la casella mail', description: 'ti abbiamo inviato una mail per resettare la password', status: 'success', duration: 5000, isClosable: true })

                } catch (e) {
                    setIsLoading(false)
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
                setIsLoading(false)

                const errorMessage = error.message;
                //console.log(errorCode);
                console.log(error);
                const errorForModal = handleErrorFirebase(errorMessage)
                // dispatch(setModalTitleAndDescription({
                //     title: errorForModal?.title,
                //     description: errorForModal?.description
                // }))
            }


            if (result === undefined) return

            const fullName = result.user.displayName ? result.user.displayName.split(" ") : null;
            const idToken = await result.user.getIdToken(true);
            setAuthTokenInSessionStorage(idToken)

            try {
                const response = await createUser({
                    variables: {
                        options: {
                            name: typeof fullName?.[0] === 'string' ? fullName[0] : '',
                            surname: typeof fullName?.slice(1).join(" ") === 'string' ? fullName?.slice(1).join(" ") : ''
                        }
                    }
                })

                console.log(response);
                const idToken = await result.user.getIdToken(true);
                setAuthTokenInSessionStorage(idToken)
                await handleCartInLocalStorage()
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
                        }
                    })
                );
                setIsLoading(false)
                redirectUser(false)
            } catch {
                setIsLoading(false)
                if (!result) return
                const tokenResult = await result.user.getIdTokenResult();
                const isBusiness = tokenResult.claims.isBusiness ? true : false;
                if (isBusiness) return router.replace('/shop/home/')
                await handleCartInLocalStorage()
                redirectUser(isBusiness)
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
                            Registrandoti per un account, accetti i nostri <Link href='https://www.veplo.it/policies/termini-e-condizioni' className='underline'>Termini di utilizzo</Link>. Si prega di consultare la nostra <a href='https://www.iubenda.com/privacy-policy/62612516' className='underline'>Privacy Policy</a>.
                        </Text>
                    }
                    {type !== 'reset_password' && person !== 'business' &&
                        <>
                            <div className="relative flex py-0 items-center">
                                <div className="flex-grow border-t border-[#F2F2F2]"></div>
                                <span className="flex-shrink mx-4 text-[#A19F9F] font-medium">o accedi con</span>
                                <div className="flex-grow border-t border-[#F2F2F2]"></div>
                            </div>
                            <Button
                                fontFamily="Inter, sans-serif"
                                mt={4}
                                mb={4}
                                type={"button"}
                                borderRadius={'xl'}
                                size={'md'}
                                fontWeight={'semibold'}
                                padding={5}
                                paddingInline={10}
                                width={'full'}
                                height={'55px'}
                                variant="whitePrimary"
                                onClick={signInWithGoogle}
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

export default LoginAndRegistrationForm
