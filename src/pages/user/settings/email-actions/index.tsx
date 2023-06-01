import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout';
import { Auth, confirmPasswordReset, signInWithEmailAndPassword, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../../../../config/firebase';
import { ToastOpen } from '../../../../../components/utils/Toast';
import { useForm } from 'react-hook-form';
import { Box } from 'iconoir-react';
import { Button, ButtonGroup, Input, InputGroup, InputLeftAddon, InputRightAddon, Text } from '@chakra-ui/react';
import Div_input_creation from '../../../../../components/atoms/Div_input_creation';
import BlackButton from '../../../../../components/atoms/BlackButton';

const index = () => {
    const router = useRouter();
    const [mode, setMode] = useState<'' | 'resetPassword' | 'recoverEmail' | 'verifyEmail'>('')
    const [showPassword, setshowPassword] = useState<boolean>(false)

    const { addToast } = ToastOpen();
    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<{ password: string }>({
        mode: "all"
    });
    useEffect(() => {
        const { mode } = router.query
        if (!mode) return
        // Handle the user management action.
        //link https://firebase.google.com/docs/auth/custom-email-handler?hl=it
        switch (mode) {
            case 'resetPassword':

                setMode('resetPassword')
                break;
            case 'recoverEmail':
                // Display email recovery handler and UI.
                //handleRecoverEmail(auth, oobCode, lang);
                break;
            case 'verifyEmail':
                // Display email verification handler and UI.
                //handleVerifyEmail(auth, oobCode, continueUrl, lang);
                break;
            default:
            // Error: invalid mode.
        }

        return () => {

        }
    }, [router.query?.mode])

    function handleResetPassword(auth: Auth, actionCode: any, continueUrl: string, lang: any, newPassword: string) {

        // Localize the UI to the selected language as determined by the lang
        // parameter.

        // Verify the password reset code is valid.
        verifyPasswordResetCode(auth, actionCode).then((email) => {
            const accountEmail = email;

            // TODO: Show the reset screen with the user's email and ask the user for
            // the new password.

            // Save the new password.
            confirmPasswordReset(auth, actionCode, newPassword).then(async (resp) => {
                // Password reset has been confirmed and new password updated.

                // TODO: Display a link back to the app, or sign-in the user directly
                // if the page belongs to the same domain as the app:
                // auth.signInWithEmailAndPassword(accountEmail, newPassword);
                await signInWithEmailAndPassword(auth, email, newPassword)
                // TODO: If a continue URL is available, display a button which on
                // click redirects the user back to the app via continueUrl with
                // additional state determined from that URL's parameters.
                // Display reset password handler and UI.
                router.push(continueUrl)
            }).catch((error) => {
                console.log(error);
                addToast({ position: 'top', title: 'Errore durante modifica della password', description: "non siamo riusciti ad aggiornare la password. Riprova più tardi", status: 'error', duration: 5000, isClosable: false })
                // Error occurred during confirmation. The code might have expired or the
                // password is too weak.
            });
        }).catch((error) => {
            console.log(error);
            addToast({ position: 'top', title: 'Link reset password scaduto', description: "richiedi un nuovo link per resettare la password", status: 'error', duration: 5000, isClosable: false })

            // Invalid or expired action code. Ask user to try to reset the password
            // again.
        });
    }

    const handleSubmitChangePassword = (event: any) => {
        const { oobCode, lang } = router.query
        event.preventDefault();
        console.log(watch('password'));
        if (!oobCode || !lang) return
        const continueUrl =
            process.env.NODE_ENV === 'production' ?
                'https://www.veplo.it/' :
                'http://localhost:3000/'
        // Display reset password handler and UI.
        handleResetPassword(auth, oobCode, continueUrl, lang, watch('password'));
    }
    return (
        <Desktop_Layout>
            {
                mode !== '' ? (
                    <>
                        {mode === 'resetPassword' &&
                            <form
                                className='m-auto w-11/12 md:w-1/2 lg:w-4/12 xl:w-1/3 mt-10'
                                onSubmit={handleSubmitChangePassword}>
                                <h1 className="font-black text-2xl md:text-2xl text-black-900 mb-2 max-w-xs md:max-w-md">Resetta password</h1>

                                <Div_input_creation text='Nuova password'>
                                    <InputGroup
                                        _hover={{
                                            borderColor: 'gray.900'
                                        }}
                                    >
                                        <InputLeftAddon children={
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                        }
                                            background={'white'}
                                            borderWidth={2}
                                            borderColor={'gray.900'}
                                            borderRightWidth={0}
                                            borderRadius={'5px'}
                                            height={'14'}
                                        />
                                        <Input

                                            fontSize={'md'}
                                            fontWeight={'medium'}
                                            _placeholder={{
                                                color: "gray.600"
                                            }}
                                            borderWidth={2}
                                            borderLeftWidth={0}
                                            borderColor={'gray.900'}
                                            {...register("password", { required: true, minLength: 8 })}
                                            autoComplete={'off'}
                                            type={showPassword ? 'text' : 'password'} name="password" id="password"
                                            focusBorderColor='gray.900'
                                            variant='unstyled'
                                            placeholder="password"
                                            borderRadius={'5px'}
                                        />
                                        <InputRightAddon
                                            background={'white'}
                                            borderWidth={2}
                                            borderColor={'gray.900'}
                                            borderLeftWidth={0}
                                            height={'14'}
                                            onClick={() => setshowPassword(!showPassword)}
                                            borderRadius={'5px'}
                                            children={
                                                <>
                                                    {!showPassword && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>}
                                                    {showPassword && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                    </svg>
                                                    }
                                                </>
                                            } />
                                    </InputGroup>
                                    <Text
                                        fontSize={'sm'}
                                        fontWeight={'medium'}
                                    >
                                        inserisci almeno 8 caratteri
                                    </Text>
                                </Div_input_creation>
                                <ButtonGroup
                                    float={'right'}
                                >
                                    <BlackButton
                                        element='Conferma'
                                        borderRadius={5}
                                        width={150}
                                        heigth={12}
                                        size={'md'}
                                        typeButton={'submit'}
                                        disabled={!isValid}
                                    />
                                </ButtonGroup>

                            </form>


                        }
                    </>
                ) : (
                    <></>
                )
            }
        </Desktop_Layout>

    )
}

export default index