export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "donor";
  phone: string | null;
  location: string | null;
  created_at: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string;
  interest_campaign_id: string | null;
  status: "pending" | "approved" | "rejected";
  applied_at: string;
}

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  goal: number;
  raised: number;
  image_key: string | null;
  active: boolean;
  created_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_key: string | null;
  created_at: string;
  registrations_count: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author_id: string | null;
  campaign_id: string | null;
  image_key: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface ZakatSetting {
  nisab_value: number;
  updated_at: string;
}

export interface HeroSlide {
  id: string;
  headline: string;
  badge_text: string;
  cta_label: string;
  cta_href: string;
  image_key: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface GalleryPhoto {
  id: string;
  image_key: string;
  category: string;
  alt_text: string | null;
  created_at: string;
}

export type DonationFrequency = "one_time" | "monthly";

export interface Donation {
  id: string;
  campaign_id: string | null;
  donor_name: string;
  donor_email: string;
  amount_cents: number;
  currency: string;
  frequency: DonationFrequency;
  status: "pending" | "completed" | "failed";
  is_fee: boolean;
  created_at: string;
}
