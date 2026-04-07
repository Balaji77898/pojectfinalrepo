/** Admin landing page — styles part 1 (splash, nav, hero, marquee, about, img scroll) */
export const ADMIN_LANDING_CSS_1 = `
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display+SC:ital,wght@0,400;0,700;0,900;1,400&family=DM+Serif+Display:ital@0;1&family=Jost:wght@200;300;400;500;600&family=IM+Fell+English:ital@0;1&display=swap");

:root {
  --ink: #1a0a06;
  --wine: #5c1020;
  --wine2: #7b1d2a;
  --wine3: #9b3040;
  --wine-f: rgba(92, 16, 32, 0.06);
  --gold: #c09020;
  --gold2: #e0b840;
  --gold3: #f5d87a;
  --parch: #faf4e8;
  --parch2: #f3ead6;
  --parch3: #e8dcc4;
  --linen: #f8f1e4;
  --rule: rgba(92, 16, 32, 0.18);
}

@keyframes nameReveal {
  0% {
    opacity: 0;
    transform: perspective(600px) translateY(-80px) rotateX(90deg) scale(0.75);
  }
  55% {
    opacity: 1;
    transform: perspective(600px) translateY(8px) rotateX(-8deg) scale(1.03);
  }
  100% {
    opacity: 1;
    transform: perspective(600px) translateY(0) rotateX(0deg) scale(1);
  }
}
@keyframes ringExpand {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes spinRing {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes fadeCorner {
  to {
    opacity: 1;
  }
}
@keyframes splashFadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes barFill {
  to {
    width: 100%;
  }
}
@keyframes curtainUp {
  to {
    transform: translateY(-100%);
  }
}
@keyframes curtainDn {
  to {
    transform: translateY(100%);
  }
}
@keyframes btnGlow {
  0%,
  100% {
    box-shadow: 0 4px 20px rgba(92, 16, 32, 0.2);
  }
  50% {
    box-shadow: 0 8px 36px rgba(92, 16, 32, 0.45);
  }
}
@keyframes subtleZoom {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.06);
  }
}
@keyframes linePulse {
  0%,
  100% {
    width: 40px;
    opacity: 0.4;
  }
  50% {
    width: 60px;
    opacity: 0.8;
  }
}
@keyframes mqs {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
@keyframes sL {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
@keyframes sR {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html {
  overflow-x: hidden;
  scroll-behavior: smooth;
}
img {
  display: block;
  max-width: 100%;
  object-fit: cover;
}
a {
  text-decoration: none;
  color: inherit;
}
::-webkit-scrollbar {
  width: 3px;
}
::-webkit-scrollbar-track {
  background: var(--parch2);
}
::-webkit-scrollbar-thumb {
  background: var(--wine);
}

.landing-root {
  background: var(--parch);
  color: var(--ink);
  font-family: "Jost", sans-serif;
  overflow-x: hidden;
  min-height: 100vh;
}

.splash {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #5c1020;
}
.splash::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 44px,
    rgba(255, 255, 255, 0.014) 44px,
    rgba(255, 255, 255, 0.014) 45px
  );
}
.splash-t {
  position: fixed;
  inset: 0 0 50% 0;
  z-index: 99999;
  background: #5c1020;
  transform: translateY(0);
  pointer-events: none;
}
.splash-b {
  position: fixed;
  inset: 50% 0 0 0;
  z-index: 99999;
  background: #5c1020;
  transform: translateY(0);
  pointer-events: none;
}
.splash-t.go {
  animation: curtainUp 0.72s cubic-bezier(0.76, 0, 0.24, 1) forwards;
}
.splash-b.go {
  animation: curtainDn 0.72s cubic-bezier(0.76, 0, 0.24, 1) forwards;
}
.splash-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(192, 144, 32, 0.22);
  animation: ringExpand 0.55s ease-out both;
}
.splash-spin {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid transparent;
  border-top-color: #c09020;
  border-right-color: rgba(192, 144, 32, 0.28);
  animation:
    ringExpand 0.5s ease-out 0.15s both,
    spinRing 3s linear 0.65s infinite;
}
.splash-corner {
  position: absolute;
  width: 18px;
  height: 18px;
  border-color: rgba(192, 144, 32, 0.5);
  border-style: solid;
  opacity: 0;
  animation: fadeCorner 0.4s ease 0.5s forwards;
}
.sp-tl {
  top: clamp(20px, 5vw, 60px);
  left: clamp(20px, 5vw, 60px);
  border-width: 1.5px 0 0 1.5px;
}
.sp-tr {
  top: clamp(20px, 5vw, 60px);
  right: clamp(20px, 5vw, 60px);
  border-width: 1.5px 1.5px 0 0;
}
.sp-bl {
  bottom: clamp(20px, 5vw, 60px);
  left: clamp(20px, 5vw, 60px);
  border-width: 0 0 1.5px 1.5px;
}
.sp-br {
  bottom: clamp(20px, 5vw, 60px);
  right: clamp(20px, 5vw, 60px);
  border-width: 0 1.5px 1.5px 0;
}
.splash-name {
  font-family: "Playfair Display SC", serif;
  font-size: clamp(54px, 15vw, 160px);
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.14em;
  line-height: 0.88;
  text-transform: uppercase;
  opacity: 0;
  animation: nameReveal 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards;
  text-align: center;
}
.splash-rule {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
  opacity: 0;
  animation: splashFadeUp 0.6s ease 0.95s forwards;
}
.sr-l {
  width: clamp(28px, 5vw, 64px);
  height: 1px;
  background: #c09020;
  opacity: 0.6;
}
.sr-d {
  width: 6px;
  height: 6px;
  background: #c09020;
  transform: rotate(45deg);
}
.sr-dot {
  width: 3px;
  height: 3px;
  background: #c09020;
  border-radius: 50%;
  opacity: 0.5;
}
.splash-sub {
  font-family: "DM Serif Display", serif;
  font-size: clamp(22px, 5.5vw, 66px);
  font-style: italic;
  color: #e0b840;
  letter-spacing: 0.22em;
  line-height: 1;
  opacity: 0;
  animation: splashFadeUp 0.7s ease 1.05s forwards;
  text-align: center;
}
.splash-tag {
  font-family: "Jost", sans-serif;
  font-size: clamp(8px, 1.1vw, 10px);
  font-weight: 300;
  letter-spacing: 0.55em;
  text-transform: uppercase;
  color: rgba(245, 216, 122, 0.55);
  margin-top: 18px;
  opacity: 0;
  animation: splashFadeUp 0.6s ease 1.25s forwards;
  text-align: center;
}
.splash-loader {
  position: absolute;
  bottom: clamp(28px, 5vh, 56px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  opacity: 0;
  animation: splashFadeUp 0.5s ease 1.15s forwards;
}
.splash-bar-track {
  width: clamp(80px, 14vw, 130px);
  height: 1px;
  background: rgba(192, 144, 32, 0.18);
  position: relative;
  overflow: hidden;
}
.splash-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #c09020, #e0b840);
  animation: barFill 2.1s ease 1.3s forwards;
}
.splash-loader-txt {
  font-size: 8px;
  letter-spacing: 0.48em;
  color: rgba(245, 216, 122, 0.3);
  text-transform: uppercase;
  font-family: "Jost", sans-serif;
}

#lco {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  pointer-events: none;
  width: 28px;
  height: 28px;
  border: 1px solid var(--wine2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition:
    width 0.22s,
    height 0.22s,
    border-color 0.22s,
    border-radius 0.22s;
}
#lci {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  pointer-events: none;
  width: 4px;
  height: 4px;
  background: var(--gold);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
#lco.hov {
  width: 44px;
  height: 44px;
  border-color: var(--gold);
  border-radius: 0;
  transform: translate(-50%, -50%) rotate(45deg);
}
#lco.clk {
  width: 16px;
  height: 16px;
}

.l-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  border-bottom: 1px solid transparent;
  transition: all 0.4s ease;
}
.l-nav.sc {
  background: rgba(250, 244, 232, 0.95);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--rule);
}
.nav-wordmark {
  display: flex;
  flex-direction: column;
  line-height: 1;
}
.nav-w1 {
  font-family: "Playfair Display SC", serif;
  font-size: clamp(13px, 1.6vw, 18px);
  font-weight: 900;
  letter-spacing: 0.22em;
  color: var(--wine);
  text-transform: uppercase;
}
.nav-w2 {
  font-family: "Jost", sans-serif;
  font-size: 9px;
  font-weight: 300;
  letter-spacing: 0.5em;
  color: var(--gold);
  text-transform: uppercase;
  margin-top: 1px;
}
.nav-cta {
  font-family: "Jost", sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--parch);
  background: var(--wine);
  padding: 11px 26px;
  border: none;
  display: inline-block;
  transition: all 0.28s ease;
  position: relative;
  overflow: hidden;
}
.nav-cta::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--gold);
  transform: translateX(-101%);
  transition: transform 0.35s ease;
}
.nav-cta:hover::after {
  transform: translateX(0);
}
.nav-cta:hover {
  color: var(--wine);
}
.nav-cta span {
  position: relative;
  z-index: 1;
}
.ham {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.ham b {
  display: block;
  width: 22px;
  height: 1px;
  background: var(--wine);
  transition: 0.3s;
}
.l-mob {
  position: fixed;
  inset: 0;
  background: var(--wine);
  z-index: 8900;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease;
}
.l-mob.open {
  opacity: 1;
  pointer-events: all;
}
.mob-x {
  position: absolute;
  top: 24px;
  right: 28px;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--gold);
  cursor: pointer;
}
.l-mob a {
  font-family: "DM Serif Display", serif;
  font-size: 34px;
  color: var(--parch);
  transition: color 0.25s;
}
.l-mob a:hover {
  color: var(--gold);
}
.mob-cta {
  font-family: "Jost", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--wine);
  background: var(--gold2);
  padding: 14px 36px;
  margin-top: 12px;
  display: inline-block;
}

.l-hero {
  min-height: 100svh;
  display: grid;
  grid-template-rows: 1fr auto;
  position: relative;
  overflow: hidden;
  background: var(--parch);
}
.hero-wm {
  position: absolute;
  right: -5vw;
  top: -10vh;
  font-family: "Playfair Display SC", serif;
  font-size: clamp(280px, 45vw, 600px);
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 1px rgba(92, 16, 32, 0.06);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}
.hero-rules {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.hero-rules span {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--rule);
  opacity: 0.5;
}
.hero-body {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100svh;
}
.hero-l {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: clamp(100px, 14vh, 160px) clamp(32px, 5vw, 72px) clamp(48px, 8vh, 80px);
  border-right: 1px solid var(--rule);
  position: relative;
}
.h-badge {
  position: absolute;
  top: clamp(80px, 11vh, 120px);
  left: clamp(32px, 5vw, 72px);
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;
  animation: fadeUp 0.8s 0.15s ease forwards;
}
.h-badge-line {
  width: 32px;
  height: 1px;
  background: var(--wine2);
}
.h-badge-txt {
  font-size: 9px;
  letter-spacing: 0.55em;
  color: var(--wine2);
  text-transform: uppercase;
  font-weight: 500;
}
.h-name {
  font-family: "Playfair Display SC", serif;
  font-size: clamp(48px, 8vw, 120px);
  font-weight: 900;
  line-height: 0.88;
  color: var(--wine);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0;
  animation: fadeUp 1.1s 0.3s ease forwards;
}
.h-name-sub {
  font-family: "DM Serif Display", serif;
  font-size: clamp(18px, 3vw, 44px);
  font-style: italic;
  color: var(--gold);
  letter-spacing: 0.06em;
  line-height: 1;
  margin-top: 4px;
  opacity: 0;
  animation: fadeUp 1s 0.46s ease forwards;
}
.h-rule {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: clamp(18px, 3vh, 30px) 0;
  opacity: 0;
  animation: fadeIn 1s 0.64s ease forwards;
}
.h-rule-l {
  height: 1px;
  width: clamp(32px, 5vw, 60px);
  background: var(--gold);
}
.h-rule-d {
  width: 6px;
  height: 6px;
  background: var(--gold);
  transform: rotate(45deg);
}
.h-rule-dot {
  width: 3px;
  height: 3px;
  background: var(--gold);
  border-radius: 50%;
  opacity: 0.6;
}
.h-desc {
  font-size: clamp(11px, 1.3vw, 13px);
  font-weight: 300;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(26, 10, 6, 0.45);
  line-height: 1.6;
  margin-bottom: clamp(28px, 5vh, 48px);
  max-width: 360px;
  opacity: 0;
  animation: fadeUp 0.9s 0.8s ease forwards;
}
.h-btn {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-family: "Jost", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--parch);
  background: var(--wine);
  padding: clamp(14px, 2vh, 18px) clamp(32px, 4vw, 52px);
  border: none;
  position: relative;
  overflow: hidden;
  transition: transform 0.28s ease;
  width: fit-content;
  opacity: 0;
  animation:
    fadeUp 0.9s 1s ease forwards,
    btnGlow 3s ease-in-out 2.5s infinite;
}
.h-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--wine2), var(--wine));
  transform: translateX(-100%);
  transition: transform 0.4s ease;
}
.h-btn:hover::before {
  transform: translateX(0);
}
.h-btn:hover {
  transform: translateY(-2px);
}
.h-btn span,
.h-btn-arrow {
  position: relative;
  z-index: 1;
}
.h-btn-arrow {
  width: 18px;
  height: 1px;
  background: var(--gold);
  transition: width 0.28s ease;
  flex-shrink: 0;
}
.h-btn-arrow::after {
  content: "";
  position: absolute;
  right: 0;
  top: -3px;
  width: 7px;
  height: 7px;
  border-top: 1px solid var(--gold);
  border-right: 1px solid var(--gold);
  transform: rotate(45deg);
}
.h-btn:hover .h-btn-arrow {
  width: 28px;
}
.h-note {
  margin-top: 14px;
  font-size: 9px;
  letter-spacing: 0.4em;
  color: rgba(26, 10, 6, 0.3);
  text-transform: uppercase;
  opacity: 0;
  animation: fadeIn 0.9s 1.4s ease forwards;
}
.hero-r {
  position: relative;
  overflow: hidden;
}
.hero-img-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  overflow: hidden;
}
.hero-img-top img {
  width: 100%;
  height: 100%;
  animation: subtleZoom 18s ease-in-out infinite alternate;
}
.hero-img-bot {
  position: absolute;
  bottom: 0;
  left: 15%;
  right: 0;
  height: 44%;
  overflow: hidden;
  border-top: 4px solid var(--parch);
  border-left: 4px solid var(--parch);
}
.hero-img-bot img {
  width: 100%;
  height: 100%;
}
.hero-img-top::after,
.hero-img-bot::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(92, 16, 32, 0.15), transparent);
}
.hero-yr {
  position: absolute;
  top: 58%;
  left: 4%;
  z-index: 3;
  background: var(--gold);
  padding: 18px 16px;
  text-align: center;
  border: 3px solid var(--parch);
  opacity: 0;
  animation: fadeIn 1s 0.8s ease forwards;
}
.hero-yr-n {
  font-family: "DM Serif Display", serif;
  font-size: 38px;
  color: var(--wine);
  line-height: 1;
}
.hero-yr-t {
  font-size: 8px;
  letter-spacing: 0.3em;
  color: var(--wine2);
  text-transform: uppercase;
  margin-top: 2px;
}
.h-scroll {
  position: absolute;
  bottom: 32px;
  left: clamp(32px, 5vw, 72px);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 3;
  opacity: 0;
  animation: fadeIn 1s 2.2s ease forwards;
}
.hs-line {
  width: 40px;
  height: 1px;
  background: var(--wine2);
  opacity: 0.4;
  animation: linePulse 2.5s ease-in-out infinite;
}
.hs-txt {
  font-size: 8px;
  letter-spacing: 0.5em;
  color: rgba(26, 10, 6, 0.35);
  text-transform: uppercase;
}

.l-mq {
  background: var(--wine);
  padding: 12px 0;
  overflow: hidden;
}
.mq-track {
  display: flex;
  width: max-content;
  animation: mqs 34s linear infinite;
}
.mq-item {
  font-family: "Jost", sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--gold3);
  padding: 0 28px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 28px;
}
.mq-sep {
  color: var(--gold);
  font-size: 11px;
}

.sec-pre {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 9px;
  letter-spacing: 0.5em;
  font-weight: 600;
  color: var(--wine);
  text-transform: uppercase;
  margin-bottom: 14px;
}
.sec-pre::before {
  content: "";
  width: 22px;
  height: 1.5px;
  background: var(--wine);
}
.sec-h {
  font-family: "DM Serif Display", serif;
  font-size: clamp(30px, 5vw, 58px);
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink);
}
.sec-h em {
  font-style: italic;
  color: var(--wine);
}
.sec-p {
  font-size: 14px;
  line-height: 1.9;
  color: rgba(26, 10, 6, 0.58);
  font-weight: 300;
  margin-top: 18px;
  max-width: 520px;
}
.gold-rule {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
}
.gr-l {
  width: 40px;
  height: 1px;
  background: var(--gold);
  opacity: 0.5;
}
.gr-d {
  width: 5px;
  height: 5px;
  background: var(--gold);
  transform: rotate(45deg);
  opacity: 0.7;
}

.l-about {
  padding: clamp(80px, 11vw, 140px) clamp(24px, 6vw, 80px);
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: clamp(40px, 5vw, 80px);
  align-items: center;
  background: var(--parch);
  border-top: 1px solid var(--rule);
}
.about-imgs {
  position: relative;
}
.ab-img1 {
  width: 100%;
  height: clamp(340px, 42vw, 520px);
  border: 1px solid var(--parch3);
  position: relative;
  z-index: 1;
}
.ab-img2 {
  position: absolute;
  bottom: -40px;
  left: -32px;
  width: 46%;
  height: clamp(160px, 20vw, 240px);
  border: 3px solid var(--parch);
  z-index: 2;
  outline: 1px solid var(--parch3);
}
.ab-accent {
  position: absolute;
  top: 24px;
  right: -16px;
  width: 48%;
  height: 50%;
  background: var(--wine-f);
  border: 1px solid rgba(92, 16, 32, 0.12);
  z-index: 0;
}
.ab-badge {
  position: absolute;
  top: -20px;
  right: -14px;
  background: var(--wine);
  padding: 18px 16px;
  text-align: center;
  z-index: 3;
  border: 2px solid var(--gold);
}
.ab-num {
  font-family: "DM Serif Display", serif;
  font-size: 40px;
  color: var(--gold);
  line-height: 1;
}
.ab-lbl {
  font-size: 8px;
  letter-spacing: 0.3em;
  color: rgba(250, 244, 232, 0.6);
  text-transform: uppercase;
}
.ab-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: clamp(28px, 4vh, 44px);
}
.ab-stat {
  padding: 18px 16px;
  background: var(--parch2);
  border-left: 2px solid var(--wine);
  border-bottom: 1px solid var(--parch3);
}
.ab-stat-n {
  font-family: "DM Serif Display", serif;
  font-size: clamp(28px, 3.5vw, 40px);
  color: var(--wine);
  line-height: 1;
}
.ab-stat-l {
  font-size: 9px;
  letter-spacing: 0.22em;
  color: rgba(26, 10, 6, 0.45);
  text-transform: uppercase;
  margin-top: 3px;
}

.l-imgscroll {
  padding: clamp(60px, 8vw, 110px) 0;
  background: var(--parch2);
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  overflow: hidden;
}
.imgscroll-hdr {
  padding: 0 clamp(24px, 6vw, 80px);
  margin-bottom: clamp(32px, 5vw, 52px);
}
.scroll-row {
  overflow: hidden;
  margin-bottom: 12px;
}
.scroll-row:last-child {
  margin-bottom: 0;
}
.scroll-inner {
  display: flex;
  width: max-content;
  gap: 12px;
}
.scroll-inner.sL {
  animation: sL 44s linear infinite;
}
.scroll-inner.sR {
  animation: sR 44s linear infinite;
}
.ic {
  position: relative;
  flex-shrink: 0;
  width: clamp(210px, 23vw, 300px);
  height: clamp(180px, 19vw, 255px);
  overflow: hidden;
  border: 1px solid var(--parch3);
}
.ic img {
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease;
}
.ic:hover img {
  transform: scale(1.07);
}
.ic-ov {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 40%,
    rgba(92, 16, 32, 0.88) 100%
  );
}
.ic-txt {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 14px 16px;
}
.ic-tag {
  font-size: 8px;
  letter-spacing: 0.3em;
  color: var(--gold3);
  text-transform: uppercase;
  font-family: "Jost", sans-serif;
  margin-bottom: 2px;
}
.ic-name {
  font-family: "DM Serif Display", serif;
  font-size: 16px;
  color: #fff;
}
`;
