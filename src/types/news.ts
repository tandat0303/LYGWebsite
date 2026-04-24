export interface NewsItem {
  id: number;
  title: string;
  content: string;
  image_news: string | null;
  file_news: string | null;
  link_url: string;
  timer_post: string;
  post_type: boolean;
  post_time: string;
  hide: boolean;
  userid: string;
  isRead: string;
}

export interface NewsCardProps {
  item: NewsItem;
  onSelect: (item: NewsItem) => void;
  horizontal?: boolean;
}

export interface NewsProps {
  items: NewsItem[];
  onSelect: (item: NewsItem) => void;
  loading?: boolean;
}

export interface NewsDetailProps {
  item: NewsItem;
  onBack: () => void;
}
