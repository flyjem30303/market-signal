import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Not Found"
};

export default function MembershipPage() {
  notFound();
}
