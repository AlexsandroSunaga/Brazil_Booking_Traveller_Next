export const SITE = {
  name: "Premier Transfer Brasil",
  tagline: "Fixed Price Airport Transfers, 24/7",
  phone: "+55 11 99999-8888",
  phoneTel: "+5511999998888",
  phoneWhatsApp: "5511999998888",
  whatsappMessage: "Hi, I'd like to book an airport transfer in Brazil.",
  email: "reservas@premiertransfer.com.br",
  address: "São Paulo, SP, Brazil",
  founded: 2017,
  rating: 4.8,
  reviewCount: 2840,
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const AIRPORTS = [
  { code: "GRU", name: "Guarulhos", slug: "guarulhos-airport", fullName: "São Paulo/Guarulhos International Airport" },
  { code: "CGH", name: "Congonhas", slug: "congonhas-airport", fullName: "São Paulo/Congonhas Airport" },
  { code: "GIG", name: "Galeão", slug: "galeao-airport", fullName: "Rio de Janeiro/Galeão International Airport" },
  { code: "SDU", name: "Santos Dumont", slug: "santos-dumont-airport", fullName: "Rio de Janeiro/Santos Dumont Airport" },
  { code: "BSB", name: "Brasília", slug: "brasilia-airport", fullName: "Brasília International Airport" },
  { code: "CNF", name: "Confins", slug: "confins-airport", fullName: "Belo Horizonte/Confins International Airport" },
];

/** Popular city and neighbourhood destinations across Brazil */
export const DESTINATIONS = [
  { name: "Centro de São Paulo", slug: "centro-sao-paulo", lat: -23.5505, lng: -46.6333 },
  { name: "Avenida Paulista, São Paulo", slug: "avenida-paulista", lat: -23.5614, lng: -46.656 },
  { name: "Copacabana, Rio de Janeiro", slug: "copacabana", lat: -22.9711, lng: -43.1822 },
  { name: "Ipanema, Rio de Janeiro", slug: "ipanema", lat: -22.9842, lng: -43.203 },
  { name: "Campinas", slug: "campinas", lat: -22.9099, lng: -47.0626 },
  { name: "Santos", slug: "santos", lat: -23.9608, lng: -46.3336 },
];

export const POPULAR_ROUTES = [
  { from: "Guarulhos Airport", to: "Centro de São Paulo", km: 28, minutes: 45 },
  { from: "Congonhas Airport", to: "Avenida Paulista", km: 12, minutes: 25 },
  { from: "Galeão Airport", to: "Copacabana", km: 22, minutes: 40 },
  { from: "Santos Dumont Airport", to: "Ipanema", km: 18, minutes: 35 },
  { from: "Guarulhos Airport", to: "Campinas", km: 95, minutes: 75 },
];

export const FAQ_ITEMS = [
  {
    q: "What is Premier Transfer Brasil?",
    a: "We're a licensed Brazilian operator connecting you with vetted local drivers for door-to-door airport transfers. Fixed prices in BRL, no surge, 24/7 support.",
  },
  {
    q: "Can I book a return trip?",
    a: "Yes. Choose 'Return' when booking and select both outbound and return dates. You'll receive one confirmation covering both legs.",
  },
  {
    q: "What's your cancellation policy?",
    a: "Free cancellation any time before we dispatch the driver - usually 30 minutes before pickup. No questions asked.",
  },
  {
    q: "How do I book?",
    a: "Enter pickup and drop-off in the quote widget. Pick date, time, vehicle, and pay online or to the driver. Takes about 60 seconds.",
  },
  {
    q: "Will my luggage fit?",
    a: "Sedan: 2 large + 2 hand. Estate: 4 large + 2 hand. Van: 4 large + 4 hand. 8-seater: 6 large + 6 hand. We'll right-size your vehicle.",
  },
  {
    q: "Do you provide child car seats?",
    a: "Yes - booster, child or infant seats at no extra charge. Just let us know during booking.",
  },
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Get your price",
    description: "Enter pickup and destination. See the fixed total fare instantly - no sign-up required.",
  },
  {
    step: "02",
    title: "Book in seconds",
    description: "Add your date, time and details. Pay online, or pay cash/card directly to the driver.",
  },
  {
    step: "03",
    title: "We track your flight",
    description: "Running late or early? We adjust automatically at no extra charge.",
  },
  {
    step: "04",
    title: "Meet at pickup",
    description: "Your driver waits at the airport arrivals area or at your door for outbound journeys.",
  },
];

export const STATS = [
  { value: "8,000+", label: "Monthly bookings" },
  { value: "4.8★", label: "Average rating" },
  { value: "24/7", label: "Live dispatch" },
  { value: "0%", label: "Surge pricing" },
];

export const TESTIMONIALS = [
  {
    name: "Ana R.",
    route: "Guarulhos → Centro de São Paulo",
    text: "Booked at 11pm for a 5am flight. Driver was waiting exactly where promised. Price was exactly what the website quoted - not a cent more.",
    rating: 5,
  },
  {
    name: "Carlos M.",
    route: "Galeão → Copacabana",
    text: "Flight was 90 minutes late. They tracked it automatically and adjusted pickup at no extra cost. Brilliant service.",
    rating: 5,
  },
  {
    name: "Juliana S.",
    route: "Congonhas → Paulista",
    text: "Travelling with two kids and four suitcases. Van was perfect. Child seats fitted before we arrived. Will use every time.",
    rating: 5,
  },
];

export const VEHICLE_ICONS: Record<string, string> = {
  saloon: "🚗",
  estate: "🚙",
  mpv: "🚐",
  business: "✨",
  "8-seater": "🚌",
};
