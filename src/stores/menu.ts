import { type Icon } from "@/components/Base/Lucide/Lucide.vue";
import { defineStore } from "pinia";

export interface Menu {
  icon: Icon;
  title: string;
  badge?: number;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface MenuState {
  value: Array<Menu | string>;
}

export const useMenuStore = defineStore("menu", {
  state: (): MenuState => ({
    value: [
      "QUICK ACCESS",
      {
        icon: "LayoutDashboard", // Suitable for "Overview"
        pageName: "dashboard",
        title: "Overview",
      },
      {
        icon: "LayoutDashboard", // Suitable for "Overview"
        pageName: "platform",
        title: "Platform",
      },
      {
        icon: "LayoutDashboard", // Suitable for "Overview"
        pageName: "technical-analysis",
        title: "Technical Analysis",
      },
      {
        icon: "LayoutDashboard", // Suitable for "Overview"
        pageName: "transactionlist",
        title: "Transaction",
      },
      {
        icon: "Activity", // Represents trading activity (can also use "TrendingUp" if preferred)
        pageName: "trading",
        title: "Transaction History",
        subMenu: [
          {
            icon: "ArrowUpCircle", // Represents deposits (money coming in)
            pageName: "trading-trade-history",
            title: "Deposits",
          },
          {
            icon: "ArrowDownCircle", // Represents withdrawals (money going out)
            pageName: "trading-trading-tools",
            title: "Withdrawals",
          },
          {
            icon: "Exchange", // Represents internal transactions (money transfer)
            pageName: "trading-market-analysis",
            title: "Internal Transactions",
          },
        ],
      },
      {
        icon: "Users", // Represents account management
        pageName: "accounts",
        title: "Accounts",
        subMenu: [
          {
            icon: "UserCheck", // Represents live accounts
            pageName: "accounts-manage-live",
            title: "Manage Live Accounts",
          },
          {
            icon: "UserPlus", // Represents demo accounts
            pageName: "accounts-manage-demo",
            title: "Manage Demo Accounts",
          },
        ],
      },
     
      "FUNDS",
      {
        icon: "CreditCard", // For fund management
        pageName: "fund-management",
        title: "Fund Management",
        subMenu: [
          {
            icon: "PlusCircle", // Add funds
            pageName: "deposits-withdrawals-fund-account",
            title: "Fund Account",
          },
          {
            icon: "ArrowDownCircle", // Withdraw funds
            pageName: "deposits-withdrawals-withdrawal-requests",
            title: "Withdrawal Requests",
          },
          {
            icon: "List", // Represents transaction history
            pageName: "deposits-withdrawals-transaction-history",
            title: "Transaction History",
          },
          {
            icon: "Wallet", // Represents wallet overview
            pageName: "deposits-withdrawals-wallet-overview",
            title: "Wallet Overview",
          },
        ],
        

      },
      {
        icon: "CreditCard", // For fund management
        pageName: "deposit",
        title: "Deposits",
      },
      {
        icon: "CreditCard", // For fund management
        pageName: "withdraw",
        title: "Withdrawals",
      },
      {
        icon: "CreditCard", // For fund management
        pageName: "Internal-Transfer",
        title: "Internal Transfer",
      },

      "RESOURCES & INSIGHTS",
      {
        icon: "FileText", // For reporting
        pageName: "reports",
        title: "Reports",
        subMenu: [
          {
            icon: "Clipboard", // Represents statements
            pageName: "reports-account-statements",
            title: "Account Statements",
          },
          {
            icon: "BarChart2", // Custom reports visualization
            pageName: "reports-custom-reports",
            title: "Custom Reports",
          },
        ],
      },
      {
        icon: "Activity", // Represents market data
        pageName: "market-data",
        title: "Market Data",
        subMenu: [
          {
            icon: "TrendingUp", // Live market rates
            pageName: "market-data-live-market-rates",
            title: "Live Market Rates",
          },
          {
            icon: "Calendar", // Economic calendar
            pageName: "market-data-economic-calendar",
            title: "Economic Calendar",
          },
          {
            icon: "Newspaper", // News feed
            pageName: "market-data-news-feed",
            title: "News Feed",
          },
          {
            icon: "BarChart", // Forex indicators
            pageName: "market-data-forex-indicators",
            title: "Forex Indicators",
          },
        ],
      },
      {
        icon: "BookOpen", // Represents education
        pageName: "education",
        title: "Education",
        subMenu: [
          {
            icon: "Bookmark", // Learning center
            pageName: "education-learning-center",
            title: "Learning Center",
          },
          {
            icon: "Play", // Tutorials
            pageName: "education-trading-tutorials",
            title: "Trading Tutorials",
          },
          {
            icon: "Book", // Glossary
            pageName: "education-forex-glossary",
            title: "Forex Glossary",
          },
          {
            icon: "Layers", // Strategies
            pageName: "education-market-strategies",
            title: "Market Strategies",
          },
        ],
      },
      {
        icon: "HelpCircle", // Represents customer support
        pageName: "customer-support",
        title: "Customer Support",
        subMenu: [
          {
            icon: "MessageCircle", // Support tickets
            pageName: "customer-support-support-tickets",
            title: "Support Tickets",
          },
          {
            icon: "Info", // FAQs
            pageName: "customer-support-faqs",
            title: "FAQs",
          },
        ],
      },
      {
        icon: "Handshake", // Represents partnership
        pageName: "partners-affiliates",
        title: "Partners & Affiliates",
        subMenu: [
          {
            icon: "Briefcase", // Affiliate dashboard
            pageName: "partners-affiliates-dashboard",
            title: "Affiliate Dashboard",
          },
          {
            icon: "Share2", // Referral program
            pageName: "partners-affiliates-referral-program",
            title: "Referral Program",
          },
        ],
      },
      {
        icon: "Gift", // Promotions
        pageName: "promotions",
        title: "Promotions",
        subMenu: [
          {
            icon: "Star", // Bonuses and offers
            pageName: "promotions-bonuses-offers",
            title: "Bonuses & Offers",
          },
          {
            icon: "Trophy", // Competitions
            pageName: "promotions-competitions",
            title: "Competitions",
          },
        ],
      },
      "TOOLS & COMPLIANCE",
      {
        icon: "Tool", // Tools
        pageName: "tools",
        title: "Tools & Add-Ons",
        subMenu: [
          {
            icon: "Calculator", // Forex calculator
            pageName: "tools-forex-calculator",
            title: "Forex Calculator",
          },
          {
            icon: "Percent", // Margin calculator
            pageName: "tools-margin-calculator",
            title: "Margin Calculator",
          },
        ],
      },
      {
        icon: "Shield", // Compliance
        pageName: "compliance",
        title: "Compliance",
        subMenu: [
          {
            icon: "CheckCircle", // KYC Verification
            pageName: "compliance-kyc-verification",
            title: "KYC Verification",
          },
          {
            icon: "FileText", // Terms & Conditions
            pageName: "compliance-terms-conditions",
            title: "Terms & Conditions",
          },
          {
            icon: "Lock", // Privacy policy
            pageName: "compliance-privacy-policy",
            title: "Privacy Policy",
          },
          {
            icon: "Archive", // Regulatory information
            pageName: "compliance-regulatory-information",
            title: "Regulatory Information",
          },
        ],
      },
      "PROFILE",
      {
        icon: "Tool", // Tools
        pageName: "Profile",
        title: "Profile and Settings",
        subMenu: [
          {
            icon: "Calculator", 
            pageName: "Account",
            title: "Account Settings",
          },
          {
            icon: "Percent", 
            pageName: "verification",
            title: "Verification",
          },
          {
            icon: "Percent", 
            pageName: "Security",
            title: "Security",
          },
        ],
      },
      {
        icon: "LogOut", // Log out
        pageName: "logout-sign-out",
        title: "Sign Out",
      },

    ],
  }),
});
