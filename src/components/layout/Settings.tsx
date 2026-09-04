import React, { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  ArrowLeft,
  User,
  Bell,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Mail,
  Smartphone,
  Save,
  CheckCircle,
  Monitor,
  UserCircle,
  KeyRound,
  AlertTriangle,
  Database,
  Download,
  Trash2,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SettingsData {
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderNotifications: boolean;
  rentalNotifications: boolean;
  serviceNotifications: boolean;
  promotionalNotifications: boolean;
  loginAlerts: boolean;
  twoFactorEnabled: boolean;
  compactMode: boolean;
  publicProfile: boolean;
  showActivityStatus: boolean;
  language: string;
}

const SETTINGS_KEY = "casa_terminal_settings";

const Settings: React.FC = () => {
  const navigate = useNavigate();

  // =========================================================
  // NOTIFICATION SETTINGS
  // =========================================================

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [rentalNotifications, setRentalNotifications] = useState(true);
  const [serviceNotifications, setServiceNotifications] = useState(true);
  const [promotionalNotifications, setPromotionalNotifications] =
    useState(false);

  // =========================================================
  // ACCOUNT SETTINGS
  // =========================================================

  const [language, setLanguage] = useState("English");
  const [compactMode, setCompactMode] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [showActivityStatus, setShowActivityStatus] = useState(true);

  // =========================================================
  // SECURITY SETTINGS
  // =========================================================

  const [loginAlerts, setLoginAlerts] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // =========================================================
  // PASSWORD
  // =========================================================

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // =========================================================
  // UI STATE
  // =========================================================

  const [saved, setSaved] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  // =========================================================
  // LOAD SETTINGS
  // =========================================================

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);

      if (!savedSettings) {
        return;
      }

      const settings: Partial<SettingsData> = JSON.parse(savedSettings);

      if (typeof settings.emailNotifications === "boolean") {
        setEmailNotifications(settings.emailNotifications);
      }

      if (typeof settings.pushNotifications === "boolean") {
        setPushNotifications(settings.pushNotifications);
      }

      if (typeof settings.orderNotifications === "boolean") {
        setOrderNotifications(settings.orderNotifications);
      }

      if (typeof settings.rentalNotifications === "boolean") {
        setRentalNotifications(settings.rentalNotifications);
      }

      if (typeof settings.serviceNotifications === "boolean") {
        setServiceNotifications(settings.serviceNotifications);
      }

      if (typeof settings.promotionalNotifications === "boolean") {
        setPromotionalNotifications(settings.promotionalNotifications);
      }

      if (typeof settings.loginAlerts === "boolean") {
        setLoginAlerts(settings.loginAlerts);
      }

      if (typeof settings.twoFactorEnabled === "boolean") {
        setTwoFactorEnabled(settings.twoFactorEnabled);
      }

      if (typeof settings.compactMode === "boolean") {
        setCompactMode(settings.compactMode);
      }

      if (typeof settings.publicProfile === "boolean") {
        setPublicProfile(settings.publicProfile);
      }

      if (typeof settings.showActivityStatus === "boolean") {
        setShowActivityStatus(settings.showActivityStatus);
      }

      if (typeof settings.language === "string") {
        setLanguage(settings.language);
      }
    } catch (error) {
      console.error("Unable to load settings:", error);
    }
  }, []);

  // =========================================================
  // SAVE SETTINGS
  // =========================================================

  const handleSaveSettings = () => {
    const settings: SettingsData = {
      emailNotifications,
      pushNotifications,
      orderNotifications,
      rentalNotifications,
      serviceNotifications,
      promotionalNotifications,
      loginAlerts,
      twoFactorEnabled,
      compactMode,
      publicProfile,
      showActivityStatus,
      language,
    };

    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Unable to save settings:", error);
      alert("Unable to save settings.");
    }
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordChanged(true);

    setTimeout(() => {
      setPasswordChanged(false);
    }, 3000);
  };

  // =========================================================
  // RESET SETTINGS
  // =========================================================

  const handleResetSettings = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all settings to default?"
    );

    if (!confirmed) {
      return;
    }

    setEmailNotifications(true);
    setPushNotifications(true);
    setOrderNotifications(true);
    setRentalNotifications(true);
    setServiceNotifications(true);
    setPromotionalNotifications(false);

    setLanguage("English");
    setCompactMode(false);
    setPublicProfile(true);
    setShowActivityStatus(true);

    setLoginAlerts(true);
    setTwoFactorEnabled(false);

    localStorage.removeItem(SETTINGS_KEY);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  // =========================================================
  // DOWNLOAD DATA
  // =========================================================

  const handleDownloadData = () => {
    const data = {
      profile: {
        name: "Vignesh Kumar",
        email: "vignesh@example.com",
      },
      settings: {
        emailNotifications,
        pushNotifications,
        orderNotifications,
        rentalNotifications,
        serviceNotifications,
        promotionalNotifications,
        loginAlerts,
        twoFactorEnabled,
        compactMode,
        publicProfile,
        showActivityStatus,
        language,
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "casa-terminal-data.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================================================
  // DELETE ACCOUNT
  // =========================================================

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem("casa_terminal_user");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    alert("Your account data has been removed.");

    navigate("/");
    window.location.reload();
  };

  // =========================================================
  // TOGGLE COMPONENT
  // =========================================================

  const Toggle = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: (value: boolean) => void;
  }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${
          enabled ? "bg-[#8b6f47]" : "bg-gray-300"
        }`}
        aria-label="Toggle setting"
        aria-pressed={enabled}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    );
  };

  // =========================================================
  // SETTING ROW COMPONENT
  // =========================================================

  const SettingRow = ({
    icon: Icon,
    title,
    description,
    enabled,
    onChange,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    enabled: boolean;
    onChange: (value: boolean) => void;
  }) => {
    return (
      <div className="flex items-center justify-between gap-4 p-5">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex-shrink-0 rounded-lg bg-gray-100 p-2.5">
            <Icon className="h-5 w-5 text-gray-600" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{title}</p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              {description}
            </p>
          </div>
        </div>

        <Toggle enabled={enabled} onChange={onChange} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mb-7">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#8b6f47]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#8b6f47]/10">
              <SettingsIcon className="h-6 w-6 text-[#8b6f47]" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Settings
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your account preferences and settings
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            SUCCESS MESSAGE
        =================================================== */}

        {saved && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            Settings saved successfully.
          </div>
        )}

        {/* ===================================================
            PASSWORD SUCCESS
        =================================================== */}

        {passwordChanged && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            Password changed successfully.
          </div>
        )}

        {/* ===================================================
            ACCOUNT SETTINGS
        =================================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-[#8b6f47]" />

              <div>
                <h2 className="font-bold text-gray-900">
                  Account Settings
                </h2>

                <p className="text-xs text-gray-500">
                  Manage your account information
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {/* Profile */}

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-gray-50"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex-shrink-0 rounded-lg bg-gray-100 p-2.5">
                  <UserCircle className="h-5 w-5 text-gray-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Profile Information
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Update your name, email and contact details
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400" />
            </button>

            {/* Language */}

            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex-shrink-0 rounded-lg bg-gray-100 p-2.5">
                  <Globe className="h-5 w-5 text-gray-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Language
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Choose your preferred language
                  </p>
                </div>
              </div>

              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#8b6f47] focus:ring-2 focus:ring-[#8b6f47]/10"
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>
        </section>

        {/* ===================================================
            NOTIFICATIONS
        =================================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-[#8b6f47]" />

              <div>
                <h2 className="font-bold text-gray-900">Notifications</h2>

                <p className="text-xs text-gray-500">
                  Control how you receive notifications
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            <SettingRow
              icon={Mail}
              title="Email Notifications"
              description="Receive important updates through email"
              enabled={emailNotifications}
              onChange={setEmailNotifications}
            />

            <SettingRow
              icon={Smartphone}
              title="Push Notifications"
              description="Receive notifications on your device"
              enabled={pushNotifications}
              onChange={setPushNotifications}
            />

            <SettingRow
              icon={RefreshCw}
              title="Order Updates"
              description="Get updates about your orders and deliveries"
              enabled={orderNotifications}
              onChange={setOrderNotifications}
            />

            <SettingRow
              icon={Database}
              title="Rental Updates"
              description="Receive updates about your rental bookings"
              enabled={rentalNotifications}
              onChange={setRentalNotifications}
            />

            <SettingRow
              icon={User}
              title="Service Updates"
              description="Receive updates about contractor services"
              enabled={serviceNotifications}
              onChange={setServiceNotifications}
            />

            <SettingRow
              icon={Bell}
              title="Promotions & Offers"
              description="Receive special offers, discounts and promotions"
              enabled={promotionalNotifications}
              onChange={setPromotionalNotifications}
            />
          </div>
        </section>

        {/* ===================================================
            APPEARANCE
            DARK MODE REMOVED
        =================================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <Monitor className="h-5 w-5 text-[#8b6f47]" />

              <div>
                <h2 className="font-bold text-gray-900">Appearance</h2>

                <p className="text-xs text-gray-500">
                  Customize your display preferences
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            <SettingRow
              icon={Monitor}
              title="Compact Mode"
              description="Reduce spacing for a more compact website layout"
              enabled={compactMode}
              onChange={setCompactMode}
            />
          </div>
        </section>

        {/* ===================================================
            PRIVACY
        =================================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-[#8b6f47]" />

              <div>
                <h2 className="font-bold text-gray-900">Privacy</h2>

                <p className="text-xs text-gray-500">
                  Control your profile visibility and activity
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            <SettingRow
              icon={UserCircle}
              title="Public Profile"
              description="Allow other users to view your basic profile"
              enabled={publicProfile}
              onChange={setPublicProfile}
            />

            <SettingRow
              icon={Eye}
              title="Activity Status"
              description="Show when you are active on CASA TERMINAL"
              enabled={showActivityStatus}
              onChange={setShowActivityStatus}
            />
          </div>
        </section>

        {/* ===================================================
            SECURITY
        =================================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-[#8b6f47]" />

              <div>
                <h2 className="font-bold text-gray-900">Security</h2>

                <p className="text-xs text-gray-500">
                  Keep your account secure
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {/* Login Alerts */}

            <SettingRow
              icon={Bell}
              title="Login Alerts"
              description="Get notified when your account is accessed"
              enabled={loginAlerts}
              onChange={setLoginAlerts}
            />

            {/* Two Factor */}

            <div className="flex items-center justify-between gap-4 p-5">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex-shrink-0 rounded-lg bg-gray-100 p-2.5">
                  <KeyRound className="h-5 w-5 text-gray-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Two-Factor Authentication
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>

              <Toggle
                enabled={twoFactorEnabled}
                onChange={setTwoFactorEnabled}
              />
            </div>

            {/* Change Password */}

            <div className="p-5">
              <div className="mb-5 flex items-center gap-3">
                <Lock className="h-5 w-5 text-gray-500" />

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Change Password
                  </h3>

                  <p className="text-xs text-gray-500">
                    Update your account password
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Current Password */}

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-700">
                    Current Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(event.target.value)
                      }
                      placeholder="Current password"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-[#8b6f47] focus:ring-2 focus:ring-[#8b6f47]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-700">
                    New Password
                  </label>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="New password"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#8b6f47] focus:ring-2 focus:ring-[#8b6f47]/10"
                  />
                </div>

                {/* Confirm Password */}

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-700">
                    Confirm Password
                  </label>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm password"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#8b6f47] focus:ring-2 focus:ring-[#8b6f47]/10"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleChangePassword}
                className="mt-4 flex items-center gap-2 rounded-lg border border-[#8b6f47] px-4 py-2.5 text-sm font-semibold text-[#8b6f47] transition hover:bg-[#8b6f47] hover:text-white"
              >
                <Lock className="h-4 w-4" />
                Change Password
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================
            DATA & ACCOUNT
        =================================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-[#8b6f47]" />

              <div>
                <h2 className="font-bold text-gray-900">Data & Account</h2>

                <p className="text-xs text-gray-500">
                  Manage your account data
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {/* Download */}

            <button
              type="button"
              onClick={handleDownloadData}
              className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-gray-100 p-2.5">
                  <Download className="h-5 w-5 text-gray-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Download My Data
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Download your profile and settings information
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>

            {/* Reset */}

            <button
              type="button"
              onClick={handleResetSettings}
              className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-gray-100 p-2.5">
                  <RefreshCw className="h-5 w-5 text-gray-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Reset Settings
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Restore all settings to their default values
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>

            {/* Delete Account */}

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-red-50"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-red-50 p-2.5">
                  <Trash2 className="h-5 w-5 text-red-500" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-600">
                    Delete Account
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Permanently remove your account data
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-red-400" />
            </button>
          </div>
        </section>

        {/* ===================================================
            SECURITY INFORMATION
        =================================================== */}

        <div className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />

          <div>
            <p className="text-sm font-semibold text-amber-800">
              Security Reminder
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-700">
              Never share your password or verification codes with anyone.
              CASA TERMINAL will never ask you for your password through email
              or chat.
            </p>
          </div>
        </div>

        {/* ===================================================
            SAVE BUTTON
        =================================================== */}

        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            <User className="h-4 w-4" />
            Profile
          </button>

          <button
            type="button"
            onClick={handleSaveSettings}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8b6f47] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#735b3c] sm:w-auto"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;