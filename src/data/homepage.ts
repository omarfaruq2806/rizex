export interface ContactMethod {
  id: string;
  name: string;
  value: string;
  href: string;
  description: string;
  iconName: 'Mail' | 'MessageCircle' | 'Linkedin';
  isExternal?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  iconName: 'Code2' | 'Smartphone' | 'Palette' | 'Cpu' | 'TrendingUp' | 'Video' | 'Layers';
  image: string;
  linkHref: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  iconName: 'Search' | 'Layers' | 'Code2' | 'CheckCircle2' | 'Zap';
}

export interface WhyUsFeature {
  title: string;
  description: string;
  iconName: 'Users' | 'Sparkles' | 'MessageSquare' | 'ShieldCheck' | 'HeartHandshake' | 'Clock';
}

export interface DemoProject {
  id: string;
  title: string;
  category: string;
  badge: 'Demo Project' | 'Concept Project';
  description: string;
  technologies: string[];
  image: string;
  liveUrl?: string;
  detailsUrl?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface NavLink {
  label: string;
  href: string;
}

// -------------------------------------------------------------
// CENTRALIZED AGENCY CONTACT DATA
// -------------------------------------------------------------
export const AGENCY_CONTACT = {
  email: 'contact@rizex.agency',
  emailHref: 'mailto:contact@rizex.agency?subject=Project%20Inquiry%20%E2%80%94%20RizeX',
  whatsappNumber: '+880 1700-000000',
  whatsappHref: 'https://wa.me/8801700000000?text=Hello%20RizeX%20Team!%20I%20would%20like%20to%20discuss%20a%20project.',
  linkedinName: 'RizeX Digital Agency',
  linkedinHref: 'https://linkedin.com/company/rizex-agency',
  copyrightText: 'Copyright © 2026 RizeX. All rights reserved.',
  tagline: 'We help businesses turn ideas into digital solutions through technology, creativity, and innovation.',
};

export const CONTACT_METHODS: ContactMethod[] = [
  {
    id: 'email',
    name: 'Direct Email',
    value: AGENCY_CONTACT.email,
    href: AGENCY_CONTACT.emailHref,
    description: 'Send us your brief or RFP directly. We respond within 24 hours.',
    iconName: 'Mail',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    value: AGENCY_CONTACT.whatsappNumber,
    href: AGENCY_CONTACT.whatsappHref,
    description: 'Instant direct chat with our solutions team for fast inquiries.',
    iconName: 'MessageCircle',
    isExternal: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Official',
    value: AGENCY_CONTACT.linkedinName,
    href: AGENCY_CONTACT.linkedinHref,
    description: 'Connect with our leadership team and explore corporate updates.',
    iconName: 'Linkedin',
    isExternal: true,
  },
];

// -------------------------------------------------------------
// NAVBAR LINKS
// -------------------------------------------------------------
export const NAVBAR_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Our Process', href: '#process' },
  { label: 'Projects', href: '#projects' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#reach-us' },
];

// -------------------------------------------------------------
// 03. SERVICES DATA
// -------------------------------------------------------------
export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Modern, responsive, and scalable websites tailored to your business needs.',
    tags: ['Website', 'Web Application', 'E-commerce', 'Custom Software'],
    iconName: 'Code2',
    image: 'https://images.openai.com/static-rsc-4/RcjhYDRRViBr0R7B0veun_oTO_dyKq0pTFZqFhiAxyh1IvuO6YaowNFwiX6We5zDjTjDH4SM5DrQraYtFzD-5ANNJch-mysAo8vnvqC7TWjPU2lofgDgDy6AjLrTTgXiF7FTnWg5GpRgPF80WBnGpsz4P70iJg_U-zt1ckVPRxo?purpose=inline',
    linkHref: '/services',
  },
  {
    id: 'mobile-app',
    title: 'Mobile App Development',
    description: 'User-friendly mobile applications designed to deliver seamless digital experiences.',
    tags: ['Android', 'iOS', 'Cross-platform Apps'],
    iconName: 'Smartphone',
    image: 'https://images.openai.com/static-rsc-4/nRCaO0hcOhnCywLTxrt_GWI9NJl9N_3hCJ8B7_GJcFbeHD6C4NXuqiQlM08yht2xmGvyuWtwNuikLAmxKUhEH1bxWhO9MNwQRXlm333Csvjfl3zceERYJaWuVFB8sZ3tYyTk9OrAeQVV2ev5X7aCxKJ_v4kripUDPy1McKRpILE?purpose=inline',
    linkHref: '/services',
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    description: 'Intuitive interfaces and thoughtful user experiences that make digital products easier to use.',
    tags: ['Web Design', 'App Design', 'Prototyping'],
    iconName: 'Palette',
    image: 'https://images.openai.com/static-rsc-4/4hYAlbgKdezZKFwJgVie4roQf9oGFN3mjj35u8i9vXib6PthM73W0pXd6miikz-xf__vDs62y2OmN9RYFY89ZZiCAdvMJhupgRJgmDJXHlgKjbxZ1Rv54aaWoY6nZ8jNMXfS5wp-omGI-mRFvF7ZHn1cegOEy3YpqXEBjVznWG8?purpose=inline',
    linkHref: '/services',
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    description: 'Smart automation solutions that simplify repetitive tasks and improve business workflows.',
    tags: ['AI Integration', 'Workflow Automation', 'AI Assistants'],
    iconName: 'Cpu',
    image: 'https://images.openai.com/static-rsc-4/BtIg4TUGFCi3lgKeeNjKZF2hl0thDdAAJ50vL8ecjNchZhrWwlEoPgftJs5jdLlt5NP3AFgF5JF7LyBYxhW3_qoz2XfvPYy4DtnQl4GFJVS1RI6ZwXMEI4gqMGuGuxCzLvTndFvvYbin6__y6GGwjJHWWgkkDoT4QvnIIix76Zk?purpose=inline',
    linkHref: '/services',
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    description: 'Digital strategies to improve brand visibility and connect with the right audience.',
    tags: ['SEO', 'Social Media', 'Digital Strategy'],
    iconName: 'TrendingUp',
    image: 'https://images.openai.com/static-rsc-4/vpbMiC-tRb-tQOHlbqHzYz4gB8l4k-jGd14dUXNaKvC7JmBSwm6YroMnyPRokS69HcLfsaZWk3wwwzBawanc8yqRLFPoKL3gHYCm7sOvzbYK0kLx8AJIH0jbSF4LsKYTIkFGb-c7WGUT4WJ3YOY2hieMSiLdBzCHfG2iu1wFqjY?purpose=inline',
    linkHref: '/services',
  },
  {
    id: 'video-motion',
    title: 'Video & Motion Graphics',
    description: "Engaging visual content and motion graphics that communicate your brand's story.",
    tags: ['Video Editing', 'Motion Graphics', 'Promotional Videos'],
    iconName: 'Video',
    image: 'https://images.openai.com/static-rsc-4/n_rUDt6jQEIaIAHHxw5WY-r8Fw53HGRK6FHKhsPgcygcHOMTy9VaLxxoGR9O8aDagKQtfovY5QPoROeIadEHmHIOyaoCNOF2KqCWRGmFwGEE0USEy6a9uydeKzycO7FQ5BVHONfOXsouu6iwkeweqpTbVz64Ep6AQMwLVwizFsk?purpose=inline',
    linkHref: '/services',
  },
  {
    id: 'graphic-branding',
    title: 'Graphic Design & Branding',
    description: 'Visual identities and creative assets that give your business a consistent presence.',
    tags: ['Brand Identity', 'Social Media Design', 'Marketing Materials'],
    iconName: 'Layers',
    image: 'https://images.openai.com/static-rsc-4/k1p-Vo9SNtCTvIqK5b0PjqjEBA4mtMYGTsCGutldkIIt0xufuegyO2A4xQF5mnHxBu-_za4hln6vBZYjWhH1FTW_6hrBjgi4H2uLA_psKXAUI4gPMI5Nq08HcXhgRHKBBN_oSOGWFbJYSFeXLe0ca0m3VhermCtRdSuDBgfvHOM?purpose=inline',
    linkHref: '/services',
  },
];

// -------------------------------------------------------------
// 04. OUR WORKING PROCESS
// -------------------------------------------------------------
export const WORKING_PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Discovery & Consultation',
    description: "Understand the client's business, requirements, and project goals.",
    iconName: 'Search',
  },
  {
    step: '02',
    title: 'Planning & Strategy',
    description: 'Define project scope, technical direction, and development roadmap.',
    iconName: 'Layers',
  },
  {
    step: '03',
    title: 'Design & Development',
    description: 'Transform the approved plan into a functional digital solution.',
    iconName: 'Code2',
  },
  {
    step: '04',
    title: 'Testing & Feedback',
    description: 'Review the work, test functionality, and incorporate client feedback.',
    iconName: 'CheckCircle2',
  },
  {
    step: '05',
    title: 'Launch & Support',
    description: 'Prepare the final delivery and provide agreed post-launch assistance.',
    iconName: 'Zap',
  },
];

// -------------------------------------------------------------
// 05. WHY CHOOSE US
// -------------------------------------------------------------
export const WHY_CHOOSE_US_FEATURES: WhyUsFeature[] = [
  {
    title: 'Client-Focused Approach',
    description: 'We start by understanding your needs and business objectives.',
    iconName: 'Users',
  },
  {
    title: 'Tailored Solutions',
    description: 'Every solution is planned around your requirements.',
    iconName: 'Sparkles',
  },
  {
    title: 'Clear Communication',
    description: 'Stay informed throughout the project.',
    iconName: 'MessageSquare',
  },
  {
    title: 'Quality-Driven Work',
    description: 'We prioritize functionality, usability, and reliability.',
    iconName: 'ShieldCheck',
  },
  {
    title: 'Collaborative Process',
    description: 'Your feedback matters throughout development.',
    iconName: 'HeartHandshake',
  },
  {
    title: 'Continued Support',
    description: 'We aim to support your digital journey beyond delivery.',
    iconName: 'Clock',
  },
];

// -------------------------------------------------------------
// 06. FEATURED DEMO PROJECTS
// -------------------------------------------------------------
export const DEMO_PROJECTS: DemoProject[] = [
  {
    id: 'real-estate-platform',
    title: 'Real Estate Platform',
    category: 'Web Development & Property Management',
    badge: 'Demo Project',
    description: 'A property platform concept designed to simplify property discovery, buying, and renting.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Mapbox API'],
    image: 'https://images.openai.com/static-rsc-4/J1DMmKpazqSAMe3Ptw55WUuSij2NUi2yi00MilCo-h-c2D9ZQ0Vbp9qFPqY4dRyQY5ByaznTnW1WUdPe_czJBzCFCY9u1OYPAA07jv6K9Ux0xXcLXzaiLELzZAblV_LwbsaTaxA06blKXWHhNxhXCd7s-BWRjsQsmUzNuqGBI10?purpose=inline',
    liveUrl: '#',
    detailsUrl: '/services',
  },
  {
    id: 'ecommerce-platform',
    title: 'E-commerce Platform',
    category: 'E-commerce & Store Management',
    badge: 'Demo Project',
    description: 'A modern online shopping experience with product discovery and store management.',
    technologies: ['React', 'NestJS', 'PostgreSQL', 'Stripe'],
    image: 'https://images.openai.com/static-rsc-4/CcPGBL8eGL1Rirr2qzvICHr-xkeUxwiqDwCixRQG0XzroEzS9vF4yCwoPYQw2Ez2FrI_U8C3dMM-sqwqp8-qoN51_5Pj-J57HFYUX0eoBsBvbMfVEYxkw7aJpcbFHV7KCBAgVECelY57tnfP5EnJg5Ymr2q8jZTXavwaXQKZ-QU?purpose=inline',
    liveUrl: '#',
    detailsUrl: '/services',
  },
  {
    id: 'business-management-system',
    title: 'Business Management System',
    category: 'SaaS & Enterprise Dashboard',
    badge: 'Concept Project',
    description: 'A dashboard concept for organizing business operations and managing essential workflows.',
    technologies: ['Next.js', 'TanStack Query', 'Tailwind CSS', 'Charts'],
    image: 'https://images.openai.com/static-rsc-4/o0XfaBqtTW7iPJpPqdaqFQODyXPXJ1A4qrjFOCJcihjAv_oNKgkfgzzWRmrciKW-Y-7NdFMSJsSnRv9xHSWCLf_iPgqPFdiNhavXmsWFlC82ZPEbSD3cdRaKIoc0VCtYD6YoeuZ8W3BAboj4_KZ8Ismj-RvcJjqeVKeL5VAR-Xs?purpose=inline',
    liveUrl: '#',
    detailsUrl: '/services',
  },
];

// -------------------------------------------------------------
// 07. FAQ DATA
// -------------------------------------------------------------
export const FAQ_DATA: FaqItem[] = [
  {
    question: 'What services does your agency provide?',
    answer: 'We provide digital solutions including web development, mobile app development, UI/UX design, AI automation, digital marketing, video editing, and graphic design.',
  },
  {
    question: 'How can I start a project with your agency?',
    answer: 'You can start by submitting the inquiry form above with your basic requirements or contacting us directly via email or WhatsApp. We will schedule an introductory discovery session to align on scope and next steps.',
  },
  {
    question: 'How much does a project cost?',
    answer: 'Project costs depend on scope, technical complexity, and deliverables. We provide transparent, itemized quotes tailored to your exact requirements with no hidden fees.',
  },
  {
    question: 'How long does it take to complete a project?',
    answer: 'Timelines vary by scope. Standard websites and brand identity packages typically take 7 to 14 days, whereas custom applications or complex platforms are delivered in structured 2-week milestone sprints.',
  },
  {
    question: 'Can I track my project progress?',
    answer: 'Yes. We emphasize clear, continuous communication with regular milestone reviews, preview staging links, and transparent status updates at each stage of development.',
  },
  {
    question: 'Do you provide support after project delivery?',
    answer: 'Yes. We provide agreed post-launch assistance and ongoing maintenance options to ensure your digital solution remains secure, fast, and functional.',
  },
  {
    question: 'Can I request a custom digital solution?',
    answer: 'Absolutely. We specialize in custom software, tailored web applications, and automated workflows engineered specifically around your unique business operations.',
  },
  {
    question: 'How can I communicate with your team?',
    answer: 'You can reach us through email, WhatsApp, or scheduled video calls (Google Meet/Zoom). During active projects, we also offer dedicated communication channels to keep collaboration seamless.',
  },
];

// -------------------------------------------------------------
// LEAD FORM SERVICE OPTIONS & BUDGET OPTIONS
// -------------------------------------------------------------
export const SERVICE_OPTIONS = [
  'Web Development',
  'Mobile App Development',
  'UI/UX Design',
  'AI & Automation',
  'Digital Marketing',
  'Video & Motion Graphics',
  'Graphic Design & Branding',
  'Other / Custom Solution',
];

export const BUDGET_OPTIONS = [
  'Less than $1,500',
  '$1,500 – $3,000',
  '$3,000 – $6,000',
  '$6,000 – $10,000',
  '$10,000+',
  'Not determined yet',
];

