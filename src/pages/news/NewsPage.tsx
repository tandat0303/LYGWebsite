import { useState, useEffect } from "react";
import { type NewsItem } from "../../types/news";
import News from "./News";
import NewsDetail from "./NewsDetail";
import { useAppSelector } from "../../hooks/auth";
import newsApi from "../../api/features/news";
import { AppAlert } from "../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../libs/helper";

export default function NewsPage() {
  const currentUser = useAppSelector((s) => s.auth.user);

  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await newsApi.getAllNews(currentUser.userId);
        setItems(res ?? []);
      } catch (error) {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (selected) {
    return <NewsDetail item={selected} onBack={() => setSelected(null)} />;
  }

  return <News items={items} loading={loading} onSelect={setSelected} />;
}
