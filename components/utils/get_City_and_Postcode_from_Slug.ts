import resetParametersFromUrl from "./resetParameters_from_url";
import toUpperCaseFirstLetter from "./uppercase_First_Letter";

const getCityAndPostcodeFromSlug = (city_cap: string) => {
    var n = city_cap.lastIndexOf('-');
    let postcode: null | string = null;
    let city: null | string = null;

    if(n > 0){
    if (Number(city_cap.substring(n + 1)) > 0) {
      postcode = city_cap.substring(n + 1);
      city = toUpperCaseFirstLetter(resetParametersFromUrl(city_cap.substring(0, n)));
    } else {
      city = toUpperCaseFirstLetter(resetParametersFromUrl(city_cap));
    }
  } else {
    city = toUpperCaseFirstLetter(city_cap)
  }
  const element = {
    city,
    postcode
  }

  return element;
  
}

export default getCityAndPostcodeFromSlug