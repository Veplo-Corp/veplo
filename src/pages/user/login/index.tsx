import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Firebase_User } from '../../../interfaces/firebase_user.interface';

import { Box, Button } from '@chakra-ui/react';
import AuthenticationLayout from '../../../../components/atoms/AuthenticationLayout';

import LoginAndRegistrationForm, { InputFormLogin } from '../../../../components/organisms/LoginAndRegistrationForm';

type InputForm = {
  email: string,
  password: string,
  firstName: string,
  lastName: string
}

const index = () => {
  const router = useRouter()
  const { type, person } = router.query;
  const user: Firebase_User = useSelector((state: any) => state.user.user);


  useEffect(() => {

    if (user && user?.isBusiness) {
      router.replace('/shop/home')
    }
  }, [user])













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
          type={(type === 'login' || type === 'registration' || type === 'reset_password') ? type : undefined}
          person={(person === 'business' || person === 'user') ? person : undefined}
          handleChangeTypeOrPerson={(type, person) => {
            router.replace(`/user/login?type=${type}&person=${person}`)
          }}
        />
      </Box>




    </AuthenticationLayout >
  )
}

export default index

