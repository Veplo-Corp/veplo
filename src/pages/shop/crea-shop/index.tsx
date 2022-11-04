import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../components/atoms/Div_input_creation'

const index = () => {

    const shop_name = useRef<HTMLInputElement>(null);
    const [shop_phone, setShop_phone] = useState('')
    const [shop_piva, setShop_piva] = useState('')
    const [open_hour, setOpen_hour] = useState('')
    const [close_hour, setClose_hour] = useState('')


    const onChangePhoneNumber = (e) => {
        const value: string = e.target.value.replace(/[^0-9\.]+/g, '');
        setShop_phone(value)
    }

    const onChangePiva = (e) => {
        const value: string = e.target.value.replace(/[^0-9\.]+/g, '');
        setShop_piva(value)
    }

    const changeHour = (e, type:string) => {
        switch (type) {
            case 'shop_phone':
                setShop_phone(e.target.value.replace(/[^0-9\.]+/g, ''))
                break;
            case 'shop_piva':
                setShop_piva(e.target.value.replace(/[^0-9\.]+/g, ''))
                break;
            case 'open_hour':
                setOpen_hour(e.target.value)
                break;
            case 'close_hour':
                setClose_hour(e.target.value)
                break;
            default:
                console.log(`Sorry, we are out of ${type}.`);
        }
    }

    return (
        <Desktop_Layout>
            <div className='flex justify-between w-full mb-96'>
                <form className="p-3 px-4 lg:px-16 xl:px-24 w-full md:w-6/12 xl:w-5/12" onSubmit={() => { }}>
                    <div className='w-full'>
                        <h1 className='italic text-xl lg:text-2xl font-extrabold mb-4'>parlaci di te!</h1>
                        <Div_input_creation text='Nome (visualizzato dagli utenti)'>
                            <InputGroup >
                                <Input
                                    maxLength={35}
                                    rounded={10}
                                    paddingY={6}
                                    type="text"
                                    ref={shop_name}
                                    isInvalid={false}
                                //onChange={()=> console.log(product_name.current.value)}
                                />
                            </InputGroup>
                        </Div_input_creation>
                        <Div_input_creation text='Numero di telefono'>
                            <InputGroup >
                                <InputLeftAddon children='+39' paddingY={6} />
                                <Input
                                    maxLength={12}
                                    rounded={10}
                                    paddingY={6}
                                    type='tel'
                                    value={shop_phone}
                                    isInvalid={false}
                                    onChange={(event) => changeHour(event, 'shop_phone')}
                                />
                            </InputGroup>
                        </Div_input_creation>
                        <Div_input_creation text='Partita Iva'>
                            <InputGroup >
                                <Input
                                    maxLength={11}
                                    rounded={10}
                                    paddingY={6}
                                    type='tel'
                                    value={shop_piva}
                                    isInvalid={false}
                                    onChange={(event) => changeHour(event, 'shop_piva')}
                                    />
                            </InputGroup>
                        </Div_input_creation>
                        <Div_input_creation text=''>
                            <InputGroup className='flex justify-between gap-2'>
                                <Div_input_creation text='orario apertura'>
                                    <Input
                                        rounded={10}
                                        paddingY={6}
                                        type="time"
                                        value={open_hour}
                                        onChange={(event) => changeHour(event, 'open_hour')}
                                    />
                                </Div_input_creation>
                                <Div_input_creation text='orario chiusura'>
                                    <Input
                                        rounded={10}
                                        paddingY={6}
                                        type="time"
                                        value={close_hour}
                                        onChange={(event) => changeHour(event, 'close_hour')}
                                    />
                                </Div_input_creation>
                            </InputGroup>
                        </Div_input_creation>
                    </div>

                </form>
            </div>
        </Desktop_Layout>
    )
}

export default index