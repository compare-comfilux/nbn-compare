import Alert from "./Alert";

export default function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <Alert tone="neutral" className={className}>
      Plan information can change. Always confirm pricing, availability, terms
      and eligibility with the provider before signing up.
    </Alert>
  );
}
