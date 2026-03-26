import Link from "next/link";
import { ChatWindow } from "@/components/ChatWindow";

const COLORS = {
  bg: "#1A110A",
  accent: "#C17A2E",
  text: "#F0E6D0",
} as const;

function AccentRule() {
  return (
    <div
      aria-hidden="true"
      className="h-px w-full"
      style={{
        background:
          "linear-gradient(90deg, rgba(193,122,46,0) 0%, rgba(193,122,46,0.8) 20%, rgba(193,122,46,1) 50%, rgba(193,122,46,0.8) 80%, rgba(193,122,46,0) 100%)",
      }}
    />
  );
}

function Badge(props: { label: string }) {
  return (
    <div
      className="rounded-full border px-4 py-2 text-sm tracking-wide"
      style={{
        borderColor: "rgba(240,230,208,0.18)",
        color: COLORS.text,
        backgroundColor: "rgba(240,230,208,0.04)",
      }}
    >
      {props.label}
    </div>
  );
}

function SectionHeading(props: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-3xl">
      {props.eyebrow ? (
        <div
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "rgba(240,230,208,0.7)" }}
        >
          {props.eyebrow}
        </div>
      ) : null}
      <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight" style={{ color: COLORS.text }}>
        {props.title}
      </h2>
      {props.subtitle ? (
        <p className="mt-3 text-base md:text-lg" style={{ color: "rgba(240,230,208,0.78)" }}>
          {props.subtitle}
        </p>
      ) : null}
    </div>
  );
}

function Card(props: { title: string; children: React.ReactNode; icon?: string }) {
  return (
    <div
      className="rounded-2xl border p-6 md:p-7"
      style={{
        borderColor: "rgba(240,230,208,0.14)",
        background:
          "radial-gradient(1200px 300px at 10% 0%, rgba(193,122,46,0.10) 0%, rgba(193,122,46,0.00) 55%), rgba(240,230,208,0.03)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold" style={{ color: COLORS.text }}>
            {props.title}
          </div>
        </div>
        {props.icon ? (
          <div
            className="size-10 rounded-xl grid place-items-center border text-lg"
            style={{
              borderColor: "rgba(193,122,46,0.35)",
              backgroundColor: "rgba(193,122,46,0.12)",
              color: COLORS.accent,
            }}
            aria-hidden="true"
          >
            {props.icon}
          </div>
        ) : null}
      </div>
      <div className="mt-3 text-sm md:text-base" style={{ color: "rgba(240,230,208,0.78)" }}>
        {props.children}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      {/* Navbar */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur"
        style={{
          borderColor: "rgba(240,230,208,0.10)",
          backgroundColor: "rgba(26,17,10,0.72)",
        }}
      >
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div
                className="size-9 rounded-xl border grid place-items-center font-semibold tracking-tight"
                style={{
                  borderColor: "rgba(193,122,46,0.45)",
                  backgroundColor: "rgba(193,122,46,0.10)",
                  color: COLORS.accent,
                }}
                aria-hidden="true"
              >
                C
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
                  Crockett&apos;s Public House
                </div>
                <div className="text-xs" style={{ color: "rgba(240,230,208,0.7)" }}>
                  Puyallup • Public House Fare
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-7 text-sm" style={{ color: "rgba(240,230,208,0.8)" }}>
              <a href="#about" className="hover:opacity-90">
                About
              </a>
              <a href="#menu" className="hover:opacity-90">
                Menu Highlights
              </a>
              <a href="#hours" className="hover:opacity-90">
                Hours
              </a>
              <a href="#catering" className="hover:opacity-90">
                Catering
              </a>
              <a href="#chat" className="hover:opacity-90">
                Chat
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="tel:+12534663075"
                className="hidden sm:inline-flex items-center rounded-full border px-4 py-2 text-sm"
                style={{
                  borderColor: "rgba(240,230,208,0.14)",
                  backgroundColor: "rgba(240,230,208,0.03)",
                }}
              >
                <span className="mr-2" aria-hidden="true">
                  📞
                </span>
                (253) 466-3075
              </a>
              <a
                href="#chat"
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
                style={{ backgroundColor: COLORS.accent, color: "#140B05" }}
              >
                Chat now
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(900px 500px at 12% 18%, rgba(193,122,46,0.22) 0%, rgba(193,122,46,0.06) 35%, rgba(26,17,10,0) 60%), radial-gradient(700px 400px at 86% 22%, rgba(240,230,208,0.12) 0%, rgba(240,230,208,0.02) 42%, rgba(26,17,10,0) 65%)",
            }}
          />

          <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
            <div className="grid gap-10 md:grid-cols-[1.25fr,0.75fr] md:items-center">
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{
                    borderColor: "rgba(240,230,208,0.14)",
                    backgroundColor: "rgba(240,230,208,0.03)",
                    color: "rgba(240,230,208,0.82)",
                  }}
                >
                  <span aria-hidden="true" style={{ color: COLORS.accent }}>
                    ●
                  </span>
                  Puyallup, WA • Public House Classics
                </div>

                <h1
                  className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight"
                  style={{ color: COLORS.text }}
                >
                  Where Puyallup comes to eat
                </h1>

                <p className="mt-5 text-base md:text-lg max-w-2xl" style={{ color: "rgba(240,230,208,0.78)" }}>
                  Friendly pub vibes, weekend breakfast, and craveable favorites. Ask our assistant about hours, happy hour, menu
                  highlights, and ordering.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href="https://crockettspublichouse.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold"
                    style={{ backgroundColor: COLORS.accent, color: "#140B05" }}
                  >
                    View full menu
                  </a>
                  <a
                    href="#hours"
                    className="inline-flex items-center rounded-full border px-5 py-3 text-sm font-semibold"
                    style={{
                      borderColor: "rgba(240,230,208,0.18)",
                      backgroundColor: "rgba(240,230,208,0.03)",
                      color: COLORS.text,
                    }}
                  >
                    See hours
                  </a>
                  <a
                    href="#catering"
                    className="inline-flex items-center rounded-full border px-5 py-3 text-sm font-semibold"
                    style={{
                      borderColor: "rgba(193,122,46,0.35)",
                      backgroundColor: "rgba(193,122,46,0.10)",
                      color: COLORS.text,
                    }}
                  >
                    Catering inquiry
                  </a>
                </div>

                <div className="mt-10">
                  <AccentRule />
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Badge label="Featured on Food Network • Diners, Drive‑Ins and Dives" />
                    <Badge label="Best Of Showcase Magazine • 2016–2024" />
                  </div>
                </div>
              </div>

              <div className="md:justify-self-end">
                <div
                  className="rounded-3xl border p-6 md:p-7"
                  style={{
                    borderColor: "rgba(240,230,208,0.14)",
                    background:
                      "linear-gradient(180deg, rgba(240,230,208,0.04), rgba(240,230,208,0.02))",
                  }}
                >
                  <div className="text-sm font-semibold" style={{ color: "rgba(240,230,208,0.86)" }}>
                    Puyallup location
                  </div>
                  <div className="mt-3 space-y-3 text-sm" style={{ color: "rgba(240,230,208,0.78)" }}>
                    <div>
                      <div className="text-xs uppercase tracking-[0.16em]" style={{ color: "rgba(240,230,208,0.6)" }}>
                        Address
                      </div>
                      <div>118 E Stewart Ave, Puyallup WA 98372</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.16em]" style={{ color: "rgba(240,230,208,0.6)" }}>
                        Phone
                      </div>
                      <a className="underline underline-offset-4" href="tel:+12534663075">
                        (253) 466-3075
                      </a>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.16em]" style={{ color: "rgba(240,230,208,0.6)" }}>
                        Happy Hour
                      </div>
                      <div>Mon–Thu 3–5pm, and all day Sunday (bar only)</div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <a
                      href="https://crockettspublichouse.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border px-4 py-3 text-center text-sm font-semibold"
                      style={{
                        borderColor: "rgba(240,230,208,0.14)",
                        backgroundColor: "rgba(240,230,208,0.03)",
                        color: COLORS.text,
                      }}
                    >
                      Order / Waitlist
                    </a>
                    <a
                      href="#chat"
                      className="rounded-2xl px-4 py-3 text-center text-sm font-semibold"
                      style={{ backgroundColor: COLORS.accent, color: "#140B05" }}
                    >
                      Ask a question
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <SectionHeading
            eyebrow="About"
            title="A public house with deep roots"
            subtitle="Over 35 years in the restaurant business, serving up memorable favorites with a warm, local feel."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Card title="35+ years" icon="⏳">
              Over three decades of hospitality experience—built on consistency, community, and comfort food done right.
            </Card>
            <Card title="Weekend breakfast" icon="🍳">
              Breakfast is served Saturday and Sunday from 8:00am–12:00pm at the Puyallup location.
            </Card>
            <Card title="Happy hour (bar only)" icon="🍻">
              Mon–Thu 3:00pm–5:00pm, and all day Sunday—available in the bar area only.
            </Card>
          </div>
        </section>

        {/* Menu highlights */}
        <section id="menu" className="mx-auto max-w-6xl px-5 pb-16 md:pb-20">
          <SectionHeading
            eyebrow="Menu highlights"
            title="Fan favorites, always in season"
            subtitle="A few standout classics guests ask for again and again. For the full menu, visit the website."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Card title="Grilled Artichoke" icon="🔥">
              A bold, shareable starter with that signature grill-kissed flavor.
            </Card>
            <Card title="Public House Meatballs" icon="🍽️">
              Hearty, craveable comfort—perfect for kicking off the meal.
            </Card>
            <Card title="Mom's Sloppy Joe" icon="🥪">
              Nostalgic, satisfying, and unapologetically delicious.
            </Card>
            <Card title="Gooey Grilled Cheese Melt" icon="🧀">
              Golden, melty, and made for maximum comfort.
            </Card>
          </div>

          <div className="mt-8">
            <a
              href="https://crockettspublichouse.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border px-5 py-3 text-sm font-semibold"
              style={{
                borderColor: "rgba(193,122,46,0.35)",
                backgroundColor: "rgba(193,122,46,0.10)",
                color: COLORS.text,
              }}
            >
              View full menu on crockettspublichouse.com
            </a>
          </div>
        </section>

        {/* Hours */}
        <section id="hours" className="mx-auto max-w-6xl px-5 pb-16 md:pb-20">
          <SectionHeading
            eyebrow="Hours"
            title="Plan your visit"
            subtitle="Puyallup hours are listed below. Bonney Lake and Maple Valley coming soon."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Card title="Puyallup" icon="📍">
              <div className="space-y-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.16em]" style={{ color: "rgba(240,230,208,0.6)" }}>
                    Breakfast
                  </div>
                  <div>Sat & Sun: 8:00am–12:00pm</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.16em]" style={{ color: "rgba(240,230,208,0.6)" }}>
                    Lunch / Dinner
                  </div>
                  <div>Mon–Thu: 11:00am–10:00pm</div>
                  <div>Fri: 11:00am–11:00pm</div>
                  <div>Sat: 8:00am–11:00pm</div>
                  <div>Sun: 8:00am–10:00pm</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.16em]" style={{ color: "rgba(240,230,208,0.6)" }}>
                    Happy hour (bar only)
                  </div>
                  <div>Mon–Thu: 3:00pm–5:00pm</div>
                  <div>Sunday: all day</div>
                </div>
              </div>
            </Card>

            <Card title="Bonney Lake" icon="🕰️">
              Hours not listed on this page yet. For the latest details, please check the website or call your preferred location.
            </Card>

            <Card title="Maple Valley" icon="🕰️">
              Hours not listed on this page yet. For the latest details, please check the website or call your preferred location.
            </Card>
          </div>
        </section>

        {/* Catering lead capture */}
        <section id="catering" className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
          <div
            className="rounded-3xl border p-7 md:p-10"
            style={{
              borderColor: "rgba(240,230,208,0.14)",
              background:
                "radial-gradient(900px 360px at 10% 0%, rgba(193,122,46,0.16) 0%, rgba(193,122,46,0.00) 60%), rgba(240,230,208,0.03)",
            }}
          >
            <div className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-start">
              <div>
                <SectionHeading
                  eyebrow="Catering"
                  title="Bring Crockett’s to your next gathering"
                  subtitle="Leave your details and we’ll follow up. (This is a demo lead form—wire it to your email/CRM when ready.)"
                />

                <div className="mt-6 text-sm" style={{ color: "rgba(240,230,208,0.78)" }}>
                  Prefer to talk now? Call{" "}
                  <a className="underline underline-offset-4" href="tel:+12534663075">
                    (253) 466-3075
                  </a>
                  .
                </div>
              </div>

              <form
                className="grid gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                    style={{
                      borderColor: "rgba(240,230,208,0.14)",
                      backgroundColor: "rgba(26,17,10,0.55)",
                      color: COLORS.text,
                    }}
                    placeholder="First name"
                    name="firstName"
                  />
                  <input
                    className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                    style={{
                      borderColor: "rgba(240,230,208,0.14)",
                      backgroundColor: "rgba(26,17,10,0.55)",
                      color: COLORS.text,
                    }}
                    placeholder="Last name"
                    name="lastName"
                  />
                </div>
                <input
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{
                    borderColor: "rgba(240,230,208,0.14)",
                    backgroundColor: "rgba(26,17,10,0.55)",
                    color: COLORS.text,
                  }}
                  placeholder="Email"
                  name="email"
                  type="email"
                />
                <input
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{
                    borderColor: "rgba(240,230,208,0.14)",
                    backgroundColor: "rgba(26,17,10,0.55)",
                    color: COLORS.text,
                  }}
                  placeholder="Phone (optional)"
                  name="phone"
                />
                <textarea
                  className="min-h-[110px] w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{
                    borderColor: "rgba(240,230,208,0.14)",
                    backgroundColor: "rgba(26,17,10,0.55)",
                    color: COLORS.text,
                  }}
                  placeholder="Tell us about your event (date, guest count, anything special)…"
                  name="message"
                />

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold"
                  style={{ backgroundColor: COLORS.accent, color: "#140B05" }}
                >
                  Request catering info
                </button>

                <div className="text-xs" style={{ color: "rgba(240,230,208,0.62)" }}>
                  By submitting, you agree we can contact you about your inquiry.
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Chat */}
        <section id="chat" className="mx-auto max-w-6xl px-5 pb-24">
          <SectionHeading
            eyebrow="Chat"
            title="Ask Crockett’s anything"
            subtitle="Get quick answers about hours, happy hour, menu highlights, and ordering."
          />

          <div className="mt-10">
            <ChatWindow
              endpoint="api/chat"
              emoji="🍻"
              placeholder="Try: “What are your Puyallup hours today?” or “What time is happy hour?”"
              emptyStateComponent={
                <div
                  className="rounded-2xl border p-6 text-sm"
                  style={{
                    borderColor: "rgba(240,230,208,0.14)",
                    backgroundColor: "rgba(240,230,208,0.03)",
                    color: "rgba(240,230,208,0.8)",
                  }}
                >
                  Ask about the Puyallup location: address, phone, hours, happy hour, menu highlights, and online ordering/waitlist.
                </div>
              }
            />
          </div>
        </section>
      </main>

      {/* Floating chat bubble */}
      <a
        href="#chat"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-lg"
        style={{
          backgroundColor: COLORS.accent,
          color: "#140B05",
          boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
        }}
        aria-label="Open chat"
      >
        <span aria-hidden="true">💬</span>
        Chat
      </a>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: "rgba(240,230,208,0.10)" }}>
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
                Crockett&apos;s Public House
              </div>
              <div className="mt-1 text-sm" style={{ color: "rgba(240,230,208,0.72)" }}>
                118 E Stewart Ave, Puyallup WA 98372 • (253) 466-3075
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm" style={{ color: "rgba(240,230,208,0.72)" }}>
              <a className="hover:opacity-90" href="#about">
                About
              </a>
              <a className="hover:opacity-90" href="#menu">
                Menu Highlights
              </a>
              <a className="hover:opacity-90" href="#hours">
                Hours
              </a>
              <a
                className="hover:opacity-90"
                href="https://crockettspublichouse.com/"
                target="_blank"
                rel="noreferrer"
              >
                Website
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
