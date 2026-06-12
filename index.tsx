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

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Properties", href: "#properties" },
  { label: "JV Deals", href: "#jv" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
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
  { value: "36", label: "States covered" },
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
  const [locationFilter, setLocationFilter] = useState("All Locations");
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
    try {
      const storedListings = localStorage.getItem("inamaad_listings");
      const storedRequests = localStorage.getItem("inamaad_investor_requests");

      if (storedListings) {
        setListings(JSON.parse(storedListings) as Listing[]);
      }

      if (storedRequests) {
        setInvestorRequests(JSON.parse(storedRequests) as InvestorRequest[]);
      }
    } catch {
      localStorage.removeItem("inamaad_listings");
      localStorage.removeItem("inamaad_investor_requests");
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

  const pendingListings = listings.filter(
    (listing) => listing.status === "Pending Review"
  );

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      if (listing.status !== "Verified") return false;

      const searchText =
        `${listing.title} ${listing.location} ${listing.type} ${listing.category}`.toLowerCase();

      const matchesSearch = searchText.includes(query.toLowerCase());

      const matchesType =
        propertyType === "All" || listing.type === propertyType;

      const matchesLocation =
        locationFilter === "All Locations" ||
        listing.location.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSearch && matchesType && matchesLocation;
    });
  }, [listings, query, propertyType, locationFilter]);

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
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
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

          <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
            <div className="max-w-5xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-[3px] w-14 bg-[#f0bf3c]" />
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f0bf3c] sm:text-sm">
                  Nigeria’s premier platform
                </p>
              </div>

              <h1 className="max-w-4xl text-3xl font-black leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
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
                    <option>All Locations</option>
                    <option>Abuja</option>
                    <option>Lagos</option>
                    <option>Port Harcourt</option>
                    <option>Kano</option>
                  </select>

                  <a
                    href="#properties"
                    className="flex h-14 items-center justify-center rounded-2xl bg-[#0d1c38] px-6 text-lg font-semibold text-white transition hover:bg-[#13284f]"
                  >
                    Search
                  </a>
                </div>
              </div>
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

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => (
                <article
                  key={listing.id}
                  className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative h-72 overflow-hidden bg-[#0d1c38]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0d1c38] via-[#1b3157] to-[#9b6b16]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(240,191,60,0.35),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_34%)]" />

                    <div className="relative z-10 flex h-full flex-col justify-between p-7 text-white">
                      <div className="flex items-start justify-between gap-4">
                        <div className="rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide backdrop-blur">
                          {listing.type}
                        </div>

                        <div className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-black text-white">
                          {listing.status}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f0bf3c]">
                          INAMAAD verified asset
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

                    <button
                      onClick={() => openListing(listing)}
                      className="mt-6 flex w-full items-center justify-center rounded-2xl bg-[#0d1c38] px-5 py-4 text-base font-bold text-white transition hover:bg-[#13284f]"
                    >
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
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

              <div className="grid gap-4">
                <button
                  onClick={() => setModal("investor")}
                  className="rounded-2xl bg-[#f0bf3c] px-7 py-5 text-base font-black text-[#0d1c38] hover:bg-[#ffd45a]"
                >
                  Request Investor Access
                </button>

                <button
                  onClick={() => setModal("post")}
                  className="rounded-2xl border border-white/20 px-7 py-5 text-base font-black text-white hover:bg-white/10"
                >
                  Submit Property
                </button>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-white px-7 py-5 text-center text-base font-black text-[#0d1c38]"
                >
                  WhatsApp: +{WHATSAPP_NUMBER}
                </a>
              </div>
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
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <input
                  required
                  type="password"
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
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <input
                  required
                  type="email"
                  placeholder="Email address"
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <input
                  required
                  type="password"
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
                    value={postForm.location}
                    onChange={(event) =>
                      setPostForm({
                        ...postForm,
                        location: event.target.value,
                      })
                    }
                    placeholder="Location"
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

                <button className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white">
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
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0d1c38] via-[#1b3157] to-[#9b6b16]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(240,191,60,0.35),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_34%)]" />

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
                    </div>

                    <button
                      onClick={() => setModal("investor")}
                      className="mt-6 w-full rounded-2xl bg-[#f0bf3c] px-5 py-3 text-sm font-black text-[#0d1c38]"
                    >
                      Request Access
                    </button>
                  </div>
                </div>
              </div>
            )}

            {modal === "admin" && !adminUnlocked && (
              <form onSubmit={unlockAdmin} className="grid gap-4">
                <p className="rounded-2xl bg-[#f7f8fb] p-5 text-sm leading-6 text-slate-600">
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
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:border-[#0d1c38]"
                />

                <button className="rounded-2xl bg-[#0d1c38] px-6 py-4 text-sm font-black text-white">
                  Unlock staff portal
                </button>
              </form>
            )}

            {modal === "admin" && adminUnlocked && (
              <div className="grid gap-8">
                <div className="grid gap-4 md:grid-cols-3">
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
                      {investorRequests.length}
                    </p>
                    <p className="text-sm text-slate-500">Investor requests</p>
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
                    Investor requests
                  </h3>

                  <div className="mt-4 grid gap-4">
                    {investorRequests.length === 0 && (
                      <p className="rounded-2xl bg-[#f7f8fb] p-5 text-sm text-slate-500">
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
                            <p className="font-black text-[#0d1c38]">
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