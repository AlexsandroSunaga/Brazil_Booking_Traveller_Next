/** Local images in /public/images - real photography for demo */
export const IMAGES = {
  hero: "/images/hero.jpg",
  heroAlt: "Airport terminal with airplane",
  airport: "/images/airport.jpg",
  driver: "/images/driver.jpg",
  fleet: {
    saloon: "/images/saloon.jpg",
    estate: "/images/estate.jpg",
    mpv: "/images/mpv.jpg",
    business: "/images/business.jpg",
    "8-seater": "/images/8-seater.jpg",
  },
  airports: {
    GRU: "/images/heathrow.jpg",
    CGH: "/images/london-city.jpg",
    GIG: "/images/gatwick.jpg",
    SDU: "/images/stansted.jpg",
    BSB: "/images/luton.jpg",
    CNF: "/images/southend.jpg",
  },
} as const;

export function getVehicleImage(slug: string): string {
  return IMAGES.fleet[slug as keyof typeof IMAGES.fleet] ?? IMAGES.driver;
}

export function getAirportImage(code: string): string {
  return IMAGES.airports[code as keyof typeof IMAGES.airports] ?? IMAGES.airport;
}
