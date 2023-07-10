export const STATUS: {
    code: string,
    text: string,
    color: string,
    background: string
}[]


    = [
        //*Ordine creato ma non ancora pagato
        {
            code: 'CRE01',
            text: 'In preparazione',
            color: 'grayTag.text',
            background: 'grayTag.bg'
        },
        //*Ordine pagato e pronto per essere spedito
        {
            code: 'PAY01',
            text: 'In preparazione',
            color: 'grayTag.text',
            background: 'grayTag.bg'
        },
        //*Ordine inviato, ma da controllare se il codice spedizione è corretto, manca URL ordine
        {
            code: 'SHIP01',
            text: 'In preparazione',
            color: 'grayTag.text',
            background: 'grayTag.bg'
        },
        //*Codice ordine valido e inserimento url ordine
        {
            code: 'SHIP02',
            text: 'In viaggio',
            color: 'grayTag.text',
            background: 'grayTag.bg'
        },
        //*rimborsato cliente per rimborso causa mancato arrivo prodotto
        {
            code: 'SHIP03',
            text: 'Ordine Consegnato',
            color: 'successTag.text',
            background: 'successTag.bg'
        },
        //*Business cancella ordine perchè non può inviare il prodotto ordinato
        {
            code: 'CANC01',
            text: 'Ordine Cancellato',
            color: 'cancelTag.text',
            background: 'cancelTag.bg'
        },
        //* refund avvenuto con successo dopo che il 
        //* business annulla l'ordine il cliente viene rimborsato
        {
            code: 'REF01',
            text: 'Ordine rimborsato',
            color: 'successTag.text',
            background: 'successTag.bg'
        },
        //*cliente richiede rimborso e fa il reso
        {
            code: 'RET01',
            text: 'Richiesta reso',
            color: 'pendingTag.text',
            background: 'pendingTag.bg'
        },
        //*business riceve il reso e accetta reso
        {
            code: 'RET02',
            text: 'Reso ricevuto',
            color: 'successTag.text',
            background: 'successTag.bg'
        },
        //*cliente richiede rimborso e fa il reso
        {
            code: 'RET03',
            text: 'Reso rifiutato',
            color: 'cancelTag.text',
            background: 'cancelTag.bg'
        },
        //*rimborsato cliente per reso
        {
            code: 'REF02',
            text: 'Ordine rimborsato',
            color: 'successTag.text',
            background: 'successTag.bg'
        },
        //*Prodotto mai arrivato al cliente
        {
            code: 'CANC02',
            text: 'Rimborso richiesto',
            color: 'pendingTag.text',
            background: 'pendingTag.bg'
        },
        //*rimborsato cliente per rimborso causa mancato arrivo prodotto
        {
            code: 'REF03',
            text: 'Ordine rimborsato',
            color: 'successTag.text',
            background: 'successTag.bg'
        }
    ]