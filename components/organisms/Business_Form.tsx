import { Input, InputGroup, InputLeftAddon, Textarea } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useForm } from 'react-hook-form';
import { Business } from '../../src/interfaces/business.interface';
import { Shop } from '../../src/interfaces/shop.interface';
import Div_input_creation from '../atoms/Div_input_creation'
import { DAYS } from '../mook/days';
import { imageKitUrl } from '../utils/imageKitUrl';




const Business_Form: FC<{ business: Business }> = ({ business }) => {

    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<Business>({
        mode: "all",
        defaultValues: business
    });


    return (
        <>
            <h1 className='text-xl lg:text-2xl font-extrabold mb-3 md:mb-4'>il tuo profilo</h1>
            <Div_input_creation text='Email proprietaria account'>
                <InputGroup>
                    <Input
                        autoComplete='off'
                        maxLength={35}
                        rounded={10}
                        paddingY={6}
                        type="text"
                        {...register("email", { required: true, maxLength: 30 })}
                        isInvalid={false}
                        disabled={true}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50'
                        }}
                        className='cursor-not-allowed'
                    />
                </InputGroup>
            </Div_input_creation>
            <Div_input_creation text='Ragione sociale'>
                <InputGroup>
                    <Input
                        autoComplete='off'
                        maxLength={35}
                        rounded={10}
                        paddingY={6}
                        type="text"
                        {...register("businessName", { required: true, maxLength: 30 })}
                        isInvalid={false}
                        disabled={true}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50'
                        }}
                        className='cursor-not-allowed'
                    />
                </InputGroup>
            </Div_input_creation>
            <Div_input_creation text='Partita Iva'>
                <InputGroup>
                    <Input
                        autoComplete='off'
                        maxLength={35}
                        rounded={10}
                        paddingY={6}
                        type="text"
                        {...register("vatNumber")}
                        isInvalid={false}
                        disabled={true}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50'
                        }}
                        className='cursor-not-allowed'
                    />
                </InputGroup>
            </Div_input_creation>
            <Div_input_creation text='Account ID Stripe'>
                <InputGroup>
                    <Input
                        autoComplete='off'
                        maxLength={35}
                        rounded={10}
                        paddingY={6}
                        type="text"
                        {...register("stripe.id")}
                        isInvalid={false}
                        disabled={true}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50'
                        }}
                        className='cursor-not-allowed'
                    />
                </InputGroup>
            </Div_input_creation>
            <Div_input_creation text='Numero di telefono'>

                <InputGroup
                >
                    <InputLeftAddon children='+39' paddingY={6} />
                    <Input
                        maxLength={12}
                        rounded={10}
                        paddingY={6}
                        type='tel'
                        isInvalid={false}
                        disabled={true}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50',
                        }}
                        //borderColor={`${isValid_shop_phone === false ? 'red.900' : 'gray.200'}`}
                        {...register("phone", { required: true, minLength: 6, maxLength: 12 })}
                    />
                </InputGroup>
            </Div_input_creation>

            {/* descrizione negozio  */}
            {/* <Div_input_creation text='Descrizione negozio (massimo 400 lettere)'>
                    <InputGroup>
                        <Textarea 
                        maxLength={400}
                        rounded={10}
                        paddingY={6}
                        height={'2xs'}
                        placeholder='inserisci una descrizione del negozio'
                        {...register("description")}
                        resize={'horizontal'}
                        />
                    </InputGroup>
                </Div_input_creation> */}
        </>
    )
}

export default Business_Form;