import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import {
  CalendarDays,
  CheckCircle,
  ChevronDown,
  Clock,
  Heart,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  User,
  Users,
  X,
} from 'lucide-react';

import { toast } from 'react-hot-toast';

/* ============================================================
   RENTAL TYPES
============================================================ */

export interface RentalPrice {
  daily: number;
  weekly?: number;
  monthly?: number;
}

export interface RentalProvider {
  id: string;
  name: string;
  verified: boolean;
  rating: number;
  responseTime: string;
}

export interface RentalItem {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  image: string;
  images: string[];
  location: string;
  stock: number;
  rating: number;
  reviewCount: number;
  price: RentalPrice;
  provider: RentalProvider;
  deliveryAvailable: boolean;
  operatorAvailable: boolean;
  outOfStock?: boolean;
}

/* ============================================================
   RENTAL DATA
============================================================ */

const rentalItems: RentalItem[] = [
  {
    id: 1,
    name: 'JCB 3DX Backhoe Loader',
    category: 'Heavy Equipment',
    subcategory: 'Backhoe Loader',
    description:
      'Reliable JCB backhoe loader suitable for excavation, loading, trenching and construction site work.',
    image:
      'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800',
    images: [
      'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    ],
    location: 'Chennai',
    stock: 4,
    rating: 4.7,
    reviewCount: 128,
    price: {
      daily: 5000,
      weekly: 30000,
      monthly: 95000,
    },
    provider: {
      id: 'rp1',
      name: 'Sri Construction Equipment',
      verified: true,
      rating: 4.8,
      responseTime: '< 1 Hour',
    },
    deliveryAvailable: true,
    operatorAvailable: true,
  },

  {
    id: 2,
    name: 'Tata Hitachi Excavator',
    category: 'Heavy Equipment',
    subcategory: 'Excavator',
    description:
      'Powerful hydraulic excavator designed for digging, earthmoving and large construction projects.',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    ],
    location: 'Bangalore',
    stock: 3,
    rating: 4.6,
    reviewCount: 96,
    price: {
      daily: 7500,
      weekly: 45000,
      monthly: 135000,
    },
    provider: {
      id: 'rp2',
      name: 'BuildMax Rentals',
      verified: true,
      rating: 4.7,
      responseTime: '< 2 Hours',
    },
    deliveryAvailable: true,
    operatorAvailable: true,
  },

  {
    id: 3,
    name: 'Tower Crane 10 Ton',
    category: 'Lifting Equipment',
    subcategory: 'Tower Crane',
    description:
      'Heavy-duty tower crane suitable for high-rise construction and material lifting applications.',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
    images: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
    ],
    location: 'Mumbai',
    stock: 2,
    rating: 4.5,
    reviewCount: 72,
    price: {
      daily: 12000,
      weekly: 70000,
      monthly: 210000,
    },
    provider: {
      id: 'rp3',
      name: 'Metro Equipment Rentals',
      verified: true,
      rating: 4.6,
      responseTime: '< 3 Hours',
    },
    deliveryAvailable: true,
    operatorAvailable: true,
  },

  {
    id: 4,
    name: 'Concrete Mixer Machine',
    category: 'Concrete Equipment',
    subcategory: 'Concrete Mixer',
    description:
      'Portable concrete mixer suitable for residential and commercial construction projects.',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    ],
    location: 'Delhi',
    stock: 8,
    rating: 4.4,
    reviewCount: 84,
    price: {
      daily: 1800,
      weekly: 10000,
      monthly: 28000,
    },
    provider: {
      id: 'rp4',
      name: 'Capital Construction Rentals',
      verified: true,
      rating: 4.5,
      responseTime: '< 2 Hours',
    },
    deliveryAvailable: true,
    operatorAvailable: false,
  },

  {
    id: 5,
    name: 'Scaffolding Set',
    category: 'Site Equipment',
    subcategory: 'Scaffolding',
    description:
      'Strong modular scaffolding system for construction, painting and maintenance work.',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
    images: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
    ],
    location: 'Hyderabad',
    stock: 20,
    rating: 4.3,
    reviewCount: 61,
    price: {
      daily: 800,
      weekly: 4500,
      monthly: 12000,
    },
    provider: {
      id: 'rp5',
      name: 'SafeSite Rentals',
      verified: true,
      rating: 4.4,
      responseTime: '< 2 Hours',
    },
    deliveryAvailable: true,
    operatorAvailable: false,
  },

  {
    id: 6,
    name: 'Industrial Generator 50 KVA',
    category: 'Power Equipment',
    subcategory: 'Generator',
    description:
      'Industrial diesel generator providing reliable temporary power for construction sites.',
    image:
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
    images: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
    ],
    location: 'Pune',
    stock: 5,
    rating: 4.6,
    reviewCount: 112,
    price: {
      daily: 2500,
      weekly: 14000,
      monthly: 40000,
    },
    provider: {
      id: 'rp6',
      name: 'PowerRent India',
      verified: true,
      rating: 4.7,
      responseTime: '< 1 Hour',
    },
    deliveryAvailable: true,
    operatorAvailable: false,
  },

  {
    id: 7,
    name: 'Road Roller Machine',
    category: 'Road Equipment',
    subcategory: 'Road Roller',
    description:
      'Heavy road roller for soil compaction, asphalt compaction and road construction.',
    image:
      'https://images.unsplash.com/photo-1590644365607-1c5a0e5c6f72?w=800',
    images: [
      'https://images.unsplash.com/photo-1590644365607-1c5a0e5c6f72?w=800',
    ],
    location: 'Coimbatore',
    stock: 2,
    rating: 4.5,
    reviewCount: 47,
    price: {
      daily: 4500,
      weekly: 26000,
      monthly: 75000,
    },
    provider: {
      id: 'rp7',
      name: 'South India Machinery',
      verified: true,
      rating: 4.6,
      responseTime: '< 2 Hours',
    },
    deliveryAvailable: true,
    operatorAvailable: true,
  },

  {
    id: 8,
    name: 'Power Trowel',
    category: 'Concrete Equipment',
    subcategory: 'Power Trowel',
    description:
      'Professional power trowel for achieving smooth and durable concrete floor finishes.',
    image:
      'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800',
    images: [
      'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800',
    ],
    location: 'Kochi',
    stock: 6,
    rating: 4.2,
    reviewCount: 38,
    price: {
      daily: 1600,
      weekly: 9000,
      monthly: 25000,
    },
    provider: {
      id: 'rp8',
      name: 'Kerala Tool Rentals',
      verified: true,
      rating: 4.3,
      responseTime: '< 3 Hours',
    },
    deliveryAvailable: true,
    operatorAvailable: false,
  },
];



/* ============================================================
   RENTAL LISTING PAGE
============================================================ */

const RentalListing = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const [sortOption, setSortOption] =
    useState('relevance');

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [selectedRental, setSelectedRental] =
    useState<RentalItem | null>(null);

  const [wishlist, setWishlist] =
    useState<number[]>([]);

  /* RENTAL FORM */

  const [rentalDays, setRentalDays] =
    useState(1);

  const [rentalQuantity, setRentalQuantity] =
    useState(1);

  const [rentalStartDate, setRentalStartDate] =
    useState('');

  const [deliveryOption, setDeliveryOption] =
    useState('Pickup');

  const [customerName, setCustomerName] =
    useState('');

  const [customerPhone, setCustomerPhone] =
    useState('');

  const [specialInstructions, setSpecialInstructions] =
    useState('');

  /* ============================================================
     FILTER
  ============================================================ */

  const filteredRentals = useMemo(() => {
    let result = [...rentalItems];

    if (selectedCategory !== 'All') {
      result = result.filter(
        (item) =>
          item.category === selectedCategory
      );
    }

    if (searchText.trim()) {
      const search =
        searchText.toLowerCase();

      result = result.filter(
        (item) =>
          item.name
            .toLowerCase()
            .includes(search) ||
          item.category
            .toLowerCase()
            .includes(search) ||
          item.subcategory
            .toLowerCase()
            .includes(search) ||
          item.location
            .toLowerCase()
            .includes(search) ||
          item.provider.name
            .toLowerCase()
            .includes(search)
      );
    }

    if (sortOption === 'price-low') {
      result.sort(
        (a, b) =>
          a.price.daily -
          b.price.daily
      );
    }

    if (sortOption === 'price-high') {
      result.sort(
        (a, b) =>
          b.price.daily -
          a.price.daily
      );
    }

    if (sortOption === 'rating') {
      result.sort(
        (a, b) =>
          b.rating - a.rating
      );
    }

    return result;
  }, [
    searchText,
    selectedCategory,
    sortOption,
  ]);

  /* ============================================================
     OPEN RENTAL POPUP
  ============================================================ */

  const handleRentNow = (
    rental: RentalItem
  ) => {
    if (
      rental.outOfStock ||
      rental.stock <= 0
    ) {
      toast.error(
        'This equipment is currently unavailable'
      );

      return;
    }

    setSelectedRental(rental);

    setRentalDays(1);
    setRentalQuantity(1);
    setDeliveryOption('Pickup');
    setCustomerName('');
    setCustomerPhone('');
    setSpecialInstructions('');

    const today =
      new Date()
        .toISOString()
        .split('T')[0];

    setRentalStartDate(today);
  };

  /* ============================================================
     WISHLIST
  ============================================================ */

  const handleWishlist = (
    id: number
  ) => {
    setWishlist((current) => {
      if (current.includes(id)) {
        toast.success(
          'Removed from wishlist'
        );

        return current.filter(
          (item) => item !== id
        );
      }

      toast.success(
        'Added to wishlist'
      );

      return [...current, id];
    });
  };

  /* ============================================================
     CONFIRM RENTAL
  ============================================================ */

  const handleConfirmRental = () => {
    if (!selectedRental) {
      return;
    }

    if (!customerName.trim()) {
      toast.error(
        'Please enter customer name'
      );

      return;
    }

    if (!customerPhone.trim()) {
      toast.error(
        'Please enter phone number'
      );

      return;
    }

    if (
      customerPhone.replace(
        /\D/g,
        ''
      ).length < 10
    ) {
      toast.error(
        'Please enter a valid phone number'
      );

      return;
    }

    if (!rentalStartDate) {
      toast.error(
        'Please select rental start date'
      );

      return;
    }

    const total =
      selectedRental.price.daily *
      rentalDays *
      rentalQuantity;

    toast.success(
      `Rental request submitted for ₹${total.toLocaleString()}`
    );

    setSelectedRental(null);
  };

  /* ============================================================
     TOTAL
  ============================================================ */

  const estimatedTotal =
    selectedRental
      ? selectedRental.price.daily *
        rentalDays *
        rentalQuantity
      : 0;

  /* ============================================================
     TODAY
  ============================================================ */

  const today = new Date()
    .toISOString()
    .split('T')[0];

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-gray-800">

      {/* ======================================================
          MOBILE MENU
      ====================================================== */}

      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setMobileMenu(false)
              }
              className="fixed inset-0 z-50 bg-black/50 xl:hidden"
            />

            <motion.div
              initial={{
                x: '-100%',
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: '-100%',
              }}
              className="fixed left-0 top-0 bottom-0 z-[51] w-[min(20rem,88vw)] bg-white shadow-xl xl:hidden overflow-y-auto"
            >

              <div className="bg-[#3F2413] text-white p-5 flex justify-between items-center">

                <div>
                  <p className="text-xs text-white/60">
                    BuildMart
                  </p>

                  <h2 className="font-bold text-lg">
                    Rental Categories
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobileMenu(false)
                  }
                  className="p-2 rounded-full hover:bg-white/10"
                >
                  <X size={22} />
                </button>

              </div>


            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="w-full max-w-[1920px] mx-auto px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-4 sm:py-6 lg:py-8">

        {/* BREADCRUMB */}

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="hover:text-[#5A2E12]"
          >
            Home
          </button>

          <span>/</span>

          <span className="font-semibold text-[#5A2E12]">
            Rentals
          </span>

          {selectedCategory !==
            'All' && (
            <>
              <span>/</span>

              <span>
                {selectedCategory}
              </span>
            </>
          )}

        </div>

        {/* PAGE TITLE */}

        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 mb-5 sm:mb-6 lg:mb-8">

          <div>

            <p className="text-sm font-semibold text-[#8A542B]">
              Construction Equipment Rental
            </p>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black text-gray-900 mt-1 leading-tight">
              Rent Construction Equipment
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Find reliable equipment from
              verified rental providers.
            </p>

          </div>

          {/* SORT */}

          <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-2 sm:gap-3 w-full xl:w-auto">

            <span className="text-sm text-gray-500">
              {filteredRentals.length}{' '}
              equipment
            </span>

            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(
                  event.target.value
                )
              }
              className="w-full min-[420px]:w-auto border border-gray-300 bg-white rounded-lg px-3 sm:px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#5A2E12]"
            >
              <option value="relevance">
                Sort: Relevance
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="rating">
                Customer Rating
              </option>
            </select>

          </div>

        </div>

        {/* RESPONSIVE SEARCH + MOBILE MENU */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 mb-4 sm:mb-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search equipment, category, location or provider..."
              className="w-full h-11 sm:h-12 bg-white border border-gray-200 rounded-xl pl-10 pr-10 text-sm outline-none focus:border-[#5A2E12] focus:ring-2 focus:ring-[#5A2E12]/10"
            />
            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenu(true)}
            className="xl:hidden h-11 sm:h-12 px-4 rounded-xl bg-[#5A2E12] text-white text-sm font-bold flex items-center justify-center gap-2"
          >
            <Menu size={18} />
            Categories
          </button>
        </div>

      

        {/* ====================================================
            RENTAL CARDS
        ==================================================== */}

        {filteredRentals.length ===
        0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">

            <Search
              size={42}
              className="mx-auto text-gray-300"
            />

            <h3 className="font-bold text-lg mt-4">
              No rental equipment found
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Try another search or
              category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchText('');
                setSelectedCategory(
                  'All'
                );
              }}
              className="mt-5 bg-[#5A2E12] text-white px-5 py-2.5 rounded-lg text-sm font-bold"
            >
              Clear Filters
            </button>

          </div>
        ) : (
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">

            {filteredRentals.map(
              (rental) => (
                <RentalCard
                  key={rental.id}
                  rental={rental}
                  isWishlisted={wishlist.includes(
                    rental.id
                  )}
                  onWishlist={() =>
                    handleWishlist(
                      rental.id
                    )
                  }
                  onViewDetails={() =>
                    navigate(
                      `/rental/${rental.id}`
                    )
                  }
                  onRentNow={() =>
                    handleRentNow(
                      rental
                    )
                  }
                />
              )
            )}

          </div>
        )}

      </main>

      {/* ======================================================
          RENT NOW MODAL
      ====================================================== */}

      <AnimatePresence>
        {selectedRental && (
          <>
            {/* BACKDROP */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setSelectedRental(
                  null
                )
              }
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />

            {/* MODAL */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              transition={{
                duration: 0.2,
              }}
              className="fixed inset-0 z-[101] flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
            >

              <div
                onClick={(event) =>
                  event.stopPropagation()
                }
                className="bg-white w-full max-w-3xl max-h-[96vh] sm:max-h-[92vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl my-1 sm:my-4"
              >

                {/* MODAL HEADER */}

                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 sm:px-6 py-4 flex items-center justify-between">

                  <div>
                    <p className="text-xs font-bold text-[#8A542B] uppercase tracking-wide">
                      Rental Booking
                    </p>

                    <h2 className="text-xl font-black text-gray-900">
                      Rent Now
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedRental(
                        null
                      )
                    }
                    className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>

                </div>

                <div className="p-3 sm:p-5 lg:p-6">

                  {/* RENTAL SUMMARY */}

                  <div className="bg-[#F5F3EF] border border-[#E8D5B5] rounded-xl p-4 mb-6">

                    <div className="flex flex-col min-[420px]:flex-row gap-3 sm:gap-4">

                      <img
                        src={
                          selectedRental
                            .image
                        }
                        alt={
                          selectedRental
                            .name
                        }
                        className="w-full min-[420px]:w-24 sm:w-28 h-40 min-[420px]:h-24 sm:h-28 rounded-lg object-cover bg-white shrink-0"
                      />

                      <div className="flex-1 min-w-0">

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                          <div>

                            <p className="text-xs text-[#8A542B] font-semibold">
                              {
                                selectedRental
                                  .category
                              }
                            </p>

                            <h3 className="font-bold text-lg text-gray-900">
                              {
                                selectedRental
                                  .name
                              }
                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                              {
                                selectedRental
                                  .subcategory
                              }
                            </p>

                          </div>

                          {selectedRental
                            .provider
                            .verified && (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold w-fit">
                              <CheckCircle
                                size={12}
                              />
                              Verified
                            </span>
                          )}

                        </div>

                        <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600">

                          <span className="flex items-center gap-1">
                            <MapPin
                              size={13}
                            />
                            {
                              selectedRental.location
                            }
                          </span>

                          <span className="flex items-center gap-1">
                            <Star
                              size={13}
                              className="fill-[#E8B34B] text-[#E8B34B]"
                            />
                            {
                              selectedRental.rating
                            }
                          </span>

                          <span>
                            {
                              selectedRental
                                .provider
                                .name
                            }
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* CUSTOMER FORM */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                    {/* NAME */}

                    <FormField label="Customer Name">

                      <div className="relative">

                        <User
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="text"
                          value={
                            customerName
                          }
                          onChange={(event) =>
                            setCustomerName(
                              event.target
                                .value
                            )
                          }
                          placeholder="Enter your name"
                          className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-[#5A2E12]"
                        />

                      </div>

                    </FormField>

                    {/* PHONE */}

                    <FormField label="Phone Number">

                      <div className="relative">

                        <Phone
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="tel"
                          value={
                            customerPhone
                          }
                          onChange={(event) =>
                            setCustomerPhone(
                              event.target
                                .value
                            )
                          }
                          placeholder="Enter phone number"
                          className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-[#5A2E12]"
                        />

                      </div>

                    </FormField>

                    {/* START DATE */}

                    <FormField label="Rental Start Date">

                      <div className="relative">

                        <CalendarDays
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="date"
                          value={
                            rentalStartDate
                          }
                          min={today}
                          onChange={(event) =>
                            setRentalStartDate(
                              event.target
                                .value
                            )
                          }
                          className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-[#5A2E12]"
                        />

                      </div>

                    </FormField>

                    {/* DURATION */}

                    <FormField label="Rental Duration">

                      <div className="relative">

                        <Clock
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />

                        <select
                          value={
                            rentalDays
                          }
                          onChange={(event) =>
                            setRentalDays(
                              Number(
                                event.target
                                  .value
                              )
                            )
                          }
                          className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm outline-none appearance-none focus:border-[#5A2E12]"
                        >
                          <option value={1}>
                            1 Day
                          </option>

                          <option value={2}>
                            2 Days
                          </option>

                          <option value={3}>
                            3 Days
                          </option>

                          <option value={5}>
                            5 Days
                          </option>

                          <option value={7}>
                            1 Week
                          </option>

                          <option value={15}>
                            15 Days
                          </option>

                          <option value={30}>
                            1 Month
                          </option>
                        </select>

                        <ChevronDown
                          size={15}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                        />

                      </div>

                    </FormField>

                    {/* QUANTITY */}

                    <FormField label="Quantity">

                      <div className="relative">

                        <Users
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <select
                          value={
                            rentalQuantity
                          }
                          onChange={(event) =>
                            setRentalQuantity(
                              Number(
                                event.target
                                  .value
                              )
                            )
                          }
                          className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm outline-none appearance-none focus:border-[#5A2E12]"
                        >
                          {Array.from(
                            {
                              length:
                                Math.min(
                                  selectedRental.stock,
                                  10
                                ),
                            },
                            (
                              _,
                              index
                            ) => (
                              <option
                                key={
                                  index +
                                  1
                                }
                                value={
                                  index +
                                  1
                                }
                              >
                                {index + 1}
                              </option>
                            )
                          )}
                        </select>

                        <ChevronDown
                          size={15}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                        />

                      </div>

                    </FormField>

                    {/* DELIVERY */}

                    <FormField label="Delivery Option">

                      <div className="relative">

                        <Truck
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <select
                          value={
                            deliveryOption
                          }
                          onChange={(event) =>
                            setDeliveryOption(
                              event.target
                                .value
                            )
                          }
                          className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm outline-none appearance-none focus:border-[#5A2E12]"
                        >
                          <option value="Pickup">
                            Pickup from Provider
                          </option>

                          {selectedRental.deliveryAvailable && (
                            <option value="Delivery">
                              Delivery to Site
                            </option>
                          )}

                          {selectedRental
                            .operatorAvailable && (
                            <option value="Delivery + Operator">
                              Delivery + Operator
                            </option>
                          )}
                        </select>

                        <ChevronDown
                          size={15}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                        />

                      </div>

                    </FormField>

                  </div>

                  {/* SPECIAL INSTRUCTIONS */}

                  <div className="mt-5">

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Instructions
                    </label>

                    <textarea
                      value={
                        specialInstructions
                      }
                      onChange={(event) =>
                        setSpecialInstructions(
                          event.target
                            .value
                        )
                      }
                      rows={3}
                      placeholder="Enter site location, delivery instructions, operator requirements..."
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-[#5A2E12]"
                    />

                  </div>

                  {/* PRICE SUMMARY */}

                  <div className="mt-6 bg-[#FDF9F3] border border-[#E8D5B5] rounded-xl p-5">

                    <div className="flex items-center justify-between mb-4">

                      <h3 className="font-bold text-gray-900">
                        Rental Summary
                      </h3>

                      <ShieldCheck
                        size={20}
                        className="text-[#5A2E12]"
                      />

                    </div>

                    <div className="space-y-3 text-sm">

                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Daily rental
                        </span>

                        <span className="font-semibold">
                          ₹
                          {selectedRental.price.daily.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Duration
                        </span>

                        <span className="font-semibold">
                          {rentalDays}{' '}
                          {rentalDays ===
                          1
                            ? 'Day'
                            : 'Days'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Quantity
                        </span>

                        <span className="font-semibold">
                          {rentalQuantity}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Delivery
                        </span>

                        <span className="font-semibold">
                          {
                            deliveryOption
                          }
                        </span>
                      </div>

                      <div className="border-t border-[#E8D5B5] pt-4 mt-4 flex items-center justify-between">

                        <span className="font-bold text-gray-900">
                          Estimated Total
                        </span>

                        <span className="text-2xl font-black text-[#5A2E12]">
                          ₹
                          {estimatedTotal.toLocaleString()}
                        </span>

                      </div>

                    </div>

                    <p className="text-[11px] text-gray-500 mt-3">
                      Final amount may vary
                      based on delivery,
                      operator and site
                      requirements.
                    </p>

                  </div>

                  {/* BUTTONS */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 sm:mt-6">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRental(
                          null
                        )
                      }
                      className="flex-1 border border-gray-300 text-gray-700 py-3.5 rounded-lg font-bold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleConfirmRental
                      }
                      className="flex-1 bg-[#5A2E12] hover:bg-[#3F2413] text-white py-3.5 rounded-lg font-bold transition"
                    >
                      Confirm Rental
                    </button>

                  </div>

                </div>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

/* ============================================================
   FORM FIELD
============================================================ */

const FormField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div>

      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      {children}

    </div>
  );
};

/* ============================================================
   RENTAL CARD
============================================================ */

const RentalCard = ({
  rental,
  isWishlisted,
  onWishlist,
  onViewDetails,
  onRentNow,
}: {
  rental: RentalItem;
  isWishlisted: boolean;
  onWishlist: () => void;
  onViewDetails: () => void;
  onRentNow: () => void;
}) => {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >

      {/* IMAGE */}

      <div className="relative h-44 min-[480px]:h-48 sm:h-52 lg:h-56 2xl:h-60 bg-[#F8F5F0] flex items-center justify-center overflow-hidden">

        <img
          src={rental.image}
          alt={rental.name}
          className="w-full h-full object-cover"
        />

        {/* CATEGORY */}

        <span className="absolute top-3 left-3 bg-[#5A2E12] text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
          {rental.category}
        </span>

        {/* WISHLIST */}

        <button
          type="button"
          onClick={(
            event
          ) => {
            event.stopPropagation();
            onWishlist();
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center"
        >
          <Heart
            size={18}
            className={
              isWishlisted
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600'
            }
          />
        </button>

      </div>

      {/* CONTENT */}

      <div className="p-3 sm:p-4">

        {/* SUBCATEGORY */}

        <p className="text-xs font-semibold text-[#8A542B]">
          {rental.subcategory}
        </p>

        {/* NAME */}

        <h3 className="font-bold text-gray-900 text-sm sm:text-base mt-1 line-clamp-2 min-h-[40px] sm:min-h-[48px]">
          {rental.name}
        </h3>

        {/* RATING */}

        <div className="flex items-center gap-2 mt-2">

          <span className="flex items-center gap-1 bg-[#5A2E12] text-white text-[10px] px-2 py-1 rounded-md font-bold">
            {rental.rating}
            <Star
              size={9}
              className="fill-[#E8B34B] text-[#E8B34B]"
            />
          </span>

          <span className="text-xs text-gray-500">
            {rental.reviewCount}{' '}
            reviews
          </span>

        </div>

        {/* LOCATION */}

        <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">

          <MapPin size={13} />

          <span>
            {rental.location}
          </span>

        </div>

        {/* PROVIDER */}

        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">

          <CheckCircle
            size={13}
            className="text-green-600"
          />

          <span className="truncate">
            {rental.provider.name}
          </span>

        </div>

        {/* PRICE */}

        <div className="mt-4">

          <div className="flex items-baseline gap-1">

            <span className="text-xl sm:text-2xl font-black text-gray-900">
              ₹
              {rental.price.daily.toLocaleString()}
            </span>

            <span className="text-xs text-gray-500">
              / day
            </span>

          </div>

          {rental.price.weekly && (
            <p className="text-[11px] text-gray-500 mt-1">
              Weekly from ₹
              {rental.price.weekly.toLocaleString()}
            </p>
          )}

        </div>

        {/* AVAILABILITY */}

        <div className="mt-3 flex items-center gap-2">

          <span
            className={`w-2 h-2 rounded-full ${
              rental.stock > 0
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}
          />

          <span
            className={`text-xs font-semibold ${
              rental.stock > 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {rental.stock > 0
              ? `${rental.stock} available`
              : 'Currently unavailable'}
          </span>

        </div>

        {/* FEATURES */}

        <div className="flex flex-wrap gap-2 mt-3">

          {rental.deliveryAvailable && (
            <span className="text-[10px] bg-gray-100 px-2 py-1 rounded">
              Delivery
            </span>
          )}

          {rental.operatorAvailable && (
            <span className="text-[10px] bg-gray-100 px-2 py-1 rounded">
              Operator
            </span>
          )}

        </div>

        {/* ACTIONS */}

        <div className="grid grid-cols-2 gap-2 mt-4">

          <button
            type="button"
            onClick={onViewDetails}
            className="flex-1 border border-[#5A2E12] text-[#5A2E12] py-2.5 rounded-lg text-xs font-bold hover:bg-[#F5EBDD] transition"
          >
            View Details
          </button>

          <button
            type="button"
            onClick={onRentNow}
            disabled={
              rental.stock <= 0
            }
            className="flex-1 bg-[#5A2E12] hover:bg-[#3F2413] disabled:bg-gray-400 text-white py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
          >
            <ShoppingCart
              size={14}
            />

            Rent Now
          </button>

        </div>

      </div>

    </motion.div>
  );
};

export default RentalListing;