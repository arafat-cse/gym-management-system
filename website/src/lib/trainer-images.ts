const TRAINER_IMAGES: Record<string, string> = {
  "kabir hossain": "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=400&h=400",
  "farhan rahman": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400&h=400",
  "sadia islam": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400&h=400",
};

export function getTrainerImage(name: string): string | null {
  return TRAINER_IMAGES[name.toLowerCase()] ?? null;
}
