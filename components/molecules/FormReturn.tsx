import { Button, Input, Spinner, Text, VStack, Box } from '@chakra-ui/react';
import Link from 'next/link';
import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form';

type InputForm = {
    orderCode: string,
    phone: string,
    email: string,
}

const FormReturn: FC<{ orderCode?: string, phone?: string, email?: string, handleSubmitButton: (value: InputForm) => void }> = ({ orderCode, phone, email, handleSubmitButton }) => {
    const { register, handleSubmit, reset, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<InputForm>({
        mode: "all",
        defaultValues: {
            phone,
            orderCode,
            email
        }
    });
    const [isLoading, setisLoading] = useState(false)


    const onSubmitForm = async (value: InputForm) => {
        setisLoading(true)
        handleSubmitButton(value)

    }
    return (
        <form onSubmit={handleSubmit(onSubmitForm)}>
            <Text
                fontSize={'3xl'}
                fontWeight={'black'}
                mb={3}
                lineHeight={'9'}
            >
                Richiesta reso
            </Text>
            <Text
                fontSize={'sm'}
                fontWeight={'medium'}
                color={'gray.800'}
                lineHeight={'short'}
                mb={5}
            >vuoi sapere come funziona la procedura di reso con Veplo? <Link href=""
                className='underline'
            >politica di reso</Link>
            </Text>

            <VStack
                gap={0}
            >
                <Box
                    width={'full'}
                >
                    <Text
                        fontSize={'sm'}
                        ml={1.5}
                        fontWeight={'normal'}
                    >
                        codice ordine
                    </Text>
                    <Input
                        disabled={true}
                        placeholder='codice ordine'
                        id='order_code'
                        type='text'
                        py={5}
                        rounded={'10px'}
                        _disabled={{
                            color: 'gray.800'
                        }}
                        _placeholder={{
                            //color: 'gray.200',
                            fontWeight: '600'
                        }}
                        variant='filled'
                        {...register("orderCode", {
                            required: true,
                            minLength: 6,
                            maxLength: 6
                        })}
                    >
                    </Input>
                </Box>
                <Box
                    width={'full'}
                >
                    <Text
                        fontSize={'sm'}
                        ml={1.5}
                        fontWeight={'normal'}
                    >
                        email
                    </Text>
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
                    ></Input>
                </Box>

                <Box
                    width={'full'}
                >
                    <Text
                        fontSize={'sm'}
                        ml={1.5}
                        fontWeight={'normal'}
                    >
                        telefono
                    </Text>
                    <Input
                        placeholder='telefono'
                        id='phone'
                        type='tel'
                        py={5}
                        rounded={'10px'}
                        _placeholder={{
                            //color: 'gray.200',
                            fontWeight: '600'
                        }}
                        variant='filled'
                        {...register("phone", {
                            required: true,
                            minLength: 8
                        })}
                    >
                    </Input>
                </Box>



            </VStack>
            <Button
                mt={8}
                size={'lg'}
                fontSize={['lg', 'xl']}
                fontWeight={'bold'}
                type={'submit'}
                py={'28px'}
                width={'full'}
                borderRadius={'10px'}
                color={'white'}
                background={'black'}
                _hover={{
                    bg: 'black'
                }}
                _focus={{
                    bg: 'black'
                }}
                _active={{
                    transform: 'scale(0.98)',
                }}
            >
                {!isLoading
                    ?
                    'attiva richiesta'
                    :
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.400'
                        color='white'
                        size='lg'
                    />
                }

            </Button>
        </form >
    )
}

export default FormReturn