import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit3,
  Package,
  Heart,
  ShoppingCart,
  Bell,
  Settings,
  LogOut,
  Home,
  Wrench,
  CalendarDays,
  ShieldCheck,
  X,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  email: string;
  phone: string;
  location: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState<UserData>({
    name: "Vignesh Kumar",
    email: "vignesh@example.com",
    phone: "+91 98765 43210",
    location: "Chennai, Tamil Nadu",
  });

  const [formData, setFormData] = useState<UserData>(user);

  // =========================================================
  // QUICK LINKS
  // =========================================================

  const quickLinks = [
    {
      title: "My Orders",
      description: "View and manage your orders",
      icon: Package,
      count: 8,
      path: "/orders",
    },
    {
      title: "My Rentals",
      description: "Manage your rented products",
      icon: Home,
      count: 3,
      path: "/rentals",
    },
    {
      title: "My Services",
      description: "Manage your booked services",
      icon: Wrench,
      count: 4,
      path: "/contractors",
    },
    {
      title: "Wishlist",
      description: "Products you have saved",
      icon: Heart,
      count: 12,
      path: "/wishlist",
    },
    {
      title: "Cart",
      description: "Products waiting in your cart",
      icon: ShoppingCart,
      count: 2,
      path: "/cart",
    },
    {
      title: "Notifications",
      description: "Check your latest notifications",
      icon: Bell,
      count: 5,
      path: "/notifications",
    },
  ];

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const openEditProfile = () => {
    setFormData(user);
    setIsEditing(true);
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("casa_terminal_user");

    navigate("/", {
      replace: true,
    });

    window.location.reload();
  };

  // =========================================================
  // QUICK LINK NAVIGATION
  // =========================================================

  const handleQuickLink = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2]">

      {/* =====================================================
          PAGE CONTAINER
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-12">

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="mb-6 sm:mb-8">

          {/* Breadcrumb */}

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">

            <button
              type="button"
              onClick={() => navigate("/")}
              className="hover:text-[#502d13] transition"
            >
              Home
            </button>

            <ChevronRight size={15} />

            <span className="text-[#502d13] font-medium">
              Profile
            </span>

          </div>

          {/* Title */}

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#502d13]">
            My Profile
          </h1>

          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500">
            Manage your Casa Terminal account and preferences
          </p>

        </div>


        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">

          {/* =================================================
              LEFT PROFILE CARD
          ================================================= */}

          <div className="lg:col-span-1">

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              {/* COVER */}

              <div className="h-24 sm:h-28 bg-[#502d13] relative">

                <div className="absolute inset-0 bg-gradient-to-r from-[#502d13] to-[#70431f]" />

                <div className="absolute top-4 right-4">

                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs backdrop-blur-sm border border-white/10">
                    CASA TERMINAL
                  </span>

                </div>

              </div>


              {/* PROFILE CONTENT */}

              <div className="px-5 sm:px-6 pb-6">

                {/* AVATAR */}

                <div className="flex justify-center -mt-14">

                  <div className="relative">

                    <div
                      className="
                        w-28
                        h-28
                        sm:w-32
                        sm:h-32
                        rounded-full
                        bg-white
                        p-1
                        shadow-xl
                      "
                    >

                      <div
                        className="
                          w-full
                          h-full
                          rounded-full
                          bg-[#e9ddc8]
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <User
                          size={48}
                          className="text-[#502d13]"
                        />

                      </div>

                    </div>


                    {/* CAMERA */}

                    <button
                      type="button"
                      aria-label="Change profile photo"
                      onClick={() =>
                        alert("Profile photo upload coming soon")
                      }
                      className="
                        absolute
                        right-0
                        bottom-1
                        w-9
                        h-9
                        rounded-full
                        bg-[#502d13]
                        text-white
                        flex
                        items-center
                        justify-center
                        border-4
                        border-white
                        hover:bg-[#3d210e]
                        transition
                      "
                    >
                      <Camera size={15} />
                    </button>

                  </div>

                </div>


                {/* USER INFO */}

                <div className="text-center mt-4">

                  <h2 className="text-xl font-bold text-gray-900">
                    {user.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 break-all">
                    {user.email}
                  </p>


                  {/* VERIFIED */}

                  <div
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      mt-3
                      px-3
                      py-1
                      rounded-full
                      bg-green-50
                      text-green-700
                      text-xs
                      font-semibold
                    "
                  >
                    <ShieldCheck size={14} />

                    Verified Account
                  </div>

                </div>


                {/* EDIT PROFILE */}

                <button
                  type="button"
                  onClick={openEditProfile}
                  className="
                    mt-6
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-gray-700
                    hover:bg-gray-50
                    hover:border-[#502d13]
                    hover:text-[#502d13]
                    transition
                  "
                >
                  <Edit3 size={17} />

                  Edit Profile
                </button>


                {/* LEFT MENU */}

                <div className="mt-5 pt-5 border-t border-gray-100 space-y-1">

                  {/* SETTINGS */}

                  <button
                    type="button"
                    onClick={openEditProfile}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3
                      rounded-xl
                      text-gray-700
                      hover:bg-gray-50
                      transition
                    "
                  >

                    <Settings
                      size={19}
                      className="text-gray-500"
                    />

                    <span className="text-sm font-medium">
                      Account Settings
                    </span>

                  </button>


                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3
                      rounded-xl
                      text-red-600
                      hover:bg-red-50
                      transition
                    "
                  >

                    <LogOut size={19} />

                    <span className="text-sm font-medium">
                      Logout
                    </span>

                  </button>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="lg:col-span-2 space-y-5 sm:space-y-6">

            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <section
              className="
                bg-white
                rounded-2xl
                border
                border-gray-200
                shadow-sm
                p-5
                sm:p-6
              "
            >

              {/* HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  mb-6
                "
              >

                <div>

                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Personal Information
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Your personal account information
                  </p>

                </div>


                <button
                  type="button"
                  onClick={openEditProfile}
                  className="
                    p-2
                    rounded-lg
                    text-[#502d13]
                    hover:bg-[#e9ddc8]/50
                    transition
                  "
                  aria-label="Edit profile"
                >
                  <Edit3 size={18} />
                </button>

              </div>


              {/* INFORMATION GRID */}

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-x-6
                  gap-y-6
                "
              >

                {/* NAME */}

                <div>

                  <p className="text-xs font-medium text-gray-500">
                    Full Name
                  </p>

                  <div className="flex items-center gap-3 mt-2">

                    <div
                      className="
                        w-9
                        h-9
                        rounded-lg
                        bg-[#e9ddc8]/50
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <User
                        size={17}
                        className="text-[#502d13]"
                      />
                    </div>

                    <span className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </span>

                  </div>

                </div>


                {/* EMAIL */}

                <div>

                  <p className="text-xs font-medium text-gray-500">
                    Email Address
                  </p>

                  <div className="flex items-center gap-3 mt-2">

                    <div
                      className="
                        w-9
                        h-9
                        rounded-lg
                        bg-[#e9ddc8]/50
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <Mail
                        size={17}
                        className="text-[#502d13]"
                      />
                    </div>

                    <span className="text-sm font-semibold text-gray-900 break-all">
                      {user.email}
                    </span>

                  </div>

                </div>


                {/* PHONE */}

                <div>

                  <p className="text-xs font-medium text-gray-500">
                    Phone Number
                  </p>

                  <div className="flex items-center gap-3 mt-2">

                    <div
                      className="
                        w-9
                        h-9
                        rounded-lg
                        bg-[#e9ddc8]/50
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <Phone
                        size={17}
                        className="text-[#502d13]"
                      />
                    </div>

                    <span className="text-sm font-semibold text-gray-900">
                      {user.phone}
                    </span>

                  </div>

                </div>


                {/* LOCATION */}

                <div>

                  <p className="text-xs font-medium text-gray-500">
                    Location
                  </p>

                  <div className="flex items-center gap-3 mt-2">

                    <div
                      className="
                        w-9
                        h-9
                        rounded-lg
                        bg-[#e9ddc8]/50
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <MapPin
                        size={17}
                        className="text-[#502d13]"
                      />
                    </div>

                    <span className="text-sm font-semibold text-gray-900">
                      {user.location}
                    </span>

                  </div>

                </div>

              </div>

            </section>


            {/* =================================================
                QUICK ACCESS
            ================================================= */}

            <section>

              <div className="mb-4">

                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Quick Access
                </h2>

                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Quickly access your Casa Terminal activities
                </p>

              </div>


              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-4
                "
              >

                {quickLinks.map((item) => {

                  const Icon = item.icon;

                  return (
                    <button
                      type="button"
                      key={item.title}
                      onClick={() => handleQuickLink(item.path)}
                      className="
                        group
                        w-full
                        bg-white
                        border
                        border-gray-200
                        rounded-2xl
                        p-5
                        text-left
                        shadow-sm
                        hover:shadow-md
                        hover:border-[#d8c6aa]
                        transition-all
                      "
                    >

                      <div className="flex items-center justify-between">

                        {/* ICON */}

                        <div
                          className="
                            w-11
                            h-11
                            rounded-xl
                            bg-[#e9ddc8]/50
                            text-[#502d13]
                            flex
                            items-center
                            justify-center
                            group-hover:bg-[#e9ddc8]
                            transition
                          "
                        >
                          <Icon size={21} />
                        </div>


                        {/* COUNT */}

                        <span
                          className="
                            min-w-6
                            h-6
                            px-2
                            rounded-full
                            bg-gray-100
                            text-gray-600
                            text-xs
                            font-bold
                            flex
                            items-center
                            justify-center
                          "
                        >
                          {item.count}
                        </span>

                      </div>


                      <h3 className="mt-4 text-sm sm:text-base font-bold text-gray-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        {item.description}
                      </p>

                    </button>
                  );
                })}

              </div>

            </section>


            {/* =================================================
                ACCOUNT ACTIVITY
            ================================================= */}

            <section
              className="
                bg-white
                rounded-2xl
                border
                border-gray-200
                shadow-sm
                p-5
                sm:p-6
              "
            >

              {/* HEADER */}

              <div className="flex items-center gap-3 mb-5">

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-[#e9ddc8]/50
                    text-[#502d13]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <CalendarDays size={20} />
                </div>

                <div>

                  <h2 className="font-bold text-gray-900">
                    Account Activity
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-500">
                    Your account information
                  </p>

                </div>

              </div>


              <div className="space-y-4">

                {/* MEMBER SINCE */}

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-1
                    border-b
                    border-gray-100
                    pb-4
                  "
                >

                  <span className="text-sm text-gray-500">
                    Member Since
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    January 2026
                  </span>

                </div>


                {/* TOTAL ORDERS */}

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-1
                    border-b
                    border-gray-100
                    pb-4
                  "
                >

                  <span className="text-sm text-gray-500">
                    Total Orders
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    8 Orders
                  </span>

                </div>


                {/* ACCOUNT STATUS */}

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-1
                  "
                >

                  <span className="text-sm text-gray-500">
                    Account Status
                  </span>

                  <span
                    className="
                      inline-flex
                      w-fit
                      px-3
                      py-1
                      rounded-full
                      bg-green-50
                      text-green-700
                      text-xs
                      font-semibold
                    "
                  >
                    Active
                  </span>

                </div>

              </div>

            </section>

          </div>

        </div>

      </div>


      {/* =====================================================
          EDIT PROFILE MODAL
      ===================================================== */}

      {isEditing && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/60
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
          onClick={(e) => {

            if (e.target === e.currentTarget) {
              handleCancel();
            }

          }}
        >

          <div
            className="
              w-full
              max-w-lg
              max-h-[90vh]
              overflow-y-auto
              bg-white
              rounded-2xl
              shadow-2xl
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                sticky
                top-0
                bg-white
                z-10
                flex
                items-center
                justify-between
                px-5
                sm:px-6
                py-4
                sm:py-5
                border-b
                border-gray-200
              "
            >

              <div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Edit Profile
                </h2>

                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Update your personal information
                </p>

              </div>


              <button
                type="button"
                onClick={handleCancel}
                className="
                  w-9
                  h-9
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  hover:bg-gray-100
                  hover:text-gray-700
                  transition
                "
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>


            {/* FORM */}

            <div className="p-5 sm:p-6 space-y-5">

              {/* NAME */}

              <div>

                <label
                  htmlFor="profile-name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      py-3
                      pl-11
                      pr-4
                      text-sm
                      outline-none
                      focus:border-[#502d13]
                      focus:ring-2
                      focus:ring-[#502d13]/10
                    "
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div>

                <label
                  htmlFor="profile-email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      py-3
                      pl-11
                      pr-4
                      text-sm
                      outline-none
                      focus:border-[#502d13]
                      focus:ring-2
                      focus:ring-[#502d13]/10
                    "
                  />

                </div>

              </div>


              {/* PHONE */}

              <div>

                <label
                  htmlFor="profile-phone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    id="profile-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      py-3
                      pl-11
                      pr-4
                      text-sm
                      outline-none
                      focus:border-[#502d13]
                      focus:ring-2
                      focus:ring-[#502d13]/10
                    "
                  />

                </div>

              </div>


              {/* LOCATION */}

              <div>

                <label
                  htmlFor="profile-location"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Location
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    id="profile-location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      py-3
                      pl-11
                      pr-4
                      text-sm
                      outline-none
                      focus:border-[#502d13]
                      focus:ring-2
                      focus:ring-[#502d13]/10
                    "
                  />

                </div>

              </div>

            </div>


            {/* MODAL FOOTER */}

            <div
              className="
                flex
                flex-col-reverse
                sm:flex-row
                gap-3
                sm:justify-end
                px-5
                sm:px-6
                py-4
                sm:py-5
                border-t
                border-gray-200
              "
            >

              {/* CANCEL */}

              <button
                type="button"
                onClick={handleCancel}
                className="
                  w-full
                  sm:w-auto
                  px-5
                  py-3
                  rounded-xl
                  border
                  border-gray-300
                  text-sm
                  font-semibold
                  text-gray-700
                  hover:bg-gray-50
                  transition
                "
              >
                Cancel
              </button>


              {/* SAVE */}

              <button
                type="button"
                onClick={handleSave}
                className="
                  w-full
                  sm:w-auto
                  px-5
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
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Profile;