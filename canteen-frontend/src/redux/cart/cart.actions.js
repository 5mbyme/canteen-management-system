import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from './cart.types';

export const addToCart = (item) => ({
  type: ADD_TO_CART,
  payload: item
});

export const removeFromCart = (item) => ({
  type: REMOVE_FROM_CART,
  payload: item
});

export const clearCart = () => ({
  type: CLEAR_CART
});
