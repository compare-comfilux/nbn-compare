interface FaqItem {
  question: string;
  answer: string;
}

export default function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
      {items.map((item) => (
        <details key={item.question} className="group p-5">
          <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:content-none">
            <span className="flex items-center justify-between">
              {item.question}
              <span className="ml-4 text-slate-400 group-open:rotate-45 transition-transform">
                +
              </span>
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
