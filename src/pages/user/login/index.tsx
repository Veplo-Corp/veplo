import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Firebase_User } from '../../../interfaces/firebase_user.interface';

import { Box, Button } from '@chakra-ui/react';
import AuthenticationLayout from '../../../../components/atoms/AuthenticationLayout';

import LoginAndRegistrationForm, { InputFormLogin } from '../../../../components/organisms/LoginAndRegistrationForm';
import Head from 'next/head';
import { getGender } from '../../../../components/utils/getGender';
import PostMeta from '../../../../components/organisms/PostMeta';

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

    if (user.statusAuthentication === 'logged_in' && user?.isBusiness) {
      router.replace('/shop/home')
    }
    if (user.statusAuthentication === 'logged_in' && !user?.isBusiness) {
      const genderName = getGender()
      if (!genderName) {
        router.replace('/negozi/brand')
      } else {
        router.replace(`/abbigliamento/${genderName}-tutto/tutto/rilevanza`)
      }
    }
    return () => {

    }
  }, [user])










  return (
    <AuthenticationLayout>
      <PostMeta
        canonicalUrl={'https://www.veplo.it' + router.asPath}
        title={`Login | Veplo`}
        subtitle={"Veplo è lo spazio dove trovare i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile."}
        image={''}
        description={"Veplo è lo spazio dove trovare i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile."}
      />
      <Button
        className='absolute top-3 left-1 lg:top-5 lg:left-3'
        fontSize={['25px', '3xl']}
        fontWeight={'black'}
        colorScheme='white'
        onClick={() => {
          router.replace('/negozi/brand')
        }}
      >VEPLO</Button>
      <Box className={` ${person === 'user' ? 'mt-[11vh] lg:mt-[12vh]' : 'mt-[19vh] lg:mt-[20vh]'}  px-4 md:px-0`}>
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

