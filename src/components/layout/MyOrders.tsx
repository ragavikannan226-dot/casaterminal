import React, { useMemo, useState } from "react";
import {
  Package,
  ArrowLeft,
  Search,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  RotateCcw,
  ShoppingBag,
  MapPin,
  CalendarDays,
  CreditCard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type OrderStatus =
  | "Delivered"
  | "Shipped"
  | "Processing"
  | "Cancelled";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  payment: string;
  deliveryDate?: string;
  address: string;
  items: OrderItem[];
  total: number;
}

/* =========================================================
   SAMPLE ORDERS
========================================================= */

const SAMPLE_ORDERS: Order[] = [
  {
    id: "CT-2026-1001",
    date: "04 Sep 2026",
    status: "Delivered",
    payment: "Paid Online",
    deliveryDate: "03 Sep 2026",
    address: "Chennai, Tamil Nadu",
    items: [
      {
        id: 1,
        name: "Premium Cement 50kg",
        price: 420,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1513467655676-561b7d489b88?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: 2,
        name: "Safety Helmet",
        price: 350,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=600&q=80",
      },
    ],
    total: 1180,
  },

  {
    id: "CT-2026-1002",
    date: "02 Sep 2026",
    status: "Shipped",
    payment: "Paid Online",
    deliveryDate: "06 Sep 2026",
    address: "Coimbatore, Tamil Nadu",
    items: [
      {
        id: 3,
        name: "Power Drill Machine",
        price: 2850,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
      },
    ],
    total: 2850,
  },

  {
    id: "CT-2026-1003",
    date: "31 Aug 2026",
    status: "Processing",
    payment: "Cash on Delivery",
    address: "Madurai, Tamil Nadu",
    items: [
      {
        id: 4,
        name: "Steel Construction Rod",
        price: 680,
        quantity: 3,
        image:
          "https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=600&q=80",
      },
    ],
    total: 2040,
  },

  {
    id: "CT-2026-1004",
    date: "25 Aug 2026",
    status: "Cancelled",
    payment: "Paid Online",
    address: "Chennai, Tamil Nadu",
    items: [
      {
        id: 5,
        name: "Construction Measuring Tape",
        price: 450,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80",
      },
    ],
    total: 450,
  },

  {
    id: "CT-2026-1005",
    date: "18 Aug 2026",
    status: "Delivered",
    payment: "Paid Online",
    deliveryDate: "21 Aug 2026",
    address: "Salem, Tamil Nadu",
    items: [
      {
        id: 6,
        name: "Construction Safety Gloves",
        price: 280,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: 7,
        name: "Safety Goggles",
        price: 320,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
      },
    ],
    total: 880,
  },
];

/* =========================================================
   STATUS CONFIG
========================================================= */

const statusConfig: Record<
  OrderStatus,
  {
    icon: React.ElementType;
    className: string;
    bgClass: string;
  }
> = {
  Delivered: {
    icon: CheckCircle,
    className: "text-green-700",
    bgClass: "bg-green-100",
  },

  Shipped: {
    icon: Truck,
    className: "text-blue-700",
    bgClass: "bg-blue-100",
  },

  Processing: {
    icon: Clock,
    className: "text-yellow-700",
    bgClass: "bg-yellow-100",
  },

  Cancelled: {
    icon: XCircle,
    className: "text-red-700",
    bgClass: "bg-red-100",
  },
};

/* =========================================================
   MY ORDERS
========================================================= */

const MyOrders: React.FC = () => {
  const navigate = useNavigate();

  const [orders] = useState<Order[]>(SAMPLE_ORDERS);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStatus, setSelectedStatus] =
    useState<"All" | OrderStatus>("All");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  /* =======================================================
     FILTER ORDERS
  ======================================================= */

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.items.some((item) =>
          item.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        selectedStatus === "All" ||
        order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  /* =======================================================
     FORMAT PRICE
  ======================================================= */

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  /* =======================================================
     STATUS COUNTS
  ======================================================= */

  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const shippedCount = orders.filter(
    (order) => order.status === "Shipped"
  ).length;

  const processingCount = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#8b6f47]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8b6f47]/10">
                <Package className="h-6 w-6 text-[#8b6f47]" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  My Orders
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Track and manage your orders
                </p>
              </div>

            </div>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8b6f47] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#735b3c]"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>

          </div>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">

          {/* All */}

          <button
            type="button"
            onClick={() => setSelectedStatus("All")}
            className={`rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md ${
              selectedStatus === "All"
                ? "border-[#8b6f47] ring-1 ring-[#8b6f47]"
                : "border-gray-100"
            }`}
          >
            <p className="text-xs font-medium text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {orders.length}
            </p>
          </button>

          {/* Delivered */}

          <button
            type="button"
            onClick={() => setSelectedStatus("Delivered")}
            className={`rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md ${
              selectedStatus === "Delivered"
                ? "border-green-500 ring-1 ring-green-500"
                : "border-gray-100"
            }`}
          >
            <p className="text-xs font-medium text-gray-500">
              Delivered
            </p>

            <p className="mt-2 text-2xl font-bold text-green-700">
              {deliveredCount}
            </p>
          </button>

          {/* Shipped */}

          <button
            type="button"
            onClick={() => setSelectedStatus("Shipped")}
            className={`rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md ${
              selectedStatus === "Shipped"
                ? "border-blue-500 ring-1 ring-blue-500"
                : "border-gray-100"
            }`}
          >
            <p className="text-xs font-medium text-gray-500">
              Shipped
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-700">
              {shippedCount}
            </p>
          </button>

          {/* Processing */}

          <button
            type="button"
            onClick={() => setSelectedStatus("Processing")}
            className={`rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md ${
              selectedStatus === "Processing"
                ? "border-yellow-500 ring-1 ring-yellow-500"
                : "border-gray-100"
            }`}
          >
            <p className="text-xs font-medium text-gray-500">
              Processing
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-700">
              {processingCount}
            </p>
          </button>

        </div>

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">

          {/* Search */}

          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search order ID or product..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#8b6f47] focus:ring-2 focus:ring-[#8b6f47]/10"
            />

          </div>

          {/* Status */}

          <select
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(
                event.target.value as "All" | OrderStatus
              )
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#8b6f47]"
          >
            <option value="All">All Orders</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>

        {/* =================================================
            ORDER LIST
        ================================================= */}

        {filteredOrders.length === 0 ? (

          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#8b6f47]/10">
              <Package className="h-10 w-10 text-[#8b6f47]" />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              No orders found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or order filter.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {filteredOrders.map((order) => {

              const StatusIcon =
                statusConfig[order.status].icon;

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >

                  {/* Order Header */}

                  <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-base font-bold text-gray-900">
                          Order #{order.id}
                        </h2>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusConfig[order.status].bgClass} ${statusConfig[order.status].className}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {order.status}
                        </span>

                      </div>

                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">

                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {order.date}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5" />
                          {order.payment}
                        </span>

                      </div>

                    </div>

                    <div className="text-left sm:text-right">

                      <p className="text-xs text-gray-500">
                        Order Total
                      </p>

                      <p className="mt-1 text-xl font-bold text-[#8b6f47]">
                        {formatPrice(order.total)}
                      </p>

                    </div>

                  </div>

                  {/* Products */}

                  <div className="divide-y divide-gray-100">

                    {order.items.map((item) => (

                      <div
                        key={item.id}
                        className="flex gap-4 p-5"
                      >

                        {/* Image */}

                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24">

                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />

                        </div>

                        {/* Details */}

                        <div className="min-w-0 flex-1">

                          <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-xs text-gray-500">
                            Quantity: {item.quantity}
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[#8b6f47]">
                            {formatPrice(item.price)}
                          </p>

                        </div>

                        {/* Item Total */}

                        <div className="text-right">

                          <p className="text-xs text-gray-400">
                            Total
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-900">
                            {formatPrice(
                              item.price * item.quantity
                            )}
                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                  {/* Order Footer */}

                  <div className="flex flex-col gap-4 border-t border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-2 text-xs text-gray-500">

                      <MapPin className="h-4 w-4 text-[#8b6f47]" />

                      <span>
                        {order.address}
                      </span>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      {/* View */}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#8b6f47] hover:text-[#8b6f47]"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>

                      {/* Track */}

                      {(order.status === "Shipped" ||
                        order.status === "Processing") && (
                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              `Tracking order ${order.id}`
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-lg bg-[#8b6f47] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#735b3c]"
                        >
                          <Truck className="h-4 w-4" />
                          Track Order
                        </button>
                      )}

                      {/* Buy Again */}

                      {order.status === "Delivered" && (
                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              `Items from ${order.id} added to cart`
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-lg bg-[#8b6f47] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#735b3c]"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Buy Again
                        </button>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* =================================================
            ORDER DETAILS MODAL
        ================================================= */}

        {selectedOrder && (

          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedOrder(null)}
          >

            <div
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >

              {/* Modal Header */}

              <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white p-5">

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Order Details
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    #{selectedOrder.id}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                >
                  <XCircle className="h-5 w-5" />
                </button>

              </div>

              {/* Modal Content */}

              <div className="space-y-5 p-5">

                {/* Status */}

                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-xs text-gray-500">
                    Order Status
                  </p>

                  <div className="mt-2 flex items-center gap-2">

                    {React.createElement(
                      statusConfig[selectedOrder.status].icon,
                      {
                        className: `h-5 w-5 ${statusConfig[selectedOrder.status].className}`,
                      }
                    )}

                    <span
                      className={`font-semibold ${statusConfig[selectedOrder.status].className}`}
                    >
                      {selectedOrder.status}
                    </span>

                  </div>

                </div>

                {/* Delivery */}

                {selectedOrder.deliveryDate && (
                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs text-gray-500">
                      Delivery Date
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {selectedOrder.deliveryDate}
                    </p>

                  </div>
                )}

                {/* Address */}

                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-xs text-gray-500">
                    Delivery Address
                  </p>

                  <div className="mt-2 flex gap-2">

                    <MapPin className="h-4 w-4 flex-shrink-0 text-[#8b6f47]" />

                    <p className="text-sm font-medium text-gray-900">
                      {selectedOrder.address}
                    </p>

                  </div>

                </div>

                {/* Products */}

                <div>

                  <h3 className="mb-3 font-bold text-gray-900">
                    Products
                  </h3>

                  <div className="space-y-3">

                    {selectedOrder.items.map((item) => (

                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />

                        <div className="min-w-0 flex-1">

                          <p className="text-sm font-semibold text-gray-900">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {formatPrice(item.price)} ×{" "}
                            {item.quantity}
                          </p>

                        </div>

                        <p className="text-sm font-bold text-gray-900">
                          {formatPrice(
                            item.price * item.quantity
                          )}
                        </p>

                      </div>

                    ))}

                  </div>

                </div>

                {/* Total */}

                <div className="border-t border-gray-200 pt-4">

                  <div className="flex items-center justify-between">

                    <span className="font-bold text-gray-900">
                      Grand Total
                    </span>

                    <span className="text-xl font-bold text-[#8b6f47]">
                      {formatPrice(selectedOrder.total)}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>
    </div>
  );
};

export default MyOrders;