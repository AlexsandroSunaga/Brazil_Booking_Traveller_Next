export type PlaceResult = {
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
};

const DEMO_PLACES: PlaceResult[] = [
  { address: "Aeroporto Internacional de Guarulhos (GRU), Guarulhos, SP", lat: -23.4356, lng: -46.4731 },
  { address: "Aeroporto de Congonhas (CGH), São Paulo, SP", lat: -23.6261, lng: -46.6564 },
  { address: "Aeroporto Internacional do Galeão (GIG), Rio de Janeiro, RJ", lat: -22.809, lng: -43.2506 },
  { address: "Aeroporto Santos Dumont (SDU), Rio de Janeiro, RJ", lat: -22.9104, lng: -43.1631 },
  { address: "Aeroporto Internacional de Brasília (BSB), Brasília, DF", lat: -15.8711, lng: -47.9186 },
  { address: "Aeroporto Internacional de Confins (CNF), Confins, MG", lat: -19.6244, lng: -43.9719 },
  { address: "Centro de São Paulo, Sé, São Paulo, SP", lat: -23.5505, lng: -46.6333 },
  { address: "Avenida Paulista, Bela Vista, São Paulo, SP", lat: -23.5614, lng: -46.656 },
  { address: "Copacabana, Rio de Janeiro, RJ", lat: -22.9711, lng: -43.1822 },
  { address: "Ipanema, Rio de Janeiro, RJ", lat: -22.9842, lng: -43.203 },
  { address: "Campinas, SP", lat: -22.9099, lng: -47.0626 },
  { address: "Santos, SP", lat: -23.9608, lng: -46.3336 },
  { address: "Barra da Tijuca, Rio de Janeiro, RJ", lat: -23.0004, lng: -43.3659 },
  { address: "Porto de Santos, Santos, SP", lat: -23.9675, lng: -46.3281 },
  { address: "Rodoviária Tietê, São Paulo, SP", lat: -23.5169, lng: -46.6258 },
];

const PLACE_KEYWORDS: { keyword: string; match: (address: string) => boolean }[] = [
  { keyword: "guarulhos", match: (a) => a.includes("guarulhos") },
  { keyword: "gru", match: (a) => a.includes("guarulhos") },
  { keyword: "congonhas", match: (a) => a.includes("congonhas") },
  { keyword: "cgh", match: (a) => a.includes("congonhas") },
  { keyword: "galeão", match: (a) => a.includes("galeão") || a.includes("galeao") },
  { keyword: "gig", match: (a) => a.includes("galeão") || a.includes("galeao") },
  { keyword: "santos dumont", match: (a) => a.includes("santos dumont") },
  { keyword: "sdu", match: (a) => a.includes("santos dumont") },
  { keyword: "brasília", match: (a) => a.includes("brasília") || a.includes("brasilia") },
  { keyword: "bsb", match: (a) => a.includes("brasília") || a.includes("brasilia") },
  { keyword: "confins", match: (a) => a.includes("confins") },
  { keyword: "cnf", match: (a) => a.includes("confins") },
  { keyword: "centro de são paulo", match: (a) => a.includes("centro de são paulo") },
  { keyword: "centro sp", match: (a) => a.includes("centro de são paulo") },
  { keyword: "paulista", match: (a) => a.includes("paulista") },
  { keyword: "copacabana", match: (a) => a.includes("copacabana") },
  { keyword: "ipanema", match: (a) => a.includes("ipanema") },
  { keyword: "campinas", match: (a) => a.includes("campinas") },
  { keyword: "santos", match: (a) => a.includes("santos") },
  { keyword: "barra", match: (a) => a.includes("barra da tijuca") },
  { keyword: "tietê", match: (a) => a.includes("tietê") || a.includes("tiete") },
];

export function getDemoPlaces(): PlaceResult[] {
  return DEMO_PLACES;
}

export function resolvePlaceFromText(text: string): PlaceResult | null {
  const q = text.trim().toLowerCase();
  if (q.length < 2) return null;

  const exact = DEMO_PLACES.find((p) => p.address.toLowerCase() === q);
  if (exact) return exact;

  const partial = DEMO_PLACES.filter(
    (p) => p.address.toLowerCase().includes(q) || q.includes(p.address.toLowerCase().slice(0, 24))
  );
  if (partial.length === 1) return partial[0];

  if (q === "são paulo" || q === "sao paulo") {
    return DEMO_PLACES.find((p) => p.address.includes("Centro de São Paulo")) ?? null;
  }

  if (q === "rio" || q === "rio de janeiro") {
    return DEMO_PLACES.find((p) => p.address.includes("Copacabana")) ?? null;
  }

  for (const { keyword, match } of PLACE_KEYWORDS) {
    if (q.includes(keyword)) {
      const found = DEMO_PLACES.find((p) => match(p.address.toLowerCase()));
      if (found) return found;
    }
  }

  if (partial.length > 1) {
    return partial.sort((a, b) => a.address.length - b.address.length)[0];
  }

  return null;
}

export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&components=country:br&key=${apiKey}`
      );
      const data = await res.json();
      if (data.status === "OK" && data.predictions?.length) {
        const details = await Promise.all(
          data.predictions.slice(0, 6).map(async (p: { place_id: string; description: string }) => {
            const detailRes = await fetch(
              `https://maps.googleapis.com/maps/api/place/details/json?place_id=${p.place_id}&fields=geometry&key=${apiKey}`
            );
            const detail = await detailRes.json();
            const loc = detail.result?.geometry?.location;
            if (!loc) return null;
            return {
              address: p.description,
              lat: loc.lat,
              lng: loc.lng,
              placeId: p.place_id,
            } satisfies PlaceResult;
          })
        );
        return details.filter(Boolean) as PlaceResult[];
      }
    } catch {
      // fall through to demo data
    }
  }

  return DEMO_PLACES.filter((p) => p.address.toLowerCase().includes(q)).slice(0, 8);
}

export async function getDistanceMatrix(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<{ miles: number; minutes: number } | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&units=metric&key=${apiKey}`
      );
      const data = await res.json();
      const element = data.rows?.[0]?.elements?.[0];
      if (element?.status === "OK") {
        const km = element.distance.value / 1000;
        const minutes = Math.round(element.duration.value / 60);
        return { miles: Math.round(km * 10) / 10, minutes };
      }
    } catch {
      return null;
    }
  }
  return null;
}
