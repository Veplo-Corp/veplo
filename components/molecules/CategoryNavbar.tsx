import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import React, { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Firebase_User } from '../../src/interfaces/firebase_user.interface'
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
    const user: Firebase_User = useSelector((state: any) => state.user.user);

    useEffect(() => {
        if (!showMacrocategory) {
            setcategoryCardOpen(false)
            findGenderSelected()
        }
    }, [showMacrocategory])

    useEffect(() => {
        if (user.genderSelected) {
            findGenderSelected()
        }
    }, [user])

    const findGenderSelected = () => {
        let gender: string = '';
        if (user.genderSelected === 'f') {
            gender = 'donna'
        }
        if (user.genderSelected === 'm') {
            gender = 'uomo'
        }
        if (gender !== '') {
            setGenderSelected(gender)
        }
    }


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

                                        href={type.url !== 'negozi' ? `/prodotti/${type.url}-abbigliamento` : '/negozi'}
                                    >
                                        {type.title}
                                    </Link>
                                </Box>
                                {
                                    genderSelected === type.url && <Box
                                        className={`h-[8px] bg-red-500 mt-[-12px]`}>
                                    </Box>
                                }
                            </div>

                        )
                    })
                }
            </Box >
            {categoryCardOpen && showMacrocategory &&
                <Show_Categories_NavBar gender={genderSelected} closeCategory={() => setcategoryCardOpen(false)} />
            }
        </div >


    )
}

export default CategoryNavbar