import React, { useState } from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import { useForm } from 'react-hook-form';
import Div_input_creation from '../../../../components/atoms/Div_input_creation';
import { Box, Button, Input, InputGroup, InputLeftAddon, VStack } from '@chakra-ui/react';
import BlackButton from '../../../../components/atoms/BlackButton';
import { useMutation } from '@apollo/client';
import CREATE_STRIPE_BUSINESS_ACCOUNT from '../../../lib/apollo/mutations/createStripeBusinessAccount';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Props {
    businessName: string,
    vatNumber: string,
    phoneNumber: string
}

const index = () => {
    const router = useRouter()
    const [isBusinessVAT, setisBusinessVAT] = useState<boolean | null>(null)
    const [businessPhoneNumber, setbusinessPhoneNumber] = useState('')
    const [isValid_businessPhoneNumber, setIsValid_businessPhoneNumber] = useState<boolean | null>(null)

    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<Props>({
        mode: "all",
        // defaultValues: {
        //     businessName: 'test',
        //     vatNumber: '12345454654',
        //     phoneNumber: '34324233332'
        // }
    });

    const [createBusinessStripeAccount] = useMutation(CREATE_STRIPE_BUSINESS_ACCOUNT);

    const changeInput = (e: any, type: string) => {
        let newTime: string;
        let value: string;
        if (type !== 'days_open') {
            value = e.target.value.replace(/[^0-9]+/g, '');
        }


        switch (type) {
            case 'businessVAT':
                value = e.target.value.replace(/[^0-9]/g, '')
                setValue('vatNumber', value);
                break;
            case 'businessPhoneNumber':
                value = e.target.value.replace(/[^0-9]/g, '')
                setValue('phoneNumber', value);
                setIsValid_businessPhoneNumber(true)
                break;
            default:
                console.log(`Sorry, we are out of ${type}.`);
        }
    }

    return (
        <Desktop_Layout>
            <form
                className='m-auto w-11/12 md:w-8/12 lg:w-6/12 xl:w-1/3'
                onSubmit={handleSubmit(async (data) => {
                    try {
                        console.log(data);
                        const options: Props = {
                            businessName: data.businessName,
                            vatNumber: data.vatNumber,
                            phoneNumber: data.phoneNumber
                        }
                        const responseGraphQL = await createBusinessStripeAccount({
                            variables: {
                                businessName: options.businessName,
                                vatId: options.vatNumber,
                                phone: options.phoneNumber
                            }
                        })
                        console.log(responseGraphQL.data.createStripeAccount);
                        const stripeId = responseGraphQL.data?.createStripeAccount
                        const endpoint = `/api/stripe/kyc-onboarding-link?stripeId=${stripeId}`

                        const response = await fetch(endpoint, {
                            method: "POST",
                            mode: "no-cors", // no-cors, *cors, same-origin
                            body: JSON.stringify({ stripeId })
                        })
                        const result = await response.json()
                        router.push(result.url)
                    } catch (e: any) {

                    }
                })}
            >
                <h1 className="mt-2 font-black text-2xl md:text-3xl italic text-black-900 mb-4 max-w-xs md:max-w-md">Completa le informazioni</h1>

                <VStack
                    spacing={[2, 3]}
                    align='stretch'
                >
                    <Div_input_creation text='Ragione sociale'>
                        <InputGroup
                        >
                            <Input
                                rounded={10}
                                paddingY={6}
                                autoComplete='off'
                                type="text"
                                {...register("businessName", {
                                    required: true,
                                })}
                                textAlign={"start"}
                                borderColor={'gray.300'}
                            />
                        </InputGroup>
                    </Div_input_creation>
                    <Div_input_creation text='Partita Iva'>
                        <InputGroup >
                            <Input
                                borderColor={`${isBusinessVAT === false ? 'red.900' : 'gray.300'}`}
                                maxLength={11}
                                rounded={10}
                                paddingY={6}
                                autoComplete='off'
                                type='tel'
                                {...register("vatNumber", { required: true, minLength: 11, maxLength: 11 })}
                                onChange={(event) => changeInput(event, 'businessVAT')}
                            />
                        </InputGroup>
                        {isBusinessVAT === false && <p className='text-sm md:text-xs text-red-600'>la Partita Iva deve contenere 11 numeri</p>}
                    </Div_input_creation>
                    <Div_input_creation text='Numero di telefono'>
                        <InputGroup
                        >
                            <InputLeftAddon children='+39' paddingY={6}
                                textColor={`${isValid_businessPhoneNumber === false ? 'red.900' : 'gray.500'}`}
                                borderColor={`${isValid_businessPhoneNumber === false ? 'red.900' : 'gray.300'}`}
                            />
                            <Input
                                maxLength={12}
                                autoComplete='off'
                                rounded={10}
                                paddingY={6}
                                type='tel'
                                borderColor={`${isValid_businessPhoneNumber === false ? 'red.900' : 'gray.300'}`}
                                {...register("phoneNumber", { required: true, minLength: 6, maxLength: 12 })}
                                onChange={(event) => changeInput(event, 'businessPhoneNumber')}

                            />
                        </InputGroup>
                        {isValid_businessPhoneNumber === false && <p className='text-sm md:text-xs text-red-600'>Inserisci un numero corretto</p>}
                    </Div_input_creation>
                </VStack>
                <Box
                    borderColor={'gray.300'}
                    borderWidth={1}
                    display={'flex'}
                    justifyContent={'space-between'}
                    paddingX={6}
                    paddingY={4}
                    background={'gray.50'}

                    borderRadius={'10'}
                    marginTop={6}
                    marginBottom={8}
                >
                    <Box
                        fontSize={['12px', '13px']}
                        mr={4}
                    >
                        Utilizziamo Stripe per assicurarci che i pagamenti avvengano in tempo e per mantenere al sicuro i tuoi dati personali.
                        Fai clic su <strong> Conferma informazioni </strong> per procedere alla registrazione con Stripe.
                    </Box>
                    <img
                        className='w-2/12 md:1/4'
                        src={'/static/stripeLogo.svg'}
                        alt='Stripe'
                    />
                </Box>

                <BlackButton
                    disabled={false}
                    typeButton='submit'
                    element='Conferma Informazioni'
                    borderRadius={10}
                    size={'lg'}
                    width={'full'}
                    heigth={14}
                ></BlackButton>
            </form>
        </Desktop_Layout>
    )
}

export default index