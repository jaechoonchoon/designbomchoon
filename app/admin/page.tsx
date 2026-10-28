import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/admin-app";

export const metadata: Metadata = {
  title: "관리자 | 디자인봄춘",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
