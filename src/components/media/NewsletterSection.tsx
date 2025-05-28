import Link from "next/link";

const sampleNewsletters = [
  {
    id: 1,
    title: "Summer Blockbusters Preview",
    summary: "Get a sneak peek at the hottest movies coming this summer!",
  },
  {
    id: 2,
    title: "Behind the Scenes: Animation Magic",
    summary: "Discover how your favorite animated films are made.",
  },
  {
    id: 3,
    title: "Exclusive Interview: Rising Stars",
    summary: "Meet the new faces lighting up the big screen.",
  },
];

export default function NewsletterSection() {
  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Latest Newsletters</h2>
        <Link
          href="/user/dashboard/newsletter"
          className="text-primary underline font-medium"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleNewsletters.map((nl) => (
          <div key={nl.id} className="p-4 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{nl.title}</h3>
            <p className="text-muted-foreground">{nl.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
