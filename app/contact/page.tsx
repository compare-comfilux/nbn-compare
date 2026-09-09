import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with the Compare NBN team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
      <p className="mt-3 text-slate-600">
        Questions, data corrections or feedback — we&apos;d like to hear from
        you.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
