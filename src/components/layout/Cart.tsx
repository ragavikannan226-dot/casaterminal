import React, { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  Package,
  Truck,
  CreditCard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  category?: string;
}

const CART_KEY = "casa_terminal_cart";

/* =========================================================
   DEMO CART DATA
========================================================= */

const DEMO_CART: CartItem[] = [
  {
    id: 1,
    name: "Premium Cement 50kg",
    price: 420,
    image:
      "https://images.unsplash.com/photo-1513467655676-561b7d489b88?auto=format&fit=crop&w=700&q=80",
    quantity: 2,
    category: "Construction Materials",
  },
  {
    id: 2,
    name: "Power Drill Machine",
    price: 2850,
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=700&q=80",
    quantity: 1,
    category: "Tools & Equipment",
  },
  {
    id: 3,
    name: "Steel Construction Rod",
    price: 680,
    image:
      "https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=700&q=80",
    quantity: 3,
    category: "Building Materials",
  },
  {
    id: 4,
    name: "Safety Helmet",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=700&q=80",
    quantity: 2,
    category: "Safety Equipment",
  },
];

/* =========================================================
   CART COMPONENT
========================================================= */

const Cart: React.FC = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  /* =======================================================
     LOAD CART
  ======================================================= */

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          setCartItems(DEMO_CART);
        }
      } else {
        /*
         * No cart exists yet.
         * Add demo products.
         */
        setCartItems(DEMO_CART);

        localStorage.setItem(CART_KEY, JSON.stringify(DEMO_CART));
      }
    } catch (error) {
      console.error("Unable to load cart:", error);

      setCartItems(DEMO_CART);
      localStorage.setItem(CART_KEY, JSON.stringify(DEMO_CART));
    }

    setIsLoaded(true);
  }, []);

  /* =======================================================
     SAVE CART
  ======================================================= */

  useEffect(() => {
    if (!isLoaded) return;

    if (cartItems.length > 0) {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    } else {
      localStorage.removeItem(CART_KEY);
    }
  }, [cartItems, isLoaded]);

  /* =======================================================
     INCREASE QUANTITY
  ======================================================= */

  const increaseQuantity = (id: string | number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  /* =======================================================
     DECREASE QUANTITY
  ======================================================= */

  const decreaseQuantity = (id: string | number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /* =======================================================
     REMOVE ITEM
  ======================================================= */

  const removeItem = (id: string | number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove all items from your cart?"
    );

    if (!confirmed) return;

    setCartItems([]);
    localStorage.removeItem(CART_KEY);
  };

  /* =======================================================
     TOTAL ITEMS
  ======================================================= */

  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }, [cartItems]);

  /* =======================================================
     TOTAL PRICE
  ======================================================= */

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + Number(item.price) * item.quantity;
    }, 0);
  }, [cartItems]);

  /* =======================================================
     DELIVERY
  ======================================================= */

  const deliveryCharge = useMemo(() => {
    if (totalPrice === 0) {
      return 0;
    }

    if (totalPrice >= 1000) {
      return 0;
    }

    return 80;
  }, [totalPrice]);

  /* =======================================================
     GRAND TOTAL
  ======================================================= */

  const grandTotal = totalPrice + deliveryCharge;

  /* =======================================================
     CURRENCY FORMAT
  ======================================================= */

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  /* =======================================================
     CHECKOUT
  ======================================================= */

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    alert(
      `Proceeding to checkout.\n\nTotal Amount: ${formatPrice(
        grandTotal
      )}`
    );
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            {/* Back Button */}

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#8b6f47]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {/* Title */}

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8b6f47]/10">
                <ShoppingCart className="h-6 w-6 text-[#8b6f47]" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  My Cart
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  {totalItems}{" "}
                  {totalItems === 1 ? "item" : "items"} in your cart
                </p>
              </div>
            </div>
          </div>

          {/* Clear Cart */}

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Clear Cart
            </button>
          )}
        </div>

        {/* =================================================
            EMPTY CART
        ================================================= */}

        {cartItems.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#8b6f47]/10">
              <ShoppingBag className="h-12 w-12 text-[#8b6f47]" />
            </div>

            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mb-7 max-w-md text-sm leading-6 text-gray-500">
              You haven't added anything to your cart yet.
              Explore our products and add your favorite items.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8b6f47] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#735b3c]"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        ) : (

          /* =================================================
             CART CONTENT
          ================================================= */

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* =================================================
               PRODUCTS
            ================================================= */}

            <div className="space-y-4 lg:col-span-2">

              {cartItems.map((item) => (

                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                >

                  <div className="flex flex-col gap-5 sm:flex-row">

                    {/* Product Image */}

                    <div className="h-36 w-full flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-10 w-10 text-gray-400" />
                        </div>
                      )}

                    </div>

                    {/* Product Details */}

                    <div className="flex min-w-0 flex-1 flex-col justify-between">

                      <div>

                        {/* Category */}

                        {item.category && (
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#8b6f47]">
                            {item.category}
                          </p>
                        )}

                        {/* Name */}

                        <h2 className="text-lg font-bold text-gray-900">
                          {item.name}
                        </h2>

                        {/* Price */}

                        <p className="mt-2 text-base font-bold text-[#8b6f47]">
                          {formatPrice(item.price)}
                        </p>

                      </div>

                      {/* Bottom Controls */}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                        {/* Quantity */}

                        <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-200"
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="flex h-9 min-w-[40px] items-center justify-center border-x border-gray-200 bg-white text-sm font-bold text-gray-900">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-200"
                            aria-label={`Increase ${item.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>

                        </div>

                        {/* Remove */}

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1.5 text-sm font-medium text-red-500 transition hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>

                      </div>

                    </div>

                    {/* Item Total */}

                    <div className="border-t border-gray-100 pt-4 text-left sm:border-0 sm:pt-0 sm:text-right">

                      <p className="text-xs text-gray-400">
                        Item Total
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {formatPrice(
                          item.price * item.quantity
                        )}
                      </p>

                    </div>

                  </div>
                </div>

              ))}

            </div>

            {/* =================================================
               ORDER SUMMARY
            ================================================= */}

            <div className="lg:col-span-1">

              <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                {/* Summary */}

                <div className="space-y-4">

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Items ({totalItems})
                    </span>

                    <span className="font-medium text-gray-900">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Truck className="h-4 w-4" />
                      Delivery
                    </span>

                    <span className="font-medium text-gray-900">
                      {deliveryCharge === 0
                        ? "FREE"
                        : formatPrice(deliveryCharge)}
                    </span>
                  </div>

                  {/* Free delivery message */}

                  {totalPrice > 0 && totalPrice < 1000 && (
                    <div className="rounded-lg bg-[#8b6f47]/5 p-3 text-xs leading-5 text-[#8b6f47]">
                      Add {formatPrice(1000 - totalPrice)} more
                      to get FREE delivery.
                    </div>
                  )}

                  {totalPrice >= 1000 && (
                    <div className="rounded-lg bg-green-50 p-3 text-xs font-medium text-green-700">
                      🎉 You got FREE delivery!
                    </div>
                  )}

                  {/* Divider */}

                  <div className="border-t border-gray-200 pt-4">

                    <div className="flex items-center justify-between">

                      <span className="text-base font-bold text-gray-900">
                        Grand Total
                      </span>

                      <span className="text-2xl font-bold text-[#8b6f47]">
                        {formatPrice(grandTotal)}
                      </span>

                    </div>

                  </div>

                </div>

                {/* Checkout */}

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#8b6f47] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#735b3c] active:scale-[0.98]"
                >
                  <CreditCard className="h-4 w-4" />
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}

                <Link
                  to="/products"
                  className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-[#8b6f47] transition hover:underline"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </Link>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;