import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import React, { FC, useEffect, useState } from 'react'
import Show_Categories_NavBar from './Show_Categories_NavBar'

const typesCategory = [
    {
        title: 'Donna',
        url: 'donna'
    },
    {
        title: 'Uomo',
        url: 'uomo'
    },
    {
        title: 'Negozi',
        url: 'negozi'
    },
]

const CategoryNavbar: FC<{ showMacrocategory: boolean }> = ({ showMacrocategory }) => {
    const [categoryCardOpen, setcategoryCardOpen] = useState(false);
    const [genderSelected, setGenderSelected] = useState<string>('')

    useEffect(() => {
        if (!showMacrocategory) return setcategoryCardOpen(false)
    }, [showMacrocategory])


    return (
        <div className='hidden lg:flex'>
            <Box
                display={'flex'}
                gap={10}
            >
                {
                    typesCategory.map(type => {
                        return (
                            <div
                                key={type.title}
                                onMouseEnter={() => {
                                    if (type.url === 'negozi') {
                                        setGenderSelected('')
                                        setcategoryCardOpen(false)
                                        return
                                    }
                                    setGenderSelected(type.url)
                                    setcategoryCardOpen(true)
                                }}
                            >
                                <Box
                                    fontWeight={'semibold'}
                                    fontSize={'xl'}
                                    width={'fit-content'}
                                >
                                    <Link
                                        href={`/prodotti/${type.url}/abbigliamento`}
                                    >
                                        {type.title}
                                    </Link>
                                </Box>
                                {genderSelected === type.url && <Box
                                    className={`h-[8px] bg-red-500 mt-[-12px]`}>
                                </Box>}
                            </div>

                        )
                    })
                }
            </Box>
            {categoryCardOpen && showMacrocategory &&
                <Show_Categories_NavBar gender={genderSelected} closeCategory={() => setcategoryCardOpen(false)} />
            }
        </div>


    )
}

export default CategoryNavbar