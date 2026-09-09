import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-teal-700 text-white hover:bg-teal-800 focus-visible:outline-teal-700",
  secondary:
    "bg-white text-teal-800 border border-teal-700 hover:bg-teal-50 focus-visible:outline-teal-700",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-400",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

interface LinkButtonProps {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

interface ClickButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  href?: undefined;
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

type ButtonProps = LinkButtonProps | ClickButtonProps;

export default function Button(props: ButtonProps) {
  const { variant = "primary", children, className = "" } = props;
  const classes = `${BASE} ${VARIANT_CLASSES[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { href, variant: _v, className: _c, children: _ch, ...rest } =
    props as ClickButtonProps;
  void href;
  void _v;
  void _c;
  void _ch;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
