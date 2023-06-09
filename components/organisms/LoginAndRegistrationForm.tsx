import { Box, Button, Input, InputGroup, InputLeftElement, InputRightElement, Text } from '@chakra-ui/react';
import { EyeClose, EyeEmpty, Lock, Mail } from 'iconoir-react';
import React, { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';

type InputForm = {
    email: string,
    password: string,
    firstName: string,
    lastName: string
}

const LoginAndRegistrationForm: FC<{ type?: 'login' | 'registration' | 'reset_password', person?: 'user' | 'business' }> = ({ type, person }) => {
    const { register, handleSubmit, reset, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<InputForm>({
        mode: "onBlur"
    });

    const [showPassword, setShowPassword] = useState(false)


    const onSubmit: SubmitHandler<InputForm> = (data, e) => {
        console.log(data, e);
    }

    const ButtonRedirectPage: FC<{ text: string, onClick: () => void, buttonText: string }> = ({ text, onClick, buttonText }) => {
        return (
            <Box
                display={'flex'}
                gap={0.5}
                fontSize={'16px'}
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




    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='h-screen w-full flex'
        >
            <Box
                px={[4, 0]}
                marginX={'auto'}
                marginY={'auto'}
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
                >
                    <svg
                        className='w-6 h-6 mr-2'
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                    Google
                </Button>
                {(type !== 'login') &&
                    <Box
                        mt={[0, 0, 0, 2]}
                        mb={[8, 0]}
                    >
                        <ButtonRedirectPage
                            text={'hai già un account?'}
                            onClick={() => { }}
                            buttonText={'Accedi'}
                        />
                    </Box>
                }

                {type === 'login' &&
                    <Box
                        mt={[0, 2]}
                        display={'grid'}
                        gap={0.5}
                        mb={[8, 0]}
                    >
                        <ButtonRedirectPage
                            text={'non hai ancora un account?'}
                            onClick={() => { }}
                            buttonText={'registrati'}
                        />
                        <ButtonRedirectPage
                            text={'password dimenticata?'}
                            onClick={() => { }}
                            buttonText={'resetta password'}
                        />
                    </Box>
                }
            </Box>

        </form >
    )
}

export default LoginAndRegistrationForm
