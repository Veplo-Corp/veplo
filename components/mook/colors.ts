export interface Color {
    name: string,
    DB_name: string,
    color: string
}


export const COLORS: Color[] = [
    {name: 'Nero', DB_name: 'black' , color: '#000000'  },
    {name: 'Bianco', DB_name: 'white' , color: '#FFFFFF'  },
    {name: 'Rosso', DB_name: 'red' , color: '#FF0000'  },
    {name: 'Blu', DB_name: 'blue' , color: '#0000FF'  },
    {name: 'Verde', DB_name: 'green' , color: '#008000'  },
    {name: 'Giallo', DB_name: 'yellow' , color: '#FFFF00'  },
]