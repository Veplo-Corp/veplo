export interface Color {
    name: string,
    DB_name: string,
    color: string
}


export const COLORS: Color[] = [
    {name: 'Nero', DB_name: 'Nero' , color: '#000000'  },
    {name: 'Bianco', DB_name: 'Bianco' , color: '#FFFFFF'  },
    {name: 'Rosso', DB_name: 'Rosso' , color: '#FF0000'  },
    {name: 'Blu', DB_name: 'Blu' , color: '#0000FF'  },
    {name: 'Verde', DB_name: 'Verde' , color: '#008000'  },
    {name: 'Giallo', DB_name: 'Giallo' , color: '#FFFF00'  },
]