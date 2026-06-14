import React, { useEffect, useMemo, useState } from "react";
import { createClient, type User } from "@supabase/supabase-js";

type ModalType =
  | null
  | "signin"
  | "register"
  | "post"
  | "investor"
  | "admin"
  | "details"
  | "edit";

type ListingStatus = "Verified" | "Pending Review";
type LeadStatus = "New" | "Contacted" | "Closed";
type InspectionStatus = "New" | "Scheduled" | "Completed" | "Cancelled";

type Listing = {
  id: number;
  title: string;
  location: string;
  price: string;
  value: number;
  type: string;
  category: string;
  yieldText: string;
  description: string;
  status: ListingStatus;
  ownerName?: string;
  ownerPhone?: string;
  imageUrl?: string;
  featured?: boolean;
  featuredRank?: number;
  createdAt?: string;
};

type InvestorRequest = {
  id: number;
  name: string;
  email: string;
  phone: string;
  budget: string;
  interest: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
};

type PropertyInquiry = {
  id: number;
  listingId?: number | null;
  listingTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
};

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
};

type InspectionBooking = {
  id: number;
  listingId?: number | null;
  listingTitle: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: InspectionStatus;
  createdAt: string;
};

type PropertyView = {
  id: number;
  listingId: number;
  listingTitle: string;
  viewedAt: string;
};

const WHATSAPP_NUMBER = "2348106350486";
const LOCAL_ADMIN_PASSWORD = "admin123";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined);

const supabase =
  SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Properties", href: "#properties" },
  { label: "JV Deals", href: "#jv" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const nigeriaStateOptions = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const nigeriaLocationOptions = [
  { label: "FCT Abuja", value: "Abuja" },
  ...nigeriaStateOptions.map((state) => ({ label: state, value: state })),
];

const nigeriaLocationLabels = [
  "FCT Abuja",
  ...nigeriaStateOptions,
];

const seedListings: Listing[] = [
  {
    id: 1,
    title: "Luxury Apartments in Abuja",
    location: "Maitama, Abuja",
    price: "₦450M",
    value: 450000000,
    type: "Residential",
    category: "For Sale",
    yieldText: "Premium capital appreciation in Abuja’s prime district",
    description:
      "A high-end residential investment opportunity positioned for strong rental income, resale value, and long-term wealth preservation.",
    status: "Verified",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Commercial Plaza in Lagos",
    location: "Victoria Island, Lagos",
    price: "₦1.2B",
    value: 1200000000,
    type: "Commercial",
    category: "Investment",
    yieldText: "Strong commercial rental potential",
    description:
      "A premium commercial asset located in one of Lagos’ strongest business districts, suitable for corporate tenants and long-term income.",
    status: "Verified",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Prime Development Land",
    location: "Lekki, Lagos",
    price: "₦800M",
    value: 800000000,
    type: "Land",
    category: "Land Banking",
    yieldText: "Strategic location for development or resale",
    description:
      "A large land asset in a fast-growing corridor suitable for residential development, estate layout, or strategic land banking.",
    status: "Verified",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Joint Venture Estate Project",
    location: "Gwarinpa, Abuja",
    price: "JV Partnership",
    value: 350000000,
    type: "Joint Venture",
    category: "JV",
    yieldText: "Developer and landowner partnership structure available",
    description:
      "A structured joint venture opportunity for developers and investors interested in residential estate development.",
    status: "Verified",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Smart Duplex Investment",
    location: "Lekki Phase 1, Lagos",
    price: "₦185M",
    value: 185000000,
    type: "Residential",
    category: "For Sale",
    yieldText: "Estimated 14% yearly appreciation",
    description:
      "A modern duplex in a high-demand residential market with strong resale and rental potential.",
    status: "Verified",
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: "Serviced Estate Plots",
    location: "Ibeju-Lekki, Lagos",
    price: "₦18.5M",
    value: 18500000,
    type: "Land",
    category: "Investment",
    yieldText: "High-growth corridor near major infrastructure",
    description:
      "Documented serviced plots suitable for land banking, resale, and long-term property investment.",
    status: "Verified",
    createdAt: new Date().toISOString(),
  },
];

const stats = [
  { value: "2,500+", label: "Verified listings" },
  { value: "10,000+", label: "Registered users" },
  { value: "150+", label: "JV opportunities" },
  { value: "36", label: "States + FCT" },
];

const categoryCards = [
  {
    title: "Residential",
    text: "Premium homes, apartments, duplexes, and estate opportunities for buyers and investors.",
  },
  {
    title: "Land & Commercial",
    text: "Strategic land, commercial plazas, office assets, and long-term real estate opportunities.",
  },
  {
    title: "JV Opportunities",
    text: "Connect landowners, developers, and investors for profitable development partnerships.",
  },
];

const processSteps = [
  {
    title: "Submit opportunity",
    text: "Owners, developers, landowners, and agents submit properties, land, or joint venture deals.",
  },
  {
    title: "Verification review",
    text: "INAMAAD reviews key details such as ownership, location, value, opportunity strength, and investment fit.",
  },
  {
    title: "Investor connection",
    text: "Qualified investors discover opportunities based on budget, location, asset type, and strategy.",
  },
];

const verificationItems = [
  "Property and ownership review",
  "Market value and location assessment",
  "Developer, seller, or landowner screening",
  "Investor risk and opportunity review",
];

const faqItems = [
  {
    question: "Is INAMAAD only for buying property?",
    answer:
      "No. INAMAAD supports property sales, land investments, commercial assets, joint ventures, and investor matching.",
  },
  {
    question: "Can developers post opportunities?",
    answer:
      "Yes. Developers can submit projects, JV proposals, off-plan opportunities, and investment-ready real estate deals.",
  },
  {
    question: "Can investors request private deals?",
    answer:
      "Yes. Investors can submit their budget and interest so INAMAAD can match them with suitable opportunities.",
  },
  {
    question: "Are all listings verified?",
    answer:
      "Listings marked as verified have passed internal review. New submissions remain pending until admin approval.",
  },
];

function formatDate(value?: string) {
  if (!value) return "Recently";

  return new Date(value).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function currencyToValue(value: string) {
  const cleaned = value.replace(/[^\d]/g, "");
  return Number(cleaned || 0);
}

function formatNairaCompact(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "₦0";

  if (value >= 1_000_000_000) {
    return `₦${(value / 1_000_000_000).toFixed(value % 1_000_000_000 === 0 ? 0 : 1)}B`;
  }

  if (value >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }

  if (value >= 1_000) {
    return `₦${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  }

  return `₦${value.toLocaleString("en-NG")}`;
}

function normalizePhoneForLink(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("0")) {
    return `234${digits.slice(1)}`;
  }

  return digits;
}

function createWhatsAppLeadLink(phone: string, message: string) {
  return `https://wa.me/${normalizePhoneForLink(phone)}?text=${encodeURIComponent(
    message
  )}`;
}

function createCallLeadLink(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

function createEmailLeadLink(email: string, subject: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

function buildListingShareUrl(listingId: number) {
  const url = new URL(window.location.origin);
  url.pathname = window.location.pathname;
  url.searchParams.set("property", String(listingId));
  url.hash = "properties";
  return url.toString();
}

function buildListingShareText(listing: Listing) {
  return `INAMAAD Real Estate: ${listing.title} - ${listing.price} in ${listing.location}. View details: ${buildListingShareUrl(
    listing.id
  )}`;
}

function leadStatusClass(status: LeadStatus) {
  if (status === "Closed") return "bg-emerald-100 text-emerald-700";
  if (status === "Contacted") return "bg-blue-100 text-blue-700";
  return "bg-amber-100 text-amber-700";
}

function inspectionStatusClass(status: InspectionStatus) {
  if (status === "Completed") return "bg-emerald-100 text-emerald-700";
  if (status === "Scheduled") return "bg-blue-100 text-blue-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

function getTopCount(items: string[]) {
  const counts = items.reduce<Record<string, number>>((accumulator, item) => {
    const key = item || "Unknown";
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  return (
    Object.entries(counts).sort((first, second) => second[1] - first[1])[0] || [
      "None yet",
      0,
    ]
  );
}

function mapListingRow(row: any): Listing {
  return {
    id: Number(row.id),
    title: row.title,
    location: row.location,
    price: row.price,
    value: Number(row.value || 0),
    type: row.type,
    category: row.category,
    yieldText: row.yield_text,
    description: row.description,
    status: row.status,
    ownerName: row.owner_name || "",
    ownerPhone: row.owner_phone || "",
    imageUrl: row.image_url || "",
    featured: Boolean(row.featured),
    featuredRank: Number(row.featured_rank || 0),
    createdAt: row.created_at,
  };
}

function mapInvestorRow(row: any): InvestorRequest {
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    budget: row.budget,
    interest: row.interest,
    message: row.message || "",
    status: row.status || "New",
    createdAt: row.created_at,
  };
}

function mapPropertyInquiryRow(row: any): PropertyInquiry {
  return {
    id: Number(row.id),
    listingId: row.listing_id ? Number(row.listing_id) : null,
    listingTitle: row.listing_title,
    name: row.name,
    email: row.email || "",
    phone: row.phone,
    message: row.message || "",
    status: row.status || "New",
    createdAt: row.created_at,
  };
}

function mapPropertyViewRow(row: any): PropertyView {
  return {
    id: Number(row.id),
    listingId: Number(row.listing_id),
    listingTitle: row.listing_title,
    viewedAt: row.viewed_at,
  };
}

function mapContactMessageRow(row: any): ContactMessage {
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email || "",
    phone: row.phone || "",
    subject: row.subject || "General enquiry",
    message: row.message || "",
    status: row.status || "New",
    createdAt: row.created_at,
  };
}

function mapInspectionBookingRow(row: any): InspectionBooking {
  return {
    id: Number(row.id),
    listingId: row.listing_id ? Number(row.listing_id) : null,
    listingTitle: row.listing_title,
    name: row.name,
    email: row.email || "",
    phone: row.phone,
    preferredDate: row.preferred_date || "",
    preferredTime: row.preferred_time || "",
    message: row.message || "",
    status: row.status || "New",
    createdAt: row.created_at,
  };
}

function listingToRow(listing: Omit<Listing, "id">) {
  return {
    title: listing.title,
    location: listing.location,
    price: listing.price,
    value: listing.value,
    type: listing.type,
    category: listing.category,
    yield_text: listing.yieldText,
    description: listing.description,
    status: listing.status,
    owner_name: listing.ownerName || null,
    owner_phone: listing.ownerPhone || null,
    image_url: listing.imageUrl || null,
    featured: Boolean(listing.featured),
    featured_rank: Number(listing.featuredRank || 0),
  };
}

export default function App() {
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [investorRequests, setInvestorRequests] = useState<InvestorRequest[]>(
    []
  );
  const [propertyInquiries, setPropertyInquiries] = useState<PropertyInquiry[]>(
    []
  );
  const [propertyViews, setPropertyViews] = useState<PropertyView[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [inspectionBookings, setInspectionBookings] = useState<InspectionBooking[]>([]);
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [minValueFilter, setMinValueFilter] = useState("");
  const [maxValueFilter, setMaxValueFilter] = useState("");
  const [sortMode, setSortMode] = useState("Newest");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sharedListingOpened, setSharedListingOpened] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [postForm, setPostForm] = useState({
    title: "",
    location: "",
    price: "",
    type: "Residential",
    category: "For Sale",
    yieldText: "",
    description: "",
    ownerName: "",
    ownerPhone: "",
  });

  const [postImageFile, setPostImageFile] = useState<File | null>(null);

  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    price: "",
    type: "Residential",
    category: "For Sale",
    yieldText: "",
    description: "",
    status: "Verified" as ListingStatus,
    ownerName: "",
    ownerPhone: "",
    imageUrl: "",
    featured: false,
    featuredRank: "0",
  });

  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const [investorForm, setInvestorForm] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    interest: "Residential",
    message: "",
  });

  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [inspectionForm, setInspectionForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const usesDatabase = Boolean(supabase);

  const pendingListings = listings.filter(
    (listing) => listing.status === "Pending Review"
  );

  const verifiedListings = listings.filter(
    (listing) => listing.status === "Verified"
  );

  const totalPropertyValue = listings.reduce(
    (total, listing) => total + Number(listing.value || 0),
    0
  );

  const verifiedPropertyValue = verifiedListings.reduce(
    (total, listing) => total + Number(listing.value || 0),
    0
  );

  const totalLeads = investorRequests.length + propertyInquiries.length + contactMessages.length + inspectionBookings.length;
  const conversionReadyLeads = propertyInquiries.length + contactMessages.length + inspectionBookings.length;
  const [topLocation, topLocationCount] = getTopCount(
    listings.map((listing) => listing.location.split(",")[0]?.trim() || listing.location)
  );
  const [topType, topTypeCount] = getTopCount(
    listings.map((listing) => listing.type)
  );

  const totalPropertyViews = propertyViews.length;
  const [mostViewedProperty, mostViewedPropertyCount] = getTopCount(
    propertyViews.map((view) => view.listingTitle)
  );
  const viewCountByListingId = useMemo(() => {
    return propertyViews.reduce<Record<number, number>>((counts, view) => {
      counts[view.listingId] = (counts[view.listingId] || 0) + 1;
      return counts;
    }, {});
  }, [propertyViews]);
  const topViewedListings = useMemo(() => {
    return [...listings]
      .map((listing) => ({
        ...listing,
        views: viewCountByListingId[listing.id] || 0,
      }))
      .sort((first, second) => second.views - first.views)
      .slice(0, 5);
  }, [listings, viewCountByListingId]);

  const filteredListings = useMemo(() => {
    const minValue = Number(minValueFilter || 0);
    const maxValue = Number(maxValueFilter || 0);

    return listings
      .filter((listing) => {
        if (listing.status !== "Verified") return false;

        const searchText =
          `${listing.title} ${listing.location} ${listing.type} ${listing.category}`.toLowerCase();

        const matchesSearch = searchText.includes(query.toLowerCase());

        const matchesType =
          propertyType === "All" || listing.type === propertyType;

        const matchesLocation =
          locationFilter === "All Locations" ||
          listing.location.toLowerCase().includes(locationFilter.toLowerCase());

        const matchesMinValue = !minValueFilter || Number(listing.value || 0) >= minValue;
        const matchesMaxValue = !maxValueFilter || Number(listing.value || 0) <= maxValue;

        return (
          matchesSearch &&
          matchesType &&
          matchesLocation &&
          matchesMinValue &&
          matchesMaxValue
        );
      })
      .sort((a, b) => {
        if (Boolean(a.featured) !== Boolean(b.featured)) {
          return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        }

        if (Boolean(a.featured) && Boolean(b.featured)) {
          const rankDifference = Number(b.featuredRank || 0) - Number(a.featuredRank || 0);
          if (rankDifference !== 0) return rankDifference;
        }

        if (sortMode === "Price High to Low") {
          return Number(b.value || 0) - Number(a.value || 0);
        }

        if (sortMode === "Price Low to High") {
          return Number(a.value || 0) - Number(b.value || 0);
        }

        if (sortMode === "Title A-Z") {
          return a.title.localeCompare(b.title);
        }

        return (
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
        );
      });
  }, [
    listings,
    query,
    propertyType,
    locationFilter,
    minValueFilter,
    maxValueFilter,
    sortMode,
  ]);

  useEffect(() => {
    if (!supabase) {
      loadLocalData();
      return;
    }

    loadDatabaseListings();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        checkAdminAccess();
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setAdminUnlocked(false);
          setInvestorRequests([]);
          setPropertyInquiries([]);
          setPropertyViews([]);
          setContactMessages([]);
          setInspectionBookings([]);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !user) return;
    checkAdminAccess();
  }, [user]);

  useEffect(() => {
    if (supabase) return;
    localStorage.setItem("inamaad_listings", JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    if (supabase) return;
    localStorage.setItem(
      "inamaad_investor_requests",
      JSON.stringify(investorRequests)
    );
  }, [investorRequests]);

  useEffect(() => {
    if (supabase) return;
    localStorage.setItem(
      "inamaad_property_inquiries",
      JSON.stringify(propertyInquiries)
    );
  }, [propertyInquiries]);

  useEffect(() => {
    if (supabase) return;
    localStorage.setItem("inamaad_property_views", JSON.stringify(propertyViews));
  }, [propertyViews]);

  useEffect(() => {
    if (supabase) return;
    localStorage.setItem("inamaad_contact_messages", JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    if (supabase) return;
    localStorage.setItem("inamaad_inspection_bookings", JSON.stringify(inspectionBookings));
  }, [inspectionBookings]);

  useEffect(() => {
    function openAdminShortcut(event: KeyboardEvent) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "a") {
        setAdminPassword("");
        setModal("admin");
      }
    }

    window.addEventListener("keydown", openAdminShortcut);
    return () => window.removeEventListener("keydown", openAdminShortcut);
  }, []);

  useEffect(() => {
    if (sharedListingOpened || !listings.length) return;

    const propertyId = Number(new URLSearchParams(window.location.search).get("property"));
    if (!propertyId) return;

    const listing = listings.find(
      (currentListing) =>
        currentListing.id === propertyId && currentListing.status === "Verified"
    );

    if (!listing) return;

    setSharedListingOpened(true);
    openListing(listing);
  }, [listings, sharedListingOpened]);

  function showSuccess(message: string) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 4500);
  }

  function loadLocalData() {
    try {
      const storedListings = localStorage.getItem("inamaad_listings");
      const storedRequests = localStorage.getItem("inamaad_investor_requests");
      const storedInquiries = localStorage.getItem("inamaad_property_inquiries");
      const storedViews = localStorage.getItem("inamaad_property_views");
      const storedContactMessages = localStorage.getItem("inamaad_contact_messages");
      const storedInspectionBookings = localStorage.getItem("inamaad_inspection_bookings");

      if (storedListings) {
        setListings(JSON.parse(storedListings) as Listing[]);
      }

      if (storedRequests) {
        setInvestorRequests(JSON.parse(storedRequests) as InvestorRequest[]);
      }

      if (storedInquiries) {
        setPropertyInquiries(JSON.parse(storedInquiries) as PropertyInquiry[]);
      }

      if (storedViews) {
        setPropertyViews(JSON.parse(storedViews) as PropertyView[]);
      }

      if (storedContactMessages) {
        setContactMessages(JSON.parse(storedContactMessages) as ContactMessage[]);
      }

      if (storedInspectionBookings) {
        setInspectionBookings(JSON.parse(storedInspectionBookings) as InspectionBooking[]);
      }
    } catch {
      localStorage.removeItem("inamaad_listings");
      localStorage.removeItem("inamaad_investor_requests");
      localStorage.removeItem("inamaad_property_inquiries");
      localStorage.removeItem("inamaad_property_views");
      localStorage.removeItem("inamaad_contact_messages");
      localStorage.removeItem("inamaad_inspection_bookings");
    }
  }

  async function loadDatabaseListings() {
    if (!supabase) return;

    setIsLoading(true);

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    setIsLoading(false);

    if (error) {
      console.error(error);
      showSuccess("Unable to load listings from database.");
      return;
    }

    setListings((data || []).map(mapListingRow));
  }

  async function loadDatabaseInvestorRequests() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("investor_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setInvestorRequests((data || []).map(mapInvestorRow));
  }

  async function loadDatabasePropertyInquiries() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("property_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPropertyInquiries((data || []).map(mapPropertyInquiryRow));
  }

  async function loadDatabasePropertyViews() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("property_views")
      .select("*")
      .order("viewed_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPropertyViews((data || []).map(mapPropertyViewRow));
  }

  async function loadDatabaseContactMessages() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setContactMessages((data || []).map(mapContactMessageRow));
  }

  async function loadDatabaseInspectionBookings() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("inspection_bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setInspectionBookings((data || []).map(mapInspectionBookingRow));
  }

  async function checkAdminAccess() {
    if (!supabase) return;

    const { data, error } = await supabase.rpc("is_admin");

    if (error) {
      console.error(error);
      setAdminUnlocked(false);
      return;
    }

    setAdminUnlocked(Boolean(data));

    if (data) {
      await loadDatabaseListings();
      await loadDatabaseInvestorRequests();
      await loadDatabasePropertyInquiries();
      await loadDatabasePropertyViews();
      await loadDatabaseContactMessages();
      await loadDatabaseInspectionBookings();
    }
  }

  async function uploadPropertyImage(file: File) {
    if (!supabase) return "";

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeFileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const { error } = await supabase.storage
      .from("property-images")
      .upload(safeFileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(safeFileName);

    return data.publicUrl;
  }

  function imageFileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function openListing(listing: Listing) {
    setSelectedListing(listing);
    setInquiryForm({ name: "", email: "", phone: "", message: "" });
    setInspectionForm({
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
    });
    setModal("details");

    const newView: Omit<PropertyView, "id"> = {
      listingId: listing.id,
      listingTitle: listing.title,
      viewedAt: new Date().toISOString(),
    };

    if (supabase) {
      const { error } = await supabase.from("property_views").insert({
        listing_id: listing.id,
        listing_title: listing.title,
      });

      if (error) {
        console.error(error);
        return;
      }

      if (adminUnlocked) {
        await loadDatabasePropertyViews();
      }
    } else {
      setPropertyViews((current) => [{ ...newView, id: Date.now() }, ...current]);
    }
  }

  async function copyListingShareLink(listing: Listing) {
    const shareUrl = buildListingShareUrl(listing.id);

    try {
      await navigator.clipboard.writeText(shareUrl);
      showSuccess("Property link copied. You can now share it with clients.");
    } catch {
      showSuccess(shareUrl);
    }
  }

  async function shareListing(listing: Listing) {
    const shareUrl = buildListingShareUrl(listing.id);
    const shareText = buildListingShareText(listing);

    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled native sharing, so fall back to copying.
      }
    }

    await copyListingShareLink(listing);
  }

  function shareListingToWhatsApp(listing: Listing) {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(buildListingShareText(listing))}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function openEditListing(listing: Listing) {
    setEditingListing(listing);
    setSelectedListing(null);
    setEditImageFile(null);
    setEditForm({
      title: listing.title,
      location: listing.location,
      price: listing.price,
      type: listing.type,
      category: listing.category,
      yieldText: listing.yieldText,
      description: listing.description,
      status: listing.status,
      ownerName: listing.ownerName || "",
      ownerPhone: listing.ownerPhone || "",
      imageUrl: listing.imageUrl || "",
      featured: Boolean(listing.featured),
      featuredRank: String(listing.featuredRank || 0),
    });
    setModal("edit");
  }

  async function submitListing(event: React.FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const imageUrl = postImageFile
        ? supabase
          ? await uploadPropertyImage(postImageFile)
          : await imageFileToBase64(postImageFile)
        : "";

      const newListing: Omit<Listing, "id"> = {
        title: postForm.title,
        location: postForm.location,
        price: postForm.price,
        value: currencyToValue(postForm.price),
        type: postForm.type,
        category: postForm.category,
        yieldText: postForm.yieldText || "Pending investment review",
        description: postForm.description,
        status: "Pending Review",
        ownerName: postForm.ownerName,
        ownerPhone: postForm.ownerPhone,
        imageUrl,
        featured: false,
        featuredRank: 0,
        createdAt: new Date().toISOString(),
      };

      if (supabase) {
        const { error } = await supabase.from("listings").insert(
          listingToRow({
            ...newListing,
            status: "Pending Review",
          })
        );

        if (error) {
          console.error(error);
          showSuccess("Unable to submit listing. Check database settings.");
          return;
        }

        await loadDatabaseListings();
      } else {
        setListings((current) => [
          { ...newListing, id: Date.now() },
          ...current,
        ]);
      }

      setPostForm({
        title: "",
        location: "",
        price: "",
        type: "Residential",
        category: "For Sale",
        yieldText: "",
        description: "",
        ownerName: "",
        ownerPhone: "",
      });
      setPostImageFile(null);

      setModal(null);
      showSuccess("Opportunity submitted successfully. Admin review is pending.");
    } catch (error) {
      console.error(error);
      showSuccess("Image upload failed. Please try a smaller JPG, PNG, or WEBP image.");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitEditListing(event: React.FormEvent) {
    event.preventDefault();

    if (!editingListing) return;

    setIsLoading(true);

    try {
      const imageUrl = editImageFile
        ? supabase
          ? await uploadPropertyImage(editImageFile)
          : await imageFileToBase64(editImageFile)
        : editForm.imageUrl;

      const updatedListing: Listing = {
        ...editingListing,
        title: editForm.title,
        location: editForm.location,
        price: editForm.price,
        value: currencyToValue(editForm.price),
        type: editForm.type,
        category: editForm.category,
        yieldText: editForm.yieldText || "Pending investment review",
        description: editForm.description,
        status: editForm.status,
        ownerName: editForm.ownerName,
        ownerPhone: editForm.ownerPhone,
        imageUrl,
        featured: Boolean(editForm.featured),
        featuredRank: Number(editForm.featuredRank || 0),
      };

      if (supabase) {
        const { error } = await supabase
          .from("listings")
          .update(
            listingToRow({
              title: updatedListing.title,
              location: updatedListing.location,
              price: updatedListing.price,
              value: updatedListing.value,
              type: updatedListing.type,
              category: updatedListing.category,
              yieldText: updatedListing.yieldText,
              description: updatedListing.description,
              status: updatedListing.status,
              ownerName: updatedListing.ownerName,
              ownerPhone: updatedListing.ownerPhone,
              imageUrl: updatedListing.imageUrl,
              featured: updatedListing.featured,
              featuredRank: updatedListing.featuredRank,
              createdAt: updatedListing.createdAt,
            })
          )
          .eq("id", editingListing.id);

        if (error) {
          console.error(error);
          showSuccess("Unable to update listing. Check database policies.");
          return;
        }

        await loadDatabaseListings();
      } else {
        setListings((current) =>
          current.map((listing) =>
            listing.id === editingListing.id ? updatedListing : listing
          )
        );
      }

      setEditImageFile(null);
      setEditingListing(null);
      setModal("admin");
      showSuccess("Listing updated successfully.");
    } catch (error) {
      console.error(error);
      showSuccess("Image upload failed. Please try a smaller JPG, PNG, or WEBP image.");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitInvestorRequest(event: React.FormEvent) {
    event.preventDefault();

    const newRequest: Omit<InvestorRequest, "id"> = {
      ...investorForm,
      status: "New",
      createdAt: new Date().toISOString(),
    };

    if (supabase) {
      const { error } = await supabase.from("investor_requests").insert({
        name: investorForm.name,
        email: investorForm.email,
        phone: investorForm.phone,
        budget: investorForm.budget,
        interest: investorForm.interest,
        message: investorForm.message,
        status: "New",
      });

      if (error) {
        console.error(error);
        showSuccess("Unable to submit investor request. Check database.");
        return;
      }
    } else {
      setInvestorRequests((current) => [
        { ...newRequest, id: Date.now() },
        ...current,
      ]);
    }

    setInvestorForm({
      name: "",
      email: "",
      phone: "",
      budget: "",
      interest: "Residential",
      message: "",
    });

    setModal(null);
    showSuccess("Investor request saved. INAMAAD will contact you shortly.");
  }

  async function submitPropertyInquiry(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedListing) return;

    const newInquiry: Omit<PropertyInquiry, "id"> = {
      listingId: selectedListing.id,
      listingTitle: selectedListing.title,
      name: inquiryForm.name,
      email: inquiryForm.email,
      phone: inquiryForm.phone,
      message: inquiryForm.message,
      status: "New",
      createdAt: new Date().toISOString(),
    };

    if (supabase) {
      const { error } = await supabase.from("property_inquiries").insert({
        listing_id: selectedListing.id,
        listing_title: selectedListing.title,
        name: inquiryForm.name,
        email: inquiryForm.email || null,
        phone: inquiryForm.phone,
        message: inquiryForm.message,
      });

      if (error) {
        console.error(error);
        showSuccess("Unable to submit inquiry. Check database settings.");
        return;
      }
    } else {
      setPropertyInquiries((current) => [
        { ...newInquiry, id: Date.now() },
        ...current,
      ]);
    }

    setInquiryForm({ name: "", email: "", phone: "", message: "" });
    setModal(null);
    showSuccess("Inquiry sent. INAMAAD will contact you shortly.");
  }

  async function submitInspectionBooking(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedListing) return;

    const newBooking: Omit<InspectionBooking, "id"> = {
      listingId: selectedListing.id,
      listingTitle: selectedListing.title,
      name: inspectionForm.name,
      email: inspectionForm.email,
      phone: inspectionForm.phone,
      preferredDate: inspectionForm.preferredDate,
      preferredTime: inspectionForm.preferredTime,
      message: inspectionForm.message,
      status: "New",
      createdAt: new Date().toISOString(),
    };

    if (supabase) {
      const { error } = await supabase.from("inspection_bookings").insert({
        listing_id: selectedListing.id,
        listing_title: selectedListing.title,
        name: inspectionForm.name,
        email: inspectionForm.email || null,
        phone: inspectionForm.phone,
        preferred_date: inspectionForm.preferredDate || null,
        preferred_time: inspectionForm.preferredTime || null,
        message: inspectionForm.message || null,
        status: "New",
      });

      if (error) {
        console.error(error);
        showSuccess("Unable to book inspection. Check database settings.");
        return;
      }
    } else {
      setInspectionBookings((current) => [
        { ...newBooking, id: Date.now() },
        ...current,
      ]);
    }

    setInspectionForm({
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
    });
    showSuccess("Inspection booking sent. INAMAAD will confirm your appointment.");
  }

  async function submitContactMessage(event: React.FormEvent) {
    event.preventDefault();

    const newMessage: Omit<ContactMessage, "id"> = {
      ...contactForm,
      status: "New",
      createdAt: new Date().toISOString(),
    };

    if (supabase) {
      const { error } = await supabase.from("contact_messages").insert({
        name: contactForm.name,
        email: contactForm.email || null,
        phone: contactForm.phone || null,
        subject: contactForm.subject || "General enquiry",
        message: contactForm.message,
        status: "New",
      });

      if (error) {
        console.error(error);
        showSuccess("Unable to send contact message. Check database settings.");
        return;
      }
    } else {
      setContactMessages((current) => [
        { ...newMessage, id: Date.now() },
        ...current,
      ]);
    }

    setContactForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    showSuccess("Contact message sent. INAMAAD will reply shortly.");
  }

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();

    if (!supabase) {
      setModal(null);
      showSuccess("Demo sign in completed.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: signInForm.email,
      password: signInForm.password,
    });

    if (error) {
      showSuccess(error.message);
      return;
    }

    setSignInForm({ email: "", password: "" });
    setModal(null);
    showSuccess("Signed in successfully.");
  }

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();

    if (!supabase) {
      setModal(null);
      showSuccess("Demo account created.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: registerForm.email,
      password: registerForm.password,
      options: {
        data: {
          full_name: registerForm.name,
        },
      },
    });

    if (error) {
      showSuccess(error.message);
      return;
    }

    setRegisterForm({ name: "", email: "", password: "" });
    setModal(null);
    showSuccess("Account created. Check your email if confirmation is required.");
  }

  async function unlockAdmin(event: React.FormEvent) {
    event.preventDefault();

    if (!supabase) {
      if (adminPassword === LOCAL_ADMIN_PASSWORD) {
        setAdminUnlocked(true);
        setAdminPassword("");
      } else {
        showSuccess("Wrong admin password.");
      }

      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (error) {
      showSuccess(error.message);
      return;
    }

    setAdminPassword("");
    await checkAdminAccess();
  }

  async function logoutAdmin() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setAdminUnlocked(false);
    setUser(null);
    setInvestorRequests([]);
    setPropertyInquiries([]);
    setPropertyViews([]);
    setContactMessages([]);
    setInspectionBookings([]);
    showSuccess("Staff signed out.");
  }

  async function approveListing(id: number) {
    if (supabase) {
      const { error } = await supabase
        .from("listings")
        .update({ status: "Verified" })
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to approve listing.");
        return;
      }

      await loadDatabaseListings();
    } else {
      setListings((current) =>
        current.map((listing) =>
          listing.id === id ? { ...listing, status: "Verified" } : listing
        )
      );
    }

    showSuccess("Listing approved.");
  }

  async function deleteListing(id: number) {
    if (supabase) {
      const { error } = await supabase.from("listings").delete().eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to delete listing.");
        return;
      }

      await loadDatabaseListings();
    } else {
      setListings((current) => current.filter((listing) => listing.id !== id));
    }

    showSuccess("Listing deleted.");
  }

  async function updateInvestorRequestStatus(id: number, status: LeadStatus) {
    if (supabase) {
      const { error } = await supabase
        .from("investor_requests")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to update investor request status.");
        return;
      }

      await loadDatabaseInvestorRequests();
    } else {
      setInvestorRequests((current) =>
        current.map((request) =>
          request.id === id ? { ...request, status } : request
        )
      );
    }

    showSuccess(`Investor request marked as ${status}.`);
  }

  async function updatePropertyInquiryStatus(id: number, status: LeadStatus) {
    if (supabase) {
      const { error } = await supabase
        .from("property_inquiries")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to update property inquiry status.");
        return;
      }

      await loadDatabasePropertyInquiries();
    } else {
      setPropertyInquiries((current) =>
        current.map((inquiry) =>
          inquiry.id === id ? { ...inquiry, status } : inquiry
        )
      );
    }

    showSuccess(`Property inquiry marked as ${status}.`);
  }

  async function deleteInvestorRequest(id: number) {
    if (supabase) {
      const { error } = await supabase
        .from("investor_requests")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to delete investor request.");
        return;
      }

      await loadDatabaseInvestorRequests();
    } else {
      setInvestorRequests((current) =>
        current.filter((request) => request.id !== id)
      );
    }

    showSuccess("Investor request removed.");
  }

  async function deletePropertyInquiry(id: number) {
    if (supabase) {
      const { error } = await supabase
        .from("property_inquiries")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to delete property inquiry.");
        return;
      }

      await loadDatabasePropertyInquiries();
    } else {
      setPropertyInquiries((current) =>
        current.filter((inquiry) => inquiry.id !== id)
      );
    }

    showSuccess("Property inquiry removed.");
  }

  async function updateContactMessageStatus(id: number, status: LeadStatus) {
    if (supabase) {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to update contact message status.");
        return;
      }

      await loadDatabaseContactMessages();
    } else {
      setContactMessages((current) =>
        current.map((message) =>
          message.id === id ? { ...message, status } : message
        )
      );
    }

    showSuccess(`Contact message marked as ${status}.`);
  }

  async function deleteContactMessage(id: number) {
    if (supabase) {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to delete contact message.");
        return;
      }

      await loadDatabaseContactMessages();
    } else {
      setContactMessages((current) =>
        current.filter((message) => message.id !== id)
      );
    }

    showSuccess("Contact message removed.");
  }

  async function updateInspectionBookingStatus(id: number, status: InspectionStatus) {
    if (supabase) {
      const { error } = await supabase
        .from("inspection_bookings")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to update inspection booking status.");
        return;
      }

      await loadDatabaseInspectionBookings();
    } else {
      setInspectionBookings((current) =>
        current.map((booking) =>
          booking.id === id ? { ...booking, status } : booking
        )
      );
    }

    showSuccess(`Inspection booking marked as ${status}.`);
  }

  async function deleteInspectionBooking(id: number) {
    if (supabase) {
      const { error } = await supabase
        .from("inspection_bookings")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to delete inspection booking.");
        return;
      }

      await loadDatabaseInspectionBookings();
    } else {
      setInspectionBookings((current) =>
        current.filter((booking) => booking.id !== id)
      );
    }

    showSuccess("Inspection booking removed.");
  }


  function escapeCsvValue(value: unknown) {
    const text = String(value ?? "");

    if (/[",\n\r]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
  }

  function downloadCsv(filename: string, headers: string[], rows: unknown[][]) {
    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    showSuccess(`${filename} downloaded.`);
  }

  function exportListingsCsv() {
    downloadCsv(
      "inamaad-listings.csv",
      [
        "ID",
        "Title",
        "Location",
        "Price",
        "Numeric Value",
        "Type",
        "Category",
        "Yield / Highlight",
        "Description",
        "Status",
        "Owner Name",
        "Owner Phone",
        "Image URL",
        "Created At",
      ],
      listings.map((listing) => [
        listing.id,
        listing.title,
        listing.location,
        listing.price,
        listing.value,
        listing.type,
        listing.category,
        listing.yieldText,
        listing.description,
        listing.status,
        listing.ownerName || "",
        listing.ownerPhone || "",
        listing.imageUrl || "",
        listing.createdAt || "",
      ])
    );
  }

  function exportInvestorRequestsCsv() {
    downloadCsv(
      "inamaad-investor-requests.csv",
      [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Budget",
        "Interest",
        "Status",
        "Message",
        "Created At",
      ],
      investorRequests.map((request) => [
        request.id,
        request.name,
        request.email,
        request.phone,
        request.budget,
        request.interest,
        request.status || "New",
        request.message || "",
        request.createdAt,
      ])
    );
  }

  function exportPropertyInquiriesCsv() {
    downloadCsv(
      "inamaad-property-inquiries.csv",
      [
        "ID",
        "Listing ID",
        "Listing Title",
        "Name",
        "Email",
        "Phone",
        "Status",
        "Message",
        "Created At",
      ],
      propertyInquiries.map((inquiry) => [
        inquiry.id,
        inquiry.listingId || "",
        inquiry.listingTitle,
        inquiry.name,
        inquiry.email || "",
        inquiry.phone,
        inquiry.status || "New",
        inquiry.message || "",
        inquiry.createdAt,
      ])
    );
  }

  function exportContactMessagesCsv() {
    downloadCsv(
      "inamaad-contact-messages.csv",
      [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Subject",
        "Status",
        "Message",
        "Created At",
      ],
      contactMessages.map((message) => [
        message.id,
        message.name,
        message.email || "",
        message.phone || "",
        message.subject || "General enquiry",
        message.status || "New",
        message.message || "",
        message.createdAt,
      ])
    );
  }

  function exportInspectionBookingsCsv() {
    downloadCsv(
      "inamaad-inspection-bookings.csv",
      [
        "ID",
        "Listing ID",
        "Listing Title",
        "Name",
        "Email",
        "Phone",
        "Preferred Date",
        "Preferred Time",
        "Status",
        "Message",
        "Created At",
      ],
      inspectionBookings.map((booking) => [
        booking.id,
        booking.listingId || "",
        booking.listingTitle,
        booking.name,
        booking.email || "",
        booking.phone,
        booking.preferredDate || "",
        booking.preferredTime || "",
        booking.status || "New",
        booking.message || "",
        booking.createdAt,
      ])
    );
  }

  function exportPropertyViewsCsv() {
    downloadCsv(
      "inamaad-property-views.csv",
      ["ID", "Listing ID", "Listing Title", "Viewed At"],
      propertyViews.map((view) => [
        view.id,
        view.listingId,
        view.listingTitle,
        view.viewedAt,
      ])
    );
  }

  function exportBusinessReportCsv() {
    downloadCsv(
      "inamaad-business-report.csv",
      ["Metric", "Value"],
      [
        ["Total listings", listings.length],
        ["Verified listings", verifiedListings.length],
        ["Pending listings", pendingListings.length],
        ["Total property value", totalPropertyValue],
        ["Verified property value", verifiedPropertyValue],
        ["Investor requests", investorRequests.length],
        ["Property inquiries", propertyInquiries.length],
        ["Contact messages", contactMessages.length],
        ["Inspection bookings", inspectionBookings.length],
        ["Property views", totalPropertyViews],
        ["Most viewed property", mostViewedProperty],
        ["Most viewed property count", mostViewedPropertyCount],
        ["Total leads", totalLeads],
        ["Top location", topLocation],
        ["Top location listing count", topLocationCount],
        ["Top asset type", topType],
        ["Top asset type listing count", topTypeCount],
        ["Generated at", new Date().toISOString()],
      ]
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <datalist id="nigeria-location-options">
        {nigeriaLocationLabels.map((location) => (
          <option key={location} value={location} />
        ))}
      </datalist>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#e9edf3]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0d1c38] text-xl font-black text-[#f0bf3c] shadow-sm">
              I
            </div>

            <div>
              <div className="text-[15px] font-black uppercase tracking-wide text-[#0d1c38]">
                INAMAAD
              </div>
              <div className="text-xs text-slate-500">
                Real Estate Enterprise
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-lg font-medium transition ${
                  index === 0
                    ? "rounded-xl bg-white px-5 py-3 text-[#0d1c38] shadow-sm"
                    : "text-slate-600 hover:text-[#0d1c38]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <button
              onClick={() => setModal("signin")}
              className="text-lg font-medium text-slate-700 hover:text-[#0d1c38]"
            >
              Sign In
            </button>

            <button
              onClick={() => setModal("investor")}
              className="rounded-xl bg-[#0d1c38] px-6 py-3 text-lg font-semibold text-white shadow-sm transition hover:bg-[#13284f]"
            >
              Get Started
            </button>
          </div>

          <button
            onClick={() => setMobileOpen((current) => !current)}
            className="rounded-xl bg-[#0d1c38] px-4 py-3 text-sm font-bold text-white lg:hidden"
          >
            Menu
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-5 lg:hidden">
            <div className="grid gap-4 text-sm font-semibold text-slate-700">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              <button
                onClick={() => {
                  setMobileOpen(false);
                  setModal("investor");
                }}
                className="rounded-xl bg-[#0d1c38] px-5 py-3 text-left font-black text-white"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#0d1c38]">
          <div
            className="absolute inset-0 bg-cover bg-left-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(13,28,56,0.78), rgba(13,28,56,0.78)), url('/hero-building.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(240,191,60,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_35%)]" />

          <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-14">
            <div className="max-w-5xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-[3px] w-14 bg-[#f0bf3c]" />
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f0bf3c] sm:text-sm">
                  Nigeria’s premier platform
                </p>
              </div>

              <h1 className="max-w-3xl text-3xl font-black leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[44px]">
                Connecting Property,
                <br />
                <span className="text-[#f0bf3c]">Land</span>, Investors
                <br />& Opportunities
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                Discover verified properties, joint venture deals, and
                investment opportunities across Nigeria. Buy, sell, and invest
                with confidence.
              </p>

              <div className="mt-8 max-w-6xl rounded-[24px] bg-white p-4 shadow-2xl">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    type="text"
                    placeholder="Search properties..."
                    className="h-14 rounded-2xl border border-slate-200 px-5 text-base outline-none transition focus:border-[#0d1c38]"
                  />

                  <select
                    value={propertyType}
                    onChange={(event) => setPropertyType(event.target.value)}
                    className="h-14 rounded-2xl border border-slate-200 px-5 text-base outline-none transition focus:border-[#0d1c38]"
                  >
                    <option>All</option>
                    <option>Residential</option>
                    <option>Land</option>
                    <option>Commercial</option>
                    <option>Joint Venture</option>
                  </select>

                  <select
                    value={locationFilter}
                    onChange={(event) => setLocationFilter(event.target.value)}
                    className="h-14 rounded-2xl border border-slate-200 px-5 text-base outline-none transition focus:border-[#0d1c38]"
                  >
                    <option value="All Locations">All Locations</option>
                    {nigeriaLocationOptions.map((location) => (
                      <option key={location.label} value={location.value}>
                        {location.label}
                      </option>
                    ))}
                  </select>

                  <a
                    href="#properties"
                    className="flex h-14 items-center justify-center rounded-2xl bg-[#0d1c38] px-6 text-lg font-semibold text-white transition hover:bg-[#13284f]"
                  >
                    Search
                  </a>
                </div>
              </div>

              {!usesDatabase && (
                <p className="mt-4 text-xs font-semibold text-slate-300">
                  Database not connected yet. Forms will use local demo storage until Supabase environment variables are added.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 lg:grid-cols-4 lg:px-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 text-4xl font-black text-[#0d1c38] lg:text-5xl">
                  {stat.value}
                </div>

                <div className="text-base font-medium text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#f7f8fb] px-6 py-16 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            {categoryCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff5d7] text-2xl font-black text-[#d39b19]">
                  I
                </div>

                <h3 className="text-2xl font-black text-[#0d1c38]">
                  {card.title}
                </h3>

                <p className="mt-4 text-base leading-7 text-slate-600">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="properties" className="bg-[#f7f8fb] px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-[3px] w-14 bg-[#f0bf3c]" />
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#d39b19]">
                    Featured opportunities
                  </p>
                </div>

                <h2 className="max-w-3xl text-4xl font-black tracking-tight text-[#0d1c38] md:text-6xl">
                  Explore verified properties and investment deals.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  Browse premium homes, land, commercial assets, and joint
                  venture opportunities reviewed for serious investors.
                </p>
              </div>

              <button
                onClick={() => setModal("post")}
                className="w-fit rounded-2xl bg-[#0d1c38] px-7 py-4 text-base font-bold text-white shadow-sm transition hover:bg-[#13284f]"
              >
                Submit Property
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {[
                "All",
                "Residential",
                "Land",
                "Commercial",
                "Joint Venture",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setPropertyType(item)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                    propertyType === item
                      ? "border-[#0d1c38] bg-[#0d1c38] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#0d1c38] hover:text-[#0d1c38]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[#d39b19]">
                    Advanced search
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {filteredListings.length} verified result{filteredListings.length === 1 ? "" : "s"} found
                  </p>
                </div>

                <button
                  onClick={() => {
                    setQuery("");
                    setPropertyType("All");
                    setLocationFilter("All Locations");
                    setMinValueFilter("");
                    setMaxValueFilter("");
                    setSortMode("Newest");
                  }}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-[#0d1c38] transition hover:border-[#0d1c38]"
                >
                  Clear filters
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="text"
                  placeholder="Search title, location, type..."
                  className="h-14 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#0d1c38] lg:col-span-2"
                />

                <input
                  value={minValueFilter}
                  onChange={(event) => setMinValueFilter(event.target.value)}
                  type="number"
                  min="0"
                  placeholder="Min value"
                  className="h-14 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#0d1c38]"
                />

                <input
                  value={maxValueFilter}
                  onChange={(event) => setMaxValueFilter(event.target.value)}
                  type="number"
                  min="0"
                  placeholder="Max value"
                  className="h-14 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#0d1c38]"
                />

                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value)}
                  className="h-14 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#0d1c38]"
                >
                  <option>Newest</option>
                  <option>Price High to Low</option>
                  <option>Price Low to High</option>
                  <option>Title A-Z</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="mt-12 rounded-[28px] bg-white p-8 text-center font-bold text-slate-500">
                Loading listings...
              </div>
            ) : (
              <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredListings.map((listing) => (
                  <article
                    key={listing.id}
                    className={`group overflow-hidden rounded-[28px] border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                      listing.featured ? "border-[#f0bf3c] shadow-xl ring-2 ring-[#f0bf3c]/30" : "border-slate-200"
                    }`}
                  >
                    <div className="relative h-72 overflow-hidden bg-[#0d1c38]">
                      {listing.imageUrl ? (
                        <img
                          src={listing.imageUrl}
                          alt={listing.title}
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1c38] via-[#1b3157] to-[#9b6b16]" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(240,191,60,0.35),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_34%)]" />
                        </>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c38]/95 via-[#0d1c38]/45 to-[#0d1c38]/10" />

                      <div className="relative z-10 flex h-full flex-col justify-between p-7 text-white">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-wrap gap-2">
                            <div className="rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide backdrop-blur">
                              {listing.type}
                            </div>

                            {listing.featured && (
                              <div className="rounded-full bg-[#f0bf3c] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#0d1c38] shadow-lg">
                                Featured
                              </div>
                            )}
                          </div>

                          <div className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-black text-white">
                            {listing.status}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f0bf3c]">
                            {listing.featured ? "INAMAAD premium featured asset" : "INAMAAD verified asset"}
                          </p>
                          <h3 className="mt-3 max-w-sm text-3xl font-black leading-tight">
                            {listing.title}
                          </h3>
                          <p className="mt-3 text-base font-medium text-slate-200">
                            {listing.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-7">
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-sm font-bold text-slate-500">
                            Starting price
                          </p>
                          <p className="mt-1 text-3xl font-black text-[#0d1c38]">
                            {listing.price}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#fff6dc] px-4 py-3 text-right">
                          <p className="text-xs font-bold text-slate-500">
                            Type
                          </p>
                          <p className="text-sm font-black text-[#9b6b16]">
                            {listing.category}
                          </p>
                        </div>
                      </div>

                      <p className="mt-5 min-h-[72px] text-base leading-7 text-slate-600">
                        {listing.description}
                      </p>

                      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                        <p className="text-sm font-bold text-slate-500">
                          Investment highlight
                        </p>
                        <p className="mt-2 text-base font-black text-[#0d1c38]">
                          {listing.yieldText}
                        </p>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                          onClick={() => openListing(listing)}
                          className="flex items-center justify-center rounded-2xl bg-[#0d1c38] px-5 py-4 text-base font-bold text-white transition hover:bg-[#13284f]"
                        >
                          View Details
                        </button>

                        <button
                          onClick={() => shareListing(listing)}
                          className="flex items-center justify-center rounded-2xl border border-[#0d1c38] bg-white px-5 py-4 text-base font-black text-[#0d1c38] transition hover:bg-slate-50"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="process" className="bg-white px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-[3px] w-14 bg-[#f0bf3c]" />
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#d39b19]">
                  How it works
                </p>
              </div>

              <h2 className="text-4xl font-black tracking-tight text-[#0d1c38] md:text-6xl">
                A cleaner way to find real estate opportunities.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                INAMAAD is built to make property discovery, investor matching,
                and opportunity submission more structured and professional.
              </p>
            </div>

            <div className="mt-12 grid gap-7 md:grid-cols-3">
              {processSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[28px] border border-slate-200 bg-[#f7f8fb] p-8"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0d1c38] text-lg font-black text-[#f0bf3c]">
                    0{index + 1}
                  </div>

                  <h3 className="mt-8 text-2xl font-black text-[#0d1c38]">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-base leading-7 text-slate-600">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="bg-[#f7f8fb] px-6 py-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="relative overflow-hidden rounded-[32px] bg-[#0d1c38] p-10 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(240,191,60,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.15),transparent_35%)]" />

              <div className="relative">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#f0bf3c]">
                  Verification first
                </p>

                <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
                  Built for serious investors, not random property adverts.
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-200">
                  INAMAAD is designed to help investors, developers, landowners,
                  and property sellers connect through a more trusted and
                  structured marketplace.
                </p>

                <div className="mt-8 grid gap-4">
                  {verificationItems.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-white/10 p-5 text-base font-bold backdrop-blur"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-[3px] w-14 bg-[#f0bf3c]" />
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#d39b19]">
                  About INAMAAD
                </p>
              </div>

              <h2 className="text-4xl font-black tracking-tight text-[#0d1c38] md:text-6xl">
                Real estate opportunities with stronger clarity.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                The goal of INAMAAD is to become a trusted marketplace for
                verified homes, land, commercial property, and joint venture
                opportunities across Nigeria.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-3xl font-black text-[#0d1c38]">Fast</p>
                  <p className="mt-3 text-slate-600">
                    Search and filter opportunities quickly.
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-3xl font-black text-[#0d1c38]">Trusted</p>
                  <p className="mt-3 text-slate-600">
                    Listings are reviewed before public approval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="jv" className="bg-[#0d1c38] px-6 py-20 text-white lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-[3px] w-14 bg-[#f0bf3c]" />
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f0bf3c]">
                  Joint venture deals
                </p>
              </div>

              <h2 className="text-4xl font-black tracking-tight md:text-6xl">
                Connect landowners, investors, and developers.
              </h2>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
                INAMAAD helps structure discovery for joint venture
                opportunities, where landowners, developers, and investors can
                find better-fit partnerships.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => setModal("post")}
                  className="rounded-2xl bg-[#f0bf3c] px-7 py-4 text-base font-black text-[#0d1c38] hover:bg-[#ffd45a]"
                >
                  Submit JV Deal
                </button>

                <button
                  onClick={() => setModal("investor")}
                  className="rounded-2xl border border-white/20 px-7 py-4 text-base font-black text-white hover:bg-white/10"
                >
                  Investor Access
                </button>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur">
              <div className="rounded-[24px] bg-white p-7 text-[#0d1c38]">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#d39b19]">
                  JV Profile
                </p>

                <div className="mt-6 grid gap-4">
                  {[
                    ["Landowners", "Submit land for development"],
                    ["Developers", "Find JV-ready land opportunities"],
                    ["Investors", "Join structured real estate projects"],
                    ["Market", "Lagos, Abuja, and emerging corridors"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-5 rounded-2xl bg-[#f7f8fb] p-5"
                    >
                      <p className="text-sm font-bold text-slate-500">
                        {label}
                      </p>
                      <p className="text-right text-sm font-black text-[#0d1c38]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="investors" className="bg-white px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[32px] bg-[#f7f8fb] p-8 md:p-12">
              <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-[3px] w-14 bg-[#f0bf3c]" />
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#d39b19]">
                      Investors
                    </p>
                  </div>

                  <h2 className="max-w-3xl text-4xl font-black tracking-tight text-[#0d1c38] md:text-6xl">
                    Access deals that match your capital and strategy.
                  </h2>

                  <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                    Tell INAMAAD your preferred location, budget, and
                    investment interest. Your request is saved for admin review
                    and follow-up.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                  <button
                    onClick={() => setModal("investor")}
                    className="rounded-2xl bg-[#0d1c38] px-7 py-4 text-base font-black text-white hover:bg-[#13284f]"
                  >
                    Request Investor Access
                  </button>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20INAMAAD%20Real%20Estate%2C%20I%20want%20to%20speak%20about%20property%20investment.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-slate-300 px-7 py-4 text-center text-base font-black text-[#0d1c38] hover:border-[#0d1c38]"
                  >
                    Speak on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#0d1c38] px-6 py-20 text-white lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-[3px] w-14 bg-[#f0bf3c]" />
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f0bf3c]">
                    Contact
                  </p>
                </div>

                <h2 className="text-4xl font-black tracking-tight md:text-6xl">
                  Ready to invest or submit a real estate opportunity?
                </h2>

                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
                  Start with investor access, submit your property, or contact
                  INAMAAD directly on WhatsApp.
                </p>
              </div>

              <form
                onSubmit={submitContactMessage}
                className="rounded-[2rem] bg-white p-6 text-[#0d1c38] shadow-2xl shadow-black/20"
              >
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d49613]">
                  Send message
                </p>
                <h3 className="mt-2 text-2xl font-black">Contact INAMAAD</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Messages from this form are saved directly inside your staff portal.
                </p>

                <div className="mt-5 grid gap-3">
                  <input
                    required
                    value={contactForm.name}
                    onChange={(event) =>
                      setContactForm({ ...contactForm, name: event.target.value })
                    }
                    placeholder="Full name"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(event) =>
                        setContactForm({ ...contactForm, email: event.target.value })
                      }
                      placeholder="Email optional"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={contactForm.phone}
                      onChange={(event) =>
                        setContactForm({ ...contactForm, phone: event.target.value })
                      }
                      placeholder="Phone or WhatsApp"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </div>

                  <input
                    value={contactForm.subject}
                    onChange={(event) =>
                      setContactForm({ ...contactForm, subject: event.target.value })
                    }
                    placeholder="Subject e.g. Property investment"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <textarea
                    required
                    value={contactForm.message}
                    onChange={(event) =>
                      setContactForm({ ...contactForm, message: event.target.value })
                    }
                    placeholder="Write your message"
                    rows={4}
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <button className="rounded-2xl bg-[#f0bf3c] px-7 py-4 text-sm font-black text-[#0d1c38] hover:bg-[#ffd45a]">
                    Send message
                  </button>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-slate-200 px-7 py-4 text-center text-sm font-black text-[#0d1c38] hover:border-[#0d1c38]"
                  >
                    Or WhatsApp: +{WHATSAPP_NUMBER}
                  </a>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[#f7f8fb] px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#d39b19]">
                FAQ
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-[#0d1c38] md:text-6xl">
                Common questions
              </h2>
            </div>

            <div className="mt-12 grid gap-5">
              {faqItems.map((item) => (
                <div
                  key={item.question}
                  className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm"
                >
                  <h3 className="text-xl font-black text-[#0d1c38]">
                    {item.question}
                  </h3>

                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-6 py-10 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0d1c38] text-xl font-black text-[#f0bf3c]">
                I
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-wide text-[#0d1c38]">
                  INAMAAD
                </p>
                <p className="text-xs text-slate-500">
                  Real Estate Enterprise
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
              A real estate marketplace for verified property, land, commercial
              assets, investors, and joint venture opportunities.
            </p>
          </div>

          <div>
            <p className="font-black text-[#0d1c38]">Company</p>

            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <a href="#properties">Properties</a>
              <a href="#jv">JV Deals</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
          </div>

          <div>
            <p className="font-black text-[#0d1c38]">Access</p>

            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <button
                onClick={() => setModal("signin")}
                className="w-fit text-left"
              >
                Sign In
              </button>

              <button
                onClick={() => setModal("investor")}
                className="w-fit text-left"
              >
                Investor Access
              </button>

              <button
                onClick={() => {
                  setAdminPassword("");
                  setModal("admin");
                }}
                className="w-fit text-left text-xs text-slate-400 hover:text-slate-700"
              >
                Staff portal
              </button>
            </div>
          </div>
        </div>
      </footer>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20INAMAAD%20Real%20Estate%2C%20I%20am%20interested%20in%20your%20verified%20property%20investment%20opportunities.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with INAMAAD on WhatsApp"
        className="fixed bottom-6 right-6 z-[120] flex items-center gap-3 rounded-full bg-green-500 px-5 py-4 text-white shadow-2xl hover:bg-green-600"
      >
        <span className="text-sm font-black">WA</span>
        <span className="hidden text-sm font-black sm:inline">WhatsApp</span>
      </a>

      {successMessage && (
        <div className="fixed left-1/2 top-24 z-[130] w-[90%] max-w-md -translate-x-1/2 rounded-2xl bg-[#0d1c38] px-5 py-4 text-center text-sm font-bold text-white shadow-2xl">
          {successMessage}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[30px] bg-white p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d39b19]">
                  INAMAAD
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#0d1c38]">
                  {modal === "signin" && "Sign in"}
                  {modal === "register" && "Create account"}
                  {modal === "post" && "Submit opportunity"}
                  {modal === "investor" && "Request investor access"}
                  {modal === "admin" && "Staff portal"}
                  {modal === "edit" && "Edit listing"}
                  {modal === "details" && selectedListing?.title}
                </h2>
              </div>

              <button
                onClick={() => {
                  setModal(null);
                  setSelectedListing(null);
                  setEditingListing(null);
                }}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            {modal === "signin" && (
              <form onSubmit={handleSignIn} className="grid gap-4">
                <input
                  required
                  type="email"
                  value={signInForm.email}
                  onChange={(event) =>
                    setSignInForm({ ...signInForm, email: event.target.value })
                  }
                  placeholder="Email address"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <input
                  required
                  type="password"
                  value={signInForm.password}
                  onChange={(event) =>
                    setSignInForm({
                      ...signInForm,
                      password: event.target.value,
                    })
                  }
                  placeholder="Password"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <button className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white">
                  Sign in
                </button>

                <button
                  type="button"
                  onClick={() => setModal("register")}
                  className="text-sm font-bold text-slate-500"
                >
                  Create a new account
                </button>
              </form>
            )}

            {modal === "register" && (
              <form onSubmit={handleRegister} className="grid gap-4">
                <input
                  required
                  value={registerForm.name}
                  onChange={(event) =>
                    setRegisterForm({
                      ...registerForm,
                      name: event.target.value,
                    })
                  }
                  placeholder="Full name"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <input
                  required
                  type="email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm({
                      ...registerForm,
                      email: event.target.value,
                    })
                  }
                  placeholder="Email address"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <input
                  required
                  type="password"
                  value={registerForm.password}
                  onChange={(event) =>
                    setRegisterForm({
                      ...registerForm,
                      password: event.target.value,
                    })
                  }
                  placeholder="Password"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <button className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white">
                  Create account
                </button>
              </form>
            )}

            {modal === "post" && (
              <form onSubmit={submitListing} className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    value={postForm.title}
                    onChange={(event) =>
                      setPostForm({ ...postForm, title: event.target.value })
                    }
                    placeholder="Property title"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <input
                    required
                    list="nigeria-location-options"
                    value={postForm.location}
                    onChange={(event) =>
                      setPostForm({
                        ...postForm,
                        location: event.target.value,
                      })
                    }
                    placeholder="State/FCT or city, e.g. Lagos or FCT Abuja"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    value={postForm.price}
                    onChange={(event) =>
                      setPostForm({ ...postForm, price: event.target.value })
                    }
                    placeholder="Price, e.g. ₦50,000,000"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <select
                    value={postForm.type}
                    onChange={(event) =>
                      setPostForm({ ...postForm, type: event.target.value })
                    }
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  >
                    <option>Residential</option>
                    <option>Land</option>
                    <option>Commercial</option>
                    <option>Joint Venture</option>
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <select
                    value={postForm.category}
                    onChange={(event) =>
                      setPostForm({
                        ...postForm,
                        category: event.target.value,
                      })
                    }
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  >
                    <option>For Sale</option>
                    <option>Investment</option>
                    <option>JV</option>
                    <option>Land Banking</option>
                    <option>Short-let</option>
                  </select>

                  <input
                    value={postForm.yieldText}
                    onChange={(event) =>
                      setPostForm({
                        ...postForm,
                        yieldText: event.target.value,
                      })
                    }
                    placeholder="Investment highlight"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />
                </div>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                  <label className="text-sm font-black text-[#0d1c38]">
                    Property image
                  </label>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Upload one clear JPG, PNG, or WEBP image. Maximum 5MB.
                  </p>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) =>
                      setPostImageFile(event.target.files?.[0] || null)
                    }
                    className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  {postImageFile && (
                    <p className="mt-3 text-xs font-bold text-emerald-700">
                      Selected: {postImageFile.name}
                    </p>
                  )}
                </div>

                <textarea
                  required
                  value={postForm.description}
                  onChange={(event) =>
                    setPostForm({
                      ...postForm,
                      description: event.target.value,
                    })
                  }
                  placeholder="Describe the opportunity"
                  rows={4}
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value={postForm.ownerName}
                    onChange={(event) =>
                      setPostForm({
                        ...postForm,
                        ownerName: event.target.value,
                      })
                    }
                    placeholder="Owner/developer name"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <input
                    value={postForm.ownerPhone}
                    onChange={(event) =>
                      setPostForm({
                        ...postForm,
                        ownerPhone: event.target.value,
                      })
                    }
                    placeholder="Phone number"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />
                </div>

                <button
                  disabled={isLoading}
                  className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Submitting..." : "Submit for admin review"}
                </button>
              </form>
            )}

            {modal === "edit" && editingListing && (
              <form onSubmit={submitEditListing} className="grid gap-4">
                <div className="rounded-2xl bg-[#f7f8fb] p-5 text-sm text-slate-600">
                  Editing: <span className="font-black text-[#0d1c38]">{editingListing.title}</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    value={editForm.title}
                    onChange={(event) =>
                      setEditForm({ ...editForm, title: event.target.value })
                    }
                    placeholder="Property title"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <input
                    required
                    list="nigeria-location-options"
                    value={editForm.location}
                    onChange={(event) =>
                      setEditForm({ ...editForm, location: event.target.value })
                    }
                    placeholder="State/FCT or city, e.g. Lagos or FCT Abuja"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    value={editForm.price}
                    onChange={(event) =>
                      setEditForm({ ...editForm, price: event.target.value })
                    }
                    placeholder="Price, e.g. ₦50,000,000"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <select
                    value={editForm.type}
                    onChange={(event) =>
                      setEditForm({ ...editForm, type: event.target.value })
                    }
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  >
                    <option>Residential</option>
                    <option>Land</option>
                    <option>Commercial</option>
                    <option>Joint Venture</option>
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <select
                    value={editForm.category}
                    onChange={(event) =>
                      setEditForm({ ...editForm, category: event.target.value })
                    }
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  >
                    <option>For Sale</option>
                    <option>Investment</option>
                    <option>JV</option>
                    <option>Land Banking</option>
                    <option>Short-let</option>
                  </select>

                  <select
                    value={editForm.status}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        status: event.target.value as ListingStatus,
                      })
                    }
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  >
                    <option>Verified</option>
                    <option>Pending Review</option>
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-5 py-4 text-sm font-black text-[#0d1c38]">
                    <input
                      type="checkbox"
                      checked={editForm.featured}
                      onChange={(event) =>
                        setEditForm({ ...editForm, featured: event.target.checked })
                      }
                      className="h-5 w-5 accent-[#d4a017]"
                    />
                    Mark as featured / premium
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={editForm.featuredRank}
                    onChange={(event) =>
                      setEditForm({ ...editForm, featuredRank: event.target.value })
                    }
                    placeholder="Featured rank, e.g. 10"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />
                </div>

                <input
                  value={editForm.yieldText}
                  onChange={(event) =>
                    setEditForm({ ...editForm, yieldText: event.target.value })
                  }
                  placeholder="Investment highlight"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                  <label className="text-sm font-black text-[#0d1c38]">
                    Replace property image
                  </label>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Leave empty to keep the current image. Upload JPG, PNG, or WEBP under 5MB.
                  </p>

                  {editForm.imageUrl && !editImageFile && (
                    <img
                      src={editForm.imageUrl}
                      alt={editForm.title}
                      className="mt-4 h-36 w-full rounded-2xl object-cover"
                    />
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) =>
                      setEditImageFile(event.target.files?.[0] || null)
                    }
                    className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  {editImageFile && (
                    <p className="mt-3 text-xs font-bold text-emerald-700">
                      New image selected: {editImageFile.name}
                    </p>
                  )}
                </div>

                <textarea
                  required
                  value={editForm.description}
                  onChange={(event) =>
                    setEditForm({ ...editForm, description: event.target.value })
                  }
                  placeholder="Describe the opportunity"
                  rows={4}
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value={editForm.ownerName}
                    onChange={(event) =>
                      setEditForm({ ...editForm, ownerName: event.target.value })
                    }
                    placeholder="Owner/developer name"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <input
                    value={editForm.ownerPhone}
                    onChange={(event) =>
                      setEditForm({ ...editForm, ownerPhone: event.target.value })
                    }
                    placeholder="Phone number"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />
                </div>

                <button
                  disabled={isLoading}
                  className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Saving changes..." : "Save listing changes"}
                </button>
              </form>
            )}

            {modal === "investor" && (
              <form onSubmit={submitInvestorRequest} className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    value={investorForm.name}
                    onChange={(event) =>
                      setInvestorForm({
                        ...investorForm,
                        name: event.target.value,
                      })
                    }
                    placeholder="Full name"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <input
                    required
                    type="email"
                    value={investorForm.email}
                    onChange={(event) =>
                      setInvestorForm({
                        ...investorForm,
                        email: event.target.value,
                      })
                    }
                    placeholder="Email address"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    value={investorForm.phone}
                    onChange={(event) =>
                      setInvestorForm({
                        ...investorForm,
                        phone: event.target.value,
                      })
                    }
                    placeholder="Phone number"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <input
                    required
                    value={investorForm.budget}
                    onChange={(event) =>
                      setInvestorForm({
                        ...investorForm,
                        budget: event.target.value,
                      })
                    }
                    placeholder="Investment budget"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />
                </div>

                <select
                  value={investorForm.interest}
                  onChange={(event) =>
                    setInvestorForm({
                      ...investorForm,
                      interest: event.target.value,
                    })
                  }
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                >
                  <option>Residential</option>
                  <option>Land</option>
                  <option>Commercial</option>
                  <option>Joint Venture</option>
                  <option>Short-let Income Property</option>
                </select>

                <textarea
                  value={investorForm.message}
                  onChange={(event) =>
                    setInvestorForm({
                      ...investorForm,
                      message: event.target.value,
                    })
                  }
                  placeholder="Tell us what kind of deal you want"
                  rows={4}
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <button className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white">
                  Save investor request
                </button>
              </form>
            )}

            {modal === "details" && selectedListing && (
              <div>
                <div className="relative h-80 overflow-hidden rounded-[26px] bg-[#0d1c38]">
                  {selectedListing.imageUrl ? (
                    <img
                      src={selectedListing.imageUrl}
                      alt={selectedListing.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1c38] via-[#1b3157] to-[#9b6b16]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(240,191,60,0.35),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_34%)]" />
                    </>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c38]/95 via-[#0d1c38]/45 to-[#0d1c38]/10" />

                  <div className="relative z-10 flex h-full flex-col justify-end p-8 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f0bf3c]">
                      INAMAAD verified asset
                    </p>

                    <h3 className="mt-3 text-4xl font-black">
                      {selectedListing.title}
                    </h3>

                    <p className="mt-3 text-lg text-slate-200">
                      {selectedListing.location}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-[1fr_260px]">
                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      {selectedListing.location}
                    </p>

                    <p className="mt-3 text-3xl font-black text-[#0d1c38]">
                      {selectedListing.price}
                    </p>

                    <p className="mt-4 text-base leading-8 text-slate-600">
                      {selectedListing.description}
                    </p>

                    <div className="mt-5 rounded-2xl bg-[#f7f8fb] p-5 font-bold text-slate-700">
                      {selectedListing.yieldText}
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-[#0d1c38] p-5 text-white">
                    <p className="text-sm font-black text-[#f0bf3c]">
                      Deal summary
                    </p>

                    <div className="mt-5 grid gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Type</p>
                        <p className="font-black">{selectedListing.type}</p>
                      </div>

                      <div>
                        <p className="text-slate-400">Category</p>
                        <p className="font-black">
                          {selectedListing.category}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400">Status</p>
                        <p className="font-black text-emerald-300">
                          {selectedListing.status}
                        </p>
                      </div>


                      <div>
                        <p className="text-slate-400">Views</p>
                        <p className="font-black text-[#f0bf3c]">
                          {viewCountByListingId[selectedListing.id] || 0}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setModal("investor")}
                      className="mt-6 w-full rounded-2xl bg-[#f0bf3c] px-5 py-3 text-sm font-black text-[#0d1c38]"
                    >
                      Investor Access
                    </button>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => copyListingShareLink(selectedListing)}
                        className="rounded-2xl bg-white/10 px-4 py-3 text-xs font-black text-white transition hover:bg-white/20"
                      >
                        Copy Link
                      </button>

                      <button
                        type="button"
                        onClick={() => shareListingToWhatsApp(selectedListing)}
                        className="rounded-2xl bg-emerald-500 px-4 py-3 text-xs font-black text-white transition hover:bg-emerald-600"
                      >
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={submitPropertyInquiry}
                  className="mt-6 grid gap-4 rounded-[24px] border border-slate-200 bg-white p-6"
                >
                  <div>
                    <p className="text-xl font-black text-[#0d1c38]">
                      Ask about this property
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Send your contact details to INAMAAD for this specific listing.
                    </p>
                  </div>

                  <input
                    required
                    value={inquiryForm.name}
                    onChange={(event) =>
                      setInquiryForm({ ...inquiryForm, name: event.target.value })
                    }
                    placeholder="Your name"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={inquiryForm.email}
                      onChange={(event) =>
                        setInquiryForm({
                          ...inquiryForm,
                          email: event.target.value,
                        })
                      }
                      type="email"
                      placeholder="Email address optional"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      required
                      value={inquiryForm.phone}
                      onChange={(event) =>
                        setInquiryForm({
                          ...inquiryForm,
                          phone: event.target.value,
                        })
                      }
                      placeholder="Phone or WhatsApp number"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </div>

                  <textarea
                    value={inquiryForm.message}
                    onChange={(event) =>
                      setInquiryForm({
                        ...inquiryForm,
                        message: event.target.value,
                      })
                    }
                    placeholder="Message, inspection request, or offer details"
                    rows={4}
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <button className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white">
                    Send property inquiry
                  </button>
                </form>

                <form
                  onSubmit={submitInspectionBooking}
                  className="mt-6 grid gap-4 rounded-[24px] border border-[#f0bf3c]/40 bg-[#fffaf0] p-6"
                >
                  <div>
                    <p className="text-xl font-black text-[#0d1c38]">
                      Book property inspection
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Choose a preferred date and time. INAMAAD will confirm availability before the appointment.
                    </p>
                  </div>

                  <input
                    required
                    value={inspectionForm.name}
                    onChange={(event) =>
                      setInspectionForm({ ...inspectionForm, name: event.target.value })
                    }
                    placeholder="Your name"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={inspectionForm.email}
                      onChange={(event) =>
                        setInspectionForm({ ...inspectionForm, email: event.target.value })
                      }
                      type="email"
                      placeholder="Email address optional"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      required
                      value={inspectionForm.phone}
                      onChange={(event) =>
                        setInspectionForm({ ...inspectionForm, phone: event.target.value })
                      }
                      placeholder="Phone or WhatsApp number"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={inspectionForm.preferredDate}
                      onChange={(event) =>
                        setInspectionForm({ ...inspectionForm, preferredDate: event.target.value })
                      }
                      type="date"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={inspectionForm.preferredTime}
                      onChange={(event) =>
                        setInspectionForm({ ...inspectionForm, preferredTime: event.target.value })
                      }
                      type="time"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </div>

                  <textarea
                    value={inspectionForm.message}
                    onChange={(event) =>
                      setInspectionForm({ ...inspectionForm, message: event.target.value })
                    }
                    placeholder="Message or special inspection request"
                    rows={3}
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <button className="rounded-2xl bg-[#f0bf3c] px-6 py-4 text-sm font-black text-[#0d1c38]">
                    Book inspection
                  </button>
                </form>
              </div>
            )}

            {modal === "admin" && !adminUnlocked && (
              <form onSubmit={unlockAdmin} className="grid gap-4">
                <p className="rounded-2xl bg-[#f7f8fb] p-5 text-sm leading-6 text-slate-600">
                  {usesDatabase
                    ? "Enter your Supabase staff email and password. Your email must exist in the admin_users table."
                    : "Database is not connected. Enter the local demo admin password."}
                </p>

                {usesDatabase && (
                  <input
                    required
                    type="email"
                    value={adminEmail}
                    onChange={(event) => setAdminEmail(event.target.value)}
                    placeholder="Staff email"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />
                )}

                <input
                  required
                  type="password"
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  placeholder={usesDatabase ? "Staff password" : "Admin password"}
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <button className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white">
                  Unlock staff portal
                </button>
              </form>
            )}

            {modal === "admin" && adminUnlocked && (
              <div className="grid gap-8">
                <div className="flex flex-col justify-between gap-4 rounded-2xl bg-[#f7f8fb] p-5 md:flex-row md:items-center">
                  <div>
                    <p className="font-black text-[#0d1c38]">
                      Staff portal active
                    </p>
                    <p className="text-sm text-slate-500">
                      {usesDatabase
                        ? user?.email || "Supabase admin"
                        : "Local demo admin"}
                    </p>
                  </div>

                  <button
                    onClick={logoutAdmin}
                    className="rounded-full bg-slate-900 px-5 py-2 text-xs font-black text-white"
                  >
                    Sign out
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-7">
                  <div className="rounded-2xl bg-[#f7f8fb] p-5">
                    <p className="text-2xl font-black text-[#0d1c38]">
                      {listings.length}
                    </p>
                    <p className="text-sm text-slate-500">Total listings</p>
                  </div>

                  <div className="rounded-2xl bg-[#f7f8fb] p-5">
                    <p className="text-2xl font-black text-[#0d1c38]">
                      {pendingListings.length}
                    </p>
                    <p className="text-sm text-slate-500">Pending review</p>
                  </div>

                  <div className="rounded-2xl bg-[#f7f8fb] p-5">
                    <p className="text-2xl font-black text-[#0d1c38]">
                      {propertyInquiries.length}
                    </p>
                    <p className="text-sm text-slate-500">Property inquiries</p>
                  </div>

                  <div className="rounded-2xl bg-[#f7f8fb] p-5">
                    <p className="text-2xl font-black text-[#0d1c38]">
                      {contactMessages.length}
                    </p>
                    <p className="text-sm text-slate-500">Contact messages</p>
                  </div>

                  <div className="rounded-2xl bg-[#f7f8fb] p-5">
                    <p className="text-2xl font-black text-[#0d1c38]">
                      {inspectionBookings.length}
                    </p>
                    <p className="text-sm text-slate-500">Inspection bookings</p>
                  </div>

                  <div className="rounded-2xl bg-[#f7f8fb] p-5">
                    <p className="text-2xl font-black text-[#0d1c38]">
                      {totalPropertyViews}
                    </p>
                    <p className="text-sm text-slate-500">Property views</p>
                  </div>

                  <div className="rounded-2xl bg-[#f7f8fb] p-5">
                    <p className="text-2xl font-black text-[#0d1c38]">
                      {investorRequests.length}
                    </p>
                    <p className="text-sm text-slate-500">Investor requests</p>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-[#0d1c38] p-6 text-white shadow-2xl shadow-slate-900/10">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#f5c542]">
                        Business analytics
                      </p>
                      <h3 className="mt-2 text-2xl font-black">
                        INAMAAD performance dashboard
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                        Track property inventory, verified asset value, lead flow,
                        and the strongest property categories from your staff portal.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 px-5 py-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
                        Total pipeline value
                      </p>
                      <p className="mt-1 text-3xl font-black text-[#f5c542]">
                        {formatNairaCompact(totalPropertyValue)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-white/10 p-5">
                      <p className="text-sm text-slate-300">Verified listings</p>
                      <p className="mt-2 text-3xl font-black">
                        {verifiedListings.length}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Approved and visible publicly
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5">
                      <p className="text-sm text-slate-300">Verified value</p>
                      <p className="mt-2 text-3xl font-black">
                        {formatNairaCompact(verifiedPropertyValue)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Approved property inventory value
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5">
                      <p className="text-sm text-slate-300">Total leads</p>
                      <p className="mt-2 text-3xl font-black">{totalLeads}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Investor requests + property inquiries + contact messages + inspection bookings
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5">
                      <p className="text-sm text-slate-300">Property inquiries</p>
                      <p className="mt-2 text-3xl font-black">
                        {conversionReadyLeads}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Buyer leads from listing pages
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5">
                      <p className="text-sm text-slate-300">Contact messages</p>
                      <p className="mt-2 text-3xl font-black">
                        {contactMessages.length}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Direct messages from contact section
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5">
                      <p className="text-sm text-slate-300">Inspection bookings</p>
                      <p className="mt-2 text-3xl font-black">
                        {inspectionBookings.length}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Property viewing appointment requests
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5">
                      <p className="text-sm text-slate-300">Property views</p>
                      <p className="mt-2 text-3xl font-black">
                        {totalPropertyViews}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Total listing detail page opens
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5">
                      <p className="text-sm text-slate-300">Most viewed property</p>
                      <p className="mt-2 text-2xl font-black">{mostViewedProperty}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {mostViewedPropertyCount} view{mostViewedPropertyCount === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5">
                      <p className="text-sm text-slate-300">Top location</p>
                      <p className="mt-2 text-2xl font-black">{topLocation}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {topLocationCount} listing{topLocationCount === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5">
                      <p className="text-sm text-slate-300">Top asset type</p>
                      <p className="mt-2 text-2xl font-black">{topType}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {topTypeCount} listing{topTypeCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                </div>


                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d49613]">
                        Property views
                      </p>
                      <h3 className="mt-2 text-2xl font-black text-[#0d1c38]">
                        Most viewed listings
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        See which properties buyers and investors open the most. Use this to know which assets deserve stronger follow-up or promotion.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {topViewedListings.map((listing, index) => (
                      <div
                        key={listing.id}
                        className="flex flex-col justify-between gap-3 rounded-2xl bg-[#f7f8fb] p-5 md:flex-row md:items-center"
                      >
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d49613]">
                            #{index + 1} viewed property
                          </p>
                          <p className="mt-1 font-black text-[#0d1c38]">
                            {listing.title}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {listing.location} • {listing.price}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white px-5 py-3 text-right shadow-sm">
                          <p className="text-2xl font-black text-[#0d1c38]">
                            {listing.views}
                          </p>
                          <p className="text-xs font-bold text-slate-500">
                            view{listing.views === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d49613]">
                        Reports
                      </p>
                      <h3 className="mt-2 text-2xl font-black text-[#0d1c38]">
                        Export business data
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Download listings, leads, and performance numbers as CSV files for Excel, Google Sheets, accounting, or investor reporting.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={exportBusinessReportCsv}
                      className="rounded-full bg-[#0d1c38] px-5 py-3 text-xs font-black text-white"
                    >
                      Export business report
                    </button>

                    <button
                      type="button"
                      onClick={exportListingsCsv}
                      className="rounded-full bg-slate-900 px-5 py-3 text-xs font-black text-white"
                    >
                      Export listings
                    </button>

                    <button
                      type="button"
                      onClick={exportInvestorRequestsCsv}
                      className="rounded-full bg-[#d49613] px-5 py-3 text-xs font-black text-white"
                    >
                      Export investor requests
                    </button>


                    <button
                      type="button"
                      onClick={exportPropertyViewsCsv}
                      className="rounded-full bg-slate-700 px-5 py-3 text-xs font-black text-white"
                    >
                      Export property views
                    </button>

                    <button
                      type="button"
                      onClick={exportPropertyInquiriesCsv}
                      className="rounded-full bg-emerald-600 px-5 py-3 text-xs font-black text-white"
                    >
                      Export property inquiries
                    </button>

                    <button
                      type="button"
                      onClick={exportContactMessagesCsv}
                      className="rounded-full bg-blue-700 px-5 py-3 text-xs font-black text-white"
                    >
                      Export contact messages
                    </button>

                    <button
                      type="button"
                      onClick={exportInspectionBookingsCsv}
                      className="rounded-full bg-purple-700 px-5 py-3 text-xs font-black text-white"
                    >
                      Export inspection bookings
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#0d1c38]">
                    Pending listings
                  </h3>

                  <div className="mt-4 grid gap-4">
                    {pendingListings.length === 0 && (
                      <p className="rounded-2xl bg-[#f7f8fb] p-5 text-sm text-slate-500">
                        No pending listings right now.
                      </p>
                    )}

                    {pendingListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="rounded-2xl border border-slate-200 p-5"
                      >
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div>
                            <p className="font-black text-[#0d1c38]">
                              {listing.title}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {listing.location} • {listing.price}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                              Owner: {listing.ownerName || "Not provided"} •{" "}
                              {listing.ownerPhone || "No phone"}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => openEditListing(listing)}
                              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => approveListing(listing.id)}
                              className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() => deleteListing(listing.id)}
                              className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#0d1c38]">
                    Property inquiries
                  </h3>

                  <div className="mt-4 grid gap-4">
                    {propertyInquiries.length === 0 && (
                      <p className="rounded-2xl bg-[#f7f8fb] p-5 text-sm text-slate-500">
                        No property inquiries yet.
                      </p>
                    )}

                    {propertyInquiries.map((inquiry) => {
                      const inquiryStatus = inquiry.status || "New";
                      const inquiryWhatsAppMessage = `Hello ${inquiry.name}, this is INAMAAD Real Estate. We received your request about ${inquiry.listingTitle}.`;

                      return (
                        <div
                          key={inquiry.id}
                          className="rounded-2xl border border-slate-200 p-5"
                        >
                          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d49613]">
                                  {inquiry.listingTitle}
                                </p>

                                <span
                                  className={`rounded-full px-3 py-1 text-[11px] font-black ${leadStatusClass(
                                    inquiryStatus
                                  )}`}
                                >
                                  {inquiryStatus}
                                </span>
                              </div>

                              <p className="mt-2 font-black text-[#0d1c38]">
                                {inquiry.name}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {inquiry.email || "No email"} • {inquiry.phone}
                              </p>

                              <p className="mt-3 text-sm leading-6 text-slate-600">
                                {inquiry.message || "No extra message."}
                              </p>

                              <p className="mt-2 text-xs font-bold text-slate-400">
                                Submitted {formatDate(inquiry.createdAt)}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 md:justify-end">
                              <a
                                href={createWhatsAppLeadLink(
                                  inquiry.phone,
                                  inquiryWhatsAppMessage
                                )}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white"
                              >
                                WhatsApp
                              </a>

                              <a
                                href={createCallLeadLink(inquiry.phone)}
                                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white"
                              >
                                Call
                              </a>

                              {inquiry.email && (
                                <a
                                  href={createEmailLeadLink(
                                    inquiry.email,
                                    `INAMAAD inquiry: ${inquiry.listingTitle}`
                                  )}
                                  className="rounded-full bg-[#d49613] px-4 py-2 text-xs font-black text-white"
                                >
                                  Email
                                </a>
                              )}

                              <button
                                onClick={() =>
                                  updatePropertyInquiryStatus(inquiry.id, "New")
                                }
                                className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700"
                              >
                                New
                              </button>

                              <button
                                onClick={() =>
                                  updatePropertyInquiryStatus(
                                    inquiry.id,
                                    "Contacted"
                                  )
                                }
                                className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700"
                              >
                                Contacted
                              </button>

                              <button
                                onClick={() =>
                                  updatePropertyInquiryStatus(inquiry.id, "Closed")
                                }
                                className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700"
                              >
                                Closed
                              </button>

                              <button
                                onClick={() => deletePropertyInquiry(inquiry.id)}
                                className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#0d1c38]">
                    Inspection bookings
                  </h3>

                  <div className="mt-4 grid gap-4">
                    {inspectionBookings.length === 0 && (
                      <p className="rounded-2xl bg-[#f7f8fb] p-5 text-sm text-slate-500">
                        No inspection bookings yet.
                      </p>
                    )}

                    {inspectionBookings.map((booking) => {
                      const bookingStatus = booking.status || "New";
                      const inspectionWhatsAppMessage = `Hello ${booking.name}, this is INAMAAD Real Estate. We received your inspection booking for ${booking.listingTitle}.`;

                      return (
                        <div
                          key={booking.id}
                          className="rounded-2xl border border-slate-200 p-5"
                        >
                          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d49613]">
                                  {booking.listingTitle}
                                </p>

                                <span
                                  className={`rounded-full px-3 py-1 text-[11px] font-black ${inspectionStatusClass(
                                    bookingStatus
                                  )}`}
                                >
                                  {bookingStatus}
                                </span>
                              </div>

                              <p className="mt-2 font-black text-[#0d1c38]">
                                {booking.name}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {booking.email || "No email"} • {booking.phone}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                Preferred: {booking.preferredDate || "No date"} • {booking.preferredTime || "No time"}
                              </p>

                              <p className="mt-3 text-sm leading-6 text-slate-600">
                                {booking.message || "No message."}
                              </p>

                              <p className="mt-2 text-xs font-bold text-slate-400">
                                Submitted {formatDate(booking.createdAt)}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 md:justify-end">
                              <a
                                href={createWhatsAppLeadLink(
                                  booking.phone,
                                  inspectionWhatsAppMessage
                                )}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white"
                              >
                                WhatsApp
                              </a>

                              <a
                                href={createCallLeadLink(booking.phone)}
                                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white"
                              >
                                Call
                              </a>

                              {booking.email && (
                                <a
                                  href={createEmailLeadLink(
                                    booking.email,
                                    `INAMAAD inspection booking: ${booking.listingTitle}`
                                  )}
                                  className="rounded-full bg-[#d49613] px-4 py-2 text-xs font-black text-white"
                                >
                                  Email
                                </a>
                              )}

                              <button
                                onClick={() => updateInspectionBookingStatus(booking.id, "New")}
                                className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700"
                              >
                                New
                              </button>

                              <button
                                onClick={() => updateInspectionBookingStatus(booking.id, "Scheduled")}
                                className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700"
                              >
                                Scheduled
                              </button>

                              <button
                                onClick={() => updateInspectionBookingStatus(booking.id, "Completed")}
                                className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700"
                              >
                                Completed
                              </button>

                              <button
                                onClick={() => updateInspectionBookingStatus(booking.id, "Cancelled")}
                                className="rounded-full bg-red-100 px-4 py-2 text-xs font-black text-red-700"
                              >
                                Cancelled
                              </button>

                              <button
                                onClick={() => deleteInspectionBooking(booking.id)}
                                className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#0d1c38]">
                    Contact messages
                  </h3>

                  <div className="mt-4 grid gap-4">
                    {contactMessages.length === 0 && (
                      <p className="rounded-2xl bg-[#f7f8fb] p-5 text-sm text-slate-500">
                        No contact messages yet.
                      </p>
                    )}

                    {contactMessages.map((message) => {
                      const messageStatus = message.status || "New";
                      const contactWhatsAppMessage = `Hello ${message.name}, this is INAMAAD Real Estate. We received your message: ${message.subject || "General enquiry"}.`;

                      return (
                        <div
                          key={message.id}
                          className="rounded-2xl border border-slate-200 p-5"
                        >
                          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d49613]">
                                  {message.subject || "General enquiry"}
                                </p>

                                <span
                                  className={`rounded-full px-3 py-1 text-[11px] font-black ${leadStatusClass(
                                    messageStatus
                                  )}`}
                                >
                                  {messageStatus}
                                </span>
                              </div>

                              <p className="mt-2 font-black text-[#0d1c38]">
                                {message.name}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {message.email || "No email"} • {message.phone || "No phone"}
                              </p>

                              <p className="mt-3 text-sm leading-6 text-slate-600">
                                {message.message || "No message."}
                              </p>

                              <p className="mt-2 text-xs font-bold text-slate-400">
                                Submitted {formatDate(message.createdAt)}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 md:justify-end">
                              {message.phone && (
                                <>
                                  <a
                                    href={createWhatsAppLeadLink(
                                      message.phone,
                                      contactWhatsAppMessage
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white"
                                  >
                                    WhatsApp
                                  </a>

                                  <a
                                    href={createCallLeadLink(message.phone)}
                                    className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white"
                                  >
                                    Call
                                  </a>
                                </>
                              )}

                              {message.email && (
                                <a
                                  href={createEmailLeadLink(
                                    message.email,
                                    `INAMAAD contact message: ${message.subject || "General enquiry"}`
                                  )}
                                  className="rounded-full bg-[#d49613] px-4 py-2 text-xs font-black text-white"
                                >
                                  Email
                                </a>
                              )}

                              <button
                                onClick={() => updateContactMessageStatus(message.id, "New")}
                                className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700"
                              >
                                New
                              </button>

                              <button
                                onClick={() =>
                                  updateContactMessageStatus(message.id, "Contacted")
                                }
                                className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700"
                              >
                                Contacted
                              </button>

                              <button
                                onClick={() => updateContactMessageStatus(message.id, "Closed")}
                                className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700"
                              >
                                Closed
                              </button>

                              <button
                                onClick={() => deleteContactMessage(message.id)}
                                className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#0d1c38]">
                    Investor requests
                  </h3>

                  <div className="mt-4 grid gap-4">
                    {investorRequests.length === 0 && (
                      <p className="rounded-2xl bg-[#f7f8fb] p-5 text-sm text-slate-500">
                        No investor requests yet.
                      </p>
                    )}

                    {investorRequests.map((request) => {
                      const requestStatus = request.status || "New";
                      const investorWhatsAppMessage = `Hello ${request.name}, this is INAMAAD Real Estate. We received your investment request for ${request.interest} with budget ${request.budget}.`;

                      return (
                        <div
                          key={request.id}
                          className="rounded-2xl border border-slate-200 p-5"
                        >
                          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-black text-[#0d1c38]">
                                  {request.name}
                                </p>

                                <span
                                  className={`rounded-full px-3 py-1 text-[11px] font-black ${leadStatusClass(
                                    requestStatus
                                  )}`}
                                >
                                  {requestStatus}
                                </span>
                              </div>

                              <p className="mt-1 text-sm text-slate-500">
                                {request.email} • {request.phone}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                Budget: {request.budget} • Interest: {request.interest}
                              </p>

                              <p className="mt-3 text-sm leading-6 text-slate-600">
                                {request.message || "No extra message."}
                              </p>

                              <p className="mt-2 text-xs font-bold text-slate-400">
                                Submitted {formatDate(request.createdAt)}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 md:justify-end">
                              <a
                                href={createWhatsAppLeadLink(
                                  request.phone,
                                  investorWhatsAppMessage
                                )}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white"
                              >
                                WhatsApp
                              </a>

                              <a
                                href={createCallLeadLink(request.phone)}
                                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white"
                              >
                                Call
                              </a>

                              <a
                                href={createEmailLeadLink(
                                  request.email,
                                  `INAMAAD investor request: ${request.interest}`
                                )}
                                className="rounded-full bg-[#d49613] px-4 py-2 text-xs font-black text-white"
                              >
                                Email
                              </a>

                              <button
                                onClick={() =>
                                  updateInvestorRequestStatus(request.id, "New")
                                }
                                className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700"
                              >
                                New
                              </button>

                              <button
                                onClick={() =>
                                  updateInvestorRequestStatus(
                                    request.id,
                                    "Contacted"
                                  )
                                }
                                className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700"
                              >
                                Contacted
                              </button>

                              <button
                                onClick={() =>
                                  updateInvestorRequestStatus(request.id, "Closed")
                                }
                                className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700"
                              >
                                Closed
                              </button>

                              <button
                                onClick={() => deleteInvestorRequest(request.id)}
                                className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#0d1c38]">
                    All listings
                  </h3>

                  <div className="mt-4 grid gap-4">
                    {listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="rounded-2xl border border-slate-200 p-5"
                      >
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div>
                            <p className="font-black text-[#0d1c38]">
                              {listing.title}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {listing.location} • {listing.price}
                            </p>

                            <p className="mt-1 text-xs font-black text-slate-400">
                              {listing.status}
                              {listing.featured ? ` • Featured rank ${listing.featuredRank || 0}` : ""}
                            </p>


                            <p className="mt-1 text-xs font-bold text-slate-500">
                              Views: {viewCountByListingId[listing.id] || 0}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => openEditListing(listing)}
                              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteListing(listing.id)}
                              className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
