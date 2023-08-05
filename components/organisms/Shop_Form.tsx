import { Input, InputGroup, InputLeftAddon, Textarea } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useForm } from 'react-hook-form';
import { Shop } from '../../src/interfaces/shop.interface';
import Div_input_creation from '../atoms/Div_input_creation'
import { DAYS } from '../mook/days';
import { imageKitUrl } from '../utils/imageKitUrl';
import SelectMultipleOptions from '../atoms/SelectMultipleOptions';
import { formatNumberWithTwoDecimalsInString } from '../utils/formatNumberWithTwoDecimalsInString';




const Shop_Form: FC<{ shop: Shop }> = ({ shop }) => {

    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<Shop>({
        mode: "all",
        defaultValues: shop
    });




    return (
        <>
            <h1 className='text-xl lg:text-2xl font-extrabold mb-3 md:mb-4'>Info Profilo</h1>

            <Div_input_creation text='Nome (visualizzato dagli utenti)'>
                <InputGroup>
                    <Input
                        autoComplete='off'
                        maxLength={35}
                        rounded={10}
                        paddingY={6}
                        type="text"
                        {...register("name", { required: true, maxLength: 30 })}
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

            <Div_input_creation text=''>
                <InputGroup className='flex justify-between gap-2'>
                    <Div_input_creation text='Città'>
                        <Input
                            maxLength={35}
                            rounded={10}
                            paddingY={6}
                            type="text"
                            {...register("address.city")}
                            isInvalid={false}
                            disabled={true}
                            _disabled={{
                                opacity: '1',
                                background: 'gray.50'
                            }}
                            className='cursor-not-allowed'
                        />
                    </Div_input_creation>
                    <Div_input_creation text='Indirizzo'>
                        <Input
                            maxLength={35}
                            rounded={10}
                            paddingY={6}
                            type="text"
                            {...register("address.street")}
                            isInvalid={false}
                            disabled={true}
                            _disabled={{
                                opacity: '1',
                                background: 'gray.50'
                            }}
                            className='cursor-not-allowed'
                        />
                    </Div_input_creation>
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
                        {...register("info.phone", { required: true, minLength: 6, maxLength: 12 })}
                    />
                </InputGroup>
            </Div_input_creation>
            <h1 className='text-xl lg:text-2xl font-extrabold mt-6 mb-2 md:mb-4'>Informazioni aggiuntive</h1>
            <Div_input_creation text='Immagine copertina'>
                <img src={imageKitUrl(shop.profileCover)}
                    className='w-full aspect-[4.8/3] object-cover rounded-md mb-4'
                />
            </Div_input_creation>
            <Div_input_creation text='Immagine profilo'>
                <img src={imageKitUrl(shop.profilePhoto)}
                    className='w-32 h-32 object-cover'
                />
            </Div_input_creation>
            <Div_input_creation text='Categorie'>
                <InputGroup>
                    <Input
                        autoComplete='off'
                        maxLength={35}
                        rounded={10}
                        paddingY={6}
                        type="text"
                        {...register(`categories`, { required: true, maxLength: 30 })}
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
            <Div_input_creation text='ordine minimo per spedizione gratuita'>
                <InputGroup
                >
                    <InputLeftAddon rounded={10} paddingY={6} children='€' paddingInline={6} />
                    <Input
                        maxLength={12}
                        rounded={10}
                        paddingY={6}
                        type='text'
                        isInvalid={false}
                        disabled={true}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50',
                        }}
                        value={formatNumberWithTwoDecimalsInString(shop.minimumAmountForFreeShipping)}
                        {...register("minimumAmountForFreeShipping", { required: true })}
                    />
                </InputGroup>

            </Div_input_creation>
            {/* <Div_input_creation text='Giorni di apertura'>
                <InputGroup>
                    <Input
                        autoComplete='off'
                        maxLength={35}
                        rounded={10}
                        paddingY={6}
                        type="text"
                        value={`${shop.info.opening.days.map((dayNumber) => { return DAYS.find(day => day.id === dayNumber.toString())?.name }).join(', ')}`}

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
            <Div_input_creation text='Orario di apertura'>
                <InputGroup>
                    <Input
                        autoComplete='off'
                        maxLength={35}
                        rounded={10}
                        paddingY={6}
                        type="text"
                        value={`${shop.info.opening?.hours[0]} - ${shop.info.opening?.hours[1]}`}
                        isInvalid={false}
                        disabled={true}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50'
                        }}
                        className='cursor-not-allowed'
                    />
                </InputGroup>
            </Div_input_creation> */}
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

export default Shop_Form