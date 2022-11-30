import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout';
import DintorniLogo_Below_Header from '../../../../../components/molecules/DintorniLogo_Below_Header';
import { Box, Image } from '@chakra-ui/react'
import Box_Shop from '../../../../../components/molecules/Box_Shop';
import { Shop } from '../../../../interfaces/shop.interface';
import createUrlSchema from '../../../../../components/utils/create_url';
import getCityAndPostcodeFromSlug from '../../../../../components/utils/get_City_and_Postcode_from_Slug';
import getGenderandMacrocategory from '../../../../../components/utils/get_Gender_and_Macrocategory';

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}

export async function getStaticProps(ctx:any) {
    let { city_cap, gender_macrocategory } = ctx.params;
    const CITY_CAP: { city: string, postcode: string | null } = getCityAndPostcodeFromSlug(city_cap);
    const GENDER_MACROCATEGORY: { gender: string | null, macrocategory: string | null } = getGenderandMacrocategory(gender_macrocategory)

    return {
        props: {
            city: CITY_CAP.city,
            postcode: CITY_CAP.postcode,
            gender: GENDER_MACROCATEGORY.gender,
            macrocategory: GENDER_MACROCATEGORY.macrocategory
        }
    }
}

const index: React.FC<{ city: string, postcode: null | string, macrocategory: null | string, gender: string }> = ({ city, postcode, macrocategory, gender }) => {
    const router = useRouter()

    useEffect(() => {
        if (gender === null) {
            router.push('/')
        }
    }, [])

    if(gender === null) {return(<></>)}

    // const shop: Shop = {
    //     id: '635905bdadc75fa62375263f',
    //     name: 'Sartoria Rizzo Merlini',
    //     photo: 'data:image/jpeg;base64,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',
    //     status: 'active',
        
    // }

    let shops: Shop[] = [];

    // for (let i = 0; i < 20; i++) {
    //     shops.push(shop)
    // }

    const toStore = (shop: Shop) => {
        console.log(shop);
        const url = createUrlSchema([shop.address.city, shop.name])
        router.push({
            pathname: `/negozio/${shop.id}/${url}`,
        })
    }

    return (
        <Desktop_Layout>
            <DintorniLogo_Below_Header city={city} category={macrocategory} gender={gender} />
            <div className="grid grid-cols-1 md:pt-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4 w-full m-auto justify-items-center	">
                {shops.map((shop) => {
                    return (
                        <Box_Shop key={Math.random()} scale={'scale(0.99)'}  eventHandler={toStore} shop={shop} width={420} height={'250'} />
                    )
                })}
            </div>
        </Desktop_Layout>
    )
}

export default index