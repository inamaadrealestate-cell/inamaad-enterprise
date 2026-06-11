import React, { useEffect, useState } from "react";

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
};

type ModalType = "login" | "register" | "post" | "investor" | "admin" | null;
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
  { label: "Joint Ventures", count: "183", icon: "📊", typeValue: "joint_venture" },
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
];

const JV_DEALS = [
  {
    title: "Luxury Mixed-use Development",
    location: "Wuse 2, Abuja",
    value: "₦3.5B",
    equity: "35%",
    roi: "24%",
  },
  {
    title: "Residential Estate Joint Venture",
    location: "Ibeju-Lekki, Lagos",
    value: "₦5.8B",
    equity: "40%",
    roi: "28%",
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

export default function App() {
  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const savedListings = localStorage.getItem("inamaad_listings");

      if (savedListings) {
        return JSON.parse(savedListings);
      }

      return INITIAL_LISTINGS;
    } catch {
      return INITIAL_LISTINGS;
    }
  });

  const [keyword, setKeyword] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [type, setType] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  const [newListing, setNewListing] = useState({
    title: "",
    location: "",
    state: "",
    price: "",
    typeValue: "residential",
    roi: "",
    summary: "",
  });

  useEffect(() => {
    localStorage.setItem("inamaad_listings", JSON.stringify(listings));
  }, [listings]);

  const filteredFeatured = listings.filter((item) => {
    const keywordMatch =
      keyword.trim() === "" ||
      item.title.toLowerCase().includes(keyword.toLowerCase()) ||
      item.location.toLowerCase().includes(keyword.toLowerCase()) ||
      item.summary.toLowerCase().includes(keyword.toLowerCase());

    const stateMatch =
      selectedState.trim() === "" ||
      item.state.toLowerCase().includes(selectedState.toLowerCase());

    const typeMatch = type === "" || item.typeValue === type;

    return keywordMatch && stateMatch && typeMatch;
  });

  function getTypeLabel(value: string) {
    if (value === "commercial") return "Commercial";
    if (value === "land") return "Land";
    if (value === "joint_venture") return "Joint Venture";
    return "Residential";
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
    setMobileOpen(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    scrollToSection("properties");
  }

  function resetFilters() {
    setKeyword("");
    setSelectedState("");
    setType("");
  }

  function handleCategoryClick(categoryType: string) {
    if (categoryType === "joint_venture") {
      scrollToSection("jv");
      return;
    }

    setType(categoryType);
    setTimeout(() => scrollToSection("properties"), 50);
  }

  function handlePostListing(e: React.FormEvent) {
    e.preventDefault();

    const createdListing: Listing = {
      id: Date.now(),
      title: newListing.title,
      location: newListing.location,
      state: newListing.state,
      price: newListing.price,
      type: getTypeLabel(newListing.typeValue),
      typeValue: newListing.typeValue,
      roi: newListing.roi || "Pending",
      status: "Pending review",
      summary: newListing.summary,
    };

    setListings([createdListing, ...listings]);

    setNewListing({
      title: "",
      location: "",
      state: "",
      price: "",
      typeValue: "residential",
      roi: "",
      summary: "",
    });

    setModal(null);
    setSuccessMessage("Your opportunity has been added as Pending review.");
    setTimeout(() => setSuccessMessage(""), 4000);
    setTimeout(() => scrollToSection("properties"), 100);
  }

  function handleAuthSubmit(e: React.FormEvent, message: string) {
    e.preventDefault();
    setModal(null);
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 4000);
  }

  function unlockAdmin(e: React.FormEvent) {
  e.preventDefault();

  if (adminPassword === "admin123") {
    setAdminUnlocked(true);
    setAdminPassword("");
  } else {
    setSuccessMessage("Wrong admin password.");
    setTimeout(() => setSuccessMessage(""), 4000);
  }
}

  function approveListing(id: number) {
  setListings(
    listings.map((item) =>
      item.id === id ? { ...item, status: "Verified" } : item
    )
  );

  setSuccessMessage("Listing approved successfully.");
  setTimeout(() => setSuccessMessage(""), 4000);
}

function deleteListing(id: number) {
  setListings(listings.filter((item) => item.id !== id));

  setSuccessMessage("Listing deleted successfully.");
  setTimeout(() => setSuccessMessage(""), 4000);
}

  return (
    <div className="min-h-screen bg-surface">
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy/90 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <button onClick={() => scrollToSection("home")} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center text-navy font-extrabold">
              I
            </div>

            <div className="text-left">
              <div className="text-white font-bold tracking-wide">INAMAAD</div>
              <div className="text-white/40 text-xs">Real Estate Enterprise</div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <button onClick={() => scrollToSection("home")} className="text-white/70 hover:text-gold transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection("properties")} className="text-white/70 hover:text-gold transition-colors">
              Properties
            </button>
            <button onClick={() => scrollToSection("jv")} className="text-white/70 hover:text-gold transition-colors">
              Joint Ventures
            </button>
            <button onClick={() => scrollToSection("why")} className="text-white/70 hover:text-gold transition-colors">
              Investors
            </button>
            <button onClick={() => scrollToSection("about")} className="text-white/70 hover:text-gold transition-colors">
              About
            </button>
          </nav>
           <button
  onClick={() => {
    setAdminUnlocked(false);
    setAdminPassword("");
    setModal("admin");
  }}
  className="text-white/70 hover:text-gold transition-colors"
>
  Admin
</button>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setModal("login")}
              className="text-white/70 hover:text-white text-sm font-medium"
            >
              Sign in
            </button>

            <button
              onClick={() => setModal("register")}
              className="bg-gold text-navy px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors"
            >
              Get started
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white text-3xl leading-none"
          >
            ☰
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-navy border-t border-white/10 px-6 py-5">
            <div className="flex flex-col gap-4 text-sm">
              <button onClick={() => scrollToSection("home")} className="text-left text-white/70 hover:text-gold">
                Home
              </button>
              <button onClick={() => scrollToSection("properties")} className="text-left text-white/70 hover:text-gold">
                Properties
              </button>
              <button onClick={() => scrollToSection("jv")} className="text-left text-white/70 hover:text-gold">
                Joint Ventures
              </button>
              <button onClick={() => scrollToSection("why")} className="text-left text-white/70 hover:text-gold">
                Investors
              </button>
              <button onClick={() => scrollToSection("about")} className="text-left text-white/70 hover:text-gold">
                About
              </button>
              <button
                onClick={() => setModal("register")}
                className="bg-gold text-navy px-5 py-2.5 rounded-lg text-sm font-semibold mt-2"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </header>

      {successMessage && (
        <div className="fixed top-24 right-6 z-[90] bg-white border border-gray-200 shadow-lg rounded-xl px-5 py-4">
          <p className="text-sm font-semibold text-navy">{successMessage}</p>
        </div>
      )}

      <section
        id="home"
        className="bg-navy relative overflow-hidden px-6 lg:px-10 pt-36 pb-20"
      >
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-24 right-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/25 text-gold-light px-3 py-1.5 rounded-full text-xs font-medium mb-7">
              ✦ Nigeria&apos;s verified investment marketplace
            </div>

            <h1 className="text-white text-4xl lg:text-6xl font-bold leading-tight mb-5 tracking-tight">
              Where real capital meets
              <br />
              <span className="text-gold">verified</span> real estate
            </h1>

            <p className="text-white/55 text-base lg:text-xl leading-relaxed mb-10 max-w-2xl">
              Connect with verified property owners, developers, landowners, and joint venture opportunities through a marketplace built for transparency and institutional standards.
            </p>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => scrollToSection("properties")}
                className="bg-gold text-navy font-semibold px-6 py-3 rounded-lg text-sm hover:bg-gold-light transition-colors"
              >
                Explore opportunities
              </button>

              <button
                onClick={() => setModal("post")}
                className="border border-white/25 text-white font-medium px-6 py-3 rounded-lg text-sm hover:bg-white/10 transition-colors"
              >
                + Post your opportunity
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14 pt-8 border-t border-white/10">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-white text-2xl font-bold">{s.num}</div>
                  <div className="text-white/40 text-xs uppercase tracking-wide mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-white/8 border border-white/10 rounded-3xl p-6 backdrop-blur shadow-2xl">
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="h-52 bg-gradient-to-br from-gold/80 to-navy-light flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-3">🏙️</div>
                    <p className="text-white font-bold text-xl">
                      Premium Property Deal
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gold-muted bg-gold/10 px-3 py-1 rounded-full">
                      VERIFIED
                    </span>
                    <span className="text-xs text-gray-400">Abuja, Nigeria</span>
                  </div>

                  <h3 className="text-xl font-bold text-navy-mid mb-2">
                    Luxury Mixed-use Development
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    A verified investment opportunity with document-backed ownership, developer profile, and JV structure.
                  </p>

                  <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-5">
                    <div>
                      <p className="text-xs text-gray-400">Value</p>
                      <p className="font-bold text-navy">₦3.5B</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">ROI</p>
                      <p className="font-bold text-navy">24%</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Status</p>
                      <p className="font-bold text-navy">Open</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setModal("investor")}
                    className="w-full bg-navy text-white py-3 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors mt-6"
                  >
                    Request access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

            <div className="px-6 lg:px-10">
        <form
          onSubmit={handleSearch}
          className="bg-white border border-gray-200 rounded-xl p-5 -mt-8 relative z-10 shadow-sm max-w-7xl mx-auto"
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Search investments
            </p>

            {(keyword || selectedState || type) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-medium text-gold-muted hover:text-gold"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                Keyword
              </label>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Location, project..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                State
              </label>
              <input
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                placeholder="Lagos, Abuja..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy"
              >
                <option value="">All types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
                <option value="joint_venture">Joint Venture</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-navy text-white py-2.5 px-5 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <section
        id="properties"
        className="max-w-7xl mx-auto px-6 lg:px-10 py-16"
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-semibold text-gold-muted uppercase tracking-widest mb-2">
              Featured opportunities
            </p>
            <h2 className="text-2xl font-bold text-navy-mid tracking-tight">
              Premium verified listings
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Showing {filteredFeatured.length} verified result
              {filteredFeatured.length === 1 ? "" : "s"}
            </p>
          </div>

          <button
            onClick={resetFilters}
            className="text-sm text-gold-muted font-medium hover:text-gold"
          >
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredFeatured.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-gold-muted font-semibold">
                  {item.type}
                </p>
                <p className="text-xs text-gray-400">{item.status}</p>
              </div>

              <h3 className="text-lg font-bold text-navy-mid mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500 mb-4">{item.location}</p>

              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                {item.summary}
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 mb-5">
                <div>
                  <p className="text-xs text-gray-400">Price</p>
                  <p className="text-lg font-bold text-navy">{item.price}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Projected ROI</p>
                  <p className="text-lg font-bold text-navy">{item.roi}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedListing(item)}
                className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
              >
                View details
              </button>
            </div>
          ))}

          {filteredFeatured.length === 0 && (
            <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl p-8 text-center">
              <h3 className="text-lg font-bold text-navy-mid mb-2">
                No matching opportunities found
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                Try searching another location, keyword, or property type.
              </p>
              <button
                onClick={resetFilters}
                className="bg-navy text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="jv" className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] font-semibold text-gold-muted uppercase tracking-widest mb-2">
                Joint ventures
              </p>

              <h2 className="text-2xl font-bold text-navy-mid tracking-tight">
                Active JV opportunities
              </h2>
            </div>

            <button className="text-sm text-gold-muted font-medium hover:text-gold">
              View all JV deals →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {JV_DEALS.map((deal) => (
              <div
                key={deal.title}
                className="bg-surface border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gold-muted bg-gold/10 px-3 py-1 rounded-full">
                    JV OPEN
                  </span>

                  <span className="text-xs text-gray-400">
                    {deal.location}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-navy-mid mb-3">
                  {deal.title}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Verified developer-backed opportunity with structured equity, projected returns, and investor documentation.
                </p>

                <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-5 mb-5">
                  <div>
                    <p className="text-xs text-gray-400">Project Value</p>
                    <p className="font-bold text-navy">{deal.value}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Equity</p>
                    <p className="font-bold text-navy">{deal.equity}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Projected ROI</p>
                    <p className="font-bold text-navy">{deal.roi}</p>
                  </div>
                </div>

                <button
                  onClick={() => setModal("investor")}
                  className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
                >
                  Request JV access
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

            <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-[11px] font-semibold text-gold-muted uppercase tracking-widest mb-2">
            Browse by category
          </p>

          <h2 className="text-2xl font-bold text-navy-mid tracking-tight mb-8">
            Investment categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.label}
                onClick={() => handleCategoryClick(c.typeValue)}
                className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:shadow-sm hover:border-gold/50 transition-all"
              >
                <div className="text-3xl mb-3">{c.icon}</div>

                <p className="text-sm font-semibold text-navy-mid mb-1">
                  {c.label}
                </p>

                <p className="text-xs text-gray-400">{c.count} listings</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="bg-surface border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-[11px] font-semibold text-gold-muted uppercase tracking-widest mb-2">
            Why INAMAAD
          </p>

          <h2 className="text-2xl font-bold text-navy-mid tracking-tight mb-10">
            Built for serious investors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHY.map((w) => (
              <div
                key={w.title}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-gold" />
                </div>

                <h3 className="text-sm font-semibold text-navy-mid mb-2">
                  {w.title}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed">
                  {w.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="bg-navy rounded-2xl px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-white text-2xl font-bold mb-3">
              Ready to invest with confidence?
            </h2>

            <p className="text-white/50 text-sm leading-relaxed max-w-md">
              Join investors, developers, and landowners already using INAMAAD to discover verified real estate opportunities.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setModal("register")}
              className="bg-gold text-navy font-semibold px-6 py-3 rounded-lg text-sm hover:bg-gold-light transition-colors"
            >
              Create free account
            </button>

            <button
              onClick={() => setModal("post")}
              className="border border-white/25 text-white font-medium px-5 py-3 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              Post opportunity
            </button>
          </div>
        </div>
      </section>

            {selectedListing && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-bold text-gold-muted mb-2">
                  {selectedListing.type}
                </p>
                <h2 className="text-2xl font-bold text-navy-mid">
                  {selectedListing.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedListing(null)}
                className="text-gray-400 hover:text-navy text-2xl"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-5">
              {selectedListing.summary}
            </p>

            <div className="grid grid-cols-2 gap-4 bg-surface rounded-xl p-5 mb-6">
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="font-semibold text-navy">{selectedListing.location}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Price</p>
                <p className="font-semibold text-navy">{selectedListing.price}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Projected ROI</p>
                <p className="font-semibold text-navy">{selectedListing.roi}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p className="font-semibold text-navy">{selectedListing.status}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedListing(null);
                setModal("investor");
              }}
              className="w-full bg-navy text-white py-3 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
            >
              Request investor access
            </button>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center px-6 py-10">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-bold text-gold-muted uppercase tracking-widest mb-2">
                  INAMAAD
                </p>
                <h2 className="text-2xl font-bold text-navy-mid">
                  {modal === "login" && "Sign in"}
                  {modal === "register" && "Create your account"}
                  {modal === "post" && "Post opportunity"}
                  {modal === "investor" && "Request investor access"}
                  {modal === "admin" && "Admin dashboard"}
                </h2>
              </div>

              <button
                onClick={() => setModal(null)}
                className="text-gray-400 hover:text-navy text-2xl"
              >
                ×
              </button>
            </div>

            {modal === "login" && (
              <form
                onSubmit={(e) => handleAuthSubmit(e, "You are signed in successfully.")}
                className="space-y-4"
              >
                <input required type="email" placeholder="Email address" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />
                <input required type="password" placeholder="Password" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />
                <button className="w-full bg-navy text-white py-3 rounded-lg text-sm font-semibold">
                  Sign in
                </button>
              </form>
            )}

            {modal === "register" && (
              <form
                onSubmit={(e) => handleAuthSubmit(e, "Account created successfully.")}
                className="space-y-4"
              >
                <input required placeholder="Full name" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />
                <input required type="email" placeholder="Email address" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />
                <select className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy">
                  <option>Investor</option>
                  <option>Developer</option>
                  <option>Landowner</option>
                  <option>Agent</option>
                </select>
                <input required type="password" placeholder="Password" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />
                <button className="w-full bg-navy text-white py-3 rounded-lg text-sm font-semibold">
                  Create account
                </button>
              </form>
            )}

            {modal === "post" && (
              <form onSubmit={handlePostListing} className="space-y-4">
                <input required value={newListing.title} onChange={(e) => setNewListing({ ...newListing, title: e.target.value })} placeholder="Opportunity title" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />
                <input required value={newListing.location} onChange={(e) => setNewListing({ ...newListing, location: e.target.value })} placeholder="Location" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />
                <input required value={newListing.state} onChange={(e) => setNewListing({ ...newListing, state: e.target.value })} placeholder="State" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />
                <input required value={newListing.price} onChange={(e) => setNewListing({ ...newListing, price: e.target.value })} placeholder="Price, e.g. ₦500M" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />

                <select value={newListing.typeValue} onChange={(e) => setNewListing({ ...newListing, typeValue: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy">
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                  <option value="joint_venture">Joint Venture</option>
                </select>

                <input value={newListing.roi} onChange={(e) => setNewListing({ ...newListing, roi: e.target.value })} placeholder="Projected ROI, e.g. 20%" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />

                <textarea required value={newListing.summary} onChange={(e) => setNewListing({ ...newListing, summary: e.target.value })} placeholder="Short summary of the opportunity" rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />

                <button className="w-full bg-navy text-white py-3 rounded-lg text-sm font-semibold">
                  Submit opportunity
                </button>
              </form>
            )}

            {modal === "investor" && (
              <form
                onSubmit={(e) => handleAuthSubmit(e, "Investor access request submitted.")}
                className="space-y-4"
              >
                <input required placeholder="Full name" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />
                <input required type="email" placeholder="Email address" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />
                <input required placeholder="Investment budget, e.g. ₦100M - ₦500M" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />
                <textarea rows={4} placeholder="Tell us what kind of opportunity you want" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy" />
                <button className="w-full bg-navy text-white py-3 rounded-lg text-sm font-semibold">
                  Submit request
                </button>
              </form>
            )}

            {modal === "admin" && !adminUnlocked && (
  <form onSubmit={unlockAdmin} className="space-y-4">
    <p className="text-sm text-gray-500">
      Enter the admin password to manage listings.
    </p>

    <input
      required
      type="password"
      value={adminPassword}
      onChange={(e) => setAdminPassword(e.target.value)}
      placeholder="Admin password"
      className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-navy"
    />

    <button className="w-full bg-navy text-white py-3 rounded-lg text-sm font-semibold">
      Unlock admin
    </button>
  </form>
)}

{modal === "admin" && adminUnlocked && (
              <div className="space-y-4">
                <div className="bg-surface border border-gray-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-navy mb-1">
                    Total opportunities: {listings.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    Approve pending opportunities or remove bad listings from the platform.
                  </p>
                </div>

                {listings.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="text-xs font-bold text-gold-muted mb-1">
                          {item.type}
                        </p>
                        <h3 className="font-bold text-navy-mid">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.location} · {item.price}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          item.status === "Verified"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 leading-relaxed mb-4">
                      {item.summary}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => approveListing(item.id)}
                        className="flex-1 bg-navy text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => deleteListing(item.id)}
                        className="flex-1 border border-red-200 text-red-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {listings.length === 0 && (
                  <div className="border border-gray-200 rounded-xl p-6 text-center">
                    <p className="text-sm text-gray-500">
                      No opportunities available yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}