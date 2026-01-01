import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Copy, ExternalLink, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/data/events";
import { useMemo, useState } from "react";

const buildAbsoluteUrl = (path: string) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}${path}`;
};

export default function BrochureLinksPage() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out: Array<{
      categoryId: string;
      categoryTitle: string;
      eventId: string;
      eventTitle: string;
      path: string;
    }> = [];

    for (const c of categories) {
      for (const e of c.events) {
        const path = `/${c.id}/${e.id}`;
        const hay = `${c.title} ${c.id} ${e.title} ${e.id}`.toLowerCase();
        if (!q || hay.includes(q)) {
          out.push({
            categoryId: c.id,
            categoryTitle: c.title,
            eventId: e.id,
            eventTitle: e.title,
            path,
          });
        }
      }
    }

    return out;
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, { title: string; items: typeof rows }>();
    for (const r of rows) {
      const existing = map.get(r.categoryId);
      if (existing) existing.items.push(r);
      else map.set(r.categoryId, { title: r.categoryTitle, items: [r] });
    }
    return Array.from(map.entries());
  }, [rows]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied", description: text });
    } catch {
      toast({
        title: "Copy failed",
        description: "Please copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Event Registration Links | ADWAITA 2026</title>
        <meta
          name="description"
          content="Copy clean registration links for every ADWAITA 2026 event to use in brochures and posters."
        />
        <link rel="canonical" href={buildAbsoluteUrl("/brochure-links")} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24 pb-16">
          <section className="container mx-auto px-4">
            <header className="max-w-3xl">
              <h1 className="font-heading text-3xl md:text-4xl text-foreground">
                Event registration links
              </h1>
              <p className="text-silver/70 mt-2">
                Use these clean URLs in your brochure (format: /category/event-id).
              </p>
              <p className="text-silver/60 text-sm mt-2">
                Example: <code className="px-2 py-1 rounded bg-muted/40">/culturals/solo-singing-freestyle</code>
              </p>
            </header>

            <div className="mt-8 max-w-xl">
              <div className="relative">
                <Search className="w-4 h-4 text-silver/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search event or category..."
                  className="pl-9 bg-background/60 border-border/40"
                />
              </div>
            </div>

            <div className="mt-10 space-y-10">
              {grouped.map(([catId, group]) => (
                <section key={catId} className="space-y-4">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <h2 className="font-heading text-xl text-foreground">
                      {group.title} <span className="text-silver/50">({catId})</span>
                    </h2>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => copy(buildAbsoluteUrl(`/events/${catId}`))}
                    >
                      <Copy className="w-4 h-4" />
                      Copy category page
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {group.items.map((r) => (
                      <article
                        key={r.path}
                        className="bg-card/70 border border-border/40 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-foreground font-medium leading-tight">
                              {r.eventTitle}
                            </h3>
                            <p className="text-xs text-silver/60 mt-1">{r.path}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => copy(buildAbsoluteUrl(r.path))}
                              aria-label={`Copy link for ${r.eventTitle}`}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              asChild
                              aria-label={`Open ${r.eventTitle}`}
                            >
                              <Link to={r.path}>
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}

              {rows.length === 0 && (
                <div className="text-silver/70">No events match your search.</div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
