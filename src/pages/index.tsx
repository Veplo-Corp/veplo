import type { GetStaticProps, NextPage } from 'next'
import { Button, Box, Stack, Text, InputGroup, Input, VStack, Icon, Highlight, Heading, ButtonGroup } from '@chakra-ui/react'
import BlackButton from '../../components/atoms/BlackButton'
import { FC, useEffect, useRef, useState } from 'react'
import Drawer_Address from '../../components/organisms/Drawer_Address'
import Image from 'next/image'
import Shop_not_Allowed from '../../components/utils/Shop_not_Allowed'
import Desktop_Layout from '../../components/atoms/Desktop_Layout'
import Gradient_Component_home from '../../components/molecules/Gradient_Component_home'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import createUrlSchema from '../../components/utils/create_url'
import PostMeta from '../../components/organisms/PostMeta'
import Section from '../../components/atoms/Section'
import { getFromLocalStorage } from '../../components/utils/getFromLocalStorage'
import { setInLocalStorage } from '../../components/utils/setInLocalStorage'
import Link from 'next/link'
import ModalForm from '../../components/organisms/ModalForm'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import CREATE_FORM_INFO_BUSINESS from '../lib/apollo/mutations/createFormInfoBusiness'
import { initApollo } from '../lib/apollo'
import GET_COMPONENTS_HOME_LIST from '../lib/apollo/dato_CMS/queries/getComponentsHomeList'
import { Instagram, SendMail } from 'iconoir-react'

type InputForm = {
  email: string,
  userName: string,
  businessName: string,
  phone: string,
}



export const getStaticProps: GetStaticProps<{}> = async () => {

  const apolloClient = initApollo()

  try {
    const { data } = await apolloClient.query({
      query: GET_COMPONENTS_HOME_LIST,
      context: {
        clientName: 'DATO_CMS_LINK',
      }
    })

    if (data?.allListComponentWithImages) {
      return {
        props: { data },
        revalidate: 10000
      }
    }

    return {
      props: {},
      revalidate: 1
    }
  } catch (e) {
    console.log(e);

    return {
      props: {},
      revalidate: 1
    }
  }




}

interface ListComponents {
  allListComponentWithImages: AllListComponentWithImages[]
}

interface AllListComponentWithImages {
  title: string,
  imageAndText: {
    titolo: string,
    immagine: {
      url: string
    }
  }[]
}


const Home: FC<{ data: ListComponents }> = ({ data }) => {
  console.log(data);

  // const dispatch = useDispatch();

  // let filterTimeout: any;
  /* drawer */
  const [openDrawer, setopenDrawer] = useState(1)
  const router = useRouter()
  const address_user = useSelector((state: any) => state.address.address);
  const [showHome, setshowHome] = useState<boolean>(false);
  const [modalForm, setModalForm] = useState(false)
  const [modalConfirmSubmit, setModalConfirmSubmit] = useState(false)
  const { register, handleSubmit, reset, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<InputForm>({
    mode: "all",
  });
  const [createForm] = useMutation(CREATE_FORM_INFO_BUSINESS);
  const [displayText, setDisplayText] = useState("");





  const onSubmitForm = async (value: InputForm) => {
    console.log(value);
    setModalForm(false)
    setTimeout(async () => {
      setModalConfirmSubmit(true)

      await createForm({
        variables: {
          options: {
            userName: value.userName,
            businessName: value.businessName,
            email: value.email,
            phone: value.phone,
          }
        }
      })
    }, 1000);
    reset()

  }

  const ButtonGroupGender = () => {
    return (
      <>
        {router.query.gatto === 'berry' ? (
          <ButtonGroup
            gap={5}
            mb={0}
            mt={4}
            width={'full'}
          >
            <Link
              href={'/abbigliamento/donna-abbigliamento/tutto/rilevanza'}
              className='w-full'
            >
              <Button
                width={'full'}
                variant={'whiteButton'}
                borderWidth={0}
                padding={6}
                paddingY={7}
                fontSize={'xl'}
                borderRadius={'30px'}
                style={{
                  boxShadow: '0px 0px 20px 0px rgba(173, 173, 173, 0.25)'
                }}

              >
                Donna
              </Button>
            </Link>

            <Link
              href={'/abbigliamento/uomo-abbigliamento/tutto/rilevanza'}
              className='w-full'
            >
              <Button
                width={'full'}
                variant={'whiteButton'}
                borderWidth={0}
                padding={6}
                paddingY={7}
                fontSize={'xl'}
                borderRadius={'30px'}
                style={{
                  boxShadow: '0px 0px 20px 0px rgba(173, 173, 173, 0.25)'
                }}

              >
                Uomo
              </Button>
            </Link>
          </ButtonGroup>)
          : (
            <></>
            // {/* <Button
            //               mt={2}
            //               width={'full'}
            //               variant={'whiteButton'}
            //               borderWidth={0}
            //               padding={6}
            //               paddingY={7}
            //               fontSize={'xl'}
            //               borderRadius={'30px'}
            //               style={{
            //                 boxShadow: '0px 0px 20px 0px rgba(173, 173, 173, 0.25)'
            //               }}

            //             >
            //               entra nella Waitlist
            //             </Button> */}

          )
        }
      </>
    )
  }

  return (
    <>
      <PostMeta
        canonicalUrl='https://www.veplo.it'
        title={'Veplo | Libera il tuo stile '}
        subtitle={"Il Marketplace che seleziona i migliori marchi indipendenti e negozi in circolazione | Hai presente il fast fashion? Allontanati da questa idea più che puoi | Abbigliamento · Scarpe · Vestiti"}
        image={''}
        description={"Il Marketplace che seleziona i migliori marchi indipendenti e negozi in circolazione | Hai presente il fast fashion? Allontanati da questa idea più che puoi | Abbigliamento · Scarpe · Vestiti"}

      />


      <Shop_not_Allowed>
        <Box
          bgColor={'primary.bg'}
          className='w-full rounded-b-[4vh] h-fit pb-1'
        >
          <img loading='lazy'
            className='m-auto pt-4 px-10 pb-3 h-[23vh] w-full'
            src='https://www.datocms-assets.com/102220/1688372964-veplo_graffiti_mobile.png'
          />
          <Box
            bgColor={'primary.text'}
            margin={5}
            borderRadius={'30px'}
            marginTop={0}
            padding={6}
            paddingY={8}
            style={{
              boxShadow: '0px 4px 20px 20px rgba(255, 255, 255, 0.25)'
            }}
          >
            <Text
              fontSize={'5vh'}
              fontWeight={'black'}
              lineHeight={'48px'}
              color={'primaryBlack.text'}
            >
              Lo spazio dei <br />
              <span
                className='text-[#FF5A78]'
              >
                brand
              </span><br />made in Italy
            </Text>
            <Text
              my={3}
              color={'#909090'}
              fontWeight={'regular'}
              fontSize={'18px'}
              lineHeight={'22px'}
            >
              connettiamo i migliori brand di abbigliamento made in Italy in un unico negozio online
            </Text>
            <ButtonGroupGender />
            <Button
              marginTop={6}
              width={'full'}
              variant={'primary'}
              padding={6}
              paddingY={7}
              fontSize={'xl'}
              borderRadius={'30px'}
              style={{
                boxShadow: '0px 4px 20px 0px rgba(255, 90, 120, 0.75)'
              }}
              onClick={() => { setModalForm(true) }}

            >
              Sono un brand!
            </Button>
          </Box>
        </Box>
        <Box
          marginY={10}
          marginX={7}
        >
          <Text
            fontSize={'4.3vh'}
            fontWeight={'black'}
            textAlign={'center'}
            color={'primaryBlack.text'}
            mb={5}
          >
            {data?.allListComponentWithImages[1].title}
          </Text>
          <VStack gap={5}
            mb={5}
            align='stretch'
            textAlign={'left'}
          >
            {data?.allListComponentWithImages[1].imageAndText.map((value, index) => (
              <Box
                key={index}
                display={'flex'}
                gap={5}
              >
                <img loading='lazy'
                  className='w-6 h-6 my-auto'
                  src={value.immagine.url}
                />
                <Text
                  textAlign={'left'}
                  fontSize={'18px'}
                  fontWeight={'normal'}
                  color={'#909090'}
                >
                  {value.titolo}
                </Text>
              </Box>
            ))}
          </VStack>
          <ButtonGroupGender />

        </Box>
        <Box
          marginY={10}
          marginX={7}
        >
          <Text
            fontSize={'4.3vh'}
            fontWeight={'black'}
            textAlign={'center'}
            color={'primaryBlack.text'}
            mb={5}
          >
            {data?.allListComponentWithImages[0].title}
          </Text>
          <VStack gap={5}
            mb={5}
            align='stretch'
            textAlign={'left'}
          >
            {data?.allListComponentWithImages[0].imageAndText.map((value, index) => (
              <Box
                key={index}
                display={'flex'}
                gap={5}
              >
                <img loading='lazy'
                  className='w-6 h-6 my-auto'
                  src={value.immagine.url}
                />
                <Text
                  textAlign={'left'}
                  fontSize={'18px'}
                  fontWeight={'normal'}
                  color={'#909090'}
                >
                  {value.titolo}
                </Text>
              </Box>
            ))}
          </VStack>

        </Box>
        <Box
          bgColor={'primary.bg'}
          className='w-full rounded-t-[4vh] h-fit pt-6 pb-1'
        >
          <Box
            bgColor={'primary.text'}
            margin={5}
            borderRadius={'30px'}
            marginTop={0}
            marginBottom={0}
            padding={8}
            paddingBottom={10}
            style={{
              boxShadow: '0px 4px 20px 20px rgba(255, 255, 255, 0.25)'
            }}
          >
            <Text
              fontSize={'3.8vh'}
              fontWeight={'black'}
              lineHeight={'48px'}
              color={'primaryBlack.text'}
              mb={3}
            >
              Allora, da dove<br />
              iniziamo <span
                className='text-[#FF5A78]'
              >
                oggi?
              </span>
            </Text>

            <ButtonGroupGender />
            <Button
              marginTop={6}
              width={'full'}
              variant={'primary'}
              padding={6}
              paddingY={7}
              fontSize={'xl'}
              borderRadius={'30px'}
              style={{
                boxShadow: '0px 4px 20px 0px rgba(255, 90, 120, 0.75)'
              }}
              onClick={() => { setModalForm(true) }}
            >
              Sono un brand!
            </Button>
          </Box>
          <Instagram
            cursor={'pointer'}
            onClick={() => {
              router.push('https://www.instagram.com/veplo_it/')
            }}
            className='m-auto my-12'
            strokeWidth={1.5}
            color='white'
            width={'40px'}
            height={'40px'}
          />
        </Box>











      </Shop_not_Allowed >
      <ModalForm closeModal={() => setModalForm(false)} isOpen={modalForm}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Text
            fontSize={'3xl'}
            fontWeight={'black'}
            mb={2}
            mt={1}
            lineHeight={'9'}
            color={'primaryBlack.text'}
          >
            Richiesta contatto
          </Text>
          <Text
            fontSize={'sm'}
            fontWeight={'medium'}
            color={'#909090'}
            lineHeight={'short'}
            mb={5}
          >
            non ti preoccupare, compilando questo form verrai contattato direttamente da noi!
          </Text>
          <VStack
            gap={3}
          >
            <Input
              placeholder='email'
              id='email'
              type='email'
              py={5}
              rounded={'10px'}
              _placeholder={{
                //color: 'gray.200',
                fontWeight: '600'
              }}
              variant='filled'
              {...register("email", {
                required: true,
                pattern: /\S+@\S+\.\S+/
              })}
            >
            </Input>
            <Input
              placeholder='nome e cognome'
              id='userName'
              type='text'
              py={5}
              rounded={'10px'}
              _placeholder={{
                //color: 'gray.200',
                fontWeight: '600'
              }}
              variant='filled'
              {...register("userName", {
                required: true,
              })}
            >
            </Input>
            <Input
              placeholder='nome del tuo brand'
              id='businessName'
              type='text'
              py={5}
              rounded={'10px'}
              _placeholder={{
                //color: 'gray.200',
                fontWeight: '600'
              }}
              variant='filled'
              {...register("businessName", {
                required: true,
                minLength: 2
              })}
            >
            </Input>
            <Input
              placeholder='numero di telefono'
              id='phone'
              type='tel'
              py={5}
              rounded={'10px'}
              _placeholder={{
                //color: 'gray.200',
                fontWeight: '600'
              }}
              variant='filled'
              {...register("phone",
                { required: true, minLength: 7 }
                ,)}

            >
            </Input>


          </VStack>
          <Button
            mt={8}
            size={'lg'}
            fontSize={['lg', 'xl']}
            fontWeight={'bold'}
            type={'submit'}
            py={'28px'}
            width={'full'}
            borderRadius={'30px'}
            variant={'primary'}

          >
            conferma
          </Button>
        </form>

      </ModalForm>
      <ModalForm closeModal={() => setModalConfirmSubmit(false)} isOpen={modalConfirmSubmit}>
        <Box
          textAlign={'center'}
          display={'grid'}
        >

          <VStack
            gap={5}
          >
            <SendMail
              className='h-16 w-16 mt-1'
              color='#FF5A78'
            />
            <Text
              fontSize={'4xl'}
              fontWeight={'black'}
              color={'primaryBlack.bg'}
              lineHeight={'6'}
            >
              Grazie!
            </Text>
            <Text
              fontSize={'16px'}
              fontWeight={'regular'}
              color={'#909090'}
              lineHeight={'short'}

            >
              La tua richiesta e’ stata inviata con successo. In questi giorni verrai contattato tramite cellulare o email.
            </Text>

            <Button

              size={'lg'}
              fontSize={['lg', 'xl']}
              fontWeight={'bold'}
              onClick={() => setModalConfirmSubmit(false)}
              py={'28px'}
              width={'full'}
              borderRadius={'30px'}
              variant={'primary'}
            >
              affare fatto!
            </Button>
          </VStack>

        </Box>



      </ModalForm>
    </>

  )


}




export default Home
