import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/auth";
import type { ContactItem } from "../../types/contact";
import contactApi from "../../api/contact";
import { AppAlert } from "../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../libs/helper";
import Contact from "./Contact";

export default function ContactPage() {
  const currentUser = useAppSelector((s) => s.auth.user);

  const [items, setItems] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);

        const res = await contactApi.getContactInfo(currentUser.factory);
        setItems(res ?? []);
      } catch (error) {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return <Contact groups={items} loading={loading} />;
}
