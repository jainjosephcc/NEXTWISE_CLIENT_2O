<script setup lang="ts">
import { useRouter } from "vue-router";

// Menu Items Array
interface MenuItem {
  icon: string;
  title: string;
  pageName: string;
  badge?: number;
  subMenu?: MenuItem[];
}

const menuItems: (MenuItem | string)[] = [
  // DASHBOARDS
  "DASHBOARDS",
  { icon: "GaugeCircle", title: "E-Commerce", pageName: "dashboard-overview-1" },
  { icon: "ActivitySquare", title: "CRM", pageName: "dashboard-overview-2" },
  { icon: "Album", title: "Hospital", pageName: "dashboard-overview-3" },
  { icon: "BookMarked", title: "Factory", pageName: "dashboard-overview-4" },
  { icon: "HardDrive", title: "Banking", pageName: "dashboard-overview-5" },
  { icon: "MousePointerSquare", title: "Cafe", pageName: "dashboard-overview-6" },
  { icon: "ShieldHalf", title: "Crypto", pageName: "dashboard-overview-7" },
  { icon: "Building", title: "Hotel", pageName: "dashboard-overview-8" },

  // APPS
  "APPS",
  { icon: "GanttChartSquare", title: "Inbox", pageName: "inbox", badge: 4 },
  { icon: "PanelRightClose", title: "File Manager List", pageName: "file-manager-list" },
  { icon: "PanelTopClose", title: "File Manager Grid", pageName: "file-manager-grid" },
  { icon: "PanelTopClose", title: "Point of Sale", pageName: "point-of-sale" },
  { icon: "MailOpen", title: "Chat", pageName: "chat" },
  { icon: "CalendarRange", title: "Calendar", pageName: "calendar" },

  // UI WIDGETS
  "UI WIDGETS",
  { icon: "Album", title: "Creative", pageName: "creative" },
  { icon: "ActivitySquare", title: "Dynamic", pageName: "dynamic" },
  { icon: "Keyboard", title: "Interactive", pageName: "interactive" },

  // USER MANAGEMENT
  "USER MANAGEMENT",
  { icon: "SquareUser", title: "Users", pageName: "users" },
  { icon: "CakeSlice", title: "Departments", pageName: "departments" },
  { icon: "PackagePlus", title: "Add User", pageName: "add-user" },

  // PERSONAL DASHBOARD
  "PERSONAL DASHBOARD",
  { icon: "Presentation", title: "Profile Overview", pageName: "profile-overview" },
  { icon: "CalendarRange", title: "Events", pageName: "profile-overview-events" },
  { icon: "Medal", title: "Achievements", pageName: "profile-overview-achievements" },
  { icon: "TabletSmartphone", title: "Contacts", pageName: "profile-overview-contacts" },
  { icon: "Snail", title: "Default", pageName: "profile-overview-default" },

  // GENERAL SETTINGS
  "GENERAL SETTINGS",
  { icon: "Briefcase", title: "Profile Info", pageName: "settings" },
  { icon: "MailCheck", title: "Email Settings", pageName: "settings-email-settings" },
  { icon: "Fingerprint", title: "Security", pageName: "settings-security" },
  { icon: "Fingerprint", title: "identity", pageName: "settings-identity" },

  { icon: "Radar", title: "Preferences", pageName: "settings-preferences" },
  { icon: "DoorOpen", title: "Two-factor Authentication", pageName: "settings-two-factor-authentication" },
  { icon: "Keyboard", title: "Device History", pageName: "settings-device-history" },
  { icon: "Ticket", title: "Notification Settings", pageName: "settings-notification-settings" },
  { icon: "BusFront", title: "Connected Services", pageName: "settings-connected-services" },
  { icon: "Podcast", title: "Social Media Links", pageName: "settings-social-media-links" },
  { icon: "PackageX", title: "Account Deactivation", pageName: "settings-account-deactivation" },

  // ACCOUNT
  "ACCOUNT",
  { icon: "PercentSquare", title: "Billing", pageName: "billing" },
  { icon: "DatabaseZap", title: "Invoice", pageName: "invoice" },

  // E-COMMERCE
  "E-COMMERCE",
  { icon: "BookMarked", title: "Categories", pageName: "categories" },
  { icon: "Compass", title: "Add Product", pageName: "add-product" },
  {
    icon: "Table2",
    title: "Products",
    pageName: "products",
    subMenu: [
      { icon: "LayoutPanelTop", title: "Product List", pageName: "product-list" },
      { icon: "LayoutPanelLeft", title: "Product Grid", pageName: "product-grid" },
    ],
  },
  {
    icon: "SigmaSquare",
    title: "Transactions",
    pageName: "transactions",
    subMenu: [
      { icon: "DivideSquare", title: "Transaction List", pageName: "transaction-list" },
      { icon: "PlusSquare", title: "Transaction Detail", pageName: "transaction-detail" },
    ],
  },
  {
    icon: "FileArchive",
    title: "Sellers",
    pageName: "sellers",
    subMenu: [
      { icon: "FileImage", title: "Seller List", pageName: "seller-list" },
      { icon: "FileBox", title: "Seller Detail", pageName: "seller-detail" },
    ],
  },
  { icon: "Goal", title: "Reviews", pageName: "reviews" },

  // AUTHENTICATIONS
  "AUTHENTICATIONS",
  { icon: "BookKey", title: "Login", pageName: "login" },
  { icon: "BookLock", title: "Register", pageName: "register" },

  // COMPONENTS
  "COMPONENTS",
  {
    icon: "LayoutPanelLeft",
    title: "Table",
    pageName: "table",
    subMenu: [
      { icon: "FlipVertical", title: "Regular Table", pageName: "regular-table" },
      { icon: "FlipHorizontal", title: "Tabulator", pageName: "tabulator" },
    ],
  },
  {
    icon: "MemoryStick",
    title: "Overlay",
    pageName: "overlay",
    subMenu: [
      { icon: "MenuSquare", title: "Modal", pageName: "modal" },
      { icon: "Newspaper", title: "Slide Over", pageName: "slideover" },
      { icon: "PanelBottom", title: "Notification", pageName: "notification" },
    ],
  },
  { icon: "Package2", title: "Tab", pageName: "tab" },
  { icon: "Pocket", title: "Accordion", pageName: "accordion" },
  { icon: "PlusSquare", title: "Button", pageName: "button" },
  { icon: "Presentation", title: "Alert", pageName: "alert" },
  { icon: "ShieldEllipsis", title: "Progress Bar", pageName: "progress-bar" },
  { icon: "Clapperboard", title: "Tooltip", pageName: "tooltip" },
  { icon: "FlipVertical", title: "Dropdown", pageName: "dropdown" },
  { icon: "FileType2", title: "Typography", pageName: "typography" },
  { icon: "Aperture", title: "Icon", pageName: "icon" },
  { icon: "Droplets", title: "Loading Icon", pageName: "loading-icon" },
  { icon: "GalleryHorizontalEnd", title: "Regular Form", pageName: "regular-form" },
  { icon: "Microwave", title: "Datepicker", pageName: "datepicker" },
  { icon: "Disc3", title: "Tom Select", pageName: "tom-select" },
  { icon: "Sandwich", title: "File Upload", pageName: "file-upload" },
  { icon: "HopOff", title: "Wysiwyg Editor", pageName: "wysiwyg-editor" },
  { icon: "ClipboardType", title: "Validation", pageName: "validation" },
  { icon: "PieChart", title: "Chart", pageName: "chart" },
  { icon: "KanbanSquare", title: "Slider", pageName: "slider" },
  { icon: "Image", title: "Image Zoom", pageName: "image-zoom" },
];

const router = useRouter();

const navigateTo = (pageName: string) => {
  router.push({ name: pageName });
};
</script>

<template>
  <div class="p-6">
    <div v-for="(item, index) in menuItems" :key="index" class="mb-4">
      <!-- Category Header -->
      <h2 v-if="typeof item === 'string'" class="text-lg font-bold text-gray-700 mb-2">
        {{ item }}
      </h2>

      <!-- Widget Card -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(subItem, subIndex) in (item.subMenu || [item])" :key="subIndex"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer"
          @click="navigateTo(subItem.pageName)">
          <div class="flex items-center">
            <i :class="`lucide-${subItem.icon.toLowerCase()} w-10 h-10 text-blue-500`"></i>
            <div class="ml-4">
              <h3 class="text-sm font-semibold text-gray-800">{{ subItem.title }}</h3>
              <span v-if="subItem.badge" class="text-xs text-white bg-red-500 rounded-full px-2 py-1">
                {{ subItem.badge }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/lucide/0.0.7/lucide.min.css";
</style>
