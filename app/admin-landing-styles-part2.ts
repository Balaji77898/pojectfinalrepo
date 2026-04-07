/** Admin landing page — styles part 2 (features, gallery, quote, stats, footer, reveal, responsive) */
export const ADMIN_LANDING_CSS_2 = `
@media (hover: hover) and (pointer: fine) {
  body:has(.landing-root) {
    cursor: none;
  }
}

.l-feat {
  padding: clamp(80px, 11vw, 140px) clamp(24px, 6vw, 80px);
  background: var(--parch);
}
.feat-intro {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 80px);
  margin-bottom: clamp(48px, 7vw, 88px);
  align-items: end;
}
.feat-wm {
  font-family: "Playfair Display SC", serif;
  font-size: clamp(100px, 15vw, 200px);
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 1px rgba(92, 16, 32, 0.08);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  text-align: right;
}
.feat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border: 1px solid var(--rule);
}
.fc {
  padding: clamp(28px, 4vw, 44px) clamp(22px, 3vw, 36px);
  border-right: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  position: relative;
  overflow: hidden;
  background: var(--parch);
  transition: background 0.3s ease;
}
.fc:hover {
  background: var(--parch2);
}
.fc:nth-child(3n) {
  border-right: none;
}
.fc:nth-last-child(-n + 3) {
  border-bottom: none;
}
.fc-num {
  font-family: "Playfair Display SC", serif;
  font-size: 42px;
  color: rgba(92, 16, 32, 0.08);
  line-height: 1;
  position: absolute;
  top: 18px;
  right: 20px;
  transition: color 0.3s;
}
.fc:hover .fc-num {
  color: rgba(92, 16, 32, 0.14);
}
.fc-ico {
  font-size: 24px;
  margin-bottom: 14px;
  display: block;
}
.fc-title {
  font-family: "DM Serif Display", serif;
  font-size: 20px;
  color: var(--ink);
  margin-bottom: 8px;
}
.fc-body {
  font-size: 12px;
  line-height: 1.8;
  color: rgba(26, 10, 6, 0.55);
  font-weight: 300;
}
.fc::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--wine), var(--gold));
  transition: width 0.38s ease;
}
.fc:hover::after {
  width: 100%;
}

.l-gallery {
  padding: clamp(80px, 11vw, 140px) clamp(24px, 6vw, 80px);
  background: var(--parch2);
  border-top: 1px solid var(--rule);
}
.gl-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 260px 200px;
  gap: 10px;
  margin-top: clamp(36px, 5vw, 56px);
}
.gi {
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(184, 136, 42, 0.12);
}
.gi-A {
  grid-column: 1/5;
  grid-row: 1/3;
}
.gi-B {
  grid-column: 5/8;
  grid-row: 1;
}
.gi-C {
  grid-column: 8/10;
  grid-row: 1;
}
.gi-D {
  grid-column: 10/13;
  grid-row: 1;
}
.gi-E {
  grid-column: 5/9;
  grid-row: 2;
}
.gi-F {
  grid-column: 9/13;
  grid-row: 2;
}
.gi img {
  width: 100%;
  height: 100%;
  transition: transform 0.65s ease;
}
.gi:hover img {
  transform: scale(1.07);
}
.gi-ov {
  position: absolute;
  inset: 0;
  background: rgba(92, 16, 32, 0.48);
  opacity: 0;
  transition: opacity 0.35s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.gi:hover .gi-ov {
  opacity: 1;
}
.gi-ovname {
  font-family: "DM Serif Display", serif;
  font-size: 18px;
  color: #fff;
  text-align: center;
}
.gi-ovtag {
  font-size: 8px;
  letter-spacing: 0.3em;
  color: var(--gold3);
  text-transform: uppercase;
}

.l-quote {
  position: relative;
  height: 52vh;
  min-height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.q-bg {
  position: absolute;
  inset: -20%;
  background-image: url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=80");
  background-size: cover;
  background-position: center;
  filter: brightness(0.22) saturate(0.6);
}
.q-ov {
  position: absolute;
  inset: 0;
  background: rgba(92, 16, 32, 0.45);
}
.q-slice {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: var(--parch2);
  clip-path: polygon(0 0, 100% 0, 100% 0%, 0 100%);
  z-index: 2;
}
.q-slice-b {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: var(--parch);
  clip-path: polygon(0 100%, 100% 0, 100% 100%);
  z-index: 2;
}
.q-content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 0 clamp(24px, 9vw, 160px);
}
.q-mark {
  font-family: "IM Fell English", serif;
  font-size: 90px;
  color: var(--gold);
  line-height: 0.5;
  margin-bottom: 12px;
  opacity: 0.7;
  display: block;
}
.q-text {
  font-family: "DM Serif Display", serif;
  font-style: italic;
  font-size: clamp(20px, 3.2vw, 44px);
  color: #fff;
  line-height: 1.35;
}
.q-attr {
  margin-top: 22px;
  font-size: 9px;
  letter-spacing: 0.45em;
  color: var(--gold3);
  text-transform: uppercase;
}

.l-stats {
  background: var(--wine);
  padding: clamp(48px, 7vw, 90px) clamp(24px, 7vw, 100px);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  position: relative;
  overflow: hidden;
}
.l-stats::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 44px,
    rgba(255, 255, 255, 0.012) 44px,
    rgba(255, 255, 255, 0.012) 45px
  );
}
.sc-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 16px;
  border-right: 1px solid rgba(250, 244, 232, 0.07);
  position: relative;
  z-index: 1;
  transition: background 0.3s;
}
.sc-card:last-child {
  border-right: none;
}
.sc-card:hover {
  background: rgba(250, 244, 232, 0.04);
}
.sc-ico {
  font-size: 22px;
  margin-bottom: 10px;
}
.sc-n {
  font-family: "DM Serif Display", serif;
  font-size: clamp(38px, 5vw, 58px);
  color: var(--gold2);
  line-height: 1;
}
.sc-l {
  font-size: 9px;
  letter-spacing: 0.28em;
  color: rgba(250, 244, 232, 0.38);
  text-transform: uppercase;
  margin-top: 5px;
}

.l-footer {
  background: var(--ink);
  padding: clamp(52px, 7vw, 88px) clamp(24px, 7vw, 100px) clamp(28px, 4vw, 44px);
}
.ft-top {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: clamp(32px, 5vw, 64px);
  padding-bottom: clamp(36px, 5vw, 56px);
  border-bottom: 1px solid rgba(250, 244, 232, 0.07);
  margin-bottom: clamp(24px, 3vw, 36px);
}
.ft-brand {
  font-family: "Playfair Display SC", serif;
  font-size: clamp(18px, 3vw, 26px);
  font-weight: 700;
  letter-spacing: 0.25em;
  color: var(--gold);
  display: block;
  margin-bottom: 10px;
}
.ft-desc {
  font-size: 12px;
  color: rgba(250, 244, 232, 0.32);
  font-weight: 300;
  line-height: 1.8;
  max-width: 260px;
}
.ft-col-h {
  font-size: 9px;
  letter-spacing: 0.4em;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 18px;
  font-weight: 600;
}
.ft-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ft-links a {
  font-size: 12px;
  color: rgba(250, 244, 232, 0.38);
  transition: color 0.25s;
  font-weight: 300;
}
.ft-links a:hover {
  color: var(--gold);
}
.ft-contact {
  font-size: 12px;
  color: rgba(192, 144, 32, 0.6);
  line-height: 2.2;
  font-weight: 300;
}
.ft-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.ft-copy {
  font-size: 10px;
  color: rgba(250, 244, 232, 0.18);
  letter-spacing: 0.12em;
}
.ft-ver {
  font-size: 9px;
  color: rgba(192, 144, 32, 0.25);
  letter-spacing: 0.25em;
  font-family: "Playfair Display SC", serif;
}

.rv {
  opacity: 0;
  transform: translateY(36px);
  transition:
    opacity 0.75s ease,
    transform 0.75s ease;
}
.rv.v {
  opacity: 1;
  transform: translateY(0);
}
.rv-l {
  opacity: 0;
  transform: translateX(-48px);
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}
.rv-l.v {
  opacity: 1;
  transform: translateX(0);
}
.rv-r {
  opacity: 0;
  transform: translateX(48px);
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}
.rv-r.v {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 900px) {
  .l-nav {
    padding: 16px 22px;
  }
  .ham {
    display: flex;
  }
  .nav-cta {
    display: none;
  }
  .hero-body {
    grid-template-columns: 1fr;
  }
  .hero-l {
    padding: clamp(90px, 16vw, 120px) 24px clamp(32px, 6vh, 52px);
    border-right: none;
    border-bottom: 1px solid var(--rule);
  }
  .hero-wm {
    font-size: clamp(160px, 50vw, 260px);
    right: -8vw;
    top: -8vh;
  }
  .hero-r {
    height: 60vw;
    min-height: 240px;
    display: block;
    position: relative;
  }
  .hero-img-top {
    height: 100%;
    position: absolute;
  }
  .hero-img-bot {
    display: none;
  }
  .hero-yr {
    top: auto;
    bottom: 16px;
    left: 16px;
  }
  .l-about {
    grid-template-columns: 1fr;
    gap: 52px;
    padding: 70px 22px;
  }
  .ab-img2 {
    display: none;
  }
  .ab-img1 {
    height: 280px;
  }
  .ab-accent {
    display: none;
  }
  .ab-badge {
    top: -10px;
    right: -8px;
    padding: 12px;
  }
  .ab-num {
    font-size: 28px;
  }
  .feat-intro {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .feat-wm {
    display: none;
  }
  .feat-grid {
    grid-template-columns: 1fr 1fr;
  }
  .fc:nth-child(3n) {
    border-right: 1px solid var(--rule);
  }
  .fc:nth-child(2n) {
    border-right: none;
  }
  .fc:nth-last-child(-n + 3) {
    border-bottom: 1px solid var(--rule);
  }
  .fc:nth-last-child(-n + 2) {
    border-bottom: none;
  }
  .fc:last-child {
    border-bottom: none;
  }
  .gl-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }
  .gi-A,
  .gi-B,
  .gi-C,
  .gi-D,
  .gi-E,
  .gi-F {
    grid-column: auto;
    grid-row: auto;
  }
  .gi-A {
    grid-column: 1/-1;
    height: 200px;
  }
  .gi img {
    min-height: 150px;
    height: 100%;
  }
  .l-stats {
    padding: 40px 16px;
  }
  .sc-card {
    border-right: none;
    border-bottom: 1px solid rgba(250, 244, 232, 0.07);
    padding: 24px 12px;
  }
  .sc-card:last-child {
    border-bottom: none;
  }
  .ft-top {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .ft-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
  .ic {
    width: 72vw;
    height: 52vw;
  }
  .q-slice,
  .q-slice-b {
    height: 50px;
  }
}

@media (max-width: 600px) {
  .feat-grid {
    grid-template-columns: 1fr;
  }
  .fc:nth-child(n) {
    border-right: none;
    border-bottom: 1px solid var(--rule);
  }
  .fc:last-child {
    border-bottom: none;
  }
  .l-about,
  .l-feat,
  .l-gallery {
    padding: 60px 18px;
  }
  .l-imgscroll {
    padding: 60px 0;
  }
  .ab-stats {
    grid-template-columns: 1fr 1fr;
  }
}
`;
