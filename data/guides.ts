export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  // Editorial guide content written for this site (not sourced from the plans API).
}

export const GUIDE_TOPICS = [
  "How Much NBN Speed Do I Need?",
  "What NBN Speed Is Best for a Family?",
  "What Is the Difference Between NBN 50 and NBN 100?",
  "Is NBN 1000 Worth It?",
  "Best NBN for Gaming",
  "Best NBN for Working From Home",
  "What Is Typical Evening Speed?",
  "FTTP vs FTTN vs HFC Explained",
  "How to Choose an NBN Provider",
  "What Does Unlimited Data Really Mean?",
];

export const GUIDES: Guide[] = [
  {
    slug: "how-much-nbn-speed-do-i-need",
    title: "How Much NBN Speed Do I Need?",
    excerpt:
      "A quick way to think about speed tiers based on household size and usage.",
    body: [
      "The right NBN speed tier depends far more on how many people and devices are active at once than on any single number. A single person browsing and streaming standard-definition video is usually comfortable on an entry-level tier, while a household of four running video calls, 4K streaming and gaming at the same time will feel a bigger difference from a mid-to-high tier plan.",
      "Rather than chasing the fastest available speed, it's worth matching the plan to your typical evening usage — the busiest time of day for most households. Our comparison tool factors in your household size and selected usage types when suggesting suitable plans.",
      "As a general guide: light single-user households often do fine on 25–50 Mbps, small families on 50–100 Mbps, and larger households with heavy simultaneous streaming, gaming and working from home may benefit from 100–250 Mbps or more.",
    ],
  },
  {
    slug: "fttp-vs-fttn-vs-hfc-explained",
    title: "FTTP vs FTTN vs HFC Explained",
    excerpt: "The main NBN connection technologies, explained simply.",
    body: [
      "NBN is delivered over several different technologies depending on your address, and the technology available to you affects which plans and maximum speeds you can access.",
      "FTTP (Fibre to the Premises) runs fibre optic cable all the way to your home and generally supports the highest speed tiers, including higher upload speeds. HFC (Hybrid Fibre Coaxial) uses the existing pay-TV cable network for the final stretch and also supports high speed tiers in most areas.",
      "FTTN (Fibre to the Node) and FTTC (Fibre to the Curb) use existing copper wiring for some or all of the final connection, which can limit maximum achievable speeds compared to FTTP or HFC, particularly over longer copper runs.",
      "You can't choose your NBN technology — it depends on what has been rolled out to your address. Providers and the NBN Co website can confirm which technology serves your address.",
    ],
  },
  {
    slug: "what-does-unlimited-data-really-mean",
    title: "What Does Unlimited Data Really Mean?",
    excerpt: "Understanding data allowances, fair use policies and throttling.",
    body: [
      "Most modern NBN plans in Australia are advertised as having unlimited data, meaning there's no hard monthly data cap that cuts off your connection. This has become the standard offering from most providers.",
      "However, 'unlimited' doesn't always mean unrestricted at every moment — some providers apply fair use policies for very unusual, sustained high-volume usage, and connection speeds can still vary during network congestion regardless of your data allowance.",
      "If you see a plan advertised with a specific data cap (for example, on some Fixed Wireless or Satellite plans), check the fine print for what happens once you reach that cap — some providers slow your speed, while others may charge extra.",
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
