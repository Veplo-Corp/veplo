import { Cart } from './../../src/interfaces/carts.interface';
export const sortShopsInCart = (carts: Cart[]) => {
    console.log(carts[0].shopInfo.name);
    // let newCarts = carts.slice()
    // console.log(newCarts.sort());

    const newCarts = carts.slice().sort((a, b) =>
        a.shopInfo.name.localeCompare(b.shopInfo.name)
        // if (a.shopInfo.name < b.shopInfo.name) {
        //     return 1;
        // }
        // if (a.shopInfo.name < b.shopInfo.name) {
        //     return -1;
        // }
        // return 0;
    );
    return newCarts
}