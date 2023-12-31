export const STATUS_ORDER_SHOP = [
    //*Ordine creato ma non ancora pagato
    {
        code: 'CRE01',
        payment: {
            text: 'pending',
            color: 'blue'
        },
        orderStatus: {
            text: 'In corso',
            color: 'blue',
        },
        description: 'in attesa di conferma pagamento',

    },
    //*Ordine pagato e pronto per essere spedito
    {
        code: 'PAY01',
        payment: {
            text: 'Saldato',
            color: 'green'
        },
        orderStatus: {
            text: 'In preparazione',
            color: 'blackAlpha',
        },

        description: 'spedisci l’ordine all’indirizzo indicato',
    },
    //*Ordine inviato, ma da controllare se il codice spedizione è corretto, manca URL ordine
    {
        code: 'SHIP01',
        payment: {
            text: 'Saldato',
            color: 'green'
        },
        orderStatus: {
            text: 'In Viaggio',
            color: 'blue',
        },
        description: 'Ordine in viaggio',
    },
    //*Codice ordine valido e inserimento url ordine
    {
        code: 'SHIP02',
        payment: {
            text: 'Saldato',
            color: 'green'
        },
        orderStatus: {
            text: 'In Viaggio',
            color: 'blue',
        },
        description: 'Ordine in viaggio',
    },
    //*Ordine arrivato con successo
    {
        code: 'SHIP03',
        payment: {
            text: 'Saldato',
            color: 'green'
        },
        orderStatus: {
            text: 'consegnato',
            color: 'green',
        },
        description: 'Ordine consegnato',
    },
    //*Business cancella ordine perchè non può inviare il prodotto ordinato
    {
        code: 'CANC01',
        payment: {
            text: 'Rimborso in corso',
            color: 'yellow'
        },
        orderStatus: {
            text: 'Cancellato',
            color: 'blackAlpha',
        },
        description: 'Ordine cancellato dal venditore',
    },
    //* refund avvenuto con successo dopo che il 
    //* business annulla l'ordine il cliente viene rimborsato
    {
        code: 'REF01',
        payment: {
            text: 'Rimborsato',
            color: 'green'
        },
        orderStatus: {
            text: 'Cancellato',
            color: 'blackAlpha',
        },
        description: "ordine rimborsato con successo",

    },
    //*cliente richiede rimborso e fa il reso
    {
        code: 'RET01',
        payment: {
            text: 'Reso in corso',
            color: 'blue'
        },
        orderStatus: {
            text: 'In restituzione',
            color: 'blackAlpha',
        },
        description: 'Procedura di reso in corso',
    },
    //*business riceve il reso e accetta reso
    {
        code: 'RET02',
        payment: {
            text: 'In corso',
            color: 'blackAlpha'
        },
        orderStatus: {
            text: 'Reso accettato',
            color: 'green',
        },
        description: 'hai ricevuto il reso',
    },
    //*business riceve il reso e rifiuta reso
    {
        code: 'RET03',
        payment: {
            text: 'N/A',
            color: 'blackAlpha'
        },
        orderStatus: {
            text: 'Reso rifiutato',
            color: 'blackAlpha',
        },
        description: 'hai rifiutato il reso',
    },
    //*rimborsato cliente per reso
    {
        code: 'REF02',
        payment: {
            text: 'Rimborsato',
            color: 'green'
        },
        orderStatus: {
            text: 'Ricevuto',
            color: 'green',
        },
        description: 'Reso rimborsato con successo',
    },
    //*Prodotto mai arrivato al cliente
    {
        code: 'CANC02',
        payment: {
            text: 'N/A',
            color: 'blackAlpha'
        },
        orderStatus: {
            text: 'rimborso richiesto',
            color: 'blue',
        },
        description: 'richiesta rimborso per ordine mai arrivato',
    },
    //*rimborsato cliente per rimborso causa mancato arrivo prodotto
    {
        code: 'REF03',
        payment: {
            text: 'Rimborsato',
            color: 'green'
        },
        orderStatus: {
            text: 'Mai arrivato',
            color: 'green',
        },
        description: 'Ordine rimborsato con successo',
    },

]