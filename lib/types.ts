export type SiteContent = {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
};

export type PortalLink = {
  id: number;
  title: string;
  description: string | null;
  url: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type PortalLinkRow = {
  id: number;
  title: string;
  description: string | null;
  url: string;
  icon: string;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
};

export type SiteContentRow = {
  key: string;
  value: string;
  updated_at: string;
};

export type CreateLinkInput = {
  title: string;
  description?: string | null;
  url: string;
  icon?: string;
  sort_order?: number;
  is_active?: boolean;
};

export type UpdateLinkInput = Partial<CreateLinkInput>;

export type UpdateSiteContentInput = Partial<SiteContent>;

export type ApiResult<T = unknown> = {
  success?: boolean;
  error?: string;
  data?: T;
};
