export enum DateFormat {
    onlyDate = 'onlyDate',
    completeDate = 'completeDate',

}


export const getDateFromMongoDBDate = (dateTime: string | undefined, format: DateFormat): string => {
    if (!dateTime) return 'Data non trovata'

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Rome',
    };

    const date = new Date(dateTime);
    const formattedDate = new Intl.DateTimeFormat('it-IT', options).format(date);

    if (format === DateFormat.onlyDate) {
        return formattedDate.split(', ')[0];
    } else if (format === DateFormat.completeDate) {
        const time = formattedDate.split(' ')[1];
        return `${formattedDate.split(', ')[0]} alle ${time}`;
    } else {
        return ('Formato non supportato');
    }
}

