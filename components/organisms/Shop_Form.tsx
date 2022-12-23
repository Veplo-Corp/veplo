import { Input, InputGroup } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useForm } from 'react-hook-form';
import { Shop } from '../../src/interfaces/shop.interface';
import Div_input_creation from '../atoms/Div_input_creation'


interface IFormInputEdit {
    name?: string;
    postcode?: string
    address?: {
        city: string | undefined
        street: string
        location: {
            type: string,
            coordinates: number[]
        }
    }
    opening?: {
        days: number[],
        hours: string[]
    },
    description?: ''

    //! togliere description (obbligatoria), macrocategories e gendere in createProduct
    //!deve inserire tommaso
    piva: string
    photo: string
    phone: string
}


const Shop_Form: FC<{shop:Shop}> = ({shop}) => {
    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<IFormInputEdit>({
        mode: "all",
        defaultValues: {
            name: shop?.name || ''
        }
    });


    return (
        <form className="w-full flex  " onSubmit={() => { }}>
            <div className='p-3 w-full md:w-7/12 lg:w-5/12 m-auto'>
                <h1 className='italic text-xl lg:text-2xl font-extrabold mb-4'>la tua azienda</h1>
                <Div_input_creation text='Nome (visualizzato dagli utenti)'>
                    <InputGroup >
                        <Input
                            maxLength={35}
                            rounded={10}
                            paddingY={6}
                            type="text"
                            {...register("name", { required: true, maxLength: 30 })}
                            isInvalid={false}
                        />
                    </InputGroup>
                </Div_input_creation>
            </div>
        </form>
    )
}

export default Shop_Form