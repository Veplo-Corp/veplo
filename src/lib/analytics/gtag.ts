import { PixelEventType, VeploGTMEvent, VeploPixelEvent } from "./eventTypes";

export interface CustomWindow extends Window {
    dataLayer: any[]; // Puoi specificare il tipo corretto per la tua dataLayer
    gtag: (command: string, ...args: any[]) => void; // Aggiungi questa definizione per 'gtag'
    fbq: any
}
declare let window: CustomWindow; // Assicurati di importare la definizione di tipo corretta


export const gtag = (payload: VeploGTMEvent) => {
    if (typeof window !== 'undefined' && process.env.ENV === 'production') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: payload.command, ...payload.args });
    }
};


export const fbq = (payload: VeploPixelEvent) => {
    if (typeof window !== 'undefined' && process.env.ENV === 'production') {
        window.dataLayer = window.dataLayer || [];
        try {
            //Drop FB Pixel
            window.fbq('track', payload.command, payload.args, payload.eventID);
        }
        catch (err) {
            setTimeout(function () { fbq(payload); }, 2000);
        }
    }
};