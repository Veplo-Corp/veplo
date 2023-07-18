import { Cart } from './../../src/interfaces/carts.interface';
export const sortShopsInCart = (carts: Cart[]) => {
    //console.log(carts[0].shopInfo.name);
    // let newCarts = carts.slice()
    // console.log(newCarts.sort());

    const newCarts = carts.slice().sort((a, b) =>
        a.shopInfo.id.localeCompare(b.shopInfo.id)

    );


    return newCarts
}