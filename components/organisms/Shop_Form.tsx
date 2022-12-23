import { Input, InputGroup, InputLeftAddon, Textarea } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useForm } from 'react-hook-form';
import { Shop } from '../../src/interfaces/shop.interface';
import Div_input_creation from '../atoms/Div_input_creation'




const Shop_Form: FC<{ shop: Shop }> = ({ shop }) => {
    console.log(shop);

    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<Shop>({
        mode: "all",
        defaultValues: shop
    });


    return (
        <form className="w-full flex" onSubmit={() => { }}>
            <div className='p-3 w-full sm:w-7/12 lg:w-5/12 m-auto'>
                <h1 className='italic text-xl lg:text-2xl font-extrabold mb-3 md:mb-4'>la tua azienda</h1>
                <Div_input_creation text='Nome (visualizzato dagli utenti)'>
                    <InputGroup>
                        <Input
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
                <Div_input_creation text='Partita Iva'>
                    <InputGroup>
                        <Input
                            maxLength={35}
                            rounded={10}
                            paddingY={6}
                            type="text"
                            {...register("piva")}
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
                            {...register("phone", { required: true, minLength: 6, maxLength: 12 })}
                        />
                    </InputGroup>
                </Div_input_creation>
                <h1 className='italic text-xl lg:text-2xl font-extrabold mt-6 mb-2 md:mb-4'>Informazioni aggiuntive</h1>
                <Div_input_creation text='Immagine negozio'>
                    <img src={shop.photo}
                        className='w-full aspect-[4.8/3] object-cover rounded-md mb-4'
                    />
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
            </div>
        </form>
    )
}

export default Shop_Form