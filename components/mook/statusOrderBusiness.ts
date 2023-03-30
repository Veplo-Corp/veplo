export const STATUS = [
    //*Ordine creato ma non ancora pagato
    {
        code: 'CRE01',
        payment: 'pending',
        status: 'In corso',
        description: 'in attesa di conferma pagamento',
        color: 'yellow',
    },
    //*Ordine pagato e pronto per essere spedito
    {
        code: 'PAY01',
        payment: 'Saldato',
        status: 'In preparazione',
        description: 'spedisci l’ordine al all’indirizzo indicato',
        color: 'blackAlpha',
    },
    //*Ordine inviato, ma da controllare se il codice spedizione è corretto, manca URL ordine
    {
        code: 'SHIP01',
        payment: 'Saldato',
        status: 'In preparazione',
        description: 'Ordine in viaggio',
        color: 'blackAlpha',
    },
    //*Codice ordine valido e inserimento url ordine
    {
        code: 'SHIP02',
        payment: 'Saldato',
        status: 'Spedito',
        description: 'Ordine in viaggio',
        color: 'orange',
    },
    //*Business cancella ordine perchè non può inviare il prodotto ordinato
    {
        code: 'CANC01',
        payment: 'N/A',
        status: 'Annullato',
        description: 'Ordine cancellato dal venditore',
        color: 'red',
    },
    //* refund avvenuto con successo dopo che il 
    //* business annulla l'ordine il cliente viene rimborsato
    {
        code: 'REF01',
        payment: 'Saldato',
        status: 'Rimborsato',
        description: "l'ordine che hai annullato è stato rimborsato con successo",
        color: 'green',
    },
    //*cliente richiede rimborso e fa il reso
    {
        code: 'RET01',
        payment: 'N/A',
        status: 'Reso in corso',
        description: 'Procedura di reso in corso',
        color: 'yellow',
    },
    //*business riceve il reso e accetta reso
    {
        code: 'RET02',
        payment: 'N/A',
        status: 'Reso ricevuto',
        description: 'hai ricevuto il prodotto in reso',
        color: 'green',
    },
    //*rimborsato cliente per reso
    {
        code: 'REF02',
        payment: 'Saldato',
        status: 'Rimborso',
        description: 'Reso rimborsato con successo',
        color: 'green',
    },
    //*Prodotto mai arrivato al cliente
    {
        code: 'CANC02',
        payment: 'N/A',
        status: 'Rimborso richiesto',
        description: 'richiesta rimborso per ordine mai arrivato',
        color: 'yellow',
    },
    //*rimborsato cliente per rimborso causa mancato arrivo prodotto
    {
        code: 'REF03',
        payment: 'Saldato',
        status: 'Ordine rimborsato',
        description: 'Ordine rimborsato con successo',
        color: 'green',
    },

]