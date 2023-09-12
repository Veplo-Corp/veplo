import type { GetStaticProps } from 'next'
import { Button, Box, Stack, Text, Input, VStack, Icon, Highlight, Heading, ButtonGroup } from '@chakra-ui/react'
import { FC, memo, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'

import { Instagram, SendMail } from 'iconoir-react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Link from 'next/link'
import { initApollo } from '../../src/lib/apollo'
import GET_COMPONENTS_HOME_LIST from '../../src/lib/apollo/dato_CMS/queries/getComponentsHomeList'
import CREATE_FORM_INFO_BUSINESS from '../../src/lib/apollo/mutations/createFormInfoBusiness'
import PostMeta from './PostMeta'
import Shop_not_Allowed from '../utils/Shop_not_Allowed'
import ModalForm from './ModalForm'
import { Transition } from '@headlessui/react'


type InputForm = {
    email: string,
    userName: string,
    businessName: string,
    phone: string,
}



export interface ListComponents {
    allListComponentWithImages: AllListComponentWithImages[]
}

export interface AllListComponentWithImages {
    title: string,
    imageAndText: {
        titolo: string,
        immagine: {
            url: string
        }
    }[]
}


const HomePage: FC<{ data: ListComponents }> = ({ data }) => {

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
        setModalForm(false)
        setTimeout(async () => {
            setModalConfirmSubmit(true)

            await createForm({
                variables: {
                    options: {
                        userName: value.userName,
                        businessName: value?.businessName,
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
            <ButtonGroup
                gap={[2, 5, 5, 3]}
                mb={[1, 0]}

                width={'full'}
            >
                <Link
                    href={'/cerca/abbigliamento/donna-abbigliamento/tutto/rilevanza'}
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
                    href={'/cerca/abbigliamento/uomo-abbigliamento/tutto/rilevanza'}
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
            </ButtonGroup>


        )
    }

    return (
        <>
            <PostMeta
                canonicalUrl='https://www.veplo.it'
                title={"Veplo"}
                subtitle={"Veplo è lo spazio dove trovare i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile."}
                image={""}
                description={"Veplo è lo spazio dove trovare i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile."}
            />

            <Shop_not_Allowed>
                <Box
                    bgColor={'primary.bg'}
                    className='grid p-5 py-7 sm:py-16 lg:p-10 lg:py-0  lg:h-[86vh] rounded-b-[4vh] lg:rounded-b-[7vh]'
                >
                    {/* <Link
                        href={'https://www.veplo.it'}
                        className='flex lg:hidden '
                    >
                        <Box
                            className='mb-2 flex'
                        >
                            <img
                                src='/android-chrome-512x512.png'
                                loading='lazy'
                                className='w-12'
                            />
                            <Text
                                color={'primary.text'}
                                fontSize={'2xl'}
                                marginY={'auto'}
                                fontWeight={'extrabold'}
                            >
                                Veplo
                            </Text>
                        </Box>
                    </Link> */}

                    <Box
                        bgColor={'primary.text'}
                        borderRadius={'30px'}
                        className='p-6 py-8 lg:p-8 lg:h-[75vh]  my-auto rounded-b-[30px] lg:rounded-b-[7vh] sm:mx-auto sm:w-10/12 md:w-3/4 lg:w-full'
                        style={{
                            boxShadow: '0px 4px 20px 20px rgba(255, 255, 255, 0.25)'
                        }}
                        display={'flex'}
                        gap={10}
                    >

                        <Box
                            className='lg:ml-8 xl:ml-28 my-auto'
                        >

                            <Text
                                className='xl:w-full 2xl:max-w-[1100px] max-w-[1200px]'
                                fontWeight={'black'}
                                fontSize={['10.5vw', '10.5vw', '9vw', '7.5vw', '6.5vw', '6.2vw']}
                                lineHeight={['11vw', '11.5vw', '10vw', '8vw', '7vw', '6.8vw']}
                                color={'primaryBlack.text'}
                            >
                                Lo spazio {/* <br className='flex lg:hidden' /> */}
                                dove <span
                                    className='text-[#FF5A78]'
                                >
                                    scoprire<span className='lg:hidden'><br /></span>
                                </span> nuovi {/* <br className='hidden lg:grid' /> */}stili
                            </Text>
                            <Text
                                my={[3, 4]}
                                color={'#909090'}
                                fontWeight={'regular'}
                                fontSize={['18px', '18px']}
                                lineHeight={'23px'}
                                mb={[5, 7]}
                                className='lg:hidden'/* 'lg:w-7/12' */
                            >
                                connettiamo i migliori brand di abbigliamento italiani in un unico negozio online
                            </Text>
                            <Box
                                mt={[5, 5, 10, 10, 10]}
                                maxW={['full', 'full', 'full', '28vw', '24vw', '18vw']}
                            >
                                <ButtonGroupGender />
                                <Button
                                    marginTop={[4, 6, 6]}
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
                                    className='lg:hidden'
                                >
                                    Sono un brand
                                </Button>
                            </Box>



                        </Box>
                        {/* mook phone solo per web */}

                        <LazyLoadImage
                            src={'https://www.datocms-assets.com/102220/1694436945-mook-phone.png'}
                            alt={''}
                            className="object-cover h-[100%] mr-5 xl:mr-24 2xl:mx-auto hidden lg:flex"
                        />
                    </Box>
                </Box>
                {/*  <Box
                    bgColor={'primary.bg'}
                    className='w-full rounded-b-[4vh] h-fit pb-1 flex lg:hidden'
                >
                    <Box
                        bgColor={'primary.text'}
                        borderRadius={'30px'}

                        padding={[6, 6, 10]}
                        paddingY={[8, 8, 12]}
                        style={{
                            boxShadow: '0px 4px 20px 20px rgba(255, 255, 255, 0.25)'
                        }}
                        className='m-5 md:mx-auto sm:w-10/12 md:w-7/12 sm:mb-10 md:mb-8'

                    >
                        <Text
                            fontSize={['5vh', '7vh']}
                            fontWeight={'black'}
                            lineHeight={['48px', '60px']}
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
                            my={[3, 6]}
                            color={'#909090'}
                            fontWeight={'regular'}
                            fontSize={'18px'}
                            lineHeight={'22px'}
                            mb={7}
                        >
                            connettiamo i migliori brand di abbigliamento made in Italy in un unico negozio online
                        </Text>
                        <Box
                            mb={3}
                        >
                            <ButtonGroupGender />

                        </Box>
                        <Button
                            marginTop={[1, 1, 3]}
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
                            Sono un brand
                        </Button>
                    </Box>
                </Box> */}
                <Box
                    className='lg:flex sm:w-10/12 md:w-9/12 lg:w-11/12 xl:w-10/12 mx-auto my-8  lg:gap-12 xl:gap-20 justify-between'
                >
                    <Box
                        width={['', '', '', '50%', '40%']}
                    >
                        <Text
                            fontSize={'4.3vh'}
                            fontWeight={'black'}
                            textAlign={'center'}
                            color={'primaryBlack.text'}
                            mb={[5, 5, 5, 8]}
                        >
                            {data?.allListComponentWithImages[1].title}
                        </Text>
                        <VStack gap={[5, 5, 5, 8]}
                            mb={8}

                            align='stretch'
                            textAlign={'left'}
                        >
                            {data?.allListComponentWithImages[1].imageAndText.map((value, index) => (
                                <Box
                                    marginX={7}
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

                            <Link
                                href={'https://www.datocms-assets.com/102220/1690279179-veplo_brand.pdf'}
                                target='_blank'
                                className='flex'
                            >
                                <Button
                                    mx={'auto'}
                                    variant={'primary'}
                                    className='mx-auto md:mt-2'
                                    borderWidth={0}
                                    padding={8}
                                    paddingY={7}
                                    fontSize={'xl'}
                                    borderRadius={'30px'}
                                    style={{
                                        boxShadow: '0px 4px 20px 0px rgba(255, 90, 120, 0.75)'
                                    }}

                                >
                                    Scarica il PDF di presentazione
                                </Button>
                            </Link>

                        </VStack>


                    </Box>
                    <Box
                        marginX={7}
                    >
                        <Text
                            fontSize={'4.3vh'}
                            fontWeight={'black'}
                            textAlign={'center'}
                            color={'primaryBlack.text'}
                            mb={[5, 5, 5, 8]}

                        >
                            {data?.allListComponentWithImages?.[0]?.title}
                        </Text>
                        <VStack
                            gap={[5, 5, 5, 8]}
                            mb={[7, 7, 12, 7]}
                            align='stretch'
                            textAlign={'left'}
                        >
                            {data?.allListComponentWithImages?.[0].imageAndText.map((value, index) => (
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
                </Box>

                <Box
                    bgColor={'primary.bg'}
                    className='w-full rounded-t-[4vh] lg:rounded-none rou h-fit pt-6 pb-1'
                >
                    <Box
                        className='m-5 sm:mx-auto sm:w-3/4 md:w-1/2 lg:w-5/12 xl:w-[33vw] md:mb-8 mt-0 md:mt-5 lg:mt-7'
                        bgColor={'primary.text'}
                        borderRadius={'30px'}
                        marginBottom={0}
                        padding={[8, 8, 8, 10]}
                        paddingBottom={10}
                        style={{
                            boxShadow: '0px 4px 20px 20px rgba(255, 255, 255, 0.25)'
                        }}
                    >
                        <Text
                            fontSize={['4.4vh', '5vh', '5vh', '5.5vh']}
                            fontWeight={'black'}
                            //lineHeight={'48px'}
                            className='lg:leading-[7.5vh] leading-[6vh] sm:leading-[7vh]'
                            color={'primaryBlack.text'}
                            mb={[5, 5, 5, 7]}
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
                            marginTop={[4, 6]}
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
                            Sono un brand
                        </Button>
                    </Box>
                    <Link
                        href={'https://www.instagram.com/veplo.it/'}
                        target='_blank'
                    >
                        <Instagram
                            cursor={'pointer'}
                            className='m-auto my-12'
                            strokeWidth={1.5}
                            color='white'
                            width={'40px'}
                            height={'40px'}
                        />
                    </Link>

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
                                required: false,
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
                                required: false,
                                minLength: 2
                            })}
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




export default memo(HomePage)