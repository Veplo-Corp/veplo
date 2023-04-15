import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'

const StripeAccountAlert: FC<{ stripeId: string }> = ({ stripeId }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const handleKYCProcess = async () => {
        setLoading(true)
        const endpoint = `/api/stripe/kyc-onboarding-link?stripeId=${stripeId}`

        const response = await fetch(endpoint, {
            method: "POST",
            mode: "no-cors", // no-cors, *cors, same-origin
            body: JSON.stringify({ stripeId })
        })
        const result = await response.json()
        setLoading(false)
        router.push(result.url)
    }

    return (
        <Alert status='warning' maxW={1000} className='m-auto mb-6' >
            <AlertIcon />
            <Box className='w-full'>
                <AlertTitle className='hidden md:flex'>Concludi il processo di onboarding</AlertTitle>
                <AlertDescription className='text-md'>
                    <span className='leading-0'>
                        Per poter accettare i pagamenti con Veplo devi aver concluso il processo di onboarding
                    </span>
                    <br />
                    <div className='flex lg:hidden mt-2 '>
                        <Button
                            disabled={loading}
                            colorScheme={'black'} variant='link' onClick={handleKYCProcess}>
                            <span className='underline'>
                                abilita Stripe
                            </span>
                        </Button>
                    </div>
                </AlertDescription>
            </Box>
            <div className='hidden lg:flex justify-end'>
                <Button onClick={handleKYCProcess} colorScheme={'orange'}
                    disabled={loading}
                >
                    abilita Stripe
                </Button>
            </div>

        </Alert>
    )
}

export default StripeAccountAlert