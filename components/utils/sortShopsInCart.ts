import { Cart } from './../../src/interfaces/carts.interface';
export const sortShopsInCart = (carts: Cart[]) => {


    const newCarts = carts.slice().sort((a, b) =>
        a.shopInfo.id.localeCompare(b.shopInfo.id)

    );


    return newCarts
}