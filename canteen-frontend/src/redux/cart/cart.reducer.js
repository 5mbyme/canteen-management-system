import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from './cart.types';
import { addToCart, removeFromCart } from './cart.utils';

const INITIAL_STATE = {
  cartItems: []
};

const cartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        cartItems: addToCart(state.cartItems, action.payload)
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: removeFromCart(state.cartItems, action.payload)
      };
    case CLEAR_CART:
      return {
        ...state,
        cartItems: []
      };
    default:
      return state;
  }
};

export default cartReducer;
