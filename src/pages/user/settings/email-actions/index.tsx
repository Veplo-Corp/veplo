import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout';
import { Auth, applyActionCode, confirmPasswordReset, signInWithEmailAndPassword, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../../../../config/firebase';
import { ToastOpen } from '../../../../../components/utils/Toast';
import { useForm } from 'react-hook-form';
import { EyeClose, EyeEmpty, Lock, Mail } from 'iconoir-react';
import { Box, Button, ButtonGroup, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightAddon, InputRightElement, Spinner, Text } from '@chakra-ui/react';
import Div_input_creation from '../../../../../components/atoms/Div_input_creation';
import BlackButton from '../../../../../components/atoms/BlackButton';
import AuthenticationLayout from '../../../../../components/atoms/AuthenticationLayout';

const index = () => {
    const router = useRouter();
    const [mode, setMode] = useState<'' | 'resetPassword' | 'recoverEmail' | 'verifyEmail'>('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { addToast } = ToastOpen();
    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<{ reset_password: string }>({
        mode: "onBlur"
    });

    const continueUrl =
        process.env.NODE_ENV === 'production' ?
            'https://www.veplo.it/' :
            'http://localhost:3000/'


    const verifyFirebaseCode = async (auth: Auth, oobCode: any) => {
        try {
            const codeIsVerified = await verifyPasswordResetCode(auth, oobCode)
            console.log(codeIsVerified);
        }
        catch (e: any) {
            console.log(e.code);
            if ('auth/invalid-action-code') {
                addToast({ position: 'top', title: 'Link scaduto', description: 'richiedi un nuovo link per il reset della password', status: 'error', duration: 5000, isClosable: false })
                router.push('/negozi')
            }
        }
    }

    useEffect(() => {
        const { mode, oobCode, lang } = router.query
        if (!mode && typeof oobCode !== 'string') return
        // Handle the user management action.
        //link https://firebase.google.com/docs/auth/custom-email-handler?hl=it
        switch (mode) {
            case 'resetPassword':
                verifyFirebaseCode(auth, oobCode)
                setMode('resetPassword')
                break;
            case 'recoverEmail':
                // Display email recovery handler and UI.
                //handleRecoverEmail(auth, oobCode, lang);
                break;
            case 'verifyEmail':

                // Display email verification handler and UI.
                handleVerifyEmail(auth, oobCode, continueUrl, lang);
                break;
            default:
            // Error: invalid mode.
        }

        return () => {

        }
    }, [router.query?.mode])

    function handleVerifyEmail(auth: Auth, actionCode: any, continueUrl: string, lang: any) {
        // Localize the UI to the selected language as determined by the lang
        // parameter.
        // Try to apply the email verification code.
        applyActionCode(auth, actionCode).then((resp) => {
            // Email address has been verified.

            // TODO: Display a confirmation message to the user.
            // You could also provide the user with a link back to the app.

            // TODO: If a continue URL is available, display a button which on
            // click redirects the user back to the app via continueUrl with
            // additional state determined from that URL's parameters.
            addToast({ position: 'top', title: 'Email convalidata!', status: 'success', duration: 5000, isClosable: false })
            router.push(continueUrl)

        }).catch((error) => {
            addToast({ position: 'top', title: 'Errore durante la convalida mail', description: "non siamo riusciti ad aggiornare la password. Riprova più tardi", status: 'error', duration: 5000, isClosable: false })
            // Code is invalid or expired. Ask the user to verify their email address
            // again.
        });
    }

    function handleResetPassword(auth: Auth, actionCode: any, continueUrl: string, lang: any, newPassword: string) {

        // Localize the UI to the selected language as determined by the lang
        // parameter.
        setIsLoading(true)
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
                setIsLoading(false)

            });
        }).catch((error) => {
            console.log(error);
            setIsLoading(false)

            addToast({ position: 'top', title: 'Link reset password scaduto', description: "richiedi un nuovo link per resettare la password", status: 'error', duration: 5000, isClosable: false })

            // Invalid or expired action code. Ask user to try to reset the password
            // again.
        });
    }

    const handleSubmitChangePassword = (event: any) => {
        const { oobCode, lang } = router.query
        event.preventDefault();
        console.log(watch('reset_password'));
        if (!oobCode || !lang) return

        // Display reset password handler and UI.
        handleResetPassword(auth, oobCode, continueUrl, lang, watch('reset_password'));
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
            <Box className='mt-[15vh] lg:mt-[22vh] px-4 md:px-0'>
                {mode !== '' ? (
                    <>
                        {mode === 'resetPassword' &&
                            <form
                                className='m-auto w-full sm:w-96 px-2 mt-10'
                                onSubmit={handleSubmitChangePassword}>
                                <Text
                                    fontSize={'27px'}
                                    fontWeight={'black'}
                                    mb={1.5}
                                >
                                    Resetta password
                                </Text>
                                <InputGroup
                                    mt={3}
                                    fontWeight={'medium'}
                                    bg={'inputLoginColor.bg'}
                                    fontSize={'12px'}
                                    size={'lg'}
                                    width={'full'}
                                    borderRadius={'3xl'}
                                    borderWidth={0}
                                >
                                    <Input
                                        borderWidth={0}
                                        focusBorderColor='primary.text'
                                        borderRadius={'10px'}
                                        placeholder='nuova password'
                                        _placeholder={{
                                            color: 'inputLoginColor.text',
                                            fontWeight: '500'
                                        }}
                                        height={14}
                                        id="password"
                                        {...register("reset_password", {
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
                                {errors.reset_password && <Text
                                    pl={2}
                                    mt={0.5}
                                    fontSize={'sm'}
                                    fontWeight={'medium'}
                                    role="alert">{errors.reset_password.message}</Text>}
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
                                    disabled={!isValid || isLoading}
                                >
                                    {!isLoading &&
                                        <Box
                                            display={'flex'}
                                            gap={2}
                                        >
                                            <span>
                                                conferma
                                            </span>
                                            <img
                                                className='w-[18px] my-auto mb-[3px] lg:mb-[2px]'
                                                alt=''
                                                src='https://em-content.zobj.net/thumbs/240/apple/354/bellhop-bell_1f6ce-fe0f.png'
                                            />
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
                            </form>


                        }
                    </>
                ) : (
                    <></>
                )}
            </Box>
        </AuthenticationLayout>


    )
}

export default index