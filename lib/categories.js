// Single source of truth for categories — used by both the Navbar
// dropdown and the category page, so a slug always matches consistently.
export const categories = [
  { label: "Doctor", slug: "doctor" },
  { label: "Superhero", slug: "superhero" },
  { label: "Service", slug: "service" },
  { label: "Halloween", slug: "halloween" },
  { label: "Animals & Birds", slug: "animals-birds" },
  { label: "Indian State & Dance", slug: "indian-state-dance" },
];

export const getCategoryBySlug = (slug) =>
  categories.find((c) => c.slug === slug);