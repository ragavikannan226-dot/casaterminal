
// src/pages/ProductsPage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, SlidersHorizontal, X,
  Star, MapPin, Truck, Eye, GitCompare,
  Heart, TrendingUp, Zap, Package, 
  ChevronRight, ArrowUpDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ==================== TYPES ====================
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
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
}

// ==================== STORAGE KEYS ====================
const STORAGE_KEYS = {
  PRODUCTS: 'construction_products',
  WISHLIST: 'product_wishlist',
  SEARCH_HISTORY: 'product_search_history',
  COMPARE_LIST: 'compare_list'
};

// ==================== INITIAL MOCK DATA ====================
const initialProducts: Product[] = [
  {
    id: 'p1', name: 'UltraTech Cement (50kg)', brand: 'UltraTech', category: 'Cement',
    price: 350, originalPrice: 390, deliveryCharge: 50, seller: 'ABC Constructions', sellerId: 's1',
    rating: 4.5, reviewCount: 1250, location: 'Mumbai', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500',
    stock: 5000, isBestPrice: true, isRecommended: true, deliveryTimeMinDays: 2, createdAt: new Date().toISOString()
  },
  {
    id: 'p2', name: 'TATA TMT Steel Bars (12mm)', brand: 'TATA', category: 'Steel',
    price: 750, originalPrice: 820, deliveryCharge: 100, seller: 'XYZ Enterprises', sellerId: 's2',
    rating: 4.8, reviewCount: 850, location: 'Delhi', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
    stock: 2500, isBestPrice: false, isRecommended: true, deliveryTimeMinDays: 3, createdAt: new Date().toISOString()
  },
  {
    id: 'p3', name: 'Asian Paints Royale (20L)', brand: 'Asian Paints', category: 'Paint',
    price: 2200, originalPrice: 2500, deliveryCharge: 80, seller: 'PQR Builders', sellerId: 's3',
    rating: 4.3, reviewCount: 430, location: 'Bangalore', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
    stock: 0, isBestPrice: false, isRecommended: false, deliveryTimeMinDays: 4, createdAt: new Date().toISOString()
  },
  {
    id: 'p4', name: 'JCB 3DX Backhoe Loader', brand: 'JCB', category: 'Equipment',
    price: 8500, originalPrice: 9000, deliveryCharge: 1500, seller: 'JCB Rentals', sellerId: 's4',
    rating: 4.2, reviewCount: 12, location: 'Ahmedabad', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
    stock: 5, isBestPrice: true, isRecommended: false, deliveryTimeMinDays: 5, createdAt: new Date().toISOString()
  },
  {
    id: 'p5', name: 'Birla White Wall Putty (40kg)', brand: 'Birla', category: 'Paint',
    price: 450, originalPrice: 500, deliveryCharge: 30, seller: 'Singh Traders', sellerId: 's5',
    rating: 4.6, reviewCount: 320, location: 'Pune', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500',
    stock: 1200, isBestPrice: false, isRecommended: false, deliveryTimeMinDays: 2, createdAt: new Date().toISOString()
  }
];

// Helper to load products from localStorage or initial
const loadProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  return initialProducts;
};

// CATEGORY DEFINITIONS FOR TOP BAR
const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: '🏗️' },
  { id: 'Cement', name: 'Cement & Concrete', icon: '🧱' },
  { id: 'Steel', name: 'Steel & TMT', icon: '⚙️' },
  { id: 'Paint', name: 'Paints & Finishes', icon: '🎨' },
  { id: 'Equipment', name: 'Heavy Machinery', icon: '🚜' }
];

// ==================== CUSTOM HOOKS ====================
const useWishlist = () => {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const newList = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(newList));
      toast.success(prev.includes(id) ? 'Removed from wishlist' : 'Added to wishlist');
      return newList;
    });
  };

  return { wishlist, toggleWishlist };
};

const useCompare = () => {
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPARE_LIST);
    return saved ? JSON.parse(saved) : [];
  });

  const addToCompare = (id: string) => {
    if (compareIds.includes(id)) {
      toast.error('Already in compare list');
      return;
    }
    if (compareIds.length >= 4) {
      toast.error('You can compare up to 4 products');
      return;
    }
    setCompareIds(prev => [...prev, id]);
    toast.success('Added to compare');
  };

  const removeFromCompare = (id: string) => {
    setCompareIds(prev => prev.filter(i => i !== id));
  };

  return { compareIds, addToCompare, removeFromCompare };
};

const useSearchHistory = () => {
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  const addSearchTerm = (term: string) => {
    if (!term.trim()) return;
    setHistory(prev => {
      const filtered = prev.filter(t => t !== term);
      const newHistory = [term, ...filtered].slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  };

  return { history, addSearchTerm, clearHistory };
};

// ==================== PRODUCT CARD PROPS TYPE ====================
interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onWishlist: () => void;
  onCompare: () => void;
  isCompared: boolean;
  onViewDetails: () => void;
}

const ProductCard = ({
  product,
  isWishlisted,
  onWishlist,
  onCompare,
  isCompared,
  onViewDetails
}: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between group min-w-0 h-full">
      <div>
        {/* Product Image & Badges */}
        <div className="relative h-40 sm:h-44 md:h-48 lg:h-44 xl:h-48 2xl:h-52 bg-gray-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.isBestPrice && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 uppercase">
                <Zap className="w-3 h-3" /> Best Price
              </span>
            )}
            {product.isRecommended && !product.isBestPrice && (
              <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 uppercase">
                <TrendingUp className="w-3 h-3" /> Top Rated
              </span>
            )}
          </div>

          {/* Action Overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
            <button
              onClick={onWishlist}
              className="p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow backdrop-blur-sm transition"
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={onCompare}
              className={`p-1.5 rounded-full bg-white/80 hover:bg-white shadow backdrop-blur-sm transition ${isCompared ? 'text-amber-700 font-bold' : 'text-gray-600'}`}
              title="Compare"
            >
              <GitCompare className="w-4 h-4" />
            </button>
          </div>

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-3.5 md:p-4">
          <div className="text-[11px] text-amber-800 uppercase font-semibold tracking-wider">
            {product.brand}
          </div>
          <h3 className="font-semibold text-gray-900 text-sm sm:text-[15px] line-clamp-2 mt-0.5 group-hover:text-amber-900 transition-colors">
            {product.name}
          </h3>

          {/* Rating Badge */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="bg-emerald-700 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              {product.rating} <Star className="w-3 h-3 fill-white" />
            </span>
            <span className="text-xs text-gray-500 font-medium">({product.reviewCount})</span>
          </div>

          {/* Price Block */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <div className="text-xs text-gray-500 mt-0.5">
            + ₹{product.deliveryCharge} delivery charge
          </div>

          {/* Shipping Details */}
          <div className="mt-3 pt-2 border-t border-gray-100 flex flex-col gap-1 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-gray-400" />
              <span>Ships in <strong>{product.deliveryTimeMinDays} days</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span className="truncate">{product.location} • {product.seller}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Button Action */}
      <div className="p-3 sm:p-3.5 md:p-4 pt-0 sm:pt-0 md:pt-0">
        <button
          onClick={onViewDetails}
          className="w-full bg-[#523519] hover:bg-[#3d2414] text-white py-2 rounded text-xs font-semibold transition flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" /> View Product
        </button>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const { history, addSearchTerm, clearHistory } = useSearchHistory();
  const { wishlist, toggleWishlist } = useWishlist();
  const { compareIds, addToCompare, removeFromCompare } = useCompare();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [maxDeliveryDays, setMaxDeliveryDays] = useState<number | null>(null);
  const [availability, setAvailability] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'fastDelivery' | 'popular' | 'recommended'>('recommended');

  // UI states
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [hasMore, setHasMore] = useState(true);

  // Load products (with auto-sync)
  useEffect(() => {
    const load = () => {
      const allProducts = loadProducts();
      setProducts(allProducts);
      setLoading(false);
    };
    load();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.PRODUCTS) load();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Apply filters & sorting
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term));
    }

    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    if (selectedBrands.length) filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    if (selectedLocation) filtered = filtered.filter(p => p.location === selectedLocation);
    if (maxDeliveryDays) filtered = filtered.filter(p => (p.deliveryTimeMinDays || 999) <= maxDeliveryDays);

    if (availability === 'inStock') filtered = filtered.filter(p => p.stock > 0);
    if (availability === 'outOfStock') filtered = filtered.filter(p => p.stock === 0);

    switch (sortBy) {
      case 'price_asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price_desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'fastDelivery': filtered.sort((a, b) => (a.deliveryTimeMinDays || 999) - (b.deliveryTimeMinDays || 999)); break;
      case 'popular': filtered.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case 'recommended': filtered.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0)); break;
      default: break;
    }

    setFilteredProducts(filtered);
    setVisibleCount(12);
    setHasMore(filtered.length > 12);
  }, [products, selectedCategory, searchTerm, priceRange, selectedBrands, selectedLocation, maxDeliveryDays, availability, sortBy]);

  const loadMore = () => {
    setVisibleCount(prev => prev + 12);
    if (visibleCount + 12 >= filteredProducts.length) setHasMore(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) addSearchTerm(searchTerm);
    setShowSearchSuggestions(false);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 10000 });
    setSelectedBrands([]);
    setSelectedLocation('');
    setMaxDeliveryDays(null);
    setAvailability('all');
    setSortBy('recommended');
    setSearchTerm('');
  };

  const brands = [...new Set(products.map(p => p.brand))];
  const locations = [...new Set(products.map(p => p.location))];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-100 font-sans text-gray-800">
      
     {/* 1. TOP E-COMMERCE NAVBAR */}
<header className="bg-[#523519] text-white sticky top-0 z-40 shadow-md">
  <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 lg:gap-4">
    
    {/* Combined Logo & Brand */}
    {/* <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
      <div className="w-9 h-9 rounded bg-[#3d2414] border border-[#6d4926] flex items-center justify-center font-bold text-amber-100 text-sm shadow-sm">
        CT
      </div>
      <div>
        <span className="font-extrabold text-base tracking-tight text-amber-50 leading-none block">
          CASA TERMINAL
        </span>
        <span className="text-[10px] text-amber-200 tracking-wider font-semibold">
          MARKETPLACE
        </span>
      </div>
    </div> */}

    {/* Search Box */}
    <div className="w-full sm:flex-1 sm:max-w-2xl relative order-1 sm:order-none">
      <form onSubmit={handleSearch} className="flex w-full">
        <input
          type="text"
          placeholder="Search materials, brands, equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSearchSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
          className="w-full min-w-0 px-3 sm:px-4 py-2.5 sm:py-2 rounded-l-md text-xs sm:text-sm text-gray-900 bg-white focus:outline-none"
        />
        <button type="submit" className="bg-[#3d2414] hover:bg-[#2b190c] px-4 sm:px-5 rounded-r-md flex items-center justify-center text-amber-100 transition shrink-0">
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSearchSuggestions && history.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }} 
            className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-xl border border-gray-200 text-gray-800"
          >
            <div className="p-2">
              <div className="flex justify-between items-center px-2 py-1 border-b text-xs font-semibold text-gray-500">
                <span>Recent Searches</span>
                <button onClick={clearHistory} className="text-red-600 hover:underline">Clear</button>
              </div>
              {history.map(term => (
                <button
                  key={term}
                  onClick={() => { setSearchTerm(term); addSearchTerm(term); setShowSearchSuggestions(false); }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  </div>

  {/* 2. HORIZONTAL CATEGORY BAR */}
  <div className="bg-[#3d2414] border-t border-[#6d4926]/40 overflow-x-auto scrollbar-none">
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex items-center gap-1 py-1.5 text-[10px] sm:text-xs font-medium text-amber-100 whitespace-nowrap overflow-x-auto scrollbar-none">
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => setSelectedCategory(cat.id)}
          className={`px-3 sm:px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition shrink-0 ${selectedCategory === cat.id ? 'bg-[#523519] text-white font-bold shadow-inner' : 'hover:bg-[#523519]/50'}`}
        >
          <span>{cat.icon}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  </div>
</header>

      {/* Breadcrumb Area */}
      <div className="bg-white border-b border-gray-200 text-xs text-gray-500">
        <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 flex items-center gap-1 min-w-0">
          <span className="cursor-pointer hover:underline" onClick={() => navigate('/')}>Home</span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-semibold text-gray-800">Construction Store</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 xl:gap-6 items-stretch">

          {/* LEFT SIDEBAR: DESKTOP FILTERS */}
          <aside className="hidden lg:block w-60 xl:w-64 2xl:w-72 flex-shrink-0 bg-white rounded-lg border border-gray-200 p-4 h-fit sticky top-28 space-y-5 text-xs">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </h3>
              <button onClick={clearFilters} className="text-amber-800 font-semibold hover:underline">
                Reset All
              </button>
            </div>

            {/* Price Range */}
            <div>
              <label className="font-bold text-gray-800 mb-2 block">Price Range (₹)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={e => setPriceRange({ ...priceRange, min: +e.target.value })}
                  className="w-1/2 p-1.5 border border-gray-300 rounded focus:outline-none focus:border-[#523519]"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={e => setPriceRange({ ...priceRange, max: +e.target.value })}
                  className="w-1/2 p-1.5 border border-gray-300 rounded focus:outline-none focus:border-[#523519]"
                />
              </div>
            </div>

            {/* Brands */}
            <div>
              <label className="font-bold text-gray-800 mb-2 block">Brand</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={e => setSelectedBrands(e.target.checked ? [...selectedBrands, brand] : selectedBrands.filter(b => b !== brand))}
                      className="rounded border-gray-300 accent-[#523519]"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="font-bold text-gray-800 mb-2 block">Location</label>
              <select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#523519]"
              >
                <option value="">All Locations</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            {/* Delivery Speed */}
            <div>
              <label className="font-bold text-gray-800 mb-2 block">Delivery Days</label>
              <select
                value={maxDeliveryDays || ''}
                onChange={e => setMaxDeliveryDays(e.target.value ? +e.target.value : null)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#523519]"
              >
                <option value="">Any Time</option>
                <option value="2">Within 2 Days</option>
                <option value="5">Within 5 Days</option>
                <option value="7">Within 7 Days</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="font-bold text-gray-800 mb-2 block">Availability</label>
              <div className="flex flex-col gap-1.5">
                {(['all', 'inStock', 'outOfStock'] as const).map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === opt}
                      onChange={() => setAvailability(opt)}
                      className="accent-[#523519]"
                    />
                    <span className="capitalize">{opt === 'all' ? 'All Items' : opt === 'inStock' ? 'In Stock Only' : 'Out of Stock'}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: PRODUCT GRID & CONTROL BAR */}
          <main className="flex-1 min-w-0 w-full">
            
            {/* Top Toolbar */}
            <div className="bg-white p-3 sm:p-3.5 rounded-lg border border-gray-200 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-gray-600 font-medium">
                Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> materials
              </div>

              <div className="w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-end gap-2">
                <span className="text-gray-500 font-medium flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto max-w-full p-2 border border-gray-300 rounded bg-white font-semibold text-gray-800 focus:outline-none text-xs"
                >
                  <option value="recommended">Featured / Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="fastDelivery">Fastest Delivery</option>
                  <option value="popular">Most Popular</option>
                </select>

                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-1 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded font-semibold text-gray-700"
                >
                  <Filter className="w-3.5 h-3.5" /> Filter
                </button>
              </div>
            </div>

            {/* Product Grid State Handling */}
            {loading ? (
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-72 sm:h-80 bg-gray-200 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-10 lg:p-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800">No matching products found</h3>
                <p className="text-xs text-gray-500 mt-1">Try adjusting your active search terms or category filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-[#523519] text-white rounded text-xs font-semibold hover:bg-[#3d2414] transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                  {filteredProducts.slice(0, visibleCount).map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlist.includes(product.id)}
                      onWishlist={() => toggleWishlist(product.id)}
                      onCompare={() => compareIds.includes(product.id) ? removeFromCompare(product.id) : addToCompare(product.id)}
                      isCompared={compareIds.includes(product.id)}
                      onViewDetails={() => navigate(`/product/${product.id}`)}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMore}
                      className="px-6 py-2.5 bg-white border border-gray-300 text-gray-800 text-xs font-bold rounded shadow-sm hover:bg-gray-50 transition"
                    >
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER MODAL / DRAWER */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-80 max-w-full bg-white z-50 overflow-y-auto p-4 sm:p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center pb-3 border-b mb-4">
                  <h3 className="font-bold text-sm text-gray-900">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4 text-xs pb-4">
                  <div>
                    <label className="font-bold text-gray-800 block mb-1">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">Price Range (₹)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={e => setPriceRange({ ...priceRange, min: +e.target.value })}
                        className="w-1/2 p-2 border rounded"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={e => setPriceRange({ ...priceRange, max: +e.target.value })}
                        className="w-1/2 p-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">Brand</label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {brands.map(b => (
                        <label key={b} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(b)}
                            onChange={e => setSelectedBrands(e.target.checked ? [...selectedBrands, b] : selectedBrands.filter(brand => brand !== b))}
                            className="accent-[#523519]"
                          />
                          <span>{b}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t mt-4 flex gap-2">
                <button
                  onClick={clearFilters}
                  className="w-1/2 py-2 border border-gray-300 rounded font-semibold text-gray-700 text-xs"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-1/2 py-2 bg-[#523519] text-white rounded font-semibold text-xs"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductsPage;