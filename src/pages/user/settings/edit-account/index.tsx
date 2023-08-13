import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Box, Button, ButtonGroup, Divider, IconButton, Input, InputGroup, Spinner, VStack } from '@chakra-ui/react';
import { sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../../components/atoms/Div_input_creation';
import SettingsCard from '../../../../../components/molecules/SettingsCard'
import ModalReausable from '../../../../../components/organisms/ModalReausable';
import Modal_Error_Shop from '../../../../../components/organisms/Modal_Error_Shop';
import { removeSpecialCharacters } from '../../../../../components/utils/removeSpecialCharacters';
import { ToastOpen } from '../../../../../components/utils/Toast';
import { auth } from '../../../../config/firebase';
import { Firebase_User } from '../../../../interfaces/firebase_user.interface';
import { User } from '../../../../interfaces/user.interface';
import EDIT_USER_INFO from '../../../../lib/apollo/mutations/editUserInfo';
import GET_USER from '../../../../lib/apollo/queries/getUser';
import { changeName } from '../../../../store/reducers/user';
import NoIndexSeo from '../../../../../components/organisms/NoIndexSeo';
import PostMeta from '../../../../../components/organisms/PostMeta';

interface Props {
    user: User
}



const index = () => {
    const { addToast } = ToastOpen();

    const { data } = useQuery(GET_USER, {
        variables: {
            limit: 0,
            offset: 0,
            onlyIds: true
        }
    });
    const [isOpenPasswordModal, setIsOpenPasswordModal] = useState(false)
    const [isOpenNameModal, setIsOpenNameModal] = useState(false)
    const [userName, setuserName] = useState({
        name: '',
        surname: ''
    })
    const dispatch = useDispatch();




    const [editUserInfo] = useMutation(EDIT_USER_INFO, {
        update(cache, el, query) {






            const normalizedId = cache.identify({ id: data?.user?.id, __typename: 'User' });

            cache.modify({
                id: normalizedId,
                fields: {
                    name(/* cachedvalue */) {
                        return query?.variables?.options.name
                    },
                    surname(/* cachedvalue */) {
                        return query?.variables?.options.surname
                    },
                }
            })
            dispatch(
                changeName(query?.variables?.options.name)
            );
        }

    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (data?.user) {
            setuserName({
                name: data?.user?.name ? data?.user?.name : '',
                surname: data?.user?.surname ? data?.user?.surname : '',
            })
        }
    }, [data])


    const editPassword = async () => {
        if (!data?.user?.email) return
        try {
            await sendPasswordResetEmail(auth, data.user.email)
            setIsOpenPasswordModal(true)
        } catch (e) {

            return addToast({ position: 'top', title: "c'è stato un problema", description: 'non siamo riusciti ad inviare la mail al tuo indirizzo', status: 'error', duration: 5000, isClosable: true })
        }
    }

    const editNameOrSurname = async () => {
        if (data?.user?.name === userName.name && data?.user.surname === userName.surname || isLoading) return

        setIsLoading(true)
        try {
            await editUserInfo({
                variables: {
                    options: {
                        name: userName.name,
                        surname: userName.surname
                    }
                }
            })

            if (auth?.currentUser) {
                updateProfile(auth?.currentUser, {
                    displayName: userName.name
                })
            }


            setIsLoading(false);
            setIsOpenNameModal(false)
        } catch (e: any) {

            setIsLoading(false)
            return addToast({ position: 'top', title: "c'è stato un problema", description: 'non siamo riusciti a modificare le informazioni', status: 'error', duration: 5000, isClosable: true })
        }

    }



    return (
        <>
            <NoIndexSeo />
            <PostMeta
                canonicalUrl={'https://www.veplo.it/user/settings/edit-account'}
                title={'Gestisci account | Veplo'}
                subtitle={"Veplo è lo spazio dove trovare i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile."}
                image={""}
                description={"Veplo è lo spazio dove trovare i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile."}
            />
            <Desktop_Layout>
                <div className='flex w-full mt-8 md:mt-10' >
                    <div className='md:p-3 space-y-4 m-auto w-full md:w-8/12 lg:w-1/2'>
                        {data && <SettingsCard title='Impostazioni'>
                            <Box
                                paddingY={5}
                                paddingX={8}
                                display={'flex'}
                                justifyContent={'space-between'}
                            >
                                <Box>{data?.user?.email}</Box>

                            </Box>
                            <Divider
                                borderColor={'gray.400'}
                            />
                            <Box
                                paddingY={5}
                                paddingX={8}
                                display={'flex'}
                                justifyContent={'space-between'}
                            >
                                <Box>***********</Box>
                                <Box
                                    cursor={'pointer'}
                                    className='underline underline-offset-2'
                                    onClick={editPassword}
                                >
                                    cambia password
                                </Box>
                            </Box>
                            <Divider
                                borderColor={'gray.400'}
                            />
                            <Box
                                paddingY={5}
                                paddingX={8}
                                display={'flex'}
                                justifyContent={'space-between'}
                            >
                                <Box
                                    marginY={'auto'}
                                >
                                    {data?.user?.name}  {data?.user?.surname}
                                </Box>

                                <IconButton
                                    cursor={'pointer'}
                                    onClick={() => setIsOpenNameModal(true)}
                                    aria-label='Search database' icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    } />
                            </Box>
                        </SettingsCard>}

                    </div>
                </div>
            </Desktop_Layout>
            <ModalReausable title='Cambia Password' closeModal={() => setIsOpenPasswordModal(false)} isOpen={isOpenPasswordModal}>
                <Box
                    marginTop={3}
                    fontSize={'md'}
                    fontWeight={'normal'}
                    color={'gray.500'}
                >
                    ti abbiamo appena inviato una mail a {data?.user?.email}!
                </Box>
                <ButtonGroup gap='4'
                    marginTop={5}
                    textAlign={'end'}
                >
                    <Button
                        onClick={() => setIsOpenPasswordModal(false)}
                        variant={'ghost'}
                        colorScheme='facebook'>Chiudi</Button>
                </ButtonGroup>
            </ModalReausable>
            <ModalReausable title='Modifica informazioni' closeModal={() => setIsOpenNameModal(false)} isOpen={isOpenNameModal}>
                <VStack
                    marginTop={4}
                    spacing={1}
                    align='stretch'
                >
                    <Div_input_creation text='Nome'>
                        <InputGroup >
                            <Input
                                maxLength={20}
                                rounded={10}
                                paddingY={6}
                                autoComplete="new-password"
                                type="text"
                                value={userName.name}
                                onChange={(event) => setuserName(prevState => {
                                    const name = removeSpecialCharacters(event.target.value)
                                    return {
                                        ...prevState,
                                        name
                                    }
                                })}
                                isInvalid={false}
                            />
                        </InputGroup>
                    </Div_input_creation>
                    <Div_input_creation text='Cognome'>
                        <InputGroup >
                            <Input
                                pattern="^(\d|\w)+$"
                                maxLength={20}
                                rounded={10}
                                paddingY={6}
                                autoComplete="new-password"
                                type="text"
                                value={userName.surname}
                                onChange={(event) => setuserName(prevState => {
                                    const surname = removeSpecialCharacters(event.target.value)
                                    return {
                                        ...prevState,
                                        surname
                                    }
                                })}
                                isInvalid={false}
                            />
                        </InputGroup>
                    </Div_input_creation>
                </VStack>

                <ButtonGroup gap='1'
                    marginTop={5}
                    textAlign={'end'}
                >
                    <Button
                        onClick={() => setIsOpenNameModal(false)}
                        variant={'ghost'}
                        colorScheme='facebook'>Chiudi
                    </Button>

                    <Button
                        isDisabled={userName.name.length <= 0 || userName.surname.length <= 0}
                        onClick={editNameOrSurname}
                        minWidth={28}
                        variant={'primary'}
                        _disabled={{
                            bg: 'primary.bg'
                        }}
                        _hover={{
                            color: 'primary.text'
                        }}
                    >
                        {
                            !isLoading ? (
                                <span>
                                    Conferma
                                </span>
                            ) : (
                                <Spinner
                                    thickness='2px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='green.500'
                                    size='sm'
                                />
                            )

                        }

                    </Button>
                </ButtonGroup>
            </ModalReausable>
        </>

    )
}

export default index