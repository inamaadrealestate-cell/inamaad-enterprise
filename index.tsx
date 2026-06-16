import React, { useEffect, useMemo, useState } from "react";

type Listing = {
  id: number;
  title: string;
  location: string;
  state: string;
  price: string;
  type: string;
  typeValue: string;
  roi: string;
  status: string;
  summary: string;
  bedrooms?: string;
  bathrooms?: string;
  landSize?: string;
  documentTitle?: string;
  ownerName?: string;
  ownerRole?: string;
  ownerPhone?: string;
  whatsapp?: string;
  ownerVerified?: boolean;
  ownerVerificationNote?: string;
  featured?: boolean;
  imageUrl?: string;
  galleryUrls?: string[];
  documentName?: string;
  documentDataUrl?: string;
  documentMimeType?: string;
};


type Lead = {
  id: number;
  listingId?: number;
  listingTitle?: string;
  name: string;
  email: string;
  phone: string;
  budget: string;
  message: string;
  createdAt: string;
  status: "New" | "Contacted" | "Closed";
};


type Inspection = {
  id: number;
  listingId?: number;
  listingTitle?: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  note: string;
  createdAt: string;
  status: "New" | "Confirmed" | "Completed" | "Cancelled";
};

type ActivityLog = {
  id: number;
  action: string;
  detail: string;
  category: "Listing" | "Lead" | "Inspection" | "Admin" | "Backup" | "System";
  createdAt: string;
};

type AdminTask = {
  id: number;
  title: string;
  assignee: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "In Progress" | "Done";
  note: string;
  createdAt: string;
  completedAt?: string;
};

type ModalType =
  | "login"
  | "register"
  | "forgot"
  | "post"
  | "investor"
  | "inspection"
  | "admin"
  | null;

type AuthUser = {
  name: string;
  email: string;
};

const WHATSAPP_NUMBER = "2348106350486";
const ADMIN_PASSWORD = "admin123";

const STATS = [
  { num: "2,400+", label: "Verified listings" },
  { num: "₦840B+", label: "Total deal value" },
  { num: "1,100+", label: "Active investors" },
  { num: "180+", label: "JV opportunities" },
];

const CATEGORIES = [
  { label: "Residential", count: "847", icon: "🏠", typeValue: "residential" },
  { label: "Commercial", count: "312", icon: "🏢", typeValue: "commercial" },
  { label: "Land", count: "593", icon: "🗺️", typeValue: "land" },
  { label: "Joint Ventures", count: "183", icon: "🤝", typeValue: "joint_venture" },
];

const INITIAL_LISTINGS: Listing[] = [
  {
    id: 1,
    title: "Luxury Apartments in Abuja",
    location: "Maitama, Abuja",
    state: "Abuja",
    price: "₦450M",
    type: "Residential",
    typeValue: "residential",
    roi: "18%",
    status: "Verified",
    summary:
      "Premium residential apartment investment in Maitama with verified ownership documents and strong rental potential.",
  },
  {
    id: 2,
    title: "Commercial Plaza in Lagos",
    location: "Victoria Island, Lagos",
    state: "Lagos",
    price: "₦1.2B",
    type: "Commercial",
    typeValue: "commercial",
    roi: "22%",
    status: "Verified",
    summary:
      "High-value commercial plaza opportunity in Victoria Island for institutional investors and business operators.",
  },
  {
    id: 3,
    title: "Prime Development Land",
    location: "Lekki, Lagos",
    state: "Lagos",
    price: "₦800M",
    type: "Land",
    typeValue: "land",
    roi: "30%",
    status: "Verified",
    summary:
      "Strategic land investment in Lekki suitable for estate development, commercial projects, or long-term appreciation.",
  },
  {
    id: 4,
    title: "Residential JV Estate Land",
    location: "Ibeju-Lekki, Lagos",
    state: "Lagos",
    price: "JV Partnership",
    type: "Joint Venture",
    typeValue: "joint_venture",
    roi: "28%",
    status: "Verified",
    summary:
      "Landowner and developer partnership opportunity for a residential estate project with structured sharing formula.",
  },
];

const STATIC_JV_DEALS: Listing[] = [
  {
    id: 1001,
    title: "Luxury Mixed-use Development",
    location: "Wuse 2, Abuja",
    state: "Abuja",
    price: "₦3.5B",
    type: "Joint Venture",
    typeValue: "joint_venture",
    roi: "24%",
    status: "JV OPEN",
    summary:
      "Verified developer-backed mixed-use opportunity with clear equity structure, document review, and investor access process.",
  },
  {
    id: 1002,
    title: "Residential Estate Joint Venture",
    location: "Ibeju-Lekki, Lagos",
    state: "Lagos",
    price: "₦5.8B",
    type: "Joint Venture",
    typeValue: "joint_venture",
    roi: "28%",
    status: "JV OPEN",
    summary:
      "Large-scale estate development JV for landowners, developers, and investors with strong projected demand.",
  },
];

const WHY = [
  {
    title: "Verified opportunities only",
    body: "Every listing is reviewed. Owners, documents, and titles are validated before going live.",
  },
  {
    title: "Document-backed listings",
    body: "C of O, survey plans, and deeds are uploaded and reviewed to give investors full visibility.",
  },
  {
    title: "Direct stakeholder access",
    body: "Message verified owners, developers, and landowners directly without fake agents or middlemen.",
  },
];

function getTypeLabel(value: string) {
  if (value === "commercial") return "Commercial";
  if (value === "land") return "Land";
  if (value === "joint_venture") return "Joint Venture";
  return "Residential";
}

function getListingReference(id: number) {
  return `INM-${String(id).padStart(6, "0")}`;
}

function isJVListing(item: Listing) {
  return item.typeValue === "joint_venture" || item.type.toLowerCase().includes("joint");
}

function getWhatsappUrl(item: Listing) {
  const message = `Hello INAMAAD Real Estate, I want details about ${item.title} (${getListingReference(
    item.id
  )}) in ${item.location}.`;
  const rawPhone = (item.whatsapp || item.ownerPhone || WHATSAPP_NUMBER).replace(/[^0-9]/g, "");
  const phone = rawPhone.startsWith("0") ? `234${rawPhone.slice(1)}` : rawPhone || WHATSAPP_NUMBER;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function parseNairaValue(price: string) {
  const cleanPrice = price.toLowerCase().replace(/,/g, "");
  const numericValue = Number(cleanPrice.replace(/[^0-9.]/g, ""));

  if (!Number.isFinite(numericValue)) return 0;

  if (cleanPrice.includes("b")) return numericValue * 1_000_000_000;
  if (cleanPrice.includes("m")) return numericValue * 1_000_000;
  if (cleanPrice.includes("k")) return numericValue * 1_000;

  return numericValue;
}

function parseRoiValue(roi: string) {
  const numericValue = Number(roi.replace(/[^0-9.]/g, ""));

  return Number.isFinite(numericValue) ? numericValue : 0;
}

function SiteStyles() {
  return (
    <style>{`
      html {
        scroll-behavior: smooth;
      }

      body {
        overflow-x: hidden;
        background: #f6f7fb;
      }

      * {
        box-sizing: border-box;
      }

      .inamaad-card {
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
      }

      .inamaad-card:hover {
        box-shadow: 0 28px 70px rgba(15, 23, 42, 0.14);
      }

      .property-card {
        min-height: auto;
      }

      .property-card-summary {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      .mobile-bottom-nav {
        display: none;
      }

      @media (max-width: 768px) {
        input,
        select,
        textarea {
          font-size: 16px !important;
        }

        .hero-title {
          font-size: clamp(2.35rem, 11vw, 3.65rem) !important;
          line-height: 0.98 !important;
          letter-spacing: -0.055em !important;
        }

        .property-card {
          border-radius: 1.1rem !important;
        }

        .property-card-body {
          padding: 0.8rem !important;
        }

        .property-card h3 {
          font-size: 1rem !important;
          line-height: 1.15 !important;
        }

        .property-card p {
          font-size: 0.78rem !important;
        }

        .property-card-summary {
          -webkit-line-clamp: 2;
          line-height: 1.45 !important;
        }

        .property-card-stat {
          padding: 0.58rem !important;
          border-radius: 0.8rem !important;
        }

        .mobile-bottom-nav {
          position: fixed;
          left: 0.7rem;
          right: 0.7rem;
          bottom: calc(0.7rem + env(safe-area-inset-bottom));
          z-index: 80;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.45rem;
          border: 1px solid rgba(15, 23, 42, 0.1);
          border-radius: 1.35rem;
          background: rgba(255, 255, 255, 0.96);
          padding: 0.5rem;
          box-shadow: 0 22px 55px rgba(13, 28, 56, 0.24);
          backdrop-filter: blur(18px);
        }

        .mobile-bottom-nav button {
          min-height: 48px;
          border-radius: 1rem;
          background: #f8fafc;
          color: #0d1c38;
          font-size: 0.68rem;
          font-weight: 900;
          text-align: center;
          padding: 0.45rem;
        }

        .mobile-bottom-nav .primary {
          background: #0d1c38;
          color: white;
        }

        .mobile-bottom-nav .gold {
          background: #f0bf3c;
          color: #0d1c38;
        }
      }
    `}</style>
  );
}

function setOrCreateMetaTag(name: string, content: string, property = false) {
  const attributeName = property ? "property" : "name";
  let meta = document.head.querySelector<HTMLMetaElement>(
    `meta[${attributeName}="${name}"]`
  );

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attributeName, name);
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}

function setOrCreateLinkTag(rel: string, href: string) {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
}

function installInamaadSeoMetadata() {
  const siteTitle = "INAMAAD Real Estate | Verified Properties and JV Deals in Nigeria";
  const siteDescription =
    "Explore verified properties, joint venture opportunities, buyer concierge support, inspections, investor leads, and admin-ready real estate tools across Nigeria.";
  const siteUrl = window.location.origin + window.location.pathname;

  document.title = siteTitle;

  setOrCreateMetaTag("description", siteDescription);
  setOrCreateMetaTag("theme-color", "#0d1c38");
  setOrCreateMetaTag("apple-mobile-web-app-capable", "yes");
  setOrCreateMetaTag("apple-mobile-web-app-title", "INAMAAD");
  setOrCreateMetaTag("application-name", "INAMAAD Real Estate");

  setOrCreateMetaTag("og:title", siteTitle, true);
  setOrCreateMetaTag("og:description", siteDescription, true);
  setOrCreateMetaTag("og:type", "website", true);
  setOrCreateMetaTag("og:url", siteUrl, true);
  setOrCreateMetaTag("og:site_name", "INAMAAD Real Estate", true);

  setOrCreateMetaTag("twitter:card", "summary_large_image");
  setOrCreateMetaTag("twitter:title", siteTitle);
  setOrCreateMetaTag("twitter:description", siteDescription);

  setOrCreateLinkTag("canonical", siteUrl);

  const schemaId = "inamaad-real-estate-schema";
  let schema = document.getElementById(schemaId) as HTMLScriptElement | null;

  if (!schema) {
    schema = document.createElement("script");
    schema.id = schemaId;
    schema.type = "application/ld+json";
    document.head.appendChild(schema);
  }

  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "INAMAAD Real Estate",
    url: siteUrl,
    areaServed: "Nigeria",
    description: siteDescription,
    serviceType: [
      "Verified property marketplace",
      "Joint venture real estate deals",
      "Property inspection booking",
      "Investor lead management",
      "Buyer concierge support",
    ],
  });
}


function InamaadApp() {
  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const savedListings = localStorage.getItem("inamaad_listings");
      return savedListings ? JSON.parse(savedListings) : INITIAL_LISTINGS;
    } catch {
      return INITIAL_LISTINGS;
    }
  });

  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem("inamaad_auth_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const savedLeads = localStorage.getItem("inamaad_leads");
      return savedLeads ? JSON.parse(savedLeads) : [];
    } catch {
      return [];
    }
  });

  const [inspections, setInspections] = useState<Inspection[]>(() => {
    try {
      const savedInspections = localStorage.getItem("inamaad_inspections");
      return savedInspections ? JSON.parse(savedInspections) : [];
    } catch {
      return [];
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const savedLogs = localStorage.getItem("inamaad_activity_logs");
      return savedLogs ? JSON.parse(savedLogs) : [];
    } catch {
      return [];
    }
  });

  const [adminTasks, setAdminTasks] = useState<AdminTask[]>(() => {
    try {
      const savedTasks = localStorage.getItem("inamaad_admin_tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
      return [];
    }
  });

  const [keyword, setKeyword] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [type, setType] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortMode, setSortMode] = useState("newest");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [savedListingIds, setSavedListingIds] = useState<number[]>(() => {
    try {
      const savedIds = localStorage.getItem("inamaad_saved_listing_ids");
      return savedIds ? JSON.parse(savedIds) : [];
    } catch {
      return [];
    }
  });
  const [listingViews, setListingViews] = useState<Record<number, number>>(() => {
    try {
      const savedViews = localStorage.getItem("inamaad_listing_views");
      return savedViews ? JSON.parse(savedViews) : {};
    } catch {
      return {};
    }
  });
  const [recentListingIds, setRecentListingIds] = useState<number[]>(() => {
    try {
      const savedRecent = localStorage.getItem("inamaad_recent_listing_ids");
      return savedRecent ? JSON.parse(savedRecent) : [];
    } catch {
      return [];
    }
  });

  const [compareListingIds, setCompareListingIds] = useState<number[]>(() => {
    try {
      const savedCompare = localStorage.getItem("inamaad_compare_listing_ids");
      return savedCompare ? JSON.parse(savedCompare) : [];
    } catch {
      return [];
    }
  });

  const [adminListingSearch, setAdminListingSearch] = useState("");
  const [adminListingStatusFilter, setAdminListingStatusFilter] = useState("all");
  const [expandedListingId, setExpandedListingId] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminTaskForm, setAdminTaskForm] = useState({
    title: "",
    assignee: "Admin",
    dueDate: "",
    priority: "Medium" as AdminTask["priority"],
    note: "",
  });
  const [privacyNoticeAccepted, setPrivacyNoticeAccepted] = useState(() => {
    try {
      return localStorage.getItem("inamaad_privacy_notice_accepted") === "yes";
    } catch {
      return false;
    }
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Investor",
  });

  const [forgotEmail, setForgotEmail] = useState("");

  const [leadForm, setLeadForm] = useState({
    listingId: 0,
    listingTitle: "",
    name: "",
    email: "",
    phone: "",
    budget: "",
    message: "",
  });

  const [inspectionForm, setInspectionForm] = useState({
    listingId: 0,
    listingTitle: "",
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    note: "",
  });

  const [conciergeForm, setConciergeForm] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    location: "",
    propertyType: "",
    timeline: "",
    message: "",
  });

  const [newListing, setNewListing] = useState({
    title: "",
    location: "",
    state: "",
    price: "",
    typeValue: "residential",
    roi: "",
    summary: "",
    bedrooms: "",
    bathrooms: "",
    landSize: "",
    documentTitle: "",
    ownerName: "",
    ownerRole: "Owner",
    ownerPhone: "",
    whatsapp: "",
    ownerVerificationNote: "",
    imageUrl: "",
    galleryUrls: [] as string[],
    documentName: "",
    documentDataUrl: "",
    documentMimeType: "",
  });

  const [editingListingId, setEditingListingId] = useState<number | null>(null);
  const [editListingForm, setEditListingForm] = useState({
    title: "",
    location: "",
    state: "",
    price: "",
    typeValue: "residential",
    roi: "",
    status: "Pending review",
    summary: "",
    bedrooms: "",
    bathrooms: "",
    landSize: "",
    documentTitle: "",
    ownerName: "",
    ownerRole: "Owner",
    ownerPhone: "",
    whatsapp: "",
    ownerVerified: false,
    ownerVerificationNote: "",
  });

  useEffect(() => {
    installInamaadSeoMetadata();
  }, []);

  useEffect(() => {
    localStorage.setItem("inamaad_listings", JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem("inamaad_saved_listing_ids", JSON.stringify(savedListingIds));
  }, [savedListingIds]);

  useEffect(() => {
    localStorage.setItem("inamaad_listing_views", JSON.stringify(listingViews));
  }, [listingViews]);

  useEffect(() => {
    localStorage.setItem("inamaad_recent_listing_ids", JSON.stringify(recentListingIds));
  }, [recentListingIds]);

  useEffect(() => {
    localStorage.setItem("inamaad_compare_listing_ids", JSON.stringify(compareListingIds));
  }, [compareListingIds]);

  useEffect(() => {
    localStorage.setItem("inamaad_leads", JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem("inamaad_inspections", JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem("inamaad_activity_logs", JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem("inamaad_admin_tasks", JSON.stringify(adminTasks));
  }, [adminTasks]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem("inamaad_auth_user", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("inamaad_auth_user");
    }
  }, [authUser]);

  const propertyListings = useMemo(
    () => listings.filter((item) => !isJVListing(item)),
    [listings]
  );

  const jvListings = useMemo(() => {
    const postedJV = listings.filter((item) => isJVListing(item));
    const staticIds = new Set(postedJV.map((item) => item.id));
    return [...postedJV, ...STATIC_JV_DEALS.filter((item) => !staticIds.has(item.id))];
  }, [listings]);

  const savedListings = useMemo(
    () => listings.filter((item) => savedListingIds.includes(item.id)),
    [listings, savedListingIds]
  );

  const recentlyViewedListings = useMemo(
    () =>
      recentListingIds
        .map((id) => listings.find((item) => item.id === id))
        .filter((item): item is Listing => Boolean(item)),
    [listings, recentListingIds]
  );

  const compareListings = useMemo(
    () =>
      compareListingIds
        .map((id) => listings.find((item) => item.id === id))
        .filter((item): item is Listing => Boolean(item)),
    [compareListingIds, listings]
  );

  const featuredListings = useMemo(
    () => listings.filter((item) => item.featured),
    [listings]
  );

  const adminFilteredListings = useMemo(() => {
    const searchTerm = adminListingSearch.trim().toLowerCase();

    return listings.filter((item) => {
      const searchMatch =
        searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm) ||
        item.state.toLowerCase().includes(searchTerm) ||
        item.type.toLowerCase().includes(searchTerm) ||
        item.status.toLowerCase().includes(searchTerm) ||
        (item.ownerName || "").toLowerCase().includes(searchTerm);

      const statusMatch =
        adminListingStatusFilter === "all" ||
        item.status.toLowerCase() === adminListingStatusFilter.toLowerCase();

      return searchMatch && statusMatch;
    });
  }, [adminListingSearch, adminListingStatusFilter, listings]);

  const featuredProperty = featuredListings[0] || propertyListings[0] || listings[0] || null;

  const totalListingViews = Object.values(listingViews).reduce(
    (totalViews, currentViews) => totalViews + Number(currentViews || 0),
    0
  );

  const topViewedListings = useMemo(
    () =>
      [...listings]
        .map((item) => ({
          ...item,
          viewCount: Number(listingViews[item.id] || 0),
        }))
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 5),
    [listingViews, listings]
  );

  const averageListingViews =
    listings.length > 0 ? Math.round(totalListingViews / listings.length) : 0;

  const pendingListingsCount = listings.filter(
    (item) => item.status !== "Verified"
  ).length;
  const unverifiedOwnersCount = listings.filter((item) => !item.ownerVerified).length;
  const newLeadsCount = leads.filter((lead) => lead.status === "New").length;
  const newInspectionsCount = inspections.filter(
    (inspection) => inspection.status === "New"
  ).length;
  const todayDate = new Date().toISOString().slice(0, 10);
  const openAdminTasksCount = adminTasks.filter((task) => task.status !== "Done").length;
  const urgentAdminTasksCount = adminTasks.filter(
    (task) => task.status !== "Done" && task.priority === "Urgent"
  ).length;
  const dueAdminTasksCount = adminTasks.filter(
    (task) => task.status !== "Done" && Boolean(task.dueDate) && task.dueDate <= todayDate
  ).length;
  const adminActionQueueCount =
    pendingListingsCount +
    unverifiedOwnersCount +
    newLeadsCount +
    newInspectionsCount +
    openAdminTasksCount;

  const filteredProperties = useMemo(() => {
    const searchTerm = keyword.trim().toLowerCase();
    const stateTerm = selectedState.trim().toLowerCase();

    const nextProperties = propertyListings.filter((item) => {
      const keywordMatch =
        searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm) ||
        item.state.toLowerCase().includes(searchTerm) ||
        item.price.toLowerCase().includes(searchTerm) ||
        item.type.toLowerCase().includes(searchTerm) ||
        item.summary.toLowerCase().includes(searchTerm);

      const stateMatch =
        stateTerm === "" || item.state.toLowerCase().includes(stateTerm);

      const typeMatch = type === "" || item.typeValue === type;

      const statusMatch =
        statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase();

      return keywordMatch && stateMatch && typeMatch && statusMatch;
    });

    return [...nextProperties].sort((a, b) => {
      if (Boolean(a.featured) !== Boolean(b.featured)) {
        return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      }

      if (sortMode === "price_high") {
        return parseNairaValue(b.price) - parseNairaValue(a.price);
      }

      if (sortMode === "price_low") {
        return parseNairaValue(a.price) - parseNairaValue(b.price);
      }

      if (sortMode === "roi_high") {
        return parseRoiValue(b.roi) - parseRoiValue(a.roi);
      }

      if (sortMode === "title_az") {
        return a.title.localeCompare(b.title);
      }

      return b.id - a.id;
    });
  }, [keyword, propertyListings, selectedState, sortMode, statusFilter, type]);

  function showMessage(message: string) {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage(""), 4000);
  }

  function acceptPrivacyNotice() {
    try {
      localStorage.setItem("inamaad_privacy_notice_accepted", "yes");
    } catch {
      // Ignore storage errors and still hide the notice for this session.
    }

    setPrivacyNoticeAccepted(true);
    showMessage("Privacy and local data notice accepted.");
  }

  function addActivityLog(
    action: string,
    detail: string,
    category: ActivityLog["category"] = "System"
  ) {
    const logItem: ActivityLog = {
      id: Date.now() + Math.random(),
      action,
      detail,
      category,
      createdAt: new Date().toISOString(),
    };

    setActivityLogs((currentLogs) => [logItem, ...currentLogs].slice(0, 250));
  }

  function formatActivityDate(value: string) {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  }

  function clearActivityLogs() {
    const confirmed = window.confirm(
      "Clear the admin activity log from this browser?"
    );

    if (!confirmed) return;

    setActivityLogs([]);
    showMessage("Activity log cleared.");
  }

  function addAdminTask(e: React.FormEvent) {
    e.preventDefault();

    if (!adminTaskForm.title.trim()) {
      showMessage("Enter a task title first.");
      return;
    }

    const createdTask: AdminTask = {
      id: Date.now(),
      title: adminTaskForm.title.trim(),
      assignee: adminTaskForm.assignee.trim() || "Admin",
      dueDate: adminTaskForm.dueDate,
      priority: adminTaskForm.priority,
      status: "Open",
      note: adminTaskForm.note.trim(),
      createdAt: new Date().toISOString(),
    };

    setAdminTasks((currentTasks) => [createdTask, ...currentTasks]);

    addActivityLog(
      "Admin task created",
      `${createdTask.title} assigned to ${createdTask.assignee}.`,
      "Admin"
    );

    setAdminTaskForm({
      title: "",
      assignee: "Admin",
      dueDate: "",
      priority: "Medium",
      note: "",
    });

    showMessage("Admin task created.");
  }

  function updateAdminTaskStatus(id: number, status: AdminTask["status"]) {
    const task = adminTasks.find((item) => item.id === id);

    setAdminTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              completedAt: status === "Done" ? new Date().toISOString() : undefined,
            }
          : item
      )
    );

    addActivityLog(
      "Admin task updated",
      `${task?.title || "Task"} marked as ${status}.`,
      "Admin"
    );

    showMessage(`Task marked as ${status}.`);
  }

  function deleteAdminTask(id: number) {
    const task = adminTasks.find((item) => item.id === id);

    setAdminTasks((currentTasks) => currentTasks.filter((item) => item.id !== id));

    addActivityLog(
      "Admin task deleted",
      `${task?.title || "Task"} was removed from the operations planner.`,
      "Admin"
    );

    showMessage("Admin task deleted.");
  }

  function exportAdminTasksCsv() {
    const rows = [
      ["Title", "Assignee", "Due Date", "Priority", "Status", "Note", "Created At", "Completed At"],
      ...adminTasks.map((task) => [
        task.title,
        task.assignee,
        task.dueDate,
        task.priority,
        task.status,
        task.note,
        formatActivityDate(task.createdAt),
        task.completedAt ? formatActivityDate(task.completedAt) : "",
      ]),
    ];

    downloadTextFile(
      `inamaad-admin-tasks-${new Date().toISOString().slice(0, 10)}.csv`,
      createCsv(rows),
      "text/csv;charset=utf-8"
    );

    addActivityLog(
      "Admin tasks exported",
      "Admin exported the operations planner tasks as CSV.",
      "Admin"
    );
    showMessage("Admin tasks CSV exported.");
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setMobileOpen(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (type === "joint_venture") {
      scrollToSection("jv");
      return;
    }

    scrollToSection("properties");
  }

  function resetFilters() {
    setKeyword("");
    setSelectedState("");
    setType("");
    setStatusFilter("all");
    setSortMode("newest");
  }

  function handleCategoryClick(categoryType: string) {
    if (categoryType === "joint_venture") {
      setType("joint_venture");
      scrollToSection("jv");
      return;
    }

    setType(categoryType);
    window.setTimeout(() => scrollToSection("properties"), 50);
  }

  function recordListingView(item: Listing) {
    setListingViews((currentViews) => ({
      ...currentViews,
      [item.id]: Number(currentViews[item.id] || 0) + 1,
    }));

    setRecentListingIds((currentIds) => [
      item.id,
      ...currentIds.filter((currentId) => currentId !== item.id),
    ].slice(0, 6));
  }

  function openProperty(item: Listing) {
    recordListingView(item);
    setSelectedListing(item);
    setExpandedListingId(item.id);
  }

  function toggleInlineDetails(item: Listing) {
    const shouldOpen = expandedListingId !== item.id;

    if (shouldOpen) {
      recordListingView(item);
    }

    setExpandedListingId(shouldOpen ? item.id : null);
  }

  function toggleSavedListing(item: Listing) {
    setSavedListingIds((currentIds) => {
      if (currentIds.includes(item.id)) {
        showMessage("Property removed from saved list.");
        return currentIds.filter((savedId) => savedId !== item.id);
      }

      showMessage("Property saved successfully.");
      return [item.id, ...currentIds];
    });
  }

  function toggleCompareListing(item: Listing) {
    setCompareListingIds((currentIds) => {
      if (currentIds.includes(item.id)) {
        showMessage("Property removed from compare list.");
        return currentIds.filter((savedId) => savedId !== item.id);
      }

      if (currentIds.length >= 3) {
        showMessage("Compare list is full. Remove one property before adding another.");
        return currentIds;
      }

      showMessage("Property added to compare list.");
      return [...currentIds, item.id];
    });
  }

  function clearCompareList() {
    setCompareListingIds([]);
    showMessage("Compare list cleared.");
  }

  function buildPropertySummary(item: Listing) {
    return [
      "INAMAAD Real Estate Property Summary",
      `Reference: ${getListingReference(item.id)}`,
      `Title: ${item.title}`,
      `Type: ${item.type}`,
      `Location: ${item.location}`,
      `State: ${item.state}`,
      `Price / Value: ${item.price}`,
      `Projected ROI: ${item.roi}`,
      `Status: ${item.status}`,
      `Owner / Agent: ${item.ownerName || "INAMAAD contact"}`,
      `Owner role: ${item.ownerRole || "Owner / Agent"}`,
      `Owner verified: ${item.ownerVerified ? "Yes" : "Pending review"}`,
      `Bedrooms: ${item.bedrooms || "Not stated"}`,
      `Bathrooms: ${item.bathrooms || "Not stated"}`,
      `Land size: ${item.landSize || "Not stated"}`,
      `Document: ${item.documentTitle || "Under review"}`,
      "",
      item.summary,
    ].join("\n");
  }

  async function copyPropertySummary(item: Listing) {
    try {
      await navigator.clipboard.writeText(buildPropertySummary(item));
      showMessage("Property summary copied.");
    } catch {
      showMessage("Unable to copy summary on this browser.");
    }
  }

  function printPropertySummary(item: Listing) {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      showMessage("Popup blocked. Allow popups to print property summary.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${item.title}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #0d1c38; padding: 32px; line-height: 1.6; }
            h1 { margin-bottom: 4px; }
            .badge { display: inline-block; padding: 6px 10px; border-radius: 999px; background: #fff7df; color: #9b6b16; font-weight: 800; font-size: 12px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 20px 0; }
            .box { border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; }
            .label { color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; }
            .value { font-weight: 900; margin-top: 4px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <span class="badge">INAMAAD Property Summary</span>
          <h1>${item.title}</h1>
          <p>${item.summary}</p>
          <div class="grid">
            <div class="box"><div class="label">Reference</div><div class="value">${getListingReference(item.id)}</div></div>
            <div class="box"><div class="label">Location</div><div class="value">${item.location}</div></div>
            <div class="box"><div class="label">Price</div><div class="value">${item.price}</div></div>
            <div class="box"><div class="label">ROI</div><div class="value">${item.roi}</div></div>
            <div class="box"><div class="label">Owner / Agent</div><div class="value">${item.ownerName || "INAMAAD contact"}</div></div>
            <div class="box"><div class="label">Verification</div><div class="value">${item.ownerVerified ? "Verified" : "Pending review"}</div></div>
          </div>
          <button onclick="window.print()">Print</button>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
  }

  function handlePostListing(e: React.FormEvent) {
    e.preventDefault();

    const createdListing: Listing = {
      id: Date.now(),
      title: newListing.title.trim(),
      location: newListing.location.trim(),
      state: newListing.state.trim(),
      price: newListing.price.trim(),
      type: getTypeLabel(newListing.typeValue),
      typeValue: newListing.typeValue,
      roi: newListing.roi.trim() || "Pending",
      status: "Pending review",
      summary: newListing.summary.trim(),
      bedrooms: newListing.bedrooms.trim(),
      bathrooms: newListing.bathrooms.trim(),
      landSize: newListing.landSize.trim(),
      documentTitle: newListing.documentTitle.trim(),
      ownerName: newListing.ownerName.trim(),
      ownerRole: newListing.ownerRole,
      ownerPhone: newListing.ownerPhone.trim(),
      whatsapp: newListing.whatsapp.trim(),
      ownerVerified: false,
      ownerVerificationNote: newListing.ownerVerificationNote.trim(),
      imageUrl: newListing.imageUrl,
      galleryUrls: newListing.galleryUrls,
      documentName: newListing.documentName,
      documentDataUrl: newListing.documentDataUrl,
      documentMimeType: newListing.documentMimeType,
    };

    setListings([createdListing, ...listings]);
    addActivityLog(
      "Listing posted",
      `${createdListing.title} was submitted as Pending review.`,
      "Listing"
    );

    setNewListing({
      title: "",
      location: "",
      state: "",
      price: "",
      typeValue: "residential",
      roi: "",
      summary: "",
      bedrooms: "",
      bathrooms: "",
      landSize: "",
      documentTitle: "",
      ownerName: "",
      ownerRole: "Owner",
      ownerPhone: "",
      whatsapp: "",
      ownerVerificationNote: "",
      imageUrl: "",
      galleryUrls: [] as string[],
      documentName: "",
      documentDataUrl: "",
      documentMimeType: "",
    });

    setModal(null);
    showMessage("Your opportunity has been added as Pending review.");

    window.setTimeout(
      () => scrollToSection(createdListing.typeValue === "joint_venture" ? "jv" : "properties"),
      100
    );
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setAuthUser({
      name: loginForm.email.split("@")[0] || "INAMAAD User",
      email: loginForm.email,
    });

    setLoginForm({ email: "", password: "" });
    setModal(null);
    showMessage("You are signed in successfully.");
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setAuthUser({
      name: registerForm.name || "INAMAAD User",
      email: registerForm.email,
    });

    setRegisterForm({
      name: "",
      email: "",
      password: "",
      role: "Investor",
    });

    setModal(null);
    showMessage("Account created successfully. You are now logged in.");
  }

  function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setModal(null);
    showMessage(
      `Password reset request received for ${forgotEmail}. Connect Supabase SMTP to send real reset emails.`
    );
    setForgotEmail("");
  }


  function handleNewListingImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("Please upload a valid image file.");
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      showMessage("Image is too large. Use an image below 2.5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setNewListing((current) => ({
        ...current,
        imageUrl: typeof reader.result === "string" ? reader.result : "",
      }));
      showMessage("Property image preview added.");
    };

    reader.onerror = () => {
      showMessage("Image upload failed. Try another image.");
    };

    reader.readAsDataURL(file);
  }


  function handleNewListingGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const remainingSlots = Math.max(0, 4 - newListing.galleryUrls.length);
    const selectedFiles = files.slice(0, remainingSlots);

    if (!selectedFiles.length) {
      showMessage("Gallery limit reached. You can add up to 4 extra photos.");
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        showMessage("Only image files are allowed in the gallery.");
        return false;
      }

      if (file.size > 1.5 * 1024 * 1024) {
        showMessage("One gallery image is too large. Use images below 1.5MB.");
        return false;
      }

      return true;
    });

    if (!validFiles.length) return;

    Promise.all(
      validFiles.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
              if (typeof reader.result === "string") {
                resolve(reader.result);
              } else {
                reject(new Error("Invalid image result"));
              }
            };

            reader.onerror = () => reject(new Error("Gallery upload failed"));
            reader.readAsDataURL(file);
          })
      )
    )
      .then((imageUrls) => {
        setNewListing((current) => ({
          ...current,
          galleryUrls: [...current.galleryUrls, ...imageUrls].slice(0, 4),
        }));
        showMessage("Gallery photos added.");
      })
      .catch(() => {
        showMessage("Gallery upload failed. Try again with smaller images.");
      });
  }

  function removeGalleryImage(index: number) {
    setNewListing((current) => ({
      ...current,
      galleryUrls: current.galleryUrls.filter((_, imageIndex) => imageIndex !== index),
    }));
  }

  function handleDocumentUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      showMessage("Upload a PDF, JPG, PNG, or WEBP document only.");
      return;
    }

    if (file.size > 1.2 * 1024 * 1024) {
      showMessage("Document is too large. Use a file below 1.2MB for now.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setNewListing((current) => ({
        ...current,
        documentName: file.name,
        documentDataUrl: typeof reader.result === "string" ? reader.result : "",
        documentMimeType: file.type,
      }));
      showMessage("Document preview added.");
    };

    reader.onerror = () => {
      showMessage("Document upload failed. Try another file.");
    };

    reader.readAsDataURL(file);
  }

  function removeDocumentPreview() {
    setNewListing((current) => ({
      ...current,
      documentName: "",
      documentDataUrl: "",
      documentMimeType: "",
    }));
  }

  function signOut() {
    setAuthUser(null);
    showMessage("You are signed out.");
  }

  function unlockAdmin(e: React.FormEvent) {
    e.preventDefault();

    if (adminPassword === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      setAdminPassword("");
    } else {
      showMessage("Wrong admin password.");
    }
  }

  function approveListing(id: number) {
    const listing = listings.find((item) => item.id === id);

    setListings(
      listings.map((item) =>
        item.id === id ? { ...item, status: "Verified" } : item
      )
    );

    addActivityLog(
      "Listing approved",
      `${listing?.title || "Listing"} was approved by admin.`,
      "Listing"
    );
    showMessage("Listing approved successfully.");
  }

  function deleteListing(id: number) {
    const listing = listings.find((item) => item.id === id);

    setListings(listings.filter((item) => item.id !== id));
    addActivityLog(
      "Listing deleted",
      `${listing?.title || "Listing"} was deleted by admin.`,
      "Listing"
    );
    showMessage("Listing deleted successfully.");
  }

  function startEditingListing(item: Listing) {
    setEditingListingId(item.id);
    setEditListingForm({
      title: item.title,
      location: item.location,
      state: item.state,
      price: item.price,
      typeValue: item.typeValue,
      roi: item.roi,
      status: item.status,
      summary: item.summary,
      bedrooms: item.bedrooms || "",
      bathrooms: item.bathrooms || "",
      landSize: item.landSize || "",
      documentTitle: item.documentTitle || "",
      ownerName: item.ownerName || "",
      ownerRole: item.ownerRole || "Owner",
      ownerPhone: item.ownerPhone || "",
      whatsapp: item.whatsapp || "",
      ownerVerified: Boolean(item.ownerVerified),
      ownerVerificationNote: item.ownerVerificationNote || "",
    });
  }

  function cancelEditingListing() {
    setEditingListingId(null);
    setEditListingForm({
      title: "",
      location: "",
      state: "",
      price: "",
      typeValue: "residential",
      roi: "",
      status: "Pending review",
      summary: "",
      bedrooms: "",
      bathrooms: "",
      landSize: "",
      documentTitle: "",
      ownerName: "",
      ownerRole: "Owner",
      ownerPhone: "",
      whatsapp: "",
      ownerVerified: false,
      ownerVerificationNote: "",
    });
  }

  function handleEditListingSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!editingListingId) return;

    const listingBeingEdited = listings.find((item) => item.id === editingListingId);

    setListings((currentListings) =>
      currentListings.map((item) =>
        item.id === editingListingId
          ? {
              ...item,
              title: editListingForm.title.trim(),
              location: editListingForm.location.trim(),
              state: editListingForm.state.trim(),
              price: editListingForm.price.trim(),
              type: getTypeLabel(editListingForm.typeValue),
              typeValue: editListingForm.typeValue,
              roi: editListingForm.roi.trim() || "Pending",
              status: editListingForm.status,
              summary: editListingForm.summary.trim(),
              bedrooms: editListingForm.bedrooms.trim(),
              bathrooms: editListingForm.bathrooms.trim(),
              landSize: editListingForm.landSize.trim(),
              documentTitle: editListingForm.documentTitle.trim(),
              ownerName: editListingForm.ownerName.trim(),
              ownerRole: editListingForm.ownerRole,
              ownerPhone: editListingForm.ownerPhone.trim(),
              whatsapp: editListingForm.whatsapp.trim(),
              ownerVerified: editListingForm.ownerVerified,
              ownerVerificationNote: editListingForm.ownerVerificationNote.trim(),
            }
          : item
      )
    );

    addActivityLog(
      "Listing edited",
      `${editListingForm.title.trim() || listingBeingEdited?.title || "Listing"} was updated by admin.`,
      "Listing"
    );
    cancelEditingListing();
    showMessage("Listing updated successfully.");
  }

  function duplicateListing(item: Listing) {
    const duplicatedListing: Listing = {
      ...item,
      id: Date.now(),
      title: `${item.title} Copy`,
      status: "Pending review",
    };

    setListings((currentListings) => [duplicatedListing, ...currentListings]);
    addActivityLog(
      "Listing duplicated",
      `${item.title} was duplicated as ${duplicatedListing.title}.`,
      "Listing"
    );
    showMessage("Listing duplicated as Pending review.");
  }

  function verifyListingOwner(id: number) {
    setListings((currentListings) =>
      currentListings.map((item) =>
        item.id === id
          ? {
              ...item,
              ownerVerified: true,
              ownerVerificationNote:
                item.ownerVerificationNote || "Owner / agent checked by INAMAAD admin.",
            }
          : item
      )
    );

    const listing = listings.find((item) => item.id === id);
    addActivityLog(
      "Owner verified",
      `${listing?.ownerName || listing?.title || "Owner / agent"} was verified by admin.`,
      "Listing"
    );
    showMessage("Owner / agent verified.");
  }

  function unverifyListingOwner(id: number) {
    setListings((currentListings) =>
      currentListings.map((item) =>
        item.id === id
          ? {
              ...item,
              ownerVerified: false,
              ownerVerificationNote:
                item.ownerVerificationNote || "Verification pending admin review.",
            }
          : item
      )
    );

    const listing = listings.find((item) => item.id === id);
    addActivityLog(
      "Owner unverified",
      `${listing?.ownerName || listing?.title || "Owner / agent"} verification was removed.`,
      "Listing"
    );
    showMessage("Owner / agent verification removed.");
  }


  function toggleFeaturedListing(id: number) {
    setListings((currentListings) =>
      currentListings.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item
      )
    );

    const listing = listings.find((item) => item.id === id);
    addActivityLog(
      "Featured listing updated",
      `${listing?.title || "Listing"} featured status was changed.`,
      "Listing"
    );
    showMessage("Featured listing status updated.");
  }

  function shareMarketplace() {
    const shareText =
      "Explore verified properties and JV deals on INAMAAD Real Estate.";
    const shareUrl = window.location.origin + window.location.pathname;

    if (navigator.share) {
      navigator.share({
        title: "INAMAAD Real Estate",
        text: shareText,
        url: shareUrl,
      });
      return;
    }

    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    showMessage("Marketplace link copied.");
  }

  function shareListing(item: Listing) {
    const shareText = `INAMAAD Real Estate: ${item.title} - ${item.price} in ${item.location}`;
    const shareUrl = `${window.location.origin}${window.location.pathname}#property-${item.id}`;

    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: shareText,
        url: shareUrl,
      });
      return;
    }

    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    showMessage("Property link copied.");
  }


  function openLeadForm(item?: Listing) {
    setLeadForm({
      listingId: item?.id || 0,
      listingTitle: item?.title || "",
      name: authUser?.name || "",
      email: authUser?.email || "",
      phone: "",
      budget: "",
      message: item
        ? `I am interested in ${item.title} (${getListingReference(item.id)}) in ${item.location}.`
        : "",
    });

    setSelectedListing(null);
    setModal("investor");
  }

  function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();

    const createdLead: Lead = {
      id: Date.now(),
      listingId: leadForm.listingId || undefined,
      listingTitle: leadForm.listingTitle || undefined,
      name: leadForm.name.trim(),
      email: leadForm.email.trim(),
      phone: leadForm.phone.trim(),
      budget: leadForm.budget.trim(),
      message: leadForm.message.trim(),
      createdAt: new Date().toISOString(),
      status: "New",
    };

    setLeads((currentLeads) => [createdLead, ...currentLeads]);
    addActivityLog(
      "Investor lead submitted",
      `${createdLead.name} submitted an enquiry${createdLead.listingTitle ? ` for ${createdLead.listingTitle}` : ""}.`,
      "Lead"
    );

    setLeadForm({
      listingId: 0,
      listingTitle: "",
      name: authUser?.name || "",
      email: authUser?.email || "",
      phone: "",
      budget: "",
      message: "",
    });

    setModal(null);
    showMessage("Investor enquiry saved. INAMAAD can follow up from the admin dashboard.");
  }

  function updateLeadStatus(id: number, status: Lead["status"]) {
    const lead = leads.find((item) => item.id === id);

    setLeads((currentLeads) =>
      currentLeads.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    );
    addActivityLog(
      "Lead status updated",
      `${lead?.name || "Lead"} was marked as ${status}.`,
      "Lead"
    );
    showMessage(`Lead marked as ${status}.`);
  }

  function deleteLead(id: number) {
    const lead = leads.find((item) => item.id === id);

    setLeads((currentLeads) => currentLeads.filter((lead) => lead.id !== id));
    addActivityLog(
      "Lead deleted",
      `${lead?.name || "Lead"} was deleted from admin.`,
      "Lead"
    );
    showMessage("Lead deleted.");
  }


  function openInspectionForm(item?: Listing) {
    setInspectionForm({
      listingId: item?.id || 0,
      listingTitle: item?.title || "",
      name: authUser?.name || "",
      email: authUser?.email || "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      note: item
        ? `I want to inspect ${item.title} (${getListingReference(item.id)}) in ${item.location}.`
        : "",
    });

    setSelectedListing(null);
    setModal("inspection");
  }

  function handleInspectionSubmit(e: React.FormEvent) {
    e.preventDefault();

    const createdInspection: Inspection = {
      id: Date.now(),
      listingId: inspectionForm.listingId || undefined,
      listingTitle: inspectionForm.listingTitle || undefined,
      name: inspectionForm.name.trim(),
      email: inspectionForm.email.trim(),
      phone: inspectionForm.phone.trim(),
      preferredDate: inspectionForm.preferredDate,
      preferredTime: inspectionForm.preferredTime,
      note: inspectionForm.note.trim(),
      createdAt: new Date().toISOString(),
      status: "New",
    };

    setInspections((currentInspections) => [createdInspection, ...currentInspections]);
    addActivityLog(
      "Inspection booked",
      `${createdInspection.name} requested inspection${createdInspection.listingTitle ? ` for ${createdInspection.listingTitle}` : ""}.`,
      "Inspection"
    );

    setInspectionForm({
      listingId: 0,
      listingTitle: "",
      name: authUser?.name || "",
      email: authUser?.email || "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      note: "",
    });

    setModal(null);
    showMessage("Inspection request saved. Admin can confirm it from the dashboard.");
  }

  function updateInspectionStatus(id: number, status: Inspection["status"]) {
    const inspectionRecord = inspections.find((item) => item.id === id);

    setInspections((currentInspections) =>
      currentInspections.map((inspection) =>
        inspection.id === id ? { ...inspection, status } : inspection
      )
    );
    addActivityLog(
      "Inspection status updated",
      `${inspectionRecord?.name || "Inspection"} was marked as ${status}.`,
      "Inspection"
    );
    showMessage(`Inspection marked as ${status}.`);
  }

  function deleteInspection(id: number) {
    const inspectionRecord = inspections.find((item) => item.id === id);

    setInspections((currentInspections) =>
      currentInspections.filter((inspection) => inspection.id !== id)
    );
    addActivityLog(
      "Inspection deleted",
      `${inspectionRecord?.name || "Inspection request"} was deleted from admin.`,
      "Inspection"
    );
    showMessage("Inspection request deleted.");
  }


  function downloadTextFile(filename: string, content: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function escapeCsvValue(value: unknown) {
    const textValue = String(value ?? "");

    if (/[",\n\r]/.test(textValue)) {
      return `"${textValue.replace(/"/g, '""')}"`;
    }

    return textValue;
  }

  function createCsv(rows: unknown[][]) {
    return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");
  }

  function exportActivityLogsCsv() {
    const rows = [
      ["Date", "Category", "Action", "Detail"],
      ...activityLogs.map((log) => [
        formatActivityDate(log.createdAt),
        log.category,
        log.action,
        log.detail,
      ]),
    ];

    downloadTextFile(
      `inamaad-activity-log-${new Date().toISOString().slice(0, 10)}.csv`,
      createCsv(rows),
      "text/csv;charset=utf-8"
    );

    showMessage("Activity log CSV exported.");
  }

  function exportListingsCsv() {
    const rows = [
      [
        "Reference",
        "Title",
        "Type",
        "Location",
        "State",
        "Price",
        "ROI",
        "Status",
        "Bedrooms",
        "Bathrooms",
        "Land Size",
        "Document",
        "Owner / Agent",
        "Owner Role",
        "Owner Verified",
        "Featured",
        "Owner Verification Note",
        "Owner Phone",
        "WhatsApp",
        "Summary",
      ],
      ...listings.map((item) => [
        getListingReference(item.id),
        item.title,
        item.type,
        item.location,
        item.state,
        item.price,
        item.roi,
        item.status,
        item.bedrooms || "",
        item.bathrooms || "",
        item.landSize || "",
        item.documentTitle || "",
        item.ownerName || "",
        item.ownerRole || "",
        item.ownerVerified ? "Yes" : "No",
        item.featured ? "Yes" : "No",
        item.ownerVerificationNote || "",
        item.ownerPhone || "",
        item.whatsapp || "",
        item.summary,
      ]),
    ];

    downloadTextFile("inamaad-listings.csv", createCsv(rows), "text/csv;charset=utf-8");
    showMessage("Listings CSV exported.");
  }

  function exportLeadsCsv() {
    const rows = [
      [
        "ID",
        "Listing",
        "Name",
        "Email",
        "Phone",
        "Budget",
        "Status",
        "Message",
        "Created At",
      ],
      ...leads.map((lead) => [
        lead.id,
        lead.listingTitle || "",
        lead.name,
        lead.email,
        lead.phone,
        lead.budget,
        lead.status,
        lead.message,
        lead.createdAt,
      ]),
    ];

    downloadTextFile("inamaad-leads.csv", createCsv(rows), "text/csv;charset=utf-8");
    showMessage("Leads CSV exported.");
  }

  function exportInspectionsCsv() {
    const rows = [
      [
        "ID",
        "Listing",
        "Name",
        "Email",
        "Phone",
        "Preferred Date",
        "Preferred Time",
        "Status",
        "Note",
        "Created At",
      ],
      ...inspections.map((inspection) => [
        inspection.id,
        inspection.listingTitle || "",
        inspection.name,
        inspection.email,
        inspection.phone,
        inspection.preferredDate,
        inspection.preferredTime,
        inspection.status,
        inspection.note,
        inspection.createdAt,
      ]),
    ];

    downloadTextFile(
      "inamaad-inspections.csv",
      createCsv(rows),
      "text/csv;charset=utf-8"
    );
    showMessage("Inspections CSV exported.");
  }

  function exportFullBackupJson() {
    const backup = {
      app: "INAMAAD Real Estate",
      version: "local-backup-v1",
      exportedAt: new Date().toISOString(),
      listings,
      leads,
      inspections,
      activityLogs,
      adminTasks,
      savedListingIds,
      listingViews,
      recentListingIds,
      compareListingIds,
    };

    downloadTextFile(
      `inamaad-full-backup-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(backup, null, 2),
      "application/json;charset=utf-8"
    );

    addActivityLog(
      "Full backup exported",
      "Admin exported a full JSON backup.",
      "Backup"
    );
    showMessage("Full INAMAAD backup exported.");
  }

  function handleRestoreBackup(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsedBackup = JSON.parse(String(reader.result || "{}"));

        if (!parsedBackup || parsedBackup.app !== "INAMAAD Real Estate") {
          showMessage("Invalid backup file.");
          return;
        }

        if (Array.isArray(parsedBackup.listings)) {
          setListings(parsedBackup.listings);
        }

        if (Array.isArray(parsedBackup.leads)) {
          setLeads(parsedBackup.leads);
        }

        if (Array.isArray(parsedBackup.inspections)) {
          setInspections(parsedBackup.inspections);
        }

        if (Array.isArray(parsedBackup.savedListingIds)) {
          setSavedListingIds(parsedBackup.savedListingIds);
        }

        if (parsedBackup.listingViews && typeof parsedBackup.listingViews === "object") {
          setListingViews(parsedBackup.listingViews);
        }

        if (Array.isArray(parsedBackup.recentListingIds)) {
          setRecentListingIds(parsedBackup.recentListingIds);
        }

        if (Array.isArray(parsedBackup.compareListingIds)) {
          setCompareListingIds(parsedBackup.compareListingIds);
        }

        if (Array.isArray(parsedBackup.activityLogs)) {
          setActivityLogs(parsedBackup.activityLogs);
        }

        if (Array.isArray(parsedBackup.adminTasks)) {
          setAdminTasks(parsedBackup.adminTasks);
        }

        addActivityLog(
          "Backup restored",
          "Admin restored an INAMAAD JSON backup.",
          "Backup"
        );
        showMessage("Backup restored successfully.");
      } catch {
        showMessage("Backup restore failed. Upload a valid INAMAAD JSON backup.");
      } finally {
        e.target.value = "";
      }
    };

    reader.onerror = () => {
      showMessage("Backup file could not be read.");
      e.target.value = "";
    };

    reader.readAsText(file);
  }

  function clearDemoDataConfirm() {
    const confirmed = window.confirm(
      "This will remove all local listings, leads, inspections, and saved properties from this browser. Export a backup first. Continue?"
    );

    if (!confirmed) return;

    setListings(INITIAL_LISTINGS);
    setLeads([]);
    setInspections([]);
    setSavedListingIds([]);
    setListingViews({});
    setRecentListingIds([]);
    setCompareListingIds([]);
    setExpandedListingId(null);
    setSelectedListing(null);
    setAdminTasks([]);
    setActivityLogs([
      {
        id: Date.now(),
        action: "Local data reset",
        detail: "Admin reset local demo data to starter listings.",
        category: "Admin",
        createdAt: new Date().toISOString(),
      },
    ]);
    showMessage("Local data reset to starter listings.");
  }


  function approveAllPendingListings() {
    const pendingListings = listings.filter((item) => item.status !== "Verified");

    if (!pendingListings.length) {
      showMessage("No pending listings to approve.");
      return;
    }

    setListings((currentListings) =>
      currentListings.map((item) =>
        item.status === "Verified" ? item : { ...item, status: "Verified" }
      )
    );

    addActivityLog(
      "Bulk listings approved",
      `${pendingListings.length} pending listing${pendingListings.length === 1 ? "" : "s"} approved from follow-up center.`,
      "Admin"
    );
    showMessage(`${pendingListings.length} pending listing${pendingListings.length === 1 ? "" : "s"} approved.`);
  }

  function verifyAllUnverifiedOwners() {
    const unverifiedListings = listings.filter((item) => !item.ownerVerified);

    if (!unverifiedListings.length) {
      showMessage("All owners / agents are already verified.");
      return;
    }

    setListings((currentListings) =>
      currentListings.map((item) =>
        item.ownerVerified
          ? item
          : {
              ...item,
              ownerVerified: true,
              ownerVerificationNote:
                item.ownerVerificationNote || "Owner / agent checked by INAMAAD admin.",
            }
      )
    );

    addActivityLog(
      "Bulk owners verified",
      `${unverifiedListings.length} owner / agent profile${unverifiedListings.length === 1 ? "" : "s"} verified from follow-up center.`,
      "Admin"
    );
    showMessage(`${unverifiedListings.length} owner / agent profile${unverifiedListings.length === 1 ? "" : "s"} verified.`);
  }

  function markAllNewLeadsContacted() {
    const newLeads = leads.filter((lead) => lead.status === "New");

    if (!newLeads.length) {
      showMessage("No new leads to mark as contacted.");
      return;
    }

    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.status === "New" ? { ...lead, status: "Contacted" } : lead
      )
    );

    addActivityLog(
      "Bulk leads contacted",
      `${newLeads.length} new lead${newLeads.length === 1 ? "" : "s"} marked as contacted.`,
      "Admin"
    );
    showMessage(`${newLeads.length} new lead${newLeads.length === 1 ? "" : "s"} marked as contacted.`);
  }

  function confirmAllNewInspections() {
    const newInspections = inspections.filter(
      (inspection) => inspection.status === "New"
    );

    if (!newInspections.length) {
      showMessage("No new inspections to confirm.");
      return;
    }

    setInspections((currentInspections) =>
      currentInspections.map((inspection) =>
        inspection.status === "New"
          ? { ...inspection, status: "Confirmed" }
          : inspection
      )
    );

    addActivityLog(
      "Bulk inspections confirmed",
      `${newInspections.length} inspection request${newInspections.length === 1 ? "" : "s"} confirmed from follow-up center.`,
      "Admin"
    );
    showMessage(`${newInspections.length} inspection request${newInspections.length === 1 ? "" : "s"} confirmed.`);
  }

  function featureTopViewedFromFollowUp() {
    const topIds = topViewedListings
      .filter((item) => Number(item.viewCount || 0) > 0)
      .slice(0, 3)
      .map((item) => item.id);

    if (!topIds.length) {
      showMessage("Open property details first so top-viewed listings can be detected.");
      return;
    }

    setListings((currentListings) =>
      currentListings.map((item) =>
        topIds.includes(item.id) ? { ...item, featured: true } : item
      )
    );

    addActivityLog(
      "Top viewed listings featured",
      `${topIds.length} top-viewed listing${topIds.length === 1 ? "" : "s"} marked as featured.`,
      "Admin"
    );
    showMessage("Top viewed listings marked as featured.");
  }


  function handleConciergeSubmit(e: React.FormEvent) {
    e.preventDefault();

    const createdLead: Lead = {
      id: Date.now(),
      name: conciergeForm.name.trim(),
      email: conciergeForm.email.trim(),
      phone: conciergeForm.phone.trim(),
      budget: conciergeForm.budget.trim(),
      message: [
        `Preferred location: ${conciergeForm.location || "Not specified"}`,
        `Property type: ${conciergeForm.propertyType || "Not specified"}`,
        `Timeline: ${conciergeForm.timeline || "Not specified"}`,
        `Message: ${conciergeForm.message || "No extra message"}`,
      ].join("\n"),
      createdAt: new Date().toISOString(),
      status: "New",
    };

    setLeads((currentLeads) => [createdLead, ...currentLeads]);
    addActivityLog(
      "Buyer brief submitted",
      `${createdLead.name} submitted a buyer concierge brief.`,
      "Lead"
    );

    setConciergeForm({
      name: "",
      email: "",
      phone: "",
      budget: "",
      location: "",
      propertyType: "",
      timeline: "",
      message: "",
    });

    showMessage("Buyer brief submitted. INAMAAD can follow up from the admin dashboard.");
  }

  function renderPropertyCard(item: Listing, variant: "property" | "jv" = "property") {
    const isExpanded = expandedListingId === item.id;
    const isJV = variant === "jv" || isJVListing(item);
    const isSaved = savedListingIds.includes(item.id);
    const isCompared = compareListingIds.includes(item.id);

    return (
      <article
        id={`property-${item.id}`}
        key={`${variant}-${item.id}`}
        className="property-card inamaad-card overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1"
      >
        <div className={`h-36 ${isJV ? "bg-gradient-to-br from-[#0d1c38] via-[#1d3258] to-[#f0bf3c]" : "bg-gradient-to-br from-[#0d1c38] via-[#1c3158] to-[#52627a]"} relative overflow-hidden`}>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c38]/92 via-[#0d1c38]/35 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(240,191,60,0.22),transparent_30%)]" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0d1c38]">
                  {item.status}
                </span>

                {item.ownerVerified ? (
                  <span className="rounded-full bg-emerald-400 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0d1c38]">
                    Verified owner
                  </span>
                ) : (
                  <span className="rounded-full bg-white/75 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700">
                    Owner review
                  </span>
                )}

                {item.featured ? (
                  <span className="rounded-full bg-[#f0bf3c] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0d1c38]">
                    Featured
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-xl font-black text-white">{item.price}</p>
            </div>
            <span className="rounded-full bg-[#f0bf3c] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0d1c38]">
              {item.type}
            </span>
          </div>
        </div>

        <div className="property-card-body p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-black leading-tight text-[#0d1c38]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {item.location}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleSavedListing(item)}
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-black transition ${
                isSaved
                  ? "bg-[#f0bf3c] text-[#0d1c38]"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
              aria-label={isSaved ? "Remove saved property" : "Save property"}
            >
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>

          <p className="property-card-summary text-sm leading-6 text-slate-600">
            {item.summary}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="property-card-stat rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                Ref
              </p>
              <p className="mt-1 text-xs font-black text-[#0d1c38]">
                {getListingReference(item.id)}
              </p>
            </div>

            <div className="property-card-stat rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                ROI
              </p>
              <p className="mt-1 text-xs font-black text-[#0d1c38]">{item.roi}</p>
            </div>

            <div className="property-card-stat rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                State
              </p>
              <p className="mt-1 text-xs font-black text-[#0d1c38]">{item.state}</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-[#f8fafc] p-2">
            {["Verified", "Direct enquiry", isJV ? "JV review" : "Docs review"].map((label) => (
              <div key={label} className="rounded-xl bg-white px-2 py-2 text-center">
                <p className="text-[10px] font-black text-[#0d1c38]">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                  Owner / Agent
                </p>
                <p className="mt-1 text-sm font-black text-[#0d1c38]">
                  {item.ownerName || "INAMAAD verified contact"}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {item.ownerRole || "Owner / Agent"}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${
                  item.ownerVerified
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {item.ownerVerified ? "Verified" : "Pending"}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => openProperty(item)}
              className="rounded-xl bg-[#0d1c38] px-4 py-3 text-sm font-black text-white transition hover:bg-[#162b52]"
            >
              View details
            </button>

            <button
              type="button"
              onClick={() => shareListing(item)}
              className="rounded-xl border border-[#0d1c38] bg-white px-4 py-3 text-sm font-black text-[#0d1c38] transition hover:bg-slate-50"
            >
              Share
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => toggleCompareListing(item)}
              className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                isCompared
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {isCompared ? "Compared" : "Compare"}
            </button>

            <button
              type="button"
              onClick={() => copyPropertySummary(item)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Copy summary
            </button>
          </div>

          <button
            type="button"
            onClick={() => toggleInlineDetails(item)}
            className="mt-2 w-full rounded-xl bg-[#fff7df] px-4 py-3 text-sm font-black text-[#9b6b16] transition hover:bg-[#f7e8bd]"
          >
            {isExpanded ? "Hide property details" : "Open property details inside card"}
          </button>

          {isExpanded && (
            <div className="mt-3 rounded-2xl border border-[#f0bf3c]/40 bg-[#fffaf0] p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    Listing type
                  </p>
                  <p className="mt-1 text-sm font-black text-[#0d1c38]">{item.type}</p>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-black text-[#0d1c38]">
                    {item.status}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    Price / Value
                  </p>
                  <p className="mt-1 text-sm font-black text-[#0d1c38]">{item.price}</p>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    Projected ROI
                  </p>
                  <p className="mt-1 text-sm font-black text-[#0d1c38]">{item.roi}</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  ["Bedrooms", item.bedrooms || "Not stated"],
                  ["Bathrooms", item.bathrooms || "Not stated"],
                  ["Land size", item.landSize || "Not stated"],
                  ["Document", item.documentTitle || "Under review"],
                  ["Owner", item.ownerName || "INAMAAD contact"],
                  ["Owner role", item.ownerRole || "Owner / Agent"],
                  ["Verification", item.ownerVerified ? "Verified owner" : "Pending review"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-white p-3">
                    <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-black text-[#0d1c38]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {item.galleryUrls && item.galleryUrls.length > 0 ? (
                <div className="mt-3">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-slate-400">
                    Gallery
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {item.galleryUrls.slice(0, 4).map((imageUrl, imageIndex) => (
                      <img
                        key={`${item.id}-gallery-${imageIndex}`}
                        src={imageUrl}
                        alt={`${item.title} gallery ${imageIndex + 1}`}
                        className="h-16 w-full rounded-xl object-cover"
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {item.documentName ? (
                <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700">
                    Document preview
                  </p>
                  <p className="mt-1 text-sm font-black text-[#0d1c38]">
                    {item.documentName}
                  </p>
                </div>
              ) : null}

              <p className="mt-3 text-sm leading-6 text-slate-700">
                {item.summary}
              </p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <a
                  href={getWhatsappUrl(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-green-500 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-green-600"
                >
                  WhatsApp enquiry
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedListing(item)}
                  className="rounded-xl bg-[#0d1c38] px-4 py-3 text-sm font-black text-white transition hover:bg-[#162b52]"
                >
                  Open full modal
                </button>

                <button
                  type="button"
                  onClick={() => openLeadForm(item)}
                  className="rounded-xl bg-[#f0bf3c] px-4 py-3 text-sm font-black text-[#0d1c38] transition hover:bg-[#f7ce62]"
                >
                  Request investment call
                </button>

                <button
                  type="button"
                  onClick={() => openInspectionForm(item)}
                  className="rounded-xl border border-[#f0bf3c] bg-white px-4 py-3 text-sm font-black text-[#9b6b16] transition hover:bg-[#fff7df]"
                >
                  Book inspection
                </button>
              </div>
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] pb-24 text-slate-950 md:pb-0">
      <SiteStyles />

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0d1c38]/94 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-10">
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0bf3c] text-xl font-black text-[#0d1c38] shadow-lg">
              I
            </div>

            <div className="text-left">
              <div className="font-black tracking-[0.18em] text-white">INAMAAD</div>
              <div className="text-xs font-semibold text-white/45">
                Real Estate Enterprise
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-7 text-sm md:flex">
            {[
              ["Home", "home"],
              ["Properties", "properties"],
              ["JV Deals", "jv"],
              ["Investors", "why"],
              ["Compliance", "compliance"],
              ["About", "about"],
            ].map(([label, id]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className="font-semibold text-white/70 transition-colors hover:text-[#f0bf3c]"
              >
                {label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setAdminUnlocked(false);
                setAdminPassword("");
                setModal("admin");
              }}
              className="font-semibold text-white/70 transition-colors hover:text-[#f0bf3c]"
            >
              Admin
            </button>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {authUser ? (
              <>
                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2">
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-200">
                    Logged in
                  </p>
                  <p className="max-w-[180px] truncate text-xs font-semibold text-white">
                    {authUser.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={signOut}
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white/80 hover:bg-white/10"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <div className="rounded-full border border-red-400/25 bg-red-400/10 px-4 py-2">
                  <p className="text-xs font-black uppercase tracking-wide text-red-100">
                    Not logged in
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setModal("login")}
                  className="text-sm font-bold text-white/75 hover:text-white"
                >
                  Sign in
                </button>

                <button
                  type="button"
                  onClick={() => setModal("register")}
                  className="rounded-xl bg-[#f0bf3c] px-5 py-2.5 text-sm font-black text-[#0d1c38] transition-colors hover:bg-[#f7ce62]"
                >
                  Get started
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl bg-white/10 px-4 py-2 text-2xl leading-none text-white md:hidden"
          >
            ☰
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#0d1c38] px-4 py-5 md:hidden">
            <div className="grid gap-2 text-sm">
              {[
                ["Home", "home"],
                ["Properties", "properties"],
                ["JV Deals", "jv"],
                ["Investors", "why"],
                ["About", "about"],
              ].map(([label, id]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="rounded-xl bg-white/5 px-4 py-3 text-left font-bold text-white/80"
                >
                  {label}
                </button>
              ))}

              <div className="mt-2 rounded-xl bg-white/5 p-3">
                <p className="text-xs font-black uppercase tracking-wide text-white/40">
                  Account status
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  {authUser ? `Logged in: ${authUser.email}` : "Not logged in"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModal(authUser ? "admin" : "register")}
                className="mt-2 rounded-xl bg-[#f0bf3c] px-5 py-3 text-sm font-black text-[#0d1c38]"
              >
                {authUser ? "Open admin" : "Get started"}
              </button>
            </div>
          </div>
        )}
      </header>

      {successMessage && (
        <div className="fixed right-4 top-24 z-[90] max-w-sm rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-2xl">
          <p className="text-sm font-black text-[#0d1c38]">{successMessage}</p>
        </div>
      )}

      <section
        id="home"
        className="relative overflow-hidden bg-[#0d1c38] px-4 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-36"
      >
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute right-[-6rem] top-16 h-80 w-80 rounded-full bg-[#f0bf3c]/20 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-[-4rem] h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f0bf3c]/25 bg-[#f0bf3c]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#f7d978]">
              ✦ Nigeria&apos;s verified investment marketplace
            </div>

            <h1 className="hero-title max-w-3xl text-5xl font-black leading-[0.98] tracking-tight text-white lg:text-7xl">
              Find verified real estate and JV deals with confidence.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 lg:text-xl">
              Connect with verified property owners, developers, landowners, and joint venture opportunities through a marketplace built for trust, transparency, and mobile access.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollToSection("properties")}
                className="rounded-xl bg-[#f0bf3c] px-6 py-3 text-sm font-black text-[#0d1c38] transition hover:bg-[#f7ce62]"
              >
                Explore properties
              </button>

              <button
                type="button"
                onClick={() => setModal("post")}
                className="rounded-xl border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                + Post opportunity
              </button>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 md:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/5 p-4">
                  <div className="text-2xl font-black text-white">{s.num}</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-wide text-white/40">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-2xl backdrop-blur">
            <div className="overflow-hidden rounded-[1.5rem] bg-white">
              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-[#f0bf3c] via-[#98702d] to-[#0d1c38]">
                <div className="text-center">
                  <div className="mb-3 text-6xl">🏙️</div>
                  <p className="text-xl font-black text-white">
                    Premium Property Deal
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-[#f0bf3c]/15 px-3 py-1 text-xs font-black text-[#9b6b16]">
                    VERIFIED
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Abuja, Nigeria
                  </span>
                </div>

                <h3 className="mb-2 text-xl font-black text-[#0d1c38]">
                  Luxury Mixed-use Development
                </h3>

                <p className="mb-5 text-sm leading-7 text-slate-500">
                  A verified investment opportunity with document-backed ownership, developer profile, and JV structure.
                </p>

                <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
                  <div>
                    <p className="text-xs text-slate-400">Value</p>
                    <p className="font-black text-[#0d1c38]">₦3.5B</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">ROI</p>
                    <p className="font-black text-[#0d1c38]">24%</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Status</p>
                    <p className="font-black text-[#0d1c38]">Open</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openLeadForm(featuredProperty || undefined)}
                  className="mt-6 w-full rounded-xl bg-[#0d1c38] py-3 text-sm font-black text-white transition hover:bg-[#162b52]"
                >
                  Request access
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 lg:px-10">
        <form
          onSubmit={handleSearch}
          className="relative z-10 mx-auto -mt-8 max-w-7xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              Search investments
            </p>

            {(keyword || selectedState || type || statusFilter !== "all" || sortMode !== "newest") && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-black text-[#9b6b16] hover:text-[#f0bf3c]"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-6">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">
                Keyword
              </label>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Location, project..."
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">
                State
              </label>
              <input
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                placeholder="Lagos, Abuja..."
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
              >
                <option value="">All property types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
                <option value="joint_venture">Joint Venture</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
              >
                <option value="all">All status</option>
                <option value="Verified">Verified only</option>
                <option value="Pending review">Pending review</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">
                Sort
              </label>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
              >
                <option value="newest">Newest first</option>
                <option value="price_high">Price high to low</option>
                <option value="price_low">Price low to high</option>
                <option value="roi_high">Highest ROI</option>
                <option value="title_az">Title A-Z</option>
              </select>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-[#0d1c38] px-5 py-3 text-sm font-black text-white transition hover:bg-[#162b52]"
            >
              Search
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ["Verified", "Verified"],
              ["Pending", "Pending review"],
              ["Residential", "residential"],
              ["Commercial", "commercial"],
              ["Land", "land"],
            ].map(([label, value]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  if (value === "Verified" || value === "Pending review") {
                    setStatusFilter(value);
                  } else {
                    setType(value);
                  }
                }}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black text-slate-600 transition hover:border-[#f0bf3c] hover:bg-[#fff7df] hover:text-[#9b6b16]"
              >
                {label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setSortMode("price_high")}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black text-slate-600 transition hover:border-[#f0bf3c] hover:bg-[#fff7df] hover:text-[#9b6b16]"
            >
              Highest price
            </button>

            <button
              type="button"
              onClick={() => setSortMode("roi_high")}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black text-slate-600 transition hover:border-[#f0bf3c] hover:bg-[#fff7df] hover:text-[#9b6b16]"
            >
              Highest ROI
            </button>
          </div>
        </form>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#9b6b16]">
              Professional marketplace tools
            </p>
            <h2 className="text-2xl font-black tracking-tight text-[#0d1c38]">
              Faster property discovery for buyers, investors, and landowners.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
              Save listings, open property details inside cards, contact INAMAAD through WhatsApp, and separate JV opportunities from standard property listings.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-6">
              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-2xl font-black text-[#0d1c38]">{propertyListings.length}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-400">
                  Properties
                </p>
              </div>

              <div className="rounded-2xl bg-[#fff7df] p-4">
                <p className="text-2xl font-black text-[#0d1c38]">{jvListings.length}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-wide text-[#9b6b16]">
                  JV Deals
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-2xl font-black text-[#0d1c38]">{savedListings.length}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                  Saved
                </p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-2xl font-black text-[#0d1c38]">{leads.length}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-wide text-blue-700">
                  Leads
                </p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-4">
                <p className="text-2xl font-black text-[#0d1c38]">{inspections.length}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-wide text-purple-700">
                  Inspections
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 p-4">
                <p className="text-2xl font-black text-[#0d1c38]">{totalListingViews}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-wide text-orange-700">
                  Views
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-[#0d1c38] p-5 text-white shadow-sm lg:p-6">
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#f0bf3c]">
              Quick access
            </p>
            <h3 className="text-xl font-black">Saved properties</h3>

            {savedListings.length > 0 ? (
              <div className="mt-4 space-y-3">
                {savedListings.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      scrollToSection(isJVListing(item) ? "jv" : "properties");
                      setExpandedListingId(item.id);
                    }}
                    className="w-full rounded-2xl bg-white/10 p-3 text-left hover:bg-white/15"
                  >
                    <p className="text-sm font-black text-white">{item.title}</p>
                    <p className="mt-1 text-xs font-semibold text-white/55">
                      {item.location} · {item.price}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-7 text-white/60">
                Tap the Save button on any property to keep it here for quick access.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-blue-100 bg-blue-50 p-5 lg:p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
                  Compare properties
                </p>
                <h3 className="mt-1 text-xl font-black text-[#0d1c38]">
                  Compare up to 3 listings
                </h3>
              </div>

              {compareListings.length > 0 ? (
                <button
                  type="button"
                  onClick={clearCompareList}
                  className="rounded-xl bg-white px-3 py-2 text-xs font-black text-blue-700"
                >
                  Clear
                </button>
              ) : null}
            </div>

            {compareListings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] overflow-hidden rounded-2xl bg-white text-left text-xs">
                  <thead className="bg-[#0d1c38] text-white">
                    <tr>
                      <th className="p-3">Property</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">ROI</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareListings.map((item) => (
                      <tr key={`compare-${item.id}`} className="border-t border-slate-100">
                        <td className="p-3 font-black text-[#0d1c38]">
                          {item.title}
                          <p className="mt-1 font-semibold text-slate-500">{item.location}</p>
                        </td>
                        <td className="p-3 font-black text-[#0d1c38]">{item.price}</td>
                        <td className="p-3 font-black text-[#0d1c38]">{item.roi}</td>
                        <td className="p-3">{item.status}</td>
                        <td className="p-3">
                          {item.ownerVerified ? "Verified" : "Pending"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-2xl bg-white p-4 text-sm leading-7 text-slate-600">
                Use the Compare button on property cards to compare price, ROI, status, and owner verification.
              </p>
            )}
          </div>

          <div className="rounded-[2rem] border border-orange-100 bg-orange-50 p-5 lg:p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-700">
              Recently viewed
            </p>
            <h3 className="mt-1 text-xl font-black text-[#0d1c38]">
              Continue from where you stopped
            </h3>

            {recentlyViewedListings.length > 0 ? (
              <div className="mt-4 space-y-3">
                {recentlyViewedListings.slice(0, 4).map((item) => (
                  <button
                    key={`recent-${item.id}`}
                    type="button"
                    onClick={() => {
                      scrollToSection(isJVListing(item) ? "jv" : "properties");
                      setExpandedListingId(item.id);
                    }}
                    className="w-full rounded-2xl bg-white p-3 text-left shadow-sm hover:shadow-md"
                  >
                    <p className="text-sm font-black text-[#0d1c38]">{item.title}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {item.location} · {item.price} · {Number(listingViews[item.id] || 0)} views
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-7 text-slate-600">
                Open a property details modal or inside-card details, and it will appear here.
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="properties" className="mx-auto max-w-7xl px-4 py-14 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#9b6b16]">
              Featured properties
            </p>
            <h2 className="text-3xl font-black tracking-tight text-[#0d1c38]">
              Premium verified listings
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Showing {filteredProperties.length} property result
              {filteredProperties.length === 1 ? "" : "s"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {type ? (
                <span className="rounded-full bg-[#fff7df] px-3 py-1 text-[11px] font-black text-[#9b6b16]">
                  Type: {getTypeLabel(type)}
                </span>
              ) : null}

              {statusFilter !== "all" ? (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black text-blue-700">
                  Status: {statusFilter}
                </span>
              ) : null}

              {sortMode !== "newest" ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
                  Sort: {sortMode.replace("_", " ")}
                </span>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="hidden text-sm font-black text-[#9b6b16] hover:text-[#f0bf3c] md:block"
          >
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((item) => renderPropertyCard(item, "property"))}

          {filteredProperties.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center md:col-span-2 lg:col-span-3">
              <h3 className="mb-2 text-lg font-black text-[#0d1c38]">
                No matching properties found
              </h3>
              <p className="mb-5 text-sm text-slate-500">
                Try searching another location, keyword, or property type.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl bg-[#0d1c38] px-5 py-3 text-sm font-black text-white"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="jv" className="border-y border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#9b6b16]">
                Joint ventures
              </p>

              <h2 className="text-3xl font-black tracking-tight text-[#0d1c38]">
                Active JV opportunities
              </h2>
            </div>

            <button
              type="button"
              onClick={() => openLeadForm()}
              className="hidden text-sm font-black text-[#9b6b16] hover:text-[#f0bf3c] md:block"
            >
              Request JV access →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {jvListings.map((deal) => renderPropertyCard(deal, "jv"))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#9b6b16]">
            Browse by category
          </p>

          <h2 className="mb-8 text-3xl font-black tracking-tight text-[#0d1c38]">
            Investment categories
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => handleCategoryClick(c.typeValue)}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all hover:border-[#f0bf3c]/60 hover:shadow-lg"
              >
                <div className="mb-3 text-3xl">{c.icon}</div>

                <p className="mb-1 text-sm font-black text-[#0d1c38]">
                  {c.label}
                </p>

                <p className="text-xs font-semibold text-slate-400">
                  {c.count} listings
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="border-t border-slate-100 bg-[#f6f7fb] py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#9b6b16]">
            Why INAMAAD
          </p>

          <h2 className="mb-10 text-3xl font-black tracking-tight text-[#0d1c38]">
            Built for serious investors
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {WHY.map((w) => (
              <div
                key={w.title}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0bf3c]/15">
                  <div className="h-3 w-3 rounded-full bg-[#f0bf3c]" />
                </div>

                <h3 className="mb-2 text-base font-black text-[#0d1c38]">
                  {w.title}
                </h3>

                <p className="text-sm leading-7 text-slate-500">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#9b6b16]">
              Buyer safety center
            </p>
            <h2 className="text-3xl font-black tracking-tight text-[#0d1c38]">
              Safer property decisions before payment.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              INAMAAD should help buyers and investors slow down, verify ownership, inspect documents, and contact only trusted parties before committing funds.
            </p>

            <div className="mt-6 grid gap-3">
              {[
                "Confirm owner / agent verification status",
                "Check uploaded title or document preview",
                "Book inspection before payment",
                "Use WhatsApp enquiry for traceable communication",
                "Save and compare properties before deciding",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl bg-[#f8fafc] p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-black text-emerald-700">
                    ✓
                  </div>
                  <p className="text-sm font-bold leading-7 text-[#0d1c38]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-[#0d1c38] p-5 text-white shadow-sm lg:p-6">
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#f0bf3c]">
              Help and FAQ
            </p>
            <h3 className="text-3xl font-black">Common questions</h3>

            <div className="mt-6 space-y-3">
              {[
                [
                  "How do I know a property is trusted?",
                  "Check the Verified status, owner / agent verification badge, document preview, and use the inspection booking feature before payment.",
                ],
                [
                  "Can I compare properties?",
                  "Yes. Use the Compare button on property cards to compare price, ROI, location, trust signals, and details side by side.",
                ],
                [
                  "Where do buyer enquiries go?",
                  "Investor calls, buyer briefs, and inspection requests are saved into the Admin dashboard for follow-up.",
                ],
                [
                  "Are JV deals separate from normal properties?",
                  "Yes. Joint venture opportunities stay in the JV Deals section and do not use normal bedroom or bathroom logic.",
                ],
                [
                  "Can admin export data?",
                  "Yes. Admin can export listings, leads, inspections, and a full JSON backup.",
                ],
              ].map(([question, answer]) => (
                <details
                  key={question}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 open:bg-white/15"
                >
                  <summary className="cursor-pointer text-sm font-black text-white">
                    {question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-white/65">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 lg:px-10">
        <div className="rounded-[2rem] border border-[#f0bf3c]/30 bg-[#fff7df] p-5 shadow-sm lg:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#9b6b16]">
                Professional web presence
              </p>
              <h2 className="text-2xl font-black tracking-tight text-[#0d1c38]">
                SEO, social sharing, and trust metadata are now active.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                INAMAAD now sets a professional browser title, description, Open Graph sharing tags, mobile app metadata, canonical link, and real estate structured data when the app loads.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={shareMarketplace}
                className="rounded-xl bg-[#0d1c38] px-5 py-3 text-sm font-black text-white hover:bg-[#162b52]"
              >
                Share marketplace
              </button>

              <button
                type="button"
                onClick={() => {
                  installInamaadSeoMetadata();
                  showMessage("SEO metadata refreshed.");
                }}
                className="rounded-xl border border-[#0d1c38] bg-white px-5 py-3 text-sm font-black text-[#0d1c38] hover:bg-slate-50"
              >
                Refresh metadata
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-10">
        <div className="grid gap-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[0.9fr_1.1fr] lg:p-6">
          <div className="rounded-[1.5rem] bg-[#0d1c38] p-6 text-white">
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#f0bf3c]">
              Buyer concierge
            </p>
            <h2 className="text-3xl font-black leading-tight">
              Need help choosing the right property?
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Submit your buying brief and INAMAAD can match you with verified properties, JV deals, or inspection options from the admin lead dashboard.
            </p>

            <div className="mt-6 grid gap-3">
              {[
                "Verified property matching",
                "Inspection planning",
                "Investor lead tracking",
                "Owner / agent verification support",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-3">
                  <p className="text-sm font-black text-white">✓ {item}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleConciergeSubmit} className="grid gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9b6b16]">
                Submit buying brief
              </p>
              <h3 className="mt-1 text-2xl font-black text-[#0d1c38]">
                Professional buyer request
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                value={conciergeForm.name}
                onChange={(e) =>
                  setConciergeForm({ ...conciergeForm, name: e.target.value })
                }
                placeholder="Full name"
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
              />

              <input
                required
                type="email"
                value={conciergeForm.email}
                onChange={(e) =>
                  setConciergeForm({ ...conciergeForm, email: e.target.value })
                }
                placeholder="Email address"
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
              />

              <input
                required
                value={conciergeForm.phone}
                onChange={(e) =>
                  setConciergeForm({ ...conciergeForm, phone: e.target.value })
                }
                placeholder="Phone / WhatsApp"
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
              />

              <input
                required
                value={conciergeForm.budget}
                onChange={(e) =>
                  setConciergeForm({ ...conciergeForm, budget: e.target.value })
                }
                placeholder="Budget, e.g. ₦100M - ₦500M"
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <input
                value={conciergeForm.location}
                onChange={(e) =>
                  setConciergeForm({ ...conciergeForm, location: e.target.value })
                }
                placeholder="Preferred location"
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
              />

              <select
                value={conciergeForm.propertyType}
                onChange={(e) =>
                  setConciergeForm({
                    ...conciergeForm,
                    propertyType: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
              >
                <option value="">Any type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Land">Land</option>
                <option value="Joint Venture">Joint Venture</option>
              </select>

              <select
                value={conciergeForm.timeline}
                onChange={(e) =>
                  setConciergeForm({ ...conciergeForm, timeline: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
              >
                <option value="">Timeline</option>
                <option value="Immediately">Immediately</option>
                <option value="This month">This month</option>
                <option value="1-3 months">1-3 months</option>
                <option value="Still researching">Still researching</option>
              </select>
            </div>

            <textarea
              value={conciergeForm.message}
              onChange={(e) =>
                setConciergeForm({ ...conciergeForm, message: e.target.value })
              }
              rows={4}
              placeholder="Tell us what you want: location, property size, title/document preference, inspection needs..."
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
            />

            <button className="rounded-xl bg-[#0d1c38] px-5 py-3 text-sm font-black text-white hover:bg-[#162b52]">
              Submit buyer brief
            </button>
          </form>
        </div>
      </section>

      <section id="compliance" className="mx-auto max-w-7xl px-4 py-14 lg:px-10">
        <div className="rounded-[2rem] border border-red-100 bg-white p-5 shadow-sm lg:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[1.5rem] bg-red-50 p-6">
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-red-600">
                Compliance and fraud protection
              </p>
              <h2 className="text-3xl font-black tracking-tight text-[#0d1c38]">
                Do not pay anyone without verification.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                INAMAAD should guide buyers, landowners, developers, and investors to verify ownership, documents, inspection access, and stakeholder identity before payment or commitment.
              </p>

              <div className="mt-5 rounded-2xl border border-red-100 bg-white p-4">
                <p className="text-sm font-black text-red-700">
                  Important safety notice
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Avoid cash payments, private pressure deals, fake urgency, unverifiable agents, and payment into personal accounts without proper agreement, receipt, inspection, and document review.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [
                  "Document check",
                  "Confirm title documents, survey plans, allocation letters, deeds, or C of O before moving forward.",
                ],
                [
                  "Owner / agent check",
                  "Use the owner verification badge, admin verification note, and direct contact details before negotiation.",
                ],
                [
                  "Inspection first",
                  "Book inspection and confirm the property physically before payment or final commitment.",
                ],
                [
                  "Agreement trail",
                  "Keep written agreements, receipts, WhatsApp records, and stakeholder names for accountability.",
                ],
                [
                  "JV due diligence",
                  "For JV deals, confirm land title, sharing formula, developer capacity, project stage, and legal structure.",
                ],
                [
                  "Admin backup",
                  "Export leads, inspections, and listing backups regularly before major business decisions.",
                ],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
                  <p className="text-sm font-black text-[#0d1c38]">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 rounded-[1.5rem] border border-slate-200 bg-[#f8fafc] p-4 lg:grid-cols-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Buyer responsibility
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Buyers should independently verify documents and inspect properties before payment.
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Platform role
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                INAMAAD helps organize verified opportunities, enquiries, inspections, and records.
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Professional advice
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Use a lawyer, surveyor, valuer, or qualified real estate professional for final checks.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-14 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] bg-[#0d1c38] px-6 py-10 md:flex-row md:items-center lg:px-10">
          <div>
            <h2 className="mb-3 text-3xl font-black text-white">
              Ready to invest with confidence?
            </h2>

            <p className="max-w-md text-sm leading-7 text-white/55">
              Join investors, developers, and landowners already using INAMAAD to discover verified real estate opportunities.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setModal("register")}
              className="rounded-xl bg-[#f0bf3c] px-6 py-3 text-sm font-black text-[#0d1c38] transition hover:bg-[#f7ce62]"
            >
              Create free account
            </button>

            <button
              type="button"
              onClick={() => setModal("post")}
              className="rounded-xl border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Post opportunity
            </button>
          </div>
        </div>
      </section>

      <section id="legal" className="mx-auto max-w-7xl px-4 py-14 lg:px-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[1.5rem] bg-[#0d1c38] p-6 text-white">
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#f0bf3c]">
                Legal and privacy center
              </p>
              <h2 className="text-3xl font-black tracking-tight">
                Clear rules for safer real estate use.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/65">
                This marketplace stores demo listings, saved properties, leads, inspections, comparison items, and admin activity in the user’s browser local storage until a backend database is connected.
              </p>

              <button
                type="button"
                onClick={acceptPrivacyNotice}
                className="mt-6 rounded-xl bg-[#f0bf3c] px-5 py-3 text-sm font-black text-[#0d1c38] hover:bg-[#f7ce62]"
              >
                Accept privacy notice
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [
                  "Privacy notice",
                  "Buyer briefs, leads, inspections, saved notes, and admin records are currently saved in this browser for demo/business testing.",
                ],
                [
                  "Terms of use",
                  "Users should verify title, ownership, inspection access, and legal documents before payment or agreement.",
                ],
                [
                  "No payment guarantee",
                  "Do not treat listed prices, ROI, or JV offers as final legal advice or guaranteed investment return.",
                ],
                [
                  "Data responsibility",
                  "Admins should export backups regularly and move production data to a secure backend before public launch.",
                ],
                [
                  "Professional checks",
                  "Use lawyers, surveyors, valuers, and qualified real estate professionals for final verification.",
                ],
                [
                  "Local data control",
                  "Browser-stored demo data can be reset from the safety guard or admin backup tools when needed.",
                ],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
                  <p className="text-sm font-black text-[#0d1c38]">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-10 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-black tracking-[0.18em] text-[#0d1c38]">
              INAMAAD
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Verified real estate, JV deals, and investor access across Nigeria.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => scrollToSection("properties")}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-[#0d1c38]"
            >
              Properties
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("jv")}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-[#0d1c38]"
            >
              JV Deals
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("compliance")}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-[#0d1c38]"
            >
              Compliance
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("legal")}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-[#0d1c38]"
            >
              Legal
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-500 px-4 py-2 text-sm font-black text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </footer>

      {selectedListing && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm md:items-center">
          <div className="w-full max-w-2xl rounded-[1.5rem] bg-white p-5 shadow-2xl md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-[#9b6b16]">
                  {selectedListing.type} · {getListingReference(selectedListing.id)}
                </p>
                <h2 className="text-2xl font-black leading-tight text-[#0d1c38]">
                  {selectedListing.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedListing(null)}
                className="rounded-full bg-slate-100 px-4 py-2 text-2xl leading-none text-slate-500 hover:text-[#0d1c38]"
              >
                ×
              </button>
            </div>

            {selectedListing.imageUrl ? (
              <img
                src={selectedListing.imageUrl}
                alt={selectedListing.title}
                className="mb-5 h-56 w-full rounded-2xl object-cover"
              />
            ) : null}

            {selectedListing.galleryUrls && selectedListing.galleryUrls.length > 0 ? (
              <div className="mb-5 grid grid-cols-4 gap-2">
                {selectedListing.galleryUrls.slice(0, 4).map((imageUrl, imageIndex) => (
                  <img
                    key={`modal-gallery-${imageIndex}`}
                    src={imageUrl}
                    alt={`${selectedListing.title} gallery ${imageIndex + 1}`}
                    className="h-20 w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            ) : null}

            {selectedListing.documentName ? (
              <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
                  Document preview
                </p>
                <p className="mt-1 font-black text-[#0d1c38]">
                  {selectedListing.documentName}
                </p>

                {selectedListing.documentDataUrl ? (
                  <a
                    href={selectedListing.documentDataUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white"
                  >
                    Open uploaded document
                  </a>
                ) : null}
              </div>
            ) : null}

            <p className="mb-5 text-sm leading-7 text-slate-600">
              {selectedListing.summary}
            </p>

            <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl bg-[#f6f7fb] p-4">
              <div>
                <p className="text-xs text-slate-400">Location</p>
                <p className="font-black text-[#0d1c38]">
                  {selectedListing.location}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Price</p>
                <p className="font-black text-[#0d1c38]">{selectedListing.price}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Projected ROI</p>
                <p className="font-black text-[#0d1c38]">{selectedListing.roi}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Status</p>
                <p className="font-black text-[#0d1c38]">{selectedListing.status}</p>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              {[
                ["Bedrooms", selectedListing.bedrooms || "Not stated"],
                ["Bathrooms", selectedListing.bathrooms || "Not stated"],
                ["Land size", selectedListing.landSize || "Not stated"],
                ["Document", selectedListing.documentTitle || "Under review"],
                ["Owner phone", selectedListing.ownerPhone || "Contact INAMAAD"],
                ["WhatsApp", selectedListing.whatsapp || "Contact INAMAAD"],
                ["Owner / Agent", selectedListing.ownerName || "INAMAAD contact"],
                ["Owner role", selectedListing.ownerRole || "Owner / Agent"],
                ["Owner verified", selectedListing.ownerVerified ? "Verified" : "Pending review"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="font-black text-[#0d1c38]">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={getWhatsappUrl(selectedListing)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-green-500 px-5 py-3 text-center text-sm font-black text-white hover:bg-green-600"
              >
                WhatsApp enquiry
              </a>

              <button
                type="button"
                onClick={() => {
                  openLeadForm(selectedListing);
                }}
                className="rounded-xl bg-[#0d1c38] px-5 py-3 text-sm font-black text-white hover:bg-[#162b52]"
              >
                Request investor access
              </button>

              <button
                type="button"
                onClick={() => openInspectionForm(selectedListing)}
                className="rounded-xl border border-[#f0bf3c] bg-[#fff7df] px-5 py-3 text-sm font-black text-[#9b6b16] hover:bg-[#f7e8bd]"
              >
                Book property inspection
              </button>

              <button
                type="button"
                onClick={() => copyPropertySummary(selectedListing)}
                className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-black text-blue-700 hover:bg-blue-100"
              >
                Copy summary
              </button>

              <button
                type="button"
                onClick={() => printPropertySummary(selectedListing)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 sm:col-span-2"
              >
                Print property summary
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[130] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm md:items-center">
          <div className="w-full max-w-lg rounded-[1.5rem] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-widest text-[#9b6b16]">
                  INAMAAD
                </p>
                <h2 className="text-2xl font-black text-[#0d1c38]">
                  {modal === "login" && "Sign in"}
                  {modal === "register" && "Create your account"}
                  {modal === "forgot" && "Forgot password"}
                  {modal === "post" && "Post opportunity"}
                  {modal === "investor" && "Request investor access"}
                  {modal === "inspection" && "Book property inspection"}
                  {modal === "admin" && "Admin dashboard"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setModal(null)}
                className="text-2xl text-slate-400 hover:text-[#0d1c38]"
              >
                ×
              </button>
            </div>

            {modal === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  required
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="Email address"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />
                <input
                  required
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Password"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />

                <button className="w-full rounded-xl bg-[#0d1c38] py-3 text-sm font-black text-white">
                  Sign in
                </button>

                <button
                  type="button"
                  onClick={() => setModal("forgot")}
                  className="w-full text-sm font-black text-[#9b6b16] hover:text-[#f0bf3c]"
                >
                  Forgot password?
                </button>
              </form>
            )}

            {modal === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-sm leading-7 text-slate-500">
                  Enter your email. For production reset emails, connect Supabase SMTP.
                </p>
                <input
                  required
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />
                <button className="w-full rounded-xl bg-[#0d1c38] py-3 text-sm font-black text-white">
                  Request password reset
                </button>
              </form>
            )}

            {modal === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  required
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />
                <input
                  required
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  placeholder="Email address"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />
                <select
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                >
                  <option>Investor</option>
                  <option>Developer</option>
                  <option>Landowner</option>
                  <option>Agent</option>
                </select>
                <input
                  required
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  placeholder="Password"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />
                <button className="w-full rounded-xl bg-[#0d1c38] py-3 text-sm font-black text-white">
                  Create account
                </button>
              </form>
            )}

            {modal === "post" && (
              <form onSubmit={handlePostListing} className="space-y-4">
                <input
                  required
                  value={newListing.title}
                  onChange={(e) =>
                    setNewListing({ ...newListing, title: e.target.value })
                  }
                  placeholder="Opportunity title"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />
                <input
                  required
                  value={newListing.location}
                  onChange={(e) =>
                    setNewListing({ ...newListing, location: e.target.value })
                  }
                  placeholder="Location"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />
                <input
                  required
                  value={newListing.state}
                  onChange={(e) =>
                    setNewListing({ ...newListing, state: e.target.value })
                  }
                  placeholder="State"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />
                <input
                  required
                  value={newListing.price}
                  onChange={(e) =>
                    setNewListing({ ...newListing, price: e.target.value })
                  }
                  placeholder="Price, e.g. ₦500M"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={newListing.bedrooms}
                    onChange={(e) =>
                      setNewListing({ ...newListing, bedrooms: e.target.value })
                    }
                    placeholder="Bedrooms, e.g. 4"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <input
                    value={newListing.bathrooms}
                    onChange={(e) =>
                      setNewListing({ ...newListing, bathrooms: e.target.value })
                    }
                    placeholder="Bathrooms, e.g. 5"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={newListing.landSize}
                    onChange={(e) =>
                      setNewListing({ ...newListing, landSize: e.target.value })
                    }
                    placeholder="Land size, e.g. 600sqm"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <input
                    value={newListing.documentTitle}
                    onChange={(e) =>
                      setNewListing({ ...newListing, documentTitle: e.target.value })
                    }
                    placeholder="Document title, e.g. C of O"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                  />
                </div>

                <div className="rounded-2xl border border-[#f0bf3c]/30 bg-[#fff7df] p-4">
                  <p className="mb-3 text-xs font-black uppercase tracking-wide text-[#9b6b16]">
                    Owner / Agent verification information
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      value={newListing.ownerName}
                      onChange={(e) =>
                        setNewListing({ ...newListing, ownerName: e.target.value })
                      }
                      placeholder="Owner / Agent name"
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <select
                      value={newListing.ownerRole}
                      onChange={(e) =>
                        setNewListing({ ...newListing, ownerRole: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                    >
                      <option value="Owner">Owner</option>
                      <option value="Agent">Agent</option>
                      <option value="Developer">Developer</option>
                      <option value="Landowner">Landowner</option>
                      <option value="Company Representative">Company Representative</option>
                    </select>
                  </div>

                  <textarea
                    value={newListing.ownerVerificationNote}
                    onChange={(e) =>
                      setNewListing({
                        ...newListing,
                        ownerVerificationNote: e.target.value,
                      })
                    }
                    placeholder="Verification note, e.g. owner has C of O, direct mandate, company authorization..."
                    rows={3}
                    className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={newListing.ownerPhone}
                    onChange={(e) =>
                      setNewListing({ ...newListing, ownerPhone: e.target.value })
                    }
                    placeholder="Owner phone"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <input
                    value={newListing.whatsapp}
                    onChange={(e) =>
                      setNewListing({ ...newListing, whatsapp: e.target.value })
                    }
                    placeholder="WhatsApp number"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                  />
                </div>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                    Property image preview
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewListingImageUpload}
                    className="w-full rounded-xl bg-white px-3 py-3 text-sm"
                  />

                  {newListing.imageUrl ? (
                    <div className="mt-3">
                      <img
                        src={newListing.imageUrl}
                        alt="Property preview"
                        className="h-40 w-full rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setNewListing({ ...newListing, imageUrl: "" })}
                        className="mt-2 text-xs font-black text-red-600"
                      >
                        Remove image
                      </button>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Optional for now. Use a clear front-view property photo below 2.5MB.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                    Extra gallery photos
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleNewListingGalleryUpload}
                    className="w-full rounded-xl bg-white px-3 py-3 text-sm"
                  />

                  {newListing.galleryUrls.length > 0 ? (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {newListing.galleryUrls.map((imageUrl, imageIndex) => (
                        <div key={`new-gallery-${imageIndex}`} className="relative">
                          <img
                            src={imageUrl}
                            alt={`Gallery preview ${imageIndex + 1}`}
                            className="h-20 w-full rounded-xl object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(imageIndex)}
                            className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-1 text-[10px] font-black text-white"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Optional. Add up to 4 extra photos below 1.5MB each.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-4">
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-emerald-700">
                    Document upload preview
                  </label>

                  <input
                    type="file"
                    accept=".pdf,image/jpeg,image/png,image/webp"
                    onChange={handleDocumentUpload}
                    className="w-full rounded-xl bg-white px-3 py-3 text-sm"
                  />

                  {newListing.documentName ? (
                    <div className="mt-3 rounded-xl bg-white p-3">
                      <p className="text-xs font-black text-[#0d1c38]">
                        {newListing.documentName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        This preview will be saved with the listing.
                      </p>
                      <button
                        type="button"
                        onClick={removeDocumentPreview}
                        className="mt-2 text-xs font-black text-red-600"
                      >
                        Remove document
                      </button>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs leading-5 text-emerald-700">
                      Optional. Upload C of O, survey, deed, allocation letter, or title preview below 1.2MB.
                    </p>
                  )}
                </div>

                <select
                  value={newListing.typeValue}
                  onChange={(e) =>
                    setNewListing({ ...newListing, typeValue: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                  <option value="joint_venture">Joint Venture</option>
                </select>

                <input
                  value={newListing.roi}
                  onChange={(e) =>
                    setNewListing({ ...newListing, roi: e.target.value })
                  }
                  placeholder="Projected ROI, e.g. 20%"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />

                <textarea
                  required
                  value={newListing.summary}
                  onChange={(e) =>
                    setNewListing({ ...newListing, summary: e.target.value })
                  }
                  placeholder="Short summary of the opportunity"
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />

                <button className="w-full rounded-xl bg-[#0d1c38] py-3 text-sm font-black text-white">
                  Submit opportunity
                </button>
              </form>
            )}

            {modal === "investor" && (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                {leadForm.listingTitle ? (
                  <div className="rounded-2xl bg-[#fff7df] p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-[#9b6b16]">
                      Enquiry for
                    </p>
                    <p className="mt-1 text-sm font-black text-[#0d1c38]">
                      {leadForm.listingTitle}
                    </p>
                  </div>
                ) : null}

                <input
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />
                <input
                  required
                  type="email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  placeholder="Email address"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />
                <input
                  required
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  placeholder="Phone / WhatsApp number"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />
                <input
                  required
                  value={leadForm.budget}
                  onChange={(e) => setLeadForm({ ...leadForm, budget: e.target.value })}
                  placeholder="Investment budget, e.g. ₦100M - ₦500M"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />
                <textarea
                  required
                  rows={4}
                  value={leadForm.message}
                  onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                  placeholder="Tell us what kind of opportunity you want"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />
                <button className="w-full rounded-xl bg-[#0d1c38] py-3 text-sm font-black text-white">
                  Submit enquiry
                </button>
              </form>
            )}

            {modal === "admin" && !adminUnlocked && (
              <form onSubmit={unlockAdmin} className="space-y-4">
                <p className="text-sm leading-7 text-slate-500">
                  Enter the admin password to manage listings.
                </p>

                <input
                  required
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Admin password"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                />

                <button className="w-full rounded-xl bg-[#0d1c38] py-3 text-sm font-black text-white">
                  Unlock admin
                </button>
              </form>
            )}

            {modal === "admin" && adminUnlocked && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-[#f6f7fb] p-4">
                  <p className="mb-1 text-sm font-black text-[#0d1c38]">
                    Total opportunities: {listings.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    Approve pending opportunities or remove bad listings from the platform.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-green-50 p-4">
                    <p className="text-2xl font-black text-[#0d1c38]">
                      {listings.filter((item) => item.status === "Verified").length}
                    </p>
                    <p className="mt-1 text-xs font-black uppercase tracking-wide text-green-700">
                      Verified
                    </p>
                  </div>

                  <div className="rounded-2xl bg-yellow-50 p-4">
                    <p className="text-2xl font-black text-[#0d1c38]">
                      {listings.filter((item) => item.status !== "Verified").length}
                    </p>
                    <p className="mt-1 text-xs font-black uppercase tracking-wide text-yellow-700">
                      Pending / Review
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-[#0d1c38]">
                        Property views analytics
                      </p>
                      <p className="mt-1 text-xs leading-5 text-orange-700">
                        Tracks views when users open full modal or property details inside cards.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 text-center">
                      <p className="text-2xl font-black text-[#0d1c38]">
                        {totalListingViews}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-wide text-orange-700">
                        Total views
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-2xl font-black text-[#0d1c38]">
                        {averageListingViews}
                      </p>
                      <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-400">
                        Avg / listing
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-2xl font-black text-[#0d1c38]">
                        {topViewedListings[0]?.viewCount || 0}
                      </p>
                      <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-400">
                        Top listing
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">
                      Top viewed listings
                    </p>

                    {topViewedListings.map((item) => (
                      <div
                        key={`view-${item.id}`}
                        className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-[#0d1c38]">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.location} · {item.price}
                          </p>
                        </div>

                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">
                          {item.viewCount} views
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#f0bf3c]/30 bg-[#fff7df] p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-[#0d1c38]">
                        Admin follow-up command center
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#9b6b16]">
                        One place to handle pending approvals, owner checks, new leads, and inspection requests.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 text-center">
                      <p className="text-2xl font-black text-[#0d1c38]">
                        {adminActionQueueCount}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-wide text-[#9b6b16]">
                        Actions
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-2xl font-black text-[#0d1c38]">
                        {pendingListingsCount}
                      </p>
                      <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-400">
                        Pending listings
                      </p>
                      <button
                        type="button"
                        onClick={approveAllPendingListings}
                        className="mt-3 w-full rounded-xl bg-[#0d1c38] px-3 py-2.5 text-xs font-black text-white hover:bg-[#162b52]"
                      >
                        Approve pending
                      </button>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-2xl font-black text-[#0d1c38]">
                        {unverifiedOwnersCount}
                      </p>
                      <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-400">
                        Owner checks
                      </p>
                      <button
                        type="button"
                        onClick={verifyAllUnverifiedOwners}
                        className="mt-3 w-full rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-black text-white hover:bg-emerald-700"
                      >
                        Verify owners
                      </button>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-2xl font-black text-[#0d1c38]">
                        {newLeadsCount}
                      </p>
                      <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-400">
                        New leads
                      </p>
                      <button
                        type="button"
                        onClick={markAllNewLeadsContacted}
                        className="mt-3 w-full rounded-xl border border-blue-200 px-3 py-2.5 text-xs font-black text-blue-700 hover:bg-blue-50"
                      >
                        Mark contacted
                      </button>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-2xl font-black text-[#0d1c38]">
                        {newInspectionsCount}
                      </p>
                      <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-400">
                        New inspections
                      </p>
                      <button
                        type="button"
                        onClick={confirmAllNewInspections}
                        className="mt-3 w-full rounded-xl border border-purple-200 px-3 py-2.5 text-xs font-black text-purple-700 hover:bg-purple-50"
                      >
                        Confirm inspections
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={featureTopViewedFromFollowUp}
                    className="mt-3 w-full rounded-xl border border-[#f0bf3c] bg-white px-3 py-2.5 text-xs font-black text-[#9b6b16] hover:bg-[#fff7df]"
                  >
                    Feature top viewed listings
                  </button>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-[#0d1c38]">
                        Admin task manager
                      </p>
                      <p className="mt-1 text-xs leading-5 text-blue-700">
                        Plan follow-ups for listings, buyer calls, inspections, documents, and team operations.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-2xl bg-white px-3 py-2">
                        <p className="text-lg font-black text-[#0d1c38]">
                          {openAdminTasksCount}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-wide text-blue-700">
                          Open
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white px-3 py-2">
                        <p className="text-lg font-black text-[#0d1c38]">
                          {urgentAdminTasksCount}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-wide text-red-600">
                          Urgent
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white px-3 py-2">
                        <p className="text-lg font-black text-[#0d1c38]">
                          {dueAdminTasksCount}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-wide text-[#9b6b16]">
                          Due
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={addAdminTask} className="mb-4 grid gap-3 rounded-2xl bg-white p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        required
                        value={adminTaskForm.title}
                        onChange={(e) =>
                          setAdminTaskForm({ ...adminTaskForm, title: e.target.value })
                        }
                        placeholder="Task title, e.g. Call buyer, verify C of O..."
                        className="w-full rounded-xl border border-blue-100 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                      />

                      <input
                        value={adminTaskForm.assignee}
                        onChange={(e) =>
                          setAdminTaskForm({ ...adminTaskForm, assignee: e.target.value })
                        }
                        placeholder="Assignee"
                        className="w-full rounded-xl border border-blue-100 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <input
                        type="date"
                        value={adminTaskForm.dueDate}
                        onChange={(e) =>
                          setAdminTaskForm({ ...adminTaskForm, dueDate: e.target.value })
                        }
                        className="w-full rounded-xl border border-blue-100 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                      />

                      <select
                        value={adminTaskForm.priority}
                        onChange={(e) =>
                          setAdminTaskForm({
                            ...adminTaskForm,
                            priority: e.target.value as AdminTask["priority"],
                          })
                        }
                        className="w-full rounded-xl border border-blue-100 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                      >
                        <option value="Low">Low priority</option>
                        <option value="Medium">Medium priority</option>
                        <option value="High">High priority</option>
                        <option value="Urgent">Urgent priority</option>
                      </select>

                      <button
                        type="submit"
                        className="rounded-xl bg-[#0d1c38] px-3 py-3 text-sm font-black text-white hover:bg-[#162b52]"
                      >
                        Add task
                      </button>
                    </div>

                    <textarea
                      value={adminTaskForm.note}
                      onChange={(e) =>
                        setAdminTaskForm({ ...adminTaskForm, note: e.target.value })
                      }
                      rows={3}
                      placeholder="Task note or follow-up detail..."
                      className="w-full rounded-xl border border-blue-100 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </form>

                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={exportAdminTasksCsv}
                      className="rounded-xl bg-[#0d1c38] px-3 py-2.5 text-xs font-black text-white hover:bg-[#162b52]"
                    >
                      Export tasks CSV
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminTaskForm({
                          title: "",
                          assignee: "Admin",
                          dueDate: "",
                          priority: "Medium",
                          note: "",
                        });
                        showMessage("Task form cleared.");
                      }}
                      className="rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-xs font-black text-blue-700 hover:bg-blue-50"
                    >
                      Clear form
                    </button>
                  </div>

                  {adminTasks.length > 0 ? (
                    <div className="space-y-2">
                      {adminTasks.slice(0, 8).map((task) => (
                        <div
                          key={task.id}
                          className="rounded-2xl border border-blue-100 bg-white p-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-black text-[#0d1c38]">
                                {task.title}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {task.assignee} {task.dueDate ? `· Due ${task.dueDate}` : ""} {task.note ? `· ${task.note}` : ""}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${
                                  task.priority === "Urgent"
                                    ? "bg-red-50 text-red-700"
                                    : task.priority === "High"
                                      ? "bg-orange-50 text-orange-700"
                                      : "bg-blue-50 text-blue-700"
                                }`}
                              >
                                {task.priority}
                              </span>

                              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600">
                                {task.status}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {(["Open", "In Progress", "Done"] as AdminTask["status"][]).map((status) => (
                              <button
                                key={`${task.id}-${status}`}
                                type="button"
                                onClick={() => updateAdminTaskStatus(task.id, status)}
                                className={`rounded-xl px-3 py-2 text-xs font-black ${
                                  task.status === status
                                    ? "bg-[#0d1c38] text-white"
                                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                {status}
                              </button>
                            ))}

                            <button
                              type="button"
                              onClick={() => deleteAdminTask(task.id)}
                              className="rounded-xl border border-red-200 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-sm font-bold leading-6 text-slate-500">
                        No admin tasks yet. Add tasks for buyer follow-up, title verification, inspection scheduling, owner calls, or backup reminders.
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-[#0d1c38]">
                        Admin activity log
                      </p>
                      <p className="mt-1 text-xs leading-5 text-emerald-700">
                        Tracks important admin, listing, lead, inspection, and backup actions in this browser.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 text-center">
                      <p className="text-2xl font-black text-[#0d1c38]">
                        {activityLogs.length}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700">
                        Logs
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={exportActivityLogsCsv}
                      className="rounded-xl bg-[#0d1c38] px-3 py-2.5 text-xs font-black text-white hover:bg-[#162b52]"
                    >
                      Export log CSV
                    </button>

                    <button
                      type="button"
                      onClick={clearActivityLogs}
                      className="rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-black text-red-600 hover:bg-red-50"
                    >
                      Clear log
                    </button>
                  </div>

                  {activityLogs.length > 0 ? (
                    <div className="space-y-2">
                      {activityLogs.slice(0, 8).map((log) => (
                        <div
                          key={log.id}
                          className="rounded-2xl border border-emerald-100 bg-white p-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-black text-[#0d1c38]">
                              {log.action}
                            </p>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                              {log.category}
                            </span>
                          </div>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {log.detail}
                          </p>
                          <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-slate-400">
                            {formatActivityDate(log.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-sm font-bold leading-6 text-slate-500">
                        No activity yet. New admin actions, leads, inspections, and backup events will appear here.
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-4">
                    <p className="text-sm font-black text-[#0d1c38]">
                      Data backup and exports
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Export listings, leads, inspections, or a full JSON backup before major edits or deployment.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={exportListingsCsv}
                      className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-black text-[#0d1c38] hover:bg-slate-50"
                    >
                      Export listings CSV
                    </button>

                    <button
                      type="button"
                      onClick={exportLeadsCsv}
                      className="rounded-xl border border-blue-200 px-3 py-2.5 text-xs font-black text-blue-700 hover:bg-blue-50"
                    >
                      Export leads CSV
                    </button>

                    <button
                      type="button"
                      onClick={exportInspectionsCsv}
                      className="rounded-xl border border-purple-200 px-3 py-2.5 text-xs font-black text-purple-700 hover:bg-purple-50"
                    >
                      Export inspections CSV
                    </button>

                    <button
                      type="button"
                      onClick={exportActivityLogsCsv}
                      className="rounded-xl border border-emerald-200 px-3 py-2.5 text-xs font-black text-emerald-700 hover:bg-emerald-50"
                    >
                      Export activity CSV
                    </button>

                    <button
                      type="button"
                      onClick={exportFullBackupJson}
                      className="rounded-xl bg-[#0d1c38] px-3 py-2.5 text-xs font-black text-white hover:bg-[#162b52]"
                    >
                      Full JSON backup
                    </button>
                  </div>

                  <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3">
                    <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                      Restore full JSON backup
                    </label>
                    <input
                      type="file"
                      accept="application/json,.json"
                      onChange={handleRestoreBackup}
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs"
                    />
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Only restore backups exported from this INAMAAD admin panel.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={clearDemoDataConfirm}
                    className="mt-3 w-full rounded-xl border border-red-200 px-3 py-2.5 text-xs font-black text-red-600 hover:bg-red-50"
                  >
                    Reset local demo data
                  </button>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="mb-1 text-sm font-black text-[#0d1c38]">
                    Investor leads: {leads.length}
                  </p>
                  <p className="text-xs text-blue-700">
                    Track enquiries from property details, JV deals, and investor request forms.
                  </p>
                </div>

                {leads.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Recent enquiries
                    </p>

                    {leads.slice(0, 5).map((lead) => (
                      <div key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <p className="font-black text-[#0d1c38]">{lead.name}</p>
                            <p className="text-xs text-slate-500">
                              {lead.email} · {lead.phone}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              lead.status === "New"
                                ? "bg-blue-50 text-blue-700"
                                : lead.status === "Contacted"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-green-50 text-green-700"
                            }`}
                          >
                            {lead.status}
                          </span>
                        </div>

                        {lead.listingTitle ? (
                          <p className="mb-2 text-xs font-black text-[#9b6b16]">
                            Property: {lead.listingTitle}
                          </p>
                        ) : null}

                        <p className="mb-2 text-xs font-black text-slate-500">
                          Budget: {lead.budget}
                        </p>
                        <p className="mb-3 text-sm leading-6 text-slate-600">{lead.message}</p>

                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-green-500 px-3 py-2 text-center text-xs font-black text-white"
                          >
                            WhatsApp
                          </a>

                          <button
                            type="button"
                            onClick={() => updateLeadStatus(lead.id, "Contacted")}
                            className="rounded-xl bg-[#0d1c38] px-3 py-2 text-xs font-black text-white"
                          >
                            Mark contacted
                          </button>

                          <button
                            type="button"
                            onClick={() => updateLeadStatus(lead.id, "Closed")}
                            className="rounded-xl border border-green-200 px-3 py-2 text-xs font-black text-green-700"
                          >
                            Close
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteLead(lead.id)}
                            className="rounded-xl border border-red-200 px-3 py-2 text-xs font-black text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
                  <p className="mb-1 text-sm font-black text-[#0d1c38]">
                    Inspection requests: {inspections.length}
                  </p>
                  <p className="text-xs text-purple-700">
                    Confirm, complete, cancel, or remove property inspection requests.
                  </p>
                </div>

                {inspections.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Property inspections
                    </p>

                    {inspections.slice(0, 5).map((inspection) => (
                      <div
                        key={inspection.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <p className="font-black text-[#0d1c38]">
                              {inspection.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {inspection.email} · {inspection.phone}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              inspection.status === "New"
                                ? "bg-purple-50 text-purple-700"
                                : inspection.status === "Confirmed"
                                  ? "bg-blue-50 text-blue-700"
                                  : inspection.status === "Completed"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                            }`}
                          >
                            {inspection.status}
                          </span>
                        </div>

                        {inspection.listingTitle ? (
                          <p className="mb-2 text-xs font-black text-[#9b6b16]">
                            Property: {inspection.listingTitle}
                          </p>
                        ) : null}

                        <p className="mb-2 text-xs font-black text-slate-500">
                          Preferred: {inspection.preferredDate} at {inspection.preferredTime}
                        </p>

                        {inspection.note ? (
                          <p className="mb-3 text-sm leading-6 text-slate-600">
                            {inspection.note}
                          </p>
                        ) : null}

                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`https://wa.me/${inspection.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-green-500 px-3 py-2 text-center text-xs font-black text-white"
                          >
                            WhatsApp
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              updateInspectionStatus(inspection.id, "Confirmed")
                            }
                            className="rounded-xl bg-[#0d1c38] px-3 py-2 text-xs font-black text-white"
                          >
                            Confirm
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateInspectionStatus(inspection.id, "Completed")
                            }
                            className="rounded-xl border border-green-200 px-3 py-2 text-xs font-black text-green-700"
                          >
                            Complete
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateInspectionStatus(inspection.id, "Cancelled")
                            }
                            className="rounded-xl border border-red-200 px-3 py-2 text-xs font-black text-red-600"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteInspection(inspection.id)}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 sm:col-span-2"
                          >
                            Delete inspection
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="mb-3 text-sm font-black text-[#0d1c38]">
                    Admin listing search
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
                    <input
                      value={adminListingSearch}
                      onChange={(e) => setAdminListingSearch(e.target.value)}
                      placeholder="Search title, owner, state, status..."
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <select
                      value={adminListingStatusFilter}
                      onChange={(e) => setAdminListingStatusFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                    >
                      <option value="all">All status</option>
                      <option value="Verified">Verified</option>
                      <option value="Pending review">Pending review</option>
                    </select>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    Showing {adminFilteredListings.length} of {listings.length} listings.
                  </p>
                </div>

                {adminFilteredListings.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                    {editingListingId === item.id ? (
                      <form onSubmit={handleEditListingSubmit} className="space-y-3">
                        <div className="rounded-2xl bg-[#fff7df] p-3">
                          <p className="text-xs font-black uppercase tracking-wide text-[#9b6b16]">
                            Editing listing
                          </p>
                          <p className="mt-1 text-sm font-black text-[#0d1c38]">
                            {item.title}
                          </p>
                        </div>

                        <input
                          required
                          value={editListingForm.title}
                          onChange={(e) =>
                            setEditListingForm({
                              ...editListingForm,
                              title: e.target.value,
                            })
                          }
                          placeholder="Listing title"
                          className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                        />

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <input
                            required
                            value={editListingForm.location}
                            onChange={(e) =>
                              setEditListingForm({
                                ...editListingForm,
                                location: e.target.value,
                              })
                            }
                            placeholder="Location"
                            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                          />

                          <input
                            required
                            value={editListingForm.state}
                            onChange={(e) =>
                              setEditListingForm({
                                ...editListingForm,
                                state: e.target.value,
                              })
                            }
                            placeholder="State"
                            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <input
                            required
                            value={editListingForm.price}
                            onChange={(e) =>
                              setEditListingForm({
                                ...editListingForm,
                                price: e.target.value,
                              })
                            }
                            placeholder="Price / value"
                            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                          />

                          <input
                            value={editListingForm.roi}
                            onChange={(e) =>
                              setEditListingForm({
                                ...editListingForm,
                                roi: e.target.value,
                              })
                            }
                            placeholder="ROI"
                            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <select
                            value={editListingForm.typeValue}
                            onChange={(e) =>
                              setEditListingForm({
                                ...editListingForm,
                                typeValue: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                          >
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="land">Land</option>
                            <option value="joint_venture">Joint Venture</option>
                          </select>

                          <select
                            value={editListingForm.status}
                            onChange={(e) =>
                              setEditListingForm({
                                ...editListingForm,
                                status: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                          >
                            <option value="Verified">Verified</option>
                            <option value="Pending review">Pending review</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <input
                            value={editListingForm.bedrooms}
                            onChange={(e) =>
                              setEditListingForm({
                                ...editListingForm,
                                bedrooms: e.target.value,
                              })
                            }
                            placeholder="Bedrooms"
                            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                          />

                          <input
                            value={editListingForm.bathrooms}
                            onChange={(e) =>
                              setEditListingForm({
                                ...editListingForm,
                                bathrooms: e.target.value,
                              })
                            }
                            placeholder="Bathrooms"
                            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <input
                            value={editListingForm.landSize}
                            onChange={(e) =>
                              setEditListingForm({
                                ...editListingForm,
                                landSize: e.target.value,
                              })
                            }
                            placeholder="Land size"
                            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                          />

                          <input
                            value={editListingForm.documentTitle}
                            onChange={(e) =>
                              setEditListingForm({
                                ...editListingForm,
                                documentTitle: e.target.value,
                              })
                            }
                            placeholder="Document title"
                            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <input
                            value={editListingForm.ownerPhone}
                            onChange={(e) =>
                              setEditListingForm({
                                ...editListingForm,
                                ownerPhone: e.target.value,
                              })
                            }
                            placeholder="Owner phone"
                            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                          />

                          <input
                            value={editListingForm.whatsapp}
                            onChange={(e) =>
                              setEditListingForm({
                                ...editListingForm,
                                whatsapp: e.target.value,
                              })
                            }
                            placeholder="WhatsApp"
                            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                          />
                        </div>

                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                          <label className="flex items-center gap-3 text-sm font-black text-[#0d1c38]">
                            <input
                              type="checkbox"
                              checked={editListingForm.ownerVerified}
                              onChange={(e) =>
                                setEditListingForm({
                                  ...editListingForm,
                                  ownerVerified: e.target.checked,
                                })
                              }
                              className="h-4 w-4"
                            />
                            Owner / agent verified by admin
                          </label>

                          <textarea
                            value={editListingForm.ownerVerificationNote}
                            onChange={(e) =>
                              setEditListingForm({
                                ...editListingForm,
                                ownerVerificationNote: e.target.value,
                              })
                            }
                            placeholder="Verification note"
                            rows={3}
                            className="mt-3 w-full rounded-xl border border-emerald-100 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                          />
                        </div>

                        <textarea
                          required
                          rows={4}
                          value={editListingForm.summary}
                          onChange={(e) =>
                            setEditListingForm({
                              ...editListingForm,
                              summary: e.target.value,
                            })
                          }
                          placeholder="Summary"
                          className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0d1c38]"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            className="rounded-xl bg-[#0d1c38] px-4 py-3 text-sm font-black text-white"
                          >
                            Save changes
                          </button>

                          <button
                            type="button"
                            onClick={cancelEditingListing}
                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="mb-3 flex items-start justify-between gap-4">
                          <div>
                            <p className="mb-1 text-xs font-black text-[#9b6b16]">
                              {item.type}
                            </p>
                            <h3 className="font-black text-[#0d1c38]">{item.title}</h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.location} · {item.price}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              item.status === "Verified"
                                ? "bg-green-50 text-green-700"
                                : "bg-yellow-50 text-yellow-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="mb-4 text-sm leading-6 text-slate-500">
                          {item.summary}
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => approveListing(item.id)}
                            className="rounded-xl bg-[#0d1c38] py-2.5 text-sm font-black text-white hover:bg-[#162b52]"
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() => startEditingListing(item)}
                            className="rounded-xl border border-blue-200 py-2.5 text-sm font-black text-blue-700 hover:bg-blue-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleFeaturedListing(item.id)}
                            className={`rounded-xl border py-2.5 text-sm font-black ${
                              item.featured
                                ? "border-orange-200 text-orange-700 hover:bg-orange-50"
                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {item.featured ? "Unfeature" : "Feature"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              item.ownerVerified
                                ? unverifyListingOwner(item.id)
                                : verifyListingOwner(item.id)
                            }
                            className={`rounded-xl border py-2.5 text-sm font-black ${
                              item.ownerVerified
                                ? "border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            }`}
                          >
                            {item.ownerVerified ? "Unverify owner" : "Verify owner"}
                          </button>

                          <button
                            type="button"
                            onClick={() => duplicateListing(item)}
                            className="rounded-xl border border-[#f0bf3c] py-2.5 text-sm font-black text-[#9b6b16] hover:bg-[#fff7df]"
                          >
                            Duplicate
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteListing(item.id)}
                            className="rounded-xl border border-red-200 py-2.5 text-sm font-black text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {listings.length === 0 && (
                  <div className="rounded-2xl border border-slate-200 p-6 text-center">
                    <p className="text-sm text-slate-500">
                      No opportunities available yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-[75] hidden flex-col gap-3 md:flex">
        <button
          type="button"
          onClick={() => scrollToSection("properties")}
          className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#0d1c38] shadow-2xl hover:bg-slate-50"
        >
          Properties
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("jv")}
          className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#0d1c38] shadow-2xl hover:bg-slate-50"
        >
          JV Deals
        </button>

        <button
          type="button"
          onClick={shareMarketplace}
          className="rounded-full bg-[#f0bf3c] px-5 py-3 text-sm font-black text-[#0d1c38] shadow-2xl hover:bg-[#f7ce62]"
        >
          Share
        </button>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-green-500 px-5 py-3 text-center text-sm font-black text-white shadow-2xl hover:bg-green-600"
        >
          WhatsApp
        </a>
      </div>

      <div className="mobile-bottom-nav md:hidden">
        <button type="button" onClick={() => scrollToSection("properties")}>
          Properties
        </button>
        <button type="button" onClick={() => scrollToSection("jv")}>
          JV Deals
        </button>
        <button type="button" className="gold" onClick={() => setModal("post")}>
          Post
        </button>
        <button
          type="button"
          className="primary"
          onClick={() => setModal(authUser ? "admin" : "login")}
        >
          {authUser ? "Admin" : "Login"}
        </button>
      </div>
    </div>
  );
}

type InamaadErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string;
};

class InamaadErrorBoundary extends React.Component<
  { children: React.ReactNode },
  InamaadErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: "",
    };
  }

  static getDerivedStateFromError(error: Error): InamaadErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || "The page failed to load.",
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("INAMAAD frontend crash guard:", error, errorInfo);
  }

  resetLocalDataAndReload() {
    [
      "inamaad_listings",
      "inamaad_auth_user",
      "inamaad_saved_listing_ids",
      "inamaad_saved_listing_notes",
      "inamaad_leads",
      "inamaad_inspections",
      "inamaad_activity_logs",
      "inamaad_admin_tasks",
      "inamaad_listing_views",
      "inamaad_recent_listing_ids",
      "inamaad_compare_listing_ids",
    ].forEach((key) => localStorage.removeItem(key));

    window.location.reload();
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-[#f6f7fb] px-4 py-10 text-slate-950">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-red-100 bg-white p-6 shadow-2xl">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            ⚠️
          </div>

          <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-red-600">
            INAMAAD safety guard
          </p>

          <h1 className="text-3xl font-black tracking-tight text-[#0d1c38]">
            The website was protected from a blank screen.
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            A frontend error happened, but the safety guard stopped the app from staying blank.
            Refresh the page first. If it still shows this screen, reset local browser data below.
          </p>

          {this.state.errorMessage ? (
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Technical message
              </p>
              <p className="mt-1 text-sm font-bold text-[#0d1c38]">
                {this.state.errorMessage}
              </p>
            </div>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-[#0d1c38] px-5 py-3 text-sm font-black text-white hover:bg-[#162b52]"
            >
              Refresh website
            </button>

            <button
              type="button"
              onClick={() => this.resetLocalDataAndReload()}
              className="rounded-xl border border-red-200 px-5 py-3 text-sm font-black text-red-600 hover:bg-red-50"
            >
              Reset local data
            </button>
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            Reset local data only clears data saved in this browser. It does not delete your deployed code.
          </p>
        </div>
      </div>
    );
  }
}

export default function App() {
  return (
    <InamaadErrorBoundary>
      <InamaadApp />
    </InamaadErrorBoundary>
  );
}

