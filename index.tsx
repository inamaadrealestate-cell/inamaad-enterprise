import React, { useEffect, useMemo, useRef, useState } from "react";
import { createClient, type User } from "@supabase/supabase-js";

type ModalType =
  | null
  | "signin"
  | "register"
  | "post"
  | "investor"
  | "admin"
  | "details"
  | "edit"
  | "guide"
  | "forgotPassword"
  | "resetPassword";

type ListingStatus = "Verified" | "Pending Review";
type AvailabilityStatus = "Available" | "Reserved" | "Sold" | "Rented" | "Leased" | "Off Market";
type JVDealStatus = "New JV" | "Under Review" | "Due Diligence" | "Negotiation" | "Agreement Drafting" | "Approved" | "Rejected" | "Closed";
type LeadStatus = "New" | "Contacted" | "Closed";
type LeadPriority = "Low" | "Normal" | "High" | "Urgent";
type InspectionStatus = "New" | "Scheduled" | "Completed" | "Cancelled";
type OfferStatus = "New" | "Reviewing" | "Accepted" | "Rejected" | "Closed";
type JVApplicationStatus = "New" | "Reviewing" | "Shortlisted" | "Accepted" | "Rejected" | "Closed";
type JVDocumentReviewStatus = "Not Reviewed" | "Under Review" | "Verified" | "Rejected";
type JVRiskLevel = "Low" | "Normal" | "High" | "Critical";
type LeadKind =
  | "investor_requests"
  | "property_inquiries"
  | "property_offers"
  | "jv_applications"
  | "contact_messages"
  | "inspection_bookings";

type Listing = {
  id: number;
  title: string;
  location: string;
  stateName?: string;
  cityArea?: string;
  fullAddress?: string;
  nearbyLandmark?: string;
  googleMapLink?: string;
  showExactAddress?: boolean;
  videoUrl?: string;
  virtualTourUrl?: string;
  droneVideoUrl?: string;
  showVideoPublicly?: boolean;
  price: string;
  value: number;
  agencyFee?: string;
  legalFee?: string;
  serviceCharge?: string;
  cautionFee?: string;
  surveyFee?: string;
  developmentFee?: string;
  totalEstimatedCost?: string;
  paymentPlanAvailable?: boolean;
  installmentDetails?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  toilets?: number | null;
  parkingSpaces?: number | null;
  landSize?: string;
  propertySize?: string;
  furnishingStatus?: string;
  propertyCondition?: string;
  amenities?: string;
  jvStructure?: string;
  jvLandContribution?: string;
  jvDeveloperRequirement?: string;
  jvInvestorRequirement?: string;
  jvSharingFormula?: string;
  jvProjectStage?: string;
  jvExpectedUnits?: string;
  jvEstimatedProjectCost?: string;
  jvCompletionTimeline?: string;
  jvTerms?: string;
  jvFeasibilityStudyUrl?: string;
  jvArchitecturalConceptUrl?: string;
  jvEstateLayoutUrl?: string;
  jvBoqUrl?: string;
  jvProposalDocumentUrl?: string;
  jvLandTitleStatus?: "Not Reviewed" | "Under Review" | "Verified" | "Rejected";
  jvDevelopmentApprovalStatus?: "Not Required" | "Not Reviewed" | "Under Review" | "Approved" | "Rejected";
  jvDealStatus?: JVDealStatus;
  jvNextAction?: string;
  jvNextActionDate?: string;
  jvInternalNotes?: string;
  neighborhoodOverview?: string;
  roadAccess?: string;
  powerSupply?: string;
  waterSupply?: string;
  securityFeatures?: string;
  nearbySchools?: string;
  nearbyHospitals?: string;
  nearbyMalls?: string;
  nearbyTransport?: string;
  distanceToMajorRoad?: string;
  estateFeatures?: string;
  type: string;
  category: string;
  yieldText: string;
  description: string;
  status: ListingStatus;
  availabilityStatus?: AvailabilityStatus;
  availabilityNote?: string;
  availableFrom?: string;
  ownerName?: string;
  ownerPhone?: string;
  contactRole?: string;
  companyName?: string;
  contactEmail?: string;
  contactWhatsapp?: string;
  contactAddress?: string;
  publicContactVisibility?: string;
  mandateStatus?: string;
  identityType?: string;
  identityNumber?: string;
  companyRegistrationNumber?: string;
  mandateDocumentStatus?: string;
  contactProfileVerified?: boolean;
  contactVerificationNotes?: string;
  identityDocumentUrl?: string;
  cacDocumentUrl?: string;
  mandateDocumentUrl?: string;
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

type PropertyImage = {
  id: number;
  listingId: number;
  imageUrl: string;
  caption?: string;
  displayOrder?: number;
  isMain?: boolean;
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
  priority?: LeadPriority;
  followUpDate?: string;
  lastContactedAt?: string;
  experienceRating?: number;
  financialCapacityRating?: number;
  trackRecordRating?: number;
  documentReviewStatus?: JVDocumentReviewStatus;
  riskLevel?: JVRiskLevel;
  evaluationNotes?: string;
  evaluatedByEmail?: string;
  evaluatedAt?: string;
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
  priority?: LeadPriority;
  followUpDate?: string;
  lastContactedAt?: string;
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
  priority?: LeadPriority;
  followUpDate?: string;
  lastContactedAt?: string;
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
  priority?: LeadPriority;
  followUpDate?: string;
  lastContactedAt?: string;
  createdAt: string;
};

type PropertyOffer = {
  id: number;
  listingId?: number | null;
  listingTitle: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  offerAmount: string;
  paymentPlan: string;
  message: string;
  status: OfferStatus;
  assignedToEmail?: string;
  staffNotes?: string;
  priority?: LeadPriority;
  followUpDate?: string;
  lastContactedAt?: string;
  createdAt: string;
};

type JVApplication = {
  id: number;
  listingId?: number | null;
  listingTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantRole: string;
  companyName?: string;
  budgetCapacity?: string;
  experienceSummary?: string;
  proposalMessage?: string;
  companyProfileUrl?: string;
  cacCertificateUrl?: string;
  portfolioUrl?: string;
  financialProofUrl?: string;
  proposalDocumentUrl?: string;
  otherDocumentUrl?: string;
  experienceRating?: number;
  financialCapacityRating?: number;
  trackRecordRating?: number;
  documentReviewStatus?: JVDocumentReviewStatus;
  riskLevel?: JVRiskLevel;
  evaluationNotes?: string;
  evaluatedByEmail?: string;
  evaluatedAt?: string;
  status: JVApplicationStatus;
  assignedToEmail?: string;
  staffNotes?: string;
  priority?: LeadPriority;
  followUpDate?: string;
  lastContactedAt?: string;
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
  { label: "JV\u00A0Deals", href: "#jv" },
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

const jvStructureOptions = [
  "Landowner + Developer JV",
  "Landowner + Investor JV",
  "Developer + Investor Partnership",
  "Equity Partnership",
  "Build-to-Sell JV",
  "Build-to-Rent JV",
  "Revenue Share",
  "Profit Share",
  "Other JV Structure",
];

const jvProjectStageOptions = [
  "Concept Stage",
  "Land Available",
  "Design / Approval Stage",
  "Seeking Developer",
  "Seeking Investor",
  "Under Negotiation",
  "Under Construction",
  "Completed Project",
];

const jvLandTitleStatusOptions = [
  "Not Reviewed",
  "Under Review",
  "Verified",
  "Rejected",
];

const jvDevelopmentApprovalStatusOptions = [
  "Not Required",
  "Not Reviewed",
  "Under Review",
  "Approved",
  "Rejected",
];

const jvDealStatusOptions: JVDealStatus[] = [
  "New JV",
  "Under Review",
  "Due Diligence",
  "Negotiation",
  "Agreement Drafting",
  "Approved",
  "Rejected",
  "Closed",
];

function isJointVentureListing(input: { type?: string; category?: string }) {
  const type = (input.type || "").toLowerCase();
  const category = (input.category || "").toLowerCase();
  return (
    type.includes("joint venture") ||
    type.includes("estate development") ||
    category.includes("joint venture") ||
    category.includes("jv")
  );
}

const furnishingStatusOptions = [
  "Not Specified",
  "Furnished",
  "Semi Furnished",
  "Unfurnished",
];

const propertyConditionOptions = [
  "Not Specified",
  "Newly Built",
  "Fairly Used",
  "Renovated",
  "Off-plan",
  "Under Construction",
];

const amenityOptions = [
  "24/7 Security",
  "CCTV",
  "Swimming Pool",
  "Gym",
  "Serviced Estate",
  "Constant Power",
  "Water Supply",
  "Borehole",
  "POP Ceiling",
  "Fitted Kitchen",
  "Wardrobes",
  "BQ",
  "Parking Space",
  "Paved Road",
  "Drainage",
  "Gated Estate",
];

const availabilityStatusOptions: AvailabilityStatus[] = [
  "Available",
  "Reserved",
  "Sold",
  "Rented",
  "Leased",
  "Off Market",
];

const contactRoleOptions = [
  "Owner",
  "Agent",
  "Developer",
  "Landlord",
  "Company",
  "Mandate Holder",
];

const publicContactVisibilityOptions = [
  "Hide Phone",
  "Show Phone",
  "Show WhatsApp",
  "Show Email",
  "Show All",
];

const mandateStatusOptions = [
  "Not Confirmed",
  "Direct Owner",
  "Authorized Agent",
  "Developer Mandate",
  "Company Mandate",
];

const identityTypeOptions = [
  "Not Provided",
  "NIN",
  "International Passport",
  "Driver's License",
  "Voter's Card",
  "CAC Certificate",
  "Company Representative ID",
  "Other",
];

const mandateDocumentStatusOptions = [
  "Not Provided",
  "Provided",
  "Under Review",
  "Verified",
  "Rejected",
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
    yieldText: "Premium capital appreciation in Abuja's prime district",
    description:
      "A high-end residential investment opportunity positioned for strong rental income, resale value, and long-term wealth preservation.",
    status: "Verified",
    availabilityStatus: "Available",
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
      "A premium commercial asset located in one of Lagos' strongest business districts, suitable for corporate tenants and long-term income.",
    status: "Verified",
    availabilityStatus: "Available",
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
    availabilityStatus: "Available",
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
    availabilityStatus: "Available",
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
    availabilityStatus: "Available",
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
    availabilityStatus: "Available",
    createdAt: new Date().toISOString(),
  },
];

const stats = [
  { value: "Verified", label: "Property review flow" },
  { value: "Secure", label: "Email-confirmed access" },
  { value: "JV-ready", label: "Partnership submissions" },
  { value: "36 + FCT", label: "Nigeria coverage" },
];

const categoryCards = [
  {
    title: "Buy & Rent",
    text: "Browse homes, apartments, duplexes, land, and commercial assets with cleaner details and direct enquiry options.",
  },
  {
    title: "Invest & Compare",
    text: "Use filters, ROI planning, property view insights, and investor requests to find opportunities that match your strategy.",
  },
  {
    title: "Partner Through JV",
    text: "Submit or apply for structured joint venture deals connecting landowners, developers, and capital partners.",
  },
];

const processSteps = [
  {
    title: "Discover",
    text: "Visitors search verified homes, land, commercial assets, investment listings, and JV opportunities across Nigeria.",
  },
  {
    title: "Engage",
    text: "Users can enquire, book inspections, make offers, request investor guidance, or apply for JV partnerships.",
  },
  {
    title: "Review & manage",
    text: "INAMAAD staff review listings, applications, documents, leads, property views, and activity inside the admin portal.",
  },
];

const verificationItems = [
  "Email-confirmed user access",
  "Property, ownership, and document review",
  "Role-based staff/admin control",
  "Protected public forms and secure storage rules",
];

const faqItems = [
  {
    question: "What can users do on INAMAAD?",
    answer:
      "Users can browse properties and JV deals, view details, submit enquiries, book inspections, make offers, request investor guidance, and apply for JV partnerships.",
  },
  {
    question: "Can property owners and developers submit opportunities?",
    answer:
      "Yes. Owners, agents, developers, and landowners can submit properties, land, commercial opportunities, and JV deals for review.",
  },
  {
    question: "How does INAMAAD support investors?",
    answer:
      "Investors can search opportunities, use the ROI calculator, submit their budget and preferred interest, and request deal guidance.",
  },
  {
    question: "How are listings and leads managed?",
    answer:
      "INAMAAD staff can review pending listings, manage enquiries, offers, inspections, JV applications, contact messages, analytics, and activity logs from the admin portal.",
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

function availabilityBadgeClass(status?: string) {
  switch (status) {
    case "Available":
      return "bg-emerald-500 text-white";
    case "Reserved":
      return "bg-amber-400 text-[#0d1c38]";
    case "Sold":
      return "bg-red-600 text-white";
    case "Rented":
      return "bg-blue-600 text-white";
    case "Leased":
      return "bg-purple-600 text-white";
    case "Off Market":
      return "bg-slate-700 text-white";
    default:
      return "bg-emerald-500 text-white";
  }
}

function availabilityShortNote(status?: string) {
  switch (status) {
    case "Available":
      return "Open for enquiries";
    case "Reserved":
      return "Temporarily reserved";
    case "Sold":
      return "Sold property";
    case "Rented":
      return "Already rented";
    case "Leased":
      return "Currently leased";
    case "Off Market":
      return "Not currently active";
    default:
      return "Open for enquiries";
  }
}

function buildListingReference(listingId?: number | null) {
  const safeId = Number(listingId || 0);
  return `INM-${String(safeId).padStart(6, "0")}`;
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

type UploadFileCategory = "image" | "document";

function validateUploadFile(file: File, category: UploadFileCategory) {
  const fileName = file.name || "Selected file";
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const maxImageSize = 5 * 1024 * 1024;
  const maxDocumentSize = 10 * 1024 * 1024;
  const allowedImageExtensions = ["jpg", "jpeg", "png", "webp"];
  const allowedDocumentExtensions = ["pdf", "jpg", "jpeg", "png", "webp"];
  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
  const allowedDocumentTypes = ["application/pdf", ...allowedImageTypes];

  const maxSize = category === "image" ? maxImageSize : maxDocumentSize;
  const allowedExtensions =
    category === "image" ? allowedImageExtensions : allowedDocumentExtensions;
  const allowedTypes = category === "image" ? allowedImageTypes : allowedDocumentTypes;

  if (file.size > maxSize) {
    throw new Error(
      `${fileName} is too large. ${category === "image" ? "Images" : "Documents"} must be ${
        category === "image" ? "5MB" : "10MB"
      } or less.`
    );
  }

  if (extension && !allowedExtensions.includes(extension)) {
    throw new Error(
      `${fileName} is not supported. Use ${allowedExtensions.join(", ").toUpperCase()}.`
    );
  }

  if (file.type && !allowedTypes.includes(file.type)) {
    throw new Error(`${fileName} has an unsupported file type.`);
  }

  return true;
}

type PriceBreakdownInput = {
  price?: string;
  agencyFee?: string;
  legalFee?: string;
  serviceCharge?: string;
  cautionFee?: string;
  surveyFee?: string;
  developmentFee?: string;
};

function calculateTotalEstimatedCost(input: PriceBreakdownInput) {
  const total = [
    input.price,
    input.agencyFee,
    input.legalFee,
    input.serviceCharge,
    input.cautionFee,
    input.surveyFee,
    input.developmentFee,
  ].reduce((sum, item) => sum + currencyToValue(String(item || "")), 0);

  return total > 0 ? formatNairaFull(total) : "";
}

function hasPriceBreakdown(listing: Listing) {
  return Boolean(
    listing.agencyFee ||
      listing.legalFee ||
      listing.serviceCharge ||
      listing.cautionFee ||
      listing.surveyFee ||
      listing.developmentFee ||
      listing.totalEstimatedCost ||
      listing.paymentPlanAvailable ||
      listing.installmentDetails
  );
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
  return `INAMAAD Real Estate: ${listing.title} (${buildListingReference(listing.id)}) - ${listing.price} in ${listing.location}. View details: ${buildListingShareUrl(
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

function extractStorageObjectPath(fileUrl: string, bucketName: string) {
  if (!fileUrl) return "";

  const cleanValue = fileUrl.split("?")[0];
  const bucketMarker = `${bucketName}/`;

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

function offerStatusClass(status: OfferStatus) {
  if (status === "Accepted") return "bg-emerald-100 text-emerald-700";
  if (status === "Reviewing") return "bg-blue-100 text-blue-700";
  if (status === "Rejected") return "bg-red-100 text-red-700";
  if (status === "Closed") return "bg-slate-200 text-slate-700";
  return "bg-amber-100 text-amber-700";
}

function jvApplicationStatusClass(status: JVApplicationStatus) {
  if (status === "Accepted") return "bg-emerald-100 text-emerald-700";
  if (status === "Shortlisted") return "bg-purple-100 text-purple-700";
  if (status === "Reviewing") return "bg-blue-100 text-blue-700";
  if (status === "Rejected") return "bg-red-100 text-red-700";
  if (status === "Closed") return "bg-slate-200 text-slate-700";
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

function buildPublicLocationText(listing: Pick<Listing, "location" | "stateName" | "cityArea">) {
  const parts = [listing.cityArea, listing.stateName].filter(Boolean);
  return parts.length ? parts.join(", ") : listing.location || "Location not stated";
}

function buildExactLocationText(listing: Listing) {
  if (listing.showExactAddress && listing.fullAddress) return listing.fullAddress;
  return buildPublicLocationText(listing);
}

function cleanPhoneForLink(phone?: string) {
  return (phone || "").replace(/[^0-9]/g, "");
}

function normalizeNigeriaWhatsApp(phone?: string) {
  const cleaned = cleanPhoneForLink(phone);
  if (!cleaned) return "";
  if (cleaned.startsWith("234")) return cleaned;
  if (cleaned.startsWith("0")) return `234${cleaned.slice(1)}`;
  return cleaned;
}

function canShowPublicPhone(listing: Listing) {
  const visibility = listing.publicContactVisibility || "Hide Phone";
  return visibility === "Show Phone" || visibility === "Show All";
}

function canShowPublicWhatsapp(listing: Listing) {
  const visibility = listing.publicContactVisibility || "Hide Phone";
  return visibility === "Show WhatsApp" || visibility === "Show All";
}

function canShowPublicEmail(listing: Listing) {
  const visibility = listing.publicContactVisibility || "Hide Phone";
  return visibility === "Show Email" || visibility === "Show All";
}

function getListingContactName(listing: Listing) {
  return listing.companyName || listing.ownerName || "Not provided";
}

function buildListingLocationValue(form: { stateName?: string; cityArea?: string; location?: string }) {
  const parts = [form.cityArea, form.stateName].filter(Boolean);
  return parts.length ? parts.join(", ") : form.location || "Nigeria";
}

function mapListingRow(row: any): Listing {
  return {
    id: Number(row.id),
    title: row.title,
    location: row.location,
    stateName: row.state_name || "",
    cityArea: row.city_area || "",
    fullAddress: row.full_address || "",
    nearbyLandmark: row.nearby_landmark || "",
    googleMapLink: row.google_map_link || "",
    showExactAddress: Boolean(row.show_exact_address),
    videoUrl: row.video_url || "",
    virtualTourUrl: row.virtual_tour_url || "",
    droneVideoUrl: row.drone_video_url || "",
    showVideoPublicly: row.show_video_publicly !== false,
    price: row.price,
    value: Number(row.value || 0),
    agencyFee: row.agency_fee || "",
    legalFee: row.legal_fee || "",
    serviceCharge: row.service_charge || "",
    cautionFee: row.caution_fee || "",
    surveyFee: row.survey_fee || "",
    developmentFee: row.development_fee || "",
    totalEstimatedCost: row.total_estimated_cost || "",
    paymentPlanAvailable: Boolean(row.payment_plan_available),
    installmentDetails: row.installment_details || "",
    bedrooms: row.bedrooms == null ? undefined : Number(row.bedrooms),
    bathrooms: row.bathrooms == null ? undefined : Number(row.bathrooms),
    toilets: row.toilets == null ? undefined : Number(row.toilets),
    parkingSpaces: row.parking_spaces == null ? undefined : Number(row.parking_spaces),
    landSize: row.land_size || "",
    propertySize: row.property_size || "",
    furnishingStatus: row.furnishing_status || "Not Specified",
    propertyCondition: row.property_condition || "Not Specified",
    amenities: row.amenities || "",
    jvStructure: row.jv_structure || "",
    jvLandContribution: row.jv_land_contribution || "",
    jvDeveloperRequirement: row.jv_developer_requirement || "",
    jvInvestorRequirement: row.jv_investor_requirement || "",
    jvSharingFormula: row.jv_sharing_formula || "",
    jvProjectStage: row.jv_project_stage || "",
    jvExpectedUnits: row.jv_expected_units || "",
    jvEstimatedProjectCost: row.jv_estimated_project_cost || "",
    jvCompletionTimeline: row.jv_completion_timeline || "",
    jvTerms: row.jv_terms || "",
    jvFeasibilityStudyUrl: row.jv_feasibility_study_url || "",
    jvArchitecturalConceptUrl: row.jv_architectural_concept_url || "",
    jvEstateLayoutUrl: row.jv_estate_layout_url || "",
    jvBoqUrl: row.jv_boq_url || "",
    jvProposalDocumentUrl: row.jv_proposal_document_url || "",
    jvLandTitleStatus: row.jv_land_title_status || "Not Reviewed",
    jvDevelopmentApprovalStatus: row.jv_development_approval_status || "Not Reviewed",
    jvDealStatus: row.jv_deal_status || "New JV",
    jvNextAction: row.jv_next_action || "",
    jvNextActionDate: row.jv_next_action_date || "",
    jvInternalNotes: row.jv_internal_notes || "",
    neighborhoodOverview: row.neighborhood_overview || "",
    roadAccess: row.road_access || "",
    powerSupply: row.power_supply || "",
    waterSupply: row.water_supply || "",
    securityFeatures: row.security_features || "",
    nearbySchools: row.nearby_schools || "",
    nearbyHospitals: row.nearby_hospitals || "",
    nearbyMalls: row.nearby_malls || "",
    nearbyTransport: row.nearby_transport || "",
    distanceToMajorRoad: row.distance_to_major_road || "",
    estateFeatures: row.estate_features || "",
    type: row.type,
    category: row.category,
    yieldText: row.yield_text,
    description: row.description,
    status: row.status,
    availabilityStatus: row.availability_status || "Available",
    availabilityNote: row.availability_note || "",
    availableFrom: row.available_from || "",
    ownerName: row.owner_name || "",
    ownerPhone: row.owner_phone || "",
    contactRole: row.contact_role || "Owner",
    companyName: row.company_name || "",
    contactEmail: row.contact_email || "",
    contactWhatsapp: row.contact_whatsapp || "",
    contactAddress: row.contact_address || "",
    publicContactVisibility: row.public_contact_visibility || "Hide Phone",
    mandateStatus: row.mandate_status || "Not Confirmed",
    identityType: row.identity_type || "Not Provided",
    identityNumber: row.identity_number || "",
    companyRegistrationNumber: row.company_registration_number || "",
    mandateDocumentStatus: row.mandate_document_status || "Not Provided",
    contactProfileVerified: Boolean(row.contact_profile_verified),
    contactVerificationNotes: row.contact_verification_notes || "",
    identityDocumentUrl: row.identity_document_url || "",
    cacDocumentUrl: row.cac_document_url || "",
    mandateDocumentUrl: row.mandate_document_url || "",
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
    priority: row.priority || "Normal",
    followUpDate: row.follow_up_date || "",
    lastContactedAt: row.last_contacted_at || "",
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
    priority: row.priority || "Normal",
    followUpDate: row.follow_up_date || "",
    lastContactedAt: row.last_contacted_at || "",
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

function mapPropertyImageRow(row: any): PropertyImage {
  return {
    id: Number(row.id),
    listingId: Number(row.listing_id),
    imageUrl: row.image_url || "",
    caption: row.caption || "",
    displayOrder: Number(row.display_order || 0),
    isMain: Boolean(row.is_main),
    createdAt: row.created_at || "",
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
    priority: row.priority || "Normal",
    followUpDate: row.follow_up_date || "",
    lastContactedAt: row.last_contacted_at || "",
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
    priority: row.priority || "Normal",
    followUpDate: row.follow_up_date || "",
    lastContactedAt: row.last_contacted_at || "",
    createdAt: row.created_at,
  };
}

function mapPropertyOfferRow(row: any): PropertyOffer {
  return {
    id: Number(row.id),
    listingId: row.listing_id ? Number(row.listing_id) : null,
    listingTitle: row.listing_title,
    buyerName: row.buyer_name,
    buyerEmail: row.buyer_email || "",
    buyerPhone: row.buyer_phone,
    offerAmount: row.offer_amount || "",
    paymentPlan: row.payment_plan || "",
    message: row.message || "",
    status: row.status || "New",
    assignedToEmail: row.assigned_to_email || "",
    staffNotes: row.staff_notes || "",
    priority: row.priority || "Normal",
    followUpDate: row.follow_up_date || "",
    lastContactedAt: row.last_contacted_at || "",
    createdAt: row.created_at,
  };
}

function mapJVApplicationRow(row: any): JVApplication {
  return {
    id: Number(row.id),
    listingId: row.listing_id ? Number(row.listing_id) : null,
    listingTitle: row.listing_title,
    applicantName: row.applicant_name,
    applicantEmail: row.applicant_email || "",
    applicantPhone: row.applicant_phone,
    applicantRole: row.applicant_role || "Investor",
    companyName: row.company_name || "",
    budgetCapacity: row.budget_capacity || "",
    experienceSummary: row.experience_summary || "",
    proposalMessage: row.proposal_message || "",
    companyProfileUrl: row.company_profile_url || "",
    cacCertificateUrl: row.cac_certificate_url || "",
    portfolioUrl: row.portfolio_url || "",
    financialProofUrl: row.financial_proof_url || "",
    proposalDocumentUrl: row.proposal_document_url || "",
    otherDocumentUrl: row.other_document_url || "",
    status: row.status || "New",
    assignedToEmail: row.assigned_to_email || "",
    staffNotes: row.staff_notes || "",
    priority: row.priority || "Normal",
    followUpDate: row.follow_up_date || "",
    lastContactedAt: row.last_contacted_at || "",
    experienceRating: Number(row.experience_rating || 0),
    financialCapacityRating: Number(row.financial_capacity_rating || 0),
    trackRecordRating: Number(row.track_record_rating || 0),
    documentReviewStatus: row.document_review_status || "Not Reviewed",
    riskLevel: row.risk_level || "Normal",
    evaluationNotes: row.evaluation_notes || "",
    evaluatedByEmail: row.evaluated_by_email || "",
    evaluatedAt: row.evaluated_at || "",
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
  const isJV = isJointVentureListing(listing);

  return {
    title: listing.title,
    location: listing.location,
    state_name: listing.stateName || null,
    city_area: listing.cityArea || null,
    full_address: listing.fullAddress || null,
    nearby_landmark: listing.nearbyLandmark || null,
    google_map_link: listing.googleMapLink || null,
    show_exact_address: Boolean(listing.showExactAddress),
    video_url: listing.videoUrl || null,
    virtual_tour_url: listing.virtualTourUrl || null,
    drone_video_url: listing.droneVideoUrl || null,
    show_video_publicly: listing.showVideoPublicly !== false,
    price: listing.price,
    value: listing.value,
    agency_fee: listing.agencyFee || null,
    legal_fee: listing.legalFee || null,
    service_charge: listing.serviceCharge || null,
    caution_fee: listing.cautionFee || null,
    survey_fee: listing.surveyFee || null,
    development_fee: listing.developmentFee || null,
    total_estimated_cost: listing.totalEstimatedCost || calculateTotalEstimatedCost(listing),
    payment_plan_available: Boolean(listing.paymentPlanAvailable),
    installment_details: listing.installmentDetails || null,
    bedrooms: isJV ? null : listing.bedrooms || null,
    bathrooms: isJV ? null : listing.bathrooms || null,
    toilets: isJV ? null : listing.toilets || null,
    parking_spaces: isJV ? null : listing.parkingSpaces || null,
    land_size: listing.landSize || null,
    property_size: isJV ? null : listing.propertySize || null,
    furnishing_status: isJV ? "Not Specified" : listing.furnishingStatus || "Not Specified",
    property_condition: isJV ? "Not Specified" : listing.propertyCondition || "Not Specified",
    amenities: isJV ? null : listing.amenities || null,
    jv_structure: isJV ? listing.jvStructure || null : null,
    jv_land_contribution: isJV ? listing.jvLandContribution || null : null,
    jv_developer_requirement: isJV ? listing.jvDeveloperRequirement || null : null,
    jv_investor_requirement: isJV ? listing.jvInvestorRequirement || null : null,
    jv_sharing_formula: isJV ? listing.jvSharingFormula || null : null,
    jv_project_stage: isJV ? listing.jvProjectStage || null : null,
    jv_expected_units: isJV ? listing.jvExpectedUnits || null : null,
    jv_estimated_project_cost: isJV ? listing.jvEstimatedProjectCost || null : null,
    jv_completion_timeline: isJV ? listing.jvCompletionTimeline || null : null,
    jv_terms: isJV ? listing.jvTerms || null : null,
    jv_feasibility_study_url: isJV ? listing.jvFeasibilityStudyUrl || null : null,
    jv_architectural_concept_url: isJV ? listing.jvArchitecturalConceptUrl || null : null,
    jv_estate_layout_url: isJV ? listing.jvEstateLayoutUrl || null : null,
    jv_boq_url: isJV ? listing.jvBoqUrl || null : null,
    jv_proposal_document_url: isJV ? listing.jvProposalDocumentUrl || null : null,
    jv_land_title_status: isJV ? listing.jvLandTitleStatus || "Not Reviewed" : null,
    jv_development_approval_status: isJV ? listing.jvDevelopmentApprovalStatus || "Not Reviewed" : null,
    jv_deal_status: isJV ? listing.jvDealStatus || "New JV" : null,
    jv_next_action: isJV ? listing.jvNextAction || null : null,
    jv_next_action_date: isJV ? listing.jvNextActionDate || null : null,
    jv_internal_notes: isJV ? listing.jvInternalNotes || null : null,
    neighborhood_overview: listing.neighborhoodOverview || null,
    road_access: listing.roadAccess || null,
    power_supply: listing.powerSupply || null,
    water_supply: listing.waterSupply || null,
    security_features: listing.securityFeatures || null,
    nearby_schools: listing.nearbySchools || null,
    nearby_hospitals: listing.nearbyHospitals || null,
    nearby_malls: listing.nearbyMalls || null,
    nearby_transport: listing.nearbyTransport || null,
    distance_to_major_road: listing.distanceToMajorRoad || null,
    estate_features: listing.estateFeatures || null,
    type: listing.type,
    category: listing.category,
    yield_text: listing.yieldText,
    description: listing.description,
    status: listing.status,
    availability_status: listing.availabilityStatus || "Available",
    availability_note: listing.availabilityNote || null,
    available_from: listing.availableFrom || null,
    owner_name: listing.ownerName || null,
    owner_phone: listing.ownerPhone || null,
    contact_role: listing.contactRole || "Owner",
    company_name: listing.companyName || null,
    contact_email: listing.contactEmail || null,
    contact_whatsapp: listing.contactWhatsapp || null,
    contact_address: listing.contactAddress || null,
    public_contact_visibility: listing.publicContactVisibility || "Hide Phone",
    mandate_status: listing.mandateStatus || "Not Confirmed",
    identity_type: listing.identityType || null,
    identity_number: listing.identityNumber || null,
    company_registration_number: listing.companyRegistrationNumber || null,
    mandate_document_status: listing.mandateDocumentStatus || "Not Provided",
    contact_profile_verified: Boolean(listing.contactProfileVerified),
    contact_verification_notes: listing.contactVerificationNotes || null,
    identity_document_url: listing.identityDocumentUrl || null,
    cac_document_url: listing.cacDocumentUrl || null,
    mandate_document_url: listing.mandateDocumentUrl || null,
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

class InamaadErrorBoundary extends React.Component<
  { children?: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      errorMessage: error?.message || "The app stopped unexpectedly.",
    };
  }

  componentDidCatch(error: Error) {
    console.error("INAMAAD safe crash guard:", error);
  }

  resetApp = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0d1c38] px-4 py-10 text-white">
          <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white p-6 text-[#0d1c38] shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d39b19]">
              INAMAAD protection
            </p>
            <h1 className="mt-3 text-2xl font-black">
              The page was protected from a blank screen.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              A temporary display error was caught before it could crash the whole website.
            </p>
            {this.state.errorMessage ? (
              <p className="mt-3 rounded-2xl bg-red-50 p-3 text-xs font-semibold text-red-700">
                {this.state.errorMessage}
              </p>
            ) : null}
            <button
              type="button"
              onClick={this.resetApp}
              className="mt-5 rounded-xl bg-[#0d1c38] px-5 py-3 text-sm font-black text-white hover:bg-[#13284f]"
            >
              Reload safe view
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function InamaadMainApp() {
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [investorRequests, setInvestorRequests] = useState<InvestorRequest[]>(
    []
  );
  const [propertyInquiries, setPropertyInquiries] = useState<PropertyInquiry[]>(
    []
  );
  const [propertyViews, setPropertyViews] = useState<PropertyView[]>([]);
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [inspectionBookings, setInspectionBookings] = useState<InspectionBooking[]>([]);
  const [propertyOffers, setPropertyOffers] = useState<PropertyOffer[]>([]);
  const [jvApplications, setJvApplications] = useState<JVApplication[]>([]);
  const [staffNotifications, setStaffNotifications] = useState<StaffNotification[]>([]);
  const [adminActivityLogs, setAdminActivityLogs] = useState<AdminActivityLog[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNewUserGuideNotice, setShowNewUserGuideNotice] = useState(() => {
    try {
      return localStorage.getItem("inamaad_user_guide_seen") !== "true";
    } catch {
      return true;
    }
  });
  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [listingPurpose, setListingPurpose] = useState("All Purposes");
  const [availabilityFilter, setAvailabilityFilter] = useState("All Availability");
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
  const [isRefreshingData, setIsRefreshingData] = useState(false);
  const autoRefreshTimerRef = useRef<number | null>(null);
  const [sharedListingOpened, setSharedListingOpened] = useState(false);
  const [recentListingIds, setRecentListingIds] = useState<number[]>(() => {
    try {
      const savedIds = JSON.parse(localStorage.getItem("inamaad_recent_listing_ids") || "[]");
      return Array.isArray(savedIds)
        ? savedIds.map((id) => Number(id)).filter((id) => Number.isFinite(id)).slice(0, 6)
        : [];
    } catch {
      return [];
    }
  });

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

  const [demoSignedIn, setDemoSignedIn] = useState(false);
  const [demoUserEmail, setDemoUserEmail] = useState("");

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [resetPasswordForm, setResetPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);

  const [postForm, setPostForm] = useState({
    title: "",
    location: "",
    stateName: "FCT Abuja",
    cityArea: "",
    fullAddress: "",
    nearbyLandmark: "",
    googleMapLink: "",
    showExactAddress: false,
    videoUrl: "",
    virtualTourUrl: "",
    droneVideoUrl: "",
    showVideoPublicly: true,
    price: "",
    agencyFee: "",
    legalFee: "",
    serviceCharge: "",
    cautionFee: "",
    surveyFee: "",
    developmentFee: "",
    totalEstimatedCost: "",
    paymentPlanAvailable: false,
    installmentDetails: "",
    bedrooms: "",
    bathrooms: "",
    toilets: "",
    parkingSpaces: "",
    landSize: "",
    propertySize: "",
    furnishingStatus: "Not Specified",
    propertyCondition: "Not Specified",
    amenities: "",
    jvStructure: "Landowner + Developer JV",
    jvLandContribution: "",
    jvDeveloperRequirement: "",
    jvInvestorRequirement: "",
    jvSharingFormula: "",
    jvProjectStage: "Land Available",
    jvExpectedUnits: "",
    jvEstimatedProjectCost: "",
    jvCompletionTimeline: "",
    jvTerms: "",
    jvFeasibilityStudyUrl: "",
    jvArchitecturalConceptUrl: "",
    jvEstateLayoutUrl: "",
    jvBoqUrl: "",
    jvProposalDocumentUrl: "",
    jvLandTitleStatus: "Not Reviewed",
    jvDevelopmentApprovalStatus: "Not Reviewed",
    jvDealStatus: "New JV" as JVDealStatus,
    jvNextAction: "",
    jvNextActionDate: "",
    jvInternalNotes: "",
    neighborhoodOverview: "",
    roadAccess: "",
    powerSupply: "",
    waterSupply: "",
    securityFeatures: "",
    nearbySchools: "",
    nearbyHospitals: "",
    nearbyMalls: "",
    nearbyTransport: "",
    distanceToMajorRoad: "",
    estateFeatures: "",
    type: "Residential",
    category: "For Sale",
    availabilityStatus: "Available" as AvailabilityStatus,
    availabilityNote: "",
    availableFrom: "",
    yieldText: "",
    description: "",
    documentTitle: "C of O / Certificate of Occupancy",
    documentStatus: "Available",
    documentDetails: "",
    documentFileUrl: "",
    ownerName: "",
    ownerPhone: "",
    contactRole: "Owner",
    companyName: "",
    contactEmail: "",
    contactWhatsapp: "",
    contactAddress: "",
    publicContactVisibility: "Hide Phone",
    mandateStatus: "Not Confirmed",
    identityType: "Not Provided",
    identityNumber: "",
    companyRegistrationNumber: "",
    mandateDocumentStatus: "Not Provided",
    contactProfileVerified: false,
    contactVerificationNotes: "",
    identityDocumentUrl: "",
    cacDocumentUrl: "",
    mandateDocumentUrl: "",
  });

  const [postMode, setPostMode] = useState<"property" | "jv">("property");
  const [postFormRenderKey, setPostFormRenderKey] = useState(0);
  const postFormIsJointVenture = postMode === "jv";

  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [postGalleryFiles, setPostGalleryFiles] = useState<File[]>([]);
  const [postDocumentFile, setPostDocumentFile] = useState<File | null>(null);

  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    stateName: "FCT Abuja",
    cityArea: "",
    fullAddress: "",
    nearbyLandmark: "",
    googleMapLink: "",
    showExactAddress: false,
    videoUrl: "",
    virtualTourUrl: "",
    droneVideoUrl: "",
    showVideoPublicly: true,
    price: "",
    agencyFee: "",
    legalFee: "",
    serviceCharge: "",
    cautionFee: "",
    surveyFee: "",
    developmentFee: "",
    totalEstimatedCost: "",
    paymentPlanAvailable: false,
    installmentDetails: "",
    bedrooms: "",
    bathrooms: "",
    toilets: "",
    parkingSpaces: "",
    landSize: "",
    propertySize: "",
    furnishingStatus: "Not Specified",
    propertyCondition: "Not Specified",
    amenities: "",
    jvStructure: "Landowner + Developer JV",
    jvLandContribution: "",
    jvDeveloperRequirement: "",
    jvInvestorRequirement: "",
    jvSharingFormula: "",
    jvProjectStage: "Land Available",
    jvExpectedUnits: "",
    jvEstimatedProjectCost: "",
    jvCompletionTimeline: "",
    jvTerms: "",
    jvFeasibilityStudyUrl: "",
    jvArchitecturalConceptUrl: "",
    jvEstateLayoutUrl: "",
    jvBoqUrl: "",
    jvProposalDocumentUrl: "",
    jvLandTitleStatus: "Not Reviewed",
    jvDevelopmentApprovalStatus: "Not Reviewed",
    jvDealStatus: "New JV" as JVDealStatus,
    jvNextAction: "",
    jvNextActionDate: "",
    jvInternalNotes: "",
    neighborhoodOverview: "",
    roadAccess: "",
    powerSupply: "",
    waterSupply: "",
    securityFeatures: "",
    nearbySchools: "",
    nearbyHospitals: "",
    nearbyMalls: "",
    nearbyTransport: "",
    distanceToMajorRoad: "",
    estateFeatures: "",
    type: "Residential",
    category: "For Sale",
    availabilityStatus: "Available" as AvailabilityStatus,
    availabilityNote: "",
    availableFrom: "",
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
    contactRole: "Owner",
    companyName: "",
    contactEmail: "",
    contactWhatsapp: "",
    contactAddress: "",
    publicContactVisibility: "Hide Phone",
    mandateStatus: "Not Confirmed",
    identityType: "Not Provided",
    identityNumber: "",
    companyRegistrationNumber: "",
    mandateDocumentStatus: "Not Provided",
    contactProfileVerified: false,
    contactVerificationNotes: "",
    identityDocumentUrl: "",
    cacDocumentUrl: "",
    mandateDocumentUrl: "",
    imageUrl: "",
    featured: false,
    featuredRank: "0",
  });

  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editGalleryFiles, setEditGalleryFiles] = useState<File[]>([]);
  const [editDocumentFile, setEditDocumentFile] = useState<File | null>(null);
  const [editIdentityDocumentFile, setEditIdentityDocumentFile] = useState<File | null>(null);
  const [editCacDocumentFile, setEditCacDocumentFile] = useState<File | null>(null);
  const [editMandateDocumentFile, setEditMandateDocumentFile] = useState<File | null>(null);
  const [editJvFeasibilityStudyFile, setEditJvFeasibilityStudyFile] = useState<File | null>(null);
  const [editJvArchitecturalConceptFile, setEditJvArchitecturalConceptFile] = useState<File | null>(null);
  const [editJvEstateLayoutFile, setEditJvEstateLayoutFile] = useState<File | null>(null);
  const [editJvBoqFile, setEditJvBoqFile] = useState<File | null>(null);
  const [editJvProposalDocumentFile, setEditJvProposalDocumentFile] = useState<File | null>(null);

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

  const [offerForm, setOfferForm] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    offerAmount: "",
    paymentPlan: "Full payment",
    message: "",
  });

  const [jvApplicationForm, setJvApplicationForm] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    applicantRole: "Developer",
    companyName: "",
    budgetCapacity: "",
    experienceSummary: "",
    proposalMessage: "",
  });

  const [jvCompanyProfileFile, setJvCompanyProfileFile] = useState<File | null>(null);
  const [jvCacCertificateFile, setJvCacCertificateFile] = useState<File | null>(null);
  const [jvPortfolioFile, setJvPortfolioFile] = useState<File | null>(null);
  const [jvFinancialProofFile, setJvFinancialProofFile] = useState<File | null>(null);
  const [jvProposalDocumentFile, setJvProposalDocumentFile] = useState<File | null>(null);
  const [jvOtherDocumentFile, setJvOtherDocumentFile] = useState<File | null>(null);

  const [publicSubmittingForm, setPublicSubmittingForm] = useState<LeadKind | null>(null);
  const publicSubmissionLockRef = useRef<LeadKind | null>(null);
  const [publicFormBotTrap, setPublicFormBotTrap] = useState<Record<LeadKind, string>>({
    investor_requests: "",
    property_inquiries: "",
    property_offers: "",
    jv_applications: "",
    contact_messages: "",
    inspection_bookings: "",
  });

  const usesDatabase = Boolean(supabase);

  function cleanFormText(value?: string | null) {
    return String(value || "").trim();
  }

  function hasMinimumText(value: string | undefined, minimumLength: number) {
    return cleanFormText(value).length >= minimumLength;
  }

  function optionalEmailIsValid(value?: string) {
    const email = cleanFormText(value);
    return !email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
  }

  function phoneLooksValid(value?: string) {
    return cleanFormText(value).replace(/\D/g, "").length >= 7;
  }

  function isWithinLimit(value: string | undefined, maximumLength: number) {
    return cleanFormText(value).length <= maximumLength;
  }

  function beginPublicFormSubmit(
    formKey: LeadKind,
    checks: Array<{ ok: boolean; message: string }>
  ) {
    if (publicSubmissionLockRef.current) {
      showSuccess("Please wait, your previous submission is still processing.");
      return false;
    }

    if (cleanFormText(publicFormBotTrap[formKey])) {
      console.warn("INAMAAD bot-trap blocked a public form submission:", formKey);
      showSuccess("Submission blocked. Please refresh the page and try again.");
      return false;
    }

    const failedCheck = checks.find((check) => !check.ok);

    if (failedCheck) {
      showSuccess(failedCheck.message);
      return false;
    }

    publicSubmissionLockRef.current = formKey;
    setPublicSubmittingForm(formKey);
    return true;
  }

  function finishPublicFormSubmit(formKey: LeadKind) {
    if (publicSubmissionLockRef.current === formKey) {
      publicSubmissionLockRef.current = null;
    }

    setPublicSubmittingForm((current) => (current === formKey ? null : current));
  }

  function resetPublicFormBotTrap(formKey: LeadKind) {
    setPublicFormBotTrap((current) => ({ ...current, [formKey]: "" }));
  }

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

  const totalLeads = investorRequests.length + propertyInquiries.length + propertyOffers.length + jvApplications.length + contactMessages.length + inspectionBookings.length;
  const conversionReadyLeads = propertyInquiries.length + propertyOffers.length + jvApplications.length + contactMessages.length + inspectionBookings.length;
  const unreadNotifications = staffNotifications.filter((notification) => !notification.isRead).length;
  const isSignedIn = Boolean(user) || demoSignedIn;
  const signedInEmail = user?.email || demoUserEmail || "INAMAAD Account";
  const currentStaffMember = staffMembers.find((member) => member.email === user?.email);
  const currentStaffRole: StaffRole = usesDatabase
    ? currentStaffMember?.role || "Viewer"
    : "Viewer";
  const hasAnyStaffRole = (allowedRoles: StaffRole[]) =>
    usesDatabase && allowedRoles.includes(currentStaffRole);

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
  const publicListingsWithContactCount = verifiedListings.filter(
    (listing) => listing.ownerPhone || listing.contactWhatsapp || listing.contactEmail
  ).length;
  const listingsWithImagesCount = listings.filter((listing) => listing.imageUrl).length;

  const launchFoundationChecks = [
    {
      label: "Database connection",
      passed: usesDatabase,
      detail: usesDatabase
        ? "Supabase environment variables are detected."
        : "Supabase is not connected yet; local storage is still being used.",
    },
    {
      label: "Public property browsing",
      passed: verifiedListings.length > 0,
      detail: `${verifiedListings.length} verified listing${verifiedListings.length === 1 ? "" : "s"} available to visitors.`,
    },
    {
      label: "Property/JV detail opening",
      passed: true,
      detail: "Property and JV cards use the protected click handler so details open without refresh conflict.",
    },
    {
      label: "Upload guard",
      passed: true,
      detail: "Images and documents are checked for file type and size before upload.",
    },
    {
      label: "Admin approval flow",
      passed: true,
      detail: `${pendingListings.length} listing${pendingListings.length === 1 ? "" : "s"} currently waiting for review.`,
    },
    {
      label: "Contact channels",
      passed: publicListingsWithContactCount > 0 || Boolean(WHATSAPP_NUMBER),
      detail: `${publicListingsWithContactCount} verified listing${publicListingsWithContactCount === 1 ? "" : "s"} include direct listing contact details. Global WhatsApp is available.`,
    },
    {
      label: "Listing media readiness",
      passed: listings.length === 0 || listingsWithImagesCount > 0,
      detail: `${listingsWithImagesCount} listing${listingsWithImagesCount === 1 ? "" : "s"} currently have image/gallery media.`,
    },
    {
      label: "Lead capture forms",
      passed: true,
      detail: "Investor requests, property inquiries, offers, inspections, and contact messages are available.",
    },
  ];
  const launchFoundationScore = Math.round(
    (launchFoundationChecks.filter((check) => check.passed).length /
      launchFoundationChecks.length) *
      100
  );
  const failedLaunchFoundationChecks = launchFoundationChecks.filter((check) => !check.passed);
  const todayKey = new Date().toISOString().slice(0, 10);

  const leadFollowUpItems = useMemo(() => {
    const items = [
      ...propertyInquiries.map((inquiry) => ({
        id: inquiry.id,
        kind: "property_inquiries" as LeadKind,
        source: "Property inquiry",
        title: inquiry.listingTitle,
        name: inquiry.name,
        phone: inquiry.phone,
        email: inquiry.email,
        status: inquiry.status || "New",
        priority: inquiry.priority || "Normal",
        followUpDate: inquiry.followUpDate || "",
        lastContactedAt: inquiry.lastContactedAt || "",
        assignedToEmail: inquiry.assignedToEmail || "",
        createdAt: inquiry.createdAt,
      })),
      ...propertyOffers.map((offer) => ({
        id: offer.id,
        kind: "property_offers" as LeadKind,
        source: "Property offer",
        title: offer.listingTitle,
        name: offer.buyerName,
        phone: offer.buyerPhone,
        email: offer.buyerEmail,
        status: offer.status || "New",
        priority: offer.priority || "Normal",
        followUpDate: offer.followUpDate || "",
        lastContactedAt: offer.lastContactedAt || "",
        assignedToEmail: offer.assignedToEmail || "",
        createdAt: offer.createdAt,
      })),
      ...jvApplications.map((application) => ({
        id: application.id,
        kind: "jv_applications" as LeadKind,
        source: "JV application",
        title: application.listingTitle,
        name: application.applicantName,
        phone: application.applicantPhone,
        email: application.applicantEmail,
        status: application.status || "New",
        priority: application.priority || "Normal",
        followUpDate: application.followUpDate || "",
        lastContactedAt: application.lastContactedAt || "",
        assignedToEmail: application.assignedToEmail || "",
        createdAt: application.createdAt,
      })),
      ...inspectionBookings.map((booking) => ({
        id: booking.id,
        kind: "inspection_bookings" as LeadKind,
        source: "Inspection booking",
        title: booking.listingTitle,
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        status: booking.status || "New",
        priority: booking.priority || "Normal",
        followUpDate: booking.followUpDate || "",
        lastContactedAt: booking.lastContactedAt || "",
        assignedToEmail: booking.assignedToEmail || "",
        createdAt: booking.createdAt,
      })),
      ...contactMessages.map((message) => ({
        id: message.id,
        kind: "contact_messages" as LeadKind,
        source: "Contact message",
        title: message.subject || "General enquiry",
        name: message.name,
        phone: message.phone,
        email: message.email,
        status: message.status || "New",
        priority: message.priority || "Normal",
        followUpDate: message.followUpDate || "",
        lastContactedAt: message.lastContactedAt || "",
        assignedToEmail: message.assignedToEmail || "",
        createdAt: message.createdAt,
      })),
      ...investorRequests.map((request) => ({
        id: request.id,
        kind: "investor_requests" as LeadKind,
        source: "Investor request",
        title: request.interest,
        name: request.name,
        phone: request.phone,
        email: request.email,
        status: request.status || "New",
        priority: request.priority || "Normal",
        followUpDate: request.followUpDate || "",
        lastContactedAt: request.lastContactedAt || "",
        assignedToEmail: request.assignedToEmail || "",
        createdAt: request.createdAt,
      })),
    ];

    return items
      .filter((item) => item.status !== "Closed" && item.status !== "Completed" && item.status !== "Cancelled")
      .sort((first, second) => {
        const priorityOrder: Record<LeadPriority, number> = {
          Urgent: 4,
          High: 3,
          Normal: 2,
          Low: 1,
        };

        const firstDate = first.followUpDate || "9999-12-31";
        const secondDate = second.followUpDate || "9999-12-31";

        if (firstDate !== secondDate) return firstDate.localeCompare(secondDate);

        return priorityOrder[second.priority] - priorityOrder[first.priority];
      });
  }, [propertyInquiries, propertyOffers, jvApplications, inspectionBookings, contactMessages, investorRequests]);

  const overdueFollowUps = leadFollowUpItems.filter(
    (item) => item.followUpDate && item.followUpDate < todayKey
  );
  const todayFollowUps = leadFollowUpItems.filter(
    (item) => item.followUpDate === todayKey
  );
  const urgentFollowUps = leadFollowUpItems.filter(
    (item) => item.priority === "Urgent" || item.priority === "High"
  );
  const unassignedLeads = leadFollowUpItems.filter(
    (item) => !item.assignedToEmail
  );
  const nextFollowUps = leadFollowUpItems.filter(
    (item) => item.followUpDate && item.followUpDate >= todayKey
  );

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

  const propertyImagesByListingId = useMemo(() => {
    return propertyImages.reduce<Record<number, PropertyImage[]>>((groups, image) => {
      groups[image.listingId] = groups[image.listingId] || [];
      groups[image.listingId].push(image);
      groups[image.listingId].sort((first, second) => Number(first.displayOrder || 0) - Number(second.displayOrder || 0));
      return groups;
    }, {});
  }, [propertyImages]);

  function getListingGalleryImages(listing: Listing | null | undefined) {
    if (!listing) return [] as string[];

    const galleryUrls = (propertyImagesByListingId[listing.id] || [])
      .map((image) => image.imageUrl)
      .filter(Boolean);

    return Array.from(new Set([listing.imageUrl, ...galleryUrls].filter(Boolean) as string[]));
  }

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
          `${listing.title} ${listing.location} ${listing.type} ${listing.category} ${listing.availabilityStatus || ""} ${listing.documentTitle || ""} ${listing.documentStatus || ""}`.toLowerCase();

        const matchesSearch = searchText.includes(query.toLowerCase());

        const matchesType =
          propertyType === "All" || listing.type === propertyType;

        const matchesPurpose =
          listingPurpose === "All Purposes" || listing.category === listingPurpose;

        const matchesAvailability =
          availabilityFilter === "All Availability" ||
          (listing.availabilityStatus || "Available") === availabilityFilter;

        const matchesLocation =
          locationFilter === "All Locations" ||
          listing.location.toLowerCase().includes(locationFilter.toLowerCase());

        const matchesMinValue = !minValueFilter || Number(listing.value || 0) >= minValue;
        const matchesMaxValue = !maxValueFilter || Number(listing.value || 0) <= maxValue;

        return (
          matchesSearch &&
          matchesType &&
          matchesPurpose &&
          matchesAvailability &&
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
    availabilityFilter,
    locationFilter,
    minValueFilter,
    maxValueFilter,
    sortMode,
  ]);

  const recentlyViewedListings = useMemo(
    () =>
      recentListingIds
        .map((id) => listings.find((listing) => Number(listing.id) === Number(id)))
        .filter((listing): listing is Listing => Boolean(listing)),
    [recentListingIds, listings]
  );

  useEffect(() => {
    localStorage.setItem("inamaad_recent_listing_ids", JSON.stringify(recentListingIds));
  }, [recentListingIds]);

  useEffect(() => {
    if (!supabase) {
      loadLocalData();
      return;
    }

    loadDatabaseListings();
    loadDatabasePropertyImages();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        checkAdminAccess();
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          const emailConfirmedAt = session.user.email_confirmed_at;

          if (!emailConfirmedAt && event === "SIGNED_IN") {
            setConfirmationEmail(session.user.email ?? "");
            supabase.auth.signOut();
            setUser(null);
            setDemoSignedIn(false);
            setDemoUserEmail("");
            showSuccess("Email confirmation is required before signing in. Check your inbox and confirm your email first.");
            return;
          }

          setDemoSignedIn(false);
          setDemoUserEmail("");
        }

        if (event === "PASSWORD_RECOVERY") {
          setModal("resetPassword");
          showSuccess("Enter your new password to complete account recovery.");
        }

        if (!session?.user) {
          setAdminUnlocked(false);
          setInvestorRequests([]);
          setPropertyInquiries([]);
          setPropertyViews([]);
          setPropertyImages([]);
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
    localStorage.setItem("inamaad_property_images", JSON.stringify(propertyImages));
  }, [propertyImages]);

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
    localStorage.setItem("inamaad_property_offers", JSON.stringify(propertyOffers));
  }, [propertyOffers]);

  useEffect(() => {
    if (supabase) return;
    localStorage.setItem("inamaad_jv_applications", JSON.stringify(jvApplications));
  }, [jvApplications]);

  useEffect(() => {
    if (supabase) return;
    localStorage.setItem("inamaad_staff_notifications", JSON.stringify(staffNotifications));
  }, [staffNotifications]);


  useEffect(() => {
    if (!supabase) return;

    const handleBackgroundClickRefresh = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      // Mobile scroll stability:
      // Do not refresh on touchstart, pointerdown, mousedown, wheel, or scroll.
      // Refreshing while a finger-scroll is starting can re-render the listing
      // area and make the page jump to the footer/end unexpectedly.
      if (
        event.defaultPrevented ||
        target?.closest(
          '[data-inamaad-open-listing="true"], [data-inamaad-no-refresh="true"], [role="dialog"], form, input, textarea, select, button, a'
        )
      ) {
        return;
      }

      scheduleAutoRefresh(1200);
    };

    document.addEventListener("click", handleBackgroundClickRefresh, true);

    return () => {
      document.removeEventListener("click", handleBackgroundClickRefresh, true);

      if (autoRefreshTimerRef.current) {
        window.clearTimeout(autoRefreshTimerRef.current);
      }
    };
  }, [user, adminUnlocked]);

  useEffect(() => {
    if (!supabase) return;

    const autoRefreshChannel = supabase
      .channel("inamaad-live-refresh")
      .on("postgres_changes", { event: "*", schema: "public", table: "listings" }, () => scheduleAutoRefresh(350))
      .on("postgres_changes", { event: "*", schema: "public", table: "property_images" }, () => scheduleAutoRefresh(350))
      .on("postgres_changes", { event: "*", schema: "public", table: "investor_requests" }, () => scheduleAutoRefresh(350))
      .on("postgres_changes", { event: "*", schema: "public", table: "property_inquiries" }, () => scheduleAutoRefresh(350))
      .on("postgres_changes", { event: "*", schema: "public", table: "property_offers" }, () => scheduleAutoRefresh(350))
      .on("postgres_changes", { event: "*", schema: "public", table: "jv_applications" }, () => scheduleAutoRefresh(350))
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, () => scheduleAutoRefresh(350))
      .on("postgres_changes", { event: "*", schema: "public", table: "inspection_bookings" }, () => scheduleAutoRefresh(350))
      .on("postgres_changes", { event: "*", schema: "public", table: "staff_notifications" }, () => scheduleAutoRefresh(350))
      .subscribe();

    return () => {
      supabase.removeChannel(autoRefreshChannel);
    };
  }, [user, adminUnlocked]);

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

  function scheduleAutoRefresh(delay = 350) {
    if (!supabase) return;

    // Throttle, do not debounce. The previous version kept resetting the timer,
    // so fast clicking could prevent refresh from happening. This version makes
    // sure the first click schedules a refresh and later clicks do not cancel it.
    if (autoRefreshTimerRef.current) return;

    autoRefreshTimerRef.current = window.setTimeout(() => {
      autoRefreshTimerRef.current = null;
      void refreshAllData();
    }, delay);
  }

  function formatAuthError(error: unknown, fallback = "Unable to complete request. Please try again."): string {
    if (!error) return fallback;

    if (typeof error === "string") {
      return error.trim() && error !== "{}" ? error : fallback;
    }

    if (error instanceof Error) {
      return error.message || fallback;
    }

    if (typeof error === "object") {
      const value = error as { message?: unknown; error_description?: unknown; error?: unknown; status?: unknown };

      const rawMessage =
        typeof value.message === "string"
          ? value.message
          : typeof value.error_description === "string"
            ? value.error_description
            : typeof value.error === "string"
              ? value.error
              : "";

      const message = rawMessage.trim();

      if (!message || message === "{}") {
        return fallback;
      }

      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("rate limit")) {
        return "Request rate limit reached. Please wait a few minutes before trying again. If this continues, check Supabase SMTP and email rate limits.";
      }

      if (lowerMessage.includes("error sending confirmation email")) {
        return "Confirmation email could not be sent. Check Supabase SMTP settings or wait for the email limit to reset.";
      }

      if (lowerMessage.includes("email not confirmed")) {
        return "Please confirm your email before signing in. Check your inbox or resend the confirmation email.";
      }

      return message;
    }

    return fallback;
  }

  function showSuccess(message: unknown) {
    const readableMessage = formatAuthError(message, "Action completed.");

    setSuccessMessage(readableMessage);
    setTimeout(() => setSuccessMessage(""), 4500);

    if (supabase) {
      scheduleAutoRefresh(1100);
    }
  }

  function markUserGuideSeen() {
    try {
      localStorage.setItem("inamaad_user_guide_seen", "true");
    } catch {
      // Ignore storage errors so the guide never breaks browsing.
    }

    setShowNewUserGuideNotice(false);
  }

  function openUserGuide() {
    markUserGuideSeen();
    setMobileOpen(false);
    setModal("guide");
  }

  function loadLocalData() {
    try {
      const storedListings = localStorage.getItem("inamaad_listings");
      const storedRequests = localStorage.getItem("inamaad_investor_requests");
      const storedInquiries = localStorage.getItem("inamaad_property_inquiries");
      const storedViews = localStorage.getItem("inamaad_property_views");
      const storedPropertyImages = localStorage.getItem("inamaad_property_images");
      const storedContactMessages = localStorage.getItem("inamaad_contact_messages");
      const storedInspectionBookings = localStorage.getItem("inamaad_inspection_bookings");
      const storedPropertyOffers = localStorage.getItem("inamaad_property_offers");
      const storedJvApplications = localStorage.getItem("inamaad_jv_applications");
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

      if (storedPropertyImages) {
        setPropertyImages(JSON.parse(storedPropertyImages) as PropertyImage[]);
      }

      if (storedContactMessages) {
        setContactMessages(JSON.parse(storedContactMessages) as ContactMessage[]);
      }

      if (storedInspectionBookings) {
        setInspectionBookings(JSON.parse(storedInspectionBookings) as InspectionBooking[]);
      }

      if (storedPropertyOffers) {
        setPropertyOffers(JSON.parse(storedPropertyOffers) as PropertyOffer[]);
      }

      if (storedJvApplications) {
        setJvApplications(JSON.parse(storedJvApplications) as JVApplication[]);
      }

      if (storedStaffNotifications) {
        setStaffNotifications(JSON.parse(storedStaffNotifications) as StaffNotification[]);
      }
    } catch {
      localStorage.removeItem("inamaad_listings");
      localStorage.removeItem("inamaad_investor_requests");
      localStorage.removeItem("inamaad_property_inquiries");
      localStorage.removeItem("inamaad_property_views");
      localStorage.removeItem("inamaad_property_images");
      localStorage.removeItem("inamaad_contact_messages");
      localStorage.removeItem("inamaad_inspection_bookings");
      localStorage.removeItem("inamaad_property_offers");
      localStorage.removeItem("inamaad_jv_applications");
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

  async function loadDatabasePropertyImages() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("property_images")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setPropertyImages((data || []).map(mapPropertyImageRow));
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

  async function loadDatabasePropertyOffers() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("property_offers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPropertyOffers((data || []).map(mapPropertyOfferRow));
  }

  async function loadDatabaseJvApplications() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("jv_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setJvApplications((data || []).map(mapJVApplicationRow));
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


  async function refreshAllData() {
    if (!supabase) return;

    const savedScrollX = window.scrollX;
    const savedScrollY = window.scrollY;

    setIsRefreshingData(true);

    try {
      await Promise.all([
        loadDatabaseListings(),
        loadDatabasePropertyImages(),
        loadDatabasePropertyViews(),
      ]);

      if (user || adminUnlocked) {
        await Promise.all([
          loadDatabaseInvestorRequests(),
          loadDatabasePropertyInquiries(),
          loadDatabaseContactMessages(),
          loadDatabaseInspectionBookings(),
          loadDatabasePropertyOffers(),
          loadDatabaseJvApplications(),
          loadDatabaseStaffNotifications(),
          loadDatabaseAdminActivityLogs(),
          loadDatabaseStaffMembers(),
        ]);
      }
    } finally {
      setIsRefreshingData(false);

      // Keep background sync invisible and stable. Data can refresh, but the
      // page must not jump while the user is browsing properties/JV deals.
      window.requestAnimationFrame(() => {
        window.scrollTo({
          left: savedScrollX,
          top: savedScrollY,
          behavior: "auto",
        });
      });
    }
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
      await loadDatabasePropertyImages();
      await loadDatabaseContactMessages();
      await loadDatabaseInspectionBookings();
      await loadDatabasePropertyOffers();
      await loadDatabaseJvApplications();
      await loadDatabaseStaffNotifications();
      await loadDatabaseAdminActivityLogs();
      await loadDatabaseStaffMembers();
    }
  }

  async function uploadPropertyImage(file: File) {
    validateUploadFile(file, "image");

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

  async function uploadPropertyGalleryImages(listingId: number, files: File[], startOrder = 1) {
    if (!files.length) return;

    if (supabase) {
      const rows = [];

      for (let index = 0; index < files.length; index += 1) {
        const imageUrl = await uploadPropertyImage(files[index]);
        rows.push({
          listing_id: listingId,
          image_url: imageUrl,
          caption: files[index].name,
          display_order: startOrder + index,
          is_main: false,
        });
      }

      const { error } = await supabase.from("property_images").insert(rows);

      if (error) {
        throw error;
      }

      await loadDatabasePropertyImages();
      return;
    }

    const localRows = await Promise.all(
      files.map(async (file, index) => ({
        id: Date.now() + index,
        listingId,
        imageUrl: await imageFileToBase64(file, "image"),
        caption: file.name,
        displayOrder: startOrder + index,
        isMain: false,
        createdAt: new Date().toISOString(),
      }))
    );

    setPropertyImages((current) => [...current, ...localRows]);
  }

  async function uploadPropertyDocument(file: File) {
    validateUploadFile(file, "document");

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

  async function uploadVerificationDocument(file: File, folder: string) {
    validateUploadFile(file, "document");

    if (!supabase) return "";

    if (!canOpenDocuments) {
      showSuccess("Your role cannot upload owner/agent verification documents.");
      return "";
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const safeFileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const { error } = await supabase.storage
      .from("verification-documents")
      .upload(safeFileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return safeFileName;
  }

  async function openSecureVerificationDocument(documentFileUrl?: string, label = "verification document") {
    if (!canOpenDocuments) {
      showSuccess("Your role cannot open owner/agent verification documents.");
      return;
    }

    if (!documentFileUrl) {
      showSuccess(`No ${label} has been uploaded for this listing.`);
      return;
    }

    if (!supabase || !user) {
      showSuccess("Only signed-in senior staff can open verification documents.");
      return;
    }

    const documentPath = extractStorageObjectPath(documentFileUrl, "verification-documents");

    if (!documentPath) {
      showSuccess("Unable to find the secure verification document path.");
      return;
    }

    const { data, error } = await supabase.storage
      .from("verification-documents")
      .createSignedUrl(documentPath, 300);

    if (error || !data?.signedUrl) {
      console.error(error);
      showSuccess("Unable to open verification document. Make sure you are signed in as senior staff.");
      return;
    }

    await createAdminActivityLog(
      `Opened secure ${label}`,
      "Verification Document",
      documentPath,
      `Staff generated a temporary signed URL for ${label}.`
    );

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function uploadJvDocument(file: File, folder: string) {
    validateUploadFile(file, "document");

    if (!supabase) return "";

    if (!canOpenDocuments) {
      showSuccess("Your role cannot upload JV due-diligence documents.");
      return "";
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const safeFileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const { error } = await supabase.storage
      .from("jv-documents")
      .upload(safeFileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return safeFileName;
  }

  async function openSecureJvDocument(documentFileUrl?: string, label = "JV document") {
    if (!canOpenDocuments) {
      showSuccess("Your role cannot open JV due-diligence documents.");
      return;
    }

    if (!documentFileUrl) {
      showSuccess(`No ${label} has been uploaded for this JV deal.`);
      return;
    }

    if (!supabase || !user) {
      showSuccess("Only signed-in senior staff can open JV due-diligence documents.");
      return;
    }

    const documentPath = extractStorageObjectPath(documentFileUrl, "jv-documents");

    if (!documentPath) {
      showSuccess("Unable to find the secure JV document path.");
      return;
    }

    const { data, error } = await supabase.storage
      .from("jv-documents")
      .createSignedUrl(documentPath, 300);

    if (error || !data?.signedUrl) {
      console.error(error);
      showSuccess("Unable to open JV document. Make sure you are signed in as senior staff.");
      return;
    }

    await createAdminActivityLog(
      `Opened secure ${label}`,
      "JV Document",
      documentPath,
      `Staff generated a temporary signed URL for ${label}.`
    );

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function uploadJvApplicationDocument(file: File, folder: string) {
    validateUploadFile(file, "document");

    if (!supabase) return "";

    const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const safeFileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const { error } = await supabase.storage
      .from("jv-application-documents")
      .upload(safeFileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return safeFileName;
  }

  async function openSecureJvApplicationDocument(documentFileUrl?: string, label = "JV application document") {
    if (!canManageLeads) {
      showSuccess("Your role cannot open JV applicant documents.");
      return;
    }

    if (!documentFileUrl) {
      showSuccess(`No ${label} has been uploaded for this JV applicant.`);
      return;
    }

    if (!supabase || !user) {
      showSuccess("Only signed-in staff can open JV applicant documents.");
      return;
    }

    const documentPath = extractStorageObjectPath(documentFileUrl, "jv-application-documents");

    if (!documentPath) {
      showSuccess("Unable to find the secure JV applicant document path.");
      return;
    }

    const { data, error } = await supabase.storage
      .from("jv-application-documents")
      .createSignedUrl(documentPath, 300);

    if (error || !data?.signedUrl) {
      console.error(error);
      showSuccess("Unable to open JV applicant document. Make sure you are signed in as staff.");
      return;
    }

    await createAdminActivityLog(
      `Opened secure ${label}`,
      "JV Applicant Document",
      documentPath,
      `Staff generated a temporary signed URL for ${label}.`
    );

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  function imageFileToBase64(file: File, category: UploadFileCategory = "document") {
    validateUploadFile(file, category);

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function openListing(listing: Listing) {
    const latestListing =
      listings.find((currentListing) => Number(currentListing.id) === Number(listing.id)) ||
      listing;

    if (autoRefreshTimerRef.current) {
      window.clearTimeout(autoRefreshTimerRef.current);
      autoRefreshTimerRef.current = null;
    }

    setSelectedListing(latestListing);
    setRecentListingIds((currentIds) => [
      latestListing.id,
      ...currentIds.filter((id) => Number(id) !== Number(latestListing.id)),
    ].slice(0, 6));
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
      listingId: latestListing.id,
      listingTitle: latestListing.title,
      viewedAt: new Date().toISOString(),
    };

    try {
      if (supabase) {
        const { error } = await supabase.from("property_views").insert({
          listing_id: latestListing.id,
          listing_title: latestListing.title,
        });

        if (error) {
          console.error(error);
          return;
        }

        if (adminUnlocked) {
          await Promise.all([loadDatabasePropertyViews(), loadDatabasePropertyImages()]);
        }
      } else {
        setPropertyViews((current) => [{ ...newView, id: Date.now() }, ...current]);
      }
    } catch (error) {
      // Viewing analytics must never stop property/JV details from opening.
      console.error(error);
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
    setEditGalleryFiles([]);
    setEditDocumentFile(null);
    setEditIdentityDocumentFile(null);
    setEditCacDocumentFile(null);
    setEditMandateDocumentFile(null);
    setEditJvFeasibilityStudyFile(null);
    setEditJvArchitecturalConceptFile(null);
    setEditJvEstateLayoutFile(null);
    setEditJvBoqFile(null);
    setEditJvProposalDocumentFile(null);
    setEditForm({
      title: listing.title,
      location: listing.location,
      stateName: listing.stateName || listing.location || "FCT Abuja",
      cityArea: listing.cityArea || "",
      fullAddress: listing.fullAddress || "",
      nearbyLandmark: listing.nearbyLandmark || "",
      googleMapLink: listing.googleMapLink || "",
      showExactAddress: Boolean(listing.showExactAddress),
      videoUrl: listing.videoUrl || "",
      virtualTourUrl: listing.virtualTourUrl || "",
      droneVideoUrl: listing.droneVideoUrl || "",
      showVideoPublicly: listing.showVideoPublicly !== false,
      price: listing.price,
      agencyFee: listing.agencyFee || "",
      legalFee: listing.legalFee || "",
      serviceCharge: listing.serviceCharge || "",
      cautionFee: listing.cautionFee || "",
      surveyFee: listing.surveyFee || "",
      developmentFee: listing.developmentFee || "",
      totalEstimatedCost: listing.totalEstimatedCost || calculateTotalEstimatedCost(listing),
      paymentPlanAvailable: Boolean(listing.paymentPlanAvailable),
      installmentDetails: listing.installmentDetails || "",
      bedrooms: listing.bedrooms ? String(listing.bedrooms) : "",
      bathrooms: listing.bathrooms ? String(listing.bathrooms) : "",
      toilets: listing.toilets ? String(listing.toilets) : "",
      parkingSpaces: listing.parkingSpaces ? String(listing.parkingSpaces) : "",
      landSize: listing.landSize || "",
      propertySize: listing.propertySize || "",
      furnishingStatus: listing.furnishingStatus || "Not Specified",
      propertyCondition: listing.propertyCondition || "Not Specified",
      amenities: listing.amenities || "",
      jvStructure: listing.jvStructure || "Landowner + Developer JV",
      jvLandContribution: listing.jvLandContribution || "",
      jvDeveloperRequirement: listing.jvDeveloperRequirement || "",
      jvInvestorRequirement: listing.jvInvestorRequirement || "",
      jvSharingFormula: listing.jvSharingFormula || "",
      jvProjectStage: listing.jvProjectStage || "Land Available",
      jvExpectedUnits: listing.jvExpectedUnits || "",
      jvEstimatedProjectCost: listing.jvEstimatedProjectCost || "",
      jvCompletionTimeline: listing.jvCompletionTimeline || "",
      jvTerms: listing.jvTerms || "",
      jvFeasibilityStudyUrl: listing.jvFeasibilityStudyUrl || "",
      jvArchitecturalConceptUrl: listing.jvArchitecturalConceptUrl || "",
      jvEstateLayoutUrl: listing.jvEstateLayoutUrl || "",
      jvBoqUrl: listing.jvBoqUrl || "",
      jvProposalDocumentUrl: listing.jvProposalDocumentUrl || "",
      jvLandTitleStatus: listing.jvLandTitleStatus || "Not Reviewed",
      jvDevelopmentApprovalStatus: listing.jvDevelopmentApprovalStatus || "Not Reviewed",
      jvDealStatus: listing.jvDealStatus || "New JV",
      jvNextAction: listing.jvNextAction || "",
      jvNextActionDate: listing.jvNextActionDate || "",
      jvInternalNotes: listing.jvInternalNotes || "",
      neighborhoodOverview: listing.neighborhoodOverview || "",
      roadAccess: listing.roadAccess || "",
      powerSupply: listing.powerSupply || "",
      waterSupply: listing.waterSupply || "",
      securityFeatures: listing.securityFeatures || "",
      nearbySchools: listing.nearbySchools || "",
      nearbyHospitals: listing.nearbyHospitals || "",
      nearbyMalls: listing.nearbyMalls || "",
      nearbyTransport: listing.nearbyTransport || "",
      distanceToMajorRoad: listing.distanceToMajorRoad || "",
      estateFeatures: listing.estateFeatures || "",
      type: listing.type,
      category: listing.category,
      availabilityStatus: listing.availabilityStatus || "Available",
      availabilityNote: listing.availabilityNote || "",
      availableFrom: listing.availableFrom || "",
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
      contactRole: listing.contactRole || "Owner",
      companyName: listing.companyName || "",
      contactEmail: listing.contactEmail || "",
      contactWhatsapp: listing.contactWhatsapp || "",
      contactAddress: listing.contactAddress || "",
      publicContactVisibility: listing.publicContactVisibility || "Hide Phone",
      mandateStatus: listing.mandateStatus || "Not Confirmed",
      identityType: listing.identityType || "Not Provided",
      identityNumber: listing.identityNumber || "",
      companyRegistrationNumber: listing.companyRegistrationNumber || "",
      mandateDocumentStatus: listing.mandateDocumentStatus || "Not Provided",
      contactProfileVerified: Boolean(listing.contactProfileVerified),
      contactVerificationNotes: listing.contactVerificationNotes || "",
      identityDocumentUrl: listing.identityDocumentUrl || "",
      cacDocumentUrl: listing.cacDocumentUrl || "",
      mandateDocumentUrl: listing.mandateDocumentUrl || "",
      imageUrl: listing.imageUrl || "",
      featured: Boolean(listing.featured),
      featuredRank: String(listing.featuredRank || 0),
    });
    setModal("edit");
  }

  function switchPostSubmissionMode(mode: "property" | "jv") {
    setPostMode(mode);
    setPostFormRenderKey((current) => current + 1);
    setPostImageFile(null);
    setPostGalleryFiles([]);
    setPostDocumentFile(null);

    setPostForm((current) => {
      if (mode === "jv") {
        return {
          ...current,
          title: current.title || "JV Development Opportunity",
          type: "Joint Venture",
          category: "JV Partnership",
          price: current.price,
          bedrooms: "",
          bathrooms: "",
          toilets: "",
          parkingSpaces: "",
          propertySize: "",
          furnishingStatus: "Not Specified",
          propertyCondition: "Not Specified",
          amenities: "",
          jvStructure: current.jvStructure || "Landowner + Developer JV",
          jvProjectStage: current.jvProjectStage || "Land Available",
          jvDealStatus: current.jvDealStatus || "New JV",
          yieldText: current.yieldText || "Structured JV partnership opportunity",
        };
      }

      return {
        ...current,
        title: current.title === "JV Development Opportunity" ? "" : current.title,
        type: isJointVentureListing(current) ? "Residential" : current.type || "Residential",
        category:
          current.category === "JV Partnership" || current.category.toLowerCase().includes("jv")
            ? "For Sale"
            : current.category || "For Sale",
        jvStructure: "Landowner + Developer JV",
        jvLandContribution: "",
        jvDeveloperRequirement: "",
        jvInvestorRequirement: "",
        jvSharingFormula: "",
        jvProjectStage: "Land Available",
        jvExpectedUnits: "",
        jvEstimatedProjectCost: "",
        jvCompletionTimeline: "",
        jvTerms: "",
        jvDealStatus: "New JV",
        jvNextAction: "",
        jvNextActionDate: "",
        jvInternalNotes: "",
      };
    });

    scheduleAutoRefresh(0);
  }

  function openPostModal(mode: "property" | "jv") {
    switchPostSubmissionMode(mode);
    setModal("post");
    window.setTimeout(() => scheduleAutoRefresh(0), 0);
  }

  async function submitListing(event: React.FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const imageUrl = postImageFile
        ? supabase
          ? await uploadPropertyImage(postImageFile)
          : await imageFileToBase64(postImageFile, "image")
        : "";

      const documentFileUrl = postDocumentFile
        ? supabase
          ? await uploadPropertyDocument(postDocumentFile)
          : await imageFileToBase64(postDocumentFile)
        : "";

      const postIsJV = postMode === "jv";

      const newListing: Omit<Listing, "id"> = {
        title: postForm.title,
        location: buildListingLocationValue(postForm),
        stateName: postForm.stateName,
        cityArea: postForm.cityArea,
        fullAddress: postForm.fullAddress,
        nearbyLandmark: postForm.nearbyLandmark,
        googleMapLink: postForm.googleMapLink,
        showExactAddress: postForm.showExactAddress,
        videoUrl: postForm.videoUrl,
        virtualTourUrl: postForm.virtualTourUrl,
        droneVideoUrl: postForm.droneVideoUrl,
        showVideoPublicly: postForm.showVideoPublicly,
        price: postForm.price,
        value: currencyToValue(postForm.price),
        agencyFee: postForm.agencyFee,
        legalFee: postForm.legalFee,
        serviceCharge: postForm.serviceCharge,
        cautionFee: postForm.cautionFee,
        surveyFee: postForm.surveyFee,
        developmentFee: postForm.developmentFee,
        totalEstimatedCost: calculateTotalEstimatedCost(postForm),
        paymentPlanAvailable: postForm.paymentPlanAvailable,
        installmentDetails: postForm.installmentDetails,
        bedrooms: postIsJV ? undefined : postForm.bedrooms ? Number(postForm.bedrooms) : undefined,
        bathrooms: postIsJV ? undefined : postForm.bathrooms ? Number(postForm.bathrooms) : undefined,
        toilets: postIsJV ? undefined : postForm.toilets ? Number(postForm.toilets) : undefined,
        parkingSpaces: postIsJV ? undefined : postForm.parkingSpaces ? Number(postForm.parkingSpaces) : undefined,
        landSize: postForm.landSize,
        propertySize: postIsJV ? "" : postForm.propertySize,
        furnishingStatus: postIsJV ? "Not Specified" : postForm.furnishingStatus,
        propertyCondition: postIsJV ? "Not Specified" : postForm.propertyCondition,
        amenities: postIsJV ? "" : postForm.amenities,
        jvStructure: postIsJV ? postForm.jvStructure : "",
        jvLandContribution: postIsJV ? postForm.jvLandContribution : "",
        jvDeveloperRequirement: postIsJV ? postForm.jvDeveloperRequirement : "",
        jvInvestorRequirement: postIsJV ? postForm.jvInvestorRequirement : "",
        jvSharingFormula: postIsJV ? postForm.jvSharingFormula : "",
        jvProjectStage: postIsJV ? postForm.jvProjectStage : "",
        jvExpectedUnits: postIsJV ? postForm.jvExpectedUnits : "",
        jvEstimatedProjectCost: postIsJV ? postForm.jvEstimatedProjectCost : "",
        jvCompletionTimeline: postIsJV ? postForm.jvCompletionTimeline : "",
        jvTerms: postIsJV ? postForm.jvTerms : "",
        jvFeasibilityStudyUrl: postIsJV ? postForm.jvFeasibilityStudyUrl : "",
        jvArchitecturalConceptUrl: postIsJV ? postForm.jvArchitecturalConceptUrl : "",
        jvEstateLayoutUrl: postIsJV ? postForm.jvEstateLayoutUrl : "",
        jvBoqUrl: postIsJV ? postForm.jvBoqUrl : "",
        jvProposalDocumentUrl: postIsJV ? postForm.jvProposalDocumentUrl : "",
        jvLandTitleStatus: postIsJV ? postForm.jvLandTitleStatus as Listing["jvLandTitleStatus"] : undefined,
        jvDevelopmentApprovalStatus: postIsJV ? postForm.jvDevelopmentApprovalStatus as Listing["jvDevelopmentApprovalStatus"] : undefined,
        jvDealStatus: postIsJV ? "New JV" : undefined,
        jvNextAction: postIsJV ? "Review JV structure and due diligence documents" : "",
        jvNextActionDate: "",
        jvInternalNotes: "",
        neighborhoodOverview: postForm.neighborhoodOverview,
        roadAccess: postForm.roadAccess,
        powerSupply: postForm.powerSupply,
        waterSupply: postForm.waterSupply,
        securityFeatures: postForm.securityFeatures,
        nearbySchools: postForm.nearbySchools,
        nearbyHospitals: postForm.nearbyHospitals,
        nearbyMalls: postForm.nearbyMalls,
        nearbyTransport: postForm.nearbyTransport,
        distanceToMajorRoad: postForm.distanceToMajorRoad,
        estateFeatures: postForm.estateFeatures,
        type: postForm.type,
        category: postForm.category,
        availabilityStatus: postForm.availabilityStatus,
        availabilityNote: postForm.availabilityNote,
        availableFrom: postForm.availableFrom,
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
        contactRole: postForm.contactRole,
        companyName: postForm.companyName,
        contactEmail: postForm.contactEmail,
        contactWhatsapp: postForm.contactWhatsapp,
        contactAddress: postForm.contactAddress,
        publicContactVisibility: postForm.publicContactVisibility,
        mandateStatus: postForm.mandateStatus,
        identityType: postForm.identityType,
        identityNumber: postForm.identityNumber,
        companyRegistrationNumber: postForm.companyRegistrationNumber,
        mandateDocumentStatus: postForm.mandateDocumentStatus,
        contactProfileVerified: false,
        contactVerificationNotes: postForm.contactVerificationNotes,
        imageUrl,
        featured: false,
        featuredRank: 0,
        createdAt: new Date().toISOString(),
      };

      if (supabase) {
        const { data, error } = await supabase
          .from("listings")
          .insert(
            listingToRow({
              ...newListing,
              status: "Pending Review",
            })
          )
          .select("id")
          .single();

        if (error) {
          console.error(error);
          showSuccess("Unable to submit listing. Check database settings.");
          return;
        }

        if (data?.id && postGalleryFiles.length) {
          await uploadPropertyGalleryImages(Number(data.id), postGalleryFiles, 1);
        }

        await loadDatabaseListings();
      } else {
        const localListingId = Date.now();
        setListings((current) => [
          { ...newListing, id: localListingId },
          ...current,
        ]);
        if (postGalleryFiles.length) {
          await uploadPropertyGalleryImages(localListingId, postGalleryFiles, 1);
        }
      }

      await createStaffNotification(
        "New pending property",
        `${postForm.title} was submitted for admin review in ${buildListingLocationValue(postForm)}.`,
        "Pending Property"
      );

      setPostForm({
        title: "",
        location: "",
        stateName: "FCT Abuja",
        cityArea: "",
        fullAddress: "",
        nearbyLandmark: "",
        googleMapLink: "",
        showExactAddress: false,
        videoUrl: "",
        virtualTourUrl: "",
        droneVideoUrl: "",
        showVideoPublicly: true,
        price: "",
        agencyFee: "",
        legalFee: "",
        serviceCharge: "",
        cautionFee: "",
        surveyFee: "",
        developmentFee: "",
        totalEstimatedCost: "",
        paymentPlanAvailable: false,
        installmentDetails: "",
        bedrooms: "",
        bathrooms: "",
        toilets: "",
        parkingSpaces: "",
        landSize: "",
        propertySize: "",
        furnishingStatus: "Not Specified",
        propertyCondition: "Not Specified",
        amenities: "",
        jvStructure: "Landowner + Developer JV",
        jvLandContribution: "",
        jvDeveloperRequirement: "",
        jvInvestorRequirement: "",
        jvSharingFormula: "",
        jvProjectStage: "Land Available",
        jvExpectedUnits: "",
        jvEstimatedProjectCost: "",
        jvCompletionTimeline: "",
        jvTerms: "",
        jvFeasibilityStudyUrl: "",
        jvArchitecturalConceptUrl: "",
        jvEstateLayoutUrl: "",
        jvBoqUrl: "",
        jvProposalDocumentUrl: "",
        jvLandTitleStatus: "Not Reviewed",
        jvDevelopmentApprovalStatus: "Not Reviewed",
        jvDealStatus: "New JV" as JVDealStatus,
        jvNextAction: "",
        jvNextActionDate: "",
        jvInternalNotes: "",
        neighborhoodOverview: "",
        roadAccess: "",
        powerSupply: "",
        waterSupply: "",
        securityFeatures: "",
        nearbySchools: "",
        nearbyHospitals: "",
        nearbyMalls: "",
        nearbyTransport: "",
        distanceToMajorRoad: "",
        estateFeatures: "",
        type: "Residential",
        category: "For Sale",
        availabilityStatus: "Available" as AvailabilityStatus,
        availabilityNote: "",
        availableFrom: "",
        yieldText: "",
        description: "",
        documentTitle: "C of O / Certificate of Occupancy",
        documentStatus: "Available",
        documentDetails: "",
        documentFileUrl: "",
        ownerName: "",
        ownerPhone: "",
        contactRole: "Owner",
        companyName: "",
        contactEmail: "",
        contactWhatsapp: "",
        contactAddress: "",
        publicContactVisibility: "Hide Phone",
        mandateStatus: "Not Confirmed",
        identityType: "Not Provided",
        identityNumber: "",
        companyRegistrationNumber: "",
        mandateDocumentStatus: "Not Provided",
        contactProfileVerified: false,
        contactVerificationNotes: "",
        identityDocumentUrl: "",
        cacDocumentUrl: "",
        mandateDocumentUrl: "",
      });
      setPostMode("property");
      setPostFormRenderKey((current) => current + 1);
      setPostImageFile(null);
      setPostGalleryFiles([]);
      setPostDocumentFile(null);

      setModal(null);
      showSuccess("Opportunity submitted successfully. Admin review is pending.");
    } catch (error) {
      console.error(error);
      showSuccess(
        error instanceof Error
          ? error.message
          : "Upload failed. Please check image/document size and try again."
      );
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
          : await imageFileToBase64(editImageFile, "image")
        : editForm.imageUrl;

      const documentFileUrl = editDocumentFile
        ? supabase
          ? await uploadPropertyDocument(editDocumentFile)
          : await imageFileToBase64(editDocumentFile)
        : editForm.documentFileUrl;

      const identityDocumentUrl = editIdentityDocumentFile
        ? supabase
          ? await uploadVerificationDocument(editIdentityDocumentFile, "identity")
          : await imageFileToBase64(editIdentityDocumentFile)
        : editForm.identityDocumentUrl;

      const cacDocumentUrl = editCacDocumentFile
        ? supabase
          ? await uploadVerificationDocument(editCacDocumentFile, "cac")
          : await imageFileToBase64(editCacDocumentFile)
        : editForm.cacDocumentUrl;

      const mandateDocumentUrl = editMandateDocumentFile
        ? supabase
          ? await uploadVerificationDocument(editMandateDocumentFile, "mandate")
          : await imageFileToBase64(editMandateDocumentFile)
        : editForm.mandateDocumentUrl;

      const jvFeasibilityStudyUrl = editJvFeasibilityStudyFile
        ? supabase
          ? await uploadJvDocument(editJvFeasibilityStudyFile, "feasibility-study")
          : await imageFileToBase64(editJvFeasibilityStudyFile)
        : editForm.jvFeasibilityStudyUrl;

      const jvArchitecturalConceptUrl = editJvArchitecturalConceptFile
        ? supabase
          ? await uploadJvDocument(editJvArchitecturalConceptFile, "architectural-concept")
          : await imageFileToBase64(editJvArchitecturalConceptFile)
        : editForm.jvArchitecturalConceptUrl;

      const jvEstateLayoutUrl = editJvEstateLayoutFile
        ? supabase
          ? await uploadJvDocument(editJvEstateLayoutFile, "estate-layout")
          : await imageFileToBase64(editJvEstateLayoutFile)
        : editForm.jvEstateLayoutUrl;

      const jvBoqUrl = editJvBoqFile
        ? supabase
          ? await uploadJvDocument(editJvBoqFile, "boq-costing")
          : await imageFileToBase64(editJvBoqFile)
        : editForm.jvBoqUrl;

      const jvProposalDocumentUrl = editJvProposalDocumentFile
        ? supabase
          ? await uploadJvDocument(editJvProposalDocumentFile, "proposal")
          : await imageFileToBase64(editJvProposalDocumentFile)
        : editForm.jvProposalDocumentUrl;

      const editIsJV = isJointVentureListing(editForm);

      const updatedListing: Listing = {
        ...editingListing,
        title: editForm.title,
        location: buildListingLocationValue(editForm),
        stateName: editForm.stateName,
        cityArea: editForm.cityArea,
        fullAddress: editForm.fullAddress,
        nearbyLandmark: editForm.nearbyLandmark,
        googleMapLink: editForm.googleMapLink,
        showExactAddress: editForm.showExactAddress,
        videoUrl: editForm.videoUrl,
        virtualTourUrl: editForm.virtualTourUrl,
        droneVideoUrl: editForm.droneVideoUrl,
        showVideoPublicly: editForm.showVideoPublicly,
        price: editForm.price,
        value: currencyToValue(editForm.price),
        agencyFee: editForm.agencyFee,
        legalFee: editForm.legalFee,
        serviceCharge: editForm.serviceCharge,
        cautionFee: editForm.cautionFee,
        surveyFee: editForm.surveyFee,
        developmentFee: editForm.developmentFee,
        totalEstimatedCost: calculateTotalEstimatedCost(editForm),
        paymentPlanAvailable: editForm.paymentPlanAvailable,
        installmentDetails: editForm.installmentDetails,
        bedrooms: editIsJV ? undefined : editForm.bedrooms ? Number(editForm.bedrooms) : undefined,
        bathrooms: editIsJV ? undefined : editForm.bathrooms ? Number(editForm.bathrooms) : undefined,
        toilets: editIsJV ? undefined : editForm.toilets ? Number(editForm.toilets) : undefined,
        parkingSpaces: editIsJV ? undefined : editForm.parkingSpaces ? Number(editForm.parkingSpaces) : undefined,
        landSize: editForm.landSize,
        propertySize: editIsJV ? "" : editForm.propertySize,
        furnishingStatus: editIsJV ? "Not Specified" : editForm.furnishingStatus,
        propertyCondition: editIsJV ? "Not Specified" : editForm.propertyCondition,
        amenities: editIsJV ? "" : editForm.amenities,
        jvStructure: editIsJV ? editForm.jvStructure : "",
        jvLandContribution: editIsJV ? editForm.jvLandContribution : "",
        jvDeveloperRequirement: editIsJV ? editForm.jvDeveloperRequirement : "",
        jvInvestorRequirement: editIsJV ? editForm.jvInvestorRequirement : "",
        jvSharingFormula: editIsJV ? editForm.jvSharingFormula : "",
        jvProjectStage: editIsJV ? editForm.jvProjectStage : "",
        jvExpectedUnits: editIsJV ? editForm.jvExpectedUnits : "",
        jvEstimatedProjectCost: editIsJV ? editForm.jvEstimatedProjectCost : "",
        jvCompletionTimeline: editIsJV ? editForm.jvCompletionTimeline : "",
        jvTerms: editIsJV ? editForm.jvTerms : "",
        jvFeasibilityStudyUrl: editIsJV ? jvFeasibilityStudyUrl : "",
        jvArchitecturalConceptUrl: editIsJV ? jvArchitecturalConceptUrl : "",
        jvEstateLayoutUrl: editIsJV ? jvEstateLayoutUrl : "",
        jvBoqUrl: editIsJV ? jvBoqUrl : "",
        jvProposalDocumentUrl: editIsJV ? jvProposalDocumentUrl : "",
        jvLandTitleStatus: editIsJV ? editForm.jvLandTitleStatus as Listing["jvLandTitleStatus"] : undefined,
        jvDevelopmentApprovalStatus: editIsJV ? editForm.jvDevelopmentApprovalStatus as Listing["jvDevelopmentApprovalStatus"] : undefined,
        jvDealStatus: editIsJV ? editForm.jvDealStatus as JVDealStatus : undefined,
        jvNextAction: editIsJV ? editForm.jvNextAction : "",
        jvNextActionDate: editIsJV ? editForm.jvNextActionDate : "",
        jvInternalNotes: editIsJV ? editForm.jvInternalNotes : "",
        neighborhoodOverview: editForm.neighborhoodOverview,
        roadAccess: editForm.roadAccess,
        powerSupply: editForm.powerSupply,
        waterSupply: editForm.waterSupply,
        securityFeatures: editForm.securityFeatures,
        nearbySchools: editForm.nearbySchools,
        nearbyHospitals: editForm.nearbyHospitals,
        nearbyMalls: editForm.nearbyMalls,
        nearbyTransport: editForm.nearbyTransport,
        distanceToMajorRoad: editForm.distanceToMajorRoad,
        estateFeatures: editForm.estateFeatures,
        type: editForm.type,
        category: editForm.category,
        availabilityStatus: editForm.availabilityStatus as AvailabilityStatus,
        availabilityNote: editForm.availabilityNote,
        availableFrom: editForm.availableFrom,
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
        contactRole: editForm.contactRole,
        companyName: editForm.companyName,
        contactEmail: editForm.contactEmail,
        contactWhatsapp: editForm.contactWhatsapp,
        contactAddress: editForm.contactAddress,
        publicContactVisibility: editForm.publicContactVisibility,
        mandateStatus: editForm.mandateStatus,
        identityType: editForm.identityType,
        identityNumber: editForm.identityNumber,
        companyRegistrationNumber: editForm.companyRegistrationNumber,
        mandateDocumentStatus: editForm.mandateDocumentStatus,
        contactProfileVerified: Boolean(editForm.contactProfileVerified),
        contactVerificationNotes: editForm.contactVerificationNotes,
        identityDocumentUrl,
        cacDocumentUrl,
        mandateDocumentUrl,
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
              stateName: updatedListing.stateName,
              cityArea: updatedListing.cityArea,
              fullAddress: updatedListing.fullAddress,
              nearbyLandmark: updatedListing.nearbyLandmark,
              googleMapLink: updatedListing.googleMapLink,
              showExactAddress: updatedListing.showExactAddress,
              videoUrl: updatedListing.videoUrl,
              virtualTourUrl: updatedListing.virtualTourUrl,
              droneVideoUrl: updatedListing.droneVideoUrl,
              showVideoPublicly: updatedListing.showVideoPublicly,
              price: updatedListing.price,
              value: updatedListing.value,
              agencyFee: updatedListing.agencyFee,
              legalFee: updatedListing.legalFee,
              serviceCharge: updatedListing.serviceCharge,
              cautionFee: updatedListing.cautionFee,
              surveyFee: updatedListing.surveyFee,
              developmentFee: updatedListing.developmentFee,
              totalEstimatedCost: updatedListing.totalEstimatedCost,
              paymentPlanAvailable: updatedListing.paymentPlanAvailable,
              installmentDetails: updatedListing.installmentDetails,
              bedrooms: updatedListing.bedrooms,
              bathrooms: updatedListing.bathrooms,
              toilets: updatedListing.toilets,
              parkingSpaces: updatedListing.parkingSpaces,
              landSize: updatedListing.landSize,
              propertySize: updatedListing.propertySize,
              furnishingStatus: updatedListing.furnishingStatus,
              propertyCondition: updatedListing.propertyCondition,
              amenities: updatedListing.amenities,
              jvStructure: updatedListing.jvStructure,
              jvLandContribution: updatedListing.jvLandContribution,
              jvDeveloperRequirement: updatedListing.jvDeveloperRequirement,
              jvInvestorRequirement: updatedListing.jvInvestorRequirement,
              jvSharingFormula: updatedListing.jvSharingFormula,
              jvProjectStage: updatedListing.jvProjectStage,
              jvExpectedUnits: updatedListing.jvExpectedUnits,
              jvEstimatedProjectCost: updatedListing.jvEstimatedProjectCost,
              jvCompletionTimeline: updatedListing.jvCompletionTimeline,
              jvTerms: updatedListing.jvTerms,
              jvFeasibilityStudyUrl: updatedListing.jvFeasibilityStudyUrl,
              jvArchitecturalConceptUrl: updatedListing.jvArchitecturalConceptUrl,
              jvEstateLayoutUrl: updatedListing.jvEstateLayoutUrl,
              jvBoqUrl: updatedListing.jvBoqUrl,
              jvProposalDocumentUrl: updatedListing.jvProposalDocumentUrl,
              jvLandTitleStatus: updatedListing.jvLandTitleStatus,
              jvDevelopmentApprovalStatus: updatedListing.jvDevelopmentApprovalStatus,
              jvDealStatus: updatedListing.jvDealStatus,
              jvNextAction: updatedListing.jvNextAction,
              jvNextActionDate: updatedListing.jvNextActionDate,
              jvInternalNotes: updatedListing.jvInternalNotes,
              neighborhoodOverview: updatedListing.neighborhoodOverview,
              roadAccess: updatedListing.roadAccess,
              powerSupply: updatedListing.powerSupply,
              waterSupply: updatedListing.waterSupply,
              securityFeatures: updatedListing.securityFeatures,
              nearbySchools: updatedListing.nearbySchools,
              nearbyHospitals: updatedListing.nearbyHospitals,
              nearbyMalls: updatedListing.nearbyMalls,
              nearbyTransport: updatedListing.nearbyTransport,
              distanceToMajorRoad: updatedListing.distanceToMajorRoad,
              estateFeatures: updatedListing.estateFeatures,
              type: updatedListing.type,
              category: updatedListing.category,
              availabilityStatus: updatedListing.availabilityStatus,
              availabilityNote: updatedListing.availabilityNote,
              availableFrom: updatedListing.availableFrom,
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
              contactRole: updatedListing.contactRole,
              companyName: updatedListing.companyName,
              contactEmail: updatedListing.contactEmail,
              contactWhatsapp: updatedListing.contactWhatsapp,
              contactAddress: updatedListing.contactAddress,
              publicContactVisibility: updatedListing.publicContactVisibility,
              mandateStatus: updatedListing.mandateStatus,
              identityType: updatedListing.identityType,
              identityNumber: updatedListing.identityNumber,
              companyRegistrationNumber: updatedListing.companyRegistrationNumber,
              mandateDocumentStatus: updatedListing.mandateDocumentStatus,
              contactProfileVerified: updatedListing.contactProfileVerified,
              contactVerificationNotes: updatedListing.contactVerificationNotes,
              identityDocumentUrl: updatedListing.identityDocumentUrl,
              cacDocumentUrl: updatedListing.cacDocumentUrl,
              mandateDocumentUrl: updatedListing.mandateDocumentUrl,
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

        if (editGalleryFiles.length) {
          await uploadPropertyGalleryImages(editingListing.id, editGalleryFiles, (propertyImagesByListingId[editingListing.id]?.length || 0) + 1);
        }

        await loadDatabaseListings();
      } else {
        setListings((current) =>
          current.map((listing) =>
            listing.id === editingListing.id ? updatedListing : listing
          )
        );
        if (editGalleryFiles.length) {
          await uploadPropertyGalleryImages(editingListing.id, editGalleryFiles, (propertyImagesByListingId[editingListing.id]?.length || 0) + 1);
        }
      }

      await createAdminActivityLog(
        "Edited property listing",
        "Listing",
        String(editingListing.id),
        `${updatedListing.title} updated. Status: ${updatedListing.status}. Verification: ${verificationSummary(updatedListing)}.`
      );

      setEditImageFile(null);
      setEditGalleryFiles([]);
      setEditDocumentFile(null);
      setEditIdentityDocumentFile(null);
      setEditCacDocumentFile(null);
      setEditMandateDocumentFile(null);
      setEditJvFeasibilityStudyFile(null);
      setEditJvArchitecturalConceptFile(null);
      setEditJvEstateLayoutFile(null);
      setEditJvBoqFile(null);
      setEditJvProposalDocumentFile(null);
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

    const formKey: LeadKind = "investor_requests";

    if (
      !beginPublicFormSubmit(formKey, [
        { ok: hasMinimumText(investorForm.name, 2), message: "Please enter your full name." },
        { ok: optionalEmailIsValid(investorForm.email) && hasMinimumText(investorForm.email, 6), message: "Please enter a valid email address." },
        { ok: phoneLooksValid(investorForm.phone), message: "Please enter a valid phone or WhatsApp number." },
        { ok: hasMinimumText(investorForm.budget, 1), message: "Please enter your investment budget." },
        { ok: isWithinLimit(investorForm.message, 5000), message: "Your message is too long." },
      ])
    ) {
      return;
    }

    try {
      const newRequest: Omit<InvestorRequest, "id"> = {
        ...investorForm,
        status: "New",
        createdAt: new Date().toISOString(),
      };

      if (supabase) {
        const { error } = await supabase.from("investor_requests").insert({
          name: cleanFormText(investorForm.name),
          email: cleanFormText(investorForm.email),
          phone: cleanFormText(investorForm.phone),
          budget: cleanFormText(investorForm.budget),
          interest: investorForm.interest,
          message: cleanFormText(investorForm.message),
          status: "New",
        });

        if (error) {
          console.error(error);
          showSuccess("Unable to submit investor request. Please check your details and try again.");
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

      resetPublicFormBotTrap(formKey);
      setModal(null);
      showSuccess("Investor request saved. INAMAAD will contact you shortly.");
    } finally {
      finishPublicFormSubmit(formKey);
    }
  }
  async function submitPropertyInquiry(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedListing) return;

    const formKey: LeadKind = "property_inquiries";

    if (
      !beginPublicFormSubmit(formKey, [
        { ok: hasMinimumText(inquiryForm.name, 2), message: "Please enter your name." },
        { ok: optionalEmailIsValid(inquiryForm.email), message: "Please enter a valid email address or leave it empty." },
        { ok: phoneLooksValid(inquiryForm.phone), message: "Please enter a valid phone or WhatsApp number." },
        { ok: isWithinLimit(inquiryForm.message, 5000), message: "Your message is too long." },
      ])
    ) {
      return;
    }

    try {
      const newInquiry: Omit<PropertyInquiry, "id"> = {
        listingId: selectedListing.id,
        listingTitle: selectedListing.title,
        name: cleanFormText(inquiryForm.name),
        email: cleanFormText(inquiryForm.email),
        phone: cleanFormText(inquiryForm.phone),
        message: cleanFormText(inquiryForm.message),
        status: "New",
        createdAt: new Date().toISOString(),
      };

      if (supabase) {
        const { error } = await supabase.from("property_inquiries").insert({
          listing_id: selectedListing.id,
          listing_title: selectedListing.title,
          name: cleanFormText(inquiryForm.name),
          email: cleanFormText(inquiryForm.email) || null,
          phone: cleanFormText(inquiryForm.phone),
          message: cleanFormText(inquiryForm.message) || null,
        });

        if (error) {
          console.error(error);
          showSuccess("Unable to submit inquiry. Please check your details and try again.");
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
      resetPublicFormBotTrap(formKey);
      setModal(null);
      showSuccess("Inquiry sent. INAMAAD will contact you shortly.");
    } finally {
      finishPublicFormSubmit(formKey);
    }
  }
  async function submitInspectionBooking(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedListing) return;

    const formKey: LeadKind = "inspection_bookings";

    if (
      !beginPublicFormSubmit(formKey, [
        { ok: hasMinimumText(inspectionForm.name, 2), message: "Please enter your name." },
        { ok: optionalEmailIsValid(inspectionForm.email), message: "Please enter a valid email address or leave it empty." },
        { ok: phoneLooksValid(inspectionForm.phone), message: "Please enter a valid phone or WhatsApp number." },
        { ok: isWithinLimit(inspectionForm.message, 5000), message: "Your inspection message is too long." },
      ])
    ) {
      return;
    }

    try {
      const newBooking: Omit<InspectionBooking, "id"> = {
        listingId: selectedListing.id,
        listingTitle: selectedListing.title,
        name: cleanFormText(inspectionForm.name),
        email: cleanFormText(inspectionForm.email),
        phone: cleanFormText(inspectionForm.phone),
        preferredDate: inspectionForm.preferredDate,
        preferredTime: inspectionForm.preferredTime,
        message: cleanFormText(inspectionForm.message),
        status: "New",
        createdAt: new Date().toISOString(),
      };

      if (supabase) {
        const { error } = await supabase.from("inspection_bookings").insert({
          listing_id: selectedListing.id,
          listing_title: selectedListing.title,
          name: cleanFormText(inspectionForm.name),
          email: cleanFormText(inspectionForm.email) || null,
          phone: cleanFormText(inspectionForm.phone),
          preferred_date: inspectionForm.preferredDate || null,
          preferred_time: inspectionForm.preferredTime || null,
          message: cleanFormText(inspectionForm.message) || null,
          status: "New",
        });

        if (error) {
          console.error(error);
          showSuccess("Unable to book inspection. Please check your details and try again.");
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
      resetPublicFormBotTrap(formKey);
      showSuccess("Inspection booking sent. INAMAAD will confirm your appointment.");
    } finally {
      finishPublicFormSubmit(formKey);
    }
  }
  async function submitPropertyOffer(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedListing) return;

    const formKey: LeadKind = "property_offers";

    if (
      !beginPublicFormSubmit(formKey, [
        { ok: hasMinimumText(offerForm.buyerName, 2), message: "Please enter the buyer name." },
        { ok: optionalEmailIsValid(offerForm.buyerEmail), message: "Please enter a valid email address or leave it empty." },
        { ok: phoneLooksValid(offerForm.buyerPhone), message: "Please enter a valid phone or WhatsApp number." },
        { ok: isWithinLimit(offerForm.message, 5000), message: "Your offer message is too long." },
      ])
    ) {
      return;
    }

    try {
      const formattedOfferAmount = formatPriceInput(offerForm.offerAmount) || offerForm.offerAmount;

      const newOffer: Omit<PropertyOffer, "id"> = {
        listingId: selectedListing.id,
        listingTitle: selectedListing.title,
        buyerName: cleanFormText(offerForm.buyerName),
        buyerEmail: cleanFormText(offerForm.buyerEmail),
        buyerPhone: cleanFormText(offerForm.buyerPhone),
        offerAmount: formattedOfferAmount,
        paymentPlan: offerForm.paymentPlan,
        message: cleanFormText(offerForm.message),
        status: "New",
        priority: "High",
        createdAt: new Date().toISOString(),
      };

      if (supabase) {
        const { error } = await supabase.from("property_offers").insert({
          listing_id: selectedListing.id,
          listing_title: selectedListing.title,
          buyer_name: cleanFormText(offerForm.buyerName),
          buyer_email: cleanFormText(offerForm.buyerEmail) || null,
          buyer_phone: cleanFormText(offerForm.buyerPhone),
          offer_amount: cleanFormText(formattedOfferAmount) || null,
          payment_plan: offerForm.paymentPlan || null,
          message: cleanFormText(offerForm.message) || null,
          status: "New",
          priority: "High",
        });

        if (error) {
          console.error(error);
          showSuccess("Unable to submit offer. Please check your details and try again.");
          return;
        }
      } else {
        setPropertyOffers((current) => [{ ...newOffer, id: Date.now() }, ...current]);
      }

      await createStaffNotification(
        "New property offer",
        `${offerForm.buyerName} made an offer/reservation request for ${selectedListing.title}${formattedOfferAmount ? ` at ${formattedOfferAmount}` : ""}.`,
        "Property Offer"
      );

      setOfferForm({
        buyerName: "",
        buyerEmail: "",
        buyerPhone: "",
        offerAmount: "",
        paymentPlan: "Full payment",
        message: "",
      });

      resetPublicFormBotTrap(formKey);
      showSuccess("Offer/reservation request sent. INAMAAD will review and contact you shortly.");
    } finally {
      finishPublicFormSubmit(formKey);
    }
  }
  async function submitJvApplication(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedListing) return;

    const formKey: LeadKind = "jv_applications";

    if (
      !beginPublicFormSubmit(formKey, [
        { ok: hasMinimumText(jvApplicationForm.applicantName, 2), message: "Please enter your full name." },
        { ok: optionalEmailIsValid(jvApplicationForm.applicantEmail), message: "Please enter a valid email address or leave it empty." },
        { ok: phoneLooksValid(jvApplicationForm.applicantPhone), message: "Please enter a valid phone or WhatsApp number." },
        { ok: isWithinLimit(jvApplicationForm.companyName, 180), message: "Company name is too long." },
        { ok: isWithinLimit(jvApplicationForm.experienceSummary, 10000), message: "Experience summary is too long." },
        { ok: isWithinLimit(jvApplicationForm.proposalMessage, 10000), message: "JV proposal message is too long." },
      ])
    ) {
      return;
    }

    try {
      let companyProfileUrl = "";
      let cacCertificateUrl = "";
      let portfolioUrl = "";
      let financialProofUrl = "";
      let proposalDocumentUrl = "";
      let otherDocumentUrl = "";

      try {
        if (supabase) {
          companyProfileUrl = jvCompanyProfileFile
            ? await uploadJvApplicationDocument(jvCompanyProfileFile, "company-profile")
            : "";
          cacCertificateUrl = jvCacCertificateFile
            ? await uploadJvApplicationDocument(jvCacCertificateFile, "cac-certificate")
            : "";
          portfolioUrl = jvPortfolioFile
            ? await uploadJvApplicationDocument(jvPortfolioFile, "portfolio")
            : "";
          financialProofUrl = jvFinancialProofFile
            ? await uploadJvApplicationDocument(jvFinancialProofFile, "financial-proof")
            : "";
          proposalDocumentUrl = jvProposalDocumentFile
            ? await uploadJvApplicationDocument(jvProposalDocumentFile, "proposal-document")
            : "";
          otherDocumentUrl = jvOtherDocumentFile
            ? await uploadJvApplicationDocument(jvOtherDocumentFile, "other")
            : "";
        }
      } catch (error) {
        console.error(error);
        showSuccess("Unable to upload JV application document. Use PDF, JPG, PNG, or WEBP under 20MB.");
        return;
      }

      const newApplication: Omit<JVApplication, "id"> = {
        listingId: selectedListing.id,
        listingTitle: selectedListing.title,
        applicantName: cleanFormText(jvApplicationForm.applicantName),
        applicantEmail: cleanFormText(jvApplicationForm.applicantEmail),
        applicantPhone: cleanFormText(jvApplicationForm.applicantPhone),
        applicantRole: jvApplicationForm.applicantRole,
        companyName: cleanFormText(jvApplicationForm.companyName),
        budgetCapacity: cleanFormText(jvApplicationForm.budgetCapacity),
        experienceSummary: cleanFormText(jvApplicationForm.experienceSummary),
        proposalMessage: cleanFormText(jvApplicationForm.proposalMessage),
        companyProfileUrl,
        cacCertificateUrl,
        portfolioUrl,
        financialProofUrl,
        proposalDocumentUrl,
        otherDocumentUrl,
        status: "New",
        priority: "High",
        createdAt: new Date().toISOString(),
      };

      if (supabase) {
        const { error } = await supabase.from("jv_applications").insert({
          listing_id: String(selectedListing.id),
          listing_title: selectedListing.title,
          applicant_name: cleanFormText(jvApplicationForm.applicantName),
          applicant_email: cleanFormText(jvApplicationForm.applicantEmail) || null,
          applicant_phone: cleanFormText(jvApplicationForm.applicantPhone),
          applicant_role: jvApplicationForm.applicantRole,
          company_name: cleanFormText(jvApplicationForm.companyName) || null,
          budget_capacity: cleanFormText(jvApplicationForm.budgetCapacity) || null,
          experience_summary: cleanFormText(jvApplicationForm.experienceSummary) || null,
          proposal_message: cleanFormText(jvApplicationForm.proposalMessage) || null,
          company_profile_url: companyProfileUrl || null,
          cac_certificate_url: cacCertificateUrl || null,
          portfolio_url: portfolioUrl || null,
          financial_proof_url: financialProofUrl || null,
          proposal_document_url: proposalDocumentUrl || null,
          other_document_url: otherDocumentUrl || null,
          status: "New",
          priority: "High",
          document_review_status: "Pending",
          risk_level: "Not Reviewed",
        });

        if (error) {
          console.error(error);
          showSuccess(error.message || "Unable to submit JV application. Please check your details and try again.");
          return;
        }
      } else {
        setJvApplications((current) => [{ ...newApplication, id: Date.now() }, ...current]);
      }

      await createStaffNotification(
        "New JV partnership application",
        `${jvApplicationForm.applicantName} applied as ${jvApplicationForm.applicantRole} for ${selectedListing.title}.`,
        "JV Application"
      );

      setJvApplicationForm({
        applicantName: "",
        applicantEmail: "",
        applicantPhone: "",
        applicantRole: "Developer",
        companyName: "",
        budgetCapacity: "",
        experienceSummary: "",
        proposalMessage: "",
      });
      setJvCompanyProfileFile(null);
      setJvCacCertificateFile(null);
      setJvPortfolioFile(null);
      setJvFinancialProofFile(null);
      setJvProposalDocumentFile(null);
      setJvOtherDocumentFile(null);

      resetPublicFormBotTrap(formKey);
      showSuccess("JV partnership application sent. INAMAAD will review and contact you shortly.");
    } finally {
      finishPublicFormSubmit(formKey);
    }
  }
  async function submitContactMessage(event: React.FormEvent) {
    event.preventDefault();

    const formKey: LeadKind = "contact_messages";

    if (
      !beginPublicFormSubmit(formKey, [
        { ok: hasMinimumText(contactForm.name, 2), message: "Please enter your full name." },
        { ok: optionalEmailIsValid(contactForm.email), message: "Please enter a valid email address or leave it empty." },
        { ok: phoneLooksValid(contactForm.phone) || hasMinimumText(contactForm.email, 6), message: "Please provide either a valid phone number or email address." },
        { ok: hasMinimumText(contactForm.message, 5), message: "Please enter a message with at least 5 characters." },
        { ok: isWithinLimit(contactForm.message, 5000), message: "Your message is too long." },
      ])
    ) {
      return;
    }

    try {
      const newMessage: Omit<ContactMessage, "id"> = {
        ...contactForm,
        name: cleanFormText(contactForm.name),
        email: cleanFormText(contactForm.email),
        phone: cleanFormText(contactForm.phone),
        subject: cleanFormText(contactForm.subject),
        message: cleanFormText(contactForm.message),
        status: "New",
        createdAt: new Date().toISOString(),
      };

      if (supabase) {
        const { error } = await supabase.from("contact_messages").insert({
          name: cleanFormText(contactForm.name),
          email: cleanFormText(contactForm.email) || null,
          phone: cleanFormText(contactForm.phone) || null,
          subject: cleanFormText(contactForm.subject) || "General enquiry",
          message: cleanFormText(contactForm.message),
          status: "New",
        });

        if (error) {
          console.error(error);
          showSuccess("Unable to send contact message. Please check your details and try again.");
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

      resetPublicFormBotTrap(formKey);
      showSuccess("Contact message sent. INAMAAD will reply shortly.");
    } finally {
      finishPublicFormSubmit(formKey);
    }
  }
  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();

    if (!supabase) {
      setDemoSignedIn(true);
      setDemoUserEmail(signInForm.email || "Demo account");
      setSignInForm({ email: "", password: "" });
      setModal(null);
      showSuccess("Logged in successfully. Your account status is now visible.");
      return;
    }

    const loginEmail = signInForm.email.trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: signInForm.password,
    });

    if (error) {
      const message = formatAuthError(error, "Unable to sign in. Please check your email and password.");

      if (message.toLowerCase().includes("confirm your email") || message.toLowerCase().includes("email not confirmed")) {
        setConfirmationEmail(loginEmail);
        showSuccess("Please confirm your email before signing in. Check your inbox or resend the confirmation email.");
        return;
      }

      showSuccess(message);
      return;
    }

    const signedInUser = data.user ?? data.session?.user ?? null;

    if (signedInUser) {
      setUser(signedInUser);
      setDemoSignedIn(false);
      setDemoUserEmail("");
    } else {
      // Fallback: show the logged-in state immediately after a successful login.
      // The Supabase auth listener will replace this with the real user session.
      setDemoSignedIn(true);
      setDemoUserEmail(loginEmail || "INAMAAD Account");
    }

    setSignInForm({ email: "", password: "" });
    setModal(null);
    showSuccess("Logged in successfully.");
  }

  async function handleResendConfirmationEmail() {
    const email = (signInForm.email || confirmationEmail || registerForm.email).trim();

    if (!email) {
      showSuccess("Enter your email address first, then resend confirmation.");
      return;
    }

    setConfirmationEmail(email);

    if (!supabase) {
      showSuccess("Demo mode: confirmation email would be sent when Supabase is connected.");
      return;
    }

    const redirectTo = `${window.location.origin}${window.location.pathname}`;

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      showSuccess(formatAuthError(error));
      return;
    }

    showSuccess("Confirmation email sent. Check your inbox and spam folder.");
  }

  async function handleForgotPassword(event: React.FormEvent) {
    event.preventDefault();

    const email = forgotPasswordEmail.trim();

    if (!email) {
      showSuccess("Enter your email address first.");
      return;
    }

    if (!supabase) {
      setForgotPasswordEmail("");
      setModal("signin");
      showSuccess("Demo mode: password reset email would be sent when Supabase is connected.");
      return;
    }

    const redirectTo = `${window.location.origin}${window.location.pathname}`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      showSuccess(formatAuthError(error));
      return;
    }

    setForgotPasswordEmail("");
    setModal("signin");
    showSuccess("Password reset link sent. Check your email inbox.");
  }

  async function handleResetPassword(event: React.FormEvent) {
    event.preventDefault();

    if (!supabase) {
      setResetPasswordForm({ password: "", confirmPassword: "" });
      setModal("signin");
      showSuccess("Demo mode: password would be updated when Supabase is connected.");
      return;
    }

    if (resetPasswordForm.password.length < 6) {
      showSuccess("Password must be at least 6 characters.");
      return;
    }

    if (resetPasswordForm.password !== resetPasswordForm.confirmPassword) {
      showSuccess("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: resetPasswordForm.password,
    });

    if (error) {
      showSuccess(formatAuthError(error));
      return;
    }

    setResetPasswordForm({ password: "", confirmPassword: "" });
    setModal("signin");
    showSuccess("Password updated successfully. You can now sign in.");
  }

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();

    if (isRegistering) {
      return;
    }

    const registerEmail = registerForm.email.trim().toLowerCase();
    const registerName = registerForm.name.trim();
    const registerPassword = registerForm.password;

    if (!registerName) {
      showSuccess("Enter your full name first.");
      return;
    }

    if (!registerEmail) {
      showSuccess("Enter your email address first.");
      return;
    }

    if (!registerEmail.includes("@") || !registerEmail.includes(".")) {
      showSuccess("Enter a valid email address.");
      return;
    }

    if (registerPassword.length < 6) {
      showSuccess("Password must be at least 6 characters.");
      return;
    }

    setIsRegistering(true);
    showSuccess("Creating your account and requesting confirmation email...");

    try {
      if (!supabase) {
        setDemoSignedIn(false);
        setDemoUserEmail("");
        setConfirmationEmail(registerEmail);
        setRegisterForm({ name: "", email: "", password: "" });
        setSignInForm({ email: registerEmail, password: "" });
        setModal("signin");
        showSuccess("Demo mode: account created. Email confirmation would be required when Supabase is connected.");
        return;
      }

      const redirectTo = `${window.location.origin}${window.location.pathname}`;

      const signUpResponse = await Promise.race([
        supabase.auth.signUp({
          email: registerEmail,
          password: registerPassword,
          options: {
            emailRedirectTo: redirectTo,
            data: {
              full_name: registerName,
            },
          },
        }),
        new Promise<never>((_, reject) => {
          window.setTimeout(() => {
            reject(
              new Error(
                "Confirmation email request is taking too long. Check Supabase Auth Logs, SMTP settings, and email rate limits before trying again."
              )
            );
          }, 25000);
        }),
      ]);

      const { data, error } = signUpResponse;

      if (error) {
        setConfirmationEmail(registerEmail);
        showSuccess(
          formatAuthError(
            error,
            "Unable to create account. Check Supabase email confirmation, SMTP, and rate limits."
          )
        );
        return;
      }

      // If Supabase unexpectedly returns a session, sign it out immediately.
      // INAMAAD requires email confirmation before the first sign in.
      if (data?.session) {
        await supabase.auth.signOut();
        setUser(null);
        setDemoSignedIn(false);
        setDemoUserEmail("");
      }

      setConfirmationEmail(registerEmail);
      setRegisterForm({ name: "", email: "", password: "" });
      setSignInForm({ email: registerEmail, password: "" });
      setModal("signin");

      // Do not say "account activated" here. Activation only happens after email confirmation.
      showSuccess("Account created. Check your email inbox or spam folder for the confirmation link before signing in.");
    } catch (error) {
      showSuccess(
        formatAuthError(
          error,
          "Create account failed. Check Supabase Auth Logs, SMTP settings, and rate limits."
        )
      );
    } finally {
      setIsRegistering(false);
    }
  }

  async function unlockAdmin(event: React.FormEvent) {
    event.preventDefault();

    if (!supabase) {
      showSuccess("Supabase Auth is required for staff access. Configure Supabase and sign in with an authorized staff account.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (error) {
      showSuccess(formatAuthError(error));
      return;
    }

    setAdminPassword("");
    await checkAdminAccess();
  }

  async function handlePublicSignOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setUser(null);
    setDemoSignedIn(false);
    setDemoUserEmail("");
    setAdminUnlocked(false);
    setModal(null);
    showSuccess("Signed out successfully.");
  }

  async function logoutAdmin() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setAdminUnlocked(false);
    setUser(null);
    setDemoSignedIn(false);
    setDemoUserEmail("");
    setInvestorRequests([]);
    setPropertyInquiries([]);
    setPropertyViews([]);
    setContactMessages([]);
    setInspectionBookings([]);
    setPropertyOffers([]);
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
      adminEmail: user?.email || adminEmail || "Staff user",
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

  async function updatePropertyOfferStatus(id: number, status: OfferStatus) {
    if (!canManageLeads) {
      showSuccess("Your role cannot update offer status.");
      return;
    }

    const offerToUpdate = propertyOffers.find((offer) => offer.id === id);

    if (supabase) {
      const { error } = await supabase
        .from("property_offers")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to update offer status.");
        return;
      }

      await loadDatabasePropertyOffers();
    } else {
      setPropertyOffers((current) =>
        current.map((offer) => (offer.id === id ? { ...offer, status } : offer))
      );
    }

    await createAdminActivityLog(
      `Marked property offer ${status}`,
      "Property Offer",
      String(id),
      offerToUpdate ? `${offerToUpdate.buyerName} / ${offerToUpdate.listingTitle}` : "Property offer status updated."
    );

    showSuccess(`Property offer marked as ${status}.`);
  }

  async function deletePropertyOffer(id: number) {
    if (!canDeleteLeads) {
      showSuccess("Your role cannot delete offers.");
      return;
    }

    const offerToDelete = propertyOffers.find((offer) => offer.id === id);

    if (supabase) {
      const { error } = await supabase
        .from("property_offers")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to delete property offer.");
        return;
      }

      await loadDatabasePropertyOffers();
    } else {
      setPropertyOffers((current) => current.filter((offer) => offer.id !== id));
    }

    await createAdminActivityLog(
      "Deleted property offer",
      "Property Offer",
      String(id),
      offerToDelete ? `${offerToDelete.buyerName} / ${offerToDelete.listingTitle}` : "Property offer deleted."
    );

    showSuccess("Property offer removed.");
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



  async function updateJvApplicationStatus(id: number, status: JVApplicationStatus) {
    if (!canManageLeads) {
      showSuccess("Your role cannot update JV application status.");
      return;
    }

    const applicationToUpdate = jvApplications.find((application) => application.id === id);

    if (supabase) {
      const { error } = await supabase
        .from("jv_applications")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to update JV application status.");
        return;
      }

      await loadDatabaseJvApplications();
    } else {
      setJvApplications((current) =>
        current.map((application) =>
          application.id === id ? { ...application, status } : application
        )
      );
    }

    await createAdminActivityLog(
      `Marked JV application ${status}`,
      "JV Application",
      String(id),
      applicationToUpdate ? `${applicationToUpdate.applicantName} / ${applicationToUpdate.listingTitle}` : "JV application status updated."
    );

    showSuccess(`JV application marked as ${status}.`);
  }



  function jvEvaluationScore(application: JVApplication) {
    return (
      Number(application.experienceRating || 0) +
      Number(application.financialCapacityRating || 0) +
      Number(application.trackRecordRating || 0)
    );
  }

  function jvEvaluationScoreClass(score: number) {
    if (score >= 12) return "bg-emerald-100 text-emerald-700";
    if (score >= 8) return "bg-blue-100 text-blue-700";
    if (score >= 4) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  }

  async function saveJvApplicationEvaluation(application: JVApplication) {
    if (!canManageLeads) {
      showSuccess("Your role cannot evaluate JV applications.");
      return;
    }

    const evaluatedAt = new Date().toISOString();
    const evaluatedByEmail = user?.email || adminEmail || "Local demo admin";
    const score = jvEvaluationScore(application);

    const payload = {
      experience_rating: Number(application.experienceRating || 0),
      financial_capacity_rating: Number(application.financialCapacityRating || 0),
      track_record_rating: Number(application.trackRecordRating || 0),
      document_review_status: application.documentReviewStatus || "Not Reviewed",
      risk_level: application.riskLevel || "Normal",
      evaluation_notes: application.evaluationNotes || null,
      evaluated_by_email: evaluatedByEmail,
      evaluated_at: evaluatedAt,
    };

    if (supabase) {
      const { error } = await supabase
        .from("jv_applications")
        .update(payload)
        .eq("id", application.id);

      if (error) {
        console.error(error);
        showSuccess("Unable to save JV evaluation scorecard.");
        return;
      }

      await loadDatabaseJvApplications();
    } else {
      setJvApplications((current) =>
        current.map((item) =>
          item.id === application.id
            ? {
                ...item,
                evaluatedByEmail,
                evaluatedAt,
              }
            : item
        )
      );
    }

    await createAdminActivityLog(
      "Saved JV applicant evaluation",
      "JV Application",
      String(application.id),
      `${application.applicantName} scored ${score}/15. Risk: ${application.riskLevel || "Normal"}. Document review: ${application.documentReviewStatus || "Not Reviewed"}.`
    );

    showSuccess(`JV evaluation saved. Score: ${score}/15.`);
  }

  async function deleteJvApplication(id: number) {
    if (!canDeleteLeads) {
      showSuccess("Your role cannot delete JV applications.");
      return;
    }

    const applicationToDelete = jvApplications.find((application) => application.id === id);

    if (supabase) {
      const { error } = await supabase
        .from("jv_applications")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to delete JV application.");
        return;
      }

      await loadDatabaseJvApplications();
    } else {
      setJvApplications((current) =>
        current.filter((application) => application.id !== id)
      );
    }

    await createAdminActivityLog(
      "Deleted JV application",
      "JV Application",
      String(id),
      applicationToDelete ? `${applicationToDelete.applicantName} / ${applicationToDelete.listingTitle}` : "JV application deleted."
    );

    showSuccess("JV application removed.");
  }

  function getAssignedStaffLabel(email?: string) {
    if (!email) return "Unassigned";

    const staffMember = staffMembers.find((member) => member.email === email);

    if (!staffMember) return email;

    return `${staffMember.fullName || staffMember.email}  -  ${staffMember.role}`;
  }

  function getLeadKindLabel(kind: LeadKind) {
    if (kind === "investor_requests") return "Investor Request";
    if (kind === "property_inquiries") return "Property Inquiry";
    if (kind === "property_offers") return "Property Offer";
    if (kind === "jv_applications") return "JV Application";
    if (kind === "contact_messages") return "Contact Message";
    return "Inspection Booking";
  }

  async function reloadLeadKind(kind: LeadKind) {
    if (kind === "investor_requests") await loadDatabaseInvestorRequests();
    if (kind === "property_inquiries") await loadDatabasePropertyInquiries();
    if (kind === "property_offers") await loadDatabasePropertyOffers();
    if (kind === "jv_applications") await loadDatabaseJvApplications();
    if (kind === "contact_messages") await loadDatabaseContactMessages();
    if (kind === "inspection_bookings") await loadDatabaseInspectionBookings();
  }

  function updateLocalLeadDraft(
    kind: LeadKind,
    id: number,
    changes: any
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

    if (kind === "property_offers") {
      setPropertyOffers((current) =>
        current.map((offer) =>
          offer.id === id ? { ...offer, ...changes } : offer
        )
      );
    }

    if (kind === "jv_applications") {
      setJvApplications((current) =>
        current.map((application) =>
          application.id === id ? { ...application, ...changes } : application
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

  async function saveLeadFollowUpDetails(
    kind: LeadKind,
    id: number,
    priority: LeadPriority,
    followUpDate: string,
    lastContactedAt: string
  ) {
    if (!canManageLeads) {
      showSuccess("Your role cannot update follow-up reminders.");
      return;
    }

    const cleanFollowUpDate = followUpDate || null;
    const cleanLastContactedAt = lastContactedAt || null;

    if (supabase) {
      const { error } = await supabase
        .from(kind)
        .update({
          priority,
          follow_up_date: cleanFollowUpDate,
          last_contacted_at: cleanLastContactedAt,
        })
        .eq("id", id);

      if (error) {
        console.error(error);
        showSuccess("Unable to save follow-up details.");
        return;
      }

      await reloadLeadKind(kind);
    } else {
      updateLocalLeadDraft(kind, id, {
        priority,
        followUpDate,
        lastContactedAt,
      });
    }

    await createAdminActivityLog(
      "Updated lead follow-up",
      getLeadKindLabel(kind),
      String(id),
      `Priority: ${priority}. Follow-up: ${followUpDate || "none"}. Last contacted: ${lastContactedAt ? formatDate(lastContactedAt) : "not set"}.`
    );

    showSuccess("Follow-up details saved.");
  }

  function markLeadContactedToday(
    kind: LeadKind,
    id: number,
    priority: LeadPriority,
    followUpDate: string
  ) {
    saveLeadFollowUpDetails(kind, id, priority, followUpDate, new Date().toISOString());
  }

  function renderLeadAssignmentControls(
    kind: LeadKind,
    id: number,
    assignedToEmail?: string,
    staffNotes?: string,
    priority: LeadPriority = "Normal",
    followUpDate = "",
    lastContactedAt = ""
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
                  {member.fullName || member.email} Ã¢â‚¬â€ {member.role}
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

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Priority
            </span>
            <select
              value={priority || "Normal"}
              onChange={(event) =>
                updateLocalLeadDraft(kind, id, {
                  priority: event.target.value as LeadPriority,
                })
              }
              disabled={!canManageLeads}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none transition focus:border-[#0d1c38] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Follow-up date
            </span>
            <input
              type="date"
              value={followUpDate || ""}
              onChange={(event) =>
                updateLocalLeadDraft(kind, id, { followUpDate: event.target.value })
              }
              disabled={!canManageLeads}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none transition focus:border-[#0d1c38] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            />
          </label>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Last contacted
            </p>
            <p className="mt-2 text-sm font-black text-[#0d1c38]">
              {lastContactedAt ? formatDate(lastContactedAt) : "Not contacted yet"}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() =>
              saveLeadFollowUpDetails(
                kind,
                id,
                priority || "Normal",
                followUpDate || "",
                lastContactedAt || ""
              )
            }
            disabled={!canManageLeads}
            className="rounded-full bg-[#d49613] px-5 py-2.5 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Save follow-up
          </button>

          <button
            onClick={() =>
              markLeadContactedToday(
                kind,
                id,
                priority || "Normal",
                followUpDate || ""
              )
            }
            disabled={!canManageLeads}
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Mark contacted today
          </button>
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
        "Reference",
        "Title",
        "Location",
        "Price",
        "Numeric Value",
        "Agency Fee",
        "Legal / Documentation Fee",
        "Service Charge",
        "Caution Fee",
        "Survey Fee",
        "Development Fee",
        "Total Estimated Cost",
        "Payment Plan Available",
        "Installment Details",
        "Type",
        "Category",
        "Yield / Highlight",
        "Description",
        "Document Title",
        "Document Status",
        "Document Details",
        "Document File URL",
        "Approval Status",
        "Availability Status",
        "Availability Note",
        "Available From",
        "Contact Role",
        "Company Name",
        "Owner / Contact Name",
        "Owner Phone",
        "Contact WhatsApp",
        "Contact Email",
        "Contact Address",
        "Public Contact Visibility",
        "Mandate Status",
        "Image URL",
        "Created At",
      ],
      listings.map((listing) => [
        listing.id,
        buildListingReference(listing.id),
        listing.title,
        listing.location,
        listing.price,
        listing.value,
        listing.agencyFee || "",
        listing.legalFee || "",
        listing.serviceCharge || "",
        listing.cautionFee || "",
        listing.surveyFee || "",
        listing.developmentFee || "",
        listing.totalEstimatedCost || calculateTotalEstimatedCost(listing),
        listing.paymentPlanAvailable ? "Yes" : "No",
        listing.installmentDetails || "",
        listing.type,
        listing.category,
        listing.yieldText,
        listing.description,
        listing.documentTitle || "",
        listing.documentStatus || "",
        listing.documentDetails || "",
        listing.documentFileUrl || "",
        listing.status,
        listing.availabilityStatus || "Available",
        listing.availabilityNote || "",
        listing.availableFrom || "",
        listing.contactRole || "Owner",
        listing.companyName || "",
        listing.ownerName || "",
        listing.ownerPhone || "",
        listing.contactWhatsapp || "",
        listing.contactEmail || "",
        listing.contactAddress || "",
        listing.publicContactVisibility || "Hide Phone",
        listing.mandateStatus || "Not Confirmed",
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
        ["Property offers", propertyOffers.length],
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
    <div className="inamaad-mobile-shell min-h-screen overflow-x-hidden bg-[#f7f8fb] text-slate-950 antialiased">
      <datalist id="nigeria-location-options">
        {nigeriaLocationLabels.map((location) => (
          <option key={location} value={location} />
        ))}
      </datalist>

      <style>{`
        html,
        body,
        #root {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        .inamaad-mobile-shell {
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
        }

        .inamaad-mobile-shell img,
        .inamaad-mobile-shell video,
        .inamaad-mobile-shell iframe,
        .inamaad-mobile-shell canvas,
        .inamaad-mobile-shell svg {
          max-width: 100%;
        }

        .inamaad-mobile-shell input,
        .inamaad-mobile-shell select,
        .inamaad-mobile-shell textarea,
        .inamaad-mobile-shell button {
          max-width: 100%;
        }

        .inamaad-mobile-shell table {
          width: 100%;
          max-width: 100%;
        }

        @media (max-width: 640px) {
          .inamaad-mobile-shell {
            -webkit-text-size-adjust: 100%;
          }

          .inamaad-mobile-shell section,
          .inamaad-mobile-shell header,
          .inamaad-mobile-shell footer {
            max-width: 100vw;
          }

          .inamaad-mobile-shell h1 {
            font-size: clamp(1.75rem, 8vw, 2.45rem) !important;
            line-height: 1.05 !important;
            overflow-wrap: anywhere;
          }

          .inamaad-mobile-shell h2 {
            font-size: clamp(1.35rem, 6.2vw, 1.95rem) !important;
            line-height: 1.12 !important;
            overflow-wrap: anywhere;
          }

          .inamaad-mobile-shell h3 {
            font-size: clamp(1.05rem, 5vw, 1.45rem) !important;
            line-height: 1.18 !important;
            overflow-wrap: anywhere;
          }

          .inamaad-mobile-shell p,
          .inamaad-mobile-shell a,
          .inamaad-mobile-shell button,
          .inamaad-mobile-shell span,
          .inamaad-mobile-shell div {
            overflow-wrap: anywhere;
          }

          .inamaad-mobile-shell input,
          .inamaad-mobile-shell select,
          .inamaad-mobile-shell textarea {
            min-height: 46px;
            font-size: 16px !important;
          }

          .inamaad-mobile-shell button,
          .inamaad-mobile-shell a {
            touch-action: manipulation;
          }

          .inamaad-mobile-shell .overflow-x-auto {
            -webkit-overflow-scrolling: touch;
          }

          .inamaad-mobile-shell [class*="rounded-["] {
            border-radius: 1.25rem;
          }

          .inamaad-mobile-shell .inamaad-mobile-horizontal {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            gap: 0.85rem !important;
            scroll-snap-type: x mandatory;
            padding-bottom: 0.75rem;
            -webkit-overflow-scrolling: touch;
          }

          .inamaad-mobile-shell .inamaad-mobile-horizontal > * {
            scroll-snap-align: start;
            flex: 0 0 auto;
          }

          .inamaad-mobile-shell .inamaad-listing-card-mobile {
            width: 82vw;
            min-width: 82vw;
            max-width: 82vw;
          }

          .inamaad-mobile-shell .inamaad-profile-action-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .inamaad-mobile-shell .inamaad-mobile-chip-row {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            gap: 0.55rem !important;
            padding-bottom: 0.55rem;
            -webkit-overflow-scrolling: touch;
          }

          .inamaad-mobile-shell .inamaad-mobile-chip-row > * {
            flex: 0 0 auto;
          }

          .inamaad-mobile-shell .inamaad-mobile-profile-strip {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            gap: 0.5rem !important;
            padding-bottom: 0.25rem;
            -webkit-overflow-scrolling: touch;
          }

          .inamaad-mobile-shell .inamaad-mobile-profile-strip > * {
            flex: 0 0 auto;
          }

          .inamaad-mobile-shell .inamaad-mobile-muted-text {
            font-size: 0.82rem !important;
            line-height: 1.45rem !important;
          }

          .inamaad-mobile-shell #properties,
          .inamaad-mobile-shell #jv {
            scroll-margin-top: 5.5rem;
          }

          .inamaad-mobile-shell .inamaad-mobile-horizontal {
            overscroll-behavior-x: contain;
          }
        }

        @media (min-width: 641px) {
          .inamaad-mobile-shell .inamaad-listing-card-mobile {
            width: auto;
            min-width: 0;
            max-width: none;
          }

          .inamaad-mobile-shell .inamaad-mobile-horizontal {
            display: grid !important;
            overflow: visible !important;
            padding-bottom: 0;
          }

          .inamaad-mobile-shell .inamaad-mobile-chip-row {
            flex-wrap: wrap !important;
            overflow: visible !important;
            padding-bottom: 0;
          }

          .inamaad-mobile-shell .inamaad-mobile-profile-strip {
            flex-wrap: wrap !important;
            overflow: visible !important;
            padding-bottom: 0;
          }
        }
      `}</style>

      {showNewUserGuideNotice && (
        <div
          data-inamaad-no-refresh="true"
          className="relative z-[60] border-b border-[#f0bf3c]/30 bg-[#0d1c38] px-3 py-2 text-white shadow-sm sm:px-4"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 text-center text-[11px] leading-5 sm:flex-row sm:justify-between sm:text-left sm:text-xs">
            <p className="font-semibold">
              New here? See how to browse, inspect, contact, and post property on INAMAAD.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openUserGuide}
                className="rounded-full bg-[#f0bf3c] px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-[#0d1c38]"
              >
                Quick guide
              </button>

              <button
                type="button"
                onClick={markUserGuideSeen}
                aria-label="Hide new user guide notice"
                className="rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-white/90 hover:bg-white/10"
              >
                Hide
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="relative z-50 border-b border-slate-200 bg-[#e9edf3]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-2 px-3 py-3 sm:px-5 sm:py-4 lg:px-4 xl:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0d1c38] text-lg font-black text-[#f0bf3c] shadow-sm sm:h-11 sm:w-11 sm:text-xl">
              I
            </div>

            <div>
              <div className="text-sm font-black uppercase tracking-wide text-[#0d1c38] sm:text-[15px]">
                INAMAAD
              </div>
              <div className="text-[11px] text-slate-500 sm:text-xs">
                Real Estate Enterprise
              </div>
            </div>
          </a>

          <nav className="hidden flex-none items-center gap-4 whitespace-nowrap lg:flex xl:gap-5">
            {navLinks.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap text-sm font-semibold leading-5 transition xl:text-[15px] ${
                  index === 0
                    ? "rounded-xl bg-white px-3 py-2.5 text-[#0d1c38] shadow-sm xl:px-4"
                    : "text-slate-600 hover:text-[#0d1c38]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden flex-none items-center gap-2 whitespace-nowrap lg:flex xl:gap-3">
            <button
              type="button"
              onClick={openUserGuide}
              className="whitespace-nowrap text-sm font-semibold leading-5 text-slate-700 hover:text-[#0d1c38] xl:text-[15px]"
            >
              Guide
            </button>

            {isSignedIn ? (
              <>
                <div className="max-w-[220px] shrink-0 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-left shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                    Logged in
                  </p>
                  <p className="max-w-[160px] truncate text-xs font-black text-[#0d1c38] xl:max-w-[190px] xl:text-sm">
                    {signedInEmail}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePublicSignOut}
                  className="whitespace-nowrap rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-black leading-5 text-slate-700 transition hover:border-[#0d1c38] hover:text-[#0d1c38] xl:px-5"
                >
                  Sign{"\u00A0"}Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setModal("signin")}
                  className="whitespace-nowrap text-sm font-semibold leading-5 text-slate-700 hover:text-[#0d1c38] xl:text-[15px]"
                >
                  Sign{"\u00A0"}In
                </button>

                <button
                  onClick={() => setModal("investor")}
                  className="whitespace-nowrap rounded-xl bg-[#0d1c38] px-4 py-2.5 text-sm font-bold leading-5 text-white shadow-sm transition hover:bg-[#13284f] xl:px-5 xl:text-[15px]"
                >
                  Get{"\u00A0"}Started
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((current) => !current)}
            className="shrink-0 rounded-xl bg-[#0d1c38] px-3 py-2.5 text-xs font-bold text-white sm:px-4 sm:py-3 sm:text-sm lg:hidden"
          >
            Menu
          </button>
        </div>

        {mobileOpen && (
          <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5 lg:hidden">
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
                type="button"
                onClick={openUserGuide}
                className="rounded-xl border border-slate-200 px-5 py-3 text-left font-black text-[#0d1c38]"
              >
                How to use
              </button>

              {isSignedIn ? (
                <div className="grid gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                      Logged in
                    </p>
                    <p className="truncate text-sm font-black text-[#0d1c38]">
                      {signedInEmail}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handlePublicSignOut();
                    }}
                    className="rounded-xl border border-emerald-200 bg-white px-5 py-3 text-left font-black text-[#0d1c38]"
                  >
                  Sign{"\u00A0"}Out
                </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setModal("signin");
                    }}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-left font-black text-[#0d1c38]"
                  >
                  Sign{"\u00A0"}In
                </button>

                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setModal("investor");
                    }}
                    className="rounded-xl bg-[#0d1c38] px-5 py-3 text-left font-black text-white"
                  >
                  Get{"\u00A0"}Started
                </button>
                </>
              )}
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

          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
            <div className="max-w-5xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-[3px] w-14 bg-[#f0bf3c]" />
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f0bf3c] sm:text-sm">
                  Launch-ready real estate marketplace
                </p>
              </div>

              <h1 className="max-w-3xl text-3xl font-black leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[44px]">
                Nigeria's trusted hub for
                <br />
                <span className="text-[#f0bf3c]">Property</span>, Land
                <br />Investment & JV Deals
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                Browse verified homes, land, commercial assets, investor-ready
                opportunities, and structured JV deals across Nigeria. Enquire,
                inspect, offer, partner, and manage every lead with confidence.
              </p>

              <div className="mt-8 max-w-6xl rounded-[24px] bg-white p-3 shadow-2xl sm:p-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.1fr]">
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    type="text"
                    placeholder="Search location, property, JV deal..."
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
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 py-10 sm:gap-8 sm:px-6 sm:py-12 lg:grid-cols-4 lg:px-10">
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


        <section className="bg-[#f7f8fb] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
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

        {recentlyViewedListings.length > 0 && (
          <section className="bg-[#f7f8fb] px-4 pb-10 sm:px-6 sm:pb-12 lg:px-10">
            <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#f0bf3c]/40 bg-[#fff7df] p-5 lg:p-7">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9b6b16]">
                    Recently viewed
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-[#0d1c38]">
                    Continue from properties and JV deals you already opened.
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setRecentListingIds([])}
                  className="rounded-xl border border-[#f0bf3c] bg-white px-4 py-2 text-xs font-black text-[#9b6b16] hover:bg-[#fff7df]"
                >
                  Clear recent
                </button>
              </div>

              <div className="inamaad-mobile-horizontal sm:grid-cols-3">
                {recentlyViewedListings.slice(0, 3).map((listing) => (
                  <button
                    key={`recent-${listing.id}`}
                    type="button"
                    onClick={() => openListing(listing)}
                    className="w-[78vw] rounded-2xl border border-[#f0bf3c]/40 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:w-auto"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#0d1c38] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                        {isJointVentureListing(listing) ? "JV Deal" : "Property"}
                      </span>
                      <span className="text-xs font-black text-[#9b6b16]">
                        {listing.price}
                      </span>
                    </div>
                    <p className="line-clamp-1 text-sm font-black text-[#0d1c38]">
                      {listing.title}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {buildPublicLocationText(listing)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="properties" className="bg-[#f7f8fb] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-[3px] w-14 bg-[#f0bf3c]" />
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#d39b19]">
                    Verified opportunities
                  </p>
                </div>

                <h2 className="max-w-3xl text-4xl font-black tracking-tight text-[#0d1c38] md:text-6xl">
                  Find homes, land, commercial assets and JV deals in one place.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  Search by location, property type, purpose, budget, availability,
                  and investment strategy. Open details, submit enquiries, book inspections,
                  and make offers from one clean platform.
                </p>
              </div>

              <button
                onClick={() => openPostModal("property")}
                className="w-fit rounded-2xl bg-[#0d1c38] px-7 py-4 text-base font-bold text-white shadow-sm transition hover:bg-[#13284f]"
              >
                Submit Property / JV
              </button>
            </div>

            <div className="inamaad-mobile-chip-row mt-8 sm:mt-10">
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
                    setAvailabilityFilter("All Availability");
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

              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
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
                  value={availabilityFilter}
                  onChange={(event) => setAvailabilityFilter(event.target.value)}
                  className="h-14 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#0d1c38]"
                  aria-label="Availability status"
                >
                  <option>All Availability</option>
                  {availabilityStatusOptions.map((status) => (
                    <option key={status}>{status}</option>
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
              <div className="inamaad-mobile-horizontal mt-10 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="inamaad-listing-card-mobile overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm sm:rounded-[28px]">
                    <div className="h-44 animate-pulse bg-slate-200 sm:h-72" />
                    <div className="space-y-3 p-4 sm:space-y-4 sm:p-7">
                      <div className="h-5 w-1/2 animate-pulse rounded-full bg-slate-200" />
                      <div className="h-8 w-3/4 animate-pulse rounded-full bg-slate-200" />
                      <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="inamaad-mobile-horizontal mt-10 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
                {filteredListings.length === 0 && (
                  <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center md:col-span-2 lg:col-span-3">
                    <p className="text-lg font-black text-[#0d1c38]">
                      No matching listings found
                    </p>
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                      Try clearing filters, searching a different location, or submit a new property/JV opportunity for admin review.
                    </p>
                    <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => {
                          setQuery("");
                          setPropertyType("All");
                          setListingPurpose("All Purposes");
                          setAvailabilityFilter("All Availability");
                          setLocationFilter("All Locations");
                          setMinValueFilter("");
                          setMaxValueFilter("");
                          setSortMode("Newest");
                        }}
                        className="rounded-2xl border border-[#0d1c38] px-5 py-3 text-sm font-black text-[#0d1c38] hover:bg-slate-50"
                      >
                        Clear filters
                      </button>
                      <button
                        type="button"
                        onClick={() => openPostModal("property")}
                        className="rounded-2xl bg-[#0d1c38] px-5 py-3 text-sm font-black text-white hover:bg-[#13284f]"
                      >
                        Submit property
                      </button>
                    </div>
                  </div>
                )}

                {filteredListings.map((listing) => (
                  <article
                    key={listing.id}
                    data-inamaad-open-listing="true"
                    role="button"
                    tabIndex={0}
                    onClick={() => openListing(listing)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openListing(listing);
                      }
                    }}
                    className={`inamaad-listing-card-mobile group cursor-pointer overflow-hidden rounded-[22px] border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-[28px] ${
                      listing.featured ? "border-[#f0bf3c] shadow-xl ring-2 ring-[#f0bf3c]/30" : "border-slate-200"
                    }`}
                  >
                    <div className="relative h-44 overflow-hidden bg-[#0d1c38] sm:h-72">
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

                      {propertyImagesByListingId[listing.id]?.length ? (
                        <div className="absolute bottom-3 right-3 z-20 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black text-[#0d1c38] shadow-lg sm:bottom-5 sm:right-5 sm:px-4 sm:py-2 sm:text-xs">
                          {propertyImagesByListingId[listing.id].length + (listing.imageUrl ? 1 : 0)} Photos
                        </div>
                      ) : null}

                      <div className="relative z-10 flex h-full flex-col justify-between p-4 text-white sm:p-7">
                        <div className="flex items-start justify-between gap-4">
                          <div className="inamaad-mobile-profile-strip">
                            <div className="rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide backdrop-blur sm:px-4 sm:py-2 sm:text-xs">
                              {listing.type}
                            </div>

                            {listing.featured && (
                              <div className="rounded-full bg-[#f0bf3c] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#0d1c38] shadow-lg sm:px-4 sm:py-2 sm:text-xs">
                                Featured
                              </div>
                            )}
                          </div>

                          <div className="flex shrink-0 flex-col items-end gap-1.5 sm:gap-2">
                            <div className="rounded-full bg-emerald-500 px-3 py-1.5 text-[10px] font-black text-white sm:px-4 sm:py-2 sm:text-xs">
                              {listing.status}
                            </div>
                            <div className={`rounded-full px-3 py-1.5 text-[10px] font-black sm:px-4 sm:py-2 sm:text-xs ${availabilityBadgeClass(listing.availabilityStatus)}`}>
                              {listing.availabilityStatus || "Available"}
                            </div>
                            <div className="rounded-full bg-white/15 px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-white backdrop-blur sm:px-4 sm:py-2 sm:text-[11px]">
                              Ref {buildListingReference(listing.id)}
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f0bf3c] sm:text-xs sm:tracking-[0.2em]">
                            {listing.featured ? "INAMAAD premium featured asset" : "INAMAAD verified asset"}
                          </p>
                          <h3 className="mt-2 max-w-sm text-lg font-black leading-tight sm:mt-3 sm:text-3xl">
                            {listing.title}
                          </h3>
                          <p className="mt-2 text-xs font-medium text-slate-200 sm:mt-3 sm:text-base">
                            {listing.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-7">
                      <div className="flex items-start justify-between gap-3 sm:gap-5">
                        <div>
                          <p className="text-xs font-bold text-slate-500 sm:text-sm">
                            Starting price
                          </p>
                          <p className="mt-1 text-xl font-black text-[#0d1c38] sm:text-3xl">
                            {listing.price}
                          </p>
                          <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-slate-500 sm:mt-2 sm:text-xs">
                            {availabilityShortNote(listing.availabilityStatus)}
                          </p>
                        </div>

                        <div className="shrink-0 rounded-2xl bg-[#fff6dc] px-3 py-2 text-right sm:px-4 sm:py-3">
                          <p className="text-[10px] font-bold text-slate-500 sm:text-xs">
                            Type
                          </p>
                          <p className="text-xs font-black text-[#9b6b16] sm:text-sm">
                            {listing.category}
                          </p>
                        </div>
                      </div>

                      {isJointVentureListing(listing) ? (
                        <div className="inamaad-mobile-profile-strip mt-4 text-[11px] font-black text-[#0d1c38] sm:mt-5 sm:flex sm:flex-wrap sm:gap-2 sm:text-xs">
                          {listing.jvStructure ? <span className="rounded-full bg-amber-100 px-3 py-2">{listing.jvStructure}</span> : null}
                          {listing.jvProjectStage ? <span className="rounded-full bg-slate-100 px-3 py-2">{listing.jvProjectStage}</span> : null}
                          {listing.landSize ? <span className="rounded-full bg-slate-100 px-3 py-2">{listing.landSize}</span> : null}
                          {listing.jvExpectedUnits ? <span className="rounded-full bg-slate-100 px-3 py-2">{listing.jvExpectedUnits} units</span> : null}
                        </div>
                      ) : (listing.bedrooms || listing.bathrooms || listing.landSize) && (
                        <div className="inamaad-mobile-profile-strip mt-4 text-[11px] font-black text-[#0d1c38] sm:mt-5 sm:flex sm:flex-wrap sm:gap-2 sm:text-xs">
                          {listing.bedrooms ? <span className="rounded-full bg-slate-100 px-3 py-2">{listing.bedrooms} Beds</span> : null}
                          {listing.bathrooms ? <span className="rounded-full bg-slate-100 px-3 py-2">{listing.bathrooms} Baths</span> : null}
                          {listing.landSize ? <span className="rounded-full bg-slate-100 px-3 py-2">{listing.landSize}</span> : null}
                        </div>
                      )}

                      <p className="mt-4 min-h-[58px] text-sm leading-6 text-slate-600 sm:mt-5 sm:min-h-[72px] sm:text-base sm:leading-7">
                        {listing.description}
                      </p>

                      <div className="mt-4 rounded-2xl bg-slate-50 p-4 sm:mt-6 sm:p-5">
                        <p className="text-sm font-bold text-slate-500">
                          Investment highlight
                        </p>
                        <p className="mt-2 text-sm font-black text-[#0d1c38] sm:text-base">
                          {listing.yieldText}
                        </p>
                      </div>

                      <div className="inamaad-profile-action-grid mt-4 grid gap-2 sm:mt-6 sm:gap-3">
                        <button
                          type="button"
                          data-inamaad-open-listing="true"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            openListing(listing);
                          }}
                          className="flex items-center justify-center rounded-xl bg-[#0d1c38] px-3 py-3 text-sm font-bold text-white transition hover:bg-[#13284f] sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base"
                        >
                          View Details
                        </button>

                        <button
                          type="button"
                          data-inamaad-no-refresh="true"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            shareListing(listing);
                          }}
                          className="flex items-center justify-center rounded-xl border border-[#0d1c38] bg-white px-3 py-3 text-sm font-black text-[#0d1c38] transition hover:bg-slate-50 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base"
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

        <section id="about" className="bg-[#f7f8fb] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
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
                Built for serious property, investment and JV decisions.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                INAMAAD brings buyers, investors, landowners, developers, agents,
                and JV partners into one professional marketplace for discovery,
                verification, submissions, lead tracking, and opportunity management.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-3xl font-black text-[#0d1c38]">Organized</p>
                  <p className="mt-3 text-slate-600">
                    Browse, filter, submit, enquire, inspect, offer, and apply through clear workflows.
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-3xl font-black text-[#0d1c38]">Protected</p>
                  <p className="mt-3 text-slate-600">
                    Email confirmation, role-based admin access, protected forms, and secure storage rules support safer operations.
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
                  JV partnership marketplace
                </p>
              </div>

              <h2 className="text-4xl font-black tracking-tight md:text-6xl">
                Structure partnerships between landowners, developers and investors.
              </h2>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
                INAMAAD helps JV opportunities show the information serious partners need:
                land contribution, developer requirement, investor requirement, sharing formula,
                project stage, documents, due diligence status, and application tracking.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => openPostModal("jv")}
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
                    ["Landowners", "Submit land for reviewed partnership"],
                    ["Developers", "Find JV-ready development opportunities"],
                    ["Investors", "Apply to structured real estate projects"],
                    ["Coverage", "FCT Abuja, 36 states, and prime corridors"],
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
                    Request opportunities that match your budget, location and investment strategy.
                  </h2>

                  <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                    Submit your budget, preferred asset type, location interest,
                    and investment goals. INAMAAD saves your request for staff review,
                    follow-up, and opportunity matching.
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

        <section id="contact" className="bg-[#0F172A] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 sm:p-8 lg:p-10">
              <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="h-[3px] w-12 bg-[#C9A227]" />
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-[#C9A227] sm:text-sm">
                      Contact INAMAAD
                    </p>
                  </div>

                  <h2 className="max-w-3xl text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                    Speak with INAMAAD about property, investment, land or JV opportunities.
                  </h2>

                  <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                    Whether you want to buy, sell, rent, invest, list land, submit a JV deal,
                    request inspection, make an offer, or discuss development partnership,
                    INAMAAD gives you a professional channel for serious real estate decisions.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        title: "Investors",
                        text: "Discover verified real estate opportunities and structured investment leads.",
                      },
                      {
                        title: "Developers",
                        text: "Connect with landowners, capital partners, and development opportunities.",
                      },
                      {
                        title: "Landowners",
                        text: "Submit land or partnership opportunities for professional review.",
                      },
                      {
                        title: "JV Partners",
                        text: "Explore joint venture, land development, and strategic partnership pathways.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-3xl border border-white/10 bg-white/[0.06] p-5"
                      >
                        <h3 className="text-lg font-black text-white">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="#properties"
                      className="rounded-full bg-[#C9A227] px-6 py-3 text-sm font-black text-[#0F172A] transition hover:bg-[#e2bd45]"
                    >
                      Browse Opportunities
                    </a>

                    <button
                      type="button"
                      onClick={() => setModal("post")}
                      className="rounded-full border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:border-[#C9A227] hover:text-[#C9A227]"
                    >
                      Submit Opportunity
                    </button>

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:border-[#C9A227] hover:text-[#C9A227]"
                    >
                      WhatsApp INAMAAD
                    </a>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white p-5 text-[#0F172A] shadow-2xl shadow-black/30 sm:p-7">
                  <div className="rounded-[1.5rem] border border-[#C9A227]/25 bg-[#f8f5eb] p-5">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9a7816]">
                      Business Inquiry
                    </p>
                    <h3 className="mt-2 text-2xl font-black">
                      Contact our team
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Send your inquiry and the message will be saved in your staff portal for follow-up.
                    </p>
                  </div>

                  <form onSubmit={submitContactMessage} className="mt-5 grid gap-3">
                    <input
                      type="text"
                      value={publicFormBotTrap.contact_messages}
                      onChange={(event) => setPublicFormBotTrap({ ...publicFormBotTrap, contact_messages: event.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                    />
                    <input
                      required
                      value={contactForm.name}
                      onChange={(event) =>
                        setContactForm({ ...contactForm, name: event.target.value })
                      }
                      placeholder="Full name"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none transition focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/15"
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(event) =>
                          setContactForm({ ...contactForm, email: event.target.value })
                        }
                        placeholder="Email optional"
                        className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none transition focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/15"
                      />

                      <input
                        value={contactForm.phone}
                        onChange={(event) =>
                          setContactForm({ ...contactForm, phone: event.target.value })
                        }
                        placeholder="Phone or WhatsApp"
                        className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none transition focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/15"
                      />
                    </div>

                    <input
                      value={contactForm.subject}
                      onChange={(event) =>
                        setContactForm({ ...contactForm, subject: event.target.value })
                      }
                      placeholder="Subject e.g. Investor inquiry, JV proposal, land submission"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none transition focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/15"
                    />

                    <textarea
                      required
                      value={contactForm.message}
                      onChange={(event) =>
                        setContactForm({ ...contactForm, message: event.target.value })
                      }
                      placeholder="Tell us about your opportunity, investment interest, or partnership request"
                      rows={5}
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none transition focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/15"
                    />

                    <button
                      disabled={publicSubmittingForm === "contact_messages"}
                      className="rounded-2xl bg-[#0F172A] px-7 py-4 text-sm font-black text-white transition hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {publicSubmittingForm === "contact_messages" ? "Sending inquiry..." : "Send Business Inquiry"}
                    </button>

                    <div className="grid gap-3 pt-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setModal("investor")}
                        className="rounded-2xl border border-slate-200 px-5 py-4 text-center text-sm font-black text-[#0F172A] transition hover:border-[#C9A227] hover:text-[#9a7816]"
                      >
                        Investor Access
                      </button>

                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20INAMAAD%2C%20I%20want%20to%20make%20a%20business%20inquiry.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-2xl border border-slate-200 px-5 py-4 text-center text-sm font-black text-[#0F172A] transition hover:border-[#C9A227] hover:text-[#9a7816]"
                      >
                        WhatsApp: +{WHATSAPP_NUMBER}
                      </a>
                    </div>
                  </form>
                </div>
              </div>

              <div className="mt-8 grid gap-4 border-t border-white/10 pt-8 md:grid-cols-3">
                {[
                  {
                    title: "Opportunity Review",
                    text: "Submit properties, land, or JV opportunities for structured review.",
                  },
                  {
                    title: "Investor Relations",
                    text: "Start conversations around verified deals and long-term growth.",
                  },
                  {
                    title: "Partnership Desk",
                    text: "Connect for development, land acquisition, and joint venture collaboration.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl bg-white/[0.05] p-5">
                    <h3 className="text-base font-black text-[#C9A227]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[#f7f8fb] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
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

              <button
                onClick={() => {
                  setAdminPassword("");
                  setModal("admin");
                }}
                className="mt-2 w-fit text-left text-xs text-slate-400 hover:text-slate-700"
              >
                Staff Access
              </button>
            </div>
          </div>

          <div>
            <p className="font-black text-[#0d1c38]">Access</p>

            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <button
                type="button"
                onClick={openUserGuide}
                className="w-fit text-left"
              >
                How to use INAMAAD
              </button>

              {isSignedIn ? (
                <>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                      Logged in
                    </p>
                    <p className="mt-1 max-w-[190px] truncate text-xs font-black text-[#0d1c38]">
                      {signedInEmail}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handlePublicSignOut}
                    className="w-fit text-left font-black text-[#0d1c38]"
                  >
                  Sign{"\u00A0"}Out
                </button>
                </>
              ) : (
                <button
                  onClick={() => setModal("signin")}
                  className="w-fit text-left"
                >
                  Sign{"\u00A0"}In
                </button>
              )}

              <button
                onClick={() => setModal("investor")}
                className="w-fit text-left"
              >
                Investor Access
              </button>


            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-slate-200 pt-5 text-center text-xs font-semibold text-slate-500">
          Ã‚Â© 2026 INAMAAD Real Estate. All rights reserved.
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
        <div
          data-inamaad-no-refresh="true"
          className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-slate-950/70 px-2 py-3 backdrop-blur-sm sm:items-center sm:px-4 sm:py-8"
        >
          <div
            className={`max-h-[94vh] w-full max-w-[calc(100vw-1rem)] overflow-y-auto rounded-[22px] bg-white p-4 shadow-2xl sm:max-h-[90vh] sm:rounded-[30px] sm:p-6 md:p-8 ${
              modal === "guide" ? "sm:max-w-5xl" : "sm:max-w-3xl"
            }`}
          >
            <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6 sm:gap-5">
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
                  {modal === "guide" && "How to use INAMAAD"}
                  {modal === "forgotPassword" && "Forgot password"}
                  {modal === "resetPassword" && "Create new password"}
                  {modal === "details" && selectedListing?.title}
                </h2>
              </div>

              <button
                onClick={() => {
                  setModal(null);
                  setSelectedListing(null);
                  setEditingListing(null);
                }}
                className="shrink-0 rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-200 sm:px-4 sm:text-sm"
              >
                Close
              </button>
            </div>

            {modal === "guide" && (
              <div className="grid gap-6">
                <div className="rounded-[26px] bg-[#0d1c38] p-5 text-white">
                  <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f0bf3c]">
                        User guidance
                      </p>
                      <h3 className="mt-3 text-3xl font-black tracking-tight">
                        Find property, inspect safely, contact INAMAAD, or submit your own listing.
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-white/75">
                        This quick guide helps first-time buyers, investors, agents, landlords, and JV partners understand the main actions on the website.
                      </p>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/10 p-4">
                      <div className="rounded-2xl bg-white p-4 text-[#0d1c38]">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                            Example listing
                          </span>
                          <span className="text-xs font-black text-[#9b6b16]">Verified</span>
                        </div>
                        <div className="mb-3 h-24 rounded-2xl bg-gradient-to-br from-slate-200 via-slate-100 to-[#f0bf3c]/30" />
                        <div className="h-3 w-3/4 rounded-full bg-slate-200" />
                        <div className="mt-2 h-3 w-1/2 rounded-full bg-slate-100" />
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="h-9 rounded-xl bg-[#0d1c38]" />
                          <div className="h-9 rounded-xl border border-slate-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      title: "1. Browse properties",
                      text: "Use Properties, JV Deals, search, location, price, purpose, and availability filters to find suitable opportunities.",
                      badge: "Browse",
                    },
                    {
                      title: "2. Open details",
                      text: "Click any property or JV card to see price, location, documents, contact options, inspection form, offer form, and more details.",
                      badge: "Details",
                    },
                    {
                      title: "3. Contact safely",
                      text: "Use WhatsApp, enquiry, inspection, or offer buttons. Request inspection before payment and confirm important documents first.",
                      badge: "Safety",
                    },
                  ].map((step) => (
                    <div key={step.title} className="rounded-[24px] border border-slate-200 bg-[#f8fafc] p-4">
                      <div className="mb-4 rounded-2xl bg-white p-3 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="rounded-full bg-[#fff7df] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#9b6b16]">
                            {step.badge}
                          </span>
                          <div className="flex gap-1">
                            <span className="h-2 w-2 rounded-full bg-red-300" />
                            <span className="h-2 w-2 rounded-full bg-yellow-300" />
                            <span className="h-2 w-2 rounded-full bg-green-300" />
                          </div>
                        </div>
                        <div className="h-16 rounded-xl bg-gradient-to-br from-slate-200 to-slate-50" />
                        <div className="mt-3 h-2.5 w-5/6 rounded-full bg-slate-200" />
                        <div className="mt-2 h-2.5 w-2/3 rounded-full bg-slate-100" />
                      </div>

                      <h4 className="text-base font-black text-[#0d1c38]">{step.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d39b19]">
                      For buyers and investors
                    </p>
                    <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
                      <p><strong className="text-[#0d1c38]">Browse:</strong> Start from Properties or JV Deals.</p>
                      <p><strong className="text-[#0d1c38]">Review:</strong> Open the detail page and check price, status, location, and documents.</p>
                      <p><strong className="text-[#0d1c38]">Inspect:</strong> Use Request Inspection before making payment or commitment.</p>
                      <p><strong className="text-[#0d1c38]">Contact:</strong> Use WhatsApp/contact buttons for quick guidance from INAMAAD.</p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d39b19]">
                      For agents, owners and JV partners
                    </p>
                    <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
                      <p><strong className="text-[#0d1c38]">Submit:</strong> Use Post Property or Submit Opportunity.</p>
                      <p><strong className="text-[#0d1c38]">Choose type:</strong> Select Property for normal listings or JV for partnership deals.</p>
                      <p><strong className="text-[#0d1c38]">Upload:</strong> Add clear images and supporting documents where available.</p>
                      <p><strong className="text-[#0d1c38]">Wait review:</strong> Pending listings are checked before showing as verified.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-5">
                  <p className="text-sm font-black text-emerald-800">
                    Safety reminder
                  </p>
                  <p className="mt-2 text-sm leading-7 text-emerald-700">
                    Always inspect property, verify ownership/documents, and communicate through trusted INAMAAD contact channels before payment.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => {
                      setModal(null);
                      window.location.hash = "properties";
                    }}
                    className="rounded-2xl bg-[#0d1c38] px-5 py-4 text-sm font-black text-white hover:bg-[#13284f]"
                  >
                    Browse properties
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setModal(null);
                      openPostModal("property");
                    }}
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm font-black text-[#0d1c38] hover:border-[#0d1c38]"
                  >
                    Post property
                  </button>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20INAMAAD%2C%20I%20need%20help%20using%20the%20website.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-center text-sm font-black text-green-700 hover:bg-green-100"
                  >
                    Ask on WhatsApp
                  </a>
                </div>
              </div>
            )}

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

                {confirmationEmail && (
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                    <p className="font-black">Email confirmation required</p>
                    <p className="mt-1">
                      Confirm <span className="font-black">{confirmationEmail}</span> before signing in.
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordEmail(signInForm.email);
                      setModal("forgotPassword");
                    }}
                    className="text-sm font-black text-[#9a7816] hover:text-[#0d1c38]"
                  >
                    Forgot password?
                  </button>

                  <button
                    type="button"
                    onClick={() => setModal("register")}
                    className="text-sm font-bold text-slate-500 hover:text-[#0d1c38]"
                  >
                    Create a new account
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleResendConfirmationEmail}
                  className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm font-black text-amber-900 transition hover:bg-amber-100"
                >
                  Resend confirmation email
                </button>

                <button className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white">
                  Sign in
                </button>
              </form>
            )}

            {modal === "forgotPassword" && (
              <form onSubmit={handleForgotPassword} className="grid gap-4">
                <div className="rounded-3xl border border-[#C9A227]/25 bg-[#f8f5eb] p-5">
                  <p className="text-sm font-bold leading-6 text-slate-700">
                    Enter the email address linked to your INAMAAD account. We will send a secure password reset link to your inbox.
                  </p>
                </div>

                <input
                  required
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(event) => setForgotPasswordEmail(event.target.value)}
                  placeholder="Email address"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <button className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white">
                  Send reset link
                </button>

                <button
                  type="button"
                  onClick={() => setModal("signin")}
                  className="text-sm font-bold text-slate-500 hover:text-[#0d1c38]"
                >
                  Back to sign in
                </button>
              </form>
            )}

            {modal === "resetPassword" && (
              <form onSubmit={handleResetPassword} className="grid gap-4">
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="text-sm font-bold leading-6 text-emerald-800">
                    Your reset link has been verified. Create a new password for your INAMAAD account.
                  </p>
                </div>

                <input
                  required
                  type="password"
                  value={resetPasswordForm.password}
                  onChange={(event) =>
                    setResetPasswordForm({
                      ...resetPasswordForm,
                      password: event.target.value,
                    })
                  }
                  placeholder="New password"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <input
                  required
                  type="password"
                  value={resetPasswordForm.confirmPassword}
                  onChange={(event) =>
                    setResetPasswordForm({
                      ...resetPasswordForm,
                      confirmPassword: event.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <button className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white">
                  Update password
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

                <div className="rounded-3xl border border-[#C9A227]/25 bg-[#f8f5eb] p-4 text-sm font-bold leading-6 text-slate-700">
                  Email confirmation is required. After creating your account, check your inbox and confirm your email before signing in.
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white transition hover:bg-[#13284f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isRegistering ? "Sending confirmation..." : "Create account"}
                </button>
              </form>
            )}

            {modal === "post" && (
              <form key={`post-${postMode}-${postFormRenderKey}`} onSubmit={submitListing} className="grid gap-4">
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-slate-700">
                  <p className="font-black text-[#0d1c38]">Need help? Use examples like these:</p>
                  <p className="mt-2"><span className="font-black">Title:</span> 4 Bedroom Smart Duplex in Lekki Phase 1</p>
                  <p><span className="font-black">Investment highlight:</span> Estimated 14% yearly appreciation with strong rental demand</p>
                  <p><span className="font-black">Opportunity:</span> A verified property in a fast-growing location, suitable for rental income, resale value, or long-term investment.</p>
                  <p className="mt-2 rounded-xl bg-white px-3 py-2 text-slate-600"><span className="font-black text-[#0d1c38]">Quick guide:</span> choose the building/asset under Property type, then choose For Sale, For Rent, Short Let, Lease, Investment, or JV under Listing purpose.</p>
                </div>

                <div className="grid gap-3 rounded-3xl border border-slate-200 bg-[#f7f8fb] p-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => switchPostSubmissionMode("property")}
                    className={`rounded-2xl px-5 py-3 text-sm font-black ${!postFormIsJointVenture ? "bg-white text-[#0d1c38] shadow-sm" : "text-slate-500 hover:bg-white/70"}`}
                  >
                    Property Listing
                  </button>
                  <button
                    type="button"
                    onClick={() => switchPostSubmissionMode("jv")}
                    className={`rounded-2xl px-5 py-3 text-sm font-black ${postFormIsJointVenture ? "bg-white text-[#0d1c38] shadow-sm" : "text-slate-500 hover:bg-white/70"}`}
                  >
                    JV Deal
                  </button>
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

                  <select
                    required
                    value={postForm.stateName}
                    onChange={(event) =>
                      setPostForm({ ...postForm, stateName: event.target.value })
                    }
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    aria-label="State or FCT"
                  >
                    {nigeriaLocationLabels.map((location) => (
                      <option key={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
                  <p className="text-sm font-black text-[#0d1c38]">Exact property location</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Use State/FCT and City/Area publicly. Keep full address hidden unless you want visitors to see it.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <input
                      required
                      value={postForm.cityArea}
                      onChange={(event) => setPostForm({ ...postForm, cityArea: event.target.value })}
                      placeholder="City / Area, e.g. Garki, Maitama, Lekki Phase 1"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={postForm.nearbyLandmark}
                      onChange={(event) => setPostForm({ ...postForm, nearbyLandmark: event.target.value })}
                      placeholder="Nearby landmark, e.g. close to Shoprite / airport road"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={postForm.fullAddress}
                      onChange={(event) => setPostForm({ ...postForm, fullAddress: event.target.value })}
                      placeholder="Full address / estate name, kept private unless enabled"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38] md:col-span-2"
                    />

                    <input
                      value={postForm.googleMapLink}
                      onChange={(event) => setPostForm({ ...postForm, googleMapLink: event.target.value })}
                      placeholder="Google Maps link, optional"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38] md:col-span-2"
                    />
                  </div>

                  <label className="mt-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={postForm.showExactAddress}
                      onChange={(event) => setPostForm({ ...postForm, showExactAddress: event.target.checked })}
                    />
                    Show exact address and map link publicly
                  </label>

                  <p className="mt-3 text-xs font-bold text-slate-500">
                    Public display: {postForm.cityArea || "Area"}, {postForm.stateName || "State/FCT"}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
                  <p className="text-sm font-black text-[#0d1c38]">Property video / virtual tour</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Add YouTube, TikTok, Instagram, Google Drive, virtual tour, or drone video links. Leave blank if not available.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <input
                      value={postForm.videoUrl}
                      onChange={(event) => setPostForm({ ...postForm, videoUrl: event.target.value })}
                      placeholder="YouTube / property video link"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={postForm.virtualTourUrl}
                      onChange={(event) => setPostForm({ ...postForm, virtualTourUrl: event.target.value })}
                      placeholder="Virtual tour link, e.g. Matterport / 360 tour"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={postForm.droneVideoUrl}
                      onChange={(event) => setPostForm({ ...postForm, droneVideoUrl: event.target.value })}
                      placeholder="Drone video link, optional"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38] md:col-span-2"
                    />
                  </div>

                  <label className="mt-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={postForm.showVideoPublicly}
                      onChange={(event) => setPostForm({ ...postForm, showVideoPublicly: event.target.checked })}
                    />
                    Show video / virtual tour links publicly
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 focus-within:border-[#0d1c38]">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {postFormIsJointVenture ? "Estimated JV value / project cost" : "Price currency"}
                    </label>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="rounded-full bg-[#0d1c38] px-3 py-2 text-xs font-black text-white">
                        ₦ ₦
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
                    onChange={(event) => {
                      const nextType = event.target.value;
                      if (nextType === "Joint Venture") {
                        switchPostSubmissionMode("jv");
                        return;
                      }
                      setPostForm({ ...postForm, type: nextType });
                    }}
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    aria-label="Property type"
                  >
                    {propertyTypeOptions.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-sm font-black text-[#0d1c38]">Price breakdown and payment details</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Add extra Nigerian real estate costs. The total estimated cost is calculated automatically from property price plus fees.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {[
                      ["agencyFee", "Agency fee, e.g. 5000000"],
                      ["legalFee", "Legal / documentation fee, e.g. 2500000"],
                      ["serviceCharge", "Service charge, optional"],
                      ["cautionFee", "Caution fee, optional"],
                      ["surveyFee", "Survey fee, optional"],
                      ["developmentFee", "Development fee, optional"],
                    ].map(([field, placeholder]) => (
                      <div key={field} className="rounded-2xl border border-amber-200 bg-white px-5 py-3 focus-within:border-[#0d1c38]">
                        <label className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                          {placeholder.split(",")[0]}
                        </label>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="rounded-full bg-[#0d1c38] px-3 py-2 text-xs font-black text-white">₦</span>
                          <input
                            inputMode="numeric"
                            value={postForm[field as keyof typeof postForm] as string}
                            onChange={(event) =>
                              setPostForm({
                                ...postForm,
                                [field]: formatPriceInput(event.target.value),
                              })
                            }
                            placeholder={placeholder}
                            className="w-full border-0 bg-transparent text-sm font-bold outline-none placeholder:font-normal"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#0d1c38] p-4 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f0bf3c]">Auto total estimated cost</p>
                    <p className="mt-2 text-2xl font-black">{calculateTotalEstimatedCost(postForm) || "₦0"}</p>
                    <p className="mt-1 text-xs text-slate-300">Property price + agency + legal/documentation + service + caution + survey + development fees.</p>
                  </div>

                  <label className="mt-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={postForm.paymentPlanAvailable}
                      onChange={(event) => setPostForm({ ...postForm, paymentPlanAvailable: event.target.checked })}
                    />
                    Payment plan / installment is available
                  </label>

                  <textarea
                    value={postForm.installmentDetails}
                    onChange={(event) => setPostForm({ ...postForm, installmentDetails: event.target.value })}
                    placeholder="Installment details, e.g. 30% initial deposit, balance over 6 months"
                    className="mt-4 min-h-[90px] w-full rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <select
                    value={postForm.category}
                    onChange={(event) => {
                      const nextPurpose = event.target.value;
                      if (nextPurpose === "JV Partnership") {
                        switchPostSubmissionMode("jv");
                        return;
                      }
                      setPostForm({
                        ...postForm,
                        category: nextPurpose,
                      });
                    }}
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    aria-label="Listing purpose"
                  >
                    {listingPurposeOptions.map((purpose) => (
                      <option key={purpose}>{purpose}</option>
                    ))}
                  </select>

                  <div className="grid gap-4 md:col-span-2 md:grid-cols-3">
                    <select
                      value={postForm.availabilityStatus}
                      onChange={(event) =>
                        setPostForm({
                          ...postForm,
                          availabilityStatus: event.target.value as AvailabilityStatus,
                        })
                      }
                      aria-label="Availability status"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    >
                      {availabilityStatusOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>

                    <input
                      type="date"
                      value={postForm.availableFrom}
                      onChange={(event) =>
                        setPostForm({ ...postForm, availableFrom: event.target.value })
                      }
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Available from date"
                    />

                    <input
                      value={postForm.availabilityNote}
                      onChange={(event) =>
                        setPostForm({ ...postForm, availabilityNote: event.target.value })
                      }
                      placeholder="Availability note, e.g. Vacant now, reserved till Friday, tenant leaves July"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </div>

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

                {postFormIsJointVenture ? (
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                    <p className="text-sm font-black text-[#0d1c38]">Joint venture project profile</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      JV deals should be described as development opportunities, not bedroom/bathroom listings. Use this section for landowner, developer, investor, sharing formula, and project stage.
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <select
                        value={postForm.jvStructure}
                        onChange={(event) => setPostForm({ ...postForm, jvStructure: event.target.value })}
                        className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                        aria-label="JV structure"
                      >
                        {jvStructureOptions.map((structure) => (
                          <option key={structure}>{structure}</option>
                        ))}
                      </select>

                      <select
                        value={postForm.jvProjectStage}
                        onChange={(event) => setPostForm({ ...postForm, jvProjectStage: event.target.value })}
                        className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                        aria-label="JV project stage"
                      >
                        {jvProjectStageOptions.map((stage) => (
                          <option key={stage}>{stage}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <input
                        value={postForm.landSize}
                        onChange={(event) => setPostForm({ ...postForm, landSize: event.target.value })}
                        placeholder="JV land size, e.g. 3,500sqm, 2 hectares, 20 plots"
                        className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                      <input
                        value={postForm.jvExpectedUnits}
                        onChange={(event) => setPostForm({ ...postForm, jvExpectedUnits: event.target.value })}
                        placeholder="Expected units, e.g. 24 terraces, 80 apartments"
                        className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                      <input
                        value={postForm.jvEstimatedProjectCost}
                        onChange={(event) => setPostForm({ ...postForm, jvEstimatedProjectCost: formatPriceInput(event.target.value) })}
                        placeholder="Estimated project cost, e.g. ₦1,500,000,000"
                        className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                      <input
                        value={postForm.jvCompletionTimeline}
                        onChange={(event) => setPostForm({ ...postForm, jvCompletionTimeline: event.target.value })}
                        placeholder="Completion timeline, e.g. 18 months after approval"
                        className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <textarea
                        value={postForm.jvLandContribution}
                        onChange={(event) => setPostForm({ ...postForm, jvLandContribution: event.target.value })}
                        placeholder="Landowner contribution, e.g. clean land with C of O, access road, vacant possession"
                        className="min-h-[96px] rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                      <textarea
                        value={postForm.jvDeveloperRequirement}
                        onChange={(event) => setPostForm({ ...postForm, jvDeveloperRequirement: event.target.value })}
                        placeholder="Developer requirement, e.g. fund construction, handle approvals, deliver infrastructure"
                        className="min-h-[96px] rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                      <textarea
                        value={postForm.jvInvestorRequirement}
                        onChange={(event) => setPostForm({ ...postForm, jvInvestorRequirement: event.target.value })}
                        placeholder="Investor requirement, e.g. equity funding, staged capital, off-plan buyer pool"
                        className="min-h-[96px] rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                      <textarea
                        value={postForm.jvSharingFormula}
                        onChange={(event) => setPostForm({ ...postForm, jvSharingFormula: event.target.value })}
                        placeholder="Sharing formula, e.g. 40% landowner / 60% developer, or units split after cost recovery"
                        className="min-h-[96px] rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                    </div>

                    <textarea
                      value={postForm.jvTerms}
                      onChange={(event) => setPostForm({ ...postForm, jvTerms: event.target.value })}
                      placeholder="JV terms and notes, e.g. required due diligence, legal structure, approvals, exit plan, profit-sharing terms"
                      className="mt-4 min-h-[110px] w-full rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
                    <p className="text-sm font-black text-[#0d1c38]">Property specifications and amenities</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Add the details buyers and tenants normally search for. Leave fields empty if they do not apply, for example land may not need bedrooms.
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-4">
                      <input type="number" min="0" value={postForm.bedrooms} onChange={(event) => setPostForm({ ...postForm, bedrooms: event.target.value })} placeholder="Bedrooms, e.g. 4" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" />
                      <input type="number" min="0" value={postForm.bathrooms} onChange={(event) => setPostForm({ ...postForm, bathrooms: event.target.value })} placeholder="Bathrooms, e.g. 4" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" />
                      <input type="number" min="0" value={postForm.toilets} onChange={(event) => setPostForm({ ...postForm, toilets: event.target.value })} placeholder="Toilets, e.g. 5" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" />
                      <input type="number" min="0" value={postForm.parkingSpaces} onChange={(event) => setPostForm({ ...postForm, parkingSpaces: event.target.value })} placeholder="Parking spaces, e.g. 2" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" />
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <input value={postForm.landSize} onChange={(event) => setPostForm({ ...postForm, landSize: event.target.value })} placeholder="Land size, e.g. 500sqm, 1 plot, 2 hectares" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" />
                      <input value={postForm.propertySize} onChange={(event) => setPostForm({ ...postForm, propertySize: event.target.value })} placeholder="Built-up size, e.g. 320sqm" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" />
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <select value={postForm.furnishingStatus} onChange={(event) => setPostForm({ ...postForm, furnishingStatus: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" aria-label="Furnishing status">
                        {furnishingStatusOptions.map((status) => (<option key={status}>{status}</option>))}
                      </select>
                      <select value={postForm.propertyCondition} onChange={(event) => setPostForm({ ...postForm, propertyCondition: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" aria-label="Property condition">
                        {propertyConditionOptions.map((condition) => (<option key={condition}>{condition}</option>))}
                      </select>
                    </div>

                    <input list="amenity-options" value={postForm.amenities} onChange={(event) => setPostForm({ ...postForm, amenities: event.target.value })} placeholder="Amenities, e.g. 24/7 Security, CCTV, Swimming Pool, Fitted Kitchen" className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" />
                  </div>
                )}

                <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
                  <p className="text-sm font-black text-[#0d1c38]">Neighborhood and infrastructure</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Add environment details buyers ask for before inspection. Use short, clear examples.
                  </p>

                  <textarea
                    value={postForm.neighborhoodOverview}
                    onChange={(event) => setPostForm({ ...postForm, neighborhoodOverview: event.target.value })}
                    placeholder="Neighborhood overview, e.g. Quiet gated estate close to schools, malls, and major access roads."
                    className="mt-4 min-h-[96px] w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <input
                      value={postForm.roadAccess}
                      onChange={(event) => setPostForm({ ...postForm, roadAccess: event.target.value })}
                      placeholder="Road access, e.g. tarred road, interlocked estate road"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={postForm.distanceToMajorRoad}
                      onChange={(event) => setPostForm({ ...postForm, distanceToMajorRoad: event.target.value })}
                      placeholder="Distance to major road, e.g. 3 minutes to expressway"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={postForm.powerSupply}
                      onChange={(event) => setPostForm({ ...postForm, powerSupply: event.target.value })}
                      placeholder="Power supply, e.g. 18 hours average, transformer available"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={postForm.waterSupply}
                      onChange={(event) => setPostForm({ ...postForm, waterSupply: event.target.value })}
                      placeholder="Water supply, e.g. borehole, treated estate water"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={postForm.securityFeatures}
                      onChange={(event) => setPostForm({ ...postForm, securityFeatures: event.target.value })}
                      placeholder="Security, e.g. gated estate, CCTV, armed security"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={postForm.estateFeatures}
                      onChange={(event) => setPostForm({ ...postForm, estateFeatures: event.target.value })}
                      placeholder="Estate features, e.g. drainage, streetlights, gym, playground"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={postForm.nearbySchools}
                      onChange={(event) => setPostForm({ ...postForm, nearbySchools: event.target.value })}
                      placeholder="Nearby schools, e.g. 5 mins to Greensprings / Nile University"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={postForm.nearbyHospitals}
                      onChange={(event) => setPostForm({ ...postForm, nearbyHospitals: event.target.value })}
                      placeholder="Nearby hospitals, e.g. 7 mins to Evercare / National Hospital"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={postForm.nearbyMalls}
                      onChange={(event) => setPostForm({ ...postForm, nearbyMalls: event.target.value })}
                      placeholder="Nearby malls/markets, e.g. 10 mins to Novare Mall"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={postForm.nearbyTransport}
                      onChange={(event) => setPostForm({ ...postForm, nearbyTransport: event.target.value })}
                      placeholder="Nearby transport, e.g. BRT, airport road, expressway access"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
                  <p className="text-sm font-black text-[#0d1c38]">Neighborhood and infrastructure</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Update road, power, security, and nearby infrastructure details for this listing.
                  </p>

                  <textarea
                    value={editForm.neighborhoodOverview}
                    onChange={(event) => setEditForm({ ...editForm, neighborhoodOverview: event.target.value })}
                    placeholder="Neighborhood overview, e.g. Quiet gated estate close to schools, malls, and major access roads."
                    className="mt-4 min-h-[96px] w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <input
                      value={editForm.roadAccess}
                      onChange={(event) => setEditForm({ ...editForm, roadAccess: event.target.value })}
                      placeholder="Road access, e.g. tarred road, interlocked estate road"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={editForm.distanceToMajorRoad}
                      onChange={(event) => setEditForm({ ...editForm, distanceToMajorRoad: event.target.value })}
                      placeholder="Distance to major road, e.g. 3 minutes to expressway"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={editForm.powerSupply}
                      onChange={(event) => setEditForm({ ...editForm, powerSupply: event.target.value })}
                      placeholder="Power supply, e.g. 18 hours average, transformer available"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={editForm.waterSupply}
                      onChange={(event) => setEditForm({ ...editForm, waterSupply: event.target.value })}
                      placeholder="Water supply, e.g. borehole, treated estate water"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={editForm.securityFeatures}
                      onChange={(event) => setEditForm({ ...editForm, securityFeatures: event.target.value })}
                      placeholder="Security, e.g. gated estate, CCTV, armed security"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={editForm.estateFeatures}
                      onChange={(event) => setEditForm({ ...editForm, estateFeatures: event.target.value })}
                      placeholder="Estate features, e.g. drainage, streetlights, gym, playground"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={editForm.nearbySchools}
                      onChange={(event) => setEditForm({ ...editForm, nearbySchools: event.target.value })}
                      placeholder="Nearby schools, e.g. 5 mins to Greensprings / Nile University"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={editForm.nearbyHospitals}
                      onChange={(event) => setEditForm({ ...editForm, nearbyHospitals: event.target.value })}
                      placeholder="Nearby hospitals, e.g. 7 mins to Evercare / National Hospital"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={editForm.nearbyMalls}
                      onChange={(event) => setEditForm({ ...editForm, nearbyMalls: event.target.value })}
                      placeholder="Nearby malls/markets, e.g. 10 mins to Novare Mall"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={editForm.nearbyTransport}
                      onChange={(event) => setEditForm({ ...editForm, nearbyTransport: event.target.value })}
                      placeholder="Nearby transport, e.g. BRT, airport road, expressway access"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </div>
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

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                    <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      More gallery images
                    </label>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Optional. Add living room, bedroom, kitchen, bathroom, exterior, land/site, or document photos. You can select many images.
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) =>
                        setPostGalleryFiles(Array.from(event.target.files || []))
                      }
                      className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    {postGalleryFiles.length > 0 && (
                      <p className="mt-3 text-xs font-bold text-emerald-700">
                        {postGalleryFiles.length} gallery image(s) selected
                      </p>
                    )}
                  </div>
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

                <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
                  <p className="text-sm font-black text-[#0d1c38]">Owner / agent / developer contact profile</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Record who submitted the property and how the public should see contact details. Keep phone hidden if INAMAAD should handle the lead first.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <select
                      value={postForm.contactRole}
                      onChange={(event) => setPostForm({ ...postForm, contactRole: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Contact role"
                    >
                      {contactRoleOptions.map((role) => (
                        <option key={role}>{role}</option>
                      ))}
                    </select>

                    <select
                      value={postForm.mandateStatus}
                      onChange={(event) => setPostForm({ ...postForm, mandateStatus: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Mandate status"
                    >
                      {mandateStatusOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>

                    <input
                      value={postForm.ownerName}
                      onChange={(event) => setPostForm({ ...postForm, ownerName: event.target.value })}
                      placeholder="Contact person, e.g. Musa Abdullahi"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={postForm.companyName}
                      onChange={(event) => setPostForm({ ...postForm, companyName: event.target.value })}
                      placeholder="Company / developer name, e.g. INAMAAD Homes Ltd"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={postForm.ownerPhone}
                      onChange={(event) => setPostForm({ ...postForm, ownerPhone: event.target.value })}
                      placeholder="Phone number, e.g. 08106350486"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={postForm.contactWhatsapp}
                      onChange={(event) => setPostForm({ ...postForm, contactWhatsapp: event.target.value })}
                      placeholder="WhatsApp number, optional"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={postForm.contactEmail}
                      onChange={(event) => setPostForm({ ...postForm, contactEmail: event.target.value })}
                      placeholder="Contact email, optional"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <select
                      value={postForm.publicContactVisibility}
                      onChange={(event) => setPostForm({ ...postForm, publicContactVisibility: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Public contact visibility"
                    >
                      {publicContactVisibilityOptions.map((visibility) => (
                        <option key={visibility}>{visibility}</option>
                      ))}
                    </select>

                    <textarea
                      value={postForm.contactAddress}
                      onChange={(event) => setPostForm({ ...postForm, contactAddress: event.target.value })}
                      placeholder="Contact office/address, optional. Keep private for staff use unless you choose Show All."
                      rows={3}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38] md:col-span-2"
                    />

                    <select
                      value={postForm.identityType}
                      onChange={(event) => setPostForm({ ...postForm, identityType: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Identity verification type"
                    >
                      {identityTypeOptions.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>

                    <input
                      value={postForm.identityNumber}
                      onChange={(event) => setPostForm({ ...postForm, identityNumber: event.target.value })}
                      placeholder="ID number / NIN / passport number, optional for staff verification"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={postForm.companyRegistrationNumber}
                      onChange={(event) => setPostForm({ ...postForm, companyRegistrationNumber: event.target.value })}
                      placeholder="CAC / company registration number, e.g. RC1234567"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <select
                      value={postForm.mandateDocumentStatus}
                      onChange={(event) => setPostForm({ ...postForm, mandateDocumentStatus: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Mandate document status"
                    >
                      {mandateDocumentStatusOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>

                    <textarea
                      value={postForm.contactVerificationNotes}
                      onChange={(event) => setPostForm({ ...postForm, contactVerificationNotes: event.target.value })}
                      placeholder="Verification note, e.g. Agent claims direct mandate from owner; CAC pending confirmation."
                      rows={3}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38] md:col-span-2"
                    />
                  </div>

                  <p className="mt-3 text-xs font-bold text-slate-500">
                    Public contact setting: {postForm.publicContactVisibility}. Staff can always see the full contact profile.
                  </p>
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
                  <p><span className="font-black">Investment highlight:</span> Premium capital appreciation in Abuja's prime district</p>
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

                  <select
                    required
                    value={editForm.stateName}
                    onChange={(event) => setEditForm({ ...editForm, stateName: event.target.value })}
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    aria-label="State or FCT"
                  >
                    {nigeriaLocationLabels.map((location) => (
                      <option key={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
                  <p className="text-sm font-black text-[#0d1c38]">Exact property location</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Control what the public sees. Staff can keep exact address private while showing the area/state.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <input
                      required
                      value={editForm.cityArea}
                      onChange={(event) => setEditForm({ ...editForm, cityArea: event.target.value })}
                      placeholder="City / Area, e.g. Garki, Maitama, Lekki Phase 1"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={editForm.nearbyLandmark}
                      onChange={(event) => setEditForm({ ...editForm, nearbyLandmark: event.target.value })}
                      placeholder="Nearby landmark"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={editForm.fullAddress}
                      onChange={(event) => setEditForm({ ...editForm, fullAddress: event.target.value })}
                      placeholder="Full address / estate name"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38] md:col-span-2"
                    />

                    <input
                      value={editForm.googleMapLink}
                      onChange={(event) => setEditForm({ ...editForm, googleMapLink: event.target.value })}
                      placeholder="Google Maps link"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38] md:col-span-2"
                    />
                  </div>

                  <label className="mt-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={editForm.showExactAddress}
                      onChange={(event) => setEditForm({ ...editForm, showExactAddress: event.target.checked })}
                    />
                    Show exact address and map link publicly
                  </label>

                  <p className="mt-3 text-xs font-bold text-slate-500">
                    Public display: {editForm.cityArea || "Area"}, {editForm.stateName || "State/FCT"}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
                  <p className="text-sm font-black text-[#0d1c38]">Property video / virtual tour</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Use video links to show tours, drone footage, and walk-throughs without uploading heavy videos.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <input
                      value={editForm.videoUrl}
                      onChange={(event) => setEditForm({ ...editForm, videoUrl: event.target.value })}
                      placeholder="YouTube / property video link"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={editForm.virtualTourUrl}
                      onChange={(event) => setEditForm({ ...editForm, virtualTourUrl: event.target.value })}
                      placeholder="Virtual tour link"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    <input
                      value={editForm.droneVideoUrl}
                      onChange={(event) => setEditForm({ ...editForm, droneVideoUrl: event.target.value })}
                      placeholder="Drone video link"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38] md:col-span-2"
                    />
                  </div>

                  <label className="mt-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={editForm.showVideoPublicly}
                      onChange={(event) => setEditForm({ ...editForm, showVideoPublicly: event.target.checked })}
                    />
                    Show video / virtual tour links publicly
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 focus-within:border-[#0d1c38]">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {postFormIsJointVenture ? "Estimated JV value / project cost" : "Price currency"}
                    </label>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="rounded-full bg-[#0d1c38] px-3 py-2 text-xs font-black text-white">
                        ₦ ₦
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

                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-sm font-black text-[#0d1c38]">Price breakdown and payment details</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Add extra Nigerian real estate costs. The total estimated cost is calculated automatically from property price plus fees.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {[
                      ["agencyFee", "Agency fee, e.g. 5000000"],
                      ["legalFee", "Legal / documentation fee, e.g. 2500000"],
                      ["serviceCharge", "Service charge, optional"],
                      ["cautionFee", "Caution fee, optional"],
                      ["surveyFee", "Survey fee, optional"],
                      ["developmentFee", "Development fee, optional"],
                    ].map(([field, placeholder]) => (
                      <div key={field} className="rounded-2xl border border-amber-200 bg-white px-5 py-3 focus-within:border-[#0d1c38]">
                        <label className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                          {placeholder.split(",")[0]}
                        </label>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="rounded-full bg-[#0d1c38] px-3 py-2 text-xs font-black text-white">₦</span>
                          <input
                            inputMode="numeric"
                            value={editForm[field as keyof typeof editForm] as string}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                [field]: formatPriceInput(event.target.value),
                              })
                            }
                            placeholder={placeholder}
                            className="w-full border-0 bg-transparent text-sm font-bold outline-none placeholder:font-normal"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#0d1c38] p-4 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f0bf3c]">Auto total estimated cost</p>
                    <p className="mt-2 text-2xl font-black">{calculateTotalEstimatedCost(editForm) || "₦0"}</p>
                    <p className="mt-1 text-xs text-slate-300">Property price + agency + legal/documentation + service + caution + survey + development fees.</p>
                  </div>

                  <label className="mt-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={editForm.paymentPlanAvailable}
                      onChange={(event) => setEditForm({ ...editForm, paymentPlanAvailable: event.target.checked })}
                    />
                    Payment plan / installment is available
                  </label>

                  <textarea
                    value={editForm.installmentDetails}
                    onChange={(event) => setEditForm({ ...editForm, installmentDetails: event.target.value })}
                    placeholder="Installment details, e.g. 30% initial deposit, balance over 6 months"
                    className="mt-4 min-h-[90px] w-full rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />
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
                  <p className="text-sm font-black text-[#0d1c38]">Availability status</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Use this to mark a property as Available, Reserved, Sold, Rented, Leased, or Off Market.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <select
                      value={editForm.availabilityStatus}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          availabilityStatus: event.target.value as AvailabilityStatus,
                        })
                      }
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Availability status"
                    >
                      {availabilityStatusOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>

                    <input
                      type="date"
                      value={editForm.availableFrom}
                      onChange={(event) =>
                        setEditForm({ ...editForm, availableFrom: event.target.value })
                      }
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Available from date"
                    />

                    <input
                      value={editForm.availabilityNote}
                      onChange={(event) =>
                        setEditForm({ ...editForm, availabilityNote: event.target.value })
                      }
                      placeholder="Note, e.g. Sold, reserved by client, vacant from 1 July"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </div>
                </div>


                {isJointVentureListing(editForm) ? (
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                    <p className="text-sm font-black text-[#0d1c38]">Joint venture project profile</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      JV deals should be described as development opportunities, not bedroom/bathroom listings. Use this section for landowner, developer, investor, sharing formula, and project stage.
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <select
                        value={editForm.jvStructure}
                        onChange={(event) => setEditForm({ ...editForm, jvStructure: event.target.value })}
                        className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                        aria-label="JV structure"
                      >
                        {jvStructureOptions.map((structure) => (
                          <option key={structure}>{structure}</option>
                        ))}
                      </select>

                      <select
                        value={editForm.jvProjectStage}
                        onChange={(event) => setEditForm({ ...editForm, jvProjectStage: event.target.value })}
                        className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                        aria-label="JV project stage"
                      >
                        {jvProjectStageOptions.map((stage) => (
                          <option key={stage}>{stage}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <input
                        value={editForm.landSize}
                        onChange={(event) => setEditForm({ ...editForm, landSize: event.target.value })}
                        placeholder="JV land size, e.g. 3,500sqm, 2 hectares, 20 plots"
                        className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                      <input
                        value={editForm.jvExpectedUnits}
                        onChange={(event) => setEditForm({ ...editForm, jvExpectedUnits: event.target.value })}
                        placeholder="Expected units, e.g. 24 terraces, 80 apartments"
                        className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                      <input
                        value={editForm.jvEstimatedProjectCost}
                        onChange={(event) => setEditForm({ ...editForm, jvEstimatedProjectCost: formatPriceInput(event.target.value) })}
                        placeholder="Estimated project cost, e.g. ₦1,500,000,000"
                        className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                      <input
                        value={editForm.jvCompletionTimeline}
                        onChange={(event) => setEditForm({ ...editForm, jvCompletionTimeline: event.target.value })}
                        placeholder="Completion timeline, e.g. 18 months after approval"
                        className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <textarea
                        value={editForm.jvLandContribution}
                        onChange={(event) => setEditForm({ ...editForm, jvLandContribution: event.target.value })}
                        placeholder="Landowner contribution, e.g. clean land with C of O, access road, vacant possession"
                        className="min-h-[96px] rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                      <textarea
                        value={editForm.jvDeveloperRequirement}
                        onChange={(event) => setEditForm({ ...editForm, jvDeveloperRequirement: event.target.value })}
                        placeholder="Developer requirement, e.g. fund construction, handle approvals, deliver infrastructure"
                        className="min-h-[96px] rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                      <textarea
                        value={editForm.jvInvestorRequirement}
                        onChange={(event) => setEditForm({ ...editForm, jvInvestorRequirement: event.target.value })}
                        placeholder="Investor requirement, e.g. equity funding, staged capital, off-plan buyer pool"
                        className="min-h-[96px] rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                      <textarea
                        value={editForm.jvSharingFormula}
                        onChange={(event) => setEditForm({ ...editForm, jvSharingFormula: event.target.value })}
                        placeholder="Sharing formula, e.g. 40% landowner / 60% developer, or units split after cost recovery"
                        className="min-h-[96px] rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                    </div>

                    <textarea
                      value={editForm.jvTerms}
                      onChange={(event) => setEditForm({ ...editForm, jvTerms: event.target.value })}
                      placeholder="JV terms and notes, e.g. required due diligence, legal structure, approvals, exit plan, profit-sharing terms"
                      className="mt-4 min-h-[110px] w-full rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <div className="mt-5 rounded-3xl border border-purple-200 bg-purple-50 p-5">
                      <p className="text-sm font-black text-[#0d1c38]">JV deal pipeline</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Manage this JV separately from normal property listings: due diligence, negotiation, agreement drafting, approval, rejection, or closure.
                      </p>

                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <select
                          value={editForm.jvDealStatus}
                          onChange={(event) => setEditForm({ ...editForm, jvDealStatus: event.target.value as JVDealStatus })}
                          className="rounded-2xl border border-purple-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                          aria-label="JV deal status"
                        >
                          {jvDealStatusOptions.map((status) => (<option key={status}>{status}</option>))}
                        </select>
                        <input
                          type="date"
                          value={editForm.jvNextActionDate}
                          onChange={(event) => setEditForm({ ...editForm, jvNextActionDate: event.target.value })}
                          className="rounded-2xl border border-purple-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                          aria-label="JV next action date"
                        />
                        <input
                          value={editForm.jvNextAction}
                          onChange={(event) => setEditForm({ ...editForm, jvNextAction: event.target.value })}
                          placeholder="Next action, e.g. schedule negotiation"
                          className="rounded-2xl border border-purple-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                        />
                      </div>

                      <textarea
                        value={editForm.jvInternalNotes}
                        onChange={(event) => setEditForm({ ...editForm, jvInternalNotes: event.target.value })}
                        placeholder="Private JV internal notes, negotiation risks, pending requirements, legal points..."
                        className="mt-4 min-h-[110px] w-full rounded-2xl border border-purple-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                    </div>

                    <div className="mt-5 rounded-3xl border border-amber-300 bg-white p-5">
                      <p className="text-sm font-black text-[#0d1c38]">JV due-diligence documents</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Staff-only files for serious JV review. Upload feasibility study, concept drawings, layout, BOQ/costing, and proposal documents. Public users only see review status, not the private files.
                      </p>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <select
                          value={editForm.jvLandTitleStatus}
                          onChange={(event) => setEditForm({ ...editForm, jvLandTitleStatus: event.target.value })}
                          className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                          aria-label="JV land title status"
                        >
                          {jvLandTitleStatusOptions.map((status) => (<option key={status}>{status}</option>))}
                        </select>

                        <select
                          value={editForm.jvDevelopmentApprovalStatus}
                          onChange={(event) => setEditForm({ ...editForm, jvDevelopmentApprovalStatus: event.target.value })}
                          className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                          aria-label="JV development approval status"
                        >
                          {jvDevelopmentApprovalStatusOptions.map((status) => (<option key={status}>{status}</option>))}
                        </select>
                      </div>

                      {[
                        ["Feasibility study", editJvFeasibilityStudyFile, setEditJvFeasibilityStudyFile, editForm.jvFeasibilityStudyUrl, "feasibility study"],
                        ["Architectural concept", editJvArchitecturalConceptFile, setEditJvArchitecturalConceptFile, editForm.jvArchitecturalConceptUrl, "architectural concept"],
                        ["Estate layout", editJvEstateLayoutFile, setEditJvEstateLayoutFile, editForm.jvEstateLayoutUrl, "estate layout"],
                        ["BOQ / project costing", editJvBoqFile, setEditJvBoqFile, editForm.jvBoqUrl, "BOQ / project costing"],
                        ["JV proposal document", editJvProposalDocumentFile, setEditJvProposalDocumentFile, editForm.jvProposalDocumentUrl, "JV proposal document"],
                      ].map(([label, selectedFile, setFile, existingUrl, secureLabel]) => (
                        <div key={String(label)} className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="text-sm font-black text-[#0d1c38]">{String(label)}</p>
                              <p className="mt-1 text-xs text-slate-500">PDF, JPG, PNG, WEBP. Private to senior staff.</p>
                              {selectedFile instanceof File ? (
                                <p className="mt-1 text-xs font-bold text-emerald-700">Selected: {selectedFile.name}</p>
                              ) : existingUrl ? (
                                <p className="mt-1 text-xs font-bold text-emerald-700">Uploaded securely</p>
                              ) : (
                                <p className="mt-1 text-xs text-slate-500">No file uploaded yet</p>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <label className="cursor-pointer rounded-full bg-white px-4 py-2 text-xs font-black text-[#0d1c38] ring-1 ring-amber-200">
                                Upload
                                <input
                                  type="file"
                                  accept="application/pdf,image/jpeg,image/png,image/webp"
                                  className="hidden"
                                  onChange={(event) => {
                                    const file = event.target.files?.[0] || null;
                                    (setFile as React.Dispatch<React.SetStateAction<File | null>>)(file);
                                  }}
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => openSecureJvDocument(String(existingUrl || ""), String(secureLabel))}
                                className="rounded-full bg-[#0d1c38] px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                                disabled={!existingUrl || !canOpenDocuments}
                              >
                                {canOpenDocuments ? "Open secure file" : "Locked"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
                    <p className="text-sm font-black text-[#0d1c38]">Property specifications and amenities</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Update the physical property details buyers and tenants use to compare listings.
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-4">
                      <input type="number" min="0" value={editForm.bedrooms} onChange={(event) => setEditForm({ ...editForm, bedrooms: event.target.value })} placeholder="Bedrooms, e.g. 4" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" />
                      <input type="number" min="0" value={editForm.bathrooms} onChange={(event) => setEditForm({ ...editForm, bathrooms: event.target.value })} placeholder="Bathrooms, e.g. 4" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" />
                      <input type="number" min="0" value={editForm.toilets} onChange={(event) => setEditForm({ ...editForm, toilets: event.target.value })} placeholder="Toilets, e.g. 5" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" />
                      <input type="number" min="0" value={editForm.parkingSpaces} onChange={(event) => setEditForm({ ...editForm, parkingSpaces: event.target.value })} placeholder="Parking spaces, e.g. 2" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" />
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <input value={editForm.landSize} onChange={(event) => setEditForm({ ...editForm, landSize: event.target.value })} placeholder="Land size, e.g. 500sqm, 1 plot, 2 hectares" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" />
                      <input value={editForm.propertySize} onChange={(event) => setEditForm({ ...editForm, propertySize: event.target.value })} placeholder="Built-up size, e.g. 320sqm" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" />
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <select value={editForm.furnishingStatus} onChange={(event) => setEditForm({ ...editForm, furnishingStatus: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" aria-label="Furnishing status">
                        {furnishingStatusOptions.map((status) => (<option key={status}>{status}</option>))}
                      </select>
                      <select value={editForm.propertyCondition} onChange={(event) => setEditForm({ ...editForm, propertyCondition: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" aria-label="Property condition">
                        {propertyConditionOptions.map((condition) => (<option key={condition}>{condition}</option>))}
                      </select>
                    </div>

                    <input list="amenity-options" value={editForm.amenities} onChange={(event) => setEditForm({ ...editForm, amenities: event.target.value })} placeholder="Amenities, e.g. 24/7 Security, CCTV, Swimming Pool, Fitted Kitchen" className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]" />
                  </div>
                )}
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

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                    <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Add more gallery images
                    </label>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Existing gallery images stay saved. Add more photos for bedroom, kitchen, exterior, land/site, or documents.
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) =>
                        setEditGalleryFiles(Array.from(event.target.files || []))
                      }
                      className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                    {editGalleryFiles.length > 0 && (
                      <p className="mt-3 text-xs font-bold text-emerald-700">
                        {editGalleryFiles.length} new gallery image(s) selected
                      </p>
                    )}
                  </div>
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

                <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
                  <p className="text-sm font-black text-[#0d1c38]">Owner / agent / developer contact profile</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Staff can update mandate status and choose what contact details public visitors may see.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <select
                      value={editForm.contactRole}
                      onChange={(event) => setEditForm({ ...editForm, contactRole: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Contact role"
                    >
                      {contactRoleOptions.map((role) => (
                        <option key={role}>{role}</option>
                      ))}
                    </select>

                    <select
                      value={editForm.mandateStatus}
                      onChange={(event) => setEditForm({ ...editForm, mandateStatus: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Mandate status"
                    >
                      {mandateStatusOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>

                    <input
                      value={editForm.ownerName}
                      onChange={(event) => setEditForm({ ...editForm, ownerName: event.target.value })}
                      placeholder="Contact person, e.g. Musa Abdullahi"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={editForm.companyName}
                      onChange={(event) => setEditForm({ ...editForm, companyName: event.target.value })}
                      placeholder="Company / developer name, e.g. INAMAAD Homes Ltd"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={editForm.ownerPhone}
                      onChange={(event) => setEditForm({ ...editForm, ownerPhone: event.target.value })}
                      placeholder="Phone number, e.g. 08106350486"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={editForm.contactWhatsapp}
                      onChange={(event) => setEditForm({ ...editForm, contactWhatsapp: event.target.value })}
                      placeholder="WhatsApp number, optional"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={editForm.contactEmail}
                      onChange={(event) => setEditForm({ ...editForm, contactEmail: event.target.value })}
                      placeholder="Contact email, optional"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <select
                      value={editForm.publicContactVisibility}
                      onChange={(event) => setEditForm({ ...editForm, publicContactVisibility: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Public contact visibility"
                    >
                      {publicContactVisibilityOptions.map((visibility) => (
                        <option key={visibility}>{visibility}</option>
                      ))}
                    </select>

                    <textarea
                      value={editForm.contactAddress}
                      onChange={(event) => setEditForm({ ...editForm, contactAddress: event.target.value })}
                      placeholder="Contact office/address, optional. Keep private unless visibility is Show All."
                      rows={3}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38] md:col-span-2"
                    />

                    <select
                      value={editForm.identityType}
                      onChange={(event) => setEditForm({ ...editForm, identityType: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Identity verification type"
                    >
                      {identityTypeOptions.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>

                    <input
                      value={editForm.identityNumber}
                      onChange={(event) => setEditForm({ ...editForm, identityNumber: event.target.value })}
                      placeholder="ID number / NIN / passport number"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      value={editForm.companyRegistrationNumber}
                      onChange={(event) => setEditForm({ ...editForm, companyRegistrationNumber: event.target.value })}
                      placeholder="CAC / company registration number, e.g. RC1234567"
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <select
                      value={editForm.mandateDocumentStatus}
                      onChange={(event) => setEditForm({ ...editForm, mandateDocumentStatus: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      aria-label="Mandate document status"
                    >
                      {mandateDocumentStatusOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>

                    <label className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-black text-emerald-800 md:col-span-2">
                      <input
                        type="checkbox"
                        checked={Boolean(editForm.contactProfileVerified)}
                        onChange={(event) => setEditForm({ ...editForm, contactProfileVerified: event.target.checked })}
                      />
                      Owner/agent/developer profile verified
                    </label>

                    <textarea
                      value={editForm.contactVerificationNotes}
                      onChange={(event) => setEditForm({ ...editForm, contactVerificationNotes: event.target.value })}
                      placeholder="Private verification notes, e.g. ID checked, CAC verified, mandate letter reviewed."
                      rows={3}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0d1c38] md:col-span-2"
                    />

                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 md:col-span-2">
                      <p className="text-sm font-black text-[#0d1c38]">Private verification document uploads</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Staff-only files. Upload owner ID, CAC certificate, and mandate/authorization letter. These files are stored in a private Supabase bucket and opened with temporary signed links only.
                      </p>

                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        {[
                          {
                            label: "Owner/agent ID document",
                            url: editForm.identityDocumentUrl,
                            file: editIdentityDocumentFile,
                            setFile: setEditIdentityDocumentFile,
                            openLabel: "owner/agent ID document",
                          },
                          {
                            label: "CAC/company document",
                            url: editForm.cacDocumentUrl,
                            file: editCacDocumentFile,
                            setFile: setEditCacDocumentFile,
                            openLabel: "CAC/company document",
                          },
                          {
                            label: "Mandate/authorization letter",
                            url: editForm.mandateDocumentUrl,
                            file: editMandateDocumentFile,
                            setFile: setEditMandateDocumentFile,
                            openLabel: "mandate/authorization letter",
                          },
                        ].map((item) => (
                          <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                              {item.label}
                            </label>
                            <input
                              type="file"
                              accept="application/pdf,image/jpeg,image/png,image/webp"
                              onChange={(event) => item.setFile(event.target.files?.[0] || null)}
                              disabled={!canOpenDocuments}
                              className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none focus:border-[#0d1c38] disabled:cursor-not-allowed disabled:opacity-60"
                            />
                            <p className="mt-2 text-xs font-bold text-slate-500">
                              {item.file ? `Selected: ${item.file.name}` : item.url ? "Uploaded" : "Not uploaded"}
                            </p>
                            {item.url && (
                              <button
                                type="button"
                                onClick={() => openSecureVerificationDocument(item.url, item.openLabel)}
                                disabled={!canOpenDocuments}
                                className="mt-3 rounded-full bg-[#0d1c38] px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {canOpenDocuments ? "Open secure file" : "Locked"}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs font-bold text-slate-500">
                    Public contact setting: {editForm.publicContactVisibility}. Staff can always see the full contact profile.
                  </p>
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
                <input
                  type="text"
                  value={publicFormBotTrap.investor_requests}
                  onChange={(event) => setPublicFormBotTrap({ ...publicFormBotTrap, investor_requests: event.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />
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

                <button
                  disabled={publicSubmittingForm === "investor_requests"}
                  className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {publicSubmittingForm === "investor_requests" ? "Sending request..." : "Save investor request"}
                </button>
              </form>
            )}

            {modal === "details" && selectedListing && (
              <div>
                <div className="relative h-80 overflow-hidden rounded-[26px] bg-[#0d1c38]">
                  {getListingGalleryImages(selectedListing)[0] ? (
                    <img
                      src={getListingGalleryImages(selectedListing)[0]}
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
                    <div className="mb-3 inline-flex w-fit rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-white backdrop-blur">
                      Ref {buildListingReference(selectedListing.id)}
                    </div>

                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f0bf3c]">
                      INAMAAD verified asset
                    </p>

                    <h3 className="mt-3 text-4xl font-black">
                      {selectedListing.title}
                    </h3>

                    <p className="mt-3 text-lg text-slate-200">
                      {buildPublicLocationText(selectedListing)}
                    </p>
                    <div className={`mt-4 w-fit rounded-full px-4 py-2 text-xs font-black ${availabilityBadgeClass(selectedListing.availabilityStatus)}`}>
                      {selectedListing.availabilityStatus || "Available"}
                    </div>
                  </div>
                </div>

                {getListingGalleryImages(selectedListing).length > 1 && (
                  <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-black text-[#0d1c38]">Property photo gallery</p>
                      <p className="text-xs font-bold text-slate-500">
                        {getListingGalleryImages(selectedListing).length} photos
                      </p>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {getListingGalleryImages(selectedListing).map((imageUrl, index) => (
                        <a
                          key={`${imageUrl}-${index}`}
                          href={imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group block overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                        >
                          <img
                            src={imageUrl}
                            alt={`${selectedListing.title} photo ${index + 1}`}
                            className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 grid gap-5 md:grid-cols-[1fr_260px]">
                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      {buildPublicLocationText(selectedListing)}
                    </p>

                    <p className="mt-3 text-3xl font-black text-[#0d1c38]">
                      {selectedListing.price}
                    </p>

                    {hasPriceBreakdown(selectedListing) && (
                      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-slate-700">
                        <p className="font-black text-[#0d1c38]">Price breakdown</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {selectedListing.agencyFee ? <p><span className="font-black">Agency fee:</span> {selectedListing.agencyFee}</p> : null}
                          {selectedListing.legalFee ? <p><span className="font-black">Legal / documentation:</span> {selectedListing.legalFee}</p> : null}
                          {selectedListing.serviceCharge ? <p><span className="font-black">Service charge:</span> {selectedListing.serviceCharge}</p> : null}
                          {selectedListing.cautionFee ? <p><span className="font-black">Caution fee:</span> {selectedListing.cautionFee}</p> : null}
                          {selectedListing.surveyFee ? <p><span className="font-black">Survey fee:</span> {selectedListing.surveyFee}</p> : null}
                          {selectedListing.developmentFee ? <p><span className="font-black">Development fee:</span> {selectedListing.developmentFee}</p> : null}
                        </div>
                        <div className="mt-4 rounded-2xl bg-white p-4">
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Total estimated cost</p>
                          <p className="mt-1 text-2xl font-black text-[#0d1c38]">
                            {selectedListing.totalEstimatedCost || calculateTotalEstimatedCost(selectedListing)}
                          </p>
                        </div>
                        {selectedListing.paymentPlanAvailable ? (
                          <div className="mt-4 rounded-2xl bg-[#0d1c38] p-4 text-white">
                            <p className="font-black text-[#f0bf3c]">Payment plan available</p>
                            {selectedListing.installmentDetails ? <p className="mt-2 text-sm leading-6 text-slate-200">{selectedListing.installmentDetails}</p> : null}
                          </div>
                        ) : null}
                      </div>
                    )}

                    <p className="mt-4 text-base leading-8 text-slate-600">
                      {selectedListing.description}
                    </p>

                    <div className="mt-5 rounded-2xl bg-[#f7f8fb] p-5 font-bold text-slate-700">
                      {selectedListing.yieldText}
                    </div>

                    {(selectedListing.stateName || selectedListing.cityArea || selectedListing.fullAddress || selectedListing.nearbyLandmark || selectedListing.googleMapLink) && (
                      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
                        <p className="font-black text-[#0d1c38]">Location details</p>
                        <p className="mt-2"><span className="font-black">Area:</span> {buildPublicLocationText(selectedListing)}</p>
                        {selectedListing.nearbyLandmark ? <p><span className="font-black">Nearby landmark:</span> {selectedListing.nearbyLandmark}</p> : null}
                        {selectedListing.showExactAddress && selectedListing.fullAddress ? (
                          <p><span className="font-black">Exact address:</span> {selectedListing.fullAddress}</p>
                        ) : (
                          <p className="text-slate-500">Exact address is hidden until staff confirms access.</p>
                        )}
                        {selectedListing.showExactAddress && selectedListing.googleMapLink ? (
                          <a
                            href={selectedListing.googleMapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex rounded-full bg-[#0d1c38] px-4 py-2 text-xs font-black text-white"
                          >
                            Open Google Maps
                          </a>
                        ) : null}
                      </div>
                    )}

                    {selectedListing.showVideoPublicly !== false && (selectedListing.videoUrl || selectedListing.virtualTourUrl || selectedListing.droneVideoUrl) && (
                      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
                        <p className="font-black text-[#0d1c38]">Video and virtual tour</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          {selectedListing.videoUrl ? (
                            <a
                              href={selectedListing.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full bg-[#0d1c38] px-4 py-2 text-xs font-black text-white"
                            >
                              Watch property video
                            </a>
                          ) : null}
                          {selectedListing.virtualTourUrl ? (
                            <a
                              href={selectedListing.virtualTourUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full bg-[#f0bf3c] px-4 py-2 text-xs font-black text-[#0d1c38]"
                            >
                              Open virtual tour
                            </a>
                          ) : null}
                          {selectedListing.droneVideoUrl ? (
                            <a
                              href={selectedListing.droneVideoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-[#0d1c38]"
                            >
                              Watch drone video
                            </a>
                          ) : null}
                        </div>
                      </div>
                    )}

                    {isJointVentureListing(selectedListing) ? (
                      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                        <p className="font-black text-[#0d1c38]">Joint venture project profile</p>
                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                          {selectedListing.jvStructure ? <p><span className="font-black">JV structure:</span> {selectedListing.jvStructure}</p> : null}
                          {selectedListing.jvProjectStage ? <p><span className="font-black">Project stage:</span> {selectedListing.jvProjectStage}</p> : null}
                          {selectedListing.landSize ? <p><span className="font-black">Land size:</span> {selectedListing.landSize}</p> : null}
                          {selectedListing.jvExpectedUnits ? <p><span className="font-black">Expected units:</span> {selectedListing.jvExpectedUnits}</p> : null}
                          {selectedListing.jvEstimatedProjectCost ? <p><span className="font-black">Estimated project cost:</span> {selectedListing.jvEstimatedProjectCost}</p> : null}
                          {selectedListing.jvCompletionTimeline ? <p><span className="font-black">Timeline:</span> {selectedListing.jvCompletionTimeline}</p> : null}
                        </div>
                        {selectedListing.jvLandContribution ? <p className="mt-4 text-sm leading-6 text-slate-600"><span className="font-black text-[#0d1c38]">Landowner contribution:</span> {selectedListing.jvLandContribution}</p> : null}
                        {selectedListing.jvDeveloperRequirement ? <p className="mt-3 text-sm leading-6 text-slate-600"><span className="font-black text-[#0d1c38]">Developer requirement:</span> {selectedListing.jvDeveloperRequirement}</p> : null}
                        {selectedListing.jvInvestorRequirement ? <p className="mt-3 text-sm leading-6 text-slate-600"><span className="font-black text-[#0d1c38]">Investor requirement:</span> {selectedListing.jvInvestorRequirement}</p> : null}
                        {selectedListing.jvSharingFormula ? <p className="mt-3 text-sm leading-6 text-slate-600"><span className="font-black text-[#0d1c38]">Sharing formula:</span> {selectedListing.jvSharingFormula}</p> : null}
                        {selectedListing.jvTerms ? <p className="mt-3 text-sm leading-6 text-slate-600"><span className="font-black text-[#0d1c38]">JV terms:</span> {selectedListing.jvTerms}</p> : null}

                        <div className="mt-4 rounded-2xl bg-white p-4">
                          <p className="text-sm font-black text-[#0d1c38]">JV due diligence status</p>
                          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                            <p><span className="font-black">Land title review:</span> {selectedListing.jvLandTitleStatus || "Not Reviewed"}</p>
                            <p><span className="font-black">Development approval:</span> {selectedListing.jvDevelopmentApprovalStatus || "Not Reviewed"}</p>
                            <p><span className="font-black">JV deal status:</span> {selectedListing.jvDealStatus || "New JV"}</p>
                            {selectedListing.jvNextActionDate && (<p><span className="font-black">Next review:</span> {formatDate(selectedListing.jvNextActionDate)}</p>)}
                          </div>
                          <p className="mt-3 text-xs leading-5 text-slate-500">Private JV documents are reviewed by INAMAAD staff and are not displayed publicly.</p>
                        </div>
                      </div>
                    ) : (selectedListing.bedrooms || selectedListing.bathrooms || selectedListing.toilets || selectedListing.parkingSpaces || selectedListing.landSize || selectedListing.propertySize || selectedListing.furnishingStatus || selectedListing.propertyCondition || selectedListing.amenities) && (
                      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                        <p className="font-black text-[#0d1c38]">Property specifications</p>
                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                          {selectedListing.bedrooms ? <p><span className="font-black">Bedrooms:</span> {selectedListing.bedrooms}</p> : null}
                          {selectedListing.bathrooms ? <p><span className="font-black">Bathrooms:</span> {selectedListing.bathrooms}</p> : null}
                          {selectedListing.toilets ? <p><span className="font-black">Toilets:</span> {selectedListing.toilets}</p> : null}
                          {selectedListing.parkingSpaces ? <p><span className="font-black">Parking:</span> {selectedListing.parkingSpaces} spaces</p> : null}
                          {selectedListing.landSize ? <p><span className="font-black">Land size:</span> {selectedListing.landSize}</p> : null}
                          {selectedListing.propertySize ? <p><span className="font-black">Built-up size:</span> {selectedListing.propertySize}</p> : null}
                          {selectedListing.furnishingStatus && selectedListing.furnishingStatus !== "Not Specified" ? <p><span className="font-black">Furnishing:</span> {selectedListing.furnishingStatus}</p> : null}
                          {selectedListing.propertyCondition && selectedListing.propertyCondition !== "Not Specified" ? <p><span className="font-black">Condition:</span> {selectedListing.propertyCondition}</p> : null}
                        </div>
                        {selectedListing.amenities && (
                          <p className="mt-4 text-sm leading-6 text-slate-600"><span className="font-black text-[#0d1c38]">Amenities:</span> {selectedListing.amenities}</p>
                        )}
                      </div>
                    )}

                    {(selectedListing.neighborhoodOverview || selectedListing.roadAccess || selectedListing.powerSupply || selectedListing.waterSupply || selectedListing.securityFeatures || selectedListing.nearbySchools || selectedListing.nearbyHospitals || selectedListing.nearbyMalls || selectedListing.nearbyTransport || selectedListing.distanceToMajorRoad || selectedListing.estateFeatures) && (
                      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                        <p className="font-black text-[#0d1c38]">Neighborhood and infrastructure</p>
                        {selectedListing.neighborhoodOverview && (
                          <p className="mt-3 text-sm leading-6 text-slate-600">{selectedListing.neighborhoodOverview}</p>
                        )}
                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                          {selectedListing.roadAccess ? <p><span className="font-black">Road access:</span> {selectedListing.roadAccess}</p> : null}
                          {selectedListing.distanceToMajorRoad ? <p><span className="font-black">Major road:</span> {selectedListing.distanceToMajorRoad}</p> : null}
                          {selectedListing.powerSupply ? <p><span className="font-black">Power supply:</span> {selectedListing.powerSupply}</p> : null}
                          {selectedListing.waterSupply ? <p><span className="font-black">Water supply:</span> {selectedListing.waterSupply}</p> : null}
                          {selectedListing.securityFeatures ? <p><span className="font-black">Security:</span> {selectedListing.securityFeatures}</p> : null}
                          {selectedListing.estateFeatures ? <p><span className="font-black">Estate features:</span> {selectedListing.estateFeatures}</p> : null}
                          {selectedListing.nearbySchools ? <p><span className="font-black">Schools:</span> {selectedListing.nearbySchools}</p> : null}
                          {selectedListing.nearbyHospitals ? <p><span className="font-black">Hospitals:</span> {selectedListing.nearbyHospitals}</p> : null}
                          {selectedListing.nearbyMalls ? <p><span className="font-black">Malls / markets:</span> {selectedListing.nearbyMalls}</p> : null}
                          {selectedListing.nearbyTransport ? <p><span className="font-black">Transport:</span> {selectedListing.nearbyTransport}</p> : null}
                        </div>
                      </div>
                    )}

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

                    {(selectedListing.ownerName || selectedListing.companyName || selectedListing.contactRole || selectedListing.contactEmail || selectedListing.ownerPhone || selectedListing.contactWhatsapp) && (
                      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
                        <p className="font-black text-[#0d1c38]">Owner / agent / developer profile</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <p><span className="font-black">Role:</span> {selectedListing.contactRole || "Owner"}</p>
                          <p><span className="font-black">Mandate:</span> {selectedListing.mandateStatus || "Not Confirmed"}</p>
                          <p><span className="font-black">Profile verification:</span> {selectedListing.contactProfileVerified ? "Verified" : "Not verified yet"}</p>
                          <p><span className="font-black">Mandate document:</span> {selectedListing.mandateDocumentStatus || "Not Provided"}</p>
                          <p><span className="font-black">Name:</span> {getListingContactName(selectedListing)}</p>
                          {selectedListing.companyName ? <p><span className="font-black">Company:</span> {selectedListing.companyName}</p> : null}
                        </div>

                        {selectedListing.publicContactVisibility === "Hide Phone" || !selectedListing.publicContactVisibility ? (
                          <div className="mt-4 rounded-2xl bg-[#f7f8fb] p-4 text-xs font-bold text-slate-600">
                            Direct contact is hidden. Use Request Access, Make Offer, or Book Inspection so INAMAAD can qualify and protect the lead.
                          </div>
                        ) : (
                          <div className="mt-4 flex flex-wrap gap-3">
                            {canShowPublicPhone(selectedListing) && selectedListing.ownerPhone ? (
                              <a href={`tel:${cleanPhoneForLink(selectedListing.ownerPhone)}`} className="rounded-full bg-[#0d1c38] px-4 py-2 text-xs font-black text-white">
                                Call contact
                              </a>
                            ) : null}
                            {canShowPublicWhatsapp(selectedListing) && (selectedListing.contactWhatsapp || selectedListing.ownerPhone) ? (
                              <a
                                href={`https://wa.me/${normalizeNigeriaWhatsApp(selectedListing.contactWhatsapp || selectedListing.ownerPhone)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white"
                              >
                                WhatsApp contact
                              </a>
                            ) : null}
                            {canShowPublicEmail(selectedListing) && selectedListing.contactEmail ? (
                              <a href={`mailto:${selectedListing.contactEmail}`} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-[#0d1c38]">
                                Email contact
                              </a>
                            ) : null}
                          </div>
                        )}

                        {selectedListing.publicContactVisibility === "Show All" && selectedListing.contactAddress ? (
                          <p className="mt-4 text-sm text-slate-600"><span className="font-black text-[#0d1c38]">Office/address:</span> {selectedListing.contactAddress}</p>
                        ) : null}
                      </div>
                    )}
                  </div>

                  <div className="rounded-[24px] bg-[#0d1c38] p-5 text-white">
                    <p className="text-sm font-black text-[#f0bf3c]">
                      Deal summary
                    </p>

                    <div className="mt-5 grid gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Reference</p>
                        <p className="font-black text-[#f0bf3c]">{buildListingReference(selectedListing.id)}</p>
                      </div>

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
                        <p className="text-slate-400">Contact role</p>
                        <p className="font-black">
                          {selectedListing.contactRole || "Owner"}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {selectedListing.mandateStatus || "Not Confirmed"}
                        </p>
                      </div>

                      {hasPriceBreakdown(selectedListing) && (
                        <div>
                          <p className="text-slate-400">Estimated total cost</p>
                          <p className="font-black text-[#f0bf3c]">
                            {selectedListing.totalEstimatedCost || calculateTotalEstimatedCost(selectedListing)}
                          </p>
                        </div>
                      )}


                      {(selectedListing.videoUrl || selectedListing.virtualTourUrl || selectedListing.droneVideoUrl) && (
                        <div>
                          <p className="text-slate-400">Media</p>
                          <p className="font-black">
                            {[selectedListing.videoUrl ? "Video" : "", selectedListing.virtualTourUrl ? "Virtual tour" : "", selectedListing.droneVideoUrl ? "Drone" : ""].filter(Boolean).join("  -  ")}
                          </p>
                        </div>
                      )}

                      {(selectedListing.bedrooms || selectedListing.bathrooms || selectedListing.landSize) && (
                        <div>
                          <p className="text-slate-400">Specs</p>
                          <p className="font-black">
                            {[selectedListing.bedrooms ? `${selectedListing.bedrooms} bed` : "", selectedListing.bathrooms ? `${selectedListing.bathrooms} bath` : "", selectedListing.landSize || ""].filter(Boolean).join("  -  ")}
                          </p>
                        </div>
                      )}

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
                        <p className="text-slate-400">Approval status</p>
                        <p className="font-black text-emerald-300">
                          {selectedListing.status}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400">Availability</p>
                        <p className="font-black text-[#f0bf3c]">
                          {selectedListing.availabilityStatus || "Available"}
                        </p>
                        {selectedListing.availableFrom && (
                          <p className="mt-1 text-xs text-slate-400">
                            Available from {formatDate(selectedListing.availableFrom)}
                          </p>
                        )}
                        {selectedListing.availabilityNote && (
                          <p className="mt-1 text-xs text-slate-400">
                            {selectedListing.availabilityNote}
                          </p>
                        )}
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

                {selectedListing && isJointVentureListing(selectedListing) && (
                  <form
                    onSubmit={submitJvApplication}
                    className="mt-6 grid gap-4 rounded-[24px] border border-purple-200 bg-purple-50 p-6"
                  >
                    <input
                      type="text"
                      value={publicFormBotTrap.jv_applications}
                      onChange={(event) => setPublicFormBotTrap({ ...publicFormBotTrap, jv_applications: event.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                    />
                    <div>
                      <p className="text-xl font-black text-[#0d1c38]">
                        Apply for JV partnership
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        Submit a professional JV interest as a developer, investor, financier, landowner, construction partner, or marketing partner.
                      </p>
                    </div>

                    <input
                      required
                      value={jvApplicationForm.applicantName}
                      onChange={(event) =>
                        setJvApplicationForm({ ...jvApplicationForm, applicantName: event.target.value })
                      }
                      placeholder="Applicant name"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        value={jvApplicationForm.applicantEmail}
                        onChange={(event) =>
                          setJvApplicationForm({ ...jvApplicationForm, applicantEmail: event.target.value })
                        }
                        type="email"
                        placeholder="Email address optional"
                        className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />

                      <input
                        required
                        value={jvApplicationForm.applicantPhone}
                        onChange={(event) =>
                          setJvApplicationForm({ ...jvApplicationForm, applicantPhone: event.target.value })
                        }
                        placeholder="Phone or WhatsApp number"
                        className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <select
                        value={jvApplicationForm.applicantRole}
                        onChange={(event) =>
                          setJvApplicationForm({ ...jvApplicationForm, applicantRole: event.target.value })
                        }
                        className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      >
                        <option>Developer</option>
                        <option>Investor</option>
                        <option>Landowner</option>
                        <option>Financier</option>
                        <option>Construction Partner</option>
                        <option>Marketing Partner</option>
                        <option>Other</option>
                      </select>

                      <input
                        value={jvApplicationForm.companyName}
                        onChange={(event) =>
                          setJvApplicationForm({ ...jvApplicationForm, companyName: event.target.value })
                        }
                        placeholder="Company name optional"
                        className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                      />
                    </div>

                    <input
                      value={jvApplicationForm.budgetCapacity}
                      onChange={(event) =>
                        setJvApplicationForm({ ...jvApplicationForm, budgetCapacity: formatPriceInput(event.target.value) || event.target.value })
                      }
                      placeholder="Budget / funding capacity e.g. ₦500,000,000"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <textarea
                      value={jvApplicationForm.experienceSummary}
                      onChange={(event) =>
                        setJvApplicationForm({ ...jvApplicationForm, experienceSummary: event.target.value })
                      }
                      placeholder="Experience summary e.g. Completed 24-unit terrace project in Abuja, handled approvals and construction finance."
                      rows={3}
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <textarea
                      value={jvApplicationForm.proposalMessage}
                      onChange={(event) =>
                        setJvApplicationForm({ ...jvApplicationForm, proposalMessage: event.target.value })
                      }
                      placeholder="Proposal message: what you can contribute, preferred sharing formula, timeline, or partnership terms."
                      rows={4}
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <div className="rounded-3xl border border-purple-100 bg-purple-50/60 p-5">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-700">
                        Supporting documents optional
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Upload documents that help INAMAAD evaluate your JV capacity. Accepted: PDF, JPG, PNG, WEBP. Max 20MB each. These files are private and staff-only.
                      </p>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <label className="block rounded-2xl border border-slate-200 bg-white p-4">
                          <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Company profile</span>
                          <input
                            type="file"
                            accept="application/pdf,image/jpeg,image/png,image/webp"
                            onChange={(event) => setJvCompanyProfileFile(event.target.files?.[0] || null)}
                            className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:text-xs file:font-black file:text-purple-700"
                          />
                        </label>

                        <label className="block rounded-2xl border border-slate-200 bg-white p-4">
                          <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">CAC certificate</span>
                          <input
                            type="file"
                            accept="application/pdf,image/jpeg,image/png,image/webp"
                            onChange={(event) => setJvCacCertificateFile(event.target.files?.[0] || null)}
                            className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:text-xs file:font-black file:text-purple-700"
                          />
                        </label>

                        <label className="block rounded-2xl border border-slate-200 bg-white p-4">
                          <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Portfolio / past projects</span>
                          <input
                            type="file"
                            accept="application/pdf,image/jpeg,image/png,image/webp"
                            onChange={(event) => setJvPortfolioFile(event.target.files?.[0] || null)}
                            className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:text-xs file:font-black file:text-purple-700"
                          />
                        </label>

                        <label className="block rounded-2xl border border-slate-200 bg-white p-4">
                          <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Financial proof</span>
                          <input
                            type="file"
                            accept="application/pdf,image/jpeg,image/png,image/webp"
                            onChange={(event) => setJvFinancialProofFile(event.target.files?.[0] || null)}
                            className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:text-xs file:font-black file:text-purple-700"
                          />
                        </label>

                        <label className="block rounded-2xl border border-slate-200 bg-white p-4">
                          <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">JV proposal document</span>
                          <input
                            type="file"
                            accept="application/pdf,image/jpeg,image/png,image/webp"
                            onChange={(event) => setJvProposalDocumentFile(event.target.files?.[0] || null)}
                            className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:text-xs file:font-black file:text-purple-700"
                          />
                        </label>

                        <label className="block rounded-2xl border border-slate-200 bg-white p-4">
                          <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Other supporting file</span>
                          <input
                            type="file"
                            accept="application/pdf,image/jpeg,image/png,image/webp"
                            onChange={(event) => setJvOtherDocumentFile(event.target.files?.[0] || null)}
                            className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:text-xs file:font-black file:text-purple-700"
                          />
                        </label>
                      </div>
                    </div>

                    <button
                      disabled={publicSubmittingForm === "jv_applications"}
                      className="rounded-2xl bg-purple-700 px-6 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {publicSubmittingForm === "jv_applications" ? "Submitting JV application..." : "Submit JV partnership application"}
                    </button>
                  </form>
                )}

                <form
                  onSubmit={submitPropertyInquiry}
                  className="mt-6 grid gap-4 rounded-[24px] border border-slate-200 bg-white p-6"
                >
                  <input
                    type="text"
                    value={publicFormBotTrap.property_inquiries}
                    onChange={(event) => setPublicFormBotTrap({ ...publicFormBotTrap, property_inquiries: event.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />
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

                  <button
                    disabled={publicSubmittingForm === "property_inquiries"}
                    className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {publicSubmittingForm === "property_inquiries" ? "Sending inquiry..." : "Send property inquiry"}
                  </button>
                </form>

                <form
                  onSubmit={submitInspectionBooking}
                  className="mt-6 grid gap-4 rounded-[24px] border border-[#f0bf3c]/40 bg-[#fffaf0] p-6"
                >
                  <input
                    type="text"
                    value={publicFormBotTrap.inspection_bookings}
                    onChange={(event) => setPublicFormBotTrap({ ...publicFormBotTrap, inspection_bookings: event.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />
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

                  <button
                    disabled={publicSubmittingForm === "inspection_bookings"}
                    className="rounded-2xl bg-[#f0bf3c] px-6 py-4 text-sm font-black text-[#0d1c38] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {publicSubmittingForm === "inspection_bookings" ? "Booking inspection..." : "Book inspection"}
                  </button>
                </form>

                <form
                  onSubmit={submitPropertyOffer}
                  className="mt-6 grid gap-4 rounded-[24px] border border-emerald-200 bg-emerald-50 p-6"
                >
                  <input
                    type="text"
                    value={publicFormBotTrap.property_offers}
                    onChange={(event) => setPublicFormBotTrap({ ...publicFormBotTrap, property_offers: event.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />
                  <div>
                    <p className="text-xl font-black text-[#0d1c38]">
                      Make offer / reserve property
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Send a serious offer or reservation request for this listing. INAMAAD staff will review it before any commitment.
                    </p>
                  </div>

                  <input
                    required
                    value={offerForm.buyerName}
                    onChange={(event) =>
                      setOfferForm({ ...offerForm, buyerName: event.target.value })
                    }
                    placeholder="Buyer name"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={offerForm.buyerEmail}
                      onChange={(event) =>
                        setOfferForm({ ...offerForm, buyerEmail: event.target.value })
                      }
                      type="email"
                      placeholder="Email address optional"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <input
                      required
                      value={offerForm.buyerPhone}
                      onChange={(event) =>
                        setOfferForm({ ...offerForm, buyerPhone: event.target.value })
                      }
                      placeholder="Phone or WhatsApp number"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={offerForm.offerAmount}
                      onChange={(event) =>
                        setOfferForm({
                          ...offerForm,
                          offerAmount: formatPriceInput(event.target.value),
                        })
                      }
                      placeholder="Offer amount e.g. ₦150,000,000"
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    />

                    <select
                      value={offerForm.paymentPlan}
                      onChange={(event) =>
                        setOfferForm({ ...offerForm, paymentPlan: event.target.value })
                      }
                      className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                    >
                      <option>Full payment</option>
                      <option>Installment payment</option>
                      <option>Reservation deposit</option>
                      <option>Mortgage / bank finance</option>
                      <option>Joint venture proposal</option>
                      <option>Negotiable</option>
                    </select>
                  </div>

                  <textarea
                    value={offerForm.message}
                    onChange={(event) =>
                      setOfferForm({ ...offerForm, message: event.target.value })
                    }
                    placeholder="Offer terms, reservation timeline, payment plan, or special condition"
                    rows={3}
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                  />

                  <button
                    disabled={publicSubmittingForm === "property_offers"}
                    className="rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {publicSubmittingForm === "property_offers" ? "Submitting offer..." : "Submit offer / reserve interest"}
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

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d49613]">
                        Phase 1 launch foundation
                      </p>
                      <h3 className="mt-2 text-xl font-black text-[#0d1c38]">
                        Stability checklist
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Admin-only launch check for browsing, uploads, approval flow, contact channels, data mode, and lead capture. No payments or monetization added.
                      </p>
                    </div>

                    <div className={`rounded-2xl px-5 py-3 text-center ${launchFoundationScore >= 85 ? "bg-emerald-50 text-emerald-700" : launchFoundationScore >= 65 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                      <p className="text-2xl font-black">{launchFoundationScore}%</p>
                      <p className="text-[10px] font-black uppercase tracking-wide">Ready</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {launchFoundationChecks.map((check) => (
                      <div
                        key={check.label}
                        className={`rounded-2xl border p-4 ${check.passed ? "border-emerald-100 bg-emerald-50" : "border-amber-100 bg-amber-50"}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${check.passed ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}`}>
                            {check.passed ? "Ã¢Å“â€œ" : "!"}
                          </span>
                          <div>
                            <p className="text-sm font-black text-[#0d1c38]">{check.label}</p>
                            <p className="mt-1 text-xs leading-5 text-slate-600">{check.detail}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {failedLaunchFoundationChecks.length > 0 ? (
                    <p className="mt-4 rounded-2xl bg-[#fff7df] p-4 text-sm font-semibold leading-6 text-[#9b6b16]">
                      Next Phase 1 action: {failedLaunchFoundationChecks[0].label} Ã¢â‚¬â€ {failedLaunchFoundationChecks[0].detail}
                    </p>
                  ) : (
                    <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-700">
                      Phase 1 foundation looks ready. Keep testing uploads, property details, and admin approval before moving to Phase 2.
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-10">
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
                      {propertyOffers.length}
                    </p>
                    <p className="text-sm text-slate-500">Property offers</p>
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
                        Lead command center
                      </p>
                      <h3 className="mt-2 text-xl font-black text-[#0d1c38]">
                        Follow-up dashboard
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Track overdue buyers, today's follow-ups, urgent leads, and unassigned opportunities in one place.
                      </p>
                    </div>

                    <div className="rounded-full bg-[#0d1c38] px-5 py-2 text-xs font-black text-white">
                      {leadFollowUpItems.length} active leads
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-4">
                    <div className="rounded-2xl bg-red-50 p-5">
                      <p className="text-2xl font-black text-red-700">{overdueFollowUps.length}</p>
                      <p className="text-sm font-bold text-red-600">Overdue follow-ups</p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-5">
                      <p className="text-2xl font-black text-amber-700">{todayFollowUps.length}</p>
                      <p className="text-sm font-bold text-amber-600">Due today</p>
                    </div>
                    <div className="rounded-2xl bg-orange-50 p-5">
                      <p className="text-2xl font-black text-orange-700">{urgentFollowUps.length}</p>
                      <p className="text-sm font-bold text-orange-600">High / urgent</p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 p-5">
                      <p className="text-2xl font-black text-[#0d1c38]">{unassignedLeads.length}</p>
                      <p className="text-sm font-bold text-slate-500">Unassigned</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-5">
                      <h4 className="font-black text-[#0d1c38]">Needs attention now</h4>
                      <div className="mt-4 grid gap-3">
                        {[...overdueFollowUps, ...todayFollowUps].slice(0, 8).length === 0 && (
                          <p className="rounded-2xl bg-[#f7f8fb] p-4 text-sm text-slate-500">
                            No overdue or due-today follow-ups. Good work.
                          </p>
                        )}

                        {[...overdueFollowUps, ...todayFollowUps].slice(0, 8).map((item) => (
                          <div key={`${item.kind}-${item.id}`} className="rounded-2xl bg-[#f7f8fb] p-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-[#d49613]">
                                {item.source}
                              </span>
                              <span className={`rounded-full px-3 py-1 text-[11px] font-black ${item.priority === "Urgent" ? "bg-red-100 text-red-700" : item.priority === "High" ? "bg-orange-100 text-orange-700" : "bg-slate-200 text-slate-600"}`}>
                                {item.priority}
                              </span>
                              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-slate-500">
                                {item.followUpDate < todayKey ? "Overdue" : "Today"}
                              </span>
                            </div>
                            <p className="mt-3 font-black text-[#0d1c38]">{item.name}</p>
                            <p className="mt-1 text-sm text-slate-500">{item.title}</p>
                            <p className="mt-2 text-xs font-bold text-slate-400">
                              Follow-up: {formatDate(item.followUpDate)}  -  Assigned: {getAssignedStaffLabel(item.assignedToEmail)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-5">
                      <h4 className="font-black text-[#0d1c38]">Next scheduled follow-ups</h4>
                      <div className="mt-4 grid gap-3">
                        {nextFollowUps.slice(0, 8).length === 0 && (
                          <p className="rounded-2xl bg-[#f7f8fb] p-4 text-sm text-slate-500">
                            No upcoming follow-up dates yet. Set follow-up dates inside each lead.
                          </p>
                        )}

                        {nextFollowUps.slice(0, 8).map((item) => (
                          <div key={`${item.kind}-${item.id}`} className="rounded-2xl bg-[#f7f8fb] p-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-[#d49613]">
                                {item.source}
                              </span>
                              <span className={`rounded-full px-3 py-1 text-[11px] font-black ${item.priority === "Urgent" ? "bg-red-100 text-red-700" : item.priority === "High" ? "bg-orange-100 text-orange-700" : "bg-slate-200 text-slate-600"}`}>
                                {item.priority}
                              </span>
                            </div>
                            <p className="mt-3 font-black text-[#0d1c38]">{item.name}</p>
                            <p className="mt-1 text-sm text-slate-500">{item.title}</p>
                            <p className="mt-2 text-xs font-bold text-slate-400">
                              Follow-up: {formatDate(item.followUpDate)}  -  Assigned: {getAssignedStaffLabel(item.assignedToEmail)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
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
                              {log.targetId ? `  -  ID: ${log.targetId}` : ""}
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
                        Investor requests + property inquiries + offers + contact messages + inspection bookings
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
                      <p className="text-sm text-slate-300">Property offers</p>
                      <p className="mt-2 text-3xl font-black">
                        {propertyOffers.length}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Serious offer and reservation requests
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
                          <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#d49613]">
                            {buildListingReference(listing.id)}
                          </p>
                          <p className="mt-1 font-black text-[#0d1c38]">
                            {listing.title}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {listing.location}  -  {listing.price}
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
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d49613]">
                              {buildListingReference(listing.id)}
                            </p>

                            <p className="mt-1 font-black text-[#0d1c38]">
                              {listing.title}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {listing.location}  -  {listing.price}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                              {listing.contactRole || "Owner"}: {listing.companyName || listing.ownerName || "Not provided"}  - {" "}
                              {listing.ownerPhone || listing.contactWhatsapp || "No phone"}  -  {listing.mandateStatus || "Not Confirmed"}
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
                                {inquiry.email || "No email"}  -  {inquiry.phone}
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
                                inquiry.staffNotes,
                                inquiry.priority || "Normal",
                                inquiry.followUpDate || "",
                                inquiry.lastContactedAt || ""
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
                    JV partnership applications
                  </h3>

                  <div className="mt-4 grid gap-4">
                    {jvApplications.length === 0 && (
                      <p className="rounded-2xl bg-[#f7f8fb] p-5 text-sm text-slate-500">
                        No JV partnership applications yet.
                      </p>
                    )}

                    {jvApplications.map((application) => {
                      const applicationStatus = application.status || "New";
                      const jvWhatsAppMessage = `Hello ${application.applicantName}, this is INAMAAD Real Estate. We received your JV partnership application for ${application.listingTitle}.`;

                      return (
                        <div key={application.id} className="rounded-2xl border border-purple-200 bg-purple-50/40 p-5">
                          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-700">
                                  {application.listingTitle}
                                </p>

                                <span className={`rounded-full px-3 py-1 text-[11px] font-black ${jvApplicationStatusClass(applicationStatus)}`}>
                                  {applicationStatus}
                                </span>
                              </div>

                              <p className="mt-2 font-black text-[#0d1c38]">
                                {application.applicantName}  -  {application.applicantRole}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {application.companyName || "No company stated"}  -  {application.applicantEmail || "No email"}  -  {application.applicantPhone}
                              </p>

                              {application.budgetCapacity && (
                                <p className="mt-1 text-sm font-bold text-slate-600">
                                  Budget / capacity: {application.budgetCapacity}
                                </p>
                              )}

                              {application.experienceSummary && (
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                  <span className="font-black text-[#0d1c38]">Experience:</span> {application.experienceSummary}
                                </p>
                              )}

                              {application.proposalMessage && (
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                  <span className="font-black text-[#0d1c38]">Proposal:</span> {application.proposalMessage}
                                </p>
                              )}

                              <p className="mt-2 text-xs font-bold text-slate-400">
                                Submitted {formatDate(application.createdAt)}
                              </p>

                              <div className="mt-4 rounded-2xl border border-purple-100 bg-white p-4">
                                <p className="text-xs font-black uppercase tracking-[0.16em] text-purple-700">
                                  JV applicant supporting documents
                                </p>
                                <p className="mt-1 text-xs font-bold text-slate-500">
                                  Private staff-only files uploaded by the applicant. Use them for due diligence before shortlisting.
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  <button
                                    onClick={() => openSecureJvApplicationDocument(application.companyProfileUrl, "company profile")}
                                    disabled={!application.companyProfileUrl || !canManageLeads}
                                    className="rounded-full bg-purple-100 px-4 py-2 text-xs font-black text-purple-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                                  >
                                    Company profile
                                  </button>
                                  <button
                                    onClick={() => openSecureJvApplicationDocument(application.cacCertificateUrl, "CAC certificate")}
                                    disabled={!application.cacCertificateUrl || !canManageLeads}
                                    className="rounded-full bg-purple-100 px-4 py-2 text-xs font-black text-purple-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                                  >
                                    CAC certificate
                                  </button>
                                  <button
                                    onClick={() => openSecureJvApplicationDocument(application.portfolioUrl, "portfolio / past projects")}
                                    disabled={!application.portfolioUrl || !canManageLeads}
                                    className="rounded-full bg-purple-100 px-4 py-2 text-xs font-black text-purple-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                                  >
                                    Portfolio
                                  </button>
                                  <button
                                    onClick={() => openSecureJvApplicationDocument(application.financialProofUrl, "financial proof")}
                                    disabled={!application.financialProofUrl || !canManageLeads}
                                    className="rounded-full bg-purple-100 px-4 py-2 text-xs font-black text-purple-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                                  >
                                    Financial proof
                                  </button>
                                  <button
                                    onClick={() => openSecureJvApplicationDocument(application.proposalDocumentUrl, "JV proposal document")}
                                    disabled={!application.proposalDocumentUrl || !canManageLeads}
                                    className="rounded-full bg-purple-100 px-4 py-2 text-xs font-black text-purple-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                                  >
                                    JV proposal
                                  </button>
                                  <button
                                    onClick={() => openSecureJvApplicationDocument(application.otherDocumentUrl, "other supporting document")}
                                    disabled={!application.otherDocumentUrl || !canManageLeads}
                                    className="rounded-full bg-purple-100 px-4 py-2 text-xs font-black text-purple-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                                  >
                                    Other file
                                  </button>
                                </div>

                                {!application.companyProfileUrl &&
                                  !application.cacCertificateUrl &&
                                  !application.portfolioUrl &&
                                  !application.financialProofUrl &&
                                  !application.proposalDocumentUrl &&
                                  !application.otherDocumentUrl && (
                                    <p className="mt-3 text-xs font-bold text-slate-400">
                                      No applicant documents uploaded.
                                    </p>
                                  )}
                              </div>

                              {renderLeadAssignmentControls(
                                "jv_applications",
                                application.id,
                                application.assignedToEmail,
                                application.staffNotes,
                                application.priority || "Normal",
                                application.followUpDate || "",
                                application.lastContactedAt || ""
                              )}

                              <div className="mt-4 rounded-2xl border border-purple-200 bg-white p-4">
                                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                                  <div>
                                    <p className="text-xs font-black uppercase tracking-[0.16em] text-purple-700">
                                      JV partner evaluation scorecard
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-slate-500">
                                      Score applicants before shortlisting or accepting JV partners.
                                    </p>
                                  </div>

                                  <span className={`w-fit rounded-full px-4 py-2 text-xs font-black ${jvEvaluationScoreClass(jvEvaluationScore(application))}`}>
                                    Score {jvEvaluationScore(application)}/15
                                  </span>
                                </div>

                                <div className="mt-4 grid gap-3 md:grid-cols-3">
                                  <label className="block">
                                    <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                                      Experience rating
                                    </span>
                                    <select
                                      value={application.experienceRating || 0}
                                      onChange={(event) =>
                                        updateLocalLeadDraft("jv_applications", application.id, {
                                          experienceRating: Number(event.target.value),
                                        })
                                      }
                                      disabled={!canManageLeads}
                                      className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none transition focus:border-purple-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                                    >
                                      {[0, 1, 2, 3, 4, 5].map((rating) => (
                                        <option key={rating} value={rating}>
                                          {rating}/5
                                        </option>
                                      ))}
                                    </select>
                                  </label>

                                  <label className="block">
                                    <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                                      Financial capacity
                                    </span>
                                    <select
                                      value={application.financialCapacityRating || 0}
                                      onChange={(event) =>
                                        updateLocalLeadDraft("jv_applications", application.id, {
                                          financialCapacityRating: Number(event.target.value),
                                        })
                                      }
                                      disabled={!canManageLeads}
                                      className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none transition focus:border-purple-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                                    >
                                      {[0, 1, 2, 3, 4, 5].map((rating) => (
                                        <option key={rating} value={rating}>
                                          {rating}/5
                                        </option>
                                      ))}
                                    </select>
                                  </label>

                                  <label className="block">
                                    <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                                      Track record
                                    </span>
                                    <select
                                      value={application.trackRecordRating || 0}
                                      onChange={(event) =>
                                        updateLocalLeadDraft("jv_applications", application.id, {
                                          trackRecordRating: Number(event.target.value),
                                        })
                                      }
                                      disabled={!canManageLeads}
                                      className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none transition focus:border-purple-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                                    >
                                      {[0, 1, 2, 3, 4, 5].map((rating) => (
                                        <option key={rating} value={rating}>
                                          {rating}/5
                                        </option>
                                      ))}
                                    </select>
                                  </label>
                                </div>

                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                  <label className="block">
                                    <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                                      Document review status
                                    </span>
                                    <select
                                      value={application.documentReviewStatus || "Not Reviewed"}
                                      onChange={(event) =>
                                        updateLocalLeadDraft("jv_applications", application.id, {
                                          documentReviewStatus: event.target.value as JVDocumentReviewStatus,
                                        })
                                      }
                                      disabled={!canManageLeads}
                                      className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none transition focus:border-purple-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                                    >
                                      <option value="Not Reviewed">Not Reviewed</option>
                                      <option value="Under Review">Under Review</option>
                                      <option value="Verified">Verified</option>
                                      <option value="Rejected">Rejected</option>
                                    </select>
                                  </label>

                                  <label className="block">
                                    <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                                      Risk level
                                    </span>
                                    <select
                                      value={application.riskLevel || "Normal"}
                                      onChange={(event) =>
                                        updateLocalLeadDraft("jv_applications", application.id, {
                                          riskLevel: event.target.value as JVRiskLevel,
                                        })
                                      }
                                      disabled={!canManageLeads}
                                      className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none transition focus:border-purple-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                                    >
                                      <option value="Low">Low</option>
                                      <option value="Normal">Normal</option>
                                      <option value="High">High</option>
                                      <option value="Critical">Critical</option>
                                    </select>
                                  </label>
                                </div>

                                <label className="mt-4 block">
                                  <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                                    Evaluation notes
                                  </span>
                                  <textarea
                                    value={application.evaluationNotes || ""}
                                    onChange={(event) =>
                                      updateLocalLeadDraft("jv_applications", application.id, {
                                        evaluationNotes: event.target.value,
                                      })
                                    }
                                    disabled={!canManageLeads}
                                    rows={3}
                                    placeholder="Example: Developer has 3 completed estates, strong financing evidence, but mandate letter still needs legal review."
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-purple-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                                  />
                                </label>

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                  <button
                                    onClick={() => saveJvApplicationEvaluation(application)}
                                    disabled={!canManageLeads}
                                    className="rounded-full bg-purple-700 px-5 py-2.5 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                                  >
                                    Save JV evaluation
                                  </button>

                                  {(application.evaluatedByEmail || application.evaluatedAt) && (
                                    <p className="text-xs font-bold text-slate-500">
                                      Last evaluated by {application.evaluatedByEmail || "staff"}
                                      {application.evaluatedAt ? ` on ${formatDate(application.evaluatedAt)}` : ""}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 md:justify-end">
                              <a href={createWhatsAppLeadLink(application.applicantPhone, jvWhatsAppMessage)} target="_blank" rel="noreferrer" className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white">
                                WhatsApp
                              </a>

                              <a href={createCallLeadLink(application.applicantPhone)} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white">
                                Call
                              </a>

                              {application.applicantEmail && (
                                <a href={createEmailLeadLink(application.applicantEmail, `INAMAAD JV application: ${application.listingTitle}`)} className="rounded-full bg-[#d49613] px-4 py-2 text-xs font-black text-white">
                                  Email
                                </a>
                              )}

                              <button onClick={() => updateJvApplicationStatus(application.id, "New")} disabled={!canManageLeads} className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                                New
                              </button>

                              <button onClick={() => updateJvApplicationStatus(application.id, "Reviewing")} disabled={!canManageLeads} className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                                Reviewing
                              </button>

                              <button onClick={() => updateJvApplicationStatus(application.id, "Shortlisted")} disabled={!canManageLeads} className="rounded-full bg-purple-100 px-4 py-2 text-xs font-black text-purple-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                                Shortlisted
                              </button>

                              <button onClick={() => updateJvApplicationStatus(application.id, "Accepted")} disabled={!canManageLeads} className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                                Accepted
                              </button>

                              <button onClick={() => updateJvApplicationStatus(application.id, "Rejected")} disabled={!canManageLeads} className="rounded-full bg-red-100 px-4 py-2 text-xs font-black text-red-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                                Rejected
                              </button>

                              <button onClick={() => updateJvApplicationStatus(application.id, "Closed")} disabled={!canManageLeads} className="rounded-full bg-slate-200 px-4 py-2 text-xs font-black text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                                Closed
                              </button>

                              <button onClick={() => deleteJvApplication(application.id)} disabled={!canDeleteLeads} className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">
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
                    Property offers / reservations
                  </h3>

                  <div className="mt-4 grid gap-4">
                    {propertyOffers.length === 0 && (
                      <p className="rounded-2xl bg-[#f7f8fb] p-5 text-sm text-slate-500">
                        No property offers yet.
                      </p>
                    )}

                    {propertyOffers.map((offer) => {
                      const offerStatus = offer.status || "New";
                      const offerWhatsAppMessage = `Hello ${offer.buyerName}, this is INAMAAD Real Estate. We received your offer/reservation request for ${offer.listingTitle}.`;

                      return (
                        <div key={offer.id} className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
                          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d49613]">
                                  {offer.listingTitle}
                                </p>

                                <span className={`rounded-full px-3 py-1 text-[11px] font-black ${offerStatusClass(offerStatus)}`}>
                                  {offerStatus}
                                </span>
                              </div>

                              <p className="mt-2 font-black text-[#0d1c38]">
                                {offer.buyerName}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {offer.buyerEmail || "No email"}  -  {offer.buyerPhone}
                              </p>

                              <p className="mt-2 text-sm font-black text-emerald-700">
                                Offer: {offer.offerAmount || "Not stated"}  -  {offer.paymentPlan || "No payment plan"}
                              </p>

                              <p className="mt-3 text-sm leading-6 text-slate-600">
                                {offer.message || "No extra offer terms."}
                              </p>

                              <p className="mt-2 text-xs font-bold text-slate-400">
                                Submitted {formatDate(offer.createdAt)}
                              </p>

                              {renderLeadAssignmentControls(
                                "property_offers",
                                offer.id,
                                offer.assignedToEmail,
                                offer.staffNotes,
                                offer.priority || "High",
                                offer.followUpDate || "",
                                offer.lastContactedAt || ""
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2 md:justify-end">
                              <a
                                href={createWhatsAppLeadLink(offer.buyerPhone, offerWhatsAppMessage)}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white"
                              >
                                WhatsApp
                              </a>

                              <a
                                href={createCallLeadLink(offer.buyerPhone)}
                                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white"
                              >
                                Call
                              </a>

                              {offer.buyerEmail && (
                                <a
                                  href={createEmailLeadLink(offer.buyerEmail, `INAMAAD offer: ${offer.listingTitle}`)}
                                  className="rounded-full bg-[#d49613] px-4 py-2 text-xs font-black text-white"
                                >
                                  Email
                                </a>
                              )}

                              <button onClick={() => updatePropertyOfferStatus(offer.id, "New")} disabled={!canManageLeads} className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                                New
                              </button>

                              <button onClick={() => updatePropertyOfferStatus(offer.id, "Reviewing")} disabled={!canManageLeads} className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                                Reviewing
                              </button>

                              <button onClick={() => updatePropertyOfferStatus(offer.id, "Accepted")} disabled={!canManageLeads} className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                                Accepted
                              </button>

                              <button onClick={() => updatePropertyOfferStatus(offer.id, "Rejected")} disabled={!canManageLeads} className="rounded-full bg-red-100 px-4 py-2 text-xs font-black text-red-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                                Rejected
                              </button>

                              <button onClick={() => updatePropertyOfferStatus(offer.id, "Closed")} disabled={!canManageLeads} className="rounded-full bg-slate-200 px-4 py-2 text-xs font-black text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                                Closed
                              </button>

                              <button onClick={() => deletePropertyOffer(offer.id)} disabled={!canDeleteLeads} className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">
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
                                {booking.email || "No email"}  -  {booking.phone}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                Preferred: {booking.preferredDate || "No date"}  -  {booking.preferredTime || "No time"}
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
                                booking.staffNotes,
                                booking.priority || "Normal",
                                booking.followUpDate || "",
                                booking.lastContactedAt || ""
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
                                {message.email || "No email"}  -  {message.phone || "No phone"}
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
                                message.staffNotes,
                                message.priority || "Normal",
                                message.followUpDate || "",
                                message.lastContactedAt || ""
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
                                {request.email}  -  {request.phone}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                Budget: {request.budget}  -  Interest: {request.interest}
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
                                request.staffNotes,
                                request.priority || "Normal",
                                request.followUpDate || "",
                                request.lastContactedAt || ""
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
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d49613]">
                              {buildListingReference(listing.id)}
                            </p>

                            <p className="mt-1 font-black text-[#0d1c38]">
                              {listing.title}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {listing.location}  -  {listing.price}
                            </p>

                            {(listing.bedrooms || listing.bathrooms || listing.landSize) && (
                              <p className="mt-1 text-xs font-bold text-slate-500">
                                {[listing.bedrooms ? `${listing.bedrooms} bed` : "", listing.bathrooms ? `${listing.bathrooms} bath` : "", listing.landSize || ""].filter(Boolean).join("  -  ")}
                              </p>
                            )}

                            <p className="mt-1 text-xs font-black text-slate-400">
                              {listing.status}  -  {listing.availabilityStatus || "Available"}
                              {listing.featured ? `  -  Featured rank ${listing.featuredRank || 0}` : ""}
                            </p>

                            {listing.availabilityNote && (
                              <p className="mt-1 text-xs font-bold text-slate-500">
                                Availability note: {listing.availabilityNote}
                              </p>
                            )}


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

export default function App() {
  return (
    <InamaadErrorBoundary>
      <InamaadMainApp />
    </InamaadErrorBoundary>
  );
}

// Lead command center upgrade: follow-up dashboard for overdue, due-today, urgent, and unassigned leads.

// Property reference upgrade: public and staff listing references use stable INM-000001 style IDs.

// Availability status upgrade: listings now support Available, Reserved, Sold, Rented, Leased, and Off Market badges plus staff controls.

// Property specifications upgrade: bedrooms, bathrooms, toilets, parking, sizes, furnishing, condition, and amenities are now supported.

// Neighborhood and infrastructure upgrade: road access, power, water, security, nearby schools/hospitals/malls/transport, estate features, and neighborhood overview are now supported.

// Owner/agent/developer contact profile upgrade: contact role, company, email, WhatsApp, visibility, address, and mandate status are now supported.

// JV upgrade: JV listings now use project structure, landowner/developer/investor requirements, sharing formula, stage, expected units, project cost, and timeline instead of bedroom/bathroom fields.

// Final property/JV separation repair: normal properties no longer store/display JV-only fields, and JV deals no longer store/display bedroom/bathroom/furnishing fields.

// INAMAAD_MOBILE_FIT_AUDIT: mobile overflow guard, compact header, responsive modal, and safer small-screen spacing added without adding homepage upgrade reminders.

// INAMAAD_MOBILE_MEDIUM_HORIZONTAL_AUDIT: reduced mobile font scale, made property/JV profile cards horizontal on mobile, kept homepage free of upgrade reminders.

// INAMAAD_INVISIBLE_SYNC_SCROLL_STABILITY_AUDIT: removed visible syncing badge, stopped touch/pointer refresh during mobile scroll, and preserved scroll position during background data refresh.

// INAMAAD_STATIC_NAVBAR_AUDIT: navbar and new-user notice changed from sticky to normal/static layout so they do not move while scrolling.

// INAMAAD_STICKY_NAVBAR_VISIBLE_AUDIT: navbar is sticky and visible while scrolling; new-user notice remains non-sticky to avoid double-bar jumping.

// INAMAAD_FIXED_VISIBLE_NAVBAR_AUDIT: navbar is fixed at the top and remains visible while scrolling; page content is padded so it does not hide under the navbar.

// INAMAAD_COPYRIGHT_FOOTER_AUDIT: footer copyright added at the end of the page.

// INAMAAD_MOVABLE_NAVBAR_RESTORE_AUDIT: navbar restored to normal movable/static page flow; fixed top padding removed.

// INAMAAD_STAFF_ACCESS_UNDER_COMPANY_AUDIT: staff portal link moved from Access footer column into Company footer column as small Staff Access link.

// INAMAAD_PREMIUM_CONTACT_SECTION_AUDIT: contact section upgraded to premium business-focused investor/developer/landowner/JV inquiry layout.

// INAMAAD_FORGOT_PASSWORD_AUDIT: forgot password and reset password modals added using Supabase password recovery flow.

// INAMAAD_SIGNED_IN_STATUS_AUDIT: navbar now clearly changes after sign in by showing signed-in account badge and sign-out action on desktop and mobile.

// INAMAAD_LOGIN_VISIBLE_STRONG_FIX_AUDIT: login state now switches immediately to Logged in after successful sign in, and footer Access column no longer shows Sign In while logged in.

// INAMAAD_EMAIL_CONFIRMATION_REQUIRED_AUDIT: signup now redirects user to sign in only after email confirmation, sign-in detects unconfirmed emails, and users can resend confirmation email.

// INAMAAD_AUTH_MESSAGE_AND_CONFIRMATION_FIX_AUDIT: signup now shows readable auth errors instead of {}, keeps users logged out until email confirmation, and maps Supabase rate/email errors to clear messages.

// INAMAAD_CREATE_ACCOUNT_BUTTON_FIX_AUDIT: Create account button is now explicit submit, shows loading, prevents double click, and handleRegister always returns readable messages.

// INAMAAD_SIGNUP_EMAIL_CONFIRMATION_DELIVERY_FIX_AUDIT: signup has timeout, never says account activated before confirmation, and guards against unconfirmed sessions.


// INAMAAD_FRONTEND_FORM_PROTECTION_AUDIT: public forms now use client-side validation, bot-trap fields, and double-submit locks.
