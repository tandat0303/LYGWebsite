import dayjs from "dayjs";

export const getApiErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "Unexpected error occurred";
};

export const maskOf = (val: React.ReactNode): string =>
  "•".repeat(String(val ?? "").length);

export function isoToDisplay(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// export function isValidDate(s: string) {
//   if (!/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return false;
//   const [dd, mm, yyyy] = s.split("/").map(Number);
//   const dt = new Date(yyyy, mm - 1, dd);
//   return (
//     dt.getFullYear() === yyyy && dt.getMonth() === mm - 1 && dt.getDate() === dd
//   );
// }

export function formatDateRaw(digits: string): string {
  const d = digits.slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return d.slice(0, 2) + "/" + d.slice(2);
  return d.slice(0, 2) + "/" + d.slice(2, 4) + "/" + d.slice(4);
}

export function formatTime(iso: string) {
  const d = dayjs(iso).format("DD/MM/YYYY HH:mm");
  return d;
}

export function formatDateTime(iso: string) {
  const d = dayjs(iso).format("DD/MM/YYYY HH:mm:ss");
  return d;
}

export function dateToTimestamp(
  date: number,
  month: number,
  year: number,
): number {
  return dayjs(
    `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`,
  ).valueOf();
}

export function parseDate(iso: string): Date {
  return new Date(iso);
}

export function timeAgo(isoDate: string): string {
  const now = new Date();
  const past = new Date(isoDate);

  const diffMs = now.getTime() - past.getTime();

  if (isNaN(diffMs)) return "Invalid date";

  const seconds = Math.floor(diffMs / 1000);
  if (seconds <= 60) return `${seconds} giây trước`;

  const minutes = Math.floor(seconds / 60);
  if (minutes <= 60) return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours <= 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  if (days <= 30) return `${days} ngày trước`;

  const months = Math.floor(days / 30);
  if (months <= 12) return `${months} tháng trước`;

  const years = Math.floor(months / 12);
  return `${years} năm trước`;
}

export function fmt(
  value: number | undefined | null,
  revealed: boolean,
): string {
  if (!revealed) return "••••••";
  if (value === undefined || value === null) return "—";
  return value.toLocaleString("vi-VN") + " đ";
}
