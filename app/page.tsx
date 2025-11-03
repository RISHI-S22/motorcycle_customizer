// app/page.tsx
import { redirect } from "next/navigation";

// ✅ No "use client" — this must stay a server component
export default function Page() {
  redirect("/login"); // will instantly redirect
  return null;
}
