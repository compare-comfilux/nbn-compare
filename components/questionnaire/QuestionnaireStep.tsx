import type { ReactNode } from "react";

export default function QuestionnaireStep({
  question,
  helpText,
  children,
}: {
  question: string;
  helpText?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">{question}</h2>
      {helpText && <p className="mt-2 text-sm text-slate-500">{helpText}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}
