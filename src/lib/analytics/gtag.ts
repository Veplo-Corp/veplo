import { VeploGTMEvent } from "./eventTypes";

interface CustomWindow extends Window {
    dataLayer: any[]; // Puoi specificare il tipo corretto per la tua dataLayer
    gtag: (command: string, ...args: any[]) => void; // Aggiungi questa definizione per 'gtag'
}
declare let window: CustomWindow; // Assicurati di importare la definizione di tipo corretta


export const gtag = (payload: VeploGTMEvent) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        //window.dataLayer = window.dataLayer || [];
        //window.dataLayer.push({ event: payload.command, ...payload.args });
        window.gtag('event', payload.command, payload.args);

    }
};