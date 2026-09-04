import { useEffect, useRef, useState } from 'react';
import type {
  ChangeEvent,
  MouseEvent,
  ReactNode,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  ArrowLeft,
  DollarSign,
  Flame,
  Heart,
  MoreVertical,
  PenTool,
  Share2,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  Trash2,
  TrendingDown,
  TrendingUp,
  Truck,
  X,
} from 'lucide-react';

import { toast } from 'react-hot-toast';

/* ============================================================
   PRODUCT TYPE
============================================================ */

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  deliveryCharge: number;
  seller: string;
  sellerId: string;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  stock: number;
  isBestPrice?: boolean;
  isRecommended?: boolean;
  deliveryTimeMinDays?: number;
  createdAt: string;
  description?: string;
  specifications?: Record<string, string>;
  gallery?: string[];
}

/* ============================================================
   LOCAL STORAGE KEYS
============================================================ */

const STORAGE_KEYS = {
  PRODUCTS: 'construction_products',
  WISHLIST: 'product_wishlist',
};

/* ============================================================
   DEFAULT PRODUCT
============================================================ */

const defaultProduct: Product = {
  id: 'p1',
  name: 'UltraTech Cement (50kg)',
  brand: 'UltraTech',
  category: 'Cement',
  price: 350,
  deliveryCharge: 50,
  seller: 'ABC Constructions',
  sellerId: 's1',
  rating: 4.5,
  reviewCount: 1250,
  location: 'Delhi',
  image:
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
  stock: 5000,
  isBestPrice: true,
  isRecommended: true,
  deliveryTimeMinDays: 2,
  createdAt: '2024-01-15',

  description:
    "UltraTech Cement is India's No.1 Cement brand. It is a high quality Portland Pozzolana Cement (PPC) suitable for general construction. It offers high strength, durability and smooth finish.",

  specifications: {
    Type: 'PPC (Portland Pozzolana Cement)',
    'Compressive Strength': '43 MPa',
    Grade: '43 Grade',
    'Final Setting Time': '600 mins',
    'Initial Setting Time': '30 mins',
    Color: 'Grey',
  },

  gallery: [
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
  ],
};

/* ============================================================
   PRODUCT DETAILS PAGE
============================================================ */

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] =
    useState<string>('Overview');

  const [product, setProduct] =
    useState<Product>(defaultProduct);

  const [isWishlisted, setIsWishlisted] =
    useState<boolean>(false);

  const [previewImage, setPreviewImage] =
    useState<string | null>(null);

  /* ==========================================================
     LOAD PRODUCT
  ========================================================== */

  useEffect(() => {
    try {
      const stored = localStorage.getItem(
        STORAGE_KEYS.PRODUCTS
      );

      if (stored) {
        const products: Product[] = JSON.parse(stored);

        const matchedProduct = products.find(
          (item) => item.id === id
        );

        if (matchedProduct) {
          setProduct({
            ...defaultProduct,
            ...matchedProduct,
          });

          return;
        }
      }
    } catch (error) {
      console.error(
        'Error reading products:',
        error
      );
    }

    setProduct(defaultProduct);
  }, [id]);

  /* ==========================================================
     LOAD WISHLIST
  ========================================================== */

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(
        STORAGE_KEYS.WISHLIST
      );

      if (!savedWishlist) {
        setIsWishlisted(false);
        return;
      }

      const wishlist: string[] =
        JSON.parse(savedWishlist);

      setIsWishlisted(
        wishlist.includes(product.id)
      );
    } catch (error) {
      console.error(
        'Error reading wishlist:',
        error
      );

      setIsWishlisted(false);
    }
  }, [product.id]);

  /* ==========================================================
     SAVE PRODUCT
  ========================================================== */

  const saveProductToStorage = (
    updatedProduct: Product
  ): void => {
    try {
      const stored = localStorage.getItem(
        STORAGE_KEYS.PRODUCTS
      );

      const products: Product[] = stored
        ? JSON.parse(stored)
        : [];

      const existingIndex = products.findIndex(
        (item) => item.id === updatedProduct.id
      );

      if (existingIndex >= 0) {
        products[existingIndex] = updatedProduct;
      } else {
        products.push(updatedProduct);
      }

      localStorage.setItem(
        STORAGE_KEYS.PRODUCTS,
        JSON.stringify(products)
      );
    } catch (error) {
      console.error(
        'Failed to save product:',
        error
      );
    }
  };

  /* ==========================================================
     TOGGLE WISHLIST
  ========================================================== */

  const handleToggleWishlist = (): void => {
    try {
      const savedWishlist = localStorage.getItem(
        STORAGE_KEYS.WISHLIST
      );

      let wishlist: string[] = savedWishlist
        ? JSON.parse(savedWishlist)
        : [];

      if (wishlist.includes(product.id)) {
        wishlist = wishlist.filter(
          (item) => item !== product.id
        );

        setIsWishlisted(false);

        toast.success(
          'Removed from wishlist'
        );
      } else {
        wishlist.push(product.id);

        setIsWishlisted(true);

        toast.success(
          'Added to wishlist'
        );
      }

      localStorage.setItem(
        STORAGE_KEYS.WISHLIST,
        JSON.stringify(wishlist)
      );
    } catch (error) {
      console.error(
        'Wishlist error:',
        error
      );

      toast.error(
        'Failed to update wishlist'
      );
    }
  };

  /* ==========================================================
     SHARE PRODUCT
  ========================================================== */

  const handleShare = async (): Promise<void> => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name}`,
          url: window.location.href,
        });

        return;
      }

      await navigator.clipboard.writeText(
        window.location.href
      );

      toast.success(
        'Link copied to clipboard!'
      );
    } catch {
      // User cancelled sharing.
    }
  };

  /* ==========================================================
     IMAGE UPLOAD
  ========================================================== */

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    if (!file.type.startsWith('image/')) {
      toast.error(
        'Please select an image file'
      );

      return;
    }

    const imageUrl = URL.createObjectURL(file);

    const currentGallery =
      product.gallery &&
      product.gallery.length > 0
        ? product.gallery
        : [product.image];

    const updatedProduct: Product = {
      ...product,
      gallery: [
        ...currentGallery,
        imageUrl,
      ],
    };

    setProduct(updatedProduct);
    saveProductToStorage(updatedProduct);

    toast.success(
      'Image added successfully!'
    );

    event.target.value = '';
  };

  /* ==========================================================
     REMOVE IMAGE
  ========================================================== */

  const handleRemoveImage = (
    imageUrlToRemove: string,
    event?: MouseEvent
  ): void => {
    event?.stopPropagation();

    const currentGallery =
      product.gallery &&
      product.gallery.length > 0
        ? product.gallery
        : [product.image];

    if (currentGallery.length <= 1) {
      toast.error(
        'At least one product image is required!'
      );

      return;
    }

    const updatedGallery =
      currentGallery.filter(
        (image) => image !== imageUrlToRemove
      );

    const updatedProduct: Product = {
      ...product,
      gallery: updatedGallery,
    };

    setProduct(updatedProduct);
    saveProductToStorage(updatedProduct);

    if (
      previewImage === imageUrlToRemove
    ) {
      setPreviewImage(null);
    }

    toast.success(
      'Image removed successfully!'
    );
  };

  /* ==========================================================
     ADD TO CART
  ========================================================== */

  const handleAddToCart = (): void => {
    if (product.stock <= 0) {
      toast.error(
        'Product is out of stock'
      );

      return;
    }

    toast.success(
      `${product.name} added to cart`
    );
  };

  /* ==========================================================
     BUY NOW
  ========================================================== */

  const handleBuyNow = (): void => {
    if (product.stock <= 0) {
      toast.error(
        'Product is out of stock'
      );

      return;
    }

    toast.success(
      `Proceeding to checkout for ${product.name}`
    );
  };

  /* ==========================================================
     IMAGE LIST
  ========================================================== */

  const imagesList =
    product.gallery &&
    product.gallery.length > 0
      ? product.gallery
      : [product.image];

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-gray-800">

      {/* ======================================================
          BREADCRUMB
      ====================================================== */}

      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-[#5A2E12]"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <span>/</span>

          <button
            type="button"
            onClick={() =>
              navigate('/products')
            }
            className="hover:text-[#5A2E12]"
          >
            Products
          </button>

          <span>/</span>

          <span className="font-medium text-gray-800 truncate">
            {product.name}
          </span>

        </div>

        {/* ====================================================
            PRODUCT CARD
        ==================================================== */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-5 sm:p-7">

            {/* ==================================================
                IMAGE SECTION
            ================================================== */}

            <div className="lg:col-span-5">

              <div className="flex flex-col-reverse sm:flex-row gap-4">

                {/* THUMBNAILS */}

                <div className="flex sm:flex-col gap-3 overflow-x-auto">

                  {imagesList.map(
                    (image, index) => (
                      <button
                        type="button"
                        key={`${image}-${index}`}
                        onClick={() =>
                          setPreviewImage(image)
                        }
                        className="w-16 h-16 shrink-0 border border-gray-300 hover:border-[#5A2E12] rounded-lg p-1 bg-white transition"
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    )
                  )}

                  {/* ADD IMAGE */}

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="w-16 h-16 shrink-0 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-[#5A2E12] hover:border-[#5A2E12]"
                  >
                    <span className="text-xl">
                      +
                    </span>

                    <span className="text-[9px]">
                      Add
                    </span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />

                </div>

                {/* MAIN IMAGE */}

                <div className="flex-1 min-h-[390px] flex items-center justify-center relative bg-white rounded-xl">

                  <img
                    src={product.image}
                    alt={product.name}
                    onClick={() =>
                      setPreviewImage(
                        product.image
                      )
                    }
                    className="max-h-[390px] max-w-full object-contain cursor-zoom-in hover:scale-105 transition-transform duration-300"
                  />

                  {/* WISHLIST */}

                  <button
                    type="button"
                    onClick={
                      handleToggleWishlist
                    }
                    className={`absolute top-3 right-3 w-11 h-11 rounded-full bg-white shadow-md border flex items-center justify-center transition ${
                      isWishlisted
                        ? 'text-red-500'
                        : 'text-gray-500 hover:text-[#5A2E12]'
                    }`}
                  >
                    <Heart
                      size={22}
                      className={
                        isWishlisted
                          ? 'fill-red-500'
                          : ''
                      }
                    />
                  </button>

                </div>

              </div>

              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div className="flex gap-3 mt-6">

                <button
                  type="button"
                  onClick={
                    handleAddToCart
                  }
                  disabled={
                    product.stock <= 0
                  }
                  className="flex-1 bg-[#5A2E12] hover:bg-[#3F2413] disabled:bg-gray-400 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <ShoppingCart size={19} />
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={
                    product.stock <= 0
                  }
                  className="flex-1 bg-[#6B3A18] hover:bg-[#5A2E12] disabled:bg-gray-400 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <ShoppingBag size={19} />
                  Buy Now
                </button>

              </div>

            </div>

            {/* ==================================================
                PRODUCT INFORMATION
            ================================================== */}

            <div className="lg:col-span-7">

              <div className="flex justify-between gap-4">

                <div>

                  <p className="text-sm text-[#5A2E12] font-semibold mb-1">
                    {product.brand}
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>

                </div>

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-[#F5EBDD]"
                    aria-label="Share product"
                  >
                    <Share2 size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toast(
                        'More product options'
                      )
                    }
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-[#F5EBDD]"
                    aria-label="More options"
                  >
                    <MoreVertical size={17} />
                  </button>

                </div>

              </div>

              {/* RATING AND PRICE */}

              <div className="border-b border-gray-200 pb-5 mt-4">

                <div className="flex items-center gap-3">

                  <span className="bg-[#5A2E12] text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    {product.rating}

                    <Star
                      size={11}
                      className="fill-[#E8D5B5]"
                    />
                  </span>

                  <span className="text-sm font-semibold text-gray-600">
                    {product.reviewCount.toLocaleString()}{' '}
                    Ratings & Reviews
                  </span>

                </div>

                <div className="flex items-center gap-3 mt-5">

                  <span className="text-3xl font-extrabold text-gray-900">
                    ₹
                    {product.price.toLocaleString()}
                  </span>

                  <span className="text-sm text-gray-500">
                    + ₹
                    {product.deliveryCharge.toLocaleString()}{' '}
                    delivery
                  </span>

                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Inclusive of applicable taxes
                </p>

              </div>

              {/* =================================================
                  OFFERS
              ================================================= */}

              <div className="py-5 border-b">

                <h3 className="font-bold text-gray-900 mb-4">
                  Available Offers
                </h3>

                <div className="space-y-4">

                  <Offer
                    title="Special Price"
                    description="Get extra discount on selected construction materials"
                  />

                  <Offer
                    title="Bank Offer"
                    description="10% instant discount with selected bank cards"
                  />

                  <Offer
                    title="Bulk Order Offer"
                    description="Extra savings available on orders above ₹50,000"
                  />

                </div>

              </div>

              {/* =================================================
                  DELIVERY
              ================================================= */}

              <div className="py-5 border-b">

                <h3 className="font-bold mb-3">
                  Delivery
                </h3>

                <div className="flex flex-wrap items-center gap-3">

                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">

                    <input
                      type="text"
                      placeholder="Enter pincode"
                      className="px-3 py-2 outline-none text-sm w-36"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        toast.success(
                          'Checking delivery availability'
                        )
                      }
                      className="px-3 text-[#5A2E12] font-bold text-sm"
                    >
                      Check
                    </button>

                  </div>

                  <span className="text-green-600 text-sm flex items-center gap-1">
                    <Truck size={15} />

                    Usually delivered in{' '}
                    {product.deliveryTimeMinDays ||
                      2}
                    -3 days
                  </span>

                </div>

              </div>

              {/* =================================================
                  HIGHLIGHTS
              ================================================= */}

              <div className="py-5">

                <h3 className="font-bold mb-4">
                  Highlights
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                  <FeatureBadge
                    icon={
                      <Flame size={15} />
                    }
                    text="High Strength"
                  />

                  <FeatureBadge
                    icon={
                      <Shield size={15} />
                    }
                    text="Durable"
                  />

                  <FeatureBadge
                    icon={
                      <PenTool size={15} />
                    }
                    text="Better Finish"
                  />

                  <FeatureBadge
                    icon={
                      <DollarSign size={15} />
                    }
                    text="Cost Effective"
                  />

                </div>

              </div>

              {/* =================================================
                  SELLER
              ================================================= */}

              <div className="border border-gray-200 rounded-xl p-4">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div className="flex gap-3">

                    <div className="w-12 h-12 bg-[#F5EBDD] rounded-lg flex items-center justify-center text-[#5A2E12]">
                      <Store size={22} />
                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Sold by
                      </p>

                      <h3 className="font-bold">
                        {product.seller}
                      </h3>

                      <p className="text-xs text-green-600">
                        4.8 ★ Seller Rating
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toast(
                        'Seller profile opened'
                      )
                    }
                    className="border border-[#5A2E12] text-[#5A2E12] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#F5EBDD]"
                  >
                    View Seller
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ======================================================
            PRODUCT TABS

            Related Construction Materials section has been
            completely removed.
        ====================================================== */}

        <div className="bg-white border border-gray-200 rounded-xl mt-7">

          {/* TAB HEADER */}

          <div className="flex overflow-x-auto border-b">

            {[
              'Overview',
              'Specifications',
              'Seller Information',
              `Reviews (${product.reviewCount})`,
              'Orders (320)',
              'Price History',
            ].map((tab) => (

              <button
                type="button"
                key={tab}
                onClick={() =>
                  setActiveTab(tab)
                }
                className={`px-6 py-4 whitespace-nowrap text-sm font-semibold transition ${
                  activeTab === tab
                    ? 'text-[#5A2E12] border-b-2 border-[#5A2E12]'
                    : 'text-gray-500 hover:text-[#5A2E12]'
                }`}
              >
                {tab}
              </button>

            ))}

          </div>

          {/* ==================================================
              OVERVIEW
          ================================================== */}

          {activeTab === 'Overview' && (

            <div className="p-6 grid lg:grid-cols-3 gap-8">

              <div className="lg:col-span-2">

                <h3 className="font-bold text-lg mb-4">
                  Product Description
                </h3>

                <p className="text-sm text-gray-600 leading-7">
                  {product.description ||
                    defaultProduct.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">

                  <FeatureBadge
                    icon={
                      <Flame size={15} />
                    }
                    text="High Strength"
                  />

                  <FeatureBadge
                    icon={
                      <Shield size={15} />
                    }
                    text="Durable"
                  />

                  <FeatureBadge
                    icon={
                      <PenTool size={15} />
                    }
                    text="Better Finish"
                  />

                  <FeatureBadge
                    icon={
                      <DollarSign size={15} />
                    }
                    text="Cost Effective"
                  />

                </div>

              </div>

              <div>

                <h3 className="font-bold text-lg mb-4">
                  Product Details
                </h3>

                <div className="space-y-3 text-sm">

                  <SummaryRow
                    label="Product ID"
                    value={`#${product.id}`}
                  />

                  <SummaryRow
                    label="Category"
                    value={product.category}
                  />

                  <SummaryRow
                    label="Brand"
                    value={product.brand}
                  />

                  <SummaryRow
                    label="Weight"
                    value="50 kg"
                  />

                  <SummaryRow
                    label="Minimum Order"
                    value="1 Bag"
                  />

                  <SummaryRow
                    label="Location"
                    value={product.location}
                  />

                  <SummaryRow
                    label="Stock"
                    value={
                      product.stock > 0
                        ? `${product.stock} available`
                        : 'Out of Stock'
                    }
                  />

                  <SummaryRow
                    label="Added On"
                    value={product.createdAt}
                  />

                </div>

              </div>

            </div>

          )}

          {/* ==================================================
              SPECIFICATIONS
          ================================================== */}

          {activeTab === 'Specifications' && (

            <div className="p-6">

              <h3 className="font-bold text-lg mb-5">
                Technical Specifications
              </h3>

              <div className="grid md:grid-cols-2 gap-3">

                {Object.entries(
                  product.specifications ||
                    defaultProduct.specifications ||
                    {}
                ).map(
                  ([key, value]) => (

                    <div
                      key={key}
                      className="flex justify-between gap-4 bg-[#F5F3EF] border border-gray-200 p-4 rounded-lg"
                    >

                      <span className="text-gray-500">
                        {key}
                      </span>

                      <span className="font-semibold text-right">
                        {value}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

          {/* ==================================================
              SELLER INFORMATION
          ================================================== */}

          {activeTab === 'Seller Information' && (

            <div className="p-6">

              <div className="flex gap-4 items-center">

                <div className="w-14 h-14 bg-[#F5EBDD] rounded-full flex items-center justify-center text-[#5A2E12]">
                  <Store size={25} />
                </div>

                <div>

                  <h3 className="font-bold text-lg">
                    {product.seller}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Verified Construction Supplier •{' '}
                    {product.location}
                  </p>

                </div>

              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6">

                <SellerStat
                  title="Total Products"
                  value="142 Materials"
                />

                <SellerStat
                  title="Seller Rating"
                  value="4.8 / 5.0 ★"
                />

                <SellerStat
                  title="Response Time"
                  value="< 2 Hours"
                />

              </div>

            </div>

          )}

          {/* ==================================================
              REVIEWS
          ================================================== */}

          {activeTab.startsWith('Reviews') && (

            <div className="p-6">

              <div className="flex items-center justify-between mb-5">

                <h3 className="font-bold text-lg">
                  Customer Reviews
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    toast.success(
                      'Write review opened'
                    )
                  }
                  className="bg-[#5A2E12] hover:bg-[#3F2413] text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Write a Review
                </button>

              </div>

              <div className="space-y-5">

                {[
                  {
                    author: 'Rajesh Kumar',
                    rating: 5,
                    date: '2 days ago',
                    comment:
                      'Excellent quality cement. Delivered on time in perfect sealed bags.',
                  },
                  {
                    author: 'Suresh Patel',
                    rating: 4,
                    date: '1 week ago',
                    comment:
                      'Good strength and finish. Overall satisfied with the product.',
                  },
                ].map(
                  (review, index) => (

                    <div
                      key={index}
                      className="border-b border-gray-200 pb-5"
                    >

                      <div className="flex justify-between">

                        <div>

                          <div className="font-semibold">
                            {review.author}
                          </div>

                          <div className="flex mt-1">

                            {Array.from({
                              length: review.rating,
                            }).map(
                              (_, starIndex) => (

                                <Star
                                  key={starIndex}
                                  size={14}
                                  className="fill-[#E8B34B] text-[#E8B34B]"
                                />

                              )
                            )}

                          </div>

                        </div>

                        <span className="text-xs text-gray-400">
                          {review.date}
                        </span>

                      </div>

                      <p className="text-sm text-gray-600 mt-3">
                        {review.comment}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

          {/* ==================================================
              ORDERS
          ================================================== */}

          {activeTab.startsWith('Orders') && (

            <div className="p-6 overflow-x-auto">

              <h3 className="font-bold text-lg mb-5">
                Recent Product Orders
              </h3>

              <table className="w-full text-sm">

                <thead>

                  <tr className="bg-[#F5F3EF]">

                    <th className="p-3 text-left">
                      Order ID
                    </th>

                    <th className="p-3 text-left">
                      Buyer
                    </th>

                    <th className="p-3 text-left">
                      Quantity
                    </th>

                    <th className="p-3 text-left">
                      Amount
                    </th>

                    <th className="p-3 text-left">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  <tr className="border-b">

                    <td className="p-3 font-semibold">
                      #ORD-9921
                    </td>

                    <td className="p-3">
                      BuildCorp Industries
                    </td>

                    <td className="p-3">
                      150 Bags
                    </td>

                    <td className="p-3 font-bold">
                      ₹52,500
                    </td>

                    <td className="p-3 text-green-600 font-semibold">
                      Delivered
                    </td>

                  </tr>

                  <tr>

                    <td className="p-3 font-semibold">
                      #ORD-9844
                    </td>

                    <td className="p-3">
                      Metro Infra Ltd
                    </td>

                    <td className="p-3">
                      500 Bags
                    </td>

                    <td className="p-3 font-bold">
                      ₹1,75,000
                    </td>

                    <td className="p-3 text-blue-600 font-semibold">
                      In Transit
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          )}

          {/* ==================================================
              PRICE HISTORY
          ================================================== */}

          {activeTab === 'Price History' && (

            <div className="p-6">

              <h3 className="font-bold text-lg mb-5">
                Historical Price Trends
              </h3>

              <div className="space-y-3">

                <div className="p-4 bg-green-50 rounded-lg flex justify-between items-center">

                  <div className="flex gap-3">

                    <TrendingDown
                      className="text-green-600"
                      size={20}
                    />

                    <div>

                      <p className="font-bold">
                        ₹
                        {product.price.toLocaleString()}{' '}
                        Current Price
                      </p>

                      <p className="text-xs text-gray-500">
                        Current best price
                      </p>

                    </div>

                  </div>

                  <span className="text-green-600 font-bold">
                    - ₹20
                  </span>

                </div>

                <div className="p-4 bg-[#F5F3EF] rounded-lg flex justify-between items-center">

                  <div className="flex gap-3">

                    <TrendingUp
                      className="text-gray-400"
                      size={20}
                    />

                    <div>

                      <p className="font-bold">
                        ₹370
                      </p>

                      <p className="text-xs text-gray-500">
                        June 2024
                      </p>

                    </div>

                  </div>

                  <span className="text-gray-500">
                    Previous price
                  </span>

                </div>

              </div>

            </div>

          )}

        </div>

      </main>

      {/* ======================================================
          IMAGE PREVIEW MODAL
      ====================================================== */}

      {previewImage && (

        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() =>
            setPreviewImage(null)
          }
        >

          <div
            className="bg-white rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex justify-between items-center p-4 border-b">

              <h3 className="font-bold">
                Product Image
              </h3>

              <button
                type="button"
                onClick={() =>
                  setPreviewImage(null)
                }
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close image preview"
              >
                <X size={20} />
              </button>

            </div>

            {/* IMAGE */}

            <div className="p-6 bg-[#F5F3EF] flex justify-center">

              <img
                src={previewImage}
                alt="Product Preview"
                className="max-h-[70vh] max-w-full object-contain"
              />

            </div>

            {/* FOOTER */}

            <div className="p-4 flex justify-between">

              <button
                type="button"
                onClick={() =>
                  handleRemoveImage(
                    previewImage
                  )
                }
                className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-semibold text-sm"
              >
                <Trash2 size={16} />
                Remove Image
              </button>

              <button
                type="button"
                onClick={() =>
                  setPreviewImage(null)
                }
                className="bg-[#5A2E12] hover:bg-[#3F2413] text-white px-5 py-2 rounded-lg font-semibold text-sm"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

/* ============================================================
   OFFER COMPONENT
============================================================ */

const Offer = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex gap-3">

      <div className="w-7 h-7 rounded-full bg-[#F5EBDD] text-[#5A2E12] flex items-center justify-center shrink-0">
        <TagIcon />
      </div>

      <div>

        <p className="text-sm font-bold text-gray-900">
          {title}
        </p>

        <p className="text-xs text-gray-500 mt-0.5">
          {description}
        </p>

      </div>

    </div>
  );
};

/* ============================================================
   FEATURE BADGE
============================================================ */

const FeatureBadge = ({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) => {
  return (
    <div className="border border-[#E8D5B5] rounded-lg p-3 flex items-center gap-2 bg-[#FDF9F3]">

      <span className="text-[#5A2E12]">
        {icon}
      </span>

      <span className="text-xs font-semibold text-gray-800">
        {text}
      </span>

    </div>
  );
};

/* ============================================================
   SUMMARY ROW
============================================================ */

const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) => {
  return (
    <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">

      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-semibold text-right text-gray-800">
        {value}
      </span>

    </div>
  );
};

/* ============================================================
   SELLER STAT
============================================================ */

const SellerStat = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <div className="bg-[#F5F3EF] border border-gray-200 rounded-lg p-4">

      <p className="text-xs text-gray-500">
        {title}
      </p>

      <p className="font-bold text-lg text-gray-900 mt-1">
        {value}
      </p>

    </div>
  );
};

/* ============================================================
   TAG ICON
============================================================ */

const TagIcon = () => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41 11 3H4v7l9.59 9.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82Z" />

      <circle
        cx="7.5"
        cy="7.5"
        r="1"
      />
    </svg>
  );
};

export default ProductDetailsPage;