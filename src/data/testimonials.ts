// Quotes from people who use HeadlessOS, shown on the landing page under "What people say".
// The section stays hidden while this list is empty, so never put a made-up quote here: only real ones,
// with the person's permission. Add `href` to link the name (a GitHub profile, a post, an issue).
export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  href?: string;
}

export const testimonials: Testimonial[] = [];
