import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { categoryApi } from "../lib/category-api";
import { productApi } from "../lib/product-api";
import { contactApi } from "../lib/contact-api";
import { ProfileDropdown } from "./ProfileDropdown";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../hooks/use-toast";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { AppImage } from "./ui/app-image";
import { useTheme } from "../context/ThemeContext";

const getProductImage = (product) => {
  if (!product) return "";

  if (typeof product.image === "string") return product.image;
  if (typeof product.imageUrl === "string") return product.imageUrl;
  if (typeof product.thumbnail === "string") return product.thumbnail;
  if (typeof product.thumbnailUrl === "string") return product.thumbnailUrl;
  if (typeof product.featuredImage === "string") return product.featuredImage;
  if (typeof product.featuredImageUrl === "string") return product.featuredImageUrl;

  if (Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];
    if (typeof firstImage === "string") return firstImage;
    if (typeof firstImage?.url === "string") return firstImage.url;
  }

  return "";
};

export function Header({ showCategories = true }) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [headerLogo, setHeaderLogo] = useState("");
  const [confirmState, setConfirmState] = useState({ open: false, mode: null, cartId: null });
  const { isLoggedIn, user } = useAuth();
  const { cartItems, cartCount, loadingCart, updatingCart, addToCart, updateCartItemQuantity, removeCartItem, clearCart } = useCart();
  const { toast } = useToast();
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const displayName = fullName || user?.name?.trim() || "User";
  const displayEmail = user?.email?.trim() || "";
  const cartSubtotal = cartItems.reduce((total, item) => {
    const price = Number(item?.variant?.salePrice ?? item?.product?.salePrice ?? 0);
    return total + price * (item.quantity || 1);
  }, 0);

  useEffect(() => {
    if (!showCategories) {
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        const result = await categoryApi.getCategories();
        if (result.status === "SUCCESS" && result.data) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [showCategories]);

  useEffect(() => {
    const loadContactLogo = async () => {
      try {
        const data = await contactApi.get();
        setHeaderLogo(data?.logo || "");
      } catch {
        setHeaderLogo("");
      }
    };

    loadContactLogo();
  }, []);

  useEffect(() => {
    const keyword = searchTerm.trim();
    if (!keyword) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        setShowSearchDropdown(true);
        const result = await productApi.list({ search: keyword, page: 1, limit: 6 });
        if (result?.status === "SUCCESS" && result?.data) {
          const products = Array.isArray(result.data) ? result.data : (result.data.products || []);
          setSearchResults(products);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Failed to search products:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsCartOpen(false);
    }
  }, [isLoggedIn]);

  const handleIncreaseQty = async (item) => {
    try {
      await addToCart({
        productId: item.productId ?? item.product?.id,
        variantId: item.variantId ?? item.variant?.id ?? null,
        quantity: 1,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Unable to update cart",
        description: err.message || "Failed to increase quantity.",
      });
    }
  };

  const handleDecreaseQty = async (item) => {
    if ((item.quantity || 1) <= 1) {
      setConfirmState({ open: true, mode: "delete-item", cartId: item.id });
      return;
    }
    try {
      await updateCartItemQuantity({
        cartId: item.id,
        quantity: Math.max((item.quantity || 1) - 1, 0),
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Unable to update cart",
        description: err.message || "Failed to decrease quantity.",
      });
    }
  };

  const handleDeleteItem = async (cartId) => {
    setConfirmState({ open: true, mode: "delete-item", cartId });
  };

  const executeDeleteItem = async (cartId) => {
    try {
      await removeCartItem(cartId);
      toast({
        variant: "success",
        title: "Cart updated",
        description: "Item removed from cart.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Unable to remove item",
        description: err.message || "Failed to remove cart item.",
      });
    } finally {
      setConfirmState({ open: false, mode: null, cartId: null });
    }
  };

  const handleClearAll = async () => {
    setConfirmState({ open: true, mode: "clear-all", cartId: null });
  };

  const executeClearAll = async () => {
    try {
      await clearCart();
      toast({
        variant: "success",
        title: "Cart cleared",
        description: "All items removed from your cart.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Unable to clear cart",
        description: err.message || "Failed to clear cart.",
      });
    } finally {
      setConfirmState({ open: false, mode: null, cartId: null });
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="inline-flex items-center gap-3">
            {headerLogo ? (
              <AppImage
                src={headerLogo}
                alt="Irishtaylor logo"
                className="h-12 w-12 rounded-3xl border border-slate-200 object-cover shadow-lg shadow-fuchsia-200/30"
              />
            ) : (
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-200/30">
                <span className="text-lg font-semibold tracking-tight">IT</span>
              </div>
            )}
            <div>
              <p className="text-base font-semibold text-slate-950">Irishtaylor</p>
              <p className="text-sm text-slate-500">Designed for modern customers</p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-4 py-2 text-sm font-semibold text-fuchsia-700 sm:flex">
            <span className="rounded-full bg-fuchsia-600 px-2 py-1 text-white">Special</span>
            Special discounts on latest fashion
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-11 min-w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 text-slate-600 shadow-sm transition hover:bg-slate-50"
              aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
              onClick={toggleTheme}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 3v2.5M12 18.5V21M4.22 4.22l1.77 1.77M18.01 18.01l1.77 1.77M3 12h2.5M18.5 12H21M4.22 19.78l1.77-1.77M18.01 5.99l1.77-1.77" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 1 0 11.5 11.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="sm:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
              aria-label="View cart"
              onClick={() => setIsCartOpen(true)}
            >
              {isLoggedIn && cartCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-600 px-1 text-[10px] font-semibold leading-none text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6h15l-1.5 9h-12L4 6z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6l-2-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="9" cy="20" r="1" fill="currentColor" />
                <circle cx="19" cy="20" r="1" fill="currentColor" />
              </svg>
            </button>
            {isLoggedIn ? (
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-1 shadow-sm">
                <div className="hidden max-w-[130px] text-right sm:block">
                  <p className="truncate text-xs font-semibold text-slate-900">{displayName}</p>
                  {displayEmail && <p className="truncate text-[11px] text-slate-500">{displayEmail}</p>}
                </div>
                <ProfileDropdown />
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex h-11 items-center rounded-2xl bg-fuchsia-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-fuchsia-500"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        <div className={`grid gap-4 lg:grid-cols-2 lg:items-center ${mobileMenuOpen ? 'block' : 'hidden sm:grid'}`}>
          <div className="relative w-full">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (searchTerm.trim()) {
                  setShowSearchDropdown(true);
                }
              }}
              className="w-full rounded-full border border-slate-200 bg-slate-100 py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm transition focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-100"
            />
            {showSearchDropdown && (
              <div className="absolute z-40 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                {searchLoading ? (
                  <p className="px-3 py-2 text-sm text-slate-500">Searching...</p>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-fuchsia-50"
                      onClick={() => {
                        setShowSearchDropdown(false);
                        closeMobileMenu();
                        if (product?.slug) {
                          navigate(`/product/${product.slug}`);
                        }
                      }}
                    >
                      {getProductImage(product) ? (
                        <AppImage
                          src={getProductImage(product)}
                          alt={product.title}
                          className="h-12 w-12 flex-shrink-0 rounded-lg border border-slate-200 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-400">
                          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M9 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm9.5 6l-3.5-4.5-3 4-2-2.5-3.5 4.5" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{product.title}</p>
                        {product.salePrice && (
                          <p className="text-xs text-slate-500">Rs. {product.salePrice}</p>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-slate-500">No products found</p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 text-sm font-semibold text-slate-600 sm:flex-row sm:items-center sm:justify-end">
            <nav className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Link to="/" onClick={closeMobileMenu} className="rounded-full px-4 py-2 transition hover:bg-fuchsia-50 hover:text-fuchsia-600">Home</Link>
              <Link to="/login" onClick={closeMobileMenu} className="rounded-full px-4 py-2 transition hover:bg-fuchsia-50 hover:text-fuchsia-600">Shop</Link>
              <Link to="/register" onClick={closeMobileMenu} className="rounded-full px-4 py-2 transition hover:bg-fuchsia-50 hover:text-fuchsia-600">Deals</Link>
              <Link to="/contact" onClick={closeMobileMenu} className="rounded-full px-4 py-2 transition hover:bg-fuchsia-50 hover:text-fuchsia-600">Contact</Link>
            </nav>
          </div>
        </div>

        {showCategories && (
          <div className={`border-t border-slate-200 pt-3 ${mobileMenuOpen ? 'block' : 'hidden sm:block'}`}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Categories</div>
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <span className="text-sm text-slate-500">Loading...</span>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    onClick={closeMobileMenu}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-fuchsia-100 hover:text-fuchsia-600"
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <span className="text-sm text-slate-500">No categories available</span>
              )}
            </div>
          </div>
        )}
        </div>
      </header>

      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            aria-label="Close cart"
            onClick={() => setIsCartOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-full bg-white shadow-2xl sm:w-[420px]">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                <div>
                  <p className="text-base font-semibold text-slate-950">Your Cart</p>
                  <p className="text-xs text-slate-500">{cartCount} item(s)</p>
                </div>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                  aria-label="Close cart"
                  onClick={() => setIsCartOpen(false)}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {!isLoggedIn ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    Please login to view your cart.
                  </div>
                ) : loadingCart ? (
                  <p className="text-sm text-slate-500">Loading cart...</p>
                ) : cartItems.length > 0 ? (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-slate-200 p-3">
                        <div className="flex items-center gap-3">
                        {getProductImage(item.product) ? (
                          <AppImage
                            src={getProductImage(item.product)}
                            alt={item.product?.title || "Product"}
                            className="h-16 w-16 rounded-xl border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-400">
                            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2z" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M9 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm9.5 6l-3.5-4.5-3 4-2-2.5-3.5 4.5" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">{item.product?.title || "Product"}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            Qty: {item.quantity || 1}
                            {item.variant?.size ? ` • Size: ${item.variant.size}` : ""}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-fuchsia-700">
                            Rs. {item.variant?.salePrice || item.product?.salePrice || "--"}
                          </p>
                        </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-xl border border-slate-200">
                            <button
                              type="button"
                              onClick={() => handleDecreaseQty(item)}
                              disabled={updatingCart}
                              className="inline-flex h-8 w-8 items-center justify-center text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-slate-900">{item.quantity || 1}</span>
                            <button
                              type="button"
                              onClick={() => handleIncreaseQty(item)}
                              disabled={updatingCart}
                              className="inline-flex h-8 w-8 items-center justify-center text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={updatingCart}
                            className="rounded-lg px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    Your cart is empty.
                  </div>
                )}
              </div>
              {isLoggedIn && cartItems.length > 0 && (
                <div className="border-t border-slate-200 p-4">
                  <div className="mb-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Total items</span>
                      <span className="font-semibold text-slate-900">{cartCount}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">Rs. {cartSubtotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    disabled={updatingCart}
                    className="w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.mode === "clear-all" ? "Clear all cart items?" : "Remove this item?"}
        description={
          confirmState.mode === "clear-all"
            ? "Are you sure you want to remove all items from your cart?"
            : "Are you sure you want to remove this item from your cart?"
        }
        confirmLabel={confirmState.mode === "clear-all" ? "Clear All" : "Remove"}
        confirmVariant="danger"
        loading={updatingCart}
        onCancel={() => setConfirmState({ open: false, mode: null, cartId: null })}
        onConfirm={() => {
          if (confirmState.mode === "clear-all") {
            executeClearAll();
            return;
          }
          if (confirmState.mode === "delete-item" && confirmState.cartId) {
            executeDeleteItem(confirmState.cartId);
          }
        }}
      />
    </>
  );
}
