export interface Thumb {
  url: string;
}

export interface Image {
  url: string;
  thumb: Thumb;
}

export interface Category {
  id: number;
  title: string;
  description: string;
  slug: string;
  ancestry: string;
}

export interface Stream {
  stream: string;
  bitrate: number;
  content_type: string;
  status: number;
  listeners: number;
}

export interface RadioStream {
  id: number;
  name: string;
  country: string;
  image: Image;
  slug: string;
  website: string;
  twitter: string;
  facebook: string;
  total_listeners: number;
  categories: Category[];
  streams: Stream[];
  created_at: Date;
  updated_at: Date;
}
