import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/themes";

const isAuthenticated = () => {
  // Mock authentication check
  return localStorage.getItem("authToken") !== null;
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Layout,
      meta: { breadcrumb: 'App >' },
      children: [
        {
          path: "/",
          name: "dashboard",
          component: () => import("../pages/client/Dashboard.vue"),
          meta: { breadcrumb: 'Dashboard', active: true },
        },
        {
          path: "/platform",
          name: "platform",
          component: () => import("../pages/client/Platform.vue"),
          meta: { breadcrumb: 'Platform'},
        },
        {
          path: "/technical-analysis",
          name: "technical-analysis",
          component: () => import("../pages/client/TechnicalAnalysis.vue"),
          meta: { breadcrumb: 'Technical Analysis'},
        },
        {
          path: "/web-trader",
          name: "web-trader",
          component: () => import("../pages/client/TradeNow.vue"),
          meta: { breadcrumb: 'Web Trader'},
        },
        {
          path: "/create-deposit",
          name: "create-deposit",
          component: () => import("../pages/client/fund/DepositCreate.vue"),
          meta: { breadcrumb: 'Deposit Create'},
        },

        {
          path: "/create-withdraw",
          name: "create-withdraw",
          component: () => import("../pages/client/fund/WithdrawCreate.vue"),
          meta: { breadcrumb: 'Withdraw Create'},
        },
        {
          path: "/transactions",
          name: "transactions",
          component: () => import("../pages/client/TransactionListing.vue"),
          meta: { breadcrumb: 'Transactions' },
        },
        {
          path: "/transactions?page=deposits",
          name: "transactions-deposits",
          component: () => import("../pages/client/TransactionListing.vue"),
          meta: { breadcrumb: 'Transactions' },
        },
        {
          path: "/transactions?page=withdrawals",
          name: "transactions-withdrawals",
          component: () => import("../pages/client/TransactionListing.vue"),
          meta: { breadcrumb: 'Transactions' },
        },
        {
          path: "/transactions?page=internal",
          name: "transactions-internal",
          component: () => import("../pages/client/TransactionListing.vue"),
          meta: { breadcrumb: 'Transactions' },
        },
        {
          path: "/trade-now",
          name: "trade-now",
          component: () => import("../pages/client/TradeNow.vue"),
        },
        {
          path: "/funds",
          name: "funds",
          component: () => import("../pages/client/Funds.vue"),
          meta: { breadcrumb: 'Funds' },
        },
        {
          path: "/create-transfer",
          name: "fund-transfer",
          component: () => import("../pages/client/fund/TransferProcess.vue"),
          meta: { breadcrumb: 'Transfer' },
        },
        {
          path: "/introducingbroker",
          name: "introducingbroker",
          component: () => import("../pages/client/Introducingbrokers.vue"),
          meta: { breadcrumb: 'Introducing Broker' },
        },
        {
          path: "/supportChat",
          name: "supportChat",
          component: () => import("../pages/client/supportChat.vue"),
          meta: { breadcrumb: 'Support Chat' },
        },
        {
          path: "/live-account-info",
          name: "live-account-info",
          component: () => import("../pages/client/LiveAccountDetails.vue"),
          meta: { breadcrumb: 'Live Account Details' },
        },
        {
          path: "/demo-account-info",
          name: "demo-account-info",
          component: () => import("../pages/client/DemoAccountDetails.vue"),
          meta: { breadcrumb: 'Demo Accounts' },
        },
        {
          path: "/live-account-info?page=account",
          name: "live-account-info-account",
          component: () => import("../pages/client/LiveAccountDetails.vue"),
          meta: { breadcrumb: 'Live Account Details' },
        },
        {
          path: "/dashboard-overview-2",
          name: "dashboard-overview-2",
          component: () => import("../pages/DashboardOverview2.vue"),
        },
        {
          path: "/dashboard-overview-3",
          name: "dashboard-overview-3",
          component: () => import("../pages/DashboardOverview3.vue"),
        },
        {
          path: "/dashboard-overview-4",
          name: "dashboard-overview-4",
          component: () => import("../pages/DashboardOverview4.vue"),
        },
        {
          path: "/dashboard-overview-5",
          name: "dashboard-overview-5",
          component: () => import("../pages/DashboardOverview5.vue"),
        },
        {
          path: "/dashboard-overview-6",
          name: "dashboard-overview-6",
          component: () => import("../pages/DashboardOverview6.vue"),
        },
        {
          path: "/dashboard-overview-7",
          name: "dashboard-overview-7",
          component: () => import("../pages/DashboardOverview7.vue"),
        },
        {
          path: "/dashboard-overview-8",
          name: "dashboard-overview-8",
          component: () => import("../pages/DashboardOverview8.vue"),
        },
        {
          path: "/users",
          name: "users",
          component: () => import("../pages/Users.vue"),
        },
        {
          path: "/departments",
          name: "departments",
          component: () => import("../pages/Departments.vue"),
        },
        {
          path: "/add-user",
          name: "add-user",
          component: () => import("../pages/AddUser.vue"),
        },
        {
          path: "/profile-overview",
          name: "profile-overview",
          component: () => import("../pages/ProfileOverview.vue"),
          meta: { breadcrumb: 'Profile' },
        },
        {
          path: "/profile-overview?page=events",
          name: "profile-overview-events",
          component: () => import("../pages/ProfileOverview.vue"),
        },
        {
          path: "/profile-overview?page=achievements",
          name: "profile-overview-achievements",
          component: () => import("../pages/ProfileOverview.vue"),
        },
        {
          path: "/profile-overview?page=contacts",
          name: "profile-overview-contacts",
          component: () => import("../pages/ProfileOverview.vue"),
        },
        {
          path: "/profile-overview?page=default",
          name: "profile-overview-default",
          component: () => import("../pages/ProfileOverview.vue"),
        },
        {
          path: "/settings?page=email-settings",
          name: "settings-email-settings",
          component: () => import("../pages/client/ProfileSettings.vue"),
          meta: { breadcrumb: 'Profile' },
        },
        {
          path: "/settings?page=security",
          name: "settings-security",
          component: () => import("../pages/client/ProfileSettings.vue"),
          meta: { breadcrumb: 'Profile' },
        },
        {
          path: "/settings?page=preferences",
          name: "settings-preferences",
          component: () => import("../pages/client/ProfileSettings.vue"),
          meta: { breadcrumb: 'Profile' },
        },
        {
          path: "/settings?page=two-factor-authentication",
          name: "settings-two-factor-authentication",
          component: () => import("../pages/client/ProfileSettings.vue"),
          meta: { breadcrumb: 'Profile' },
        },
        {
          path: "/settings?page=device-history",
          name: "settings-device-history",
          component: () => import("../pages/client/ProfileSettings.vue"),
        },
        {
          path: "/settings?page=notification-settings",
          name: "settings-notification-settings",
          component: () => import("../pages/client/ProfileSettings.vue"),
          meta: { breadcrumb: 'Profile' },
        },
        {
          path: "/settings?page=connected-services",
          name: "settings-connected-services",
          component: () => import("../pages/client/ProfileSettings.vue"),
        },
        {
          path: "/settings?page=social-media-links",
          name: "settings-social-media-links",
          component: () => import("../pages/client/ProfileSettings.vue"),
          meta: { breadcrumb: 'Profile' },
        },
        {
          path: "/settings?page=account-deactivation",
          name: "settings-account-deactivation",
          component: () => import("../pages/client/ProfileSettings.vue"),
          meta: { breadcrumb: 'Profile' },
        },
        {
          path: "/settings",
          name: "settings",
          component: () => import("../pages/client/ProfileSettings.vue"),
          meta: { breadcrumb: 'Profile' },
        },
        {
          path: "/billing",
          name: "billing",
          component: () => import("../pages/Billing.vue"),
        },
        {
          path: "/invoice",
          name: "invoice",
          component: () => import("../pages/Invoice.vue"),
        },
        {
          path: "/categories",
          name: "categories",
          component: () => import("../pages/Categories.vue"),
        },
        {
          path: "/add-product",
          name: "add-product",
          component: () => import("../pages/AddProduct.vue"),
        },
        {
          path: "/product-list",
          name: "product-list",
          component: () => import("../pages/ProductList.vue"),
        },
        {
          path: "/product-grid",
          name: "product-grid",
          component: () => import("../pages/ProductGrid.vue"),
        },
        {
          path: "/transaction-list",
          name: "transaction-list",
          component: () => import("../pages/TransactionList.vue"),
        },
        {
          path: "/transaction-detail",
          name: "transaction-detail",
          component: () => import("../pages/TransactionDetail.vue"),
        },
        {
          path: "/seller-list",
          name: "seller-list",
          component: () => import("../pages/SellerList.vue"),
        },
        {
          path: "/seller-detail",
          name: "seller-detail",
          component: () => import("../pages/SellerDetail.vue"),
        },
        {
          path: "/reviews",
          name: "reviews",
          component: () => import("../pages/Reviews.vue"),
        },
        {
          path: "/inbox",
          name: "inbox",
          component: () => import("../pages/Inbox.vue"),
        },
        {
          path: "/file-manager-list",
          name: "file-manager-list",
          component: () => import("../pages/FileManagerList.vue"),
        },
        {
          path: "/file-manager-grid",
          name: "file-manager-grid",
          component: () => import("../pages/FileManagerGrid.vue"),
        },
        {
          path: "/chat",
          name: "chat",
          component: () => import("../pages/Chat.vue"),
        },
        {
          path: "/calendar",
          name: "calendar",
          component: () => import("../pages/Calendar.vue"),
        },
        {
          path: "/point-of-sale",
          name: "point-of-sale",
          component: () => import("../pages/PointOfSale.vue"),
        },
        {
          path: "/creative",
          name: "creative",
          component: () => import("../pages/Creative.vue"),
        },
        {
          path: "/dynamic",
          name: "dynamic",
          component: () => import("../pages/Dynamic.vue"),
        },
        {
          path: "/interactive",
          name: "interactive",
          component: () => import("../pages/Interactive.vue"),
        },
        {
          path: "/regular-table",
          name: "regular-table",
          component: () => import("../pages/RegularTable.vue"),
        },
        {
          path: "/tabulator",
          name: "tabulator",
          component: () => import("../pages/Tabulator.vue"),
        },
        {
          path: "/modal",
          name: "modal",
          component: () => import("../pages/Modal.vue"),
        },
        {
          path: "/slideover",
          name: "slideover",
          component: () => import("../pages/Slideover.vue"),
        },
        {
          path: "/notification",
          name: "notification",
          component: () => import("../pages/Notification.vue"),
        },
        {
          path: "/tab",
          name: "tab",
          component: () => import("../pages/Tab.vue"),
        },
        {
          path: "/accordion",
          name: "accordion",
          component: () => import("../pages/Accordion.vue"),
        },
        {
          path: "/button",
          name: "button",
          component: () => import("../pages/Button.vue"),
        },
        {
          path: "/alert",
          name: "alert",
          component: () => import("../pages/Alert.vue"),
        },
        {
          path: "/progress-bar",
          name: "progress-bar",
          component: () => import("../pages/ProgressBar.vue"),
        },
        {
          path: "/tooltip",
          name: "tooltip",
          component: () => import("../pages/Tooltip.vue"),
        },
        {
          path: "/dropdown",
          name: "dropdown",
          component: () => import("../pages/Dropdown.vue"),
        },
        {
          path: "/typography",
          name: "typography",
          component: () => import("../pages/Typography.vue"),
        },
        {
          path: "/icon",
          name: "icon",
          component: () => import("../pages/Icon.vue"),
        },
        {
          path: "/loading-icon",
          name: "loading-icon",
          component: () => import("../pages/LoadingIcon.vue"),
        },
        {
          path: "/regular-form",
          name: "regular-form",
          component: () => import("../pages/RegularForm.vue"),
        },
        {
          path: "/datepicker",
          name: "datepicker",
          component: () => import("../pages/Datepicker.vue"),
        },
        {
          path: "/tom-select",
          name: "tom-select",
          component: () => import("../pages/TomSelect.vue"),
        },
        {
          path: "/file-upload",
          name: "file-upload",
          component: () => import("../pages/FileUpload.vue"),
        },
        {
          path: "/wysiwyg-editor",
          name: "wysiwyg-editor",
          component: () => import("../pages/WysiwygEditor.vue"),
        },
        {
          path: "/validation",
          name: "validation",
          component: () => import("../pages/Validation.vue"),
        },
        {
          path: "/chart",
          name: "chart",
          component: () => import("../pages/Chart.vue"),
        },
        {
          path: "/slider",
          name: "slider",
          component: () => import("../pages/Slider.vue"),
        },
        {
          path: "/image-zoom",
          name: "image-zoom",
          component: () => import("../pages/ImageZoom.vue"),
        },
        {
          path: "/live-rates",
          name: "live-rates",
          component: () => import("../pages/others/LiveMarketRates.vue"),
          meta: { breadcrumb: 'Live Market Rates' },
        },
        {
          path: "/economic-calendar",
          name: "economic-calendar",
          component: () => import("../pages/others/EconomicCalanderCustom.vue"),
          meta: { breadcrumb: 'Economic Calender' },
        },
        {
          path: "/economic-news-feed",
          name: "economic-news-feed",
          component: () => import("../pages/others/EconomicNewsFeed.vue"),
          meta: { breadcrumb: 'Economis News Feed' },
        },
        {
          path: "/technical-indicator",
          name: "technical-indicator",
          component: () => import("../pages/others/TechnicalIndicatorListing.vue"),
          meta: { breadcrumb: 'Techincal Indicator' },
        },
        {
          path: "/forex-glossary",
          name: "forex-glossary",
          component: () => import("../pages/others/ForexGlossary.vue"),
          meta: { breadcrumb: 'Forex Glossary' },
        }
      ],
    },
    {
      path: "/landing-page",
      name: "landing-page",
      component: () => import("../pages/LandingPage.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../pages/Login.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../pages/Register.vue"),
    },
   
    {
      path: "/verify-email",
      name: "verify-email",
      component: () => import("../pages/VerifyEmailOTP.vue"),
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("../pages/ForgotPassword.vue"),
      props: { fields: 4 },
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: () => import("../pages/ResetPasswordView.vue"),
    },
    {
      path: "/unsubscribe",
      name: "unsubscribe",
      component: () => import("../pages/Unsubscribe.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/unsubscribe"];
  if (isAuthenticated()) {
    if (publicRoutes.includes(to.path)) {
      if (to.path == '/unsubscribe')
        next('/unsubscribe');
      else
        next('/'); // Redirect authenticated users from /login or /register to home
    } else {
      next(); // Allow navigation to other routes
    }
  } else {
    if (publicRoutes.includes(to.path)) {
      next(); // Allow navigation to public routes
    } else {
      next('/login'); // Redirect unauthenticated users to login
    }
  }
});

export default router;