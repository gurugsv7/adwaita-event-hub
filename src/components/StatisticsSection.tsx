const stats = [
  { value: "50+", label: "Total Events" },
  { value: "₹5,50,000", label: "Prize Pool" },
  { value: "100+", label: "Participating Colleges" },
];

export function StatisticsSection() {
  return (
    <section className="gradient-stats py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card border border-primary rounded-lg p-8 text-center event-card"
            >
              <p className="font-serif text-primary text-3xl md:text-4xl font-bold mb-2">
                {stat.value}
              </p>
              <p className="text-silver text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
