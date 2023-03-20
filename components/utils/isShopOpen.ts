

//find out if the shop is NOW open or not
const isShopOpen = (openingDays: number[] | null, openingHours: string[] | null) => {
    if (!openingDays || !openingHours) return false
    const dateNow = new Date();

    const dayNow = dateNow.getDay();

    const hourNow = dateNow.getHours() + (dateNow.getMinutes() / 100);

    // console.log(day, hour);
    // console.log(openingDays, openingHours);
    if (openingHours.length < 1) return
    const openingHour = Number(openingHours[0].split(':')[0]) + (Number(openingHours[0].split(':')[1]) / 100)
    const closingHour = Number(openingHours[1].split(':')[0]) + (Number(openingHours[1].split(':')[1]) / 100)
    if (typeof openingDays.find(openingDay => openingDay === dayNow) === 'number' && (
        hourNow < closingHour && hourNow > openingHour
    )) {
        return true
    } else {

        return false
    }

    // console.log(openingDays.find(openingDay => openingDay === day));


}

export default isShopOpen