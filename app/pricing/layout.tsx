export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="py-6 md:py-10">
      <div className="container mx-auto max-w-7xl px-4">
        {children}
      </div>
    </section>
  );
}
