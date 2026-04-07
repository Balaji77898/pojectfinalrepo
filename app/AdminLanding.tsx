"use client";

import { useEffect, useRef, useState } from "react";
import { ADMIN_LANDING_CSS_1 } from "./admin-landing-styles-part1";
import { ADMIN_LANDING_CSS_2 } from "./admin-landing-styles-part2";
import { API_CONFIG } from "@/app/admin/lib/api.config";
import { normalizeResponse } from "@/app/admin/lib/api.service";

const MQ = [
  "Admin Panel",
  "Staff Portal",
  "Live Dashboard",
  "Table Control",
  "Order Management",
  "Inventory",
  "Analytics",
  "Staff Roster",
];
const R1 = [
  { tag: "Kitchen Ops", name: "Live Kitchen View", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80" },
  { tag: "Floor Ops", name: "Main Dining Hall", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80" },
  { tag: "Staff Team", name: "Kitchen Brigade", img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=700&q=80" },
  { tag: "Table Service", name: "Floor Operations", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=700&q=80" },
  { tag: "Inventory", name: "Pantry & Cold Store", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&q=80" },
  { tag: "Beverage", name: "Bar Station", img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=700&q=80" },
];
const R2 = [
  { tag: "Daily Prep", name: "Chef's Mise en Place", img: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=700&q=80" },
  { tag: "Private Dining", name: "Banquet Room Setup", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80" },
  { tag: "Plating", name: "Finishing Counter", img: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=700&q=80" },
  { tag: "Guest Exp.", name: "Front of House", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80" },
  { tag: "Morning Ops", name: "Opening Shift", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=700&q=80" },
  { tag: "Events", name: "Special Event Night", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=700&q=80" },
];
const FEATS = [
  { num: "01", ico: "📋", title: "Order Management", body: "Track every dine-in, takeaway, and delivery order live from one dashboard. Assign, update, and close orders in seconds." },
  { num: "02", ico: "🪑", title: "Table Control", body: "Visual floor plan with real-time availability, reservations, and walk-in management across all sections." },
  { num: "03", ico: "👨‍🍳", title: "Staff Scheduling", body: "Build rosters, manage shifts, track attendance, and handle leave requests — all from a single interface." },
  { num: "04", ico: "📦", title: "Inventory Tracker", body: "Monitor stock levels, set alerts, track wastage, and auto-generate purchase orders before you run out." },
  { num: "05", ico: "📊", title: "Revenue Analytics", body: "Daily covers, revenue, top dishes, and peak hours displayed in beautiful visual reports and exports." },
  { num: "06", ico: "🔔", title: "Live Notifications", body: "Instant alerts for new orders, staff actions, stock issues, and special guest requests — every shift." },
];
const GALLERY = [
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80", cls: "gi-A", name: "Main Dining Room", tag: "Ambiance" },
  { src: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80", cls: "gi-B", name: "Kitchen Brigade", tag: "Team" },
  { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80", cls: "gi-C", name: "Kitchen Station", tag: "Operations" },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", cls: "gi-D", name: "Private Dining", tag: "Events" },
  { src: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&q=80", cls: "gi-E", name: "Plating Station", tag: "Culinary" },
  { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", cls: "gi-F", name: "Front of House", tag: "Service" },
];
const STATS = [
  { ico: "📋", n: "1,240+", l: "Orders Managed" },
  { ico: "🪑", n: "48", l: "Tables Tracked" },
  { ico: "👨‍🍳", n: "36", l: "Staff Members" },
  { ico: "⭐", n: "4.9", l: "Guest Rating" },
];

interface RestoInfo {
  name: string;
  type: string;
  address: string;
  city: string;
  phone: string;
  description: string;
}

const DEF: RestoInfo = {
  name: "Restaurant",
  type: "Fine Dining",
  address: "",
  city: "",
  phone: "",
  description:
    "This portal puts every aspect of operations at your fingertips — live orders, staff, tables, and reports.",
};

export default function AdminLanding() {
  const coRef = useRef<HTMLDivElement>(null);
  const ciRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const outer = useRef({ x: -200, y: -200 });
  const tgt = useRef({ x: -200, y: -200 });
  const qBg = useRef<HTMLDivElement>(null);
  const qSec = useRef<HTMLDivElement>(null);
  const [mob, setMob] = useState(false);
  const [sc, setSc] = useState(false);
  const [splash, setSplash] = useState<"show" | "exit" | "done">("show");
  const [resto, setResto] = useState<RestoInfo>(DEF);

  useEffect(() => {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.RESTAURANT}`;
    fetch(url, { headers: { "Content-Type": "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((raw) => {
        if (!raw) return;
        const d = normalizeResponse(raw, raw) as Record<string, unknown>;
        setResto({
          name: (typeof d.name === "string" && d.name) || DEF.name,
          type: (typeof d.restaurant_type === "string" && d.restaurant_type) || DEF.type,
          address: (typeof d.address === "string" && d.address) || "",
          city: (typeof d.city === "string" && d.city) || "",
          phone: (typeof d.phone === "string" && d.phone) || "",
          description: (typeof d.description === "string" && d.description) || DEF.description,
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      setSplash("exit");
      setTimeout(() => {
        setSplash("done");
        document.body.style.overflow = "";
      }, 780);
    }, 3400);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const isPtr = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isPtr) return;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const onMv = (e: MouseEvent) => {
      tgt.current = { x: e.clientX, y: e.clientY };
      if (ciRef.current) {
        ciRef.current.style.left = `${e.clientX}px`;
        ciRef.current.style.top = `${e.clientY}px`;
      }
    };
    const tick = () => {
      outer.current.x = lerp(outer.current.x, tgt.current.x, 0.13);
      outer.current.y = lerp(outer.current.y, tgt.current.y, 0.13);
      if (coRef.current) {
        coRef.current.style.left = `${outer.current.x}px`;
        coRef.current.style.top = `${outer.current.y}px`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    const onDn = () => coRef.current?.classList.add("clk");
    const onUp = () => coRef.current?.classList.remove("clk");
    const onEn = () => coRef.current?.classList.add("hov");
    const onLv = () => coRef.current?.classList.remove("hov");
    const els = document.querySelectorAll("a,button,.ic,.gi,.fc,.ab-stat,.sc-card");
    els.forEach((el) => {
      el.addEventListener("mouseenter", onEn);
      el.addEventListener("mouseleave", onLv);
    });
    window.addEventListener("mousemove", onMv);
    window.addEventListener("mousedown", onDn);
    window.addEventListener("mouseup", onUp);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMv);
      window.removeEventListener("mousedown", onDn);
      window.removeEventListener("mouseup", onUp);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onEn);
        el.removeEventListener("mouseleave", onLv);
      });
    };
  }, []);

  useEffect(() => {
    const onSc = () => {
      setSc(window.scrollY > 50);
      if (qSec.current && qBg.current) {
        const r = qSec.current.getBoundingClientRect();
        qBg.current.style.transform = `translateY(${
          ((window.innerHeight / 2 - r.top) / window.innerHeight) * 65
        }px)`;
      }
    };
    window.addEventListener("scroll", onSc, { passive: true });
    return () => window.removeEventListener("scroll", onSc);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("v")),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".rv,.rv-l,.rv-r").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const mq3 = [...MQ, ...MQ, ...MQ];
  const r1d = [...R1, ...R1];
  const r2d = [...R2, ...R2];
  const loc = [resto.address, resto.city].filter(Boolean).join(", ") || "Est. 2008";
  const initial = resto.name.charAt(0);

  return (
    <div className="landing-root">
      <style dangerouslySetInnerHTML={{ __html: ADMIN_LANDING_CSS_1 + ADMIN_LANDING_CSS_2 }} />
      <div id="lco" ref={coRef} />
      <div id="lci" ref={ciRef} />

      {splash !== "done" && (
        <>
          <div className={`splash-t${splash === "exit" ? " go" : ""}`} />
          <div className={`splash-b${splash === "exit" ? " go" : ""}`} />
          {splash === "show" && (
            <div className="splash">
              <div
                className="splash-ring"
                style={{
                  width: "min(68vw,68vh,480px)",
                  height: "min(68vw,68vh,480px)",
                  animationDelay: "0.1s",
                }}
              />
              <div
                className="splash-ring"
                style={{
                  width: "min(52vw,52vh,360px)",
                  height: "min(52vw,52vh,360px)",
                  animationDelay: "0.22s",
                  borderColor: "rgba(192,144,32,.12)",
                }}
              />
              <div className="splash-spin" style={{ width: "min(60vw,60vh,420px)", height: "min(60vw,60vh,420px)" }} />
              <div className="splash-corner sp-tl" />
              <div className="splash-corner sp-tr" />
              <div className="splash-corner sp-bl" />
              <div className="splash-corner sp-br" />
              <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                <div className="splash-name">{resto.name}</div>
                <div className="splash-rule">
                  <div className="sr-l" />
                  <div className="sr-dot" />
                  <div className="sr-d" />
                  <div className="sr-dot" />
                  <div className="sr-l" />
                </div>
                <div className="splash-sub">{resto.type}</div>
                <div className="splash-tag">Restaurant Management System · Staff & Admin Portal</div>
              </div>
              <div className="splash-loader">
                <div className="splash-bar-track">
                  <div className="splash-bar-fill" />
                </div>
                <div className="splash-loader-txt">Loading</div>
              </div>
            </div>
          )}
        </>
      )}

      <div className={`l-mob${mob ? " open" : ""}`}>
        <button type="button" className="mob-x" onClick={() => setMob(false)}>
          ✕
        </button>
        {["About", "Operations", "Gallery"].map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMob(false)}>
            {l}
          </a>
        ))}
        <a href="/admin/login" className="mob-cta" onClick={() => setMob(false)}>
          Access Dashboard
        </a>
      </div>

      <nav className={`l-nav${sc ? " sc" : ""}`}>
        <div className="nav-wordmark">
          <span className="nav-w1">{resto.name}</span>
          <span className="nav-w2">Staff & Admin Portal</span>
        </div>
        <a href="/admin/login" className="nav-cta">
          <span>Access Dashboard</span>
        </a>
        <button type="button" className="ham" onClick={() => setMob(true)} aria-label="Open menu">
          <b />
          <b />
          <b />
        </button>
      </nav>

      <div className="l-hero">
        <div className="hero-wm" aria-hidden="true">
          {initial}
        </div>
        <div className="hero-rules" aria-hidden="true">
          {[20, 40, 60, 80].map((p) => (
            <span key={p} style={{ top: `${p}%` }} />
          ))}
        </div>
        <div className="hero-body">
          <div className="hero-l">
            <div className="h-badge">
              <div className="h-badge-line" />
              <span className="h-badge-txt">Staff & Admin Portal</span>
            </div>
            <h1 className="h-name">{resto.name}</h1>
            <p className="h-name-sub">{resto.type}</p>
            <div className="h-rule">
              <div className="h-rule-l" />
              <div className="h-rule-dot" />
              <div className="h-rule-d" />
              <div className="h-rule-dot" />
              <div className="h-rule-l" />
            </div>
            <p className="h-desc">
              Restaurant Management System
              <br />
              {loc}
            </p>
            <a href="/admin/login" className="h-btn">
              <span>Access Dashboard</span>
              <div className="h-btn-arrow" />
            </a>
            <p className="h-note">Authorised personnel only</p>
            <div className="h-scroll">
              <div className="hs-line" />
              <span className="hs-txt">Scroll</span>
            </div>
          </div>
          <div className="hero-r">
            <div className="hero-img-top">
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=85" alt="Dining room" loading="eager" />
            </div>
            <div className="hero-img-bot">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80" alt="Kitchen" loading="lazy" />
            </div>
            <div className="hero-yr">
              <div className="hero-yr-n">16</div>
              <div className="hero-yr-t">
                Years of
                <br />
                Excellence
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="l-mq">
        <div className="mq-track">
          {mq3.map((t, i) => (
            <div key={`${t}-${i}`} className="mq-item">
              {t}
              <span className="mq-sep">✦</span>
            </div>
          ))}
        </div>
      </div>

      <section id="about" className="l-about">
        <div className="rv-l">
          <p className="sec-pre">Our Restaurant</p>
          <div className="gold-rule">
            <div className="gr-l" />
            <div className="gr-d" />
            <div className="gr-l" />
          </div>
          <h2 className="sec-h">
            Where Every Plate
            <br />
            Tells a <em>Story</em>
          </h2>
          <p className="sec-p">{resto.description}</p>
          <p className="sec-p" style={{ marginTop: 10 }}>
            Built for speed, precision, and ease — so your team can focus on what matters: delivering an unforgettable experience every service.
          </p>
          <div className="ab-stats">
            {[
              ["50K+", "Guests Served"],
              ["120+", "Heritage Recipes"],
              ["14", "Awards Won"],
              ["4.9★", "Avg Rating"],
            ].map(([n, l]) => (
              <div key={l} className="ab-stat">
                <div className="ab-stat-n">{n}</div>
                <div className="ab-stat-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="about-imgs rv-r">
          <div className="ab-accent" />
          <div className="ab-badge">
            <div className="ab-num">16</div>
            <div className="ab-lbl">
              Years of
              <br />
              Craft
            </div>
          </div>
          <img className="ab-img1" src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80" alt="Interior" loading="lazy" />
          <img className="ab-img2" src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80" alt="Dish" loading="lazy" />
        </div>
      </section>

      <section id="operations" className="l-imgscroll">
        <div className="imgscroll-hdr rv">
          <p className="sec-pre">Behind the Scenes</p>
          <div className="gold-rule">
            <div className="gr-l" />
            <div className="gr-d" />
            <div className="gr-l" />
          </div>
          <h2 className="sec-h">
            Our <em>Operations</em>
          </h2>
        </div>
        <div className="scroll-row">
          <div className="scroll-inner sL">
            {r1d.map((c, i) => (
              <div key={`r1-${i}`} className="ic">
                <img src={c.img} alt={c.name} loading="lazy" />
                <div className="ic-ov" />
                <div className="ic-txt">
                  <div className="ic-tag">{c.tag}</div>
                  <div className="ic-name">{c.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="scroll-row">
          <div className="scroll-inner sR">
            {r2d.map((c, i) => (
              <div key={`r2-${i}`} className="ic">
                <img src={c.img} alt={c.name} loading="lazy" />
                <div className="ic-ov" />
                <div className="ic-txt">
                  <div className="ic-tag">{c.tag}</div>
                  <div className="ic-name">{c.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="l-feat">
        <div className="feat-intro">
          <div className="rv-l">
            <p className="sec-pre">Dashboard Features</p>
            <div className="gold-rule">
              <div className="gr-l" />
              <div className="gr-d" />
              <div className="gr-l" />
            </div>
            <h2 className="sec-h">
              Everything You Need
              <br />
              to <em>Run the Show</em>
            </h2>
            <p className="sec-p">Six powerful tools built into one seamless management platform designed for restaurants that refuse to compromise.</p>
          </div>
          <div className="feat-wm rv-r" aria-hidden="true">
            06
          </div>
        </div>
        <div className="feat-grid">
          {FEATS.map((f, i) => (
            <div key={f.num} className="fc rv" style={{ transitionDelay: `${i * 0.07}s` }}>
              <div className="fc-num">{f.num}</div>
              <span className="fc-ico">{f.ico}</span>
              <div className="fc-title">{f.title}</div>
              <div className="fc-body">{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="l-gallery">
        <div className="rv" style={{ textAlign: "center" }}>
          <p className="sec-pre" style={{ justifyContent: "center" }}>
            Our Space
          </p>
          <div className="gold-rule" style={{ justifyContent: "center" }}>
            <div className="gr-l" />
            <div className="gr-d" />
            <div className="gr-l" />
          </div>
          <h2 className="sec-h" style={{ textAlign: "center" }}>
            Inside <em>{resto.name}</em>
          </h2>
        </div>
        <div className="gl-grid">
          {GALLERY.map((g, i) => (
            <div key={`${g.cls}-${i}`} className={`gi ${g.cls} rv`} style={{ transitionDelay: `${i * 0.09}s` }}>
              <img src={g.src} alt={g.name} loading="lazy" />
              <div className="gi-ov">
                <div className="gi-ovname">{g.name}</div>
                <div className="gi-ovtag">{g.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="l-quote" ref={qSec}>
        <div className="q-bg" ref={qBg} />
        <div className="q-ov" />
        <div className="q-slice" />
        <div className="q-slice-b" />
        <div className="q-content rv">
          <span className="q-mark">&ldquo;</span>
          <p className="q-text">
            A great restaurant runs on two things —
            <br />
            exceptional food and an exceptional team.
          </p>
          <p className="q-attr">— The Founder · {resto.name}</p>
        </div>
      </div>

      <div className="l-stats">
        {STATS.map((s, i) => (
          <div key={s.l} className="sc-card rv" style={{ transitionDelay: `${i * 0.1}s` }}>
            <span className="sc-ico">{s.ico}</span>
            <div className="sc-n">{s.n}</div>
            <div className="sc-l">{s.l}</div>
          </div>
        ))}
      </div>

      <footer className="l-footer">
        <div className="ft-top">
          <div>
            <span className="ft-brand">{resto.name}</span>
            <p className="ft-desc">Internal management portal for {resto.name}. For access issues contact your system administrator.</p>
          </div>
          <div>
            <div className="ft-col-h">Navigate</div>
            <ul className="ft-links">
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#operations">Operations</a>
              </li>
              <li>
                <a href="#gallery">Gallery</a>
              </li>
              <li>
                <a href="/admin/login">Dashboard</a>
              </li>
            </ul>
          </div>
          <div>
            <div className="ft-col-h">Contact</div>
            <div className="ft-contact">
              {resto.phone && <div>{resto.phone}</div>}
              {resto.address && <div>{resto.address}</div>}
              {resto.city && <div>{resto.city}</div>}
            </div>
          </div>
        </div>
        <div className="ft-bottom">
          <span className="ft-copy">
            &copy; {new Date().getFullYear()} {resto.name}. All rights reserved.
          </span>
          <span className="ft-ver">Admin Portal</span>
        </div>
      </footer>
    </div>
  );
}
