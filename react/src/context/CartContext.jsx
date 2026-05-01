import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../lib/api-client";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const normalizeCartItems = (cartPayload) => {
  if (!cartPayload) return [];
  if (Array.isArray(cartPayload)) return cartPayload;
  if (Array.isArray(cartPayload.items)) return cartPayload.items;
  if (Array.isArray(cartPayload.cartItems)) return cartPayload.cartItems;
  return [];
};

const getItemQuantity = (item) => {
  if (typeof item?.quantity === "number") return item.quantity;
  if (typeof item?.qty === "number") return item.qty;
  return 1;
};

const toCartRequestItem = (item) => ({
  productId: Number(item.productId ?? item.product?.id),
  variantId: item.variantId ?? item.variant?.id ?? null,
  quantity: Number(getItemQuantity(item)),
});

const getItemVariantId = (item) => item.variantId ?? item.variant?.id ?? null;
const getItemProductId = (item) => Number(item.productId ?? item.product?.id);

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);
  const [updatingCart, setUpdatingCart] = useState(false);

  const fetchCart = async () => {
    if (!isLoggedIn) {
      setCart(null);
      setCartItems([]);
      setCartCount(0);
      return;
    }

    try {
      setLoadingCart(true);
      const response = await apiClient.get("/users/cart");
      const payload = response.data;
      const items = normalizeCartItems(payload?.data);
      const count = items.reduce((total, item) => total + getItemQuantity(item), 0);
      setCart(payload);
      setCartItems(items);
      setCartCount(count);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart(null);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn]);

  const syncCart = async (items) => {
    if (!isLoggedIn) {
      throw new Error("Please login to add items to cart.");
    }

    const payload = items
      .map(toCartRequestItem)
      .filter((item) => Number.isInteger(item.productId) && Number.isInteger(item.quantity) && item.quantity > 0);
    const mergedPayloadMap = new Map();

    payload.forEach((item) => {
      const key = `${item.productId}-${item.variantId ?? "null"}`;
      const existing = mergedPayloadMap.get(key);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        mergedPayloadMap.set(key, { ...item });
      }
    });
    const mergedPayload = Array.from(mergedPayloadMap.values());

    setUpdatingCart(true);
    try {
      await apiClient.post("/users/cart", mergedPayload);
      await fetchCart();
    } finally {
      setUpdatingCart(false);
    }
  };

  const addToCart = async ({ productId, variantId = null, quantity = 1 }) => {
    if (!isLoggedIn) {
      throw new Error("Please login to add items to cart.");
    }

    const safeProductId = Number(productId);
    const safeQuantity = Number(quantity);
    if (!Number.isInteger(safeProductId) || !Number.isInteger(safeQuantity) || safeQuantity <= 0) {
      throw new Error("Invalid cart item.");
    }

    const nextItems = [...cartItems];
    const existingItemIndex = nextItems.findIndex(
      (item) =>
        getItemProductId(item) === safeProductId &&
        getItemVariantId(item) === (variantId ?? null)
    );

    if (existingItemIndex >= 0) {
      const existingItem = nextItems[existingItemIndex];
      nextItems[existingItemIndex] = {
        ...existingItem,
        quantity: getItemQuantity(existingItem) + safeQuantity,
      };
      await syncCart(nextItems);
      return { updated: true };
    } else {
      nextItems.push({
        productId: safeProductId,
        variantId,
        quantity: safeQuantity,
      });
      await syncCart(nextItems);
      return { updated: false };
    }
  };

  const updateCartItemQuantity = async ({ cartId, quantity }) => {
    const safeQuantity = Number(quantity);
    const safeCartId = Number(cartId);
    if (!Number.isInteger(safeCartId)) {
      throw new Error("Invalid cart id.");
    }
    if (!Number.isInteger(safeQuantity) || safeQuantity < 0) {
      throw new Error("Invalid quantity.");
    }

    const existing = cartItems.find((item) => Number(item.id) === safeCartId);
    if (!existing) {
      throw new Error("Cart item not found.");
    }

    if (safeQuantity === 0) {
      await removeCartItem(safeCartId);
      return;
    }

    const nextItems = cartItems.map((item) =>
      Number(item.id) === safeCartId ? { ...item, quantity: safeQuantity } : item
    );
    await syncCart(nextItems);
  };

  const removeCartItem = async (cartId) => {
    const safeCartId = Number(cartId);
    if (!Number.isInteger(safeCartId)) {
      throw new Error("Invalid cart id.");
    }
    setUpdatingCart(true);
    try {
      await apiClient.delete(`/users/cart/${safeCartId}`);
      await fetchCart();
    } finally {
      setUpdatingCart(false);
    }
  };

  const clearCart = async () => {
    setUpdatingCart(true);
    try {
      await apiClient.delete("/users/cart/clear-all");
      await fetchCart();
    } finally {
      setUpdatingCart(false);
    }
  };

  const value = useMemo(
    () => ({
      cart,
      cartItems,
      cartCount,
      loadingCart,
      updatingCart,
      syncCart,
      addToCart,
      updateCartItemQuantity,
      removeCartItem,
      clearCart,
      refreshCart: fetchCart,
    }),
    [cart, cartItems, cartCount, loadingCart, updatingCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
