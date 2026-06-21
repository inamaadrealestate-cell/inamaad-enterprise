# INAMAAD One-Click About Page Update
# This updates ONLY the About section inside your existing index.tsx.
# It does NOT replace your full project.
# It creates a backup first and restores backup if build fails.

$ErrorActionPreference = "Stop"

$ProjectPath = "C:\Users\user pc\Desktop\inamaad-enterprise"
$TargetFile = Join-Path $ProjectPath "index.tsx"

if (!(Test-Path $ProjectPath)) {
  throw "Project folder not found: $ProjectPath"
}

if (!(Test-Path $TargetFile)) {
  throw "index.tsx not found here: $TargetFile"
}

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupFile = Join-Path $ProjectPath "index-before-about-update-$Timestamp.tsx"

Copy-Item $TargetFile $BackupFile -Force
Write-Host "Backup created: $BackupFile" -ForegroundColor Yellow

$Content = Get-Content $TargetFile -Raw

$StartMarker = '        <section id="about"'
$EndMarker = '        <section id="contact"'

$StartIndex = $Content.IndexOf($StartMarker)

if ($StartIndex -lt 0) {
  Copy-Item $BackupFile $TargetFile -Force
  throw "Could not find About section marker. Backup restored."
}

$EndIndex = $Content.IndexOf($EndMarker, $StartIndex)

if ($EndIndex -lt 0) {
  Copy-Item $BackupFile $TargetFile -Force
  throw "Could not find Contact section after About. Backup restored."
}

$PremiumAboutSection = @'
        <section id="about" className="bg-[#0F172A] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#C9A227]/30 bg-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#C9A227]">
                  <span className="h-2 w-2 rounded-full bg-[#C9A227]" />
                  INAMAAD Real Estate
                </div>

                <h2 className="max-w-5xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl">
                  Building Trust, Transparency, and Opportunity in Real Estate.
                </h2>

                <p className="mt-6 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg lg:text-xl lg:leading-9">
                  INAMAAD connects investors, developers, landowners, and verified opportunities through a technology-driven platform designed to support strategic partnerships, investment growth, and long-term value creation.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.hash = "properties";
                    }}
                    className="rounded-2xl bg-[#C9A227] px-6 py-4 text-sm font-black uppercase tracking-wide text-[#0F172A] shadow-lg shadow-[#C9A227]/20 transition hover:bg-[#d7b13a]"
                  >
                    Explore Opportunities
                  </button>

                  <button
                    type="button"
                    onClick={() => setModal("investor")}
                    className="rounded-2xl border border-white/15 px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:border-[#C9A227] hover:bg-white/5"
                  >
                    Investor Enquiry
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-[2.4rem] bg-[#C9A227]/10 blur-2xl" />
                <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur">
                  <div className="rounded-[1.8rem] border border-white/10 bg-[#111c31] p-5">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#C9A227]">
                          Strategic marketplace
                        </p>
                        <p className="mt-2 text-2xl font-black text-white">
                          Verified Opportunity Network
                        </p>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A227] text-xl font-black text-[#0F172A]">
                        IN
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        ["Investors", "Access structured opportunities"],
                        ["Developers", "Source land and JV partners"],
                        ["Landowners", "Connect with capable partners"],
                        ["Verified Deals", "Improve trust before commitment"],
                      ].map(([title, text]) => (
                        <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                          <p className="text-sm font-black text-white">{title}</p>
                          <p className="mt-1 text-xs leading-5 text-slate-400">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="sticky top-28 hidden lg:block">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C9A227]">
                About INAMAAD
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#0F172A]">
                A trusted platform for capital, opportunity, and expertise.
              </h2>
              <div className="mt-8 h-1 w-24 rounded-full bg-[#C9A227]" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C9A227] lg:hidden">
                About INAMAAD
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#0F172A] sm:text-4xl lg:hidden">
                About INAMAAD
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9 lg:mt-0">
                <p>
                  INAMAAD is a real estate investment and joint venture marketplace built to bring greater transparency, trust, and structure to the real estate sector. Our platform connects investors, developers, landowners, and verified opportunities through a technology-driven ecosystem designed to simplify deal discovery, foster strategic partnerships, and support informed decision-making.
                </p>

                <p>
                  We believe that access to quality opportunities should be matched by access to reliable information. By emphasizing verification, accountability, and professional standards, INAMAAD seeks to reduce friction within the market and create an environment where stakeholders can engage with confidence.
                </p>

                <p>
                  Beyond traditional property transactions, INAMAAD is designed to support land acquisitions, development partnerships, joint ventures, and investment-driven opportunities. Our goal is to provide a trusted platform where capital, opportunity, and expertise come together to unlock sustainable growth and long-term value.
                </p>

                <p>
                  As the platform continues to evolve, our vision is to become a leading gateway for verified real estate opportunities and strategic partnerships across Nigeria and the broader African market.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C9A227]">
                  Our Mission
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-[#0F172A] sm:text-5xl">
                  Our Mission
                </h2>
              </div>

              <p className="text-base leading-8 text-slate-600 sm:text-xl sm:leading-10">
                To create a trusted ecosystem where verified opportunities, transparent information, and meaningful partnerships enable investors, developers, landowners, and industry professionals to transact and collaborate with confidence.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#0F172A] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C9A227]">
                Founder &amp; CEO
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Founder &amp; Chief Executive Officer
              </h2>
            </div>

            <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl">
                <div className="flex min-h-[420px] flex-col justify-between rounded-[1.6rem] bg-gradient-to-br from-slate-800 via-[#111c31] to-[#0F172A] p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#C9A227]">
                      Leadership
                    </span>
                    <span className="text-sm font-black text-white/50">INAMAAD</span>
                  </div>

                  <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 text-5xl font-black text-[#C9A227] shadow-2xl sm:h-60 sm:w-60 sm:text-6xl">
                    DIY
                  </div>

                  <div>
                    <p className="text-2xl font-black text-white">Dahir Ishaq Yunus</p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#C9A227]">
                      Founder &amp; Chief Executive Officer
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 sm:p-8 lg:p-10">
                <div className="space-y-5 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                  <p>
                    Dahir Ishaq Yunus is the Founder and Chief Executive Officer of INAMAAD, a real estate investment and joint venture marketplace established to bring greater transparency, trust, and structure to the real estate sector. Driven by a vision to modernize how property opportunities are discovered, evaluated, and transacted, he founded INAMAAD to bridge the gap between investors, developers, landowners, and verified opportunities through a trusted digital ecosystem.
                  </p>

                  <p>
                    Recognizing the challenges that have long affected the industry—including fragmented deal flow, limited access to credible opportunities, and the lack of transparency that often undermines investor confidence—Dahir set out to build a platform that prioritizes accountability, verification, and professional standards.
                  </p>

                  <p>
                    As an entrepreneur with a strong interest in real estate, technology, and investment-driven solutions, Dahir is committed to leveraging innovation to improve how opportunities are sourced, evaluated, and managed.
                  </p>

                  <p>
                    Today, his vision is to establish INAMAAD as a leading gateway for verified real estate opportunities, strategic partnerships, and investment-driven development across Nigeria and the broader African market.
                  </p>
                </div>

                <blockquote className="mt-8 rounded-[1.6rem] border-l-4 border-[#C9A227] bg-[#C9A227]/10 p-5 text-base font-semibold leading-8 text-white sm:text-lg sm:leading-9">
                  “We are building more than a marketplace. We are building the trusted infrastructure that connects capital, opportunity, and people to unlock the next generation of real estate growth across Africa.”
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C9A227]">
                Leadership Vision
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#0F172A] sm:text-5xl">
                Leadership Vision
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
              <p>
                At INAMAAD, we believe that sustainable growth in real estate requires more than access to opportunities—it requires confidence in the people, information, and processes behind them.
              </p>

              <p>
                Through technology, innovation, and professional standards, we are creating an ecosystem where investors, developers, landowners, and industry professionals can discover opportunities, build partnerships, and create long-term value with greater trust and transparency.
              </p>

              <p className="font-semibold text-[#0F172A]">
                Our vision is to become one of Africa's most trusted platforms for real estate investment, land acquisition, and joint venture development.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C9A227]">
                Core Values
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#0F172A] sm:text-5xl">
                Principles that guide the platform.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["Trust", "We prioritize integrity, accountability, and transparency."],
                ["Verification", "Every opportunity should be supported by credible information."],
                ["Partnership", "Strong relationships drive successful outcomes."],
                ["Innovation", "Technology should simplify and strengthen real estate transactions."],
                ["Long-Term Value", "We focus on sustainable growth and meaningful impact."],
              ].map(([title, text]) => (
                <div key={title} className="group rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#C9A227] hover:shadow-xl">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F172A] text-lg font-black text-[#C9A227] transition group-hover:bg-[#C9A227] group-hover:text-[#0F172A]">
                    {title.slice(0, 1)}
                  </div>
                  <h3 className="text-lg font-black text-[#0F172A]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0F172A] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#C9A227]/30 bg-white/[0.06] p-6 text-center shadow-2xl sm:p-10 lg:p-14">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C9A227]">
              Start with confidence
            </p>
            <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">
              Ready to Explore Verified Opportunities?
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "properties";
                }}
                className="rounded-2xl bg-[#C9A227] px-6 py-4 text-sm font-black uppercase tracking-wide text-[#0F172A] shadow-lg shadow-[#C9A227]/20 transition hover:bg-[#d7b13a]"
              >
                Browse Opportunities
              </button>
              <button
                type="button"
                onClick={() => setModal("register")}
                className="rounded-2xl border border-white/15 px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:border-[#C9A227] hover:bg-white/5"
              >
                Create Account
              </button>
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
'@

$UpdatedContent =
  $Content.Substring(0, $StartIndex) +
  $PremiumAboutSection.TrimEnd() +
  "`r`n`r`n" +
  $Content.Substring($EndIndex)

Set-Content -Path $TargetFile -Value $UpdatedContent -Encoding UTF8

Write-Host "About section updated only. Your full index.tsx was not replaced." -ForegroundColor Green

Set-Location $ProjectPath

Write-Host "Running build..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. Restoring backup..." -ForegroundColor Red
  Copy-Item $BackupFile $TargetFile -Force
  Write-Host "Backup restored: $BackupFile" -ForegroundColor Yellow
  exit 1
}

Write-Host "Build passed. Now run: npm run dev" -ForegroundColor Green
