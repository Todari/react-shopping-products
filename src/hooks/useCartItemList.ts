import { useEffect, useState, useContext } from 'react';

import {
  requestAddCartItem,
  requestDeleteCartItem,
  requestFetchCartItemList,
} from '../apis/carItems';
import { CartItem, Product } from '../types/type';
import { QuantityContext } from '../store/QuantityContext';

interface UseCartItemListResult {
  cartItemList: CartItem[];
  cartItemListLoading: boolean;
  cartItemListError: Error | null;

  isInCart: (productId: number) => boolean;
  toggleCartItem: (product: Product) => Promise<void>;
}

export default function useCartItemList(): UseCartItemListResult {
  const [cartItemList, setCartItemList] = useState<CartItem[]>([]);
  const [cartItemListLoading, setCartItemListLoading] = useState<boolean>(true);
  const [cartItemListError, setCartItemListError] = useState<Error | null>(
    null,
  );
  const quantityContext = useContext(QuantityContext);
  const setQuantity = quantityContext ? quantityContext.setQuantity : () => {};

  const isInCart = (productId: number) =>
    cartItemList.some(({ product }: CartItem) => product.id === productId);

  const addCartItem = async (product: Product) => {
    try {
      await requestAddCartItem(product.id, 1);
      setQuantity((prev: number) => prev + 1);
    } catch (error) {
      setCartItemListError(error);
    } finally {
      const data = await requestFetchCartItemList();
      setCartItemList(data.content);
    }
  };

  const deleteCartItem = async (product: Product) => {
    const target = cartItemList.find((item) => item.product.id === product.id);
    try {
      await requestDeleteCartItem(target!.id);
      setQuantity((prev: number) => prev - 1);
    } catch (error) {
      setCartItemListError(error);
    } finally {
      const data = await requestFetchCartItemList();
      setCartItemList(data.content);
    }
  };

  const toggleCartItem = async (product: Product) => {
    setCartItemListLoading(true);
    if (isInCart(product.id)) {
      await deleteCartItem(product);
    } else {
      await addCartItem(product);
    }
    setCartItemListLoading(false);
  };

  useEffect(() => {
    const getCartItemList = async () => {
      try {
        setCartItemListLoading(true);
        const data = await requestFetchCartItemList();
        setCartItemList(data.content);
      } catch (error) {
        if (error instanceof Error) setCartItemListError(error);
      } finally {
        setCartItemListLoading(false);
      }
    };
    getCartItemList();
  }, []);

  return {
    cartItemList,
    cartItemListLoading,
    cartItemListError,
    isInCart,
    toggleCartItem,
  };
}
