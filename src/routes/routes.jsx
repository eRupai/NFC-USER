// All page imports live here — add/remove routes in one place
import Dashboard           from "../features/dashboard/index";
import NFCCardsPage        from "../pages/Nfccardspage";
import WriteNFCCardPage    from "../pages/WriteNFCCardPage";
import ReWriteNFCCardPage  from "../pages/Rewritenfccardpage";
import BulkOperationsPage  from "../pages/Bulkoperationspage";
import ActivityLogsPage    from "../pages/Activitylogspage";
import SettingsPage        from "../pages/Settingspage";
import SubscriptionPage    from "../pages/Subscriptionpage";
import LeadsUsersPage      from "../pages/Leadsuserspage";
import ScanAnalyticsPage   from "../pages/Scananalyticspage";
import APIIntegrationsPage from "../pages/Apiintegrationspage";
import NFCTemplatesPage    from "../pages/Nfctemplatespage";
import WalletCreditsPage   from "../pages/Walletcreditspage";
import HelpSupportPage     from "../pages/Helpsupportpage";
import ContactUsPage       from "../pages/Contactuspage";
import GeographicReportsPage  from "../pages/Geographicreportspage";
import DeviceAnalyticsPage    from "../pages/Deviceanalyticspage";
import ReviewsFeedbackPage    from "../pages/Reviewsfeedbackpage";
import AdminSettingsPage      from "../pages/AdminSettingsPage";
import AdminBillingPage       from "../pages/AdminBillingPage";
import AdminHelpSupportPage   from "../pages/AdminHelpSupportPage";

export const ROUTES = {
  dashboard:          (nav) => <Dashboard />,
  "my-cards":         (nav) => <NFCCardsPage          onMenuClick={() => nav("my-cards")}          navigate={nav} />,
  "write-card":       (nav) => <WriteNFCCardPage       onMenuClick={() => nav("write-card")}        navigate={nav} />,
  "rewrite-card":     (nav) => <ReWriteNFCCardPage     onMenuClick={() => nav("rewrite-card")}      navigate={nav} />,
  "bulk-ops":         (nav) => <BulkOperationsPage     onMenuClick={() => nav("bulk-ops")}          navigate={nav} />,
  "activity-logs":    (nav) => <ActivityLogsPage       onMenuClick={() => nav("activity-logs")}     navigate={nav} />,
  settings:           (nav) => <SettingsPage           onMenuClick={() => nav("settings")}          navigate={nav} />,
  subscription:       (nav) => <SubscriptionPage       onMenuClick={() => nav("subscription")}      navigate={nav} />,
  leads:              (nav) => <LeadsUsersPage         onMenuClick={() => nav("leads")}             navigate={nav} />,
  "scan-analytics":   (nav) => <ScanAnalyticsPage      onMenuClick={() => nav("scan-analytics")}    navigate={nav} />,
  api:                (nav) => <APIIntegrationsPage    onMenuClick={() => nav("api")}               navigate={nav} />,
  templates:          (nav) => <NFCTemplatesPage       onMenuClick={() => nav("templates")}         navigate={nav} />,
  wallet:             (nav) => <WalletCreditsPage      onMenuClick={() => nav("wallet")}            navigate={nav} />,
  help:               (nav) => <HelpSupportPage        onMenuClick={() => nav("help")}              navigate={nav} />,
  contact:            (nav) => <ContactUsPage          onMenuClick={() => nav("contact")}           navigate={nav} />,
  "geo-reports":      (nav) => <GeographicReportsPage  onMenuClick={() => nav("geo-reports")}       navigate={nav} />,
  "device-analytics": (nav) => <DeviceAnalyticsPage    onMenuClick={() => nav("device-analytics")}  navigate={nav} />,
  "reviews-feedback": (nav) => <ReviewsFeedbackPage    onMenuClick={() => nav("reviews-feedback")}  navigate={nav} />,
  "admin-settings":   (nav) => <AdminSettingsPage      onMenuClick={() => nav("admin-settings")}    navigate={nav} />,
  "admin-billing":    (nav) => <AdminBillingPage       onMenuClick={() => nav("admin-billing")}     navigate={nav} />,
  "admin-help":       (nav) => <AdminHelpSupportPage   onMenuClick={() => nav("admin-help")}        navigate={nav} />,
};

export const DEFAULT_ROUTE = "dashboard";