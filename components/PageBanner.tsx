import Image from "next/image";

export function PageBanner({
  src,
  eyebrow,
  title,
  children,
}: {
  src: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-[#e7dcc8]">
      <div className="absolute inset-0">
        <Image src={src} alt="" fill className="object-cover" sizes="1100px" priority={false} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#122018]/85 via-[#1a2e24]/70 to-[#2f4a3a]/45" />
      </div>
      <div className="relative px-6 py-10 sm:px-10 sm:py-12">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#e7dcc8]">{eyebrow}</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold text-[#fffaf2] sm:text-4xl">{title}</h1>
        {children ? <div className="mt-3 max-w-2xl text-[#e7dcc8]">{children}</div> : null}
      </div>
    </header>
  );
}
