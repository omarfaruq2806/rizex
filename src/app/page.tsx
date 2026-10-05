'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HomeLoader } from '@/components/ui/home-loader';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  FileText,
  MessageSquare,
  ChevronRight,
  Star,
  Users,
  Code2,
  Smartphone,
  Cpu,
  HelpCircle,
  Check,
  Calculator,
  Terminal,
  Workflow,
  Laptop
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  startingPrice?: number | string;
  currency?: string;
  category?: { name: string };
  deliveryTime?: string;
}

interface ReviewItem {
  id: string;
  rating: number;
  comment?: string;
  client?: { name: string };
  order?: { title: string; service?: { name: string } };
}

// Fallback high quality services if backend is empty during initial setup
const FALLBACK_SERVICES: ServiceItem[] = [
  {
    id: '1',
    name: 'Full-Stack Next.js 16 Web Application',
    slug: 'full-stack-nextjs-web-app',
    description: 'Production-ready web application with React 19, TypeScript, PostgreSQL, Better Auth, and responsive Tailwind UI.',
    startingPrice: '15,000',
    currency: 'BDT',
    category: { name: 'Web & SaaS' },
    deliveryTime: '5-7 Days',
  },
  {
    id: '2',
    name: 'Premium UI/UX Design & Design System',
    slug: 'premium-ui-ux-design-system',
    description: 'High-converting Figma prototypes, interactive micro-animations, scalable token systems, and polished developer handoff.',
    startingPrice: '8,000',
    currency: 'BDT',
    category: { name: 'UI/UX Design' },
    deliveryTime: '3-5 Days',
  },
  {
    id: '3',
    name: 'Cross-Platform Mobile App (Flutter / React Native)',
    slug: 'cross-platform-mobile-app',
    description: 'Native-feel iOS and Android mobile app development with offline caching, push notifications, and API integrations.',
    startingPrice: '20,000',
    currency: 'BDT',
    category: { name: 'Mobile Apps' },
    deliveryTime: '10-14 Days',
  },
  {
    id: '4',
    name: 'Cloud Infrastructure & DevOps CI/CD',
    slug: 'cloud-infrastructure-devops',
    description: 'Automated Docker containerization, Kubernetes clusters, GitHub Actions CI/CD pipelines, and AWS/GCP deployments.',
    startingPrice: '10,000',
    currency: 'BDT',
    category: { name: 'DevOps & Cloud' },
    deliveryTime: '2-4 Days',
  },
  {
    id: '5',
    name: 'AI Agent & LLM Workflow Automation',
    slug: 'ai-agent-workflow-automation',
    description: 'Custom AI agents, LangChain/LlamaIndex pipelines, automated customer support bots, and vector database search.',
    startingPrice: '12,000',
    currency: 'BDT',
    category: { name: 'AI & Automation' },
    deliveryTime: '4-6 Days',
  },
  {
    id: '6',
    name: 'API Development & High-Throughput Backend',
    slug: 'api-development-database-architecture',
    description: 'High-throughput NestJS/Node.js REST & GraphQL APIs, Prisma/Drizzle ORM architecture, and Redis caching layers.',
    startingPrice: '9,500',
    currency: 'BDT',
    category: { name: 'Backend & APIs' },
    deliveryTime: '3-5 Days',
  },
];

const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    id: 'r1',
    rating: 5,
    comment: 'The structured dynamic brief system saved us days of back-and-forth emails. The team delivered our full SaaS MVP 3 days ahead of schedule!',
    client: { name: 'Tanvir Ahmed' },
    order: { title: 'Fintech Analytics Dashboard', service: { name: 'Web & SaaS' } },
  },
  {
    id: 'r2',
    rating: 5,
    comment: 'Clean code, excellent milestone updates, and clear escrow milestone releases. Highly recommended for any fast-moving startup.',
    client: { name: 'Sadia Rahman' },
    order: { title: 'E-commerce Mobile App', service: { name: 'Mobile Apps' } },
  },
  {
    id: 'r3',
    rating: 5,
    comment: 'Transparent pricing with milestone quotes. No unexpected charges and direct real-time access to top-notch engineers.',
    client: { name: 'Mahmudul Hasan' },
    order: { title: 'Enterprise Design System', service: { name: 'UI/UX Design' } },
  },
];

const TECH_STACK_ITEMS = [
  { name: 'Next.js 16', role: 'Full-Stack Framework' },
  { name: 'React 19', role: 'Modern UI Engine' },
  { name: 'TypeScript', role: 'Type-Safe Architecture' },
  { name: 'Tailwind CSS', role: 'Design System' },
  { name: 'Flutter', role: 'Cross-Platform Mobile' },
  { name: 'Node.js & NestJS', role: 'High-Scale Backend' },
  { name: 'PostgreSQL & Prisma', role: 'Relational Database' },
  { name: 'Docker & Kubernetes', role: 'DevOps & Cloud' },
  { name: 'AI Agents & LLMs', role: 'Autonomous Workflows' },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Live Estimator State
  const [estimatorType, setEstimatorType] = useState<'web' | 'mobile' | 'design' | 'ai'>('web');
  const [estimatorTier, setEstimatorTier] = useState<'mvp' | 'growth' | 'enterprise'>('growth');
  const [includeDevOps, setIncludeDevOps] = useState<boolean>(true);

  // Calculate estimated price & milestones dynamically
  const estimatedData = useMemo(() => {
    let base = 12000;
    let days = 5;
    let milestones = [
      { name: 'Architecture & Wireframes', pct: 30 },
      { name: 'Core Functionality Build', pct: 40 },
      { name: 'QA, Testing & Launch', pct: 30 },
    ];

    if (estimatorType === 'web') {
      base = 15000;
      days = 6;
    } else if (estimatorType === 'mobile') {
      base = 20000;
      days = 10;
    } else if (estimatorType === 'design') {
      base = 8000;
      days = 4;
    } else if (estimatorType === 'ai') {
      base = 14000;
      days = 5;
    }

    if (estimatorTier === 'mvp') {
      base *= 0.8;
      days = Math.max(3, days - 2);
    } else if (estimatorTier === 'enterprise') {
      base *= 2.2;
      days = Math.round(days * 1.8);
    }

    if (includeDevOps) {
      base += 4500;
      days += 1;
    }

    return {
      price: Math.round(base),
      days,
      milestones,
    };
  }, [estimatorType, estimatorTier, includeDevOps]);

  // Fetch services for featured grid
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['featured-services'],
    queryFn: async () => {
      try {
        const res: any = await apiClient.get('/services?limit=6');
        const payload = res?.data !== undefined ? res.data : res;
        return payload?.items || (Array.isArray(payload) ? payload : []);
      } catch {
        return [];
      }
    },
  });

  // Fetch reviews for testimonials
  const { data: reviewsData } = useQuery({
    queryKey: ['featured-reviews'],
    queryFn: async () => {
      try {
        const res: any = await apiClient.get('/reviews/featured?limit=3');
        const payload = res?.data !== undefined ? res.data : res;
        return Array.isArray(payload) ? payload : [];
      } catch {
        return [];
      }
    },
  });

  const apiServices: ServiceItem[] = Array.isArray(servicesData)
    ? servicesData
    : (servicesData as any)?.items || [];
  
  const services: ServiceItem[] = apiServices.length > 0 ? apiServices : FALLBACK_SERVICES;
  
  const apiReviews: ReviewItem[] = Array.isArray(reviewsData) ? reviewsData : [];
  const reviews: ReviewItem[] = apiReviews.length > 0 ? apiReviews : FALLBACK_REVIEWS;

  const categories = ['All', 'Web & SaaS', 'UI/UX Design', 'Mobile Apps', 'DevOps & Cloud', 'AI & Automation'];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter((s) => s.category?.name?.toLowerCase().includes(selectedCategory.toLowerCase()));

  const faqs = [
    {
      q: 'How does RizeX custom quote pricing work?',
      a: 'When you select a service, you fill in tailored requirement fields (e.g. tech stack, page count, timeline). Our team reviews your exact specs and sends a structured quote with itemized milestones and advance payment terms within a few hours.',
    },
    {
      q: 'Can I request revisions after delivery?',
      a: 'Yes! Every milestone includes structured revision rounds. You can inspect deliverables directly in your client dashboard, highlight granular feedback, and request changes before marking the milestone as approved.',
    },
    {
      q: 'How do milestone payments and escrow work?',
      a: 'Payments are held securely in escrow per milestone. Specialists are only credited once you review and approve each completed stage of work, ensuring 100% peace of mind.',
    },
    {
      q: 'Who works on my project?',
      a: 'Your project is assigned to thoroughly vetted senior engineers, UI/UX designers, or DevOps specialists. You have direct order-scoped real-time messaging with your assigned specialist.',
    },
  ];

  return (
    <>
      <HomeLoader />
      <div className="flex flex-col bg-slate-50/50 text-slate-900 overflow-hidden">
        {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-gradient-to-b from-white via-orange-50/20 to-slate-50/60 relative">
        {/* Glow & Grid Accents */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-200/30 blur-[100px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-amber-200/25 blur-[90px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-100/40 blur-[80px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-semibold shadow-2xs mb-8 hover:bg-orange-100/70 transition-colors backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Next-Generation Digital Service Agency</span>
            <span className="text-orange-300 font-normal">|</span>
            <span className="inline-flex items-center gap-1 font-medium text-orange-600">
              Explore Catalog <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.14] max-w-4xl font-sans">
            High Velocity Digital Services. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              Transparent Brief to Delivery.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Submit custom brief requirements, receive structured milestone quotes in hours, collaborate directly with vetted specialists, and ship production-ready digital products with escrow security.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <Link href="/services" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto px-8 text-sm font-semibold shadow-md shadow-orange-500/20 gap-2 h-11">
                Explore Services Catalog <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#estimator" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 text-sm font-medium h-11 gap-2">
                <Calculator className="w-4 h-4 text-orange-500" />
                Estimate Project Cost
              </Button>
            </Link>
          </div>

          {/* Key Trust Stats Pill Bar */}
          <div className="mt-14 pt-8 border-t border-slate-200/80 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">99.4%</div>
              <div className="text-xs font-medium text-slate-500">On-Time Delivery</div>
            </div>
            <div className="space-y-1 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 font-mono">&lt; 2 Hours</div>
              <div className="text-xs font-medium text-slate-500">Quote Turnaround</div>
            </div>
            <div className="space-y-1 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">100%</div>
              <div className="text-xs font-medium text-slate-500">Escrow Milestone Protection</div>
            </div>
            <div className="space-y-1 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-bold text-amber-500 font-mono flex items-center justify-center gap-1">
                4.9 <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
              </div>
              <div className="text-xs font-medium text-slate-500">Verified Client Rating</div>
            </div>
          </div>

          {/* Interactive Hero Visual Preview Card */}
          <div className="mt-12 w-full max-w-4xl bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 text-left relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600 font-bold shadow-xs">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 text-base">Fintech SaaS Platform Deliverable</h3>
                    <Badge variant="primary" className="text-[10px]">Active Order</Badge>
                  </div>
                  <p className="text-xs text-slate-500">Order #RZ-8492 • Milestone 2 of 3 in progress</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="gap-1 px-3 py-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Milestone 1 Escrow Released
                </Badge>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span className="font-medium flex items-center gap-1.5">
                  <Workflow className="w-3.5 h-3.5 text-orange-600" /> Real-time Milestone Progress
                </span>
                <span className="font-bold text-orange-600 font-mono">68% Completed</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500" style={{ width: '68%' }} />
              </div>
            </div>

            {/* Milestone Steps Mini-Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold mb-1">
                  <Check className="w-3.5 h-3.5" /> Milestone 1
                </div>
                <div className="text-xs font-medium text-slate-800">UI/UX & Architecture</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Approved & Funds Released</div>
              </div>
              <div className="p-3.5 bg-orange-50/60 border border-orange-200/80 rounded-xl">
                <div className="flex items-center gap-2 text-orange-700 text-xs font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5 animate-spin" /> Milestone 2
                </div>
                <div className="text-xs font-medium text-slate-900">API & Frontend Integration</div>
                <div className="text-[11px] text-orange-600 font-medium mt-0.5">In Review • Escrow Secured</div>
              </div>
              <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl opacity-75">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                  <span className="w-2 h-2 rounded-full bg-slate-300" /> Milestone 3
                </div>
                <div className="text-xs font-medium text-slate-700">QA, Security & Cloud Deploy</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Scheduled Next</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TECH STACK MARQUEE / CAPABILITIES */}
      <section className="py-7 px-4 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 uppercase tracking-wider shrink-0">
            <Cpu className="w-4 h-4" /> Production Tech Stack
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {TECH_STACK_ITEMS.map((tech) => (
              <div
                key={tech.name}
                className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                <span className="font-semibold text-slate-900">{tech.name}</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">({tech.role})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE LIVE PROJECT ESTIMATOR */}
      <section id="estimator" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-slate-50/60 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14 space-y-3">
            <Badge variant="primary" className="text-xs">INTERACTIVE ESTIMATOR</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Estimate Your Project Cost & Milestones
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Simulate your technical project requirements to see instant ballpark estimates and itemized milestone breakdown.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-lg">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category Selector */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
                  1. Select Service Discipline
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'web', label: 'Web & SaaS', icon: Laptop },
                    { id: 'mobile', label: 'Mobile App', icon: Smartphone },
                    { id: 'design', label: 'UI/UX Design', icon: Layers },
                    { id: 'ai', label: 'AI & Automation', icon: Cpu },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = estimatorType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setEstimatorType(item.id as any)}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-orange-50 border-orange-400 text-orange-900 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-orange-600' : 'text-slate-500'}`} />
                        <span className="text-xs font-semibold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Project Scope Tier */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
                  2. Choose Project Scope & Scale
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'mvp', title: 'Starter MVP', desc: 'Fast turnaround proof of concept' },
                    { id: 'growth', title: 'Growth SaaS', desc: 'Full production stack with auth & DB' },
                    { id: 'enterprise', title: 'Enterprise', desc: 'Multi-tenant, high-concurrency & QA' },
                  ].map((tier) => {
                    const isActive = estimatorTier === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setEstimatorTier(tier.id as any)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-orange-50 border-orange-400 text-orange-900 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900 mb-0.5">{tier.title}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-2">{tier.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Addons Toggle */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
                  3. Cloud & Infrastructure Add-ons
                </label>
                <button
                  type="button"
                  onClick={() => setIncludeDevOps(!includeDevOps)}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    includeDevOps
                      ? 'bg-orange-50/60 border-orange-300 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${includeDevOps ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900">Include CI/CD DevOps & Cloud Setup</div>
                      <div className="text-[11px] text-slate-500">Automated GitHub Actions, Docker, and Production Deploy</div>
                    </div>
                  </div>
                  <Badge variant={includeDevOps ? 'primary' : 'neutral'} className="text-[10px]">
                    {includeDevOps ? '+ 4,500 BDT' : 'Optional'}
                  </Badge>
                </button>
              </div>
            </div>

            {/* Right Result Card */}
            <div className="lg:col-span-5 bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Estimated Proposal
                  </span>
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Escrow Backed
                  </Badge>
                </div>

                <div className="my-6">
                  <span className="text-xs text-slate-400 block mb-1">Starting Ballpark Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono text-gradient-orange">
                      {estimatedData.price.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-slate-400 font-mono">BDT</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>Estimated Turnaround: <strong className="text-slate-200">{estimatedData.days} Days</strong></span>
                  </div>
                </div>

                {/* Milestone Breakdown */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block font-mono">
                    Standard 3-Stage Escrow Milestones
                  </span>
                  {estimatedData.milestones.map((m, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Stage {idx + 1}: {m.name}</span>
                      <span className="font-mono font-bold text-orange-400">{Math.round((estimatedData.price * m.pct) / 100).toLocaleString()} BDT</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800">
                <Link href="/services">
                  <Button variant="primary" className="w-full text-xs font-semibold py-3 gap-2 shadow-md shadow-orange-500/20">
                    Submit Project Requirements Brief <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  No obligation • Free tailored quote within 2 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (THE 4-STEP PIPELINE) */}
      <section id="how-it-works" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <Badge variant="primary" className="text-xs">THE 4-STEP PIPELINE</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              How RizeX Delivers Results
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              A transparent, structured four-step workflow built for total clarity, accountability, and zero surprise costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                icon: FileText,
                title: 'Submit Dynamic Brief',
                desc: 'Select your service and complete tailored requirement fields with your specifications, assets, and deadlines.',
              },
              {
                step: '02',
                icon: Zap,
                title: 'Receive Custom Quote',
                desc: 'Get an itemized proposal with clear milestone pricing, advance terms, and guaranteed delivery schedule within hours.',
              },
              {
                step: '03',
                icon: Users,
                title: 'Specialist Execution',
                desc: 'Work directly with dedicated specialists through real-time scoped order chats and live milestone status tracking.',
              },
              {
                step: '04',
                icon: ShieldCheck,
                title: 'Review & Deliver',
                desc: 'Inspect deliverables, request granular revisions, and release escrow milestone payments with complete satisfaction.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative p-6 bg-slate-50/80 border border-slate-200/90 rounded-2xl flex flex-col justify-between hover:bg-white hover:border-orange-300 hover:shadow-lg transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="h-12 w-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-3xl font-bold text-slate-300 group-hover:text-orange-500 transition-colors">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center text-xs font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FEATURED SERVICES CATALOG */}
      <section id="services" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="primary" className="text-xs mb-2">SERVICE CATALOG</Badge>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Featured Capabilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore popular services or request a customized package tailored to your exact tech requirements.
              </p>
            </div>
            <Link href="/services">
              <Button variant="outline" size="sm" className="font-medium gap-1.5 text-xs shadow-2xs">
                View All Catalog <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
              </Button>
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20 border border-orange-600/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-slate-200/60 animate-pulse rounded-2xl border border-slate-200" />
              ))}
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="bg-white border-slate-200/90 rounded-2xl flex flex-col justify-between hover:border-orange-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      {service.category && (
                        <Badge variant="primary" className="text-[10px]">
                          {service.category.name}
                        </Badge>
                      )}
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-orange-600" /> {service.deliveryTime || 'Fast Delivery'}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs text-slate-500">
                      {service.description || 'Specialized agency deliverable with custom milestones.'}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-semibold">
                        Starting From
                      </span>
                      <span className="text-base font-extrabold text-slate-900 font-mono">
                        {service.startingPrice
                          ? `${service.startingPrice} ${service.currency || 'BDT'}`
                          : 'Custom Quote'}
                      </span>
                    </div>

                    <Link href={`/services/${service.slug || service.id}`}>
                      <Button variant="primary" size="sm" className="font-semibold text-xs gap-1">
                        Request Quote <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8">
              <p className="text-sm text-slate-500">No services found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. PLATFORM ADVANTAGES / WHY RIZEX */}
      <section id="features" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <Badge variant="primary" className="text-xs">THE RIZEX ADVANTAGE</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Engineered for Speed, Quality & Trust
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Everything modern companies need to outsource technical deliverables without friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-4 hover:border-orange-200 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Dynamic Spec Forms</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Forget generic forms. Our dynamic requirement builder prompts you for the exact technical specifications needed for your project.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" /> Custom tech stack selection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" /> File & asset attachments
                </li>
              </ul>
            </div>

            <div className="p-8 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-4 hover:border-orange-200 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Milestone-Based Escrow</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your budget is protected. Funds are divided into verifiable milestones and released only upon your explicit approval of deliverables.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" /> Itemized stage pricing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" /> 100% money back on non-delivery
                </li>
              </ul>
            </div>

            <div className="p-8 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-4 hover:border-orange-200 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Dedicated Collaboration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Communicate directly with assigned senior developers and designers through real-time order channels with rich file sharing.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" /> Scoped order discussions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" /> Granular revision requests
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CLIENT TESTIMONIALS */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <Badge variant="primary" className="text-xs">VERIFIED REVIEWS</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Trusted by Ambitious Teams
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              See how modern startups and enterprises accelerate deliverables with RizeX.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <Card key={rev.id} className="bg-white border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    {rev.order?.service && (
                      <Badge variant="outline" className="text-[10px]">
                        {rev.order.service.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic mb-6">
                    &ldquo;{rev.comment || 'Outstanding execution and clear communication throughout the project.'}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs">
                    {rev.client?.name ? rev.client.name.charAt(0) : 'C'}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">{rev.client?.name || 'Verified Client'}</h4>
                    <p className="text-[11px] text-slate-500">{rev.order?.title || 'Verified Project'}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <Badge variant="primary" className="text-xs">FAQ</Badge>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Got questions? Here is how everything works under the hood.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/60 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 hover:bg-slate-100/60 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-orange-600 shrink-0" />
                    {faq.q}
                  </span>
                  <span className="text-lg font-mono text-orange-600">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. HIGH-CONVERTING CTA BANNER (Deep Navy with Orange Accents) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-[#0b1426] to-slate-900 text-white relative overflow-hidden">
        {/* Glowing Orange Orbs */}
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <Badge variant="primary" className="bg-orange-500/20 text-orange-300 border-orange-500/40 text-xs px-4 py-1">
            START YOUR NEXT PROJECT
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Ready to Build at High Velocity?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Submit your dynamic requirements now and receive an itemized proposal with custom milestones within hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/services">
              <Button size="lg" variant="primary" className="w-full sm:w-auto font-bold px-8 shadow-xl shadow-orange-500/30 text-white h-12 gap-2">
                Explore Services & Get Quote <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-slate-700 hover:border-orange-500/50 hover:bg-white/10 h-12">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
