import { ToastPosition, useToast, UseToastOptions } from "@chakra-ui/react";



export type AddToast = {
    position?: ToastPosition,
    title: string,
    description?: string | any,
    status: UseToastOptions["status"],
    duration: number
    isClosable: boolean,
    variant?: string
}

export const ToastOpen = () => {
    const toast = useToast();
    // types are: "success", "info", "warning", "error"

    const addToast = (newRes: AddToast) => {
        return toast({
            position: newRes.position || 'bottom',
            title: newRes.title,
            description: newRes.description || '',
            status: newRes.status,
            duration: newRes.duration,
            isClosable: newRes.isClosable,
            variant: newRes.variant
        })
    }

    return { addToast };
}