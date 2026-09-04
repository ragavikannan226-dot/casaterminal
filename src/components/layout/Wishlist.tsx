import React, { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Package,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WishlistProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  inStock: boolean;
}

const Wishlist: React.FC = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState<WishlistProduct[]>([
    {
      id: 1,
      name: "Premium Cement",
      category: "Building Materials",
      price: 450,
      oldPrice: 500,
      image:
        "https://images.unsplash.com/photo-1590479773265-7464e5d48118?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      inStock: true,
    },
    {
      id: 2,
      name: "Construction Steel Rod",
      category: "Steel & Metal",
      price: 2850,
      oldPrice: 3100,
      image:
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      inStock: true,
    },
    {
      id: 3,
      name: "Power Drill Machine",
      category: "Tools & Equipment",
      price: 3499,
      oldPrice: 3999,
      image:
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
      rating: 4.6,
      inStock: true,
    },
    {
      id: 4,
      name: "Safety Helmet",
      category: "Safety Equipment",
      price: 599,
      oldPrice: 699,
      image:
        "https://images.unsplash.com/photo-1578269174936-2709b4a5a4d7?auto=format&fit=crop&w=600&q=80",
      rating: 4.5,
      inStock: true,
    },
    {
      id: 5,
      name: "Construction Gloves",
      category: "Safety Equipment",
      price: 299,
      image:
        "https://images.unsplash.com/photo-1585914924626-15adac1e6402?auto=format&fit=crop&w=600&q=80",
      rating: 4.4,
      inStock: true,
    },
    {
      id: 6,
      name: "Angle Grinder",
      category: "Power Tools",
      price: 2799,
      oldPrice: 3299,
      image:
        "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      inStock: false,
    },
  ]);

  // ==========================================================
  // REMOVE FROM WISHLIST
  // ==========================================================

  const removeFromWishlist = (id: number) => {
    setWishlist((previous) =>
      previous.filter((product) => product.id !== id)
    );
  };

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const addToCart = (product: WishlistProduct) => {
    console.log("Added to cart:", product);

    // Save cart in localStorage
    const existingCart = JSON.parse(
      localStorage.getItem("casa_terminal_cart") || "[]"
    );

    const alreadyInCart = existingCart.some(
      (item: WishlistProduct) => item.id === product.id
    );

    if (!alreadyInCart) {
      localStorage.setItem(
        "casa_terminal_cart",
        JSON.stringify([
          ...existingCart,
          product,
        ])
      );
    }

    alert(`${product.name} added to cart`);
  };

  // ==========================================================
  // CLEAR WISHLIST
  // ==========================================================

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2]">

      {/* =====================================================
          PAGE CONTAINER
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-12">

        {/* ===================================================
            BREADCRUMB
        =================================================== */}

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="hover:text-[#502d13] transition"
          >
            Home
          </button>

          <ChevronRight size={15} />

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="hover:text-[#502d13] transition"
          >
            Profile
          </button>

          <ChevronRight size={15} />

          <span className="text-[#502d13] font-medium">
            Wishlist
          </span>

        </div>


        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

          <div className="flex items-center gap-3">

            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-[#e9ddc8]
                text-[#502d13]
                flex
                items-center
                justify-center
              "
            >
              <Heart
                size={25}
                fill="currentColor"
              />
            </div>

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#502d13]">
                My Wishlist
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                {wishlist.length}{" "}
                {wishlist.length === 1
                  ? "item"
                  : "items"}{" "}
                saved
              </p>

            </div>

          </div>


          {/* CLEAR */}

          {wishlist.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="
                w-full
                sm:w-auto
                flex
                items-center
                justify-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                border
                border-red-200
                text-red-600
                text-sm
                font-semibold
                hover:bg-red-50
                transition
              "
            >
              <Trash2 size={16} />
              Clear Wishlist
            </button>
          )}

        </div>


        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {wishlist.length === 0 ? (

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-gray-200
              shadow-sm
              py-16
              px-6
              text-center
            "
          >

            <div
              className="
                w-20
                h-20
                mx-auto
                rounded-full
                bg-[#e9ddc8]/60
                text-[#502d13]
                flex
                items-center
                justify-center
              "
            >
              <Heart size={38} />
            </div>

            <h2 className="mt-6 text-xl sm:text-2xl font-bold text-gray-900">
              Your Wishlist is Empty
            </h2>

            <p className="mt-2 max-w-md mx-auto text-sm text-gray-500">
              Save products you love and easily find them
              again whenever you need them.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                px-6
                py-3
                rounded-xl
                bg-[#502d13]
                text-white
                text-sm
                font-semibold
                hover:bg-[#3d210e]
                transition
              "
            >
              <Package size={17} />
              Browse Products
            </button>

          </div>

        ) : (

          /* =================================================
             PRODUCT GRID
          ================================================= */

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-5
            "
          >

            {wishlist.map((product) => (

              <div
                key={product.id}
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-gray-200
                  shadow-sm
                  overflow-hidden
                  group
                  hover:shadow-lg
                  transition-all
                "
              >

                {/* IMAGE */}

                <div className="relative h-52 sm:h-56 bg-gray-100 overflow-hidden">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-105
                      transition-transform
                      duration-500
                    "
                  />


                  {/* WISHLIST BUTTON */}

                  <button
                    type="button"
                    aria-label="Remove from wishlist"
                    onClick={() =>
                      removeFromWishlist(product.id)
                    }
                    className="
                      absolute
                      top-3
                      right-3
                      w-10
                      h-10
                      rounded-full
                      bg-white
                      shadow-md
                      text-red-500
                      flex
                      items-center
                      justify-center
                      hover:bg-red-50
                      transition
                    "
                  >
                    <Heart
                      size={19}
                      fill="currentColor"
                    />
                  </button>


                  {/* STOCK */}

                  <div className="absolute left-3 top-3">

                    {product.inStock ? (

                      <span
                        className="
                          px-2.5
                          py-1
                          rounded-full
                          bg-green-100
                          text-green-700
                          text-xs
                          font-semibold
                        "
                      >
                        In Stock
                      </span>

                    ) : (

                      <span
                        className="
                          px-2.5
                          py-1
                          rounded-full
                          bg-gray-800
                          text-white
                          text-xs
                          font-semibold
                        "
                      >
                        Out of Stock
                      </span>

                    )}

                  </div>

                </div>


                {/* CONTENT */}

                <div className="p-5">

                  <p className="text-xs font-medium text-[#502d13]">
                    {product.category}
                  </p>

                  <h2
                    className="
                      mt-1
                      text-base
                      sm:text-lg
                      font-bold
                      text-gray-900
                      line-clamp-1
                    "
                  >
                    {product.name}
                  </h2>


                  {/* RATING */}

                  <div className="flex items-center gap-2 mt-2">

                    <span className="text-yellow-500 text-sm">
                      ★
                    </span>

                    <span className="text-sm font-semibold text-gray-700">
                      {product.rating}
                    </span>

                    <span className="text-xs text-gray-400">
                      Excellent
                    </span>

                  </div>


                  {/* PRICE */}

                  <div className="flex items-center gap-2 mt-3">

                    <span className="text-xl font-bold text-[#502d13]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    {product.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.oldPrice.toLocaleString("en-IN")}
                      </span>
                    )}

                  </div>


                  {/* ACTIONS */}

                  <div className="flex gap-2 mt-5">

                    {/* VIEW */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/product/${product.id}`
                        )
                      }
                      className="
                        flex-1
                        px-3
                        py-2.5
                        rounded-xl
                        border
                        border-gray-300
                        text-gray-700
                        text-sm
                        font-semibold
                        hover:border-[#502d13]
                        hover:text-[#502d13]
                        transition
                      "
                    >
                      View Details
                    </button>


                    {/* CART */}

                    <button
                      type="button"
                      disabled={!product.inStock}
                      onClick={() =>
                        addToCart(product)
                      }
                      className="
                        w-12
                        h-11
                        rounded-xl
                        bg-[#502d13]
                        text-white
                        flex
                        items-center
                        justify-center
                        hover:bg-[#3d210e]
                        disabled:bg-gray-300
                        disabled:cursor-not-allowed
                        transition
                      "
                      aria-label="Add to cart"
                    >
                      <ShoppingCart size={19} />
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}


        {/* ===================================================
            CONTINUE SHOPPING
        =================================================== */}

        <div className="mt-8">

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-[#502d13]
              hover:underline
            "
          >

            <ArrowLeft size={16} />

            Continue Shopping

          </button>

        </div>

      </div>

    </div>
  );
};

export default Wishlist;