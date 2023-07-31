import React, { FC, useEffect, useState } from 'react'
import { CartWarning } from '../../src/lib/apollo/generated/graphql'
import { Box, ListItem, Tag, Text, UnorderedList } from '@chakra-ui/react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageKitUrl } from '../utils/imageKitUrl';

const WarningCard: FC<{ warning: CartWarning }> = ({ warning }) => {
    const [warningText, setWarningText] = useState<string>()

    const getWarningText = (warning: CartWarning): string => {
        if (warning.isProductNonExisting) {
            return "Prodotto cancellato";
        } else if (warning.isQuantityTooMuch) {
            if (warning.quantity && warning.quantity >= 1) {
                return "Q.tà massima " + warning.quantity;
            } else {
                return "Q.tà terminata";
            }
        } else if (warning.isSizeNonExisting) {
            return "Taglia terminata";
        } else if (warning.isVariationNonExisting) {
            return "Colore terminato";
        } else {
            return "Avviso sconosciuto.";
        }
    };
    useEffect(() => {
        // Funzione che restituisce il testo in base al tipo di avviso
        const warningText = getWarningText(warning);
        setWarningText(warningText)
    }, [])


    return (
        <Box
            display={'flex'}
            gap={1}
            width={'full'}
        >
            <LazyLoadImage src={
                /* inserire photo prodotto */
                imageKitUrl('bc0479b2-62b7-4d72-9dee-a4d26110d271.webp' ? 'bc0479b2-62b7-4d72-9dee-a4d26110d271.webp' : '', 237, 247)
            }
                //PlaceholderSrc={PlaceholderImage}
                alt={''}
                className='h-20 lg:h-20 aspect-[4.8/5] rounded-[10px] object-cover'
            />
            <Box

                height={'full'}
                ml={4}
                width={'full'}
                my={'auto'}
                display={'flex'}
                justifyContent={'space-between'}
            >
                <UnorderedList
                    color={'#909090'}
                    fontSize={['12px', '12px', '15px']}
                    fontWeight={'medium'}
                    spacing={2}
                >
                    <ListItem>{warning.name}</ListItem>
                    <ListItem>{warning.size} - {warning.color}</ListItem>
                </UnorderedList>
                <Tag
                    height={'fit-content'}
                    borderRadius={'full'}
                    py={2}
                    px={3}
                    size={'sm'}
                    bg={'#F2F2F2'}
                    my={'auto'}
                    mb={0}
                >
                    {warningText}
                </Tag>
            </Box>
        </Box>

    )
}

export default WarningCard