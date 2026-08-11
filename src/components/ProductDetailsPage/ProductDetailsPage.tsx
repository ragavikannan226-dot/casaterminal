import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, MouseEvent, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  ArrowLeft,
  DollarSign,
  Eye,
  Flame,
  Heart,
  MapPin,
  MoreVertical,
  PenTool,
  Plus,
  Search,
  Share2,
  ShoppingBag,
  Star,
  Store,
  Trash2,
  TrendingDown,
  TrendingUp,
  Truck,
  X,
  Shield,
} from 'lucide-react';

import { toast } from 'react-hot-toast';

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

const STORAGE_KEYS = {
  PRODUCTS: 'construction_products',
  WISHLIST: 'product_wishlist',
};

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
  location: 'Mumbai',
  image:
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500',
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
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
  ],
};

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState('Overview');
  const [product, setProduct] = useState<Product>(defaultProduct);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  /*
   * ============================================================
   * LOAD PRODUCT
   * ============================================================
   */

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);

      if (stored) {
        const products: Product[] = JSON.parse(stored);

        const match = products.find((item) => item.id === id);

        if (match) {
          setProduct({
            ...defaultProduct,
            ...match,
          });

          return;
        }
      }
    } catch (error) {
      console.error('Error reading products from localStorage:', error);
    }

    setProduct(defaultProduct);
  }, [id]);

  /*
   * ============================================================
   * CHECK WISHLIST
   * ============================================================
   */

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);

      if (savedWishlist) {
        const list: string[] = JSON.parse(savedWishlist);

        setIsWishlisted(list.includes(product.id));
      } else {
        setIsWishlisted(false);
      }
    } catch (error) {
      console.error('Error reading wishlist:', error);
      setIsWishlisted(false);
    }
  }, [product.id]);

  /*
   * ============================================================
   * SAVE PRODUCT
   * ============================================================
   */

  const saveProductToStorage = (updatedProduct: Product) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);

      let list: Product[] = stored ? JSON.parse(stored) : [];

      const index = list.findIndex(
        (item) => item.id === updatedProduct.id
      );

      if (index !== -1) {
        list[index] = updatedProduct;
      } else {
        list.push(updatedProduct);
      }

      localStorage.setItem(
        STORAGE_KEYS.PRODUCTS,
        JSON.stringify(list)
      );
    } catch (error) {
      console.error(
        'Failed to save product to localStorage:',
        error
      );
    }
  };

  /*
   * ============================================================
   * WISHLIST
   * ============================================================
   */

  const handleToggleWishlist = () => {
    try {
      const savedWishlist = localStorage.getItem(
        STORAGE_KEYS.WISHLIST
      );

      let list: string[] = savedWishlist
        ? JSON.parse(savedWishlist)
        : [];

      if (list.includes(product.id)) {
        list = list.filter((item) => item !== product.id);

        setIsWishlisted(false);

        toast.success('Removed from wishlist');
      } else {
        list.push(product.id);

        setIsWishlisted(true);

        toast.success('Added to wishlist');
      }

      localStorage.setItem(
        STORAGE_KEYS.WISHLIST,
        JSON.stringify(list)
      );
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    }
  };

  /*
   * ============================================================
   * SHARE
   * ============================================================
   */

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        toast.success('Link copied to clipboard!');
      }
    } catch {
      // User cancelled share
    }
  };

  /*
   * ============================================================
   * IMAGE UPLOAD
   * ============================================================
   */

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    const currentGallery =
      product.gallery && product.gallery.length > 0
        ? product.gallery
        : [product.image];

    const updatedGallery = [
      ...currentGallery,
      imageUrl,
    ];

    const updatedProduct: Product = {
      ...product,
      gallery: updatedGallery,
    };

    setProduct(updatedProduct);

    saveProductToStorage(updatedProduct);

    toast.success('Image added successfully!');

    event.target.value = '';
  };

  /*
   * ============================================================
   * REMOVE IMAGE
   * ============================================================
   */

  const handleRemoveImage = (
    imageUrlToRemove: string,
    event?: MouseEvent
  ) => {
    if (event) {
      event.stopPropagation();
    }

    const currentGallery =
      product.gallery && product.gallery.length > 0
        ? product.gallery
        : [product.image];

    if (currentGallery.length <= 1) {
      toast.error(
        'At least one product image is required!'
      );

      return;
    }

    const updatedGallery = currentGallery.filter(
      (url) => url !== imageUrlToRemove
    );

    const updatedProduct: Product = {
      ...product,
      gallery: updatedGallery,
    };

    setProduct(updatedProduct);

    saveProductToStorage(updatedProduct);

    if (previewImage === imageUrlToRemove) {
      setPreviewImage(null);
    }

    toast.success('Image removed successfully!');
  };

  /*
   * ============================================================
   * BUY NOW
   * ============================================================
   */

  const handleBuyNow = () => {
    toast.success(
      `Redirecting to checkout for ${product.name}!`
    );
  };

  /*
   * ============================================================
   * IMAGE LIST
   * ============================================================
   */

  const imagesList =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 flex flex-col font-sans">

      {/* Top Accent Line */}
      <div className="h-1 bg-orange-500 w-full" />

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

          {/* ====================================================
              TOP NAVBAR
          ==================================================== */}

          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">

            <div className="flex items-center gap-4 flex-1 max-w-xl">

              {/* Menu Button */}
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() =>
                  toast('Menu options')
                }
              >
                <MenuIcon />
              </button>

              {/* Search */}
              <div className="relative w-full">

                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Search products, brands..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />

              </div>

            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
              {/* Right side actions can be added here */}
            </div>

          </header>

          {/* ====================================================
              MAIN CONTENT
          ==================================================== */}

          <main className="p-6 space-y-6">

            {/* ==================================================
                BREADCRUMB
            ================================================== */}

            <div className="flex items-center gap-3 text-sm text-gray-500">

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-1 rounded-md bg-white border border-gray-200 hover:bg-gray-50"
              >
                <ArrowLeft size={16} />
              </button>

              <button
                type="button"
                onClick={() => navigate('/products')}
                className="hover:underline"
              >
                Products
              </button>

              <span>&gt;</span>

              <span className="font-medium text-gray-900">
                {product.name}
              </span>

            </div>

            {/* ==================================================
                PRODUCT HERO CARD
            ================================================== */}

            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row gap-8 items-center md:items-start">

              {/* Product Image */}

              <div className="w-48 h-48 bg-gray-50 rounded-xl border border-gray-100 p-4 flex items-center justify-center shrink-0 overflow-hidden">

                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                />

              </div>

              {/* Product Information */}

              <div className="flex-1 space-y-3 w-full">

                {/* Badge + Actions */}

                <div className="flex items-center justify-between">

                  {product.isBestPrice ? (
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      Best Price
                    </span>
                  ) : (
                    <span className="bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  )}

                  <div className="flex items-center gap-2">

                    {/* Wishlist */}

                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      className={`p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition ${
                        isWishlisted
                          ? 'text-red-500'
                          : 'text-gray-600'
                      }`}
                      title="Wishlist"
                    >
                      <Heart
                        size={16}
                        className={
                          isWishlisted
                            ? 'fill-red-500'
                            : ''
                        }
                      />
                    </button>

                    {/* Share */}

                    <button
                      type="button"
                      onClick={handleShare}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                      title="Share"
                    >
                      <Share2 size={16} />
                    </button>

                    {/* More */}

                    <button
                      type="button"
                      onClick={() =>
                        toast('Additional options')
                      }
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                      title="More options"
                    >
                      <MoreVertical size={16} />
                    </button>

                  </div>

                </div>

                {/* Product Name */}

                <h2 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h2>

                {/* Brand */}

                <p className="text-xs text-gray-500">
                  {product.brand} Ltd.{' '}
                  <span className="text-gray-400">
                    by {product.seller}
                  </span>
                </p>

                {/* Rating */}

                <div className="flex items-center gap-4 text-xs text-gray-500 py-1">

                  <div className="flex items-center gap-1 font-semibold text-gray-900">

                    <Star
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />

                    <span>{product.rating}</span>

                    <span className="font-normal text-gray-400">
                      ({product.reviewCount} reviews)
                    </span>

                  </div>

                  <span>|</span>

                  <span>
                    📦 {product.reviewCount}+ sold
                  </span>

                </div>

                {/* Price */}

                <div className="flex items-baseline gap-2 pt-2">

                  <span className="text-3xl font-extrabold text-gray-900">
                    ₹{product.price}
                  </span>

                  <span className="text-xs text-gray-500">
                    + ₹{product.deliveryCharge} delivery
                  </span>

                </div>

                {/* Location / Delivery / Stock */}

                <div className="flex items-center gap-3 pt-2 text-xs flex-wrap">

                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">
                    <MapPin size={12} />
                    {product.location}
                  </span>

                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">
                    <Truck size={12} />
                    {product.deliveryTimeMinDays || 2}-3 days
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium ${
                      product.stock > 0
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        product.stock > 0
                          ? 'bg-emerald-500'
                          : 'bg-red-500'
                      }`}
                    />

                    {product.stock > 0
                      ? `In Stock (${product.stock})`
                      : 'Out of Stock'}
                  </span>

                </div>

              </div>

            </div>

            {/* ==================================================
                NAVIGATION TABS
            ================================================== */}

            <div className="border-b border-gray-200 flex gap-8 text-sm font-medium text-gray-500 overflow-x-auto">

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
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 relative whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-orange-600 font-semibold border-b-2 border-orange-500'
                      : 'hover:text-gray-700'
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN */}

                <div className="lg:col-span-2 space-y-6">

                  {/* Product Description */}

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">

                    <h3 className="font-bold text-gray-900 text-base">
                      Product Description
                    </h3>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {product.description ||
                        defaultProduct.description}
                    </p>

                    {/* Feature Badges */}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">

                      <FeatureBadge
                        icon={
                          <Flame
                            size={14}
                            className="text-orange-500"
                          />
                        }
                        text="High Strength"
                      />

                      <FeatureBadge
                        icon={
                          <Shield
                            size={14}
                            className="text-orange-500"
                          />
                        }
                        text="Long Durability"
                      />

                      <FeatureBadge
                        icon={
                          <PenTool
                            size={14}
                            className="text-orange-500"
                          />
                        }
                        text="Better Finish"
                      />

                      <FeatureBadge
                        icon={
                          <DollarSign
                            size={14}
                            className="text-orange-500"
                          />
                        }
                        text="Cost Effective"
                      />

                    </div>

                    {/* ==================================================
                        PRODUCT GALLERY
                    ================================================== */}

                    <div className="pt-4 space-y-3">

                      <h4 className="font-semibold text-gray-900 text-xs">
                        Product Images
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">

                        {imagesList.map((imgUrl, index) => (

                          <div
                            key={`${imgUrl}-${index}`}
                            onClick={() =>
                              setPreviewImage(imgUrl)
                            }
                            className="relative group border border-gray-200 rounded-xl p-2 bg-gray-50 flex items-center justify-center h-20 cursor-pointer overflow-hidden hover:border-orange-500 transition"
                          >

                            <img
                              src={imgUrl}
                              alt={`${product.name} ${index + 1}`}
                              className="max-h-full max-w-full object-contain"
                            />

                            {/* Hover Overlay */}

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">

                              {/* View */}

                              <span className="p-1 bg-white/80 rounded-full text-gray-800 hover:bg-white">
                                <Eye size={14} />
                              </span>

                              {/* Delete */}

                              <button
                                type="button"
                                onClick={(event) =>
                                  handleRemoveImage(
                                    imgUrl,
                                    event
                                  )
                                }
                                className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                                title="Delete Image"
                              >
                                <Trash2 size={14} />
                              </button>

                            </div>

                          </div>

                        ))}

                        {/* Hidden File Input */}

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />

                        {/* Add Image */}

                        <button
                          type="button"
                          onClick={() =>
                            fileInputRef.current?.click()
                          }
                          className="border border-dashed border-gray-300 rounded-xl p-2 hover:bg-gray-50 flex flex-col items-center justify-center gap-1 text-gray-400 h-20 transition"
                        >
                          <Plus size={16} />

                          <span className="text-[10px]">
                            Add Images
                          </span>
                        </button>

                      </div>

                    </div>

                  </div>

                  {/* ==================================================
                      SPECIFICATIONS PREVIEW
                  ================================================== */}

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">

                    <h3 className="font-bold text-gray-900 text-base">
                      Product Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-y-3 text-xs">

                      {Object.entries(
                        product.specifications ||
                          defaultProduct.specifications ||
                          {}
                      ).map(([key, value]) => (

                        <div key={key}>

                          <span className="text-gray-400">
                            {key}
                          </span>

                          <p className="font-medium text-gray-800">
                            {value}
                          </p>

                        </div>

                      ))}

                    </div>

                  </div>

                </div>

                {/* ==================================================
                    RIGHT COLUMN
                ================================================== */}

                <div className="space-y-6">

                  {/* Product Summary */}

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 text-xs">

                    <h3 className="font-bold text-gray-900 text-base">
                      Product Summary
                    </h3>

                    <div className="space-y-3">

                      <SummaryRow
                        label="Status"
                        value={
                          <span
                            className={`px-2 py-0.5 rounded font-medium ${
                              product.stock > 0
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-red-50 text-red-600'
                            }`}
                          >
                            {product.stock > 0
                              ? 'In Stock'
                              : 'Out of Stock'}
                          </span>
                        }
                      />

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
                        label="Min. Order Qty"
                        value="1 Bag"
                      />

                      <SummaryRow
                        label="Added On"
                        value={
                          product.createdAt ||
                          '15 Jan 2024'
                        }
                      />

                      <SummaryRow
                        label="Last Updated"
                        value="01 Aug 2024"
                      />

                    </div>

                  </div>

                  {/* Pricing Information */}

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 text-xs">

                    <h3 className="font-bold text-gray-900 text-base">
                      Pricing Information
                    </h3>

                    <div className="space-y-3 pb-3 border-b border-gray-100">

                      <SummaryRow
                        label="Base Price"
                        value={`₹${product.price}`}
                      />

                      <SummaryRow
                        label="Delivery Charge"
                        value={`₹${product.deliveryCharge}`}
                      />

                    </div>

                    <div className="flex justify-between items-center font-bold text-sm text-gray-900 pt-1">

                      <span>Total Price</span>

                      <span className="text-orange-500 text-base">
                        ₹
                        {product.price +
                          product.deliveryCharge}
                      </span>

                    </div>

                    {/* Buy Now */}

                    <div className="pt-2">

                      <button
                        type="button"
                        onClick={handleBuyNow}
                        disabled={product.stock <= 0}
                        className={`w-full ${
                          product.stock > 0
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : 'bg-gray-400 cursor-not-allowed'
                        } text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all`}
                      >

                        <ShoppingBag size={18} />

                        {product.stock > 0
                          ? 'Buy Now'
                          : 'Out of Stock'}

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            )}

            {/* ==================================================
                SPECIFICATIONS TAB
            ================================================== */}

            {activeTab === 'Specifications' && (

              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">

                <h3 className="font-bold text-gray-900 text-base">
                  Technical Specifications
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">

                  {Object.entries(
                    product.specifications ||
                      defaultProduct.specifications ||
                      {}
                  ).map(([key, value]) => (

                    <div
                      key={key}
                      className="flex justify-between gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100"
                    >

                      <span className="text-gray-500">
                        {key}
                      </span>

                      <span className="font-semibold text-gray-900 text-right">
                        {value}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            )}

            {/* ==================================================
                SELLER INFORMATION
            ================================================== */}

            {activeTab === 'Seller Information' && (

              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">

                    <Store size={24} />

                  </div>

                  <div>

                    <h3 className="font-bold text-gray-900 text-base">
                      {product.seller}
                    </h3>

                    <p className="text-xs text-gray-500">
                      Verified Construction Supplier •{' '}
                      {product.location}
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">

                    <span className="text-gray-400 block">
                      Total Products
                    </span>

                    <span className="text-base font-bold text-gray-900">
                      142 Materials
                    </span>

                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">

                    <span className="text-gray-400 block">
                      Seller Rating
                    </span>

                    <span className="text-base font-bold text-emerald-600">
                      4.8 / 5.0 ⭐
                    </span>

                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">

                    <span className="text-gray-400 block">
                      Response Time
                    </span>

                    <span className="text-base font-bold text-gray-900">
                      &lt; 2 Hours
                    </span>

                  </div>

                </div>

              </div>

            )}

            {/* ==================================================
                REVIEWS TAB
            ================================================== */}

            {activeTab.startsWith('Reviews') && (

              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">

                <div className="flex items-center justify-between">

                  <h3 className="font-bold text-gray-900 text-base">
                    Customer Reviews
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      toast.success(
                        'Write review triggered'
                      )
                    }
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
                  >
                    Write a Review
                  </button>

                </div>

                <div className="space-y-4">

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
                        'Good strength and finish. Delivery charge was slightly high but overall satisfied.',
                    },
                  ].map((review, index) => (

                    <div
                      key={index}
                      className="border-b border-gray-100 pb-4 space-y-1 text-xs"
                    >

                      <div className="flex justify-between items-center">

                        <span className="font-bold text-gray-900">
                          {review.author}
                        </span>

                        <span className="text-gray-400">
                          {review.date}
                        </span>

                      </div>

                      <div className="flex items-center gap-1 text-amber-400">

                        {Array.from({
                          length: review.rating,
                        }).map((_, starIndex) => (

                          <Star
                            key={starIndex}
                            size={12}
                            className="fill-amber-400"
                          />

                        ))}

                      </div>

                      <p className="text-gray-600 pt-1">
                        {review.comment}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            )}

            {/* ==================================================
                ORDERS TAB
            ================================================== */}

            {activeTab.startsWith('Orders') && (

              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">

                <h3 className="font-bold text-gray-900 text-base">
                  Recent Product Orders
                </h3>

                <div className="overflow-x-auto">

                  <table className="w-full text-left text-xs text-gray-600">

                    <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">

                      <tr>

                        <th className="p-2.5">
                          Order ID
                        </th>

                        <th className="p-2.5">
                          Buyer
                        </th>

                        <th className="p-2.5">
                          Quantity
                        </th>

                        <th className="p-2.5">
                          Total Amount
                        </th>

                        <th className="p-2.5">
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-gray-100">

                      <tr>

                        <td className="p-2.5 font-medium text-gray-900">
                          #ORD-9921
                        </td>

                        <td className="p-2.5">
                          BuildCorp Industries
                        </td>

                        <td className="p-2.5">
                          150 Bags
                        </td>

                        <td className="p-2.5 font-bold text-gray-900">
                          ₹52,500
                        </td>

                        <td className="p-2.5">

                          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-medium">
                            Delivered
                          </span>

                        </td>

                      </tr>

                      <tr>

                        <td className="p-2.5 font-medium text-gray-900">
                          #ORD-9844
                        </td>

                        <td className="p-2.5">
                          Metro Infra Ltd
                        </td>

                        <td className="p-2.5">
                          500 Bags
                        </td>

                        <td className="p-2.5 font-bold text-gray-900">
                          ₹1,75,000
                        </td>

                        <td className="p-2.5">

                          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">
                            In Transit
                          </span>

                        </td>

                      </tr>

                    </tbody>

                  </table>

                </div>

              </div>

            )}

            {/* ==================================================
                PRICE HISTORY
            ================================================== */}

            {activeTab === 'Price History' && (

              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">

                <h3 className="font-bold text-gray-900 text-base">
                  Historical Price Trends
                </h3>

                <div className="space-y-3 text-xs">

                  {/* Current Price */}

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">

                    <div className="flex items-center gap-2">

                      <TrendingDown
                        className="text-emerald-500"
                        size={16}
                      />

                      <div>

                        <p className="font-bold text-gray-900">
                          ₹350 (Current Best Price)
                        </p>

                        <p className="text-gray-400 text-[10px]">
                          Updated Aug 2024
                        </p>

                      </div>

                    </div>

                    <span className="text-emerald-600 font-semibold">
                      - ₹20 reduction
                    </span>

                  </div>

                  {/* Previous Price */}

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">

                    <div className="flex items-center gap-2">

                      <TrendingUp
                        className="text-gray-400"
                        size={16}
                      />

                      <div>

                        <p className="font-bold text-gray-900">
                          ₹370
                        </p>

                        <p className="text-gray-400 text-[10px]">
                          June 2024
                        </p>

                      </div>

                    </div>

                    <span className="text-gray-500 font-medium">
                      Base rate
                    </span>

                  </div>

                </div>

              </div>

            )}

          </main>

        </div>

      </div>

      {/* ========================================================
          IMAGE PREVIEW MODAL
      ======================================================== */}

      {previewImage && (

        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >

          <div
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl flex flex-col relative"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">

              <h4 className="font-bold text-gray-900 text-sm">
                Image Preview
              </h4>

              <button
                type="button"
                onClick={() =>
                  setPreviewImage(null)
                }
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                title="Close"
              >
                <X size={20} />
              </button>

            </div>

            {/* Modal Body */}

            <div className="p-6 bg-gray-50 flex items-center justify-center max-h-[60vh]">

              <img
                src={previewImage}
                alt="Product Preview"
                className="max-h-[50vh] max-w-full object-contain rounded-lg"
              />

            </div>

            {/* Modal Footer */}

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">

              <button
                type="button"
                onClick={() =>
                  handleRemoveImage(previewImage)
                }
                className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-xs font-semibold transition"
              >
                <Trash2 size={16} />
                Remove Image
              </button>

              <button
                type="button"
                onClick={() =>
                  setPreviewImage(null)
                }
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-xl text-xs font-semibold transition"
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

/*
 * ==============================================================
 * FEATURE BADGE
 * ==============================================================
 */

const FeatureBadge = ({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) => (
  <div className="flex items-center gap-2 bg-orange-50/50 border border-orange-100 p-2.5 rounded-xl">
    {icon}

    <span className="text-xs font-semibold text-gray-800">
      {text}
    </span>
  </div>
);

/*
 * ==============================================================
 * SUMMARY ROW
 * ==============================================================
 */

const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) => (
  <div className="flex justify-between items-center gap-4">
    <span className="text-gray-400">
      {label}
    </span>

    <span className="font-semibold text-gray-800 text-right">
      {value}
    </span>
  </div>
);

/*
 * ==============================================================
 * MENU ICON
 * ==============================================================
 */

const MenuIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

export default ProductDetailsPage;