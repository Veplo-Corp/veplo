export const GA_TRACKING_ID = 'G-26QK67CY12'; // Sostituisci con il tuo ID di tracciamento corretto

export const gtag = (command, ...args) => {
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: command, ...args });
        window.gtag('event', command, ...args);
    }
};