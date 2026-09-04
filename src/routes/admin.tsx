import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/catalog";
import { isValidAffiliateUrl } from "@/lib/affiliate-links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Product Manager — TrendCart" },
      { name: "description", content: "Internal TrendCart tool for managing product affiliate links." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Product Manager — TrendCart" },
      { property: "og:description", content: "Internal TrendCart tool for managing product affiliate links." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return <div className="container mx-auto px-4 py-16 text-muted-foreground">Loading…</div>;
  return signedIn ? <LinkManager /> : <SignIn />;
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  }

  return (
    <div className="container mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Product Manager sign in</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

function LinkManager() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    void supabase
      .from("product_links")
      .select("product_id, affiliate_url")
      .then(({ data }) => {
        if (!data) return;
        const map: Record<string, string> = {};
        for (const row of data) map[row.product_id] = row.affiliate_url ?? "";
        setValues((v) => ({ ...map, ...v }));
      });
  }, []);

  async function save(id: string) {
    const url = (values[id] ?? "").trim();
    if (url && !isValidAffiliateUrl(url)) {
      toast.error("Enter a full URL starting with http:// or https://");
      return;
    }
    setSavingId(id);
    const { error } = await supabase
      .from("product_links")
      .upsert({ product_id: id, affiliate_url: url, updated_at: new Date().toISOString() }, { onConflict: "product_id" });
    setSavingId(null);
    if (error) toast.error(error.message);
    else toast.success("Affiliate link saved");
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Product Manager</h1>
          <p className="text-sm text-muted-foreground">Set the affiliate URL used by each product's Buy Now button.</p>
        </div>
        <Button variant="outline" onClick={() => void supabase.auth.signOut()}>
          Sign out
        </Button>
      </div>

      <div className="space-y-3">
        {products.map((p) => {
          const value = values[p.id] ?? "";
          const configured = isValidAffiliateUrl(value);
          return (
            <div key={p.id} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{p.name}</span>
                <span className={`text-xs ${configured ? "text-primary" : "text-muted-foreground"}`}>
                  {configured ? "Link configured" : "Link coming soon"}
                </span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={value}
                  placeholder="https://merchant.example/your-affiliate-link"
                  onChange={(e) => setValues((v) => ({ ...v, [p.id]: e.target.value }))}
                />
                <Button onClick={() => void save(p.id)} disabled={savingId === p.id}>
                  {savingId === p.id ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
