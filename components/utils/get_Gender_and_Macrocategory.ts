import resetParametersFromUrl from "./resetParameters_from_url";
import toUpperCaseFirstLetter from "./uppercase_First_Letter";

const getGenderandMacrocategory = (gender_macrocategory: string) => {
    var n = gender_macrocategory.indexOf('-');
    let macrocategory: null | string = null;
    let gender: null | string = null;

    gender = resetParametersFromUrl(gender_macrocategory.split('-')[0]);
    macrocategory = gender_macrocategory.substring(gender_macrocategory.indexOf('-') + 1);

    if (gender !== 'uomo' && gender !== 'donna') {
        return {
            gender: null,
            macrocategory: null
        }
    }

    if (!macrocategory || macrocategory === 'uomo' || macrocategory === 'donna') {
        macrocategory = null;
    }


    const element = {
        gender,
        macrocategory
    }

    return element;

}

export default getGenderandMacrocategory;