# GBSBFORYOU — Hindi News Analysis & Digital Media Platform

**समाचार · विश्लेषण · ज्ञान**  
*आज की खबर को कल के ज्ञान में बदलना*

---

## परियोजना का उद्देश्य

यह केवल एक News Website नहीं है।  
यह एक **Digital Newsroom + CMS + Social Media System + Research Platform + Knowledge Archive** है।

**मुख्य यात्रा:**
```
घटना → समाचार → संवाद → तथ्य → संदर्भ → विश्लेषण → शोध → ज्ञान → प्रकाशन
```

---

## Repository Structure

```
hindi-news-platform/
├── index.html          → Homepage (MVP)
├── ARCHITECTURE.md     → Complete system architecture
├── README.md           → This file
├── /docs               → Design specs, wireframes
├── /admin              → Admin dashboard (Phase 2)
├── /api                → API routes (Phase 2)
└── /assets             → Images, icons, fonts
```

---

## Architecture Highlights

- **37-section editorial system** with AI-human workflow
- **17 AI Agents** — Research, Fact Check, Social, SEO, Video...
- **Story Package Generator** — 1 article → 14+ platform versions
- **Knowledge Core** — Person/Org/Event/Law/Document relationships
- **Source Classification** — FACT / CLAIM / VERIFIED / OPINION
- **Social Media** — YouTube, FB, IG, X, Threads, Telegram, WhatsApp, LinkedIn
- **RBAC** — 11 user roles with audit trails
- **2FA mandatory** for Admin/Editor roles

## Design System

| Token | Value |
|---|---|
| Ink (Primary) | `#0D1B2A` |
| Saffron (Accent) | `#C8731A` |
| Paper (BG) | `#F7F5F0` |
| Slate (Secondary) | `#4A6580` |
| Alert Red | `#C0392B` |
| Verified Green | `#1E7E5A` |
| Serif Font | Noto Serif Devanagari |
| Sans Font | Noto Sans Devanagari |

---

## Development Phases

| Phase | Timeline | Features |
|---|---|---|
| **Phase 1 — MVP** | Months 1-2 | Homepage, CMS, Auth, Social Generator |
| **Phase 2 — Editorial Core** | Months 3-4 | Fact Check, Knowledge Core, Workflow |
| **Phase 3 — AI Newsroom** | Months 5-6 | AI Agents, Story Package, Performance AI |
| **Phase 4 — Advanced** | Months 7-9 | Live, Research, Books, Monetization |

---

## Tech Stack (Full Production)

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Editor:** TipTap (rich text)
- **Database:** PostgreSQL + Redis
- **ORM:** Prisma
- **AI:** Anthropic API (claude-sonnet-4-6)
- **Storage:** Cloudflare R2
- **CDN:** Cloudflare
- **Auth:** NextAuth.js + TOTP 2FA
- **Deployment:** Vercel + Railway

---

## GitHub Pages (Phase 1 Prototype)

Static HTML prototype is GitHub Pages compatible.  
Branch: `main` → `/docs` or root for Pages deployment.

```bash
git clone https://github.com/ajaysingh132/hindi-news-platform
cd hindi-news-platform
# Open index.html in browser for local preview
```

---

## संस्था

**GBSBFORYOU Publications**  
Founder & Chief Editor: Ajay Singh Chauhan  
Location: Bhopal, Madhya Pradesh, India  
GitHub: [@ajaysingh132](https://github.com/ajaysingh132)

---

## License

© 2026 GBSBFORYOU Publications. All rights reserved.  
Content and editorial framework proprietary.  
Code available for reference — contact for licensing.

---

*"व्यक्ति नहीं, विषय केंद्र में। आरोप नहीं, प्रमाण केंद्र में। शोर नहीं, समझ केंद्र में।"*
