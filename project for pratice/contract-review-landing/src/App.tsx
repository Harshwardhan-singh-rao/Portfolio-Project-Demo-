import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileSearch, ShieldCheck, PlayCircle, LineChart, Brain, Building2, Lock, Linkedin, Twitter, Youtube } from 'lucide-react'

function Section({ id, children, className = '' }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="container-xl">{children}</div>
    </section>
  )
}

function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-graylight">
      <div className="container-xl py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          <h1 className="section-title text-navy">
            Instantly Detect Contract Risks Before You Sign.
          </h1>
          <p className="mt-4 text-lg subtext">
            AI that reviews, flags, and benchmarks your contracts in seconds — saving hours of legal review.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="#demo" className="btn-primary">Get a Demo</a>
            <a href="#how" className="btn-secondary"><PlayCircle className="mr-2 h-5 w-5"/>Watch in Action</a>
          </div>
        </motion.div>
      </div>
      <div className="absolute -right-16 top-10 h-72 w-[42rem] rounded-2xl bg-white/70 shadow-xl ring-1 ring-slate-200 backdrop-blur-sm hidden md:block">
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-electric/20 via-electric/5 to-transparent animate-pulse"/>
      </div>
    </div>
  )
}

function HowItWorks() {
  const steps = [
    { icon: Upload, title: 'Upload Contract', desc: 'PDF or DOCX — drag and drop or import from Drive.' },
    { icon: FileSearch, title: 'AI Analyzes Clauses & Terms', desc: 'Understands indemnities, liabilities, payments, and more.' },
    { icon: ShieldCheck, title: 'See Risks & Suggestions', desc: 'Get negotiation tips and standard positions instantly.' },
  ]
  return (
    <Section id="how">
      <div className="text-center">
        <h2 className="section-title">How It Works</h2>
        <p className="mt-3 subtext">From upload to insights in seconds.</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, desc }) => (
          <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <Icon className="h-8 w-8 text-electric" />
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 subtext">{desc}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-10 rounded-xl border border-dashed border-slate-300 p-8 text-center subtext">
        Short demo will appear here (add GIF/Lottie later).
      </div>
    </Section>
  )
}

function Features() {
  const features = [
    { icon: FileSearch, title: 'Clause Detection', desc: 'Instantly highlights indemnities, liabilities, and payment risks.' },
    { icon: LineChart, title: 'Benchmark Insights', desc: 'Suggests industry-standard positions based on precedent data.' },
    { icon: Brain, title: 'Smart Summaries', desc: 'Turns 20-page contracts into 5 bullet points.' },
    { icon: Building2, title: 'Integrations', desc: 'Works with DocuSign, Google Drive, and Slack.' },
  ]
  return (
    <Section>
      <div className="grid gap-10 md:grid-cols-2">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-4">
            <div className="rounded-lg bg-electric/10 p-3 text-electric"><Icon className="h-6 w-6"/></div>
            <div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-1 subtext">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Value() {
  return (
    <Section>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="section-title">Why Choose Us</h2>
          <ul className="mt-6 space-y-3">
            <li className="flex items-start gap-3"><span className="text-2xl font-extrabold text-navy">80%</span><span className="subtext">Reduce review time by 80%.</span></li>
            <li className="flex items-start gap-3"><span className="text-2xl font-extrabold text-navy">1000s</span><span className="subtext">Catch hidden risks missed by manual review.</span></li>
          </ul>
        </div>
        <div className="grid gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-semibold">“Game changer for our sales contracts.”</p>
            <p className="mt-2 subtext">Head of Legal, Acme Corp</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-semibold">“We close deals faster with fewer surprises.”</p>
            <p className="mt-2 subtext">COO, BetaWorks</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

function Pricing() {
  const tiers = [
    { name: 'Startup', price: '$49/mo', features: ['Up to 20 contracts', 'Clause detection', 'Email support'], cta: 'Get Started' },
    { name: 'Business', price: '$149/mo', features: ['Up to 200 contracts', 'Benchmarks', 'Slack support'], cta: 'Start Trial', featured: true },
    { name: 'Enterprise', price: 'Contact Sales', features: ['Unlimited', 'SSO, SOC2', 'Dedicated support'], cta: 'Contact Sales' },
  ]
  return (
    <Section id="pricing" className="bg-graylight">
      <div className="text-center">
        <h2 className="section-title">Pricing</h2>
        <p className="mt-3 subtext">Simple, transparent plans.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {tiers.map(t => (
          <div key={t.name} className={`rounded-2xl border ${t.featured ? 'border-electric' : 'border-slate-200'} bg-white p-6 shadow-sm`}>
            <h3 className="text-xl font-bold">{t.name}</h3>
            <p className="mt-2 text-3xl font-extrabold text-navy">{t.price}</p>
            <ul className="mt-4 space-y-2 subtext">
              {t.features.map(f => <li key={f}>• {f}</li>)}
            </ul>
            <a href="#demo" className={`mt-6 inline-flex w-full justify-center rounded-lg px-4 py-2 font-semibold ${t.featured ? 'bg-electric text-white' : 'border border-slate-300 text-slate-800'}`}>{t.cta}</a>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Security() {
  return (
    <Section className="bg-navy text-white">
      <div className="text-center">
        <h2 className="section-title text-white">Security & Compliance</h2>
        <p className="mt-3 text-blue-100">SOC 2 • GDPR • ISO 27001 compliant</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {["SOC 2", "GDPR", "ISO 27001"].map(b => (
          <div key={b} className="rounded-xl border border-white/20 bg-white/5 p-6 text-center">
            <Lock className="mx-auto h-8 w-8 text-electric"/>
            <p className="mt-2 font-semibold">{b}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

function CTA() {
  return (
    <Section id="demo">
      <div className="rounded-2xl bg-gradient-to-r from-electric to-blue-600 p-8 text-white shadow">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-2xl font-extrabold">Ready to finalize contracts 10× faster?</h3>
          <a href="mailto:sales@example.com" className="rounded-lg bg-white px-5 py-3 font-semibold text-navy hover:opacity-90">Book a Demo →</a>
        </div>
      </div>
    </Section>
  )
}

function Footer() {
  return (
    <footer className="bg-navy py-10 text-white">
      <div className="container-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="font-extrabold">Contract AI</div>
          <nav className="flex flex-wrap gap-6 text-blue-100">
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Careers</a>
            <a href="#" className="hover:text-white">Blog</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
          </nav>
          <div className="flex items-center gap-4 text-blue-200">
            <a href="#" aria-label="LinkedIn" className="hover:text-white"><Linkedin /></a>
            <a href="#" aria-label="X" className="hover:text-white"><Twitter /></a>
            <a href="#" aria-label="YouTube" className="hover:text-white"><Youtube /></a>
          </div>
        </div>
        <p className="mt-6 text-blue-200">© {new Date().getFullYear()} Contract AI. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <Features />
      <Value />
      <Pricing />
      <Security />
      <CTA />
      <Footer />
    </div>
  )
}
