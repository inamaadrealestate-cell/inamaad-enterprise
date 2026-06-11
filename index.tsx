import React, { useEffect, useMemo, useState } from "react";

type ModalType =
  | null
  | "signin"
  | "register"
  | "post"
  | "investor"
  | "admin"
  | "details";

type ListingStatus = "Verified" | "Pending Review";

type Listing = {
  id: number;
  title: string;
  location: string;
  price: string;
  value: number;
  type: string;
  category: string;
  yieldText: string;
  image: string;
  description: string;
  status: ListingStatus;
  ownerName?: string;
  ownerPhone?: string;
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
  createdAt: string;
};

const WHATSAPP_NUMBER = "2348106350486";
const ADMIN_PASSWORD = "admin123";

const seedListings: Listing[] = [
  {
    id: 1,
    title: "Premium 4-Bedroom Smart Duplex",
    location: "Lekki Phase 1, Lagos",
    price: "₦185,000,000",
    value: 185000000,
    type: "Residential",
    category: "For Sale",
    yieldText: "Estimated 14% yearly appreciation",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    description:
      "A fully finished smart duplex in a prime gated estate with strong rental and resale potential.",
    status: "Verified",
  },
  {
    id: 2,
    title: "Joint Venture Land Opportunity",
    location: "Maitama District, Abuja",
    price: "JV Partnership",
    value: 450000000,
    type: "Joint Venture",
    category: "JV",
    yieldText: "Developer equity structure available",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    description:
      "Strategic land parcel suitable for luxury apartments, short-let units, or mixed residential development.",
    status: "Verified",
  },
  {
    id: 3,
    title: "Serviced Estate Plots",
    location: "Ibeju-Lekki, Lagos",
    price: "₦18,500,000",
    value: 18500000,
    type: "Land",
    category: "Investment",
    yieldText: "High-growth corridor near major infrastructure",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    description:
      "Documented estate plots in a fast-growing investment corridor suitable for long-term land banking.",
    status: "Verified",
  },
  {
    id: 4,
    title: "Income-Producing Short-let Apartment",
    location: "Victoria Island, Lagos",
    price: "₦92,000,000",
    value: 92000000,
    type: "Commercial",
    category: "For Sale",
    yieldText: "Projected rental income from short-let operations",
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    description:
      "Modern apartment positioned for corporate guests, expatriates, and premium short-stay tenants.",
    status: "Verified",
  },
];

const trustStats = [
  { label: "Verified listings", value: "2,400+" },
  { label: "Deal value tracked", value: "₦840B+" },
  { label: "Active investors", value: "1,100+" },
  { label: "JV opportunities", value: "180+" },
];

const processSteps = [
  {
    title: "Submit opportunity",
    text: "Owners, developers, and agents submit properties, land, or joint venture opportunities.",
  },
  {
    title: "Verification review",
    text: "INAMAAD checks documents, pricing, ownership details, location strength, and investment fit.",
  },
  {
    title: "Investor matching",
    text: "Qualified investors discover opportunities based on budget, location, asset class, and risk profile.",
  },
];

const verificationItems = [
  "Document and ownership review",
  "Location and market-value assessment",
  "Developer and seller background checks",
  "Investment risk and return screening",
];

const faqItems = [
  {
    question: "Is INAMAAD only for buying property?",
    answer:
      "No. The platform supports property sales, land investments, joint ventures, and investor matching.",
  },
  {
    question: "Can developers post opportunities?",
    answer:
      "Yes. Developers can submit projects, JV proposals, off-plan opportunities, and verified investment deals.",
  },
  {
    question: "Can investors request private deals?",
    answer:
      "Yes. Investors can submit their budget and interest so INAMAAD can match them with suitable opportunities.",
  },
  {
    question: "Are all listings verified?",
    answer:
      "Listings shown as verified have passed internal review. New submissions stay pending until admin approval.",
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

export default function App() {
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [investorRequests, setInvestorRequests] = useState<InvestorRequest[]>(
    []
  );
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [successMessage, setSuccessMessage] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  const [postForm, setPostForm] = useState({
    title: "",
    location: "",
    price: "",
    type: "Residential",
    category: "For Sale",
    yieldText: "",
    image: "",
    description: "",
    ownerName: "",
    ownerPhone: "",
  });

  const [investorForm, setInvestorForm] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    interest: "Residential",
    message: "",
  });

  useEffect(() => {
    const storedListings = localStorage.getItem("inamaad_listings");
    const storedRequests = localStorage.getItem("inamaad_investor_requests");

    if (storedListings) {
      setListings(JSON.parse(storedListings) as Listing[]);
    }

    if (storedRequests) {
      setInvestorRequests(JSON.parse(storedRequests) as InvestorRequest[]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("inamaad_listings", JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem(
      "inamaad_investor_requests",
      JSON.stringify(investorRequests)
    );
  }, [investorRequests]);

  useEffect(() => {
    function openAdminShortcut(event: KeyboardEvent) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "a") {
        setAdminUnlocked(false);
        setAdminPassword("");
        setModal("admin");
      }
    }

    window.addEventListener("keydown", openAdminShortcut);
    return () => window.removeEventListener("keydown", openAdminShortcut);
  }, []);

  const verifiedListings = listings.filter(
    (listing) => listing.status === "Verified"
  );

  const pendingListings = listings.filter(
    (listing) => listing.status === "Pending Review"
  );

  const filteredListings = useMemo(() => {
    return verifiedListings.filter((listing) => {
      const matchesSearch =
        listing.title.toLowerCase().includes(query.toLowerCase()) ||
        listing.location.toLowerCase().includes(query.toLowerCase()) ||
        listing.type.toLowerCase().includes(query.toLowerCase());

      const matchesType =
        propertyType === "All" || listing.type === propertyType;

      return matchesSearch && matchesType;
    });
  }, [query, propertyType, verifiedListings]);

  function showSuccess(message: string) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 4500);
  }

  function openListing(listing: Listing) {
    setSelectedListing(listing);
    setModal("details");
  }

  function submitListing(event: React.FormEvent) {
    event.preventDefault();

    const newListing: Listing = {
      id: Date.now(),
      title: postForm.title,
      location: postForm.location,
      price: postForm.price,
      value: currencyToValue(postForm.price),
      type: postForm.type,
      category: postForm.category,
      yieldText: postForm.yieldText || "Pending investment review",
      image:
        postForm.image ||
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
      description: postForm.description,
      status: "Pending Review",
      ownerName: postForm.ownerName,
      ownerPhone: postForm.ownerPhone,
      createdAt: new Date().toISOString(),
    };

    setListings((current) => [newListing, ...current]);

    setPostForm({
      title: "",
      location: "",
      price: "",
      type: "Residential",
      category: "For Sale",
      yieldText: "",
      image: "",
      description: "",
      ownerName: "",
      ownerPhone: "",
    });

    setModal(null);
    showSuccess("Opportunity submitted successfully. Admin review is pending.");
  }

  function submitInvestorRequest(event: React.FormEvent) {
    event.preventDefault();

    const newRequest: InvestorRequest = {
      id: Date.now(),
      ...investorForm,
      createdAt: new Date().toISOString(),
    };

    setInvestorRequests((current) => [newRequest, ...current]);

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

  function unlockAdmin(event: React.FormEvent) {
    event.preventDefault();

    if (adminPassword === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      setAdminPassword("");
    } else {
      showSuccess("Wrong admin password.");
    }
  }

  function approveListing(id: number) {
    setListings((current) =>
      current.map((listing) =>
        listing.id === id ? { ...listing, status: "Verified" } : listing
      )
    );
    showSuccess("Listing approved.");
  }

  function deleteListing(id: number) {
    setListings((current) => current.filter((listing) => listing.id !== id));
    showSuccess("Listing deleted.");
  }

  function deleteInvestorRequest(id: number) {
    setInvestorRequests((current) =>
      current.filter((request) => request.id !== id)
    );
    showSuccess("Investor request removed.");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 text-xl font-black text-slate-950 shadow-lg shadow-amber-400/20">
              I
            </div>
            <div>
              <p className="text-sm font-black tracking-[0.24em] text-white">
                INAMAAD
              </p>
              <p className="text-xs text-slate-400">Real Estate Enterprise</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 lg:flex">
            <a href="#properties" className="hover:text-amber-300">
              Properties
            </a>
            <a href="#process" className="hover:text-amber-300">
              How it works
            </a>
            <a href="#verification" className="hover:text-amber-300">
              Verification
            </a>
            <a href="#investors" className="hover:text-amber-300">
              Investors
            </a>
            <a href="#faq" className="hover:text-amber-300">
              FAQ
            </a>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={() => setModal("signin")}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Sign in
            </button>
            <button
              onClick={() => setModal("investor")}
              className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-400/20 hover:bg-amber-300"
            >
              Investor access
            </button>
          </div>

          <button
            onClick={() => setMobileOpen((current) => !current)}
            className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white lg:hidden"
          >
            Menu
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 bg-slate-950 px-5 py-5 lg:hidden">
            <div className="grid gap-4 text-sm font-semibold text-slate-300">
              <a href="#properties" onClick={() => setMobileOpen(false)}>
                Properties
              </a>
              <a href="#process" onClick={() => setMobileOpen(false)}>
                How it works
              </a>
              <a href="#verification" onClick={() => setMobileOpen(false)}>
                Verification
              </a>
              <a href="#investors" onClick={() => setMobileOpen(false)}>
                Investors
              </a>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setModal("investor");
                }}
                className="rounded-full bg-amber-400 px-5 py-3 text-left font-black text-slate-950"
              >
                Investor access
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.16),transparent_35%)]" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-200">
                Verified real estate investment marketplace
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
                Build wealth through verified property opportunities.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                INAMAAD connects investors with screened properties, land,
                developers, and joint venture opportunities across Nigeria’s
                strongest real estate markets.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#properties"
                  className="rounded-full bg-amber-400 px-8 py-4 text-center text-sm font-black text-slate-950 shadow-xl shadow-amber-400/20 hover:bg-amber-300"
                >
                  Explore verified deals
                </a>
                <button
                  onClick={() => setModal("post")}
                  className="rounded-full border border-white/15 px-8 py-4 text-sm font-black text-white hover:bg-white/10"
                >
                  Submit opportunity
                </button>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
                {trustStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                  >
                    <p className="text-2xl font-black text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                  alt="Luxury real estate investment"
                  className="h-[430px] w-full rounded-[1.5rem] object-cover"
                />

                <div className="mt-4 rounded-[1.5rem] bg-white p-5">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">
                        Featured opportunity
                      </p>
                      <h2 className="mt-2 text-2xl font-black text-slate-950">
                        Prime residential asset
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Lekki Phase 1, Lagos
                      </p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                      Verified
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-sm font-black">₦185M</p>
                      <p className="text-[11px] text-slate-500">Value</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-sm font-black">14%</p>
                      <p className="text-[11px] text-slate-500">Growth</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-sm font-black">Lagos</p>
                      <p className="text-[11px] text-slate-500">Market</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 hidden rounded-3xl bg-amber-400 p-5 text-slate-950 shadow-2xl lg:block">
                <p className="text-sm font-black">Due diligence ready</p>
                <p className="mt-1 text-xs font-semibold">
                  Documents, pricing and ownership reviewed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="properties" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-600">
                Marketplace
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                Featured verified listings
              </h2>
              <p className="mt-4 max-w-2xl text-slate-600">
                Browse property investments, land banking opportunities,
                income-producing assets, and joint venture deals reviewed by
                INAMAAD.
              </p>
            </div>

            <button
              onClick={() => setModal("post")}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-slate-800"
            >
              Submit property
            </button>
          </div>

          <div className="mt-10 grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_230px]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by property, location, or asset type"
              className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
            />

            <select
              value={propertyType}
              onChange={(event) => setPropertyType(event.target.value)}
              className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
            >
              <option>All</option>
              <option>Residential</option>
              <option>Land</option>
              <option>Commercial</option>
              <option>Joint Venture</option>
            </select>
          </div>

          <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <article
                key={listing.id}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-black text-slate-950">
                    {listing.type}
                  </div>
                  <div className="absolute right-4 top-4 rounded-full bg-emerald-500 px-4 py-2 text-xs font-black text-white">
                    {listing.status}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3 className="text-xl font-black text-slate-950">
                        {listing.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        {listing.location}
                      </p>
                    </div>
                    <p className="text-right text-sm font-black text-amber-700">
                      {listing.category}
                    </p>
                  </div>

                  <p className="mt-5 text-2xl font-black text-slate-950">
                    {listing.price}
                  </p>

                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-600">
                    {listing.description}
                  </p>

                  <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
                    {listing.yieldText}
                  </div>

                  <button
                    onClick={() => openListing(listing)}
                    className="mt-6 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
                  >
                    View investment details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-600">
                Process
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                A cleaner way to discover real estate opportunities.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {processSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-amber-300">
                    0{index + 1}
                  </div>
                  <h3 className="mt-8 text-2xl font-black text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-4 leading-7 text-slate-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="verification" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="overflow-hidden rounded-[2rem]">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
                alt="Real estate verification process"
                className="h-[520px] w-full object-cover"
              />
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-600">
                Verification
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                Built for serious investors, not random property adverts.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                INAMAAD is designed to make property discovery more trusted by
                placing screening, investor fit, and deal clarity at the center
                of the platform.
              </p>

              <div className="mt-8 grid gap-4">
                {verificationItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <p className="font-bold text-slate-800">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="investors" className="bg-slate-950 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_0.9fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">
                Investors
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
                Access property deals that match your capital and strategy.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Tell INAMAAD your preferred location, budget, and investment
                interest. Your request is saved for admin review and follow-up.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => setModal("investor")}
                  className="rounded-full bg-amber-400 px-8 py-4 text-sm font-black text-slate-950 hover:bg-amber-300"
                >
                  Request investor access
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20INAMAAD%20Real%20Estate%2C%20I%20want%20to%20speak%20with%20you%20about%20property%20investment.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 px-8 py-4 text-center text-sm font-black text-white hover:bg-white/10"
                >
                  Speak on WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-7">
              <div className="rounded-[1.5rem] bg-white p-6">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-600">
                  Investor profile
                </p>
                <div className="mt-6 grid gap-4">
                  {[
                    ["Budget", "₦20M - ₦500M+"],
                    ["Assets", "Land, residential, commercial, JV"],
                    ["Markets", "Lagos, Abuja, Port Harcourt, emerging corridors"],
                    ["Support", "Deal review and matching"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-6 rounded-2xl bg-slate-50 p-4"
                    >
                      <p className="text-sm font-bold text-slate-500">
                        {label}
                      </p>
                      <p className="text-right text-sm font-black text-slate-950">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-5xl px-5 py-20 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-600">
              FAQ
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Common questions
            </h2>
          </div>

          <div className="mt-10 grid gap-4">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-black text-slate-950">
                  {item.question}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-12">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div>
                <h2 className="text-3xl font-black md:text-4xl">
                  Ready to invest or submit a verified opportunity?
                </h2>
                <p className="mt-3 max-w-2xl text-slate-300">
                  Start with investor access, submit your property, or speak
                  directly with INAMAAD on WhatsApp.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setModal("investor")}
                  className="rounded-full bg-amber-400 px-7 py-4 text-sm font-black text-slate-950 hover:bg-amber-300"
                >
                  Investor access
                </button>
                <button
                  onClick={() => setModal("post")}
                  className="rounded-full border border-white/15 px-7 py-4 text-sm font-black text-white hover:bg-white/10"
                >
                  Submit property
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 text-xl font-black text-slate-950">
                I
              </div>
              <div>
                <p className="text-sm font-black tracking-[0.24em] text-slate-950">
                  INAMAAD
                </p>
                <p className="text-xs text-slate-500">
                  Real Estate Enterprise
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-md leading-7 text-slate-600">
              A verified real estate investment marketplace for property
              owners, developers, investors, and joint venture opportunities.
            </p>
          </div>

          <div>
            <p className="font-black text-slate-950">Company</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <a href="#properties">Properties</a>
              <a href="#process">How it works</a>
              <a href="#verification">Verification</a>
              <a href="#investors">Investors</a>
            </div>
          </div>

          <div>
            <p className="font-black text-slate-950">Contact</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp: +{WHATSAPP_NUMBER}
              </a>
              <button
                onClick={() => {
                  setAdminUnlocked(false);
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
        <span className="text-xl">💬</span>
        <span className="hidden text-sm font-black sm:inline">WhatsApp</span>
      </a>

      {successMessage && (
        <div className="fixed left-1/2 top-24 z-[130] w-[90%] max-w-md -translate-x-1/2 rounded-2xl bg-slate-950 px-5 py-4 text-center text-sm font-bold text-white shadow-2xl">
          {successMessage}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">
                  INAMAAD
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  {modal === "signin" && "Sign in"}
                  {modal === "register" && "Create account"}
                  {modal === "post" && "Submit opportunity"}
                  {modal === "investor" && "Request investor access"}
                  {modal === "admin" && "Staff portal"}
                  {modal === "details" && selectedListing?.title}
                </h2>
              </div>

              <button
                onClick={() => {
                  setModal(null);
                  setSelectedListing(null);
                }}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            {modal === "signin" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setModal(null);
                  showSuccess("Demo sign in completed.");
                }}
                className="grid gap-4"
              >
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
                />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
                />
                <button className="rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white">
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
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setModal(null);
                  showSuccess("Demo account created.");
                }}
                className="grid gap-4"
              >
                <input
                  required
                  placeholder="Full name"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
                />
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
                />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
                />
                <button className="rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white">
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
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
                  />

                  <input
                    required
                    value={postForm.location}
                    onChange={(event) =>
                      setPostForm({
                        ...postForm,
                        location: event.target.value,
                      })
                    }
                    placeholder="Location"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
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
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
                  />

                  <select
                    value={postForm.type}
                    onChange={(event) =>
                      setPostForm({ ...postForm, type: event.target.value })
                    }
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
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
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
                  >
                    <option>For Sale</option>
                    <option>Investment</option>
                    <option>JV</option>
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
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <input
                  value={postForm.image}
                  onChange={(event) =>
                    setPostForm({ ...postForm, image: event.target.value })
                  }
                  placeholder="Image URL optional"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
                />

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
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
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
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
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
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <button className="rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white">
                  Submit for admin review
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
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
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
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
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
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
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
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
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
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
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
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
                />

                <button className="rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white">
                  Save investor request
                </button>
              </form>
            )}

            {modal === "details" && selectedListing && (
              <div>
                <img
                  src={selectedListing.image}
                  alt={selectedListing.title}
                  className="h-80 w-full rounded-[1.5rem] object-cover"
                />
                <div className="mt-6 grid gap-5 md:grid-cols-[1fr_260px]">
                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      {selectedListing.location}
                    </p>
                    <p className="mt-3 text-3xl font-black text-slate-950">
                      {selectedListing.price}
                    </p>
                    <p className="mt-4 leading-8 text-slate-600">
                      {selectedListing.description}
                    </p>
                    <div className="mt-5 rounded-2xl bg-slate-50 p-5 font-bold text-slate-700">
                      {selectedListing.yieldText}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                    <p className="text-sm font-black text-amber-300">
                      Deal summary
                    </p>
                    <div className="mt-5 grid gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Type</p>
                        <p className="font-black">{selectedListing.type}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Category</p>
                        <p className="font-black">{selectedListing.category}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Status</p>
                        <p className="font-black text-emerald-300">
                          {selectedListing.status}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setModal("investor")}
                      className="mt-6 w-full rounded-full bg-amber-400 px-5 py-3 text-sm font-black text-slate-950"
                    >
                      Request access
                    </button>
                  </div>
                </div>
              </div>
            )}

            {modal === "admin" && !adminUnlocked && (
              <form onSubmit={unlockAdmin} className="grid gap-4">
                <p className="rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                  Enter the staff password to manage pending listings and
                  investor requests. You can also open this portal later with{" "}
                  <strong>Ctrl + Shift + A</strong>.
                </p>

                <input
                  required
                  type="password"
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  placeholder="Admin password"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-amber-400"
                />

                <button className="rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white">
                  Unlock staff portal
                </button>
              </form>
            )}

            {modal === "admin" && adminUnlocked && (
              <div className="grid gap-8">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-2xl font-black">{listings.length}</p>
                    <p className="text-sm text-slate-500">Total listings</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-2xl font-black">
                      {pendingListings.length}
                    </p>
                    <p className="text-sm text-slate-500">Pending review</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-2xl font-black">
                      {investorRequests.length}
                    </p>
                    <p className="text-sm text-slate-500">Investor requests</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-950">
                    Pending listings
                  </h3>

                  <div className="mt-4 grid gap-4">
                    {pendingListings.length === 0 && (
                      <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
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
                            <p className="font-black text-slate-950">
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
                  <h3 className="text-xl font-black text-slate-950">
                    Investor requests
                  </h3>

                  <div className="mt-4 grid gap-4">
                    {investorRequests.length === 0 && (
                      <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                        No investor requests yet.
                      </p>
                    )}

                    {investorRequests.map((request) => (
                      <div
                        key={request.id}
                        className="rounded-2xl border border-slate-200 p-5"
                      >
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div>
                            <p className="font-black text-slate-950">
                              {request.name}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {request.email} • {request.phone}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              Budget: {request.budget} • Interest:{" "}
                              {request.interest}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                              {request.message || "No extra message."}
                            </p>
                            <p className="mt-2 text-xs font-bold text-slate-400">
                              Submitted {formatDate(request.createdAt)}
                            </p>
                          </div>

                          <button
                            onClick={() => deleteInvestorRequest(request.id)}
                            className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-950">
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
                            <p className="font-black text-slate-950">
                              {listing.title}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {listing.location} • {listing.price}
                            </p>
                            <p className="mt-1 text-xs font-black text-slate-400">
                              {listing.status}
                            </p>
                          </div>

                          <button
                            onClick={() => deleteListing(listing.id)}
                            className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white"
                          >
                            Delete
                          </button>
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