import { CartDispatch } from './../../src/interfaces/carts.interface';
export const sortShopsInCart = (carts: CartDispatch[]) => {


    const newCarts = carts.slice().sort((a, b) =>
        a.shopInfo.id.localeCompare(b.shopInfo.id)

    );


    return newCarts
}