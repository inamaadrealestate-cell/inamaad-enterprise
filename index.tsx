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
type LeadKind = "investor_requests" | "property_inquiries" | "contact_messages" | "inspection_bookings";

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
  documentTitle?: string;
  documentStatus?: string;
  documentDetails?: string;
  documentFileUrl?: string;
  titleVerified?: boolean;
  ownerVerified?: boolean;
  siteInspected?: boolean;
  priceChecked?: boolean;
  legalReviewStatus?: "Not Reviewed" | "Under Review" | "Verified" | "Rejected";
  verificationNotes?: string;
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
  assignedToEmail?: string;
  staffNotes?: string;
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
  assignedToEmail?: string;
  staffNotes?: string;
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
  assignedToEmail?: string;
  staffNotes?: string;
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
  assignedToEmail?: string;
  staffNotes?: string;
  createdAt: string;
};

type PropertyView = {
  id: number;
  listingId: number;
  listingTitle: string;
  viewedAt: string;
};

type StaffNotification = {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

type AdminActivityLog = {
  id: number;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  createdAt: string;
};

type StaffRole = "Super Admin" | "Admin" | "Manager" | "Agent" | "Viewer";

type StaffMember = {
  email: string;
  fullName: string;
  role: StaffRole;
  isActive: boolean;
  createdAt: string;
};

const WHATSAPP_NUMBER = "2348106350486";
const LOCAL_ADMIN_PASSWORD = "admin123";
const staffRoleOptions: StaffRole[] = [
  "Super Admin",
  "Admin",
  "Manager",
  "Agent",
  "Viewer",
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined);

const supabase =
  SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Properties", href: "#properties" },
  { label: "Calculator", href: "#calculator" },
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

const propertyTypeOptions = [
  "Residential",
  "Apartment / Flat",
  "Mini Flat",
  "Self Contain",
  "Studio Apartment",
  "Bungalow",
  "Terrace",
  "Terrace Duplex",
  "Duplex",
  "Semi-detached Duplex",
  "Detached Duplex",
  "Mansion",
  "Penthouse",
  "Short-let Apartment",
  "Land",
  "Estate Plot",
  "Farm Land",
  "Commercial",
  "Office Space",
  "Shop / Retail Space",
  "Plaza",
  "Warehouse",
  "Hotel / Guest House",
  "Mixed-use",
  "Joint Venture",
  "Estate Development",
];

const listingPurposeOptions = [
  "For Sale",
  "For Rent",
  "Short Let",
  "Lease",
  "Commercial Lease",
  "Investment",
  "Land Banking",
  "Joint Venture",
  "JV Partnership",
  "Off-plan",
  "Distress Sale",
];

const documentTitleOptions = [
  "C of O / Certificate of Occupancy",
  "R of O / Right of Occupancy",
  "Governor's Consent",
  "Deed of Assignment",
  "Registered Deed",
  "Survey Plan",
  "Excision",
  "Gazette",
  "Letter of Allocation",
  "Building Approval",
  "Approved Layout",
  "Deed of Lease",
  "Power of Attorney",
  "Probate / Letter of Administration",
  "Family Receipt",
  "Agreement / Contract of Sale",
  "Processing",
  "Not Available Yet",
  "Other",
];

const documentStatusOptions = [
  "Available",
  "Verified",
  "Processing",
  "Pending Verification",
  "Not Available",
];

const legalReviewStatusOptions = [
  "Not Reviewed",
  "Under Review",
  "Verified",
  "Rejected",
];

const investorInterestOptions = [
  "Residential",
  "Rental Income / For Rent",
  "Apartment / Flat",
  "Bungalow",
  "Terrace",
  "Terrace Duplex",
  "Duplex",
  "Land Banking",
  "Commercial Property",
  "Joint Venture",
  "Short-let Income Property",
  "Estate Development",
  "Off-plan Investment",
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

function formatNairaFull(value: string | number) {
  const numericValue =
    typeof value === "number" ? value : currencyToValue(String(value));

  if (!Number.isFinite(numericValue) || numericValue <= 0) return "";

  return `₦${numericValue.toLocaleString("en-NG")}`;
}

function formatPriceInput(value: string) {
  const numericValue = currencyToValue(value);
  return numericValue > 0 ? formatNairaFull(numericValue) : "";
}

function formatPricePreview(value: string) {
  const numericValue = currencyToValue(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) return "₦0";

  return `${formatNairaFull(numericValue)} (${formatNairaCompact(numericValue)})`;
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

function extractPropertyDocumentPath(documentFileUrl: string) {
  if (!documentFileUrl) return "";

  const cleanValue = documentFileUrl.split("?")[0];
  const bucketMarker = "property-documents/";

  if (cleanValue.includes(bucketMarker)) {
    return decodeURIComponent(cleanValue.split(bucketMarker).pop() || "");
  }

  if (!cleanValue.includes("/")) {
    return cleanValue;
  }

  return decodeURIComponent(cleanValue.split("/").pop() || "");
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
    documentTitle: row.document_title || "",
    documentStatus: row.document_status || "",
    documentDetails: row.document_details || "",
    documentFileUrl: row.document_file_url || "",
    titleVerified: Boolean(row.title_verified),
    ownerVerified: Boolean(row.owner_verified),
    siteInspected: Boolean(row.site_inspected),
    priceChecked: Boolean(row.price_checked),
    legalReviewStatus: row.legal_review_status || "Not Reviewed",
    verificationNotes: row.verification_notes || "",
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
    assignedToEmail: row.assigned_to_email || "",
    staffNotes: row.staff_notes || "",
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
    assignedToEmail: row.assigned_to_email || "",
    staffNotes: row.staff_notes || "",
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
    assignedToEmail: row.assigned_to_email || "",
    staffNotes: row.staff_notes || "",
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
    assignedToEmail: row.assigned_to_email || "",
    staffNotes: row.staff_notes || "",
    createdAt: row.created_at,
  };
}

function mapStaffNotificationRow(row: any): StaffNotification {
  return {
    id: Number(row.id),
    title: row.title,
    message: row.message,
    type: row.type || "General",
    isRead: Boolean(row.is_read),
    createdAt: row.created_at,
  };
}

function mapAdminActivityLogRow(row: any): AdminActivityLog {
  return {
    id: Number(row.id),
    adminEmail: row.admin_email || "Unknown staff",
    action: row.action || "Activity",
    targetType: row.target_type || "General",
    targetId: row.target_id || "",
    details: row.details || "",
    createdAt: row.created_at,
  };
}

function mapStaffMemberRow(row: any): StaffMember {
  return {
    email: row.email || "",
    fullName: row.full_name || "",
    role: (row.role || "Admin") as StaffRole,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at || "",
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
    document_title: listing.documentTitle || null,
    document_status: listing.documentStatus || null,
    document_details: listing.documentDetails || null,
    document_file_url: listing.documentFileUrl || null,
    title_verified: Boolean(listing.titleVerified),
    owner_verified: Boolean(listing.ownerVerified),
    site_inspected: Boolean(listing.siteInspected),
    price_checked: Boolean(listing.priceChecked),
    legal_review_status: listing.legalReviewStatus || "Not Reviewed",
    verification_notes: listing.verificationNotes || null,
    image_url: listing.imageUrl || null,
    featured: Boolean(listing.featured),
    featured_rank: Number(listing.featuredRank || 0),
  };
}

function isListingVerificationComplete(listing: Listing | Omit<Listing, "id">) {
  return Boolean(
    listing.titleVerified &&
      listing.ownerVerified &&
      listing.siteInspected &&
      listing.priceChecked &&
      listing.legalReviewStatus === "Verified"
  );
}

function verificationSummary(listing: Listing | Omit<Listing, "id">) {
  const completed = [
    listing.titleVerified,
    listing.ownerVerified,
    listing.siteInspected,
    listing.priceChecked,
    listing.legalReviewStatus === "Verified",
  ].filter(Boolean).length;

  return `${completed}/5 checks complete`;
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
  const [staffNotifications, setStaffNotifications] = useState<StaffNotification[]>([]);
  const [adminActivityLogs, setAdminActivityLogs] = useState<AdminActivityLog[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [listingPurpose, setListingPurpose] = useState("All Purposes");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [minValueFilter, setMinValueFilter] = useState("");
  const [maxValueFilter, setMaxValueFilter] = useState("");
  const [sortMode, setSortMode] = useState("Newest");
  const [calculatorForm, setCalculatorForm] = useState({
    purchasePrice: "150000000",
    annualRent: "12000000",
    annualGrowth: "12",
    holdingYears: "5",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sharedListingOpened, setSharedListingOpened] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [staffForm, setStaffForm] = useState({
    email: "",
    fullName: "",
    role: "Agent" as StaffRole,
  });

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
    documentTitle: "C of O / Certificate of Occupancy",
    documentStatus: "Available",
    documentDetails: "",
    documentFileUrl: "",
    ownerName: "",
    ownerPhone: "",
  });

  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [postDocumentFile, setPostDocumentFile] = useState<File | null>(null);

  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    price: "",
    type: "Residential",
    category: "For Sale",
    yieldText: "",
    description: "",
    documentTitle: "C of O / Certificate of Occupancy",
    documentStatus: "Available",
    documentDetails: "",
    documentFileUrl: "",
    titleVerified: false,
    ownerVerified: false,
    siteInspected: false,
    priceChecked: false,
    legalReviewStatus: "Not Reviewed",
    verificationNotes: "",
    status: "Verified" as ListingStatus,
    ownerName: "",
    ownerPhone: "",
    imageUrl: "",
    featured: false,
    featuredRank: "0",
  });

  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editDocumentFile, setEditDocumentFile] = useState<File | null>(null);

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
  const unreadNotifications = staffNotifications.filter((notification) => !notification.isRead).length;
  const currentStaffMember = staffMembers.find((member) => member.email === user?.email);
  const currentStaffRole: StaffRole = usesDatabase
    ? currentStaffMember?.role || "Viewer"
    : "Super Admin";
  const hasAnyStaffRole = (allowedRoles: StaffRole[]) =>
    !usesDatabase || allowedRoles.includes(currentStaffRole);

  const isSuperAdmin = hasAnyStaffRole(["Super Admin"]);
  const canManageStaff = hasAnyStaffRole(["Super Admin"]);
  const canEditListings = hasAnyStaffRole(["Super Admin", "Admin", "Manager"]);
  const canApproveListings = hasAnyStaffRole(["Super Admin", "Admin", "Manager"]);
  const canDeleteListings = hasAnyStaffRole(["Super Admin", "Admin"]);
  const canManageLeads = hasAnyStaffRole(["Super Admin", "Admin", "Manager", "Agent"]);
  const canDeleteLeads = hasAnyStaffRole(["Super Admin", "Admin", "Manager"]);
  const canOpenDocuments = hasAnyStaffRole(["Super Admin", "Admin", "Manager"]);
  const canExportReports = hasAnyStaffRole(["Super Admin", "Admin", "Manager"]);
  const assignableStaffMembers = staffMembers.filter(
    (member) => member.isActive && member.role !== "Viewer"
  );
  const activeStaffCount = staffMembers.filter((member) => member.isActive).length;
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

  const calculatorPurchasePrice = Number(calculatorForm.purchasePrice || 0);
  const calculatorAnnualRent = Number(calculatorForm.annualRent || 0);
  const calculatorGrowthRate = Number(calculatorForm.annualGrowth || 0) / 100;
  const calculatorYears = Math.max(Number(calculatorForm.holdingYears || 0), 0);
  const calculatorFutureValue = calculatorPurchasePrice > 0
    ? Math.round(calculatorPurchasePrice * Math.pow(1 + calculatorGrowthRate, calculatorYears))
    : 0;
  const calculatorTotalRent = Math.round(calculatorAnnualRent * calculatorYears);
  const calculatorEstimatedGain = Math.max(calculatorFutureValue - calculatorPurchasePrice, 0);
  const calculatorTotalReturn = calculatorEstimatedGain + calculatorTotalRent;
  const calculatorRoi = calculatorPurchasePrice > 0
    ? Math.round((calculatorTotalReturn / calculatorPurchasePrice) * 100)
    : 0;

  const filteredListings = useMemo(() => {
    const minValue = Number(minValueFilter || 0);
    const maxValue = Number(maxValueFilter || 0);

    return listings
      .filter((listing) => {
        if (listing.status !== "Verified") return false;

        const searchText =
          `${listing.title} ${listing.location} ${listing.type} ${listing.category} ${listing.documentTitle || ""} ${listing.documentStatus || ""}`.toLowerCase();

        const matchesSearch = searchText.includes(query.toLowerCase());

        const matchesType =
          propertyType === "All" || listing.type === propertyType;

        const matchesPurpose =
          listingPurpose === "All Purposes" || listing.category === listingPurpose;

        const matchesLocation =
          locationFilter === "All Locations" ||
          listing.location.toLowerCase().includes(locationFilter.toLowerCase());

        const matchesMinValue = !minValueFilter || Number(listing.value || 0) >= minValue;
        const matchesMaxValue = !maxValueFilter || Number(listing.value || 0) <= maxValue;

        return (
          matchesSearch &&
          matchesType &&
          matchesPurpose &&
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
    listingPurpose,
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
          setStaffNotifications([]);
          setAdminActivityLogs([]);
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
    if (supabase) return;
    localStorage.setItem("inamaad_staff_notifications", JSON.stringify(staffNotifications));
  }, [staffNotifications]);

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
      const storedStaffNotifications = localStorage.getItem("inamaad_staff_notifications");

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

      if (storedStaffNotifications) {
        setStaffNotifications(JSON.parse(storedStaffNotifications) as StaffNotification[]);
      }
    } catch {
      localStorage.removeItem("inamaad_listings");
      localStorage.removeItem("inamaad_investor_requests");
      localStorage.removeItem("inamaad_property_inquiries");
      localStorage.removeItem("inamaad_property_views");
      localStorage.removeItem("inamaad_contact_messages");
      localStorage.removeItem("inamaad_inspection_bookings");
      localStorage.removeItem("inamaad_staff_notifications");
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

  async function loadDatabaseStaffNotifications() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("staff_notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setStaffNotifications((data || []).map(mapStaffNotificationRow));
  }

  async function loadDatabaseAdminActivityLogs() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("admin_activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error(error);
      return;
    }

    setAdminActivityLogs((data || []).map(mapAdminActivityLogRow));
  }

  async function loadDatabaseStaffMembers() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("admin_users")
      .select("email, full_name, role, is_active, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setStaffMembers((data || []).map(mapStaffMemberRow));
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
      await loadDatabaseStaffNotifications();
      await loadDatabaseAdminActivityLogs();
      await loadDatabaseStaffMembers();
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

  async function uploadPropertyDocument(file: File) {
    if (!supabase) return "";

    const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const safeFileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const { error } = await supabase.storage
      .from("property-documents")
      .upload(safeFileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return safeFileName;
  }

  async function openSecurePropertyDocument(documentFileUrl?: string) {
    if (!canOpenDocuments) {
      showSuccess("Your role cannot open secure title documents.");
      return;
    }

    if (!documentFileUrl) {
      showSuccess("No title document file has been uploaded for this listing.");
      return;
    }

    if (!supabase || !user) {
      showSuccess("Only signed-in staff can open uploaded title documents.");
      return;
    }

    const documentPath = extractPropertyDocumentPath(documentFileUrl);

    if (!documentPath) {
      showSuccess("Unable to find the secure document path.");
      return;
    }

    const { data, error } = await supabase.storage
      .from("property-documents")
      .createSignedUrl(documentPath, 300);

    if (error || !data?.signedUrl) {
      console.error(error);
      showSuccess("Unable to open document. Make sure you are signed in as admin.");
      return;
    }

    await createAdminActivityLog(
      "Opened secure title document",
      "Listing Document",
      documentPath,
      "Staff generated a temporary signed URL for an uploaded title document."
    );

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
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
    if (!canEditListings) {
      showSuccess("Your role cannot edit property listings.");
      return;
    }

    setEditingListing(listing);
    setSelectedListing(null);
    setEditImageFile(null);
    setEditDocumentFile(null);
    setEditForm({
      title: listing.title,
      location: listing.location,
      price: listing.price,
      type: listing.type,
      category: listing.category,
      yieldText: listing.yieldText,
      description: listing.description,
      documentTitle: listing.documentTitle || "C of O / Certificate of Occupancy",
      documentStatus: listing.documentStatus || "Available",
      documentDetails: listing.documentDetails || "",
      documentFileUrl: listing.documentFileUrl || "",
      titleVerified: Boolean(listing.titleVerified),
      ownerVerified: Boolean(listing.ownerVerified),
      siteInspected: Boolean(listing.siteInspected),
      priceChecked: Boolean(listing.priceChecked),
      legalReviewStatus: listing.legalReviewStatus || "Not Reviewed",
      verificationNotes: listing.verificationNotes || "",
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

      const documentFileUrl = postDocumentFile
        ? supabase
          ? await uploadPropertyDocument(postDocumentFile)
          : await imageFileToBase64(postDocumentFile)
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
        documentTitle: postForm.documentTitle,
        documentStatus: postForm.documentStatus,
        documentDetails: postForm.documentDetails,
        documentFileUrl,
        titleVerified: false,
        ownerVerified: false,
        siteInspected: false,
        priceChecked: false,
        legalReviewStatus: "Not Reviewed",
        verificationNotes: "",
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

      await createStaffNotification(
        "New pending property",
        `${postForm.title} was submitted for admin review in ${postForm.location}.`,
        "Pending Property"
      );

      setPostForm({
        title: "",
        location: "",
        price: "",
        type: "Residential",
        category: "For Sale",
        yieldText: "",
        description: "",
        documentTitle: "C of O / Certificate of Occupancy",
        documentStatus: "Available",
        documentDetails: "",
        documentFileUrl: "",
        ownerName: "",
        ownerPhone: "",
      });
      setPostImageFile(null);
      setPostDocumentFile(null);

      setModal(null);
      showSuccess("Opportunity submitted successfully. Admin review is pending.");
    } catch (error) {
      console.error(error);
      showSuccess("Upload failed. Please try a smaller image/document file.");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitEditListing(event: React.FormEvent) {
    event.preventDefault();

    if (!canEditListings) {
      showSuccess("Your role cannot save listing changes.");
      return;
    }

    if (!editingListing) return;

    setIsLoading(true);

    try {
      const imageUrl = editImageFile
        ? supabase
          ? await uploadPropertyImage(editImageFile)
          : await imageFileToBase64(editImageFile)
        : editForm.imageUrl;

      const documentFileUrl = editDocumentFile
        ? supabase
          ? await uploadPropertyDocument(editDocumentFile)
          : await imageFileToBase64(editDocumentFile)
        : editForm.documentFileUrl;

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
        documentTitle: editForm.documentTitle,
        documentStatus: editForm.documentStatus,
        documentDetails: editForm.documentDetails,
        documentFileUrl,
        titleVerified: Boolean(editForm.titleVerified),
        ownerVerified: Boolean(editForm.ownerVerified),
        siteInspected: Boolean(editForm.siteInspected),
        priceChecked: Boolean(editForm.priceChecked),
        legalReviewStatus: editForm.legalReviewStatus as Listing["legalReviewStatus"],
        verificationNotes: editForm.verificationNotes,
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
              documentTitle: updatedListing.documentTitle,
              documentStatus: updatedListing.documentStatus,
              documentDetails: updatedListing.documentDetails,
              documentFileUrl: updatedListing.documentFileUrl,
              titleVerified: updatedListing.titleVerified,
              ownerVerified: updatedListing.ownerVerified,
              siteInspected: updatedListing.siteInspected,
              priceChecked: updatedListing.priceChecked,
              legalReviewStatus: updatedListing.legalReviewStatus,
              verificationNotes: updatedListing.verificationNotes,
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

      await createAdminActivityLog(
        "Edited property listing",
        "Listing",
        String(editingListing.id),
        `${updatedListing.title} updated. Status: ${updatedListing.status}. Verification: ${verificationSummary(updatedListing)}.`
      );

      setEditImageFile(null);
      setEditDocumentFile(null);
      setEditingListing(null);
      setModal("admin");
      showSuccess("Listing updated successfully.");
    } catch (error) {
      console.error(error);
      showSuccess("Upload failed. Please try a smaller image/document file.");
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

    await createStaffNotification(
      "New investor request",
      `${investorForm.name} requested ${investorForm.interest} investment support with budget ${investorForm.budget}.`,
      "Investor Request"
    );

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

    await createStaffNotification(
      "New property inquiry",
      `${inquiryForm.name} requested access for ${selectedListing.title}.`,
      "Property Inquiry"
    );

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

    await createStaffNotification(
      "New inspection booking",
      `${inspectionForm.name} booked an inspection for ${selectedListing.title}.`,
      "Inspection Booking"
    );

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

    await createStaffNotification(
      "New contact message",
      `${contactForm.name} sent a contact message: ${contactForm.subject || "General enquiry"}.`,
      "Contact Message"
    );

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
    setStaffNotifications([]);
    setAdminActivityLogs([]);
    setStaffMembers([]);
    showSuccess("Staff signed out.");
  }

  async function createAdminActivityLog(
    action: string,
    targetType = "General",
    targetId = "",
    details = ""
  ) {
    const newLog: Omit<AdminActivityLog, "id"> = {
      adminEmail: user?.email || adminEmail || "Local demo admin",
      action,
      targetType,
      targetId,
      details,
      createdAt: new Date().toISOString(),
    };

    if (supabase && user) {
      const { error } = await supabase.from("admin_activity_logs").insert({
        admin_email: user.email,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
      });

      if (error) {
        console.error(error);
        return;
      }

      await loadDatabaseAdminActivityLogs();
      return;
    }

    setAdminActivityLogs((current) => [
      { ...newLog, id: Date.now() },
      ...current.slice(0, 49),
    ]);
  }

  async function addStaffMember(event: React.FormEvent) {
    event.preventDefault();

    const email = staffForm.email.trim().toLowerCase();
    const fullName = staffForm.fullName.trim();

    if (!email) {
      showSuccess("Enter the staff email address.");
      return;
    }

    if (!isSuperAdmin) {
      showSuccess("Only Super Admin can add staff members.");
      return;
    }

    if (!supabase || !user) {
      const newStaff: StaffMember = {
        email,
        fullName,
        role: staffForm.role,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setStaffMembers((current) => [
        newStaff,
        ...current.filter((member) => member.email !== email),
      ]);
      setStaffForm({ email: "", fullName: "", role: "Agent" });
      showSuccess("Demo staff member added.");
      return;
    }

    const { error } = await supabase.from("admin_users").insert({
      email,
      full_name: fullName || null,
      role: staffForm.role,
      is_active: true,
    });

    if (error) {
      console.error(error);
      showSuccess(
        error.message || "Unable to add staff member. Make sure you are Super Admin."
      );
      return;
    }

    await createAdminActivityLog(
      "Staff member added",
      "Staff",
      email,
      `${fullName || email} was added as ${staffForm.role}.`
    );
    await loadDatabaseStaffMembers();
    setStaffForm({ email: "", fullName: "", role: "Agent" });
    showSuccess(
      "Staff member added. Also create their login password in Supabase Authentication > Users."
    );
  }

  async function updateStaffMemberRole(email: string, role: StaffRole) {
    if (!isSuperAdmin) {
      showSuccess("Only Super Admin can change staff roles.");
      return;
    }

    if (!supabase || !user) {
      setStaffMembers((current) =>
        current.map((member) =>
          member.email === email ? { ...member, role } : member
        )
      );
      return;
    }

    const { error } = await supabase
      .from("admin_users")
      .update({ role })
      .eq("email", email);

    if (error) {
      console.error(error);
      showSuccess(error.message || "Unable to update staff role.");
      return;
    }

    await createAdminActivityLog(
      "Staff role updated",
      "Staff",
      email,
      `${email} role changed to ${role}.`
    );
    await loadDatabaseStaffMembers();
    showSuccess("Staff role updated.");
  }

  async function toggleStaffMemberActive(email: string, isActive: boolean) {
    if (!isSuperAdmin) {
      showSuccess("Only Super Admin can activate or deactivate staff.");
      return;
    }

    if (email === user?.email && !isActive) {
      showSuccess("You cannot deactivate your own active staff account.");
      return;
    }

    if (!supabase || !user) {
      setStaffMembers((current) =>
        current.map((member) =>
          member.email === email ? { ...member, isActive } : member
        )
      );
      return;
    }

    const { error } = await supabase
      .from("admin_users")
      .update({ is_active: isActive })
      .eq("email", email);

    if (error) {
      console.error(error);
      showSuccess(error.message || "Unable to update staff access.");
      return;
    }

    await createAdminActivityLog(
      isActive ? "Staff activated" : "Staff deactivated",
      "Staff",
      email,
      `${email} access changed to ${isActive ? "Active" : "Inactive"}.`
    );
    await loadDatabaseStaffMembers();
    showSuccess(isActive ? "Staff member activated." : "Staff member deactivated.");
  }

  async function deleteStaffMember(email: string) {
    if (!isSuperAdmin) {
      showSuccess("Only Super Admin can remove staff members.");
      return;
    }

    if (email === user?.email) {
      showSuccess("You cannot remove your own staff account.");
      return;
    }

    if (!window.confirm(`Remove ${email} from staff access?`)) return;

    if (!supabase || !user) {
      setStaffMembers((current) =>
        current.filter((member) => member.email !== email)
      );
      return;
    }

    const { error } = await supabase.from("admin_users").delete().eq("email", email);

    if (error) {
      console.error(error);
      showSuccess(error.message || "Unable to remove staff member.");
      return;
    }

    await createAdminActivityLog(
      "Staff member removed",
      "Staff",
      email,
      `${email} was removed from admin_users.`
    );
    await loadDatabaseStaffMembers();
    showSuccess("Staff member removed.");
  }

  async function createStaffNotification(
    title: string,
    message: string,
    type = "General"
  ) {
    const newNotification: Omit<StaffNotification, "id"> = {
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    if (supabase) {
      const { error } = await supabase.from("staff_notifications").insert({
        title,
        message,
        type,
        is_read: false,
      });

      if (error) {
        console.error(error);
        return;
      }

      if (adminUnlocked) {
        await loadDatabaseStaffNotifications();
      }

      return;
    }

    setStaffNotifications((current) => [
      { ...newNotification, id: Date.now() },
      ...current,
    ]);
  }

  async function markNotificationRead(id: number) {
    if (supabase) {
      const { error } = await supabase
        .from("staff_notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to mark notification as read.");
        return;
      }

      await loadDatabaseStaffNotifications();
    } else {
      setStaffNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
    }

    showSuccess("Notification marked as read.");
  }

  async function markAllNotificationsRead() {
    if (supabase) {
      const { error } = await supabase
        .from("staff_notifications")
        .update({ is_read: true })
        .eq("is_read", false);

      if (error) {
        console.error(error);
        showSuccess("Unable to mark notifications as read.");
        return;
      }

      await loadDatabaseStaffNotifications();
    } else {
      setStaffNotifications((current) =>
        current.map((notification) => ({ ...notification, isRead: true }))
      );
    }

    showSuccess("All notifications marked as read.");
  }

  async function deleteStaffNotification(id: number) {
    if (supabase) {
      const { error } = await supabase
        .from("staff_notifications")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to delete notification.");
        return;
      }

      await loadDatabaseStaffNotifications();
    } else {
      setStaffNotifications((current) =>
        current.filter((notification) => notification.id !== id)
      );
    }

    showSuccess("Notification deleted.");
  }

  async function approveListing(id: number) {
    if (!canApproveListings) {
      showSuccess("Your role cannot approve property listings.");
      return;
    }

    const listingToApprove = listings.find((listing) => listing.id === id);

    if (listingToApprove && !isListingVerificationComplete(listingToApprove)) {
      showSuccess("Complete the verification checklist before approving this listing.");
      return;
    }

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

    await createAdminActivityLog(
      "Approved property listing",
      "Listing",
      String(id),
      listingToApprove ? `${listingToApprove.title} was approved and made public.` : "Listing approved."
    );

    showSuccess("Listing approved.");
  }

  async function deleteListing(id: number) {
    if (!canDeleteListings) {
      showSuccess("Your role cannot delete property listings.");
      return;
    }

    const listingToDelete = listings.find((listing) => listing.id === id);

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

    await createAdminActivityLog(
      "Deleted property listing",
      "Listing",
      String(id),
      listingToDelete ? `${listingToDelete.title} was deleted.` : "Listing deleted."
    );

    showSuccess("Listing deleted.");
  }

  async function updateInvestorRequestStatus(id: number, status: LeadStatus) {
    if (!canManageLeads) {
      showSuccess("Your role cannot update lead status.");
      return;
    }

    const requestToUpdate = investorRequests.find((request) => request.id === id);

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

    await createAdminActivityLog(
      `Marked investor request ${status}`,
      "Investor Request",
      String(id),
      requestToUpdate ? `${requestToUpdate.name} / ${requestToUpdate.interest}` : "Investor request status updated."
    );

    showSuccess(`Investor request marked as ${status}.`);
  }

  async function updatePropertyInquiryStatus(id: number, status: LeadStatus) {
    if (!canManageLeads) {
      showSuccess("Your role cannot update lead status.");
      return;
    }

    const inquiryToUpdate = propertyInquiries.find((inquiry) => inquiry.id === id);

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

    await createAdminActivityLog(
      `Marked property inquiry ${status}`,
      "Property Inquiry",
      String(id),
      inquiryToUpdate ? `${inquiryToUpdate.name} / ${inquiryToUpdate.listingTitle}` : "Property inquiry status updated."
    );

    showSuccess(`Property inquiry marked as ${status}.`);
  }

  async function deleteInvestorRequest(id: number) {
    if (!canDeleteLeads) {
      showSuccess("Your role cannot delete leads.");
      return;
    }

    const requestToDelete = investorRequests.find((request) => request.id === id);

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

    await createAdminActivityLog(
      "Deleted investor request",
      "Investor Request",
      String(id),
      requestToDelete ? `${requestToDelete.name} / ${requestToDelete.interest}` : "Investor request deleted."
    );

    showSuccess("Investor request removed.");
  }

  async function deletePropertyInquiry(id: number) {
    if (!canDeleteLeads) {
      showSuccess("Your role cannot delete leads.");
      return;
    }

    const inquiryToDelete = propertyInquiries.find((inquiry) => inquiry.id === id);

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

    await createAdminActivityLog(
      "Deleted property inquiry",
      "Property Inquiry",
      String(id),
      inquiryToDelete ? `${inquiryToDelete.name} / ${inquiryToDelete.listingTitle}` : "Property inquiry deleted."
    );

    showSuccess("Property inquiry removed.");
  }

  async function updateContactMessageStatus(id: number, status: LeadStatus) {
    if (!canManageLeads) {
      showSuccess("Your role cannot update lead status.");
      return;
    }

    const messageToUpdate = contactMessages.find((message) => message.id === id);

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

    await createAdminActivityLog(
      `Marked contact message ${status}`,
      "Contact Message",
      String(id),
      messageToUpdate ? `${messageToUpdate.name} / ${messageToUpdate.subject}` : "Contact message status updated."
    );

    showSuccess(`Contact message marked as ${status}.`);
  }

  async function deleteContactMessage(id: number) {
    if (!canDeleteLeads) {
      showSuccess("Your role cannot delete leads.");
      return;
    }

    const messageToDelete = contactMessages.find((message) => message.id === id);

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

    await createAdminActivityLog(
      "Deleted contact message",
      "Contact Message",
      String(id),
      messageToDelete ? `${messageToDelete.name} / ${messageToDelete.subject}` : "Contact message deleted."
    );

    showSuccess("Contact message removed.");
  }

  async function updateInspectionBookingStatus(id: number, status: InspectionStatus) {
    if (!canManageLeads) {
      showSuccess("Your role cannot update inspection booking status.");
      return;
    }

    const bookingToUpdate = inspectionBookings.find((booking) => booking.id === id);

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

    await createAdminActivityLog(
      `Marked inspection booking ${status}`,
      "Inspection Booking",
      String(id),
      bookingToUpdate ? `${bookingToUpdate.name} / ${bookingToUpdate.listingTitle}` : "Inspection booking status updated."
    );

    showSuccess(`Inspection booking marked as ${status}.`);
  }

  async function deleteInspectionBooking(id: number) {
    if (!canDeleteLeads) {
      showSuccess("Your role cannot delete bookings.");
      return;
    }

    const bookingToDelete = inspectionBookings.find((booking) => booking.id === id);

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



  function getAssignedStaffLabel(email?: string) {
    if (!email) return "Unassigned";

    const staffMember = staffMembers.find((member) => member.email === email);

    if (!staffMember) return email;

    return `${staffMember.fullName || staffMember.email} • ${staffMember.role}`;
  }

  function getLeadKindLabel(kind: LeadKind) {
    if (kind === "investor_requests") return "Investor Request";
    if (kind === "property_inquiries") return "Property Inquiry";
    if (kind === "contact_messages") return "Contact Message";
    return "Inspection Booking";
  }

  async function reloadLeadKind(kind: LeadKind) {
    if (kind === "investor_requests") await loadDatabaseInvestorRequests();
    if (kind === "property_inquiries") await loadDatabasePropertyInquiries();
    if (kind === "contact_messages") await loadDatabaseContactMessages();
    if (kind === "inspection_bookings") await loadDatabaseInspectionBookings();
  }

  function updateLocalLeadDraft(
    kind: LeadKind,
    id: number,
    changes: { assignedToEmail?: string; staffNotes?: string }
  ) {
    if (kind === "investor_requests") {
      setInvestorRequests((current) =>
        current.map((request) =>
          request.id === id ? { ...request, ...changes } : request
        )
      );
    }

    if (kind === "property_inquiries") {
      setPropertyInquiries((current) =>
        current.map((inquiry) =>
          inquiry.id === id ? { ...inquiry, ...changes } : inquiry
        )
      );
    }

    if (kind === "contact_messages") {
      setContactMessages((current) =>
        current.map((message) =>
          message.id === id ? { ...message, ...changes } : message
        )
      );
    }

    if (kind === "inspection_bookings") {
      setInspectionBookings((current) =>
        current.map((booking) =>
          booking.id === id ? { ...booking, ...changes } : booking
        )
      );
    }
  }

  async function updateLeadAssignment(
    kind: LeadKind,
    id: number,
    assignedToEmail: string
  ) {
    if (!canManageLeads) {
      showSuccess("Your role cannot assign leads.");
      return;
    }

    const cleanEmail = assignedToEmail || "";

    if (supabase) {
      const { error } = await supabase
        .from(kind)
        .update({ assigned_to_email: cleanEmail || null })
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to assign this lead. Check staff permissions.");
        return;
      }

      await reloadLeadKind(kind);
    } else {
      updateLocalLeadDraft(kind, id, { assignedToEmail: cleanEmail });
    }

    await createAdminActivityLog(
      cleanEmail ? "Assigned lead to staff" : "Unassigned lead",
      getLeadKindLabel(kind),
      String(id),
      cleanEmail ? `Assigned to ${cleanEmail}.` : "Lead assignment removed."
    );

    showSuccess(cleanEmail ? `Lead assigned to ${cleanEmail}.` : "Lead unassigned.");
  }

  async function saveLeadStaffNotes(kind: LeadKind, id: number, staffNotes: string) {
    if (!canManageLeads) {
      showSuccess("Your role cannot save staff notes.");
      return;
    }

    if (supabase) {
      const { error } = await supabase
        .from(kind)
        .update({ staff_notes: staffNotes || null })
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to save staff notes.");
        return;
      }

      await reloadLeadKind(kind);
    } else {
      updateLocalLeadDraft(kind, id, { staffNotes });
    }

    await createAdminActivityLog(
      "Updated staff lead notes",
      getLeadKindLabel(kind),
      String(id),
      staffNotes || "Staff notes cleared."
    );

    showSuccess("Staff notes saved.");
  }

  function renderLeadAssignmentControls(
    kind: LeadKind,
    id: number,
    assignedToEmail?: string,
    staffNotes?: string
  ) {
    return (
      <div className="mt-4 rounded-2xl border border-slate-200 bg-[#f7f8fb] p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Assigned staff
            </span>
            <select
              value={assignedToEmail || ""}
              onChange={(event) => updateLeadAssignment(kind, id, event.target.value)}
              disabled={!canManageLeads || assignableStaffMembers.length === 0}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none transition focus:border-[#0d1c38] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">Unassigned</option>
              {assignableStaffMembers.map((member) => (
                <option key={member.email} value={member.email}>
                  {member.fullName || member.email} — {member.role}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Current owner
            </p>
            <p className="mt-2 text-sm font-black text-[#0d1c38]">
              {getAssignedStaffLabel(assignedToEmail)}
            </p>
            {assignableStaffMembers.length === 0 && (
              <p className="mt-1 text-xs font-bold text-red-500">
                Add active staff members first.
              </p>
            )}
          </div>
        </div>

        <label className="mt-3 block">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Private staff notes
          </span>
          <textarea
            value={staffNotes || ""}
            onChange={(event) =>
              updateLocalLeadDraft(kind, id, { staffNotes: event.target.value })
            }
            disabled={!canManageLeads}
            rows={2}
            placeholder="Example: Called client, prefers Lekki, follow up tomorrow."
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#0d1c38] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          />
        </label>

        <button
          onClick={() => saveLeadStaffNotes(kind, id, staffNotes || "")}
          disabled={!canManageLeads}
          className="mt-3 rounded-full bg-[#0d1c38] px-5 py-2.5 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Save staff notes
        </button>
      </div>
    );
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
    if (!canExportReports) {
      showSuccess("Your role cannot export reports.");
      return;
    }

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
        "Document Title",
        "Document Status",
        "Document Details",
        "Document File URL",
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
        listing.documentTitle || "",
        listing.documentStatus || "",
        listing.documentDetails || "",
        listing.documentFileUrl || "",
        listing.status,
        listing.ownerName || "",
        listing.ownerPhone || "",
        listing.imageUrl || "",
        listing.createdAt || "",
      ])
    );
  }

  function exportInvestorRequestsCsv() {
    if (!canExportReports) {
      showSuccess("Your role cannot export reports.");
      return;
    }

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
        "Assigned To",
        "Staff Notes",
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
        request.assignedToEmail || "",
        request.staffNotes || "",
        request.message || "",
        request.createdAt,
      ])
    );
  }

  function exportPropertyInquiriesCsv() {
    if (!canExportReports) {
      showSuccess("Your role cannot export reports.");
      return;
    }

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
        "Assigned To",
        "Staff Notes",
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
        inquiry.assignedToEmail || "",
        inquiry.staffNotes || "",
        inquiry.message || "",
        inquiry.createdAt,
      ])
    );
  }

  function exportContactMessagesCsv() {
    if (!canExportReports) {
      showSuccess("Your role cannot export reports.");
      return;
    }

    downloadCsv(
      "inamaad-contact-messages.csv",
      [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Subject",
        "Status",
        "Assigned To",
        "Staff Notes",
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
        message.assignedToEmail || "",
        message.staffNotes || "",
        message.message || "",
        message.createdAt,
      ])
    );
  }

  function exportInspectionBookingsCsv() {
    if (!canExportReports) {
      showSuccess("Your role cannot export reports.");
      return;
    }

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
        "Assigned To",
        "Staff Notes",
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
        booking.assignedToEmail || "",
        booking.staffNotes || "",
        booking.message || "",
        booking.createdAt,
      ])
    );
  }

  function exportPropertyViewsCsv() {
    if (!canExportReports) {
      showSuccess("Your role cannot export reports.");
      return;
    }

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
    if (!canExportReports) {
      showSuccess("Your role cannot export reports.");
      return;
    }

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
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.1fr]">
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
                    {propertyTypeOptions.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>

                  <select
                    value={listingPurpose}
                    onChange={(event) => setListingPurpose(event.target.value)}
                    className="h-14 rounded-2xl border border-slate-200 px-5 text-base outline-none transition focus:border-[#0d1c38]"
                    aria-label="Listing purpose"
                  >
                    <option>All Purposes</option>
                    {listingPurposeOptions.map((purpose) => (
                      <option key={purpose}>{purpose}</option>
                    ))}
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
                "Apartment / Flat",
                "Bungalow",
                "Terrace Duplex",
                "Duplex",
                "Land",
                "Commercial",
                "Office Space",
                "Shop / Retail Space",
                "Warehouse",
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
                    setListingPurpose("All Purposes");
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

              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
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
                  value={listingPurpose}
                  onChange={(event) => setListingPurpose(event.target.value)}
                  className="h-14 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#0d1c38]"
                  aria-label="Listing purpose"
                >
                  <option>All Purposes</option>
                  {listingPurposeOptions.map((purpose) => (
                    <option key={purpose}>{purpose}</option>
                  ))}
                </select>

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

        <section id="calculator" className="bg-white px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-[3px] w-14 bg-[#f0bf3c]" />
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#d39b19]">
                    Investment calculator
                  </p>
                </div>

                <h2 className="text-4xl font-black tracking-tight text-[#0d1c38] md:text-6xl">
                  Estimate rental income, appreciation, and ROI before you invest.
                </h2>

                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                  Use this quick calculator to estimate the potential return of a property opportunity. It is for planning only; final figures should be verified during due diligence.
                </p>

                <div className="mt-7 rounded-[28px] border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-900">
                  <strong>Tip:</strong> Use realistic rent and growth assumptions. For premium Lagos and Abuja locations, update the growth rate based on the specific area, title quality, demand, and infrastructure.
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-[#f7f8fb] p-6 shadow-xl shadow-slate-200/70">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      Purchase price / value
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={calculatorForm.purchasePrice}
                      onChange={(event) =>
                        setCalculatorForm({ ...calculatorForm, purchasePrice: event.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      Expected yearly rent
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={calculatorForm.annualRent}
                      onChange={(event) =>
                        setCalculatorForm({ ...calculatorForm, annualRent: event.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      Annual growth %
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={calculatorForm.annualGrowth}
                      onChange={(event) =>
                        setCalculatorForm({ ...calculatorForm, annualGrowth: event.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      Holding years
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={calculatorForm.holdingYears}
                      onChange={(event) =>
                        setCalculatorForm({ ...calculatorForm, holdingYears: event.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </label>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    ["Future property value", formatNairaCompact(calculatorFutureValue)],
                    ["Total rental income", formatNairaCompact(calculatorTotalRent)],
                    ["Estimated capital gain", formatNairaCompact(calculatorEstimatedGain)],
                    ["Estimated total ROI", `${calculatorRoi}%`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-3xl bg-white p-5 shadow-sm">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        {label}
                      </p>
                      <p className="mt-2 text-2xl font-black text-[#0d1c38]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setModal("investor")}
                  className="mt-6 w-full rounded-2xl bg-[#0d1c38] px-7 py-4 text-sm font-black text-white hover:bg-[#13284f]"
                >
                  Request investor guidance
                </button>
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
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-slate-700">
                  <p className="font-black text-[#0d1c38]">Need help? Use examples like these:</p>
                  <p className="mt-2"><span className="font-black">Title:</span> 4 Bedroom Smart Duplex in Lekki Phase 1</p>
                  <p><span className="font-black">Investment highlight:</span> Estimated 14% yearly appreciation with strong rental demand</p>
                  <p><span className="font-black">Opportunity:</span> A verified property in a fast-growing location, suitable for rental income, resale value, or long-term investment.</p>
                  <p className="mt-2 rounded-xl bg-white px-3 py-2 text-slate-600"><span className="font-black text-[#0d1c38]">Quick guide:</span> choose the building/asset under Property type, then choose For Sale, For Rent, Short Let, Lease, Investment, or JV under Listing purpose.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    value={postForm.title}
                    onChange={(event) =>
                      setPostForm({ ...postForm, title: event.target.value })
                    }
                    placeholder="Property title, e.g. 4 Bedroom Terrace Duplex in Lekki Phase 1"
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
                  <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 focus-within:border-[#0d1c38]">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Price currency
                    </label>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="rounded-full bg-[#0d1c38] px-3 py-2 text-xs font-black text-white">
                        ₦ NGN
                      </span>
                      <input
                        required
                        inputMode="numeric"
                        value={postForm.price}
                        onChange={(event) =>
                          setPostForm({
                            ...postForm,
                            price: formatPriceInput(event.target.value),
                          })
                        }
                        placeholder="Enter amount, e.g. 50000000"
                        className="w-full border-0 bg-transparent text-sm font-bold outline-none placeholder:font-normal"
                      />
                    </div>
                    <p className="mt-2 text-xs font-bold text-slate-500">
                      Auto calculated: {formatPricePreview(postForm.price)}
                    </p>
                  </div>

                  <select
                    value={postForm.type}
                    onChange={(event) =>
                      setPostForm({ ...postForm, type: event.target.value })
                    }
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    aria-label="Property type"
                  >
                    {propertyTypeOptions.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
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
                    aria-label="Listing purpose"
                  >
                    {listingPurposeOptions.map((purpose) => (
                      <option key={purpose}>{purpose}</option>
                    ))}
                  </select>

                  <input
                    value={postForm.yieldText}
                    onChange={(event) =>
                      setPostForm({
                        ...postForm,
                        yieldText: event.target.value,
                      })
                    }
                    placeholder="Investment highlight, e.g. Estimated 14% yearly appreciation"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />
                </div>

                <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
                  <p className="text-sm font-black text-[#0d1c38]">Property document / title papers</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Add the title document buyers expect to see, for example C of O, R of O, Governor's Consent, Deed of Assignment, Survey Plan, Excision, or Gazette.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <select
                      value={postForm.documentTitle}
                      onChange={(event) =>
                        setPostForm({ ...postForm, documentTitle: event.target.value })
                      }
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Document title"
                    >
                      {documentTitleOptions.map((documentTitle) => (
                        <option key={documentTitle}>{documentTitle}</option>
                      ))}
                    </select>

                    <select
                      value={postForm.documentStatus}
                      onChange={(event) =>
                        setPostForm({ ...postForm, documentStatus: event.target.value })
                      }
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Document status"
                    >
                      {documentStatusOptions.map((documentStatus) => (
                        <option key={documentStatus}>{documentStatus}</option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    value={postForm.documentDetails}
                    onChange={(event) =>
                      setPostForm({ ...postForm, documentDetails: event.target.value })
                    }
                    placeholder="Optional document details, e.g. Survey plan available, Deed of Assignment executed, C of O processing, Gazette number, allocation file number..."
                    rows={3}
                    className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <div className="mt-4 rounded-2xl border border-dashed border-amber-300 bg-white p-5">
                    <label className="text-sm font-black text-[#0d1c38]">
                      Upload title document file
                    </label>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Optional but recommended. Upload PDF, JPG, PNG, or WEBP under 10MB, such as C of O, survey plan, deed, allocation letter, or approval paper.
                    </p>
                    <input
                      type="file"
                      accept="application/pdf,image/jpeg,image/png,image/webp"
                      onChange={(event) =>
                        setPostDocumentFile(event.target.files?.[0] || null)
                      }
                      className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    {postDocumentFile && (
                      <p className="mt-3 text-xs font-bold text-emerald-700">
                        Document selected: {postDocumentFile.name}
                      </p>
                    )}
                  </div>
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
                  placeholder="Describe the opportunity, e.g. A verified property in a fast-growing location suitable for rental income, resale value, or long-term investment."
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
                    placeholder="Owner/developer name, e.g. INAMAAD Homes Ltd"
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
                    placeholder="Phone number, e.g. 08106350486"
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
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-slate-700">
                  <p className="font-black text-[#0d1c38]">Admin writing guide:</p>
                  <p className="mt-2"><span className="font-black">Title:</span> Luxury Apartments in Maitama, Abuja</p>
                  <p><span className="font-black">Investment highlight:</span> Premium capital appreciation in Abuja’s prime district</p>
                  <p><span className="font-black">Opportunity:</span> Explain the location, buyer/investor benefit, rental potential, documents, and why the property is valuable.</p>
                </div>

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
                    placeholder="Property title, e.g. 4 Bedroom Terrace Duplex in Lekki Phase 1"
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
                  <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 focus-within:border-[#0d1c38]">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Price currency
                    </label>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="rounded-full bg-[#0d1c38] px-3 py-2 text-xs font-black text-white">
                        ₦ NGN
                      </span>
                      <input
                        required
                        inputMode="numeric"
                        value={editForm.price}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            price: formatPriceInput(event.target.value),
                          })
                        }
                        placeholder="Enter amount, e.g. 50000000"
                        className="w-full border-0 bg-transparent text-sm font-bold outline-none placeholder:font-normal"
                      />
                    </div>
                    <p className="mt-2 text-xs font-bold text-slate-500">
                      Auto calculated: {formatPricePreview(editForm.price)}
                    </p>
                  </div>

                  <select
                    value={editForm.type}
                    onChange={(event) =>
                      setEditForm({ ...editForm, type: event.target.value })
                    }
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    aria-label="Property type"
                  >
                    {propertyTypeOptions.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <select
                    value={editForm.category}
                    onChange={(event) =>
                      setEditForm({ ...editForm, category: event.target.value })
                    }
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    aria-label="Listing purpose"
                  >
                    {listingPurposeOptions.map((purpose) => (
                      <option key={purpose}>{purpose}</option>
                    ))}
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

                <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
                  <p className="text-sm font-black text-[#0d1c38]">Property document / title papers</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Keep this accurate. Examples: C of O, R of O, Governor's Consent, Deed of Assignment, Survey Plan, Excision, Gazette.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <select
                      value={editForm.documentTitle}
                      onChange={(event) =>
                        setEditForm({ ...editForm, documentTitle: event.target.value })
                      }
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Document title"
                    >
                      {documentTitleOptions.map((documentTitle) => (
                        <option key={documentTitle}>{documentTitle}</option>
                      ))}
                    </select>

                    <select
                      value={editForm.documentStatus}
                      onChange={(event) =>
                        setEditForm({ ...editForm, documentStatus: event.target.value })
                      }
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Document status"
                    >
                      {documentStatusOptions.map((documentStatus) => (
                        <option key={documentStatus}>{documentStatus}</option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    value={editForm.documentDetails}
                    onChange={(event) =>
                      setEditForm({ ...editForm, documentDetails: event.target.value })
                    }
                    placeholder="Optional document details, e.g. Survey plan available, C of O processing, registered deed number, allocation file number..."
                    rows={3}
                    className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <div className="mt-4 rounded-2xl border border-dashed border-amber-300 bg-white p-5">
                    <label className="text-sm font-black text-[#0d1c38]">
                      Replace title document file
                    </label>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Leave empty to keep the current document. Upload PDF, JPG, PNG, or WEBP under 10MB. The file is stored privately and only staff can open it. The file is stored privately and only staff can open it.
                    </p>
                    {editForm.documentFileUrl && !editDocumentFile && (
                      <button
                        type="button"
                        onClick={() => openSecurePropertyDocument(editForm.documentFileUrl)}
                        disabled={!canOpenDocuments}
                        title={!canOpenDocuments ? "Your role cannot open secure documents" : "Open secure title document"}
                        className="mt-4 inline-flex rounded-2xl bg-[#0d1c38] px-4 py-3 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {canOpenDocuments ? "Open secure document" : "Secure document locked"}
                      </button>
                    )}
                    <input
                      type="file"
                      accept="application/pdf,image/jpeg,image/png,image/webp"
                      onChange={(event) =>
                        setEditDocumentFile(event.target.files?.[0] || null)
                      }
                      className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    {editDocumentFile && (
                      <p className="mt-3 text-xs font-bold text-emerald-700">
                        New document selected: {editDocumentFile.name}
                      </p>
                    )}
                  </div>
                </div>


                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-black text-[#0d1c38]">Admin verification checklist</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Complete these checks before approving a property as verified.
                      </p>
                    </div>
                    <span className={`rounded-full px-4 py-2 text-xs font-black ${isListingVerificationComplete({
                      ...editingListing,
                      titleVerified: editForm.titleVerified,
                      ownerVerified: editForm.ownerVerified,
                      siteInspected: editForm.siteInspected,
                      priceChecked: editForm.priceChecked,
                      legalReviewStatus: editForm.legalReviewStatus as Listing["legalReviewStatus"],
                    }) ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-800"}`}>
                      {isListingVerificationComplete({
                        ...editingListing,
                        titleVerified: editForm.titleVerified,
                        ownerVerified: editForm.ownerVerified,
                        siteInspected: editForm.siteInspected,
                        priceChecked: editForm.priceChecked,
                        legalReviewStatus: editForm.legalReviewStatus as Listing["legalReviewStatus"],
                      }) ? "Ready for approval" : "Verification incomplete"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {[
                      ["titleVerified", "Title document checked"],
                      ["ownerVerified", "Owner identity verified"],
                      ["siteInspected", "Site inspection done"],
                      ["priceChecked", "Price checked against market"],
                    ].map(([key, label]) => (
                      <label key={key} className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-black text-[#0d1c38]">
                        <input
                          type="checkbox"
                          checked={Boolean(editForm[key as keyof typeof editForm])}
                          onChange={(event) =>
                            setEditForm({ ...editForm, [key]: event.target.checked })
                          }
                          className="h-5 w-5 accent-emerald-600"
                        />
                        {label}
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <select
                      value={editForm.legalReviewStatus}
                      onChange={(event) =>
                        setEditForm({ ...editForm, legalReviewStatus: event.target.value })
                      }
                      className="rounded-2xl border border-emerald-200 bg-white px-5 py-4 text-sm outline-none focus:border-emerald-600"
                      aria-label="Legal review status"
                    >
                      {legalReviewStatusOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>

                    <input
                      value={verificationSummary({
                        ...editingListing,
                        titleVerified: editForm.titleVerified,
                        ownerVerified: editForm.ownerVerified,
                        siteInspected: editForm.siteInspected,
                        priceChecked: editForm.priceChecked,
                        legalReviewStatus: editForm.legalReviewStatus as Listing["legalReviewStatus"],
                      })}
                      readOnly
                      className="rounded-2xl border border-emerald-200 bg-white px-5 py-4 text-sm font-black text-emerald-700 outline-none"
                      aria-label="Verification summary"
                    />
                  </div>

                  <textarea
                    value={editForm.verificationNotes}
                    onChange={(event) =>
                      setEditForm({ ...editForm, verificationNotes: event.target.value })
                    }
                    placeholder="Verification notes, e.g. C of O sighted, owner ID checked, site inspected by agent, legal team cleared document."
                    rows={3}
                    className="mt-4 w-full rounded-2xl border border-emerald-200 bg-white px-5 py-4 text-sm outline-none focus:border-emerald-600"
                  />
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
                  placeholder="Investment highlight, e.g. Estimated 14% yearly appreciation"
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
                  placeholder="Describe the opportunity, e.g. A verified property in a fast-growing location suitable for rental income, resale value, or long-term investment."
                  rows={4}
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value={editForm.ownerName}
                    onChange={(event) =>
                      setEditForm({ ...editForm, ownerName: event.target.value })
                    }
                    placeholder="Owner/developer name, e.g. INAMAAD Homes Ltd"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <input
                    value={editForm.ownerPhone}
                    onChange={(event) =>
                      setEditForm({ ...editForm, ownerPhone: event.target.value })
                    }
                    placeholder="Phone number, e.g. 08106350486"
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
                    placeholder="Phone number, e.g. 08106350486"
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
                  {investorInterestOptions.map((interest) => (
                    <option key={interest}>{interest}</option>
                  ))}
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

                    {(selectedListing.documentTitle || selectedListing.documentDetails) && (
                      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-slate-700">
                        <p className="font-black text-[#0d1c38]">Title document</p>
                        <p className="mt-2">
                          <span className="font-black">Document:</span>{" "}
                          {selectedListing.documentTitle || "Not stated"}
                        </p>
                        <p>
                          <span className="font-black">Status:</span>{" "}
                          {selectedListing.documentStatus || "Pending"}
                        </p>
                        {selectedListing.documentDetails && (
                          <p className="mt-2 text-slate-600">
                            {selectedListing.documentDetails}
                          </p>
                        )}
                        {selectedListing.documentFileUrl && (
                          <div className="mt-4 rounded-2xl border border-amber-200 bg-white p-4 text-xs font-bold text-slate-600">
                            Uploaded title document is securely stored. Public users can see the document type and verification status, but only signed-in staff can open the actual file.
                          </div>
                        )}
                      </div>
                    )}
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
                        <p className="text-slate-400">Document title</p>
                        <p className="font-black">
                          {selectedListing.documentTitle || "Not stated"}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400">Document status</p>
                        <p className="font-black text-[#f0bf3c]">
                          {selectedListing.documentStatus || "Pending"}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400">Document file</p>
                        <p className="font-black">
                          {selectedListing.documentFileUrl ? "Uploaded" : "Not uploaded"}
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

                <div className="rounded-[2rem] border border-[#d49613]/30 bg-amber-50 p-5 text-sm text-amber-900">
                  <p className="font-black text-[#0d1c38]">Current staff role: {currentStaffRole}</p>
                  <p className="mt-2 leading-6">
                    Access enabled: {canEditListings ? "edit listings" : "read listings"}, {canApproveListings ? "approve listings" : "no approval"}, {canManageLeads ? "manage leads" : "read-only leads"}, {canOpenDocuments ? "secure documents" : "documents locked"}, {canExportReports ? "reports" : "no report export"}.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-9">
                  <div className="rounded-2xl bg-[#f7f8fb] p-5">
                    <p className="text-2xl font-black text-[#0d1c38]">
                      {unreadNotifications}
                    </p>
                    <p className="text-sm text-slate-500">New alerts</p>
                  </div>

                  <div className="rounded-2xl bg-[#f7f8fb] p-5">
                    <p className="text-2xl font-black text-[#0d1c38]">
                      {activeStaffCount}
                    </p>
                    <p className="text-sm text-slate-500">Active staff</p>
                  </div>

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

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d49613]">
                        Staff notification center
                      </p>
                      <h3 className="mt-2 text-xl font-black text-[#0d1c38]">
                        New platform activity
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Alerts for new investor requests, property inquiries, contact messages, inspection bookings, and pending property submissions.
                      </p>
                    </div>

                    <button
                      onClick={markAllNotificationsRead}
                      className="rounded-full bg-[#0d1c38] px-5 py-2 text-xs font-black text-white"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {staffNotifications.length === 0 && (
                      <p className="rounded-2xl bg-[#f7f8fb] p-5 text-sm text-slate-500">
                        No staff notifications yet. New activity will appear here.
                      </p>
                    )}

                    {staffNotifications.slice(0, 12).map((notification) => (
                      <div
                        key={notification.id}
                        className={`rounded-2xl border p-5 ${
                          notification.isRead
                            ? "border-slate-200 bg-white"
                            : "border-[#f0bf3c] bg-[#fff8e5]"
                        }`}
                      >
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-[#0d1c38] px-3 py-1 text-[11px] font-black text-white">
                                {notification.type}
                              </span>

                              {!notification.isRead && (
                                <span className="rounded-full bg-[#f0bf3c] px-3 py-1 text-[11px] font-black text-[#0d1c38]">
                                  New
                                </span>
                              )}
                            </div>

                            <p className="mt-3 font-black text-[#0d1c38]">
                              {notification.title}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {notification.message}
                            </p>
                            <p className="mt-2 text-xs font-bold text-slate-400">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 md:justify-end">
                            {!notification.isRead && (
                              <button
                                onClick={() => markNotificationRead(notification.id)}
                                className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700"
                              >
                                Mark read
                              </button>
                            )}

                            <button
                              onClick={() => deleteStaffNotification(notification.id)}
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

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d49613]">
                        Admin audit log
                      </p>
                      <h3 className="mt-2 text-xl font-black text-[#0d1c38]">
                        Staff activity history
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Track approvals, edits, deletions, lead status changes, and secure document access.
                      </p>
                    </div>

                    <span className="rounded-full bg-[#0d1c38] px-5 py-2 text-xs font-black text-white">
                      {adminActivityLogs.length} records
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {adminActivityLogs.length === 0 && (
                      <p className="rounded-2xl bg-[#f7f8fb] p-5 text-sm text-slate-500">
                        No admin activity recorded yet. Staff actions will appear here.
                      </p>
                    )}

                    {adminActivityLogs.slice(0, 15).map((log) => (
                      <div
                        key={log.id}
                        className="rounded-2xl border border-slate-200 bg-[#f7f8fb] p-5"
                      >
                        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                          <div>
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full bg-[#0d1c38] px-3 py-1 text-[11px] font-black text-white">
                                {log.targetType}
                              </span>
                              <span className="rounded-full bg-[#f0bf3c] px-3 py-1 text-[11px] font-black text-[#0d1c38]">
                                {log.adminEmail}
                              </span>
                            </div>

                            <p className="mt-3 font-black text-[#0d1c38]">
                              {log.action}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {log.details || "No extra details."}
                            </p>
                            <p className="mt-2 text-xs font-bold text-slate-400">
                              {formatDate(log.createdAt)}
                              {log.targetId ? ` • ID: ${log.targetId}` : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d49613]">
                        Staff management
                      </p>
                      <h3 className="mt-2 text-xl font-black text-[#0d1c38]">
                        Admin users and roles
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Add staff emails, assign roles, deactivate access, and keep your INAMAAD operations controlled. New staff must also exist in Supabase Authentication so they can log in with a password.
                      </p>
                    </div>

                    <span className="rounded-full bg-[#0d1c38] px-5 py-2 text-xs font-black text-white">
                      {staffMembers.length} staff
                    </span>
                  </div>

                  {!isSuperAdmin && (
                    <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">
                      Your current role is {currentStaffMember?.role || "Staff"}. Only Super Admin can add, remove, activate, or change staff roles.
                    </p>
                  )}

                  <form onSubmit={addStaffMember} className="mt-5 grid gap-3 rounded-2xl bg-[#f7f8fb] p-5 md:grid-cols-4">
                    <input
                      type="text"
                      value={staffForm.fullName}
                      onChange={(event) =>
                        setStaffForm({ ...staffForm, fullName: event.target.value })
                      }
                      placeholder="Full name, e.g. Aisha Bello"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      disabled={!isSuperAdmin}
                    />

                    <input
                      type="email"
                      value={staffForm.email}
                      onChange={(event) =>
                        setStaffForm({ ...staffForm, email: event.target.value })
                      }
                      placeholder="staff@email.com"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      disabled={!isSuperAdmin}
                    />

                    <select
                      value={staffForm.role}
                      onChange={(event) =>
                        setStaffForm({
                          ...staffForm,
                          role: event.target.value as StaffRole,
                        })
                      }
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      disabled={!isSuperAdmin}
                    >
                      {staffRoleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      disabled={!isSuperAdmin}
                      className="rounded-2xl bg-[#0d1c38] px-5 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      Add staff
                    </button>
                  </form>

                  <div className="mt-5 grid gap-3">
                    {staffMembers.length === 0 && (
                      <p className="rounded-2xl bg-[#f7f8fb] p-5 text-sm text-slate-500">
                        No staff members loaded yet. Make sure the staff management SQL policies were run.
                      </p>
                    )}

                    {staffMembers.map((member) => (
                      <div
                        key={member.email}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <div className="grid gap-4 md:grid-cols-[1.3fr_0.9fr_1.2fr] md:items-center">
                          <div>
                            <p className="font-black text-[#0d1c38]">
                              {member.fullName || member.email}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {member.email}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="rounded-full bg-[#f0bf3c] px-3 py-1 text-[11px] font-black text-[#0d1c38]">
                                {member.role}
                              </span>
                              <span
                                className={`rounded-full px-3 py-1 text-[11px] font-black ${
                                  member.isActive
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {member.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>

                          <select
                            value={member.role}
                            onChange={(event) =>
                              updateStaffMemberRole(
                                member.email,
                                event.target.value as StaffRole
                              )
                            }
                            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-[#0d1c38]"
                            disabled={!isSuperAdmin}
                          >
                            {staffRoleOptions.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>

                          <div className="flex flex-wrap gap-2 md:justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                toggleStaffMemberActive(member.email, !member.isActive)
                              }
                              disabled={!isSuperAdmin || member.email === user?.email}
                              className={`rounded-full px-4 py-2 text-xs font-black disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 ${
                                member.isActive
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {member.isActive ? "Deactivate" : "Activate"}
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteStaffMember(member.email)}
                              disabled={!isSuperAdmin || member.email === user?.email}
                              className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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
                              disabled={!canEditListings}
                              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => approveListing(listing.id)}
                              disabled={!canApproveListings || !isListingVerificationComplete(listing)}
                              title={!canApproveListings ? "Your role cannot approve listings" : !isListingVerificationComplete(listing) ? "Complete verification checklist first" : "Approve listing"}
                              className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                              {!canApproveListings ? "No approve access" : isListingVerificationComplete(listing) ? "Approve" : "Verify first"}
                            </button>

                            <button
                              onClick={() => deleteListing(listing.id)}
                              disabled={!canDeleteListings}
                              className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
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

                              {renderLeadAssignmentControls(
                                "property_inquiries",
                                inquiry.id,
                                inquiry.assignedToEmail,
                                inquiry.staffNotes
                              )}
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
                                disabled={!canManageLeads}
                                className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
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
                                disabled={!canManageLeads}
                                className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                              >
                                Contacted
                              </button>

                              <button
                                onClick={() =>
                                  updatePropertyInquiryStatus(inquiry.id, "Closed")
                                }
                                disabled={!canManageLeads}
                                className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                              >
                                Closed
                              </button>

                              <button
                                onClick={() => deletePropertyInquiry(inquiry.id)}
                                disabled={!canDeleteLeads}
                                className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
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

                              {renderLeadAssignmentControls(
                                "inspection_bookings",
                                booking.id,
                                booking.assignedToEmail,
                                booking.staffNotes
                              )}
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
                                disabled={!canManageLeads}
                                className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                              >
                                New
                              </button>

                              <button
                                onClick={() => updateInspectionBookingStatus(booking.id, "Scheduled")}
                                disabled={!canManageLeads}
                                className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                              >
                                Scheduled
                              </button>

                              <button
                                onClick={() => updateInspectionBookingStatus(booking.id, "Completed")}
                                disabled={!canManageLeads}
                                className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                              >
                                Completed
                              </button>

                              <button
                                onClick={() => updateInspectionBookingStatus(booking.id, "Cancelled")}
                                disabled={!canManageLeads}
                                className="rounded-full bg-red-100 px-4 py-2 text-xs font-black text-red-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                              >
                                Cancelled
                              </button>

                              <button
                                onClick={() => deleteInspectionBooking(booking.id)}
                                disabled={!canDeleteLeads}
                                className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
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

                              {renderLeadAssignmentControls(
                                "contact_messages",
                                message.id,
                                message.assignedToEmail,
                                message.staffNotes
                              )}
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
                                disabled={!canManageLeads}
                                className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                              >
                                New
                              </button>

                              <button
                                onClick={() =>
                                  updateContactMessageStatus(message.id, "Contacted")
                                }
                                disabled={!canManageLeads}
                                className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                              >
                                Contacted
                              </button>

                              <button
                                onClick={() => updateContactMessageStatus(message.id, "Closed")}
                                disabled={!canManageLeads}
                                className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                              >
                                Closed
                              </button>

                              <button
                                onClick={() => deleteContactMessage(message.id)}
                                disabled={!canDeleteLeads}
                                className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
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

                              {renderLeadAssignmentControls(
                                "investor_requests",
                                request.id,
                                request.assignedToEmail,
                                request.staffNotes
                              )}
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
                                disabled={!canManageLeads}
                                className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
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
                                disabled={!canManageLeads}
                                className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                              >
                                Contacted
                              </button>

                              <button
                                onClick={() =>
                                  updateInvestorRequestStatus(request.id, "Closed")
                                }
                                disabled={!canManageLeads}
                                className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                              >
                                Closed
                              </button>

                              <button
                                onClick={() => deleteInvestorRequest(request.id)}
                                disabled={!canDeleteLeads}
                                className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
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
                              disabled={!canEditListings}
                              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteListing(listing.id)}
                              disabled={!canDeleteListings}
                              className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
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
