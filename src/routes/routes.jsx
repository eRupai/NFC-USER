// All page imports live here — add/remove routes in one place
import Dashboard          from "../features/dashboard/index";
import NFCCardsPage       from "../pages/Nfccardspage";
import WriteNFCCardPage   from "../pages/WriteNFCCardPage";
import ReWriteNFCCardPage from "../pages/Rewritenfccardpage";
import BulkOperationsPage from "../pages/Bulkoperationspage";
import ActivityLogsPage   from "../pages/Activitylogspage";
import SettingsPage       from "../pages/Settingspage";
import SubscriptionPage   from "../pages/Subscriptionpage";
import LeadsUsersPage     from "../pages/Leadsuserspage";
import ScanAnalyticsPage  from "../pages/Scananalyticspage";
import APIIntegrationsPage from "../pages/Apiintegrationspage";
import NFCTemplatesPage   from "../pages/Nfctemplatespage";
import WalletCreditsPage  from "../pages/Walletcreditspage";
import HelpSupportPage    from "../pages/Helpsupportpage";
import ContactUsPage      from "../pages/Contactuspage";

/**
 * Map of routeId → React element factory.
 * Each factory receives `setActiveItem` so pages can trigger navigation.
 */
export const ROUTES = {
  dashboard:      (nav) => <Dashboard />,
  "my-cards":     (nav) => <NFCCardsPage        onMenuClick={() => nav("my-cards")} />,
  "write-card":   (nav) => <WriteNFCCardPage />,
  "rewrite-card": (nav) => <ReWriteNFCCardPage />,
  "bulk-ops":     (nav) => <BulkOperationsPage />,
  "activity-logs":(nav) => <ActivityLogsPage />,
  settings:       (nav) => <SettingsPage />,
  subscription:   (nav) => <SubscriptionPage />,
  leads:          (nav) => <LeadsUsersPage />,
  "scan-analytics":(nav) => <ScanAnalyticsPage />,
  api:            (nav) => <APIIntegrationsPage />,
  templates:      (nav) => <NFCTemplatesPage />,
  wallet:         (nav) => <WalletCreditsPage    onMenuClick={() => nav("wallet")} />,
  help:           (nav) => <HelpSupportPage      onMenuClick={() => nav("help")} />,
  contact:        (nav) => <ContactUsPage        onMenuClick={() => nav("contact")} />,
};

export const DEFAULT_ROUTE = "dashboard";
