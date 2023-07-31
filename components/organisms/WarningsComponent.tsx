import { Box, Button, ButtonGroup, Text, VStack } from "@chakra-ui/react";
import WarningCard from "../molecules/WarningCard";
import { CartWarning } from "../../src/lib/apollo/generated/graphql";
import { FC } from "react";

export const WarningCompoment: FC<{ warnings: CartWarning[], confirmButton: () => void }> = ({ warnings, confirmButton }) => {



    return (
        <>
            <Box

                my={3}
            >
                <Text
                    fontSize={'16px'}
                    fontWeight={'normal'}
                    color={'secondaryBlack.text'}
                    mr={4}
                >
                    Abbiamo dovuto effettuare degli aggiornamenti
                    al tuo carrello:
                </Text>
                <VStack
                    width={'full'}
                    gap={3}
                    mb={5}
                    mt={3}
                >
                    {warnings.map((warning, index) => (
                        <WarningCard key={index} warning={warning} />
                    ))}
                </VStack>

            </Box>
            <ButtonGroup
                float={'right'}
            >
                <Button
                    variant={'primary'}
                    borderRadius={'20px'}
                    fontSize={'md'}
                    paddingInline={'25px'}
                    onClick={confirmButton}
                >
                    Tutto chiaro!
                </Button>
            </ButtonGroup>
        </>
    )
}