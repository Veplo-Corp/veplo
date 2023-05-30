export const STATUS = [
    //*Ordine creato ma non ancora pagato
    {
        code: 'CRE01',
        text: 'In preparazione',
        color: 'blackAlpha',
    },
    //*Ordine pagato e pronto per essere spedito
    {
        code: 'PAY01',
        text: 'In preparazione',
        color: 'blackAlpha',
    },
    //*Ordine inviato, ma da controllare se il codice spedizione è corretto, manca URL ordine
    {
        code: 'SHIP01',
        text: 'In preparazione',
        color: 'blackAlpha',
    },
    //*Codice ordine valido e inserimento url ordine
    {
        code: 'SHIP02',
        text: 'Spedito',
        color: 'orange',
    },
    //*rimborsato cliente per rimborso causa mancato arrivo prodotto
    {
        code: 'SHIP03',
        text: 'Ordine Consegnato',
        color: 'green',
    },
    //*Business cancella ordine perchè non può inviare il prodotto ordinato
    {
        code: 'CANC01',
        text: 'Ordine Cancellato dal Venditore',
        color: 'red',
    },
    //* refund avvenuto con successo dopo che il 
    //* business annulla l'ordine il cliente viene rimborsato
    {
        code: 'REF01',
        text: 'Ordine rimborsato',
        color: 'green',
    },
    //*cliente richiede rimborso e fa il reso
    {
        code: 'RET01',
        text: 'Richiesta reso',
        color: 'blue',
    },
    //*business riceve il reso e accetta reso
    {
        code: 'RET02',
        text: 'Reso ricevuto e accettato',
        color: 'green',
    },
    //*rimborsato cliente per reso
    {
        code: 'REF02',
        text: 'Ordine rimborsato',
        color: 'green',
    },
    //*Prodotto mai arrivato al cliente
    {
        code: 'CANC02',
        text: 'Rimborso richiesto',
        color: 'yellow',
    },
    //*rimborsato cliente per rimborso causa mancato arrivo prodotto
    {
        code: 'REF03',
        text: 'Ordine rimborsato',
        color: 'green',
    },
]