import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

export default function PlanDataUnavailable() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">
        Plan data is temporarily unavailable
      </h1>
      <p className="mt-4 text-slate-600">
        We couldn&apos;t reach our plan data source just now. This is usually
        temporary — please try again in a moment.
      </p>
      <Alert tone="neutral" className="mt-6 text-left">
        Plan data is provided by Oz Broadband Review and normally refreshes
        regularly. If this keeps happening, please{" "}
        <a href="/contact" className="underline">
          let us know
        </a>
        .
      </Alert>
      <div className="mt-6">
        <Button href="/compare">Try Again</Button>
      </div>
    </div>
  );
}
