import { Container } from "./Container";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white py-14 lg:py-20">
      <Container className="max-w-3xl">
        <h1 className="font-display text-3xl font-light text-black sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-black/50">Last updated: {updated}</p>
        <div className="prose-legal mt-10 space-y-8 text-black/80 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-black [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </Container>
    </div>
  );
}
