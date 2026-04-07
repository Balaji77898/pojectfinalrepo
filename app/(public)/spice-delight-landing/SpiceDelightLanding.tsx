"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import {
  IFlame,
  ILeaf,
  IStar,
  IPin,
  IPhone,
  IMail,
  IBag,
  IArrow,
  IPlus,
  IClock,
  IChef,
  ICheck,
  IMenu,
  IGlobe,
  ISparkle,
} from "./icons";
import { BG_SLIDES, MENU_ITEMS, REVIEWS, STRIP_IMGS } from "./data";
import { SPICE_DELIGHT_LANDING_CSS } from "./landing-css";

function useReveal(t = 0.08) {
  const ref = useRef<HTMLElement | null>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || vis) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: t },
    );
    obs.observe(el);
    return () => obs.disconnect();
  });
  return [ref, vis] as const;
}

function Reveal({
  children,
  vis,
  delay = 0,
  style = {},
}: {
  children: ReactNode;
  vis: boolean;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(26px)",
        transition: `opacity .7s ease ${delay}s,transform .7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Loader() {
  const [prog, setProg] = useState(0);
  const [step, setStep] = useState(0);
  const steps = ["Heating the Tandoor…", "Infusing royal spices…", "Almost ready…"];
  useEffect(() => {
    const pi = setInterval(() => setProg((p) => Math.min(p + 2, 100)), 38);
    const si = setInterval(() => setStep((s) => (s + 1) % 3), 1300);
    return () => {
      clearInterval(pi);
      clearInterval(si);
    };
  }, []);
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#FFFBF0,#FFF0D0,#FFE4A0)",
        fontFamily: "Nunito,sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Nunito:wght@400;700;800&family=Dancing+Script:wght@700&display=swap');
@keyframes lsp{to{transform:rotate(360deg)}}@keyframes lfl{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.22)}}@keyframes ldb{0%,100%{background:rgba(200,0,26,.18);transform:scaleY(1)}50%{background:#C8001A;transform:scaleY(2.2)}}`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 20px" }}>
          <svg
            viewBox="0 0 100 100"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animation: "lsp 2.5s linear infinite" }}
          >
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(200,0,26,.1)" strokeWidth="4" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#C8001A"
              strokeWidth="4"
              strokeDasharray={`${prog * 2.76} 276`}
              strokeLinecap="round"
              style={{ transformOrigin: "50px 50px", transform: "rotate(-90deg)" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IFlame s={38} style={{ color: "#C8001A", animation: "lfl 1.4s ease-in-out infinite" }} />
          </div>
        </div>
        <div style={{ fontFamily: "'Abril Fatface',serif", fontSize: 26, color: "#C8001A", marginBottom: 4 }}>Spice Delight</div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(200,0,26,.45)",
            marginBottom: 18,
            fontWeight: 700,
          }}
        >
          {steps[step]}
        </div>
        <div style={{ display: "flex", gap: 7, justifyContent: "center" }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ width: 5, height: 14, borderRadius: 3, animation: `ldb 1.2s ease-in-out ${i * 0.14}s infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SpiceDelightLanding() {
  const router = useRouter();

  const navigate = useCallback(
    (path = "/customer/details") => {
      const p = new URLSearchParams(window.location.search);
      const token = p.get("token");
      const table = p.get("table") || p.get("tableNo") || p.get("tableNumber");
      let dest = path;
      const ex: string[] = [];
      if (token) ex.push(`token=${encodeURIComponent(token)}`);
      if (table) ex.push(`table=${encodeURIComponent(table)}`);
      if (ex.length) dest += `?${ex.join("&")}`;
      router.push(dest);
    },
    [router],
  );

  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(BG_SLIDES.length - 1);
  const [titlePhase, setTitlePhase] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [curPos, setCurPos] = useState({ x: -300, y: -300 });
  const [curBig, setCurBig] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [tableInfo, setTableInfo] = useState<{ token: string | null; table: string | null } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pxWrapRef = useRef<HTMLDivElement | null>(null);
  const pxImgRef = useRef<HTMLImageElement | null>(null);

  const [aboutRef, aboutVis] = useReveal(0.06);
  const [menuRef, menuVis] = useReveal(0.05);
  const [revRef, revVis] = useReveal(0.05);
  const [ctaRef, ctaVis] = useReveal(0.04);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const token = p.get("token");
    const table = p.get("table") || p.get("tableNo");
    if (token || table) setTableInfo({ token, table });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setRevealed(true), 60);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading) return;
    const t1 = setTimeout(() => setTitlePhase(1), 200);
    const t2 = setTimeout(() => setTitlePhase(2), 500);
    const t3 = setTimeout(() => setTitlePhase(3), 800);
    const onS = () => setScrollY(window.scrollY);
    const onM = (e: MouseEvent) => setCurPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onS, { passive: true });
    window.addEventListener("mousemove", onM);
    const iv1 = setInterval(() => {
      setSlideIdx((p) => {
        setPrevIdx(p);
        return (p + 1) % BG_SLIDES.length;
      });
    }, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(iv1);
      window.removeEventListener("scroll", onS);
      window.removeEventListener("mousemove", onM);
    };
  }, [loading]);

  useEffect(() => {
    const fn = () => {
      const img = pxImgRef.current;
      const wrap = pxWrapRef.current;
      if (!img || !wrap) return;
      const r = wrap.getBoundingClientRect();
      const pr = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      img.style.transform = `translateY(calc(-15% + ${(pr - 0.5) * 100}px))`;
    };
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let W = 0;
    let H = 0;
    let raf = 0;
    const rs = () => {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
    };
    rs();
    window.addEventListener("resize", rs, { passive: true });
    const COLS = ["rgba(255,107,0,A)", "rgba(200,0,26,A)", "rgba(255,183,0,A)", "rgba(255,60,0,A)"];
    const pts = Array.from({ length: 45 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.8 + Math.random() * 2.2,
      vy: 0.00007 + Math.random() * 0.00016,
      vx: (Math.random() - 0.5) * 0.00008,
      a: 0.04 + Math.random() * 0.12,
      c: COLS[Math.floor(Math.random() * 4)],
      w: Math.random() * Math.PI * 2,
      ws: 0.005 + Math.random() * 0.016,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.w += p.ws;
        p.y = (p.y + p.vy) % 1;
        p.x = (((p.x + p.vx + Math.sin(p.w) * 0.00012) % 1) + 1) % 1;
        const px = p.x * W;
        const py = p.y * H;
        const g = ctx.createRadialGradient(px, py, 0, px, py, p.r * 6);
        g.addColorStop(0, p.c.replace("A", (p.a * 0.9).toFixed(2)));
        g.addColorStop(0.5, p.c.replace("A", (p.a * 0.28).toFixed(2)));
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(px, py, p.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", rs);
    };
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const ih = () => setCurBig(true);
  const il = () => setCurBig(false);

  if (loading) return <Loader />;

  return (
    <>
      <style>{SPICE_DELIGHT_LANDING_CSS}</style>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.4 }} />
      <div className={`cdot${curBig ? " cb" : ""}`} style={{ left: curPos.x, top: curPos.y }} />
      <div className={`cring${curBig ? " cb" : ""}`} style={{ left: curPos.x, top: curPos.y }} />

      {tableInfo && (
        <div className="tbanner">
          {tableInfo.table && (
            <span>
              <IPin s={13} /> Table {tableInfo.table}
            </span>
          )}
          {tableInfo.token && (
            <span className="tbadge">
              <ICheck s={12} /> Scan &amp; Order Active
            </span>
          )}
        </div>
      )}

      <nav className={scrollY > 60 ? "sc" : ""} style={{ top: tableInfo ? "36px" : "0" }}>
        <div className="nbrand">
          <div className="nicon">
            <IFlame s={26} />
          </div>
          <div>
            <strong className="nname">Spice Delight</strong>
            <span className="ntag">North Indian Café · Bangalore</span>
          </div>
        </div>
        <ul className="nlinks">
          {["about", "menu", "reviews", "contact"].map((s) => (
            <li key={s}>
              <a role="button" tabIndex={0} onClick={() => scrollTo(s)} onKeyDown={(e) => e.key === "Enter" && scrollTo(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        <button type="button" className="ncta" onClick={() => navigate()} onMouseEnter={ih} onMouseLeave={il}>
          <span className="nshine" />
          <IBag s={15} /> Order Now
        </button>
        <button type="button" className="mhbg" onClick={() => setMobOpen((p) => !p)}>
          <IMenu s={22} />
        </button>
      </nav>

      <div className={`mmenu${mobOpen ? " on" : ""}`} style={{ top: tableInfo ? "104px" : "68px" }}>
        {["about", "menu", "reviews", "contact"].map((s) => (
          <a
            key={s}
            role="button"
            tabIndex={0}
            onClick={() => {
              scrollTo(s);
              setMobOpen(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && scrollTo(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        ))}
        <button type="button" className="mmcta" onClick={() => navigate()}>
          <IBag s={15} /> Start Order
        </button>
      </div>

      <div className={`pwrap${revealed ? " in" : ""}`}>
        <section id="hero" className="hero">
          <div className="hphoto">
            {BG_SLIDES.map((src, i) => (
              <div key={src} className={`hslide${i === slideIdx ? " on" : i === prevIdx ? " out" : ""}`}>
                <img src={src} alt={`Slide ${i + 1}`} />
              </div>
            ))}
            <div className="hcounter">
              <span className="hc-cur">{String(slideIdx + 1).padStart(2, "0")}</span>
              <span className="hc-sep" />
              <span className="hc-tot">{String(BG_SLIDES.length).padStart(2, "0")}</span>
            </div>
            <div className="hsdots">
              {BG_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`hsdot${i === slideIdx ? " on" : ""}`}
                  onClick={() => {
                    setPrevIdx(slideIdx);
                    setSlideIdx(i);
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <div className="hscroll-cue">
              <div className="hsc-line" />
              <span>Scroll</span>
            </div>
          </div>

          <div className="hcont">
            <div className={`hbadge${titlePhase >= 1 ? " show" : ""}`}>
              <div className="hpulse" />
              <span>Open Now · MG Road, Bangalore</span>
            </div>
            <h1 className="htitle">
              <span className={`hl${titlePhase >= 1 ? " show" : ""}`}>Where Every</span>
              <span className={`hl accent${titlePhase >= 2 ? " show" : ""}`} style={{ transitionDelay: ".1s" }}>
                Spice Tells
              </span>
              <span className={`hl${titlePhase >= 3 ? " show" : ""}`} style={{ transitionDelay: ".2s" }}>
                a Story.
              </span>
            </h1>
            <p className={`hsub${titlePhase >= 3 ? " show" : ""}`} style={{ transitionDelay: ".55s" }}>
              Authentic North Indian flavours crafted with love in the heart of Bangalore. From slow-cooked dals to smoky tandoor dishes — every bite is a journey north.
            </p>
            <div className={`hbtns${titlePhase >= 3 ? " show" : ""}`} style={{ transitionDelay: ".72s" }}>
              <button type="button" className="bprim" onClick={() => navigate()} onMouseEnter={ih} onMouseLeave={il}>
                <span className="bshine" />
                <IBag s={16} /> Start Your Order
              </button>
              <button type="button" className="bout2" onClick={() => scrollTo("contact")}>
                <IPin s={15} /> Find Us
              </button>
            </div>
            <div className={`htags${titlePhase >= 3 ? " show" : ""}`} style={{ transitionDelay: ".9s" }}>
              <span>
                <ILeaf s={12} style={{ color: "var(--saffron)" }} /> Pure Veg Available
              </span>
              <span>
                <IFlame s={12} style={{ color: "var(--saffron)" }} /> Live Tandoor
              </span>
              <span>
                <IGlobe s={12} style={{ color: "var(--saffron)" }} /> Dine-In &amp; Takeaway
              </span>
            </div>
            <div className={`hstats${titlePhase >= 3 ? " show" : ""}`} style={{ transitionDelay: "1.1s" }}>
              {[
                ["200+", "Daily Diners"],
                ["4.8", "Google Rating"],
                ["60+", "Menu Items"],
              ].map(([n, l]) => (
                <div key={l} className="hstat">
                  <span className="hstat-n">{n}</span>
                  <span className="hstat-l">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="statsbar">
          {[
            ["200+", "Daily Diners"],
            ["4.8★", "Google Rating"],
            ["60+", "Menu Items"],
            ["15+", "Years of Craft"],
          ].map(([n, l]) => (
            <div key={l} className="sitem">
              <span className="snum">{n}</span>
              <span className="slbl2">{l}</span>
            </div>
          ))}
        </div>

        <div className="mqred">
          <div className="mqt">
            {[...Array(2)].flatMap((_, li) =>
              ["Butter Chicken", "Garlic Naan", "Dal Makhani", "Seekh Kebab", "Dum Biryani", "Paneer Tikka", "Masala Chai", "Gulab Jamun"].map((t, i) => (
                <span key={`${li}-${i}`} className="mqi">
                  <ISparkle s={11} />
                  {t}
                </span>
              )),
            )}
          </div>
        </div>

        <section id="about" className="about-sec" ref={aboutRef}>
          <div className={`agrid${aboutVis ? " vis" : ""}`}>
            <div className="aimg-wrap">
              <div className="aimg">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=85&auto=format&fit=crop" alt="Interior" />
                <div className="aglow" />
              </div>
              <div className="abadge">Est. 2009 · Bangalore</div>
            </div>
            <div className="atext">
              <div className="slbl">Our Story</div>
              <h2>
                Crafted with <em>Tradition,</em>
                <br />
                Served with Love.
              </h2>
              <p className="bp">
                Born on the vibrant MG Road, Spice Delight began as a humble café with one mission — to bring the bold, comforting flavours of North India to every table in Bangalore.
              </p>
              <p className="bp">Each recipe is a family heirloom — slow-cooked gravies, hand-rolled breads fresh from the tandoor, and spice blends ground daily in our kitchen.</p>
              <div className="afacts">
                {[
                  [<IFlame key="f" s={20} />, "Fresh Daily", "Spices ground every morning. No shortcuts."],
                  [<ILeaf key="l" s={20} />, "Veg Friendly", "20+ pure veg options always available."],
                  [<IFlame key="ff" s={20} />, "Live Tandoor", "Clay oven fires all day for smoky char."],
                  [<IPin key="p" s={20} />, "MG Road", "Heart of Bangalore's dining district."],
                ].map(([ic, t, d]) => (
                  <div key={String(t)} className="af" onMouseEnter={ih} onMouseLeave={il}>
                    <div className="aficon">{ic}</div>
                    <div>
                      <div className="aft">{t}</div>
                      <div className="afd">{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="strip">
          <div className="sttrack">
            {[...STRIP_IMGS, ...STRIP_IMGS].map((it, i) => (
              <div key={`${it.label}-${i}`} className="sti">
                <img src={it.src} alt={it.label} />
                <div className="stov" />
                <span className="stlbl">{it.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mqcream">
          <div className="mqt rev">
            {[...Array(2)].flatMap((_, li) =>
              ["Live Tandoor", "Fresh Spices Daily", "MG Road Bangalore", "4.8 Google Rating", "Dine-In & Takeaway", "Open Till 11 PM", "Master Chef Kitchen"].map((t, i) => (
                <span key={`${li}-${i}`} className="mqci">
                  <ICheck s={12} style={{ color: "var(--crimson)" }} />
                  {t}
                </span>
              )),
            )}
          </div>
        </div>

        <section id="menu" className="menu-sec" ref={menuRef}>
          <Reveal vis={menuVis} delay={0}>
            <div className="slbl">Our Menu</div>
          </Reveal>
          <Reveal vis={menuVis} delay={0.1}>
            <h2>
              A Feast for <em>Every Craving.</em>
            </h2>
          </Reveal>
          <Reveal vis={menuVis} delay={0.2}>
            <p className="bp">Sixty dishes — starters, mains, breads, rice, desserts — all cooked to order.</p>
          </Reveal>
          <div className={`mgrid${menuVis ? " vis" : ""}`}>
            {MENU_ITEMS.map((item, i) => (
              <div key={item.id} className="mc" style={{ transitionDelay: `${i * 0.07}s` }} onMouseEnter={ih} onMouseLeave={il}>
                <div className="mcimg">
                  <img src={item.img} alt={item.name} />
                  <div className="mcbadge">{item.badge}</div>
                  {item.veg && <div className="vegdot" />}
                  <div className="mcov" />
                </div>
                <div className="mcbody">
                  <div className="mcname">{item.name}</div>
                  <div className="mcdesc">{item.desc}</div>
                  <div className="mcfoot">
                    <div>
                      <div className="mcprice">₹{item.price}</div>
                      <div className="mcrating">
                        <IStar s={11} style={{ color: "var(--saffron)" }} /> {item.rating}
                      </div>
                    </div>
                    <button type="button" className="mcadd" onClick={() => navigate()} aria-label="Add to order">
                      <IPlus s={17} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Reveal vis={menuVis} delay={0.55} style={{ textAlign: "center", marginTop: 36 }}>
            <button type="button" className="bprim" onClick={() => navigate()} onMouseEnter={ih} onMouseLeave={il}>
              <span className="bshine" />
              <IBag s={15} /> View Full Menu &amp; Order
            </button>
          </Reveal>
        </section>

        <div className="pxwrap" ref={pxWrapRef}>
          <img ref={pxImgRef} src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80&auto=format&fit=crop" alt="" />
          <div className="pxov" />
          <div className="pxcont">
            <ISparkle s={20} style={{ color: "var(--gold)", marginBottom: 10, filter: "drop-shadow(0 0 12px rgba(255,183,0,.7))" }} />
            <blockquote>&quot;Food is not just eating energy. It&apos;s an experience.&quot;</blockquote>
            <cite>— The Spice Delight Philosophy · MG Road, Bangalore</cite>
          </div>
        </div>

        <section id="reviews" className="rev-sec" ref={revRef}>
          <Reveal vis={revVis} delay={0}>
            <div className="slbl">Reviews</div>
          </Reveal>
          <Reveal vis={revVis} delay={0.1}>
            <h2>
              Our Guests <em>Say It Best.</em>
            </h2>
          </Reveal>
          <div className={`rgrid${revVis ? " vis" : ""}`}>
            {REVIEWS.map((r, i) => (
              <div key={r.name} className="rcard" style={{ transitionDelay: `${i * 0.1}s` }} onMouseEnter={ih} onMouseLeave={il}>
                <div className="rstars">
                  {[0, 1, 2, 3, 4].slice(0, r.stars).map((j) => (
                    <IStar key={j} s={13} style={{ color: "var(--saffron)" }} />
                  ))}
                </div>
                <p className="rquote">&quot;{r.q}&quot;</p>
                <div className="rauthor">
                  <div className="rav">{r.name[0]}</div>
                  <div>
                    <div className="rname">{r.name}</div>
                    <div className="rloc">{r.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-sec">
          <div className="slbl">Find Us</div>
          <h2>
            Visit <em>Spice Delight</em> on MG Road.
          </h2>
          <div className="cgrid">
            <div>
              <div className="ccard">
                <div className="ccardtitle">Opening Hours</div>
                {[
                  ["Monday – Friday", "11:00 AM – 11:00 PM"],
                  ["Saturday", "10:00 AM – 11:30 PM"],
                  ["Sunday", "10:00 AM – 10:30 PM"],
                ].map(([d, t]) => (
                  <div key={d} className="hrow">
                    <span className="hday">{d}</span>
                    <span className="htime">{t}</span>
                    <span className="hstatus">Open</span>
                  </div>
                ))}
              </div>
              <div className="mapf">
                <img src="https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?w=800&q=70&auto=format&fit=crop" alt="map" />
                <div className="mapo">
                  <IPin s={28} style={{ color: "var(--crimson)" }} />
                  <strong>MG Road, Bangalore</strong>
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer">
                    Open in Maps <IArrow s={11} />
                  </a>
                </div>
              </div>
            </div>
            <div className="ccard">
              <div className="ccardtitle">Contact &amp; Info</div>
              {[
                [<IPin key="p" s={18} />, "Address", "MG Road, Bangalore, KA 560001"],
                [<IPhone key="ph" s={18} />, "Phone", <a key="ph-a" href="tel:8888888888">+91 88888 88888</a>],
                [<IMail key="m" s={18} />, "Email", <a key="m-a" href="mailto:contact@spicedelight.com">contact@spicedelight.com</a>],
                [<IChef key="c" s={18} />, "Type", "North Indian · Café · Dine-In & Takeaway"],
                [<IClock key="cl" s={18} />, "Hours", "Open 7 days · 10 AM – 11 PM"],
              ].map(([ic, l, v]) => (
                <div key={String(l)} className="crow">
                  <div className="cicon">{ic}</div>
                  <div>
                    <div className="clbl">{l}</div>
                    <div className="cval">{v}</div>
                  </div>
                </div>
              ))}
              <button type="button" className="bprim" style={{ width: "100%", justifyContent: "center", marginTop: 20 }} onClick={() => navigate()} onMouseEnter={ih} onMouseLeave={il}>
                <span className="bshine" />
                <IBag s={15} /> Start Your Order
              </button>
            </div>
          </div>
        </section>

        <section className="cta-sec" ref={ctaRef}>
          <div className={`ctain${ctaVis ? " vis" : ""}`}>
            <div className="ctaico">
              <IFlame s={52} style={{ color: "var(--crimson)" }} />
            </div>
            <h2>
              Hungry? <em>Come In.</em>
              <br />
              We&apos;re Ready for You.
            </h2>
            <p className="bp" style={{ maxWidth: 460, margin: "14px auto 0", textAlign: "center" }}>
              Walk in anytime or call ahead. Hot food, warm service, MG Road vibes — every day.
            </p>
            <div className="ctabtns">
              <button type="button" className="bprim" onClick={() => navigate()} onMouseEnter={ih} onMouseLeave={il}>
                <span className="bshine" />
                <IBag s={15} /> Start Your Order
              </button>
              <a href="mailto:contact@spicedelight.com" className="bout2">
                <IMail s={15} /> Send a Message
              </a>
            </div>
          </div>
        </section>

        <footer>
          <div className="fgrid">
            <div>
              <div className="fbrand">
                <IFlame s={22} style={{ color: "var(--yellow)" }} /> Spice Delight
              </div>
              <p className="fdesc">North Indian cuisine crafted with tradition, served with love. MG Road&apos;s favourite café since 2009.</p>
            </div>
            <div>
              <div className="fh">Quick Links</div>
              <ul className="flinks">
                {[
                  ["menu", "Our Menu"],
                  ["about", "About Us"],
                  ["reviews", "Reviews"],
                  ["contact", "Find Us"],
                ].map(([id, label]) => (
                  <li key={id}>
                    <a role="button" tabIndex={0} onClick={() => scrollTo(id)}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="fh">Contact</div>
              <ul className="flinks">
                <li>
                  <a href="tel:8888888888">+91 88888 88888</a>
                </li>
                <li>
                  <a href="mailto:contact@spicedelight.com">contact@spicedelight.com</a>
                </li>
                <li>
                  <span>MG Road, Bangalore</span>
                </li>
                <li>
                  <span>Open 10AM – 11PM</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="fbot">
            <span>© 2026 Spice Delight. All rights reserved.</span>
            <span style={{ color: "var(--yellow)" }}>Made with love in Bangalore</span>
          </div>
        </footer>
      </div>
    </>
  );
}
