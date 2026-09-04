// // components/Navbar.tsx
// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Menu, X, ChevronDown, User, LogIn, Package, Wrench, LogOut, 
//   ShoppingCart, Heart, Bell, Settings, ShoppingBag, UserCheck 
// } from 'lucide-react';
// import LoginModal from './LoginModal';
// import logo from "/logo.png";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);
//   const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
//   const [logoError, setLogoError] = useState(false);
  
//   // Dynamic feature state badges
//   const [cartCount] = useState(3);
//   const [wishlistCount] = useState(5);
//   const [ordersCount] = useState(2);
//   const [unreadNotifications] = useState(2);
//   const [showNotifications, setShowNotifications] = useState(false);

//   // Authentication state
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const [userName, setUserName] = useState<string>('');
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
//   const profileDropdownRef = useRef<HTMLDivElement>(null);
//   const notificationDropdownRef = useRef<HTMLDivElement>(null);
  
//   // Login modal state
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const isTouchDevice = useRef(
//     typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
//   ).current;

//   // Restore auth state from localStorage on mount
//   useEffect(() => {
//     const auth = localStorage.getItem('auth_user');
//     if (auth) {
//       try {
//         const { isLoggedIn, role, name } = JSON.parse(auth);
//         setIsLoggedIn(isLoggedIn === true);
//         setUserRole(role || null);
//         setUserName(name || '');
//       } catch (e) {}
//     }
//   }, []);

//   // Sync auth state to localStorage
//   useEffect(() => {
//     if (isLoggedIn) {
//       localStorage.setItem('auth_user', JSON.stringify({ isLoggedIn: true, role: userRole, name: userName }));
//     } else {
//       localStorage.removeItem('auth_user');
//     }
//   }, [isLoggedIn, userRole, userName]);

//   // Handle scroll, resize, and outside clicks
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("scroll", handleScroll);
//     window.addEventListener("resize", handleResize);

//     const handleClickOutside = (event: MouseEvent) => {
//       if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
//         setProfileDropdownOpen(false);
//       }
//       if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
//         setShowNotifications(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       window.removeEventListener("resize", handleResize);
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Close menus on Escape key
//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         setShowLoginModal(false);
//         setIsOpen(false);
//         setActiveMegaMenu(null);
//         setProfileDropdownOpen(false);
//         setShowNotifications(false);
//       }
//     };
//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, []);

//   // Lock body scroll during mobile drawer expansion
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "unset";
//     return () => { document.body.style.overflow = "unset"; };
//   }, [isOpen]);

//   const getDashboardLink = () => {
//     if (userRole === 'admin') return '/admin/dashboard';
//     if (userRole === 'seller') return '/seller/dashboard';
//     if (userRole === 'contractor') return '/contractor/dashboard';
//     if (userRole === 'rental') return '/rental/dashboard';
//     return '/member';
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUserRole(null);
//     setUserName('');
//     setProfileDropdownOpen(false);
//     localStorage.removeItem('auth_user');
//     localStorage.removeItem('isLoggedIn');
//     localStorage.removeItem('userType');
//     localStorage.removeItem('userName');
//     localStorage.removeItem('userEmail');
//     navigate('/');
//   };

//   const handleLoginSuccess = (role: string, name: string) => {
//     setIsLoggedIn(true);
//     setUserRole(role);
//     setUserName(name);
//     setShowLoginModal(false);
//   };

//   const scrollToSection = (sectionId: string) => {
//     if (location.pathname !== '/') {
//       navigate(`/#${sectionId}`);
//     } else {
//       const element = document.getElementById(sectionId);
//       if (element) element.scrollIntoView({ behavior: 'smooth' });
//     }
//     setIsOpen(false);
//   };

//   const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
//     e.preventDefault();
//     if (href.startsWith('#')) scrollToSection(href.substring(1));
//     else navigate(href);
//     setIsOpen(false);
//   };

//   const toggleMobileMenu = (label: string) => {
//     setMobileMenuOpen(mobileMenuOpen === label ? null : label);
//   };

//   const navLinks = [
//     {
//       label: "Services",
//       href: "#services",
//       icon: Package,
//       megaMenu: {
//         columns: [
//           {
//             title: "Construction Materials",
//             icon: Package,
//             links: [
//               { name: "Cement & Concrete", href: "/products/cement" },
//               { name: "Bricks & Blocks", href: "/products/bricks" },
//               { name: "Steel & TMT", href: "/products/steel" },
//               { name: "Sand & Aggregates", href: "/products/sand" },
//               { name: "Tiles & Flooring", href: "/products/tiles" },
//             ],
//           },
//           {
//             title: "Equipment Rental",
//             icon: Wrench,
//             links: [
//               { name: "JCB & Excavators", href: "/rentals?type=heavy" },
//               { name: "Cranes & Hoists", href: "/rentals?type=cranes" },
//               { name: "Scaffolding", href: "/rentals?type=scaffolding" },
//               { name: "Concrete Mixers", href: "/rentals?type=mixers" },
//               { name: "Power Tools", href: "/rentals?type=tools" },
//             ],
//           },
//           {
//             title: "Professional Services",
//             icon: User,
//             links: [
//               { name: "Contractors", href: "/contractors" },
//               { name: "Architects", href: "/contractors?type=architects" },
//               { name: "Electricians", href: "/contractors?type=electricians" },
//               { name: "Plumbers", href: "/contractors?type=plumbers" },
//               { name: "Interior Designers", href: "/contractors?type=interior" },
//             ],
//           },
//         ],
//       },
//     },
//     {
//       label: "Member",
//       href: "/member",
//       icon: User,
//     },
//     {
//       label: "Contact",
//       href: "#contact",
//       icon: null,
//     },
//   ];

//   const isDesktop = windowWidth >= 1024;

//   return (
//     <>
//       <motion.nav
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.5 }}
//         className={`fixed w-full z-50 transition-all duration-300 ${
//           isScrolled ? 'bg-[#502d13]/95 backdrop-blur-md shadow-lg' : 'bg-[#502d13]'
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
            
//             {/* Logo */}
//             <Link
//               to="/"
//               onClick={() => window.scrollTo(0, 0)}
//               className="flex items-center space-x-1 sm:space-x-2 group shrink-0"
//             >
//               <motion.div
//                 whileHover={{ rotate: 360 }}
//                 transition={{ duration: 0.5 }}
//                 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center overflow-hidden bg-[#e9ddc8]/10"
//               >
//                 {!logoError ? (
//                   <img
//                     src={logo}
//                     alt="Casa Terminal Logo"
//                     className="w-full h-full object-cover"
//                     onError={() => setLogoError(true)}
//                   />
//                 ) : (
//                   <span className="text-[#e9ddc8] font-bold text-sm sm:text-base md:text-xl">CT</span>
//                 )}
//               </motion.div>
//               <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#e9ddc8] group-hover:text-white transition-colors truncate max-w-[140px] sm:max-w-none">
//                 CASA TERMINAL
//               </span>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
//               {navLinks.map((link) => (
//                 <div
//                   key={link.label}
//                   className="relative"
//                   onMouseEnter={() => {
//                     if (!isTouchDevice && isDesktop && link.megaMenu) setActiveMegaMenu(link.label);
//                   }}
//                   onMouseLeave={() => {
//                     if (!isTouchDevice && isDesktop) setActiveMegaMenu(null);
//                   }}
//                 >
//                   {link.megaMenu ? (
//                     <button
//                       onClick={(e) => {
//                         if (isTouchDevice || !isDesktop) {
//                           setActiveMegaMenu(activeMegaMenu === link.label ? null : link.label);
//                           e.stopPropagation();
//                         } else {
//                           scrollToSection('services');
//                         }
//                       }}
//                       className="text-[#e9ddc8]/90 hover:text-white font-medium transition-colors relative group flex items-center gap-1 text-sm xl:text-base px-2 xl:px-3 py-2 rounded-md"
//                     >
//                       {link.label}
//                       <ChevronDown className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-300 ${activeMegaMenu === link.label ? 'rotate-180' : ''}`} />
//                       <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e9ddc8] transition-all group-hover:w-full"></span>
//                     </button>
//                   ) : (
//                     <a
//                       href={link.href}
//                       onClick={(e) => handleNavClick(e, link.href)}
//                       className="text-[#e9ddc8]/90 hover:text-white font-medium transition-colors relative group text-sm xl:text-base px-2 xl:px-3 py-2 rounded-md"
//                     >
//                       {link.label}
//                       <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e9ddc8] transition-all group-hover:w-full"></span>
//                     </a>
//                   )}

//                   {/* Mega Menu Dropdown */}
//                   <AnimatePresence>
//                     {link.megaMenu && activeMegaMenu === link.label && isDesktop && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 10 }}
//                         className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-screen max-w-[700px] bg-[#502d13] rounded-lg shadow-xl border border-[#e9ddc8]/20 overflow-hidden z-50"
//                       >
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 xl:p-6">
//                           {link.megaMenu.columns.map((column, idx) => {
//                             const Icon = column.icon;
//                             return (
//                               <div key={idx}>
//                                 <h4 className="font-semibold text-[#e9ddc8] mb-2 pb-1 border-b border-[#e9ddc8]/20 text-sm flex items-center gap-2">
//                                   {Icon && <Icon className="w-4 h-4" />}
//                                   {column.title}
//                                 </h4>
//                                 <ul className="space-y-1">
//                                   {column.links.map((item) => (
//                                     <li key={item.name}>
//                                       <Link
//                                         to={item.href}
//                                         className="text-[#e9ddc8]/70 hover:text-white text-xs transition-colors block hover:translate-x-1 py-1"
//                                         onClick={() => {
//                                           setActiveMegaMenu(null);
//                                           window.scrollTo(0, 0);
//                                         }}
//                                       >
//                                         {item.name}
//                                       </Link>
//                                     </li>
//                                   ))}
//                                 </ul>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               ))}
//             </div>

//             {/* Right Action Bar */}
//             <div className="flex items-center space-x-1">

//               {/* Header Action Icons Container - Hidden on Mobile (< md) */}
//               <div className="hidden md:flex items-center space-x-1 xl:space-x-2">
                
//                 {/* Wishlist Icon */}
//                <Link
//   to="/wishlist"
//   className="relative p-2 rounded-lg text-[#e9ddc8] hover:bg-[#e9ddc8]/10 transition-colors"
//   aria-label="Wishlist"
//   title="Wishlist"
// >
//   <Heart className="w-5 h-5" />

//   {/* Wishlist count */}
//   <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
//     12
//   </span>
// </Link>

              

//                 {/* Shopping Cart Icon */}
//                 <Link
//   to="/cart"
//   className="relative p-2 rounded-lg text-[#e9ddc8] hover:bg-[#e9ddc8]/10 transition-colors"
//   aria-label="Cart"
//   title="Cart"
// >
//   <ShoppingCart className="w-5 h-5" />

//   <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
//     2
//   </span>
// </Link>

//                 {/* Notifications Dropdown */}
//                 <div className="relative" ref={notificationDropdownRef}>
//                   <button
//                     onClick={() => setShowNotifications(!showNotifications)}
//                     className="relative p-2 rounded-lg text-[#e9ddc8] hover:bg-[#e9ddc8]/10 transition-colors"
//                     aria-label="Notifications"
//                     title="Notifications"
//                   >
//                     <Bell className="w-5 h-5 xl:w-6 xl:h-6" />
//                     {unreadNotifications > 0 && (
//                       <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#502d13]" />
//                     )}
//                   </button>

//                   <AnimatePresence>
//                     {showNotifications && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 10 }}
//                         className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-gray-800"
//                       >
//                         <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
//                           <span className="font-semibold text-sm">Notifications</span>
//                           <span className="text-xs text-[#502d13] bg-[#e9ddc8]/40 px-2 py-0.5 rounded-full font-medium">
//                             {unreadNotifications} new
//                           </span>
//                         </div>
//                         <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
//                           <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer text-xs">
//                             <p className="font-semibold text-gray-900">Order #3021 Shipped</p>
//                             <p className="text-gray-500 mt-0.5">Your cement bag order is on the way.</p>
//                             <span className="text-[10px] text-gray-400 mt-1 block">10 mins ago</span>
//                           </div>
//                           <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer text-xs">
//                             <p className="font-semibold text-gray-900">Quote Accepted</p>
//                             <p className="text-gray-500 mt-0.5">Contractor responded to your rental query.</p>
//                             <span className="text-[10px] text-gray-400 mt-1 block">2 hours ago</span>
//                           </div>
//                         </div>
//                         <Link
//                           to="/notifications"
//                           onClick={() => setShowNotifications(false)}
//                           className="block text-center text-xs text-[#502d13] font-semibold py-2 bg-gray-50 hover:bg-gray-100 border-t border-gray-100"
//                         >
//                           View all notifications
//                         </Link>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>


//                 {/* Login Icon */}
//                 <button
//                   onClick={() => setShowLoginModal(true)}
//                   className="p-2 rounded-lg text-[#e9ddc8] hover:bg-[#e9ddc8]/10 transition-colors flex items-center justify-center"
//                   aria-label="Login"
//                   title="Log In"
//                 >
//                   <LogIn className="w-5 h-5 xl:w-6 xl:h-6" />
//                 </button>

//                 {/* Profile Avatar Icon */}
//                 <div className="relative" ref={profileDropdownRef}>
//                   <button
//                     onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
//                     className="p-2 rounded-lg text-[#e9ddc8] hover:bg-[#e9ddc8]/10 transition-colors flex items-center justify-center"
//                     aria-label="Profile Menu"
//                     title="Profile"
//                   >
//                     <div className="w-7 h-7 bg-[#e9ddc8] rounded-full flex items-center justify-center border border-[#502d13]">
//                       <UserCheck className="w-4 h-4 text-[#502d13]" />
//                     </div>
//                   </button>

//                   <AnimatePresence>
//                     {profileDropdownOpen && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 10 }}
//                         className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-gray-800"
//                       >
//                         <div className="p-3 border-b bg-gray-50">
//                           <p className="font-semibold text-gray-800 text-sm truncate">{userName || 'Guest User'}</p>
//                           <p className="text-xs text-gray-500 capitalize">{userRole || 'Member'}</p>
//                         </div>
//                         <div className="p-1.5 space-y-0.5">
                        


//     <Link
//   to="/profile"
//   onClick={() => setProfileDropdownOpen(false)}
//   className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
// >
//   <UserCheck className="w-4 h-4 text-gray-500" />
//   <span>My Profile</span>
// </Link>
//                           <Link
//                             to={getDashboardLink()}
//                             onClick={() => setProfileDropdownOpen(false)}
//                             className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//                           >
//                             <User className="w-4 h-4 text-gray-500" /> Dashboard
//                           </Link>
//                          <Link
//   to="/orders"
//   onClick={() => setProfileDropdownOpen(false)}
//   className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
// >
//   <ShoppingBag className="w-4 h-4 text-gray-500" />
//   <span>My Orders</span>
// </Link>
//                           <Link
//                             to="/settings"
//                             onClick={() => setProfileDropdownOpen(false)}
//                             className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//                           >
//                             <Settings className="w-4 h-4 text-gray-500" /> Settings
//                           </Link>
//                         </div>
//                         {isLoggedIn && (
//                           <div className="p-1.5 border-t border-gray-100">
//                             <button
//                               onClick={handleLogout}
//                               className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
//                             >
//                               <LogOut className="w-4 h-4" /> Logout
//                             </button>
//                           </div>
//                         )}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>

//               </div>

//               {/* Desktop Member Button */}
//               {!isLoggedIn ? (
//                 <Link
//                   to="/member"
//                   onClick={() => setIsOpen(false)}
//                   className="hidden md:flex group items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#e9ddc8] text-[#502d13] hover:bg-white hover:shadow-md border border-[#d4c4a8] transition-all duration-200 font-medium text-sm ml-1"
//                 >
//                   <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//                   <span>Become a Member</span>
//                 </Link>
//               ) : (
//                 <button
//                   onClick={handleLogout}
//                   className="hidden md:flex group items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#e9ddc8] hover:text-white hover:bg-red-500/80 transition-all duration-200 font-medium text-sm ml-1"
//                 >
//                   <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
//                   <span>Logout</span>
//                 </button>
//               )}

//               {/* Mobile Hamburger Button */}
//               <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="md:hidden p-2 rounded-lg hover:bg-[#e9ddc8]/10 transition-colors ml-1"
//                 aria-label={isOpen ? "Close menu" : "Open menu"}
//               >
//                 {isOpen ? <X className="w-6 h-6 text-[#e9ddc8]" /> : <Menu className="w-6 h-6 text-[#e9ddc8]" />}
//               </button>

//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu Drawer */}
//         <AnimatePresence>
//           {isOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="md:hidden bg-[#502d13] border-t border-[#e9ddc8]/20 overflow-y-auto max-h-[calc(100vh-3.5rem)]"
//             >
//               <div className="px-4 py-4 space-y-3">
                
//                 {/* Mobile Quick Actions Grid */}
//                 <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#e9ddc8]/20">
//                   <Link
//                     to="/orders"
//                     onClick={() => setIsOpen(false)}
//                     className="flex items-center gap-2 p-2.5 rounded-lg bg-[#e9ddc8]/10 text-[#e9ddc8] text-xs font-medium"
//                   >
//                     <ShoppingBag className="w-4 h-4" /> My Orders ({ordersCount})
//                   </Link>
//                   <Link
//                     to="/wishlist"
//                     onClick={() => setIsOpen(false)}
//                     className="flex items-center gap-2 p-2.5 rounded-lg bg-[#e9ddc8]/10 text-[#e9ddc8] text-xs font-medium"
//                   >
//                     <Heart className="w-4 h-4" /> Wishlist ({wishlistCount})
//                   </Link>
//                   <Link
//                     to="/cart"
//                     onClick={() => setIsOpen(false)}
//                     className="flex items-center gap-2 p-2.5 rounded-lg bg-[#e9ddc8]/10 text-[#e9ddc8] text-xs font-medium"
//                   >
//                     <ShoppingCart className="w-4 h-4" /> Cart ({cartCount})
//                   </Link>
//                   <Link
//                     to="/notifications"
//                     onClick={() => setIsOpen(false)}
//                     className="flex items-center gap-2 p-2.5 rounded-lg bg-[#e9ddc8]/10 text-[#e9ddc8] text-xs font-medium"
//                   >
//                     <Bell className="w-4 h-4" /> Notifications ({unreadNotifications})
//                   </Link>
                  
//                   <Link
//                     to="/profile"
//                     onClick={() => setIsOpen(false)}
//                     className="flex items-center gap-2 p-2.5 rounded-lg bg-[#e9ddc8]/10 text-[#e9ddc8] text-xs font-medium"
//                   >
//                     <UserCheck className="w-4 h-4" /> Profile
//                   </Link>



//                   <Link
//                     to="/settings"
//                     onClick={() => setIsOpen(false)}
//                     className="flex items-center gap-2 p-2.5 rounded-lg bg-[#e9ddc8]/10 text-[#e9ddc8] text-xs font-medium"
//                   >
//                     <Settings className="w-4 h-4" /> Settings
//                   </Link>
//                 </div>

//                 {navLinks.map((link) => {
//                   const Icon = link.icon;
//                   return (
//                     <div key={link.label} className="border-b border-[#e9ddc8]/10 last:border-0">
//                       {link.megaMenu ? (
//                         <>
//                           <button
//                             onClick={() => {
//                               if (link.label === 'Services') toggleMobileMenu(link.label);
//                               else if (link.label === 'Member') { navigate('/member'); setIsOpen(false); }
//                               else toggleMobileMenu(link.label);
//                             }}
//                             className="w-full flex items-center justify-between py-2.5 text-[#e9ddc8] font-medium text-sm"
//                           >
//                             <span className="flex items-center gap-2">
//                               {Icon && <Icon className="w-4 h-4" />}
//                               {link.label}
//                             </span>
//                             {link.megaMenu && (
//                               <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileMenuOpen === link.label ? 'rotate-180' : ''}`} />
//                             )}
//                           </button>
//                           <AnimatePresence>
//                             {mobileMenuOpen === link.label && (
//                               <motion.div
//                                 initial={{ opacity: 0, height: 0 }}
//                                 animate={{ opacity: 1, height: 'auto' }}
//                                 exit={{ opacity: 0, height: 0 }}
//                                 className="overflow-hidden"
//                               >
//                                 <div className="pb-3 space-y-3">
//                                   {link.megaMenu.columns.map((column, idx) => {
//                                     const ColumnIcon = column.icon;
//                                     return (
//                                       <div key={idx}>
//                                         <h4 className="text-[#ece3d4] text-xs font-semibold mb-1 px-2 flex items-center gap-2">
//                                           {ColumnIcon && <ColumnIcon className="w-3.5 h-3.5" />}
//                                           {column.title}
//                                         </h4>
//                                         <ul className="space-y-1">
//                                           {column.links.map((item) => (
//                                             <li key={item.name}>
//                                               <Link
//                                                 to={item.href}
//                                                 className="block px-2 py-1.5 text-[#e9ddc8]/80 hover:bg-[#e9ddc8]/10 rounded-lg text-xs"
//                                                 onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}
//                                               >
//                                                 {item.name}
//                                               </Link>
//                                             </li>
//                                           ))}
//                                         </ul>
//                                       </div>
//                                     );
//                                   })}
//                                 </div>
//                               </motion.div>
//                             )}
//                           </AnimatePresence>
//                         </>
//                       ) : (
//                         <a
//                           href={link.href}
//                           onClick={(e) => { handleNavClick(e, link.href); setIsOpen(false); }}
//                           className="flex items-center gap-2 py-2.5 text-[#e9ddc8] font-medium hover:text-white text-sm"
//                         >
//                           {Icon && <Icon className="w-4 h-4" />}
//                           {link.label}
//                         </a>
//                       )}
//                     </div>
//                   );
//                 })}

//                 {/* Mobile Drawer Auth Actions */}
//                 <div className="pt-3 grid grid-cols-2 gap-2">
//                   {isLoggedIn ? (
//                     <>
//                       <Link
//                         to={getDashboardLink()}
//                         onClick={() => setIsOpen(false)}
//                         className="bg-[#e9ddc8] text-[#502d13] px-3 py-2 rounded-lg font-semibold text-center hover:bg-white flex items-center justify-center gap-1 text-xs"
//                       >
//                         <User className="w-3.5 h-3.5" /> Dashboard
//                       </Link>
//                       <button
//                         onClick={() => { handleLogout(); setIsOpen(false); }}
//                         className="bg-transparent border border-[#e9ddc8]/30 text-[#e9ddc8] px-3 py-2 rounded-lg font-semibold text-center hover:bg-[#e9ddc8]/10 flex items-center justify-center gap-1 text-xs"
//                       >
//                         <LogOut className="w-3.5 h-3.5" /> Logout
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <button
//                         onClick={() => { setShowLoginModal(true); setIsOpen(false); }}
//                         className="bg-transparent border border-[#e9ddc8] text-[#e9ddc8] px-3 py-2 rounded-lg font-semibold text-center hover:bg-[#e9ddc8]/10 flex items-center justify-center gap-1 text-xs"
//                       >
//                         <LogIn className="w-3.5 h-3.5" /> Log In
//                       </button>
//                       <Link
//                         to="/member"
//                         onClick={() => setIsOpen(false)}
//                         className="bg-[#e9ddc8] text-[#502d13] px-3 py-2 rounded-lg font-semibold text-center hover:bg-white flex items-center justify-center gap-1 text-xs"
//                       >
//                         <UserCheck className="w-3.5 h-3.5" /> Join
//                       </Link>
//                     </>
//                   )}
//                 </div>

//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.nav>

//       {/* Login Modal */}
//       <LoginModal
//         isOpen={showLoginModal}
//         onClose={() => setShowLoginModal(false)}
//         onLoginSuccess={handleLoginSuccess}
//       />

//       {/* Overlay */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 z-40 md:hidden"
//             onClick={() => setIsOpen(false)}
//           />
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default Navbar;



// components/layout/Navbar.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Menu,
  X,
  ChevronDown,
  User,
  LogIn,
  Package,
  Wrench,
  LogOut,
  ShoppingCart,
  Heart,
  Bell,
  Settings,
  ShoppingBag,
  UserCheck,
} from "lucide-react";

import LoginModal from "./LoginModal";
import logo from "/logo.png";

// ============================================================
// NAVBAR
// ============================================================

const Navbar: React.FC = () => {
  // ==========================================================
  // BASIC NAVBAR STATE
  // ==========================================================

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [activeMegaMenu, setActiveMegaMenu] =
    useState<string | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState<string | null>(null);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined"
      ? window.innerWidth
      : 0
  );

  const [logoError, setLogoError] = useState(false);

  // ==========================================================
  // COUNTS
  // ==========================================================

  const [cartCount] = useState(2);
  const [wishlistCount] = useState(12);
  const [ordersCount] = useState(2);
  const [unreadNotifications] = useState(2);

  // ==========================================================
  // DROPDOWN STATE
  // ==========================================================

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [profileDropdownOpen, setProfileDropdownOpen] =
    useState(false);

  // ==========================================================
  // AUTH STATE
  // ==========================================================

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [userRole, setUserRole] =
    useState<string | null>(null);

  const [userName, setUserName] =
    useState<string>("");

  // ==========================================================
  // LOGIN MODAL
  // ==========================================================

  const [showLoginModal, setShowLoginModal] =
    useState(false);

  // ==========================================================
  // REFS
  // ==========================================================

  const profileDropdownRef =
    useRef<HTMLDivElement>(null);

  const notificationDropdownRef =
    useRef<HTMLDivElement>(null);

  const isTouchDevice = useRef(
    typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0)
  ).current;

  // ==========================================================
  // ROUTER
  // ==========================================================

  const location = useLocation();
  const navigate = useNavigate();

  // ==========================================================
  // LOAD AUTH DATA
  // ==========================================================

  useEffect(() => {
    try {
      // Primary storage used by App.tsx
      const casaUser = localStorage.getItem(
        "casa_terminal_user"
      );

      // Existing Navbar storage fallback
      const authUser = localStorage.getItem(
        "auth_user"
      );

      const savedUser =
        casaUser || authUser;

      if (!savedUser) {
        setIsLoggedIn(false);
        setUserRole(null);
        setUserName("");
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      setIsLoggedIn(
        parsedUser.isLoggedIn === true ||
          Boolean(casaUser)
      );

      setUserRole(
        parsedUser.role ||
          parsedUser.userType ||
          null
      );

      setUserName(
        parsedUser.name ||
          parsedUser.userName ||
          ""
      );
    } catch (error) {
      console.error(
        "Unable to restore authentication:",
        error
      );

      setIsLoggedIn(false);
      setUserRole(null);
      setUserName("");
    }
  }, []);

  // ==========================================================
  // SYNC AUTH DATA
  // ==========================================================

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    try {
      const userData = {
        isLoggedIn: true,
        role: userRole,
        name: userName,
      };

      localStorage.setItem(
        "auth_user",
        JSON.stringify(userData)
      );

      localStorage.setItem(
        "casa_terminal_user",
        JSON.stringify(userData)
      );
    } catch (error) {
      console.error(
        "Unable to save authentication:",
        error
      );
    }
  }, [
    isLoggedIn,
    userRole,
    userName,
  ]);

  // ==========================================================
  // SCROLL + RESIZE + OUTSIDE CLICK
  // ==========================================================

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(
        window.scrollY > 20
      );
    };

    const handleResize = () => {
      setWindowWidth(
        window.innerWidth
      );
    };

    const handleClickOutside = (
      event: MouseEvent
    ) => {
      const target =
        event.target as Node;

      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(
          target
        )
      ) {
        setProfileDropdownOpen(false);
      }

      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(
          target
        )
      ) {
        setShowNotifications(false);
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================================
  // ESCAPE KEY
  // ==========================================================

  useEffect(() => {
    const handleEsc = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setShowLoginModal(false);
        setIsOpen(false);
        setActiveMegaMenu(null);
        setMobileMenuOpen(null);
        setProfileDropdownOpen(false);
        setShowNotifications(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleEsc
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEsc
      );
    };
  }, []);

  // ==========================================================
  // LOCK BODY SCROLL ON MOBILE
  // ==========================================================

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "unset";
    }

    return () => {
      document.body.style.overflow =
        "unset";
    };
  }, [isOpen]);

  // ==========================================================
  // DASHBOARD LINK
  // ==========================================================

  const getDashboardLink = () => {
    switch (userRole) {
      case "admin":
        return "/admin/dashboard";

      case "seller":
        return "/seller/dashboard";

      case "contractor":
        return "/contractor/dashboard";

      case "rental":
        return "/rental/dashboard";

      default:
        return "/member";
    }
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName("");

    setProfileDropdownOpen(false);
    setShowNotifications(false);
    setIsOpen(false);

    // Remove all supported auth keys
    localStorage.removeItem(
      "auth_user"
    );

    localStorage.removeItem(
      "casa_terminal_user"
    );

    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "userType"
    );

    localStorage.removeItem(
      "userName"
    );

    localStorage.removeItem(
      "userEmail"
    );

    navigate("/");
  };

  // ==========================================================
  // LOGIN SUCCESS
  // ==========================================================

  const handleLoginSuccess = (
    role: string,
    name: string
  ) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(name);

    setShowLoginModal(false);

    const userData = {
      isLoggedIn: true,
      role,
      name,
    };

    localStorage.setItem(
      "auth_user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "casa_terminal_user",
      JSON.stringify(userData)
    );
  };

  // ==========================================================
  // SCROLL TO SECTION
  // ==========================================================

  const scrollToSection = (
    sectionId: string
  ) => {
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
    } else {
      const element =
        document.getElementById(
          sectionId
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
        });
      }
    }

    setIsOpen(false);
    setActiveMegaMenu(null);
  };

  // ==========================================================
  // NAVIGATION CLICK
  // ==========================================================

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();

    if (href.startsWith("#")) {
      scrollToSection(
        href.substring(1)
      );
    } else {
      navigate(href);
      setIsOpen(false);
    }
  };

  // ==========================================================
  // MOBILE MENU TOGGLE
  // ==========================================================

  const toggleMobileMenu = (
    label: string
  ) => {
    setMobileMenuOpen(
      mobileMenuOpen === label
        ? null
        : label
    );
  };

  // ==========================================================
  // NAVIGATION LINKS
  // ==========================================================

  const navLinks = [
    {
      label: "Services",
      href: "#services",
      icon: Package,

      megaMenu: {
        columns: [
          {
            title:
              "Construction Materials",
            icon: Package,

            links: [
              {
                name: "Cement & Concrete",
                href: "/products/cement",
              },
              {
                name: "Bricks & Blocks",
                href: "/products/bricks",
              },
              {
                name: "Steel & TMT",
                href: "/products/steel",
              },
              {
                name: "Sand & Aggregates",
                href: "/products/sand",
              },
              {
                name: "Tiles & Flooring",
                href: "/products/tiles",
              },
            ],
          },

          {
            title:
              "Equipment Rental",
            icon: Wrench,

            links: [
              {
                name: "JCB & Excavators",
                href: "/rentals?type=heavy",
              },
              {
                name: "Cranes & Hoists",
                href: "/rentals?type=cranes",
              },
              {
                name: "Scaffolding",
                href: "/rentals?type=scaffolding",
              },
              {
                name: "Concrete Mixers",
                href: "/rentals?type=mixers",
              },
              {
                name: "Power Tools",
                href: "/rentals?type=tools",
              },
            ],
          },

          {
            title:
              "Professional Services",
            icon: User,

            links: [
              {
                name: "Contractors",
                href: "/contractors",
              },
              {
                name: "Architects",
                href: "/contractors?type=architects",
              },
              {
                name: "Electricians",
                href: "/contractors?type=electricians",
              },
              {
                name: "Plumbers",
                href: "/contractors?type=plumbers",
              },
              {
                name: "Interior Designers",
                href: "/contractors?type=interior",
              },
            ],
          },
        ],
      },
    },

    {
      label: "Member",
      href: "/member",
      icon: User,
    },

    {
      label: "Contact",
      href: "#contact",
      icon: null,
    },
  ];

  const isDesktop =
    windowWidth >= 1024;

  // ==========================================================
  // JSX
  // ==========================================================

  return (
    <>
      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.5,
        }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#502d13]/95 backdrop-blur-md shadow-lg"
            : "bg-[#502d13]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">

            {/* ==================================================
                LOGO
            ================================================== */}

            <Link
              to="/"
              onClick={() => {
                setIsOpen(false);
                setActiveMegaMenu(null);
                window.scrollTo(
                  0,
                  0
                );
              }}
              className="flex items-center space-x-1 sm:space-x-2 group shrink-0"
            >
              <motion.div
                whileHover={{
                  rotate: 360,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center overflow-hidden bg-[#e9ddc8]/10"
              >
                {!logoError ? (
                  <img
                    src={logo}
                    alt="Casa Terminal Logo"
                    className="w-full h-full object-cover"
                    onError={() =>
                      setLogoError(true)
                    }
                  />
                ) : (
                  <span className="text-[#e9ddc8] font-bold text-sm sm:text-base md:text-xl">
                    CT
                  </span>
                )}
              </motion.div>

              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#e9ddc8] group-hover:text-white transition-colors truncate max-w-[140px] sm:max-w-none">
                CASA TERMINAL
              </span>
            </Link>

            {/* ==================================================
                DESKTOP NAVIGATION
            ================================================== */}

            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">

              {navLinks.map(
                (link) => (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => {
                      if (
                        !isTouchDevice &&
                        isDesktop &&
                        link.megaMenu
                      ) {
                        setActiveMegaMenu(
                          link.label
                        );
                      }
                    }}
                    onMouseLeave={() => {
                      if (
                        !isTouchDevice &&
                        isDesktop
                      ) {
                        setActiveMegaMenu(
                          null
                        );
                      }
                    }}
                  >

                    {/* ==================================================
                        MEGA MENU LINK
                    ================================================== */}

                    {link.megaMenu ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          if (
                            isTouchDevice ||
                            !isDesktop
                          ) {
                            setActiveMegaMenu(
                              activeMegaMenu ===
                                link.label
                                ? null
                                : link.label
                            );

                            event.stopPropagation();
                          } else {
                            scrollToSection(
                              "services"
                            );
                          }
                        }}
                        className="text-[#e9ddc8]/90 hover:text-white font-medium transition-colors relative group flex items-center gap-1 text-sm xl:text-base px-2 xl:px-3 py-2 rounded-md"
                      >
                        {link.label}

                        <ChevronDown
                          className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-300 ${
                            activeMegaMenu ===
                            link.label
                              ? "rotate-180"
                              : ""
                          }`}
                        />

                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e9ddc8] transition-all group-hover:w-full" />
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        onClick={(event) =>
                          handleNavClick(
                            event,
                            link.href
                          )
                        }
                        className="text-[#e9ddc8]/90 hover:text-white font-medium transition-colors relative group text-sm xl:text-base px-2 xl:px-3 py-2 rounded-md"
                      >
                        {link.label}

                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e9ddc8] transition-all group-hover:w-full" />
                      </a>
                    )}

                    {/* ==================================================
                        MEGA MENU
                    ================================================== */}

                    <AnimatePresence>
                      {link.megaMenu &&
                        activeMegaMenu ===
                          link.label &&
                        isDesktop && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: 10,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: 10,
                            }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-screen max-w-[700px] bg-[#502d13] rounded-lg shadow-xl border border-[#e9ddc8]/20 overflow-hidden z-50"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 xl:p-6">

                              {link.megaMenu.columns.map(
                                (
                                  column,
                                  index
                                ) => {
                                  const Icon =
                                    column.icon;

                                  return (
                                    <div
                                      key={`${column.title}-${index}`}
                                    >
                                      <h4 className="font-semibold text-[#e9ddc8] mb-2 pb-1 border-b border-[#e9ddc8]/20 text-sm flex items-center gap-2">
                                        {Icon && (
                                          <Icon className="w-4 h-4" />
                                        )}

                                        {column.title}
                                      </h4>

                                      <ul className="space-y-1">
                                        {column.links.map(
                                          (
                                            item
                                          ) => (
                                            <li
                                              key={
                                                item.name
                                              }
                                            >
                                              <Link
                                                to={
                                                  item.href
                                                }
                                                className="text-[#e9ddc8]/70 hover:text-white text-xs transition-colors block hover:translate-x-1 py-1"
                                                onClick={() => {
                                                  setActiveMegaMenu(
                                                    null
                                                  );

                                                  window.scrollTo(
                                                    0,
                                                    0
                                                  );
                                                }}
                                              >
                                                {
                                                  item.name
                                                }
                                              </Link>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  );
                                }
                              )}

                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                )
              )}

            </div>

            {/* ==================================================
                RIGHT ACTION BAR
            ================================================== */}

            <div className="flex items-center space-x-1">

              {/* ==================================================
                  DESKTOP ACTION ICONS
              ================================================== */}

              <div className="hidden md:flex items-center space-x-1 xl:space-x-2">

                {/* ==================================================
                    WISHLIST
                ================================================== */}

                <Link
                  to="/wishlist"
                  className="relative p-2 rounded-lg text-[#e9ddc8] hover:bg-[#e9ddc8]/10 transition-colors"
                  aria-label="Wishlist"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5 xl:w-6 xl:h-6" />

                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* ==================================================
                    CART
                ================================================== */}

                <Link
                  to="/cart"
                  className="relative p-2 rounded-lg text-[#e9ddc8] hover:bg-[#e9ddc8]/10 transition-colors"
                  aria-label="Cart"
                  title="Cart"
                >
                  <ShoppingCart className="w-5 h-5 xl:w-6 xl:h-6" />

                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* ==================================================
                    NOTIFICATIONS
                ================================================== */}

                <div
                  className="relative"
                  ref={
                    notificationDropdownRef
                  }
                >
                  <button
                    type="button"
                    onClick={() =>
                      setShowNotifications(
                        !showNotifications
                      )
                    }
                    className="relative p-2 rounded-lg text-[#e9ddc8] hover:bg-[#e9ddc8]/10 transition-colors"
                    aria-label="Notifications"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5 xl:w-6 xl:h-6" />

                    {unreadNotifications >
                      0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#502d13]" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: 10,
                        }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-gray-800"
                      >

                        <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                          <span className="font-semibold text-sm">
                            Notifications
                          </span>

                          <span className="text-xs text-[#502d13] bg-[#e9ddc8]/40 px-2 py-0.5 rounded-full font-medium">
                            {
                              unreadNotifications
                            }{" "}
                            new
                          </span>
                        </div>

                        <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">

                          <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer text-xs">
                            <p className="font-semibold text-gray-900">
                              Order #3021
                              Shipped
                            </p>

                            <p className="text-gray-500 mt-0.5">
                              Your cement
                              bag order is
                              on the way.
                            </p>

                            <span className="text-[10px] text-gray-400 mt-1 block">
                              10 mins ago
                            </span>
                          </div>

                          <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer text-xs">
                            <p className="font-semibold text-gray-900">
                              Quote Accepted
                            </p>

                            <p className="text-gray-500 mt-0.5">
                              Contractor
                              responded to
                              your query.
                            </p>

                            <span className="text-[10px] text-gray-400 mt-1 block">
                              2 hours ago
                            </span>
                          </div>

                        </div>

                        <Link
                          to="/notifications"
                          onClick={() =>
                            setShowNotifications(
                              false
                            )
                          }
                          className="block text-center text-xs text-[#502d13] font-semibold py-2 bg-gray-50 hover:bg-gray-100 border-t border-gray-100"
                        >
                          View all
                          notifications
                        </Link>

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ==================================================
                    LOGIN
                ================================================== */}

                {!isLoggedIn && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowLoginModal(true)
                    }
                    className="p-2 rounded-lg text-[#e9ddc8] hover:bg-[#e9ddc8]/10 transition-colors flex items-center justify-center"
                    aria-label="Login"
                    title="Log In"
                  >
                    <LogIn className="w-5 h-5 xl:w-6 xl:h-6" />
                  </button>
                )}

                {/* ==================================================
                    PROFILE
                ================================================== */}

                <div
                  className="relative"
                  ref={
                    profileDropdownRef
                  }
                >
                  <button
                    type="button"
                    onClick={() =>
                      setProfileDropdownOpen(
                        !profileDropdownOpen
                      )
                    }
                    className="p-2 rounded-lg text-[#e9ddc8] hover:bg-[#e9ddc8]/10 transition-colors flex items-center justify-center"
                    aria-label="Profile Menu"
                    title="Profile"
                  >
                    <div className="w-7 h-7 bg-[#e9ddc8] rounded-full flex items-center justify-center border border-[#502d13]">
                      <UserCheck className="w-4 h-4 text-[#502d13]" />
                    </div>
                  </button>

                  {/* ==================================================
                      PROFILE DROPDOWN
                  ================================================== */}

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: 10,
                        }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-gray-800"
                      >

                        {/* USER INFO */}

                        <div className="p-3 border-b bg-gray-50">
                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {userName ||
                              "Guest User"}
                          </p>

                          <p className="text-xs text-gray-500 capitalize">
                            {userRole ||
                              "Member"}
                          </p>
                        </div>

                        {/* PROFILE LINKS */}

                        <div className="p-1.5 space-y-0.5">

                          {/* ==================================================
                              MY PROFILE
                          ================================================== */}

                          <Link
                            to="/profile"
                            onClick={() =>
                              setProfileDropdownOpen(
                                false
                              )
                            }
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <UserCheck className="w-4 h-4 text-gray-500" />

                            <span>
                              My Profile
                            </span>
                          </Link>

                          {/* ==================================================
                              DASHBOARD
                          ================================================== */}

                          <Link
                            to={getDashboardLink()}
                            onClick={() =>
                              setProfileDropdownOpen(
                                false
                              )
                            }
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4 text-gray-500" />

                            <span>
                              Dashboard
                            </span>
                          </Link>

                          {/* ==================================================
                              MY ORDERS
                          ================================================== */}

                          <Link
                            to="/orders"
                            onClick={() =>
                              setProfileDropdownOpen(
                                false
                              )
                            }
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4 text-gray-500" />

                            <span>
                              My Orders
                            </span>
                          </Link>

                          {/* ==================================================
                              WISHLIST
                          ================================================== */}

                          <Link
                            to="/wishlist"
                            onClick={() =>
                              setProfileDropdownOpen(
                                false
                              )
                            }
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Heart className="w-4 h-4 text-gray-500" />

                            <span>
                              Wishlist
                            </span>
                          </Link>

                          {/* ==================================================
                              CART
                          ================================================== */}

                          <Link
                            to="/cart"
                            onClick={() =>
                              setProfileDropdownOpen(
                                false
                              )
                            }
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <ShoppingCart className="w-4 h-4 text-gray-500" />

                            <span>
                              Cart
                            </span>
                          </Link>

                          {/* ==================================================
                              SETTINGS
                              FIXED
                          ================================================== */}

                          <Link
                            to="/settings"
                            onClick={() =>
                              setProfileDropdownOpen(
                                false
                              )
                            }
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Settings className="w-4 h-4 text-gray-500" />

                            <span>
                              Settings
                            </span>
                          </Link>

                        </div>

                        {/* ==================================================
                            LOGOUT
                        ================================================== */}

                        {isLoggedIn && (
                          <div className="p-1.5 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={
                                handleLogout
                              }
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                              <LogOut className="w-4 h-4" />

                              <span>
                                Logout
                              </span>
                            </button>
                          </div>
                        )}

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* ==================================================
                  DESKTOP MEMBER / LOGOUT BUTTON
              ================================================== */}

              {!isLoggedIn ? (
                <Link
                  to="/member"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className="hidden md:flex group items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#e9ddc8] text-[#502d13] hover:bg-white hover:shadow-md border border-[#d4c4a8] transition-all duration-200 font-medium text-sm ml-1"
                >
                  <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />

                  <span>
                    Become a Member
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="hidden md:flex group items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#e9ddc8] hover:text-white hover:bg-red-500/80 transition-all duration-200 font-medium text-sm ml-1"
                >
                  <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />

                  <span>
                    Logout
                  </span>
                </button>
              )}

              {/* ==================================================
                  MOBILE HAMBURGER
              ================================================== */}

              <button
                type="button"
                onClick={() =>
                  setIsOpen(!isOpen)
                }
                className="md:hidden p-2 rounded-lg hover:bg-[#e9ddc8]/10 transition-colors ml-1"
                aria-label={
                  isOpen
                    ? "Close menu"
                    : "Open menu"
                }
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-[#e9ddc8]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#e9ddc8]" />
                )}
              </button>

            </div>
          </div>
        </div>

        {/* ======================================================
            MOBILE MENU
        ====================================================== */}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="md:hidden bg-[#502d13] border-t border-[#e9ddc8]/20 overflow-y-auto max-h-[calc(100vh-3.5rem)]"
            >
              <div className="px-4 py-4 space-y-3">

                {/* ==================================================
                    MOBILE QUICK ACTIONS
                ================================================== */}

                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#e9ddc8]/20">

                  {/* Orders */}

                  <Link
                    to="/orders"
                    onClick={() =>
                      setIsOpen(false)
                    }
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#e9ddc8]/10 text-[#e9ddc8] text-xs font-medium"
                  >
                    <ShoppingBag className="w-4 h-4" />

                    My Orders (
                    {ordersCount}
                    )
                  </Link>

                  {/* Wishlist */}

                  <Link
                    to="/wishlist"
                    onClick={() =>
                      setIsOpen(false)
                    }
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#e9ddc8]/10 text-[#e9ddc8] text-xs font-medium"
                  >
                    <Heart className="w-4 h-4" />

                    Wishlist (
                    {wishlistCount}
                    )
                  </Link>

                  {/* Cart */}

                  <Link
                    to="/cart"
                    onClick={() =>
                      setIsOpen(false)
                    }
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#e9ddc8]/10 text-[#e9ddc8] text-xs font-medium"
                  >
                    <ShoppingCart className="w-4 h-4" />

                    Cart (
                    {cartCount}
                    )
                  </Link>

                  {/* Notifications */}

                  <Link
                    to="/notifications"
                    onClick={() =>
                      setIsOpen(false)
                    }
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#e9ddc8]/10 text-[#e9ddc8] text-xs font-medium"
                  >
                    <Bell className="w-4 h-4" />

                    Notifications (
                    {
                      unreadNotifications
                    }
                    )
                  </Link>

                  {/* Profile */}

                  <Link
                    to="/profile"
                    onClick={() =>
                      setIsOpen(false)
                    }
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#e9ddc8]/10 text-[#e9ddc8] text-xs font-medium"
                  >
                    <UserCheck className="w-4 h-4" />

                    Profile
                  </Link>

                  {/* Settings */}

                  <Link
                    to="/settings"
                    onClick={() =>
                      setIsOpen(false)
                    }
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#e9ddc8]/10 text-[#e9ddc8] text-xs font-medium"
                  >
                    <Settings className="w-4 h-4" />

                    Settings
                  </Link>

                </div>

                {/* ==================================================
                    MOBILE NAVIGATION
                ================================================== */}

                {navLinks.map(
                  (link) => {
                    const Icon =
                      link.icon;

                    return (
                      <div
                        key={link.label}
                        className="border-b border-[#e9ddc8]/10 last:border-0"
                      >

                        {link.megaMenu ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  link.label ===
                                  "Services"
                                ) {
                                  toggleMobileMenu(
                                    link.label
                                  );
                                } else {
                                  navigate(
                                    link.href
                                  );

                                  setIsOpen(
                                    false
                                  );
                                }
                              }}
                              className="w-full flex items-center justify-between py-2.5 text-[#e9ddc8] font-medium text-sm"
                            >
                              <span className="flex items-center gap-2">
                                {Icon && (
                                  <Icon className="w-4 h-4" />
                                )}

                                {link.label}
                              </span>

                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-300 ${
                                  mobileMenuOpen ===
                                  link.label
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>

                            {/* MOBILE MEGA MENU */}

                            <AnimatePresence>
                              {mobileMenuOpen ===
                                link.label && (
                                <motion.div
                                  initial={{
                                    opacity: 0,
                                    height: 0,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    height: "auto",
                                  }}
                                  exit={{
                                    opacity: 0,
                                    height: 0,
                                  }}
                                  className="overflow-hidden"
                                >
                                  <div className="pb-3 space-y-3">

                                    {link.megaMenu.columns.map(
                                      (
                                        column,
                                        index
                                      ) => {
                                        const ColumnIcon =
                                          column.icon;

                                        return (
                                          <div
                                            key={`${column.title}-${index}`}
                                          >
                                            <h4 className="text-[#ece3d4] text-xs font-semibold mb-1 px-2 flex items-center gap-2">
                                              {ColumnIcon && (
                                                <ColumnIcon className="w-3.5 h-3.5" />
                                              )}

                                              {
                                                column.title
                                              }
                                            </h4>

                                            <ul className="space-y-1">
                                              {column.links.map(
                                                (
                                                  item
                                                ) => (
                                                  <li
                                                    key={
                                                      item.name
                                                    }
                                                  >
                                                    <Link
                                                      to={
                                                        item.href
                                                      }
                                                      className="block px-2 py-1.5 text-[#e9ddc8]/80 hover:bg-[#e9ddc8]/10 rounded-lg text-xs"
                                                      onClick={() => {
                                                        setIsOpen(
                                                          false
                                                        );

                                                        setMobileMenuOpen(
                                                          null
                                                        );

                                                        window.scrollTo(
                                                          0,
                                                          0
                                                        );
                                                      }}
                                                    >
                                                      {
                                                        item.name
                                                      }
                                                    </Link>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        );
                                      }
                                    )}

                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <a
                            href={
                              link.href
                            }
                            onClick={(
                              event
                            ) => {
                              handleNavClick(
                                event,
                                link.href
                              );

                              setIsOpen(
                                false
                              );
                            }}
                            className="flex items-center gap-2 py-2.5 text-[#e9ddc8] font-medium hover:text-white text-sm"
                          >
                            {Icon && (
                              <Icon className="w-4 h-4" />
                            )}

                            {link.label}
                          </a>
                        )}

                      </div>
                    );
                  }
                )}

                {/* ==================================================
                    MOBILE AUTH
                ================================================== */}

                <div className="pt-3 grid grid-cols-2 gap-2">

                  {isLoggedIn ? (
                    <>
                      {/* Dashboard */}

                      <Link
                        to={getDashboardLink()}
                        onClick={() =>
                          setIsOpen(false)
                        }
                        className="bg-[#e9ddc8] text-[#502d13] px-3 py-2 rounded-lg font-semibold text-center hover:bg-white flex items-center justify-center gap-1 text-xs"
                      >
                        <User className="w-3.5 h-3.5" />

                        Dashboard
                      </Link>

                      {/* Logout */}

                      <button
                        type="button"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(
                            false
                          );
                        }}
                        className="bg-transparent border border-[#e9ddc8]/30 text-[#e9ddc8] px-3 py-2 rounded-lg font-semibold text-center hover:bg-[#e9ddc8]/10 flex items-center justify-center gap-1 text-xs"
                      >
                        <LogOut className="w-3.5 h-3.5" />

                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Login */}

                      <button
                        type="button"
                        onClick={() => {
                          setShowLoginModal(
                            true
                          );

                          setIsOpen(
                            false
                          );
                        }}
                        className="bg-transparent border border-[#e9ddc8] text-[#e9ddc8] px-3 py-2 rounded-lg font-semibold text-center hover:bg-[#e9ddc8]/10 flex items-center justify-center gap-1 text-xs"
                      >
                        <LogIn className="w-3.5 h-3.5" />

                        Log In
                      </button>

                      {/* Join */}

                      <Link
                        to="/member"
                        onClick={() =>
                          setIsOpen(false)
                        }
                        className="bg-[#e9ddc8] text-[#502d13] px-3 py-2 rounded-lg font-semibold text-center hover:bg-white flex items-center justify-center gap-1 text-xs"
                      >
                        <UserCheck className="w-3.5 h-3.5" />

                        Join
                      </Link>
                    </>
                  )}

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ========================================================
          LOGIN MODAL
      ======================================================== */}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() =>
          setShowLoginModal(false)
        }
        onLoginSuccess={
          handleLoginSuccess
        }
      />

      {/* ========================================================
          MOBILE OVERLAY
      ======================================================== */}

      <AnimatePresence>
        {isOpen && (
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
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() =>
              setIsOpen(false)
            }
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;