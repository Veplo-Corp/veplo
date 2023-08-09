import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import React, { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Firebase_User } from '../../src/interfaces/firebase_user.interface'
import { useRouter } from 'next/router'

const typesCategory = [
    {
        title: 'Donna',
        url: 'donna'
    },
    {
        title: 'Uomo',
        url: 'uomo'
    }
]

const CategoryNavbar: FC<{ showMacrocategory: boolean }> = ({ showMacrocategory }) => {
    const [categoryCardOpen, setcategoryCardOpen] = useState(false);
    const [genderSelected, setGenderSelected] = useState<string>('')
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const router = useRouter()

    useEffect(() => {
        if (!showMacrocategory) {
            setcategoryCardOpen(false)
            findGenderSelected()
        }
    }, [showMacrocategory])

    useEffect(() => {
        if (user?.genderSelected) {
            findGenderSelected()
        }
    }, [user])

    const findGenderSelected = () => {

        let gender: string = '';
        if (user?.genderSelected === 'f') {
            gender = 'donna'
        }
        if (user?.genderSelected === 'm') {
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
                gap={4}
            >
                {
                    typesCategory.map(type => {
                        return (
                            <div
                                key={type.title}
                            // onMouseEnter={() => {
                            //     // if (type.url === 'profili') {
                            //     //     setGenderSelected('')
                            //     //     setcategoryCardOpen(false)
                            //     //     return
                            //     // }

                            //     setGenderSelected(type.url)
                            //     setcategoryCardOpen(true)
                            // }}
                            >
                                <Box
                                    fontWeight={'black'}
                                    fontSize={'lg'}
                                    width={'fit-content'}
                                    color={'primaryBlack.text'}
                                >
                                    <Link
                                        prefetch={false}
                                        onClick={() => { setcategoryCardOpen(false) }}
                                        href={type.url !== 'profili' ? `/cerca/${user.gategoryTypeSelected ? user.gategoryTypeSelected : 'abbigliamento'}/${type.url}-tutto/tutto/rilevanza` : '/profili/brand'}
                                    >
                                        {type.title}
                                    </Link>
                                </Box>
                                {
                                    (genderSelected === type.url && (!router.pathname.includes("/negozi"))) && <Box
                                        className={`h-[8px] bg-[#FF5A78] mt-[-12px]`}>
                                    </Box>
                                }
                            </div>

                        )
                    })
                }
            </Box >
            {/* {categoryCardOpen && showMacrocategory &&

                <Show_Categories_NavBar gender={genderSelected} closeCategory={() => setcategoryCardOpen(false)} />
            } */}
        </div >


    )
}

export default CategoryNavbar