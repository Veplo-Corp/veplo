import { Box, Button, Heading, Highlight, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightAddon, InputRightElement, Select } from '@chakra-ui/react'
import React, { useState } from 'react'
import BlackButton from '../atoms/BlackButton'
import resetPassword from '../../components/utils/resetPassword'
import Div_input_creation from '../atoms/Div_input_creation';
import { ToastOpen } from '../utils/Toast';

export interface UserInfo {
    name: string,
    surname: string,
    gender: string | null,
    dateOfBirth?: string | Date,
}

const typeInterest = [
    {
        value: 'm',
        text: 'donna',
    },
    {
        value: 'f',
        text: 'uomo',
    },
    {
        value: 'i',
        text: 'indifferente',
    }
]

const Login_or_Registration: React.FC<{ account: 'business' | 'user', handleSubmitToPage: any, handleType: any, type: 'registration' | 'login' | 'reset_password', title: string, handleGoogle: () => void }> = ({ account, handleSubmitToPage, handleType, type, title, handleGoogle }) => {
    const [showPassword, setshowPassword] = useState<boolean>(false)
    const [email, setemail] = useState<string>('')
    const [isValidEmail, setisValidEmail] = useState<boolean | null>(null)
    const [isValidPassword, setisValidPassword] = useState<boolean | null>(null)
    const [password, setpassword] = useState<string>('');
    const [isLoading, setisLoading] = useState(false)
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: '',
        surname: '',
        gender: null,
        dateOfBirth: '',
    })
    const { addToast } = ToastOpen();



    const emailHandler = (event: any) => {
        setemail(event.target.value)
        if (/\S+@\S+\.\S+/.test(event.target.value)) {
            return setisValidEmail(true)
        }
    }

    const emailErrorHandler = () => {
        if (/\S+@\S+\.\S+/.test(email)) {
            return setisValidEmail(true)
        }
        console.log('eccolo');

        setisValidEmail(false)
    }

    const passwordHandler = (event: any) => {
        setpassword(event.target.value)
        if (event.target.value.length >= 8) {
            return setisValidPassword(true)
        }
    }


    const passwordErrorHandler = () => {
        if (password.length >= 8) {
            return setisValidPassword(true)
        } else {
            return setisValidPassword(false)
        }
    }

    const LoginButton = () => {
        return (
            <>
                <p className='mr-1 text-black	'>hai già un account?</p>
                <Button className='underline' onClick={() => {
                    handleType('login')
                }
                } variant='link' colorScheme={'black'}>
                    Accedi
                </Button>

            </>
        )
    }

    const handleSubmitForm = (event: any) => {
        event.preventDefault();
        handleSubmitToPage(email, password, userInfo)
    }

    return (
        <form onSubmit={handleSubmitForm} >
            <h1 className="font-black text-2xl md:text-2xl italic text-black-900 mb-4 max-w-xs md:max-w-md">{title}</h1>
            <div
                className='mb-3'

            >
                <InputGroup
                    _hover={{
                        borderColor: 'gray.900'
                    }}

                >
                    <InputLeftAddon children={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                    }
                        background={'white'}
                        borderWidth={2}
                        borderColor={'gray.900'}
                        borderRightWidth={0}
                        height={'14'}
                        borderRadius={'5px'}

                    />
                    <Input
                        fontSize={'md'}
                        focusBorderColor='gray.900'
                        onBlur={emailErrorHandler}
                        value={email}
                        autoComplete={'on'}
                        onChange={emailHandler}
                        type="email" name="email" id="email"
                        fontWeight={'medium'}
                        _placeholder={{
                            color: "gray.600"
                        }}
                        borderWidth={2}
                        borderRadius={'5px'}
                        borderLeftWidth={0}
                        variant='unstyled'
                        borderColor={'gray.900'}
                        placeholder="email"
                    />
                </InputGroup>

                {isValidEmail === false && <p className='text-sm md:text-xs text-red-600'>email non corretta</p>}
            </div>
            {type !== 'reset_password' &&
                <div
                    className='mb-0'
                >
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
                            onBlur={passwordErrorHandler}
                            value={password}
                            onChange={passwordHandler}
                            autoComplete={'on'}
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
                    {isValidPassword === false && <p className='text-sm md:text-xs text-red-600'>la password deve contenere almeno 8 caratteri</p>}

                </div>
            }
            {
                type === 'registration' && account === 'user' &&
                <>
                    <div
                        className='mb-2 mt-3'
                    >
                        <InputGroup
                            _hover={{
                                borderColor: 'gray.900'
                            }}
                            gap={2}

                        >

                            <Input
                                height={'14'}
                                fontSize={'md'}
                                focusBorderColor='gray.900'
                                value={userInfo.name}
                                autoComplete={'on'}
                                onChange={(e) => {
                                    setUserInfo(prevState => {
                                        return {
                                            ...prevState,
                                            name: e.target.value
                                        }
                                    })
                                }}
                                type="text" name="nome" id="nome"
                                fontWeight={'medium'}
                                _placeholder={{
                                    color: "gray.600"
                                }}
                                paddingLeft={4}
                                borderWidth={2}
                                borderRadius={'5px'}
                                variant='unstyled'
                                borderColor={'gray.900'}
                                placeholder="nome"
                            />
                            <Input
                                height={'14'}
                                fontSize={'md'}
                                focusBorderColor='gray.900'
                                value={userInfo.surname}
                                autoComplete={'on'}
                                onChange={(e) => {
                                    setUserInfo(prevState => {
                                        return {
                                            ...prevState,
                                            surname: e.target.value
                                        }
                                    })
                                }}
                                type="text" name="cognome" id="cognome"
                                fontWeight={'medium'}
                                _placeholder={{
                                    color: "gray.600"
                                }}
                                paddingLeft={4}
                                borderWidth={2}
                                borderRadius={'5px'}
                                variant='unstyled'
                                borderColor={'gray.900'}
                                placeholder="cognome"
                            />
                        </InputGroup>



                    </div>
                    <div
                        className='mb-3'
                    >
                        <Div_input_creation text={'data di nascita (facoltativa)'}>
                            <InputGroup
                                _hover={{
                                    borderColor: 'gray.900'
                                }}
                                gap={2}
                            >
                                <Input
                                    height={'14'}
                                    fontSize={'md'}
                                    focusBorderColor='gray.900'
                                    value={undefined}
                                    onChange={(e) => {
                                        const date = new Date(e.target.value)
                                        setUserInfo(prevState => {

                                            if (date < new Date('1920-01-01') || e.target.value.length <= 0 || date >= new Date()) {
                                                return {
                                                    ...prevState
                                                }
                                            }

                                            const age = Math.trunc(((new Date().getTime() - date.getTime())) / (1000 * 60 * 60 * 24 * 365));
                                            console.log(age);
                                            return {
                                                ...prevState,
                                                dateOfBirth: date
                                            }
                                        })
                                    }}
                                    type="date" name="date" id="date"
                                    max={new Date().toISOString().split('T')[0]}
                                    fontWeight={'medium'}
                                    _placeholder={{
                                        color: "gray.600"
                                    }}
                                    paddingLeft={4}
                                    borderWidth={2}
                                    paddingRight={3}

                                    borderRadius={'5px'}
                                    variant='unstyled'
                                    borderColor={'gray.900'}
                                    placeholder="data di nascita"
                                />
                            </InputGroup>
                        </Div_input_creation>

                    </div>

                    <Select
                        borderWidth={2}
                        height={'14'}
                        fontSize={'md'}
                        focusBorderColor='white'
                        borderColor={'gray.900'}
                        fontWeight={'medium'}
                        borderRadius={'5px'}
                        _focus={{
                            borderWidth: 2,
                            borderColor: 'black'
                        }}
                        _hover={{
                            borderColor: 'black'
                        }}
                        onChange={(event) => {
                            setUserInfo((prevState: UserInfo) => {
                                if (event.target.value === 'i') return {
                                    ...prevState,
                                    gender: null

                                }
                                return {
                                    ...prevState,
                                    gender: event.target.value
                                }
                            })
                        }}
                        _placeholder={{
                            color: "gray.600"
                        }}
                        defaultValue={'Quale categoria di interessa?'}
                    >

                        <option value="Quale categoria di interessa?" disabled>Quale categoria di interessa?</option>
                        {typeInterest.map((option) => {
                            return (<option
                                key={option.value} value={option.value}>{option.text}</option>)
                        })}

                    </Select>

                </>

            }
            {type !== 'reset_password' &&
                <div className='w-full flex justify-end pt-2 gap-2'>
                    {account === 'user' && <Button
                        variant={'black'}
                        _disabled={{
                            bg: '#000000'
                        }}
                        _hover={{
                            color: 'primary.text'
                        }}

                        height={12}
                        width={52}
                        borderRadius={10}
                        size={'md'}
                        type='button'
                        onClick={handleGoogle}
                    >
                        {type == 'registration' ? 'registrati con Google' : 'accedi con Google'}
                    </Button>}
                    <Button
                        variant={'black'}
                        _disabled={{
                            bg: '#000000'
                        }}
                        _hover={{
                            color: 'primary.text'
                        }}
                        height={12}
                        width={52}
                        type='submit'
                        borderRadius={10}
                        size={'md'}
                        isDisabled={!isValidEmail || !isValidPassword || (type === 'registration' && account === 'user' ? (userInfo.name === '' || userInfo.surname === '' || userInfo.gender === '') : false)}

                    >
                        {type == 'registration' ? 'registrati' : 'accedi'}
                    </Button>

                </div>}
            {type === 'reset_password' &&
                <div className='w-full flex justify-end pt-2 md:pt-1' >
                    <Button disabled={!isValidEmail || isLoading} onClick={async () => {
                        setisLoading(true)
                        try {
                            const result = await resetPassword(email)
                            return addToast({ position: 'top', title: 'controlla la casella mail', description: 'ti abbiamo inviato una mail per resettare la password', status: 'success', duration: 5000, isClosable: true })

                        } catch (e) {
                            console.log(e);
                            setisLoading(false)
                        }
                    }
                    }
                        variant={'secondary'}
                        _disabled={{
                            bg: 'secondary.bg'
                        }}
                        _hover={{

                            color: 'secondary.text'
                        }}
                        borderRadius={10} size={'md'}>resetta password</Button>
                </div>}
            <div className='flex mt-2 md:mt-4'>
                {(type === 'registration') && <LoginButton />}
                {(type === 'reset_password') && <LoginButton />}

                {type === 'login' &&
                    <div className='grid'>
                        <p className=' text-black	'>non hai ancora un account?
                            <Button className='underline ml-1' onClick={() => handleType('registration')} variant='link' colorScheme={'black'}>
                                Registrati
                            </Button>
                        </p>
                        <p className='mt-1 text-black	'>hai dimenticato la tua password?

                            <Button className='underline md:ml-1' onClick={() => handleType('reset_password')} variant='link' colorScheme={'black'}>
                                Resetta password
                            </Button>
                        </p>
                    </div>
                }
            </div>

        </form>
    )
}

export default Login_or_Registration