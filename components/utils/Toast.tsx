import { Status, ToastPosition, useToast } from "@chakra-ui/react";

interface toastInput {
    position?: ToastPosition | undefined,
    title: string,
    description?: string,
    status: Status | undefined,
    duration: number
    isClosable?: boolean
}

export const ToastOpen = () => {
    const toast = useToast();
    // types are: "success", "info", "warning", "error"

    const addToast = (newRes: toastInput) => {
        return toast({
            position: newRes.position || 'bottom',
            title: newRes.title,
            description: newRes.description || '',
            status: newRes.status,
            duration: newRes.duration,
            isClosable: newRes.isClosable || true,
        })
    }

    return { addToast };
}