export type Day = {
    id: string,
    name: string,
    dayPosition: number
}

export const DAYS: Day[] = [
    {
        id: '1',
        name: 'Lunedì',
        dayPosition: 1
    },
    {
        id: '2',
        name: 'Martedì',
        dayPosition: 2
    },
    {
        id: '3',
        name: 'Mercoledì',
        dayPosition: 3
    },
    {
        id: '4',
        name: 'Giovedì',
        dayPosition: 4
    },
    {
        id: '5',
        name: 'Venerdì',
        dayPosition: 5
    },
    {
        id: '6',
        name: 'Sabato',
        dayPosition: 6
    },
    {
        id: '0',
        name: 'Domenica',
        dayPosition: 7
    }
]