import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  SlidersHorizontal,
  X,
  Building2,
  Zap,
  Droplets,
  Paintbrush,
  HardHat,
  Navigation,
  Loader2,
  Heart,
  Briefcase,
  MessageSquare,
  ChevronDown,
  RotateCcw,
  Layers,
  Eye,
  Crown,
  Phone,
  Mail,
  CalendarDays,
  IndianRupee,
  Send,
  User,
  FileText,
  ShieldCheck,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

interface Contractor {
  id: number;
  name: string;
  title: string;
  company?: string;
  category: string;
  subcategory: string;
  rating: number;
  reviews: number;
  location: string;
  distance: number;
  experience: string;
  experienceYears: number;
  projects: number;
  verified: boolean;
  specialties: string[];
  image: string;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  availability: "available" | "busy" | "booked" | "away";
  completedProjects: number;
  responseTime: string;
  completionRate: number;
  languages: string[];
  certifications: string[];
  featured?: boolean;
}

interface Subcategory {
  id: string;
  name: string;
  count: number;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
  subcategories: Subcategory[];
}

interface Filters {
  rating: number;
  experience: number;
  distance: number;
  verified: boolean;
  priceMin: number;
  priceMax: number;
  availability: string[];
}

type SortOption =
  | "relevance"
  | "rating_desc"
  | "rating_asc"
  | "price_desc"
  | "price_asc"
  | "experience_desc"
  | "experience_asc"
  | "distance_asc";

/* ============================================================
   SERVICE CATEGORIES
============================================================ */

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "civil",
    name: "Civil",
    icon: Building2,
    count: 156,
    subcategories: [
      { id: "construction", name: "Construction", count: 78 },
      { id: "renovation", name: "Renovation", count: 45 },
      { id: "demolition", name: "Demolition", count: 23 },
      { id: "foundation", name: "Foundation", count: 10 },
    ],
  },
  {
    id: "electrical",
    name: "Electrical",
    icon: Zap,
    count: 98,
    subcategories: [
      { id: "wiring", name: "Wiring", count: 45 },
      { id: "lighting", name: "Lighting", count: 32 },
      { id: "panel", name: "Panel Installation", count: 12 },
      { id: "generator", name: "Generator", count: 9 },
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing",
    icon: Droplets,
    count: 87,
    subcategories: [
      { id: "repair", name: "Repair", count: 40 },
      { id: "installation", name: "Installation", count: 28 },
      { id: "drainage", name: "Drainage", count: 12 },
      { id: "water-heater", name: "Water Heater", count: 7 },
    ],
  },
  {
    id: "structural",
    name: "Structural",
    icon: HardHat,
    count: 45,
    subcategories: [
      { id: "steel", name: "Steel Structure", count: 18 },
      { id: "concrete", name: "Concrete", count: 15 },
      { id: "inspection", name: "Inspection", count: 7 },
      { id: "design", name: "Design", count: 5 },
    ],
  },
  {
    id: "waterproofing",
    name: "Waterproofing",
    icon: Droplets,
    count: 34,
    subcategories: [
      { id: "roof", name: "Roof Waterproofing", count: 15 },
      { id: "basement", name: "Basement", count: 10 },
      { id: "terrace", name: "Terrace", count: 6 },
      { id: "bathroom", name: "Bathroom", count: 3 },
    ],
  },
  {
    id: "interior",
    name: "Interior",
    icon: Paintbrush,
    count: 123,
    subcategories: [
      { id: "residential", name: "Residential", count: 58 },
      { id: "commercial", name: "Commercial", count: 35 },
      { id: "modular", name: "Modular Kitchen", count: 18 },
      { id: "wardrobe", name: "Wardrobe", count: 12 },
    ],
  },
  {
    id: "mep",
    name: "MEP",
    icon: Zap,
    count: 56,
    subcategories: [
      { id: "hvac", name: "HVAC", count: 24 },
      { id: "fire", name: "Fire Fighting", count: 15 },
      { id: "mep-plumbing", name: "Plumbing", count: 10 },
      { id: "mep-electrical", name: "Electrical", count: 7 },
    ],
  },
];

/* ============================================================
   LOCATIONS
============================================================ */

const LOCATIONS = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Hyderabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Goa",
];

/* ============================================================
   FILTER OPTIONS
============================================================ */

const RATINGS = [5, 4.5, 4, 3.5, 3];

const EXPERIENCES = [20, 15, 10, 5, 3, 1];

const DISTANCES = [5, 10, 25, 50, 100];

const AVAILABILITY_OPTIONS = [
  "available",
  "busy",
  "booked",
];

/* ============================================================
   IMAGES
============================================================ */

const CONTRACTOR_IMAGES = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800",
];

const CONTRACTOR_NAMES = [
  "Sri Construction Works",
  "BuildMax Contractors",
  "Prime Civil Solutions",
  "Metro Engineering",
  "Reliable Builders",
  "GreenBuild Contractors",
  "Elite Electrical Works",
  "SafeSite Plumbing",
  "ProStruct Engineers",
  "Urban Interior Studio",
  "South India Builders",
  "Modern MEP Solutions",
];

const CONTRACTOR_TITLES = [
  "General Contractor",
  "Civil Engineer",
  "Electrical Engineer",
  "Plumbing Expert",
  "Structural Engineer",
  "Interior Designer",
  "MEP Consultant",
  "Waterproofing Specialist",
];

const CATEGORY_SPECIALTIES: Record<string, string[]> = {
  civil: ["Residential", "Commercial", "New Construction"],
  electrical: ["Wiring", "Lighting", "Industrial"],
  plumbing: ["Repair", "Installation", "Drainage"],
  structural: ["Concrete", "Steel Structure", "Inspection"],
  waterproofing: ["Roof Waterproofing", "Terrace", "Basement"],
  interior: ["Residential", "Commercial", "Modular Kitchen"],
  mep: ["HVAC", "Fire Fighting", "Electrical"],
};

/* ============================================================
   GENERATE MOCK CONTRACTORS
============================================================ */

const generateContractors = (
  count: number
): Contractor[] => {
  return Array.from({ length: count }, (_, index) => {
    const category =
      SERVICE_CATEGORIES[
        index % SERVICE_CATEGORIES.length
      ];

    const subcategory =
      category.subcategories[
        index % category.subcategories.length
      ];

    const rating = 4 + Math.min(1, (index % 10) / 10);

    const experienceYears =
      2 + ((index * 3) % 19);

    const priceMin =
      25000 + ((index * 17500) % 125000);

    const priceMax = priceMin + 50000;

    return {
      id: index + 1,

      name:
        CONTRACTOR_NAMES[
          index % CONTRACTOR_NAMES.length
        ],

      title:
        CONTRACTOR_TITLES[
          index % CONTRACTOR_TITLES.length
        ],

      company:
        CONTRACTOR_NAMES[
          index % CONTRACTOR_NAMES.length
        ],

      category: category.id,

      subcategory: subcategory.id,

      rating: Number(rating.toFixed(1)),

      reviews: 25 + ((index * 17) % 280),

      location:
        LOCATIONS[index % LOCATIONS.length],

      distance: 3 + ((index * 7) % 95),

      experience: `${experienceYears}+ years`,

      experienceYears,

      projects: 20 + ((index * 13) % 250),

      verified: index % 5 !== 4,

      specialties:
        CATEGORY_SPECIALTIES[category.id],

      image:
        CONTRACTOR_IMAGES[
          index % CONTRACTOR_IMAGES.length
        ],

      priceRange: {
        min: priceMin,
        max: priceMax,
        currency: "₹",
      },

      availability:
        index % 7 === 0
          ? "booked"
          : index % 5 === 0
          ? "busy"
          : "available",

      completedProjects:
        15 + ((index * 11) % 180),

      responseTime:
        index % 3 === 0
          ? "Within 1 hour"
          : index % 3 === 1
          ? "Within 2 hours"
          : "Within 4 hours",

      completionRate: 85 + (index % 15),

      languages: ["English", "Hindi", "Tamil"],

      certifications: [
        "ISO 9001",
        "Safety Certified",
      ],

      featured: index < 6,
    };
  });
};

/* ============================================================
   LOCATION SELECTOR
============================================================ */

interface LocationSelectorProps {
  location: string;
  setLocation: (location: string) => void;
  onAutoDetect: () => void;
  isDetecting: boolean;
}

const LocationSelector = ({
  location,
  setLocation,
  onAutoDetect,
  isDetecting,
}: LocationSelectorProps) => {
  const [isOpen, setIsOpen] =
    useState(false);

  const [searchLocation, setSearchLocation] =
    useState("");

  const filteredLocations =
    LOCATIONS.filter((item) =>
      item
        .toLowerCase()
        .includes(
          searchLocation.toLowerCase()
        )
    );

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <button
            type="button"
            onClick={() =>
              setIsOpen(!isOpen)
            }
            className="w-full h-11 bg-white border border-gray-200 rounded-lg pl-10 pr-10 text-left text-sm hover:border-[#8B5E34] transition"
          >
            {location || "Select location"}
          </button>

          <ChevronDown
            size={16}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition ${
              isOpen
                ? "rotate-180"
                : ""
            }`}
          />
        </div>

        <button
          type="button"
          onClick={onAutoDetect}
          disabled={isDetecting}
          className="w-11 h-11 rounded-lg bg-[#F5EBDD] text-[#6B4226] flex items-center justify-center hover:bg-[#EAD8BF] transition"
          title="Detect my location"
        >
          {isDetecting ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Navigation size={18} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -5,
            }}
            className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2"
          >
            <div className="relative mb-2">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={searchLocation}
                onChange={(e) =>
                  setSearchLocation(
                    e.target.value
                  )
                }
                placeholder="Search city..."
                className="w-full border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm outline-none focus:border-[#8B5E34]"
              />
            </div>

            <div className="max-h-56 overflow-y-auto">
              {filteredLocations.map(
                (city) => (
                  <button
                    type="button"
                    key={city}
                    onClick={() => {
                      setLocation(city);
                      setIsOpen(false);
                      setSearchLocation("");
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${
                      city === location
                        ? "bg-[#6B4226] text-white"
                        : "hover:bg-[#F5EBDD]"
                    }`}
                  >
                    {city}
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================================
   CATEGORY FILTER
============================================================ */

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (
    value: string
  ) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (
    value: string
  ) => void;
}

const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
}: CategoryFilterProps) => {
  const [expanded, setExpanded] =
    useState<string | null>(
      selectedCategory || null
    );

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => {
          setSelectedCategory("");
          setSelectedSubcategory("");
          setExpanded(null);
        }}
        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm ${
          !selectedCategory
            ? "bg-[#6B4226] text-white"
            : "hover:bg-[#F5EBDD]"
        }`}
      >
        <span className="font-semibold">
          All Services
        </span>

        <span className="text-xs">
          599+
        </span>
      </button>

      {SERVICE_CATEGORIES.map(
        (category) => {
          const Icon = category.icon;

          const isExpanded =
            expanded === category.id;

          return (
            <div
              key={category.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(
                    category.id
                  );

                  setSelectedSubcategory(
                    ""
                  );

                  setExpanded(
                    isExpanded
                      ? null
                      : category.id
                  );
                }}
                className={`w-full flex items-center justify-between px-3 py-3 ${
                  selectedCategory ===
                  category.id
                    ? "bg-[#6B4226] text-white"
                    : "hover:bg-[#F5EBDD]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={17} />

                  <span className="text-sm font-semibold">
                    {category.name}
                  </span>

                  <span className="text-xs opacity-70">
                    {category.count}
                  </span>
                </span>

                <ChevronDown
                  size={16}
                  className={
                    isExpanded
                      ? "rotate-180 transition"
                      : "transition"
                  }
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    className="bg-gray-50"
                  >
                    <div className="p-2 space-y-1">
                      {category.subcategories.map(
                        (sub) => (
                          <button
                            type="button"
                            key={sub.id}
                            onClick={() =>
                              setSelectedSubcategory(
                                sub.id
                              )
                            }
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs ${
                              selectedSubcategory ===
                              sub.id
                                ? "bg-[#D8B27C] text-[#4A2B18] font-bold"
                                : "hover:bg-white"
                            }`}
                          >
                            <span>
                              {sub.name}
                            </span>

                            <span className="text-gray-400">
                              {sub.count}
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }
      )}
    </div>
  );
};

/* ============================================================
   ADVANCED FILTERS
============================================================ */

interface AdvancedFiltersProps {
  filters: Filters;
  setFilters: (
    filters: Filters
  ) => void;
  onClear: () => void;
}

const AdvancedFilters = ({
  filters,
  setFilters,
  onClear,
}: AdvancedFiltersProps) => {
  const [open, setOpen] =
    useState(false);

  const toggleAvailability = (
    value: string
  ) => {
    const exists =
      filters.availability.includes(
        value
      );

    setFilters({
      ...filters,
      availability: exists
        ? filters.availability.filter(
            (item) =>
              item !== value
          )
        : [
            ...filters.availability,
            value,
          ],
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() =>
          setOpen(!open)
        }
        className="w-full px-4 py-4 flex items-center justify-between"
      >
        <span className="flex items-center gap-2 font-bold text-gray-800">
          <SlidersHorizontal
            size={18}
            className="text-[#6B4226]"
          />
          Advanced Filters
        </span>

        <ChevronDown
          size={18}
          className={
            open
              ? "rotate-180 transition"
              : "transition"
          }
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="border-t border-gray-200"
          >
            <div className="p-4 space-y-6">
              <div>
                <p className="text-sm font-bold mb-3">
                  Minimum Rating
                </p>

                <div className="flex flex-wrap gap-2">
                  {RATINGS.map(
                    (rating) => (
                      <button
                        type="button"
                        key={rating}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            rating:
                              filters.rating ===
                              rating
                                ? 0
                                : rating,
                          })
                        }
                        className={`px-3 py-2 rounded-lg text-xs font-bold ${
                          filters.rating ===
                          rating
                            ? "bg-[#6B4226] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {rating}+ ★
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold mb-3">
                  Experience
                </p>

                <div className="flex flex-wrap gap-2">
                  {EXPERIENCES.map(
                    (experience) => (
                      <button
                        type="button"
                        key={experience}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            experience:
                              filters.experience ===
                              experience
                                ? 0
                                : experience,
                          })
                        }
                        className={`px-3 py-2 rounded-lg text-xs font-bold ${
                          filters.experience ===
                          experience
                            ? "bg-[#6B4226] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {experience}+ Years
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold mb-3">
                  Maximum Distance
                </p>

                <div className="flex flex-wrap gap-2">
                  {DISTANCES.map(
                    (distance) => (
                      <button
                        type="button"
                        key={distance}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            distance:
                              filters.distance ===
                              distance
                                ? 0
                                : distance,
                          })
                        }
                        className={`px-3 py-2 rounded-lg text-xs font-bold ${
                          filters.distance ===
                          distance
                            ? "bg-[#6B4226] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        Within {distance} km
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold mb-3">
                  Project Budget
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={
                      filters.priceMin ||
                      ""
                    }
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        priceMin:
                          Number(
                            e.target
                              .value
                          ) || 0,
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6B4226]"
                  />

                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={
                      filters.priceMax ||
                      ""
                    }
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        priceMax:
                          Number(
                            e.target
                              .value
                          ) || 0,
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6B4226]"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-bold mb-3">
                  Availability
                </p>

                <div className="flex flex-wrap gap-2">
                  {AVAILABILITY_OPTIONS.map(
                    (status) => (
                      <button
                        type="button"
                        key={status}
                        onClick={() =>
                          toggleAvailability(
                            status
                          )
                        }
                        className={`px-3 py-2 rounded-lg text-xs font-bold capitalize ${
                          filters.availability.includes(
                            status
                          )
                            ? "bg-[#6B4226] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={
                      filters.verified
                    }
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        verified:
                          e.target
                            .checked,
                      })
                    }
                    className="w-4 h-4 accent-[#6B4226]"
                  />

                  Verified contractors
                </label>

                <button
                  type="button"
                  onClick={onClear}
                  className="flex items-center gap-1 text-xs font-bold text-red-500"
                >
                  <RotateCcw
                    size={14}
                  />
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================================
   CONTRACTOR CARD
============================================================ */

interface ContractorCardProps {
  contractor: Contractor;
  index: number;
  isSaved: boolean;
  onView: (id: number) => void;
  onQuote: (
    contractor: Contractor
  ) => void;
  onSave: (id: number) => void;
}

const ContractorCard = ({
  contractor,
  index,
  isSaved,
  onView,
  onQuote,
  onSave,
}: ContractorCardProps) => {
  const availability =
    contractor.availability;

  const availabilityText =
    availability === "available"
      ? "Available Now"
      : availability === "busy"
      ? "Currently Busy"
      : availability === "booked"
      ? "Fully Booked"
      : "Away";

  const availabilityClass =
    availability === "available"
      ? "bg-green-500"
      : availability === "busy"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.03,
      }}
      whileHover={{
        y: -4,
      }}
      className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all"
    >
      <div
        className="relative h-48 overflow-hidden cursor-pointer"
        onClick={() =>
          onView(contractor.id)
        }
      >
        <img
          src={contractor.image}
          alt={contractor.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {contractor.featured && (
          <div className="absolute left-3 top-3 bg-[#E0A93A] text-white rounded-lg px-2.5 py-1 text-xs font-bold flex items-center gap-1">
            <Crown size={13} />
            Featured
          </div>
        )}

        {contractor.verified && (
          <div className="absolute right-3 top-3 bg-green-500 text-white rounded-lg px-2 py-1 text-xs font-bold flex items-center gap-1">
            <CheckCircle size={12} />
            Verified
          </div>
        )}

        <div
          className={`absolute right-3 top-12 ${availabilityClass} text-white rounded-lg px-2 py-1 text-[10px] font-bold`}
        >
          {availabilityText}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-lg truncate">
            {contractor.name}
          </h3>

          <p className="text-white/90 text-xs truncate">
            {contractor.title}
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFF6DC] text-[#6B4226] px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
              <Star
                size={12}
                className="fill-[#E0A93A] text-[#E0A93A]"
              />
              {contractor.rating}
            </span>

            <span className="text-xs text-gray-500">
              ({contractor.reviews} reviews)
            </span>
          </div>

          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Briefcase size={13} />
            {contractor.completedProjects}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin
              size={14}
              className="text-gray-400"
            />

            <span>
              {contractor.location}
            </span>

            <span className="text-gray-400">
              • {contractor.distance} km
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock
              size={14}
              className="text-gray-400"
            />

            <span>
              {contractor.experience} experience
            </span>
          </div>
        </div>

        <div className="mt-3 bg-[#F8F2EA] rounded-lg px-3 py-2.5">
          <div className="text-xs text-gray-500">
            Estimated project budget
          </div>

          <div className="text-sm font-black text-[#6B4226] mt-1">
            ₹
            {contractor.priceRange.min.toLocaleString()}{" "}
            - ₹
            {contractor.priceRange.max.toLocaleString()}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {contractor.specialties
            .slice(0, 3)
            .map((specialty) => (
              <span
                key={specialty}
                className="bg-[#F5EBDD] text-[#6B4226] rounded-md px-2 py-1 text-[10px] font-semibold"
              >
                {specialty}
              </span>
            ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() =>
              onView(contractor.id)
            }
            className="flex items-center justify-center gap-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 text-xs font-bold"
          >
            <Eye size={13} />
            View
          </button>

          <button
            type="button"
            onClick={() =>
              onQuote(contractor)
            }
            className="flex items-center justify-center gap-1 rounded-lg bg-[#6B4226] hover:bg-[#4F2F1B] text-white py-2 text-xs font-bold"
          >
            <MessageSquare size={13} />
            Quote
          </button>

          <button
            type="button"
            onClick={() =>
              onSave(contractor.id)
            }
            className={`flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-bold ${
              isSaved
                ? "bg-red-50 text-red-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Heart
              size={13}
              className={
                isSaved
                  ? "fill-red-500"
                  : ""
              }
            />

            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ============================================================
   QUOTE MODAL
============================================================ */

interface QuoteModalProps {
  contractor: Contractor | null;
  onClose: () => void;
}

const QuoteModal = ({
  contractor,
  onClose,
}: QuoteModalProps) => {
  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    projectName,
    setProjectName,
  ] = useState("");

  const [
    startDate,
    setStartDate,
  ] = useState("");

  const [budget, setBudget] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  useEffect(() => {
    if (!contractor) {
      setCustomerName("");
      setPhone("");
      setEmail("");
      setProjectName("");
      setStartDate("");
      setBudget("");
      setDescription("");
      setSubmitted(false);
    }
  }, [contractor]);

  if (!contractor) {
    return null;
  }

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !customerName.trim() ||
      !phone.trim() ||
      !projectName.trim() ||
      !description.trim()
    ) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

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
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto"
        >
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 sm:px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide font-bold text-[#8B5E34]">
                Service Request
              </p>

              <h2 className="text-xl font-black text-gray-900">
                Send Quote Request
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>

          {submitted ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle
                  size={42}
                  className="text-green-600"
                />
              </div>

              <h3 className="text-2xl font-black text-gray-900 mt-5">
                Quote Request Sent!
              </h3>

              <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
                Your project details have
                been submitted to{" "}
                <strong>
                  {contractor.name}
                </strong>
                .
              </p>

              <div className="bg-[#F8F2EA] rounded-xl p-4 mt-6 text-left max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    size={22}
                    className="text-[#6B4226]"
                  />

                  <div>
                    <p className="font-bold text-sm">
                      Request submitted
                    </p>

                    <p className="text-xs text-gray-500">
                      Response time:{" "}
                      {contractor.responseTime}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 bg-[#6B4226] hover:bg-[#4F2F1B] text-white px-8 py-3 rounded-lg font-bold"
              >
                Done
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6"
            >
              <div className="bg-[#F8F2EA] rounded-xl p-4 mb-6">
                <div className="flex gap-4">
                  <img
                    src={contractor.image}
                    alt={contractor.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">
                        {contractor.name}
                      </h3>

                      {contractor.verified && (
                        <CheckCircle
                          size={15}
                          className="text-green-600"
                        />
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      {contractor.title}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star
                          size={12}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        {contractor.rating}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {contractor.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="font-black text-gray-900 mb-4">
                Your Details
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Your Name{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      value={
                        customerName
                      }
                      onChange={(e) =>
                        setCustomerName(
                          e.target.value
                        )
                      }
                      placeholder="Enter your name"
                      className="w-full border border-gray-200 rounded-lg py-3 pl-10 pr-3 text-sm outline-none focus:border-[#6B4226]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Phone Number{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value
                        )
                      }
                      placeholder="Enter phone number"
                      className="w-full border border-gray-200 rounded-lg py-3 pl-10 pr-3 text-sm outline-none focus:border-[#6B4226]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="you@example.com"
                      className="w-full border border-gray-200 rounded-lg py-3 pl-10 pr-3 text-sm outline-none focus:border-[#6B4226]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Project Name{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <FileText
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      value={
                        projectName
                      }
                      onChange={(e) =>
                        setProjectName(
                          e.target.value
                        )
                      }
                      placeholder="e.g. House Construction"
                      className="w-full border border-gray-200 rounded-lg py-3 pl-10 pr-3 text-sm outline-none focus:border-[#6B4226]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Expected Start Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="date"
                      value={
                        startDate
                      }
                      onChange={(e) =>
                        setStartDate(
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-200 rounded-lg py-3 pl-10 pr-3 text-sm outline-none focus:border-[#6B4226]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Estimated Budget
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="number"
                      value={budget}
                      onChange={(e) =>
                        setBudget(
                          e.target.value
                        )
                      }
                      placeholder="Enter budget"
                      className="w-full border border-gray-200 rounded-lg py-3 pl-10 pr-3 text-sm outline-none focus:border-[#6B4226]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-semibold mb-2">
                  Project Description{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  value={
                    description
                  }
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows={5}
                  placeholder="Describe your project, required work, site details, materials, approximate area, etc."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-[#6B4226]"
                />
              </div>

              <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={20}
                    className="text-blue-600 flex-shrink-0"
                  />

                  <p className="text-xs text-blue-800">
                    Your request will be
                    shared with the
                    selected contractor.
                    They can contact you
                    to discuss the project
                    and provide a quotation.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-[#6B4226] hover:bg-[#4F2F1B] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <Send size={17} />
                  Send Quote Request
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ============================================================
   SKELETON CARD
============================================================ */

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 animate-pulse">
      <div className="h-48 bg-gray-200" />

      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>

        <div className="h-3 w-40 bg-gray-200 rounded" />

        <div className="h-12 bg-gray-200 rounded-lg" />

        <div className="flex gap-2">
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-20 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="h-9 bg-gray-200 rounded" />
          <div className="h-9 bg-gray-200 rounded" />
          <div className="h-9 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   EMPTY STATE
============================================================ */

const EmptyState = ({
  onClear,
}: {
  onClear: () => void;
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
      <Search
        size={45}
        className="mx-auto text-gray-300"
      />

      <h3 className="text-lg font-black text-gray-900 mt-4">
        No contractors found
      </h3>

      <p className="text-sm text-gray-500 mt-2">
        Try changing your search or
        filters.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 bg-[#6B4226] text-white px-6 py-2.5 rounded-lg text-sm font-bold"
      >
        Clear Filters
      </button>
    </div>
  );
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

const ContractorListing = () => {
  const navigate = useNavigate();

  const [
    contractors,
    setContractors,
  ] = useState<Contractor[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const [
    selectedSubcategory,
    setSelectedSubcategory,
  ] = useState("");

  const [
    selectedLocation,
    setSelectedLocation,
  ] = useState("");

  const [
    detectingLocation,
    setDetectingLocation,
  ] = useState(false);

  const [
    filters,
    setFilters,
  ] = useState<Filters>({
    rating: 0,
    experience: 0,
    distance: 0,
    verified: false,
    priceMin: 0,
    priceMax: 0,
    availability: [],
  });

  const [
    sortBy,
    setSortBy,
  ] = useState<SortOption>(
    "relevance"
  );

  const [
    savedContractors,
    setSavedContractors,
  ] = useState<number[]>([]);

  const [
    showMobileFilters,
    setShowMobileFilters,
  ] = useState(false);

  const [
    quoteContractor,
    setQuoteContractor,
  ] = useState<Contractor | null>(
    null
  );

  const [page, setPage] =
    useState(1);

  /* ==========================================================
     LOAD DATA
  ========================================================== */

  useEffect(() => {
    const timer =
      setTimeout(() => {
        const data =
          generateContractors(36);

        setContractors(data);
        setLoading(false);
      }, 700);

    return () =>
      clearTimeout(timer);
  }, []);

  /* ==========================================================
     FILTER
  ========================================================== */

  const filteredContractors =
    useMemo(() => {
      let result = [...contractors];

      if (searchTerm.trim()) {
        const search =
          searchTerm
            .toLowerCase()
            .trim();

        result =
          result.filter(
            (contractor) =>
              contractor.name
                .toLowerCase()
                .includes(search) ||
              contractor.title
                .toLowerCase()
                .includes(search) ||
              contractor.location
                .toLowerCase()
                .includes(search) ||
              contractor.category
                .toLowerCase()
                .includes(search) ||
              contractor.subcategory
                .toLowerCase()
                .includes(search) ||
              contractor.specialties.some(
                (item) =>
                  item
                    .toLowerCase()
                    .includes(
                      search
                    )
              )
          );
      }

      if (selectedCategory) {
        result =
          result.filter(
            (contractor) =>
              contractor.category ===
              selectedCategory
          );
      }

      if (selectedSubcategory) {
        result =
          result.filter(
            (contractor) =>
              contractor.subcategory ===
              selectedSubcategory
          );
      }

      if (selectedLocation) {
        result =
          result.filter(
            (contractor) =>
              contractor.location ===
              selectedLocation
          );
      }

      if (filters.rating) {
        result =
          result.filter(
            (contractor) =>
              contractor.rating >=
              filters.rating
          );
      }

      if (filters.experience) {
        result =
          result.filter(
            (contractor) =>
              contractor.experienceYears >=
              filters.experience
          );
      }

      if (filters.distance) {
        result =
          result.filter(
            (contractor) =>
              contractor.distance <=
              filters.distance
          );
      }

      if (filters.verified) {
        result =
          result.filter(
            (contractor) =>
              contractor.verified
          );
      }

      if (filters.priceMin) {
        result =
          result.filter(
            (contractor) =>
              contractor.priceRange.max >=
              filters.priceMin
          );
      }

      if (filters.priceMax) {
        result =
          result.filter(
            (contractor) =>
              contractor.priceRange.min <=
              filters.priceMax
          );
      }

      if (
        filters.availability.length
      ) {
        result =
          result.filter(
            (contractor) =>
              filters.availability.includes(
                contractor.availability
              )
          );
      }

      switch (sortBy) {
        case "rating_desc":
          result.sort(
            (a, b) =>
              b.rating -
              a.rating
          );
          break;

        case "rating_asc":
          result.sort(
            (a, b) =>
              a.rating -
              b.rating
          );
          break;

        case "price_desc":
          result.sort(
            (a, b) =>
              b.priceRange.min -
              a.priceRange.min
          );
          break;

        case "price_asc":
          result.sort(
            (a, b) =>
              a.priceRange.min -
              b.priceRange.min
          );
          break;

        case "experience_desc":
          result.sort(
            (a, b) =>
              b.experienceYears -
              a.experienceYears
          );
          break;

        case "experience_asc":
          result.sort(
            (a, b) =>
              a.experienceYears -
              b.experienceYears
          );
          break;

        case "distance_asc":
          result.sort(
            (a, b) =>
              a.distance -
              b.distance
          );
          break;

        default:
          result.sort(
            (a, b) => {
              if (
                a.featured &&
                !b.featured
              )
                return -1;

              if (
                !a.featured &&
                b.featured
              )
                return 1;

              return (
                b.rating -
                a.rating
              );
            }
          );
      }

      return result;
    }, [
      contractors,
      searchTerm,
      selectedCategory,
      selectedSubcategory,
      selectedLocation,
      filters,
      sortBy,
    ]);

  /* ==========================================================
     CLEAR
  ========================================================== */

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedLocation("");

    setFilters({
      rating: 0,
      experience: 0,
      distance: 0,
      verified: false,
      priceMin: 0,
      priceMax: 0,
      availability: [],
    });

    setSortBy("relevance");
    setPage(1);
  };

  /* ==========================================================
     SAVE
  ========================================================== */

  const toggleSave = (
    id: number
  ) => {
    setSavedContractors(
      (current) =>
        current.includes(id)
          ? current.filter(
              (item) =>
                item !== id
            )
          : [...current, id]
    );
  };

  /* ==========================================================
     VIEW DETAILS
  ========================================================== */

  const handleViewDetails = (
    id: number
  ) => {
    navigate(
      `/contractor/${id}`
    );
  };

  /* ==========================================================
     QUOTE
  ========================================================== */

  const handleQuote = (
    contractor: Contractor
  ) => {
    setQuoteContractor(
      contractor
    );
  };

  /* ==========================================================
     LOCATION
  ========================================================== */

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setDetectingLocation(
      true
    );

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const {
            latitude,
            longitude,
          } = position.coords;

          const response =
            await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );

          const data =
            await response.json();

          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village;

          if (
            city &&
            LOCATIONS.includes(city)
          ) {
            setSelectedLocation(
              city
            );
          } else {
            alert(
              `Detected location: ${
                city || "Unknown"
              }. Please select a supported city.`
            );
          }
        } catch {
          alert(
            "Unable to detect your city."
          );
        } finally {
          setDetectingLocation(
            false
          );
        }
      },
      () => {
        setDetectingLocation(
          false
        );

        alert(
          "Please allow location access."
        );
      }
    );
  };

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const averageRating =
    filteredContractors.length
      ? (
          filteredContractors.reduce(
            (total, item) =>
              total + item.rating,
            0
          ) /
          filteredContractors.length
        ).toFixed(1)
      : "0";

  const averageMin =
    filteredContractors.length
      ? Math.round(
          filteredContractors.reduce(
            (total, item) =>
              total +
              item.priceRange.min,
            0
          ) /
            filteredContractors.length
        )
      : 0;

  const featured =
    filteredContractors.filter(
      (item) => item.featured
    );

  const regular =
    filteredContractors.filter(
      (item) => !item.featured
    );

  const visibleRegular =
    regular.slice(0, page * 12);

  /* ==========================================================
     LOAD MORE
  ========================================================== */

  const loadMore = () => {
    setPage(
      (current) =>
        current + 1
    );
  };

  /* ==========================================================
     RETURN
  ========================================================== */

  return (
    <div className="min-h-screen bg-[#F5F3EF]">

      {/* HEADER */}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">

              <div className="flex-1">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    placeholder="Search contractors, services, locations..."
                    className="w-full h-12 border border-gray-200 rounded-xl pl-11 pr-4 text-sm outline-none focus:border-[#6B4226] focus:ring-2 focus:ring-[#6B4226]/10"
                  />
                </div>
              </div>

              <div className="lg:w-[280px]">
                <LocationSelector
                  location={
                    selectedLocation
                  }
                  setLocation={
                    setSelectedLocation
                  }
                  onAutoDetect={
                    detectLocation
                  }
                  isDetecting={
                    detectingLocation
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY BAR */}

        <div className="bg-[#5A351E]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto py-2">

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(
                    ""
                  );
                  setSelectedSubcategory(
                    ""
                  );
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold ${
                  !selectedCategory
                    ? "bg-[#E0A93A] text-[#3E2414]"
                    : "text-white hover:bg-white/10"
                }`}
              >
                All Services
              </button>

              {SERVICE_CATEGORIES.map(
                (category) => {
                  const Icon =
                    category.icon;

                  return (
                    <button
                      type="button"
                      key={
                        category.id
                      }
                      onClick={() => {
                        setSelectedCategory(
                          category.id
                        );

                        setSelectedSubcategory(
                          ""
                        );
                      }}
                      className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                        selectedCategory ===
                        category.id
                          ? "bg-[#E0A93A] text-[#3E2414]"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon size={14} />
                      {category.name}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* SIDEBAR */}

          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-28 space-y-4">

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h2 className="font-black text-gray-900 flex items-center gap-2 mb-4">
                  <Layers
                    size={18}
                    className="text-[#6B4226]"
                  />

                  Service Categories
                </h2>

                <CategoryFilter
                  selectedCategory={
                    selectedCategory
                  }
                  setSelectedCategory={
                    setSelectedCategory
                  }
                  selectedSubcategory={
                    selectedSubcategory
                  }
                  setSelectedSubcategory={
                    setSelectedSubcategory
                  }
                />
              </div>

              <AdvancedFilters
                filters={filters}
                setFilters={
                  setFilters
                }
                onClear={
                  clearFilters
                }
              />

            </div>
          </aside>

          {/* CONTENT */}

          <section className="flex-1 min-w-0">

            {/* MOBILE FILTER */}

            <div className="lg:hidden mb-4">
              <button
                type="button"
                onClick={() =>
                  setShowMobileFilters(
                    true
                  )
                }
                className="w-full bg-white border border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-bold"
              >
                <Filter size={17} />
                Filters & Categories
              </button>
            </div>

            {/* SUMMARY */}

            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <h2 className="text-lg sm:text-xl font-black text-gray-900">
                    {selectedCategory
                      ? SERVICE_CATEGORIES.find(
                          (item) =>
                            item.id ===
                            selectedCategory
                        )?.name
                      : "All Contractors"}
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Trusted professionals for
                    your construction
                    requirements
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  <div className="text-xs text-gray-500">
                    <strong className="text-[#6B4226]">
                      {
                        filteredContractors.length
                      }
                    </strong>{" "}
                    contractors
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target
                          .value as SortOption
                      )
                    }
                    className="border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none bg-white"
                  >
                    <option value="relevance">
                      Sort: Relevance
                    </option>

                    <option value="rating_desc">
                      Rating: High to Low
                    </option>

                    <option value="rating_asc">
                      Rating: Low to High
                    </option>

                    <option value="price_asc">
                      Budget: Low to High
                    </option>

                    <option value="price_desc">
                      Budget: High to Low
                    </option>

                    <option value="experience_desc">
                      Experience
                    </option>

                    <option value="distance_asc">
                      Distance
                    </option>
                  </select>
                </div>
              </div>

              {/* STATS */}

              <div className="grid grid-cols-3 gap-3 mt-4">

                <div className="bg-[#F8F2EA] rounded-lg p-3">
                  <p className="text-[10px] text-gray-500">
                    Contractors
                  </p>

                  <p className="font-black text-[#6B4226]">
                    {
                      filteredContractors.length
                    }
                  </p>
                </div>

                <div className="bg-[#F8F2EA] rounded-lg p-3">
                  <p className="text-[10px] text-gray-500">
                    Avg. Rating
                  </p>

                  <p className="font-black text-[#6B4226]">
                    ⭐ {averageRating}
                  </p>
                </div>

                <div className="bg-[#F8F2EA] rounded-lg p-3">
                  <p className="text-[10px] text-gray-500">
                    Avg. Starting
                  </p>

                  <p className="font-black text-[#6B4226]">
                    ₹
                    {averageMin.toLocaleString()}
                  </p>
                </div>

              </div>
            </div>

            {/* CONTRACTORS */}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({
                  length: 6,
                }).map(
                  (_, index) => (
                    <SkeletonCard
                      key={index}
                    />
                  )
                )}
              </div>
            ) : filteredContractors.length ===
              0 ? (
              <EmptyState
                onClear={
                  clearFilters
                }
              />
            ) : (
              <>
                {/* FEATURED */}

                {featured.length >
                  0 && (
                  <div className="mb-8">

                    <div className="flex items-center gap-2 mb-4">
                      <Crown
                        size={20}
                        className="text-[#E0A93A]"
                      />

                      <h2 className="text-lg font-black text-gray-900">
                        Featured Contractors
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {featured.map(
                        (
                          contractor,
                          index
                        ) => (
                          <ContractorCard
                            key={
                              contractor.id
                            }
                            contractor={
                              contractor
                            }
                            index={
                              index
                            }
                            isSaved={savedContractors.includes(
                              contractor.id
                            )}
                            onView={
                              handleViewDetails
                            }
                            onQuote={
                              handleQuote
                            }
                            onSave={
                              toggleSave
                            }
                          />
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* ALL */}

                {regular.length >
                  0 && (
                  <div>

                    {featured.length >
                      0 && (
                      <h2 className="text-lg font-black text-gray-900 mb-4">
                        All Contractors
                      </h2>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {visibleRegular.map(
                        (
                          contractor,
                          index
                        ) => (
                          <ContractorCard
                            key={
                              contractor.id
                            }
                            contractor={
                              contractor
                            }
                            index={
                              index
                            }
                            isSaved={savedContractors.includes(
                              contractor.id
                            )}
                            onView={
                              handleViewDetails
                            }
                            onQuote={
                              handleQuote
                            }
                            onSave={
                              toggleSave
                            }
                          />
                        )
                      )}
                    </div>

                    {visibleRegular.length <
                      regular.length && (
                      <div className="flex justify-center mt-8">
                        <button
                          type="button"
                          onClick={
                            loadMore
                          }
                          className="px-7 py-3 bg-white border border-gray-300 rounded-lg text-sm font-bold text-[#6B4226] hover:bg-[#F8F2EA]"
                        >
                          Load More Contractors
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* MOBILE FILTER DRAWER */}

      <AnimatePresence>
        {showMobileFilters && (
          <>
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
                setShowMobileFilters(
                  false
                )
              }
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />

            <motion.div
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                damping: 25,
              }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-[51] overflow-y-auto lg:hidden"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">

                <h2 className="font-black text-gray-900">
                  Filters
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setShowMobileFilters(
                      false
                    )
                  }
                  className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 space-y-5">

                <div>
                  <h3 className="font-black mb-3">
                    Service Categories
                  </h3>

                  <CategoryFilter
                    selectedCategory={
                      selectedCategory
                    }
                    setSelectedCategory={
                      setSelectedCategory
                    }
                    selectedSubcategory={
                      selectedSubcategory
                    }
                    setSelectedSubcategory={
                      setSelectedSubcategory
                    }
                  />
                </div>

                <AdvancedFilters
                  filters={filters}
                  setFilters={
                    setFilters
                  }
                  onClear={
                    clearFilters
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowMobileFilters(
                      false
                    )
                  }
                  className="w-full bg-[#6B4226] text-white py-3 rounded-lg font-bold"
                >
                  Apply Filters
                </button>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SEND QUOTE */}

      <QuoteModal
        contractor={
          quoteContractor
        }
        onClose={() =>
          setQuoteContractor(
            null
          )
        }
      />
    </div>
  );
};

export default ContractorListing;