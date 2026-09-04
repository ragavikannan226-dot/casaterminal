// src/pages/admin/PaymentsManagement.tsx

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  Clock,
  AlertCircle,
  DollarSign,
  TrendingUp,
  RefreshCw,
  CreditCard,
  Wallet,
  Globe,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Grid,
  Percent,
  Banknote,
  Smartphone,
  Save,
  Edit2,
  Plus,
  Trash2,
  Package,
  Calculator,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================

interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  providerName: string;
  providerType: string;
  amount: number;
  commission: number;
  status: string;
  paymentMethod: string;
  date: string;
}

interface Payout {
  id: string;
  providerName: string;
  providerType: string;
  amount: number;
  status: string;
  date: string;
}

interface CommissionRates {
  cement: number;
  bricks: number;
  steel: number;
  other: number;
  vehicle: number;
  equipment: number;
}

interface ProductCommission {
  id: string;
  productName: string;
  category: string;
  sellerPrice: number;
  commissionPercent: number;
  active: boolean;
}

// ============================================================
// STORAGE KEYS
// ============================================================

const COMMISSION_RATES_KEY = "adminCommissionRates";
const PRODUCT_COMMISSIONS_KEY = "adminProductCommissions";

// ============================================================
// MOCK TRANSACTIONS
// ============================================================

const initialTransactions: Transaction[] = [
  {
    id: "TXN-001",
    orderId: "ORD-1234",
    customerName: "Rahul Sharma",
    providerName: "ABC Constructions",
    providerType: "seller",
    amount: 45000,
    commission: 2250,
    status: "completed",
    paymentMethod: "upi",
    date: "2024-01-15",
  },
  {
    id: "TXN-002",
    orderId: "ORD-1235",
    customerName: "Priya Patel",
    providerName: "Singh Interiors",
    providerType: "contractor",
    amount: 28500,
    commission: 2280,
    status: "pending",
    paymentMethod: "card",
    date: "2024-01-15",
  },
  {
    id: "TXN-003",
    orderId: "ORD-1236",
    customerName: "Amit Kumar",
    providerName: "JCB Rentals",
    providerType: "rental",
    amount: 125000,
    commission: 12500,
    status: "disputed",
    paymentMethod: "bank",
    date: "2024-01-14",
  },
  {
    id: "TXN-004",
    orderId: "ORD-1237",
    customerName: "Sneha Reddy",
    providerName: "PQR Builders",
    providerType: "seller",
    amount: 8900,
    commission: 445,
    status: "refunded",
    paymentMethod: "card",
    date: "2024-01-14",
  },
  {
    id: "TXN-005",
    orderId: "ORD-1238",
    customerName: "Vikram Singh",
    providerName: "Patel Electricals",
    providerType: "contractor",
    amount: 67000,
    commission: 5360,
    status: "completed",
    paymentMethod: "netbanking",
    date: "2024-01-13",
  },
];

// ============================================================
// MOCK PAYOUTS
// ============================================================

const initialPayouts: Payout[] = [
  {
    id: "PO-001",
    providerName: "ABC Constructions",
    providerType: "seller",
    amount: 121125,
    status: "pending",
    date: "2024-01-16",
  },
  {
    id: "PO-002",
    providerName: "Singh Interiors",
    providerType: "contractor",
    amount: 78752,
    status: "processing",
    date: "2024-01-15",
  },
  {
    id: "PO-003",
    providerName: "JCB Rentals",
    providerType: "rental",
    amount: 210600,
    status: "completed",
    date: "2024-01-14",
  },
];

// ============================================================
// DEFAULT PRODUCT COMMISSIONS
// ============================================================

const defaultProductCommissions: ProductCommission[] = [
  {
    id: "PC-001",
    productName: "Cement",
    category: "Building Materials",
    sellerPrice: 100,
    commissionPercent: 1,
    active: true,
  },
  {
    id: "PC-002",
    productName: "Bricks",
    category: "Building Materials",
    sellerPrice: 100,
    commissionPercent: 2,
    active: true,
  },
  {
    id: "PC-003",
    productName: "Steel",
    category: "Building Materials",
    sellerPrice: 100,
    commissionPercent: 1.5,
    active: true,
  },
  {
    id: "PC-004",
    productName: "Paint",
    category: "Finishing Materials",
    sellerPrice: 100,
    commissionPercent: 3,
    active: true,
  },
  {
    id: "PC-005",
    productName: "Electrical Items",
    category: "Electrical",
    sellerPrice: 100,
    commissionPercent: 2.5,
    active: true,
  },
];

// ============================================================
// HELPERS
// ============================================================

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

const formatNumber = (num: number) => {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + "Cr";
  }

  if (num >= 100000) {
    return (num / 100000).toFixed(1) + "L";
  }

  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }

  return num.toString();
};

const calculateCommission = (
  sellerPrice: number,
  commissionPercent: number
) => {
  return sellerPrice * (commissionPercent / 100);
};

const calculateFinalPrice = (
  sellerPrice: number,
  commissionPercent: number
) => {
  return sellerPrice + calculateCommission(
    sellerPrice,
    commissionPercent
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const PaymentsManagement = () => {
  // ==========================================================
  // BASIC STATE
  // ==========================================================

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("transactions");

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [showFilters, setShowFilters] = useState(false);

  const [viewMode, setViewMode] = useState<"table" | "grid">(
    "grid"
  );

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [showModal, setShowModal] = useState<
    "none" | "details" | "refund" | "dispute"
  >("none");

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ==========================================================
  // SORTING
  // ==========================================================

  const [sortField, setSortField] = useState<
    keyof Transaction | keyof Payout
  >("date");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    "desc"
  );

  // ==========================================================
  // FILTERS
  // ==========================================================

  const [filters, setFilters] = useState({
    provider: "",
    status: "",
    dateRange: "",
  });

  // ==========================================================
  // CATEGORY COMMISSION
  // ==========================================================

  const [commissionRates, setCommissionRates] =
    useState<CommissionRates>({
      cement: 0,
      bricks: 0,
      steel: 0,
      other: 0,
      vehicle: 0,
      equipment: 0,
    });

  const [editingCommission, setEditingCommission] =
    useState(false);

  const [tempRates, setTempRates] =
    useState<CommissionRates>(commissionRates);

  // ==========================================================
  // PRODUCT COMMISSION
  // ==========================================================

  const [productCommissions, setProductCommissions] =
    useState<ProductCommission[]>([]);

  const [showProductForm, setShowProductForm] = useState(false);

  const [editingProductId, setEditingProductId] = useState<
    string | null
  >(null);

  const [productForm, setProductForm] =
    useState<ProductCommission>({
      id: "",
      productName: "",
      category: "",
      sellerPrice: 100,
      commissionPercent: 1,
      active: true,
    });

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      setTransactions(initialTransactions);
      setPayouts(initialPayouts);

      setLoading(false);
    };

    loadData();

    // Commission rates
    try {
      const savedRates = localStorage.getItem(
        COMMISSION_RATES_KEY
      );

      if (savedRates) {
        const parsedRates = JSON.parse(savedRates);

        setCommissionRates(parsedRates);
        setTempRates(parsedRates);
      }
    } catch (error) {
      console.error(
        "Failed to load commission rates:",
        error
      );
    }

    // Product commissions
    try {
      const savedProducts = localStorage.getItem(
        PRODUCT_COMMISSIONS_KEY
      );

      if (savedProducts) {
        setProductCommissions(JSON.parse(savedProducts));
      } else {
        setProductCommissions(defaultProductCommissions);
        localStorage.setItem(
          PRODUCT_COMMISSIONS_KEY,
          JSON.stringify(defaultProductCommissions)
        );
      }
    } catch (error) {
      console.error(
        "Failed to load product commissions:",
        error
      );

      setProductCommissions(defaultProductCommissions);
    }
  }, []);

  // ==========================================================
  // SAVE PRODUCT COMMISSIONS
  // ==========================================================

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        PRODUCT_COMMISSIONS_KEY,
        JSON.stringify(productCommissions)
      );
    }
  }, [productCommissions, loading]);

  // ==========================================================
  // TABS
  // ==========================================================

  const tabs = [
    {
      id: "transactions",
      name: "Transactions",
      icon: CreditCard,
      count: transactions.length,
      color: "blue",
    },
    {
      id: "payouts",
      name: "Payouts",
      icon: Wallet,
      count: payouts.length,
      color: "green",
    },
    {
      id: "disputes",
      name: "Disputes",
      icon: AlertCircle,
      count: transactions.filter(
        (t) => t.status === "disputed"
      ).length,
      color: "red",
    },
    {
      id: "refunds",
      name: "Refunds",
      icon: RefreshCw,
      count: transactions.filter(
        (t) => t.status === "refunded"
      ).length,
      color: "purple",
    },
    {
      id: "commission",
      name: "Commission",
      icon: Percent,
      count: 0,
      color: "orange",
    },
  ];

  // ==========================================================
  // FILTER TRANSACTIONS
  // ==========================================================

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.providerName.toLowerCase().includes(q)
      );
    }

    if (
      filters.status &&
      filters.status !== "all"
    ) {
      filtered = filtered.filter(
        (t) => t.status === filters.status
      );
    }

    if (filters.provider) {
      filtered = filtered.filter((t) =>
        t.providerName
          .toLowerCase()
          .includes(filters.provider.toLowerCase())
      );
    }

    if (filters.dateRange === "today") {
      const today = new Date()
        .toISOString()
        .split("T")[0];

      filtered = filtered.filter(
        (t) => t.date === today
      );
    }

    if (filters.dateRange === "week") {
      const weekAgo = new Date();

      weekAgo.setDate(weekAgo.getDate() - 7);

      filtered = filtered.filter(
        (t) => new Date(t.date) >= weekAgo
      );
    }

    if (filters.dateRange === "month") {
      const monthAgo = new Date();

      monthAgo.setMonth(monthAgo.getMonth() - 1);

      filtered = filtered.filter(
        (t) => new Date(t.date) >= monthAgo
      );
    }

    filtered.sort((a, b) => {
      let aVal: any =
        a[sortField as keyof Transaction];

      let bVal: any =
        b[sortField as keyof Transaction];

      if (
        sortField === "amount" ||
        sortField === "commission"
      ) {
        aVal = aVal || 0;
        bVal = bVal || 0;
      }

      if (aVal < bVal) {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (aVal > bVal) {
        return sortOrder === "asc" ? 1 : -1;
      }

      return 0;
    });

    return filtered;
  }, [
    transactions,
    searchQuery,
    filters,
    sortField,
    sortOrder,
  ]);

  // ==========================================================
  // FILTER PAYOUTS
  // ==========================================================

  const filteredPayouts = useMemo(() => {
    let filtered = [...payouts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      filtered = filtered.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.providerName.toLowerCase().includes(q)
      );
    }

    if (
      filters.status &&
      filters.status !== "all"
    ) {
      filtered = filtered.filter(
        (p) => p.status === filters.status
      );
    }

    if (filters.dateRange === "today") {
      const today = new Date()
        .toISOString()
        .split("T")[0];

      filtered = filtered.filter(
        (p) => p.date === today
      );
    }

    if (filters.dateRange === "week") {
      const weekAgo = new Date();

      weekAgo.setDate(weekAgo.getDate() - 7);

      filtered = filtered.filter(
        (p) => new Date(p.date) >= weekAgo
      );
    }

    if (filters.dateRange === "month") {
      const monthAgo = new Date();

      monthAgo.setMonth(monthAgo.getMonth() - 1);

      filtered = filtered.filter(
        (p) => new Date(p.date) >= monthAgo
      );
    }

    filtered.sort((a, b) => {
      let aVal: any =
        a[sortField as keyof Payout];

      let bVal: any =
        b[sortField as keyof Payout];

      if (sortField === "amount") {
        aVal = aVal || 0;
        bVal = bVal || 0;
      }

      if (aVal < bVal) {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (aVal > bVal) {
        return sortOrder === "asc" ? 1 : -1;
      }

      return 0;
    });

    return filtered;
  }, [
    payouts,
    searchQuery,
    filters,
    sortField,
    sortOrder,
  ]);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const paginatedTransactions = useMemo(() => {
    const start =
      (currentPage - 1) * itemsPerPage;

    return filteredTransactions.slice(
      start,
      start + itemsPerPage
    );
  }, [
    filteredTransactions,
    currentPage,
    itemsPerPage,
  ]);

  const paginatedPayouts = useMemo(() => {
    const start =
      (currentPage - 1) * itemsPerPage;

    return filteredPayouts.slice(
      start,
      start + itemsPerPage
    );
  }, [
    filteredPayouts,
    currentPage,
    itemsPerPage,
  ]);

  const totalPagesTransactions = Math.max(
    1,
    Math.ceil(
      filteredTransactions.length / itemsPerPage
    )
  );

  const totalPagesPayouts = Math.max(
    1,
    Math.ceil(
      filteredPayouts.length / itemsPerPage
    )
  );

  useEffect(() => {
    setCurrentPage(1);
    setSelectedItems([]);
  }, [
    searchQuery,
    filters,
    sortField,
    sortOrder,
    activeTab,
  ]);

  // ==========================================================
  // SUMMARY STATS
  // ==========================================================

  const totalRevenue = transactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const totalCommission = transactions.reduce(
    (sum, t) => sum + t.commission,
    0
  );

  const pendingPayouts = payouts
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const avgCommission =
    transactions.length > 0
      ? (
          transactions.reduce(
            (sum, t) =>
              sum +
              (t.amount > 0
                ? (t.commission / t.amount) * 100
                : 0),
            0
          ) / transactions.length
        ).toFixed(1)
      : "0.0";

  // ==========================================================
  // SELECTION
  // ==========================================================

  const handleSelectAllTransactions = () => {
    const ids = paginatedTransactions.map(
      (t) => t.id
    );

    const allSelected =
      ids.length > 0 &&
      ids.every((id) =>
        selectedItems.includes(id)
      );

    setSelectedItems(
      allSelected
        ? selectedItems.filter(
            (id) => !ids.includes(id)
          )
        : [
            ...selectedItems,
            ...ids.filter(
              (id) => !selectedItems.includes(id)
            ),
          ]
    );
  };

  const handleSelectAllPayouts = () => {
    const ids = paginatedPayouts.map(
      (p) => p.id
    );

    const allSelected =
      ids.length > 0 &&
      ids.every((id) =>
        selectedItems.includes(id)
      );

    setSelectedItems(
      allSelected
        ? selectedItems.filter(
            (id) => !ids.includes(id)
          )
        : [
            ...selectedItems,
            ...ids.filter(
              (id) => !selectedItems.includes(id)
            ),
          ]
    );
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  // ==========================================================
  // PAYOUT
  // ==========================================================

  const handleProcessPayout = async (
    payoutId: string
  ) => {
    setLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: "completed",
            }
          : p
      )
    );

    toast.success(
      "Payout processed successfully"
    );

    setLoading(false);
  };

  const handleBulkProcess = async () => {
    if (!selectedItems.length) {
      return;
    }

    setLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 800)
    );

    if (activeTab === "payouts") {
      setPayouts((prev) =>
        prev.map((p) =>
          selectedItems.includes(p.id)
            ? {
                ...p,
                status: "completed",
              }
            : p
        )
      );

      toast.success(
        `${selectedItems.length} payout(s) processed`
      );
    } else {
      toast.success(
        `Bulk action on ${selectedItems.length} items`
      );
    }

    setSelectedItems([]);

    setLoading(false);
  };

  // ==========================================================
  // EXPORT
  // ==========================================================

  const handleExport = () => {
    const csvRows: string[] = [];

    if (activeTab === "transactions") {
      csvRows.push(
        "Transaction ID,Order ID,Customer,Provider,Amount,Commission,Status,Payment Method,Date"
      );

      filteredTransactions.forEach((tx) => {
        csvRows.push(
          [
            tx.id,
            tx.orderId,
            tx.customerName,
            tx.providerName,
            tx.amount,
            tx.commission,
            tx.status,
            tx.paymentMethod,
            tx.date,
          ]
            .map((value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
            )
            .join(",")
        );
      });
    } else {
      csvRows.push(
        "Payout ID,Provider,Provider Type,Amount,Status,Date"
      );

      filteredPayouts.forEach((payout) => {
        csvRows.push(
          [
            payout.id,
            payout.providerName,
            payout.providerType,
            payout.amount,
            payout.status,
            payout.date,
          ]
            .map((value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
            )
            .join(",")
        );
      });
    }

    const blob = new Blob(
      [csvRows.join("\n")],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      activeTab === "transactions"
        ? "transactions.csv"
        : "payouts.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success("Export completed");
  };

  // ==========================================================
  // SORT
  // ==========================================================

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      setSortField(
        field as keyof Transaction
      );

      setSortOrder("desc");
    }
  };

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {
    setFilters({
      provider: "",
      status: "",
      dateRange: "",
    });

    setSearchQuery("");
  };

  // ==========================================================
  // COMMISSION RATE HANDLERS
  // ==========================================================

  const handleEditCommission = () => {
    setTempRates(commissionRates);
    setEditingCommission(true);
  };

  const handleCancelEdit = () => {
    setTempRates(commissionRates);
    setEditingCommission(false);
  };

  const handleSaveCommission = () => {
    const sanitized = {
      cement: Number(tempRates.cement) || 0,
      bricks: Number(tempRates.bricks) || 0,
      steel: Number(tempRates.steel) || 0,
      other: Number(tempRates.other) || 0,
      vehicle: Number(tempRates.vehicle) || 0,
      equipment: Number(tempRates.equipment) || 0,
    };

    setCommissionRates(sanitized);

    setTempRates(sanitized);

    localStorage.setItem(
      COMMISSION_RATES_KEY,
      JSON.stringify(sanitized)
    );

    setEditingCommission(false);

    toast.success(
      "Commission rates updated successfully"
    );
  };

  const handleTempRateChange = (
    category: keyof CommissionRates,
    value: string
  ) => {
    const numericValue =
      value === "" ? 0 : Number(value);

    setTempRates((prev) => ({
      ...prev,
      [category]: Number.isFinite(
        numericValue
      )
        ? numericValue
        : 0,
    }));
  };

  // ==========================================================
  // PRODUCT FORM
  // ==========================================================

  const resetProductForm = () => {
    setProductForm({
      id: "",
      productName: "",
      category: "",
      sellerPrice: 100,
      commissionPercent: 1,
      active: true,
    });

    setEditingProductId(null);
  };

  const handleOpenAddProduct = () => {
    resetProductForm();
    setShowProductForm(true);
  };

  const handleEditProduct = (
    product: ProductCommission
  ) => {
    setProductForm({
      ...product,
    });

    setEditingProductId(product.id);

    setShowProductForm(true);
  };

  // ==========================================================
  // SAVE PRODUCT
  // ==========================================================

  const handleSaveProduct = () => {
    const productName =
      productForm.productName.trim();

    const category =
      productForm.category.trim();

    const sellerPrice = Number(
      productForm.sellerPrice
    );

    const commissionPercent = Number(
      productForm.commissionPercent
    );

    if (!productName) {
      toast.error("Please enter a product name");
      return;
    }

    if (!category) {
      toast.error("Please enter a category");
      return;
    }

    if (
      !Number.isFinite(sellerPrice) ||
      sellerPrice < 0
    ) {
      toast.error(
        "Please enter a valid seller price"
      );
      return;
    }

    if (
      !Number.isFinite(commissionPercent) ||
      commissionPercent < 0 ||
      commissionPercent > 100
    ) {
      toast.error(
        "Commission must be between 0% and 100%"
      );
      return;
    }

    if (editingProductId) {
      setProductCommissions((prev) =>
        prev.map((product) =>
          product.id === editingProductId
            ? {
                ...productForm,
                id: editingProductId,
                productName,
                category,
                sellerPrice,
                commissionPercent,
              }
            : product
        )
      );

      toast.success(
        "Product commission updated"
      );
    } else {
      const newProduct: ProductCommission = {
        ...productForm,
        id: `PC-${Date.now()}`,
        productName,
        category,
        sellerPrice,
        commissionPercent,
      };

      setProductCommissions((prev) => [
        ...prev,
        newProduct,
      ]);

      toast.success(
        "Product commission added"
      );
    }

    setShowProductForm(false);

    resetProductForm();
  };

  // ==========================================================
  // DELETE PRODUCT
  // ==========================================================

  const handleDeleteProduct = (
    productId: string
  ) => {
    const product =
      productCommissions.find(
        (item) => item.id === productId
      );

    if (!product) {
      return;
    }

    const confirmed = window.confirm(
      `Delete commission for "${product.productName}"?`
    );

    if (!confirmed) {
      return;
    }

    setProductCommissions((prev) =>
      prev.filter(
        (item) => item.id !== productId
      )
    );

    toast.success("Product commission deleted");
  };

  // ==========================================================
  // TOGGLE PRODUCT
  // ==========================================================

  const handleToggleProduct = (
    productId: string
  ) => {
    setProductCommissions((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              active: !product.active,
            }
          : product
      )
    );
  };

  // ==========================================================
  // STATUS BADGE
  // ==========================================================

  const getStatusBadge = (
    status: string
  ) => {
    const styles: Record<
      string,
      string
    > = {
      completed:
        "bg-green-100 text-green-800 border-green-200",

      pending:
        "bg-yellow-100 text-yellow-800 border-yellow-200",

      processing:
        "bg-blue-100 text-blue-800 border-blue-200",

      disputed:
        "bg-red-100 text-red-800 border-red-200",

      refunded:
        "bg-purple-100 text-purple-800 border-purple-200",

      failed:
        "bg-gray-100 text-gray-800 border-gray-200",
    };

    const icons: Record<
      string,
      any
    > = {
      completed: CheckCircle,
      pending: Clock,
      processing: RefreshCw,
      disputed: AlertCircle,
      refunded: RefreshCw,
      failed: XCircle,
    };

    const Icon =
      icons[status] || Clock;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
          styles[status] ||
          styles.pending
        }`}
      >
        <Icon className="w-3 h-3" />

        {status}
      </span>
    );
  };

  // ==========================================================
  // PAYMENT ICON
  // ==========================================================

  const getPaymentIcon = (
    method: string
  ) => {
    const icons: Record<
      string,
      any
    > = {
      upi: Smartphone,
      card: CreditCard,
      bank: Banknote,
      netbanking: Globe,
    };

    const Icon =
      icons[method] ||
      CreditCard;

    return (
      <Icon className="w-4 h-4" />
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    loading &&
    transactions.length === 0 &&
    payouts.length === 0
  ) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />

              Payments & Commission
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Track transactions, manage payouts,
              and monitor commissions
            </p>
          </div>

          <div className="flex items-center gap-2">

            <div className="hidden sm:flex items-center bg-white rounded-lg border border-gray-200 p-1">

              <button
                onClick={() =>
                  setViewMode("table")
                }
                className={`p-2 rounded-md ${
                  viewMode === "table"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                <Menu className="w-4 h-4" />
              </button>

              <button
                onClick={() =>
                  setViewMode("grid")
                }
                className={`p-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>

            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
            >
              <Download className="w-4 h-4 text-gray-600" />

              <span className="hidden sm:inline">
                Export
              </span>
            </button>

          </div>
        </div>

        {/* ==================================================
            STATS
        ================================================== */}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">
                Revenue
              </span>

              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>

            <p className="text-lg font-bold text-gray-900">
              {formatNumber(totalRevenue)}
            </p>

            <p className="text-xs text-green-600 mt-1">
              ↑ 15.8%
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">
                Commission
              </span>

              <Percent className="w-4 h-4 text-blue-600" />
            </div>

            <p className="text-lg font-bold text-gray-900">
              {formatNumber(totalCommission)}
            </p>

            <p className="text-xs text-blue-600 mt-1">
              Avg {avgCommission}%
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">
                Pending Payouts
              </span>

              <Clock className="w-4 h-4 text-yellow-600" />
            </div>

            <p className="text-lg font-bold text-gray-900">
              {formatNumber(pendingPayouts)}
            </p>

            <p className="text-xs text-yellow-600 mt-1">
              {
                payouts.filter(
                  (p) =>
                    p.status === "pending"
                ).length
              }{" "}
              requests
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">
                Disputes
              </span>

              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>

            <p className="text-lg font-bold text-gray-900">
              {
                transactions.filter(
                  (t) =>
                    t.status === "disputed"
                ).length
              }
            </p>

            <p className="text-xs text-red-600 mt-1">
              {
                transactions.filter(
                  (t) =>
                    t.status === "refunded"
                ).length
              }{" "}
              refunds
            </p>
          </div>

        </div>

        {/* ==================================================
            TABS
        ================================================== */}

        <div className="border-b border-gray-200 mb-6 overflow-x-auto">

          <nav className="flex -mb-px space-x-4 sm:space-x-8 min-w-max">

            {tabs.map((tab) => {
              const Icon = tab.icon;

              const colorClass =
                {
                  blue:
                    "text-blue-600 border-blue-600",

                  green:
                    "text-green-600 border-green-600",

                  red:
                    "text-red-600 border-red-600",

                  purple:
                    "text-purple-600 border-purple-600",

                  orange:
                    "text-orange-600 border-orange-600",
                }[
                  tab.color
                ];

              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? colorClass
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />

                  <span>{tab.name}</span>

                  {tab.count > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-gray-100">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}

          </nav>
        </div>

        {/* ==================================================
            SEARCH
        ================================================== */}

        {activeTab !== "commission" && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">

            <div className="flex flex-col sm:flex-row gap-3">

              <div className="flex-1 relative">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />

              </div>

              <div className="flex gap-2">

                <button
                  onClick={() =>
                    setShowFilters(
                      !showFilters
                    )
                  }
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm ${
                    showFilters
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <Filter className="w-4 h-4" />

                  <span className="hidden sm:inline">
                    Filters
                  </span>
                </button>

                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      status: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
                >
                  <option value="">
                    All Status
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="processing">
                    Processing
                  </option>

                  <option value="disputed">
                    Disputed
                  </option>

                  <option value="refunded">
                    Refunded
                  </option>
                </select>

              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
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
                  className="mt-4 pt-4 border-t border-gray-200"
                >

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Provider
                      </label>

                      <input
                        type="text"
                        value={
                          filters.provider
                        }
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            provider:
                              e.target.value,
                          })
                        }
                        placeholder="Provider name"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Date Range
                      </label>

                      <select
                        value={
                          filters.dateRange
                        }
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            dateRange:
                              e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                      >
                        <option value="">
                          All Time
                        </option>

                        <option value="today">
                          Today
                        </option>

                        <option value="week">
                          This Week
                        </option>

                        <option value="month">
                          This Month
                        </option>
                      </select>
                    </div>

                  </div>

                  <div className="flex justify-end mt-4">

                    <button
                      onClick={
                        clearFilters
                      }
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />

                      Clear all
                    </button>

                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* ==================================================
            SORTING
        ================================================== */}

        {activeTab !== "commission" && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">

            <div className="flex flex-wrap gap-2">

              <button
                onClick={() =>
                  handleSort("date")
                }
                className={`text-xs px-2 py-1 rounded ${
                  sortField === "date"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Date{" "}
                {sortField === "date" &&
                  (sortOrder === "asc"
                    ? "↑"
                    : "↓")}
              </button>

              <button
                onClick={() =>
                  handleSort("amount")
                }
                className={`text-xs px-2 py-1 rounded ${
                  sortField === "amount"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Amount{" "}
                {sortField === "amount" &&
                  (sortOrder === "asc"
                    ? "↑"
                    : "↓")}
              </button>

              {activeTab ===
                "transactions" && (
                <button
                  onClick={() =>
                    handleSort(
                      "commission"
                    )
                  }
                  className={`text-xs px-2 py-1 rounded ${
                    sortField ===
                    "commission"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Commission{" "}
                  {sortField ===
                    "commission" &&
                    (sortOrder === "asc"
                      ? "↑"
                      : "↓")}
                </button>
              )}

              <button
                onClick={() =>
                  handleSort("status")
                }
                className={`text-xs px-2 py-1 rounded ${
                  sortField === "status"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Status{" "}
                {sortField === "status" &&
                  (sortOrder === "asc"
                    ? "↑"
                    : "↓")}
              </button>

            </div>

            <div className="text-sm text-gray-500">
              Total:{" "}
              {activeTab ===
              "transactions"
                ? filteredTransactions.length
                : filteredPayouts.length}{" "}
              items
            </div>

          </div>
        )}

        {/* ==================================================
            BULK ACTIONS
        ================================================== */}

        <AnimatePresence>
          {selectedItems.length > 0 &&
            activeTab !==
              "commission" && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                className="bg-blue-600 text-white p-3 rounded-lg mb-4 flex items-center justify-between"
              >

                <span className="text-sm font-medium">
                  {selectedItems.length}{" "}
                  selected
                </span>

                <div className="flex gap-2">

                  <button
                    onClick={
                      handleBulkProcess
                    }
                    className="px-3 py-1 bg-green-500 rounded-md text-sm hover:bg-green-600"
                  >
                    Process
                  </button>

                  <button
                    onClick={
                      handleExport
                    }
                    className="px-3 py-1 bg-yellow-500 rounded-md text-sm hover:bg-yellow-600"
                  >
                    Export
                  </button>

                  <button
                    onClick={() =>
                      setSelectedItems(
                        []
                      )
                    }
                    className="p-1 hover:bg-blue-700 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>

                </div>

              </motion.div>
            )}
        </AnimatePresence>

        {/* ==================================================
            MOBILE VIEW TOGGLE
        ================================================== */}

        <div className="flex sm:hidden items-center justify-end gap-2 mb-4">

          <button
            onClick={() =>
              setViewMode("table")
            }
            className={`p-2 rounded-lg ${
              viewMode === "table"
                ? "bg-blue-600 text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            <Menu className="w-4 h-4" />
          </button>

          <button
            onClick={() =>
              setViewMode("grid")
            }
            className={`p-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>

        </div>

        {/* ==================================================
            TRANSACTIONS
        ================================================== */}

        {activeTab ===
          "transactions" && (
          <>
            {filteredTransactions.length ===
            0 ? (
              <EmptyState
                icon={CreditCard}
                title="No transactions found"
                description="Try adjusting your search or filters"
                onClear={
                  clearFilters
                }
              />
            ) : viewMode ===
              "table" ? (
              <div className="hidden sm:block bg-white rounded-lg border overflow-hidden">

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead className="bg-gray-50 border-b">

                      <tr>

                        <th className="px-4 py-3 w-10">
                          <input
                            type="checkbox"
                            checked={
                              paginatedTransactions.length >
                                0 &&
                              paginatedTransactions.every(
                                (tx) =>
                                  selectedItems.includes(
                                    tx.id
                                  )
                              )
                            }
                            onChange={
                              handleSelectAllTransactions
                            }
                            className="rounded border-gray-300 text-blue-600"
                          />
                        </th>

                        <TableHeader>
                          ID
                        </TableHeader>

                        <TableHeader>
                          Customer
                        </TableHeader>

                        <TableHeader>
                          Provider
                        </TableHeader>

                        <TableHeader>
                          Amount
                        </TableHeader>

                        <TableHeader>
                          Commission
                        </TableHeader>

                        <TableHeader>
                          Status
                        </TableHeader>

                        <TableHeader>
                          Date
                        </TableHeader>

                        <TableHeader>
                          Actions
                        </TableHeader>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-gray-200">

                      {paginatedTransactions.map(
                        (tx) => (
                          <tr
                            key={tx.id}
                            className="hover:bg-gray-50"
                          >

                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(
                                  tx.id
                                )}
                                onChange={() =>
                                  handleSelectItem(
                                    tx.id
                                  )
                                }
                                className="rounded border-gray-300 text-blue-600"
                              />
                            </td>

                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {tx.id}
                            </td>

                            <td className="px-4 py-3 text-sm">
                              {
                                tx.customerName
                              }
                            </td>

                            <td className="px-4 py-3">
                              <div className="text-sm">
                                {
                                  tx.providerName
                                }
                              </div>

                              <div className="text-xs text-gray-500 capitalize">
                                {
                                  tx.providerType
                                }
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              <div className="text-sm font-medium">
                                {formatCurrency(
                                  tx.amount
                                )}
                              </div>

                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                {getPaymentIcon(
                                  tx.paymentMethod
                                )}

                                <span>
                                  {
                                    tx.paymentMethod
                                  }
                                </span>
                              </div>
                            </td>

                            <td className="px-4 py-3 text-sm">
                              {formatCurrency(
                                tx.commission
                              )}
                            </td>

                            <td className="px-4 py-3">
                              {getStatusBadge(
                                tx.status
                              )}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-500">
                              {tx.date}
                            </td>

                            <td className="px-4 py-3">
                              <button
                                onClick={() => {
                                  setSelectedTransaction(
                                    tx
                                  );

                                  setShowModal(
                                    "details"
                                  );
                                }}
                                className="p-1 hover:bg-blue-100 rounded text-blue-600"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {paginatedTransactions.map(
                  (tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      className="bg-white rounded-lg border overflow-hidden"
                    >

                      <div className="p-4">

                        <div className="flex items-start justify-between mb-3">

                          <div>

                            <div className="flex items-center gap-2 mb-1">

                              <span className="text-sm font-medium text-gray-900">
                                {tx.id}
                              </span>

                              <span className="text-xs text-gray-500">
                                • {tx.date}
                              </span>

                            </div>

                            <h3 className="font-semibold text-gray-900">
                              {
                                tx.customerName
                              }
                            </h3>

                          </div>

                          {getStatusBadge(
                            tx.status
                          )}

                        </div>

                        <div className="space-y-2 mb-3 text-sm">

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-500">
                              Provider:
                            </span>

                            <span className="font-medium text-right">
                              {
                                tx.providerName
                              }
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">
                              Amount:
                            </span>

                            <span className="font-bold text-green-600">
                              {formatCurrency(
                                tx.amount
                              )}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">
                              Commission:
                            </span>

                            <span>
                              {formatCurrency(
                                tx.commission
                              )}
                            </span>
                          </div>

                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">

                          <div className="flex items-center gap-1 text-gray-500">

                            {getPaymentIcon(
                              tx.paymentMethod
                            )}

                            <span className="text-xs capitalize">
                              {
                                tx.paymentMethod
                              }
                            </span>

                          </div>

                          <button
                            onClick={() => {
                              setSelectedTransaction(
                                tx
                              );

                              setShowModal(
                                "details"
                              );
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View →
                          </button>

                        </div>

                      </div>

                    </motion.div>
                  )
                )}

              </div>
            )}

            <Pagination
              currentPage={
                currentPage
              }
              totalPages={
                totalPagesTransactions
              }
              itemsPerPage={
                itemsPerPage
              }
              totalItems={
                filteredTransactions.length
              }
              onPageChange={
                setCurrentPage
              }
              onItemsPerPageChange={(
                value
              ) => {
                setItemsPerPage(
                  value
                );

                setCurrentPage(1);
              }}
            />
          </>
        )}

        {/* ==================================================
            PAYOUTS
        ================================================== */}

        {activeTab ===
          "payouts" && (
          <>
            {filteredPayouts.length ===
            0 ? (
              <EmptyState
                icon={Wallet}
                title="No payouts found"
                description="Try adjusting your search or filters"
                onClear={
                  clearFilters
                }
              />
            ) : viewMode ===
              "table" ? (
              <div className="hidden sm:block bg-white rounded-lg border overflow-hidden">

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead className="bg-gray-50 border-b">

                      <tr>

                        <th className="px-4 py-3 w-10">
                          <input
                            type="checkbox"
                            checked={
                              paginatedPayouts.length >
                                0 &&
                              paginatedPayouts.every(
                                (payout) =>
                                  selectedItems.includes(
                                    payout.id
                                  )
                              )
                            }
                            onChange={
                              handleSelectAllPayouts
                            }
                            className="rounded border-gray-300 text-blue-600"
                          />
                        </th>

                        <TableHeader>
                          ID
                        </TableHeader>

                        <TableHeader>
                          Provider
                        </TableHeader>

                        <TableHeader>
                          Type
                        </TableHeader>

                        <TableHeader>
                          Amount
                        </TableHeader>

                        <TableHeader>
                          Status
                        </TableHeader>

                        <TableHeader>
                          Date
                        </TableHeader>

                        <TableHeader>
                          Actions
                        </TableHeader>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-gray-200">

                      {paginatedPayouts.map(
                        (payout) => (
                          <tr
                            key={payout.id}
                            className="hover:bg-gray-50"
                          >

                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(
                                  payout.id
                                )}
                                onChange={() =>
                                  handleSelectItem(
                                    payout.id
                                  )
                                }
                                className="rounded border-gray-300 text-blue-600"
                              />
                            </td>

                            <td className="px-4 py-3 text-sm font-medium">
                              {
                                payout.id
                              }
                            </td>

                            <td className="px-4 py-3 text-sm">
                              {
                                payout.providerName
                              }
                            </td>

                            <td className="px-4 py-3 text-sm capitalize">
                              {
                                payout.providerType
                              }
                            </td>

                            <td className="px-4 py-3 text-sm font-medium text-green-600">
                              {formatCurrency(
                                payout.amount
                              )}
                            </td>

                            <td className="px-4 py-3">
                              {getStatusBadge(
                                payout.status
                              )}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-500">
                              {payout.date}
                            </td>

                            <td className="px-4 py-3">

                              <button
                                onClick={() =>
                                  handleProcessPayout(
                                    payout.id
                                  )
                                }
                                disabled={
                                  payout.status ===
                                  "completed"
                                }
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                              >
                                Process
                              </button>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {paginatedPayouts.map(
                  (payout) => (
                    <motion.div
                      key={payout.id}
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      className="bg-white rounded-lg border overflow-hidden"
                    >

                      <div className="p-4">

                        <div className="flex items-start justify-between mb-3">

                          <div>

                            <span className="text-sm font-medium text-gray-900">
                              {
                                payout.id
                              }
                            </span>

                            <h3 className="font-semibold text-gray-900 mt-1">
                              {
                                payout.providerName
                              }
                            </h3>

                          </div>

                          {getStatusBadge(
                            payout.status
                          )}

                        </div>

                        <div className="space-y-2 mb-3">

                          <div className="flex items-center justify-between">

                            <span className="text-gray-500">
                              Amount:
                            </span>

                            <span className="font-bold text-green-600">
                              {formatCurrency(
                                payout.amount
                              )}
                            </span>

                          </div>

                          <div className="flex items-center justify-between">

                            <span className="text-gray-500">
                              Date:
                            </span>

                            <span>
                              {
                                payout.date
                              }
                            </span>

                          </div>

                        </div>

                        <div className="pt-2 border-t">

                          <button
                            onClick={() =>
                              handleProcessPayout(
                                payout.id
                              )
                            }
                            disabled={
                              payout.status ===
                              "completed"
                            }
                            className="w-full py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                          >
                            Process Payout
                          </button>

                        </div>

                      </div>

                    </motion.div>
                  )
                )}

              </div>
            )}

            <Pagination
              currentPage={
                currentPage
              }
              totalPages={
                totalPagesPayouts
              }
              itemsPerPage={
                itemsPerPage
              }
              totalItems={
                filteredPayouts.length
              }
              onPageChange={
                setCurrentPage
              }
              onItemsPerPageChange={(
                value
              ) => {
                setItemsPerPage(
                  value
                );

                setCurrentPage(1);
              }}
            />
          </>
        )}

        {/* ==================================================
            COMMISSION TAB
        ================================================== */}

        {activeTab ===
          "commission" && (
          <div className="space-y-6">

            {/* =================================================
                PRODUCT / CATEGORY COMMISSION
            ================================================= */}

            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

              <div className="p-4 sm:p-6 border-b border-gray-200">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-3">

                      <div className="p-2.5 rounded-lg bg-blue-50">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Product / Category Commission
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                          Set profit or commission percentage
                          for individual products or categories.
                        </p>
                      </div>

                    </div>

                  </div>

                  <button
                    onClick={
                      handleOpenAddProduct
                    }
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full lg:w-auto"
                  >
                    <Plus className="w-4 h-4" />

                    Add Product / Category
                  </button>

                </div>

              </div>

              {/* =================================================
                  EXAMPLE CALCULATOR
              ================================================= */}

              <div className="p-4 sm:p-6">

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 sm:p-5">

                  <div className="flex items-start gap-3">

                    <Calculator className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />

                    <div>

                      <h3 className="text-sm font-semibold text-blue-900">
                        How the final price is calculated
                      </h3>

                      <p className="text-sm text-blue-800 mt-1">
                        Seller Price + Commission = Final Customer Price
                      </p>

                      <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm">

                        <span className="font-semibold">
                          ₹100
                        </span>

                        <span className="text-gray-400">
                          +
                        </span>

                        <span className="font-semibold text-blue-600">
                          1%
                        </span>

                        <span className="text-gray-400">
                          =
                        </span>

                        <span className="font-bold text-green-600">
                          ₹101
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    PRODUCT TABLE
                ================================================= */}

                <div className="mt-6">

                  {productCommissions.length ===
                  0 ? (
                    <div className="text-center border border-dashed border-gray-300 rounded-xl p-10">

                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />

                      <h3 className="text-lg font-semibold text-gray-800">
                        No products added
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Add your first product or category commission.
                      </p>

                      <button
                        onClick={
                          handleOpenAddProduct
                        }
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />

                        Add Product
                      </button>

                    </div>
                  ) : (
                    <div className="overflow-x-auto">

                      <table className="w-full min-w-[850px]">

                        <thead>

                          <tr className="border-b border-gray-200">

                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                              Product
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                              Category
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                              Seller Price
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                              Commission
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                              Commission Amount
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                              Final Price
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                              Status
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                              Actions
                            </th>

                          </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100">

                          {productCommissions.map(
                            (product) => {

                              const commissionAmount =
                                calculateCommission(
                                  product.sellerPrice,
                                  product.commissionPercent
                                );

                              const finalPrice =
                                calculateFinalPrice(
                                  product.sellerPrice,
                                  product.commissionPercent
                                );

                              return (
                                <tr
                                  key={product.id}
                                  className="hover:bg-gray-50"
                                >

                                  {/* Product */}

                                  <td className="px-4 py-4">

                                    <div className="flex items-center gap-3">

                                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <Package className="w-4 h-4 text-gray-600" />
                                      </div>

                                      <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                          {
                                            product.productName
                                          }
                                        </p>

                                        <p className="text-xs text-gray-500">
                                          {
                                            product.id
                                          }
                                        </p>
                                      </div>

                                    </div>

                                  </td>

                                  {/* Category */}

                                  <td className="px-4 py-4 text-sm text-gray-700">
                                    {
                                      product.category
                                    }
                                  </td>

                                  {/* Seller Price */}

                                  <td className="px-4 py-4">

                                    <span className="text-sm font-medium text-gray-900">
                                      {formatCurrency(
                                        product.sellerPrice
                                      )}
                                    </span>

                                  </td>

                                  {/* Commission */}

                                  <td className="px-4 py-4">

                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                                      {
                                        product.commissionPercent
                                      }
                                      %
                                    </span>

                                  </td>

                                  {/* Commission Amount */}

                                  <td className="px-4 py-4">

                                    <span className="text-sm font-medium text-orange-600">
                                      {formatCurrency(
                                        commissionAmount
                                      )}
                                    </span>

                                  </td>

                                  {/* Final Price */}

                                  <td className="px-4 py-4">

                                    <div>

                                      <span className="text-sm font-bold text-green-600">
                                        {formatCurrency(
                                          finalPrice
                                        )}
                                      </span>

                                      <p className="text-xs text-gray-400">
                                        Seller + commission
                                      </p>

                                    </div>

                                  </td>

                                  {/* Status */}

                                  <td className="px-4 py-4">

                                    <button
                                      onClick={() =>
                                        handleToggleProduct(
                                          product.id
                                        )
                                      }
                                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                        product.active
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {product.active
                                        ? "Active"
                                        : "Inactive"}
                                    </button>

                                  </td>

                                  {/* Actions */}

                                  <td className="px-4 py-4">

                                    <div className="flex items-center justify-end gap-2">

                                      <button
                                        onClick={() =>
                                          handleEditProduct(
                                            product
                                          )
                                        }
                                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                                        title="Edit"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>

                                      <button
                                        onClick={() =>
                                          handleDeleteProduct(
                                            product.id
                                          )
                                        }
                                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>

                                    </div>

                                  </td>

                                </tr>
                              );
                            }
                          )}

                        </tbody>

                      </table>

                    </div>
                  )}

                </div>

              </div>

            </section>

            {/* =================================================
                GENERAL CATEGORY COMMISSION
            ================================================= */}

            <section className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                <div>

                  <h2 className="text-lg font-semibold text-gray-800">
                    General Category Commission Rates
                  </h2>

                  <p className="text-sm text-gray-500">
                    Default commission percentage by category.
                  </p>

                </div>

                {!editingCommission ? (
                  <button
                    onClick={
                      handleEditCommission
                    }
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 w-full sm:w-auto"
                  >
                    <Edit2 className="w-4 h-4" />

                    Edit Rates
                  </button>
                ) : (
                  <div className="flex gap-2">

                    <button
                      onClick={
                        handleCancelEdit
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={
                        handleSaveCommission
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Save className="w-4 h-4" />

                      Save Changes
                    </button>

                  </div>
                )}

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                {(
                  [
                    "cement",
                    "bricks",
                    "steel",
                    "other",
                    "vehicle",
                    "equipment",
                  ] as const
                ).map((category) => (
                  <div
                    key={category}
                    className="border border-gray-200 rounded-lg p-4"
                  >

                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {category} Commission (%)
                    </label>

                    {editingCommission ? (
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={
                          tempRates[
                            category
                          ] === 0
                            ? ""
                            : tempRates[
                                category
                              ]
                        }
                        onChange={(e) =>
                          handleTempRateChange(
                            category,
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                        placeholder="0"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-gray-900">
                        {
                          commissionRates[
                            category
                          ]
                        }
                        %
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                      Default rate for{" "}
                      {category}
                    </p>

                  </div>
                ))}

              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">

                <p className="text-sm text-blue-800">

                  <strong>
                    Note:
                  </strong>{" "}
                  Product-specific commission rates
                  take priority over the general
                  category commission when a product
                  has its own configured percentage.

                </p>

              </div>

            </section>

          </div>
        )}

        {/* ==================================================
            DETAILS MODAL
        ================================================== */}

        <AnimatePresence>

          {showModal ===
            "details" &&
            selectedTransaction && (
              <Modal
                title="Transaction Details"
                onClose={() =>
                  setShowModal(
                    "none"
                  )
                }
              >

                <div className="space-y-4">

                  <div className="grid grid-cols-2 gap-4">

                    <Detail
                      label="Transaction ID"
                      value={
                        selectedTransaction.id
                      }
                    />

                    <Detail
                      label="Order ID"
                      value={
                        selectedTransaction.orderId
                      }
                    />

                    <Detail
                      label="Customer"
                      value={
                        selectedTransaction.customerName
                      }
                    />

                    <Detail
                      label="Provider"
                      value={
                        selectedTransaction.providerName
                      }
                    />

                    <div>

                      <p className="text-xs text-gray-500">
                        Amount
                      </p>

                      <p className="font-bold text-green-600">
                        {formatCurrency(
                          selectedTransaction.amount
                        )}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Commission
                      </p>

                      <p>
                        {formatCurrency(
                          selectedTransaction.commission
                        )}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Status
                      </p>

                      <div className="mt-1">
                        {getStatusBadge(
                          selectedTransaction.status
                        )}
                      </div>

                    </div>

                    <Detail
                      label="Date"
                      value={
                        selectedTransaction.date
                      }
                    />

                  </div>

                  <button
                    onClick={() =>
                      setShowModal(
                        "none"
                      )
                    }
                    className="w-full border border-gray-200 py-2 rounded-lg hover:bg-gray-50 mt-4"
                  >
                    Close
                  </button>

                </div>

              </Modal>
            )}

        </AnimatePresence>

        {/* ==================================================
            ADD / EDIT PRODUCT MODAL
        ================================================== */}

        <AnimatePresence>

          {showProductForm && (
            <ProductCommissionModal
              editing={
                Boolean(
                  editingProductId
                )
              }
              form={productForm}
              setForm={
                setProductForm
              }
              onClose={() => {
                setShowProductForm(
                  false
                );

                resetProductForm();
              }}
              onSave={
                handleSaveProduct
              }
            />
          )}

        </AnimatePresence>

      </div>
    </div>
  );
};

// ============================================================
// EMPTY STATE
// ============================================================

const EmptyState = ({
  icon: Icon,
  title,
  description,
  onClear,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClear: () => void;
}) => (
  <div className="bg-white rounded-lg border p-8 text-center">

    <Icon className="w-12 h-12 text-gray-300 mx-auto mb-3" />

    <h3 className="text-lg font-medium text-gray-900 mb-1">
      {title}
    </h3>

    <p className="text-sm text-gray-500">
      {description}
    </p>

    <button
      onClick={onClear}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Clear Filters
    </button>

  </div>
);

// ============================================================
// TABLE HEADER
// ============================================================

const TableHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
    {children}
  </th>
);

// ============================================================
// DETAIL
// ============================================================

const Detail = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div>
    <p className="text-xs text-gray-500">
      {label}
    </p>

    <p className="text-sm text-gray-900">
      {value}
    </p>
  </div>
);

// ============================================================
// PAGINATION
// ============================================================

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (
    value: number
  ) => void;
}) => {
  if (totalItems === 0) {
    return null;
  }

  const start =
    (currentPage - 1) *
      itemsPerPage +
    1;

  const end = Math.min(
    currentPage * itemsPerPage,
    totalItems
  );

  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">

      <div className="text-sm text-gray-500">
        Showing {start} to {end} of{" "}
        {totalItems}
      </div>

      <div className="flex items-center gap-2">

        <select
          value={itemsPerPage}
          onChange={(e) =>
            onItemsPerPageChange(
              Number(e.target.value)
            )
          }
          className="px-2 py-1 border rounded text-sm"
        >
          <option value={5}>
            5
          </option>

          <option value={10}>
            10
          </option>

          <option value={20}>
            20
          </option>

          <option value={50}>
            50
          </option>
        </select>

        <button
          onClick={() =>
            onPageChange(
              Math.max(
                1,
                currentPage - 1
              )
            )
          }
          disabled={
            currentPage === 1
          }
          className="p-2 border rounded-lg disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-sm">
          Page {currentPage} of{" "}
          {totalPages}
        </span>

        <button
          onClick={() =>
            onPageChange(
              Math.min(
                totalPages,
                currentPage + 1
              )
            )
          }
          disabled={
            currentPage ===
            totalPages
          }
          className="p-2 border rounded-lg disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
};

// ============================================================
// TRANSACTION MODAL
// ============================================================

const Modal = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
      }}
      className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
    >

      <div className="p-4 sm:p-6">

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {children}

      </div>

    </motion.div>

  </div>
);

// ============================================================
// PRODUCT COMMISSION MODAL
// ============================================================

const ProductCommissionModal = ({
  editing,
  form,
  setForm,
  onClose,
  onSave,
}: {
  editing: boolean;
  form: ProductCommission;
  setForm: React.Dispatch<
    React.SetStateAction<ProductCommission>
  >;
  onClose: () => void;
  onSave: () => void;
}) => {
  const commissionAmount =
    calculateCommission(
      Number(form.sellerPrice) || 0,
      Number(form.commissionPercent) || 0
    );

  const finalPrice =
    calculateFinalPrice(
      Number(form.sellerPrice) || 0,
      Number(form.commissionPercent) || 0
    );

  return (
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
      className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
    >

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 20,
          scale: 0.98,
        }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
      >

        {/* Header */}

        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200">

          <div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {editing
                ? "Edit Product Commission"
                : "Add Product / Category"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Configure seller price and commission percentage.
            </p>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* Body */}

        <div className="p-5 sm:p-6 space-y-5">

          {/* Product */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>

            <input
              type="text"
              value={
                form.productName
              }
              onChange={(e) =>
                setForm(
                  (prev) => ({
                    ...prev,
                    productName:
                      e.target.value,
                  })
                )
              }
              placeholder="Example: Cement"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>

          {/* Category */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>

            <input
              type="text"
              value={
                form.category
              }
              onChange={(e) =>
                setForm(
                  (prev) => ({
                    ...prev,
                    category:
                      e.target.value,
                  })
                )
              }
              placeholder="Example: Building Materials"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>

          {/* Price + Commission */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Seller Price */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seller Price (₹)
              </label>

              <div className="relative">

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.sellerPrice
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        sellerPrice:
                          Number(
                            e.target
                              .value
                          ),
                      })
                    )
                  }
                  className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>

            </div>

            {/* Commission */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission / Profit (%)
              </label>

              <div className="relative">

                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={
                    form.commissionPercent
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        commissionPercent:
                          Number(
                            e.target
                              .value
                          ),
                      })
                    )
                  }
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  %
                </span>

              </div>

            </div>

          </div>

          {/* Preview */}

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

            <div className="flex items-center gap-2 mb-4">

              <Calculator className="w-5 h-5 text-blue-600" />

              <h3 className="font-semibold text-gray-900">
                Price Preview
              </h3>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <div className="bg-white rounded-lg border p-3">

                <p className="text-xs text-gray-500">
                  Seller Price
                </p>

                <p className="text-lg font-bold text-gray-900 mt-1">
                  {formatCurrency(
                    Number(
                      form.sellerPrice
                    ) || 0
                  )}
                </p>

              </div>

              <div className="bg-white rounded-lg border p-3">

                <p className="text-xs text-gray-500">
                  Commission
                </p>

                <p className="text-lg font-bold text-orange-600 mt-1">
                  {formatCurrency(
                    commissionAmount
                  )}
                </p>

              </div>

              <div className="bg-green-50 rounded-lg border border-green-200 p-3">

                <p className="text-xs text-green-700">
                  Final Customer Price
                </p>

                <p className="text-lg font-bold text-green-700 mt-1">
                  {formatCurrency(
                    finalPrice
                  )}
                </p>

              </div>

            </div>

            <div className="mt-4 text-center text-sm text-gray-600">

              {formatCurrency(
                Number(
                  form.sellerPrice
                ) || 0
              )}

              {" + "}

              {Number(
                form.commissionPercent
              ) || 0}
              %

              {" = "}

              <strong className="text-green-600">
                {formatCurrency(
                  finalPrice
                )}
              </strong>

            </div>

          </div>

          {/* Active */}

          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">

            <div>

              <p className="text-sm font-semibold text-gray-900">
                Active Commission
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Apply this commission to the product.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setForm(
                  (prev) => ({
                    ...prev,
                    active:
                      !prev.active,
                  })
                )
              }
              className={`relative h-6 w-11 rounded-full transition ${
                form.active
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            >

              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                  form.active
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />

            </button>

          </div>

        </div>

        {/* Footer */}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-5 sm:p-6 border-t border-gray-200">

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editing ? (
              <Save className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}

            {editing
              ? "Update Commission"
              : "Add Product"}
          </button>

        </div>

      </motion.div>

    </motion.div>
  );
};

export default PaymentsManagement;