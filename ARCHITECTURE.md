# Hindi News Analysis Platform — Complete Architecture

## Project Name: GBSBFORYOU News & Analysis Platform
**Version:** 1.0 | **Date:** 2026 | **Author:** Ajay Singh Chauhan

---

## 1. COMPLETE SITEMAP

```
/ (Home)
├── /latest              → Latest News
├── /analysis            → News Analysis
├── /special-reports     → Special Reports
├── /ground-reports      → Ground Reports
├── /interviews          → Interviews / संवाद
├── /politics            → Politics
├── /government-policy   → Government & Policy
├── /india               → India
├── /world               → World
├── /economy             → Economy
├── /society             → Society
├── /culture             → Culture
├── /spirituality        → Spirituality
├── /constitution-law    → Constitution & Law
├── /documents-facts     → Documents & Facts
├── /fact-check          → Fact Check
├── /research            → Research
├── /opinion             → Opinion / विचार
├── /video               → Video
├── /live                → Live
├── /podcasts            → Podcasts
├── /books               → Books & Publications
├── /explainers          → Explainers
├── /archive             → Archive
├── /search              → Search
├── /newsletter          → Newsletter
├── /about               → About
├── /editorial-policy    → Editorial Policy
├── /corrections         → Corrections Policy
├── /contact             → Contact
└── /advertise           → Advertise / Sponsor

ADMIN ROUTES:
/admin/
├── /admin/dashboard     → Newsroom Dashboard
├── /admin/articles      → Article CMS
├── /admin/sources       → Source Database
├── /admin/fact-check    → Fact Check Tool
├── /admin/social        → Social Media Manager
├── /admin/calendar      → Content Calendar
├── /admin/analytics     → Analytics Dashboard
├── /admin/knowledge     → Knowledge Core
├── /admin/ai-agents     → AI Agent Control
├── /admin/research      → Research Projects
├── /admin/video         → Video Manager
├── /admin/live          → Live Manager
├── /admin/newsletter    → Newsletter Manager
├── /admin/monetization  → Ads & Sponsorship
└── /admin/settings      → System Settings
```

---

## 2. USER ROLES

| Role | Permissions |
|---|---|
| Super Admin | Full system access, settings, billing |
| Admin | User management, all content, analytics |
| Editor | Publish, review, approve all content |
| Senior Reporter | Write, submit, edit own articles |
| Reporter | Write, submit own articles |
| Researcher | Research DB, sources, notes |
| Social Editor | Social queue, approve/schedule posts |
| Video Editor | Video upload, clip generation |
| Fact Checker | Fact check module, claim verification |
| Reviewer | Read-only review, comment |
| Analytics | Analytics dashboard only |
| Advertiser | Ad management portal only |

---

## 3. DATABASE SCHEMA

### Users & Auth
```sql
users (id, name, email, password_hash, role, bio, avatar, 2fa_secret, 
       is_active, created_at, last_login)

sessions (id, user_id, token, ip, device, created_at, expires_at)

audit_logs (id, user_id, action, entity_type, entity_id, 
            old_value, new_value, ip, timestamp)
```

### Content
```sql
articles (id, title, subtitle, slug, body_json, summary, 
          status[draft/review/approved/published/archived],
          content_type[news/analysis/interview/ground_report/opinion/explainer],
          author_id, editor_id, reviewer_id,
          hero_image_id, reading_time, 
          published_at, updated_at, created_at,
          seo_title, seo_description, og_image,
          is_ai_assisted, ai_disclosure_text,
          correction_history_json,
          view_count, share_count, bookmark_count)

article_sections (id, article_id, section_type
                  [what_happened/what_we_know/claimed/verified/
                   background/documents/analysis/consequences/
                   whats_next/editorial_view],
                  content_json, order_index)

categories (id, name_hi, name_en, slug, parent_id, description, 
            color, icon, meta_description)

tags (id, name_hi, name_en, slug, tag_type)

article_tags (article_id, tag_id)
article_categories (article_id, category_id)
```

### Sources & Claims
```sql
sources (id, name, source_type[government/court/parliament/
         official_doc/press_release/interview/research/
         academic/news_org/field_report/social_statement/other],
         url, document_path, publication_date, author,
         institution, reliability_status[verified/unverified/disputed],
         topic, evidence_type, verification_status,
         verified_by, verified_at, created_by)

claims (id, article_id, claim_text, claim_type
        [FACT/CLAIM/OFFICIAL_STATEMENT/DOCUMENTED_EVIDENCE/
         UNVERIFIED/ANALYSIS/OPINION],
        source_id, claimant, claim_date,
        verification_status, verifier_id, notes)

article_sources (article_id, source_id, usage_context)
```

### Knowledge Core
```sql
entities (id, entity_type[person/organization/govt_dept/
          political_party/institution/place/event/document/
          policy/law/court_case/interview/book],
          name_hi, name_en, slug, description, 
          image_id, metadata_json, created_at)

entity_relationships (id, entity_from_id, entity_to_id,
                      relationship_type, description, date_from, date_to)

entity_content_links (entity_id, content_type, content_id, context)
```

### Social Media
```sql
social_accounts (id, platform[youtube/facebook/instagram/x/
                 threads/telegram/whatsapp/linkedin],
                 account_name, username, account_id,
                 access_token, refresh_token, token_expires,
                 is_active, follower_count, last_synced)

social_posts (id, article_id, platform, post_type
              [breaking/explainer/quote_card/fact_card/
               doc_highlight/video_clip/carousel/poll/analysis],
              content_text, media_urls_json, scheduled_at,
              published_at, platform_post_id,
              status[draft/ai_generated/editor_review/
                     approved/scheduled/published/failed/
                     correction_required/archived/sensitive_review],
              created_by, approved_by, created_at)

social_analytics (id, social_post_id, platform, metric_date,
                  views, likes, shares, comments, saves,
                  clicks, reach, impressions, ctr, recorded_at)
```

### Video & Programs
```sql
programs (id, name_hi, name_en, slug, host_id, description,
          schedule_json, category_id, thumbnail_id,
          sponsor_id, is_active)

episodes (id, program_id, title, description, video_url,
          thumbnail_id, duration, published_at, view_count,
          transcript_text, article_id)

video_clips (id, episode_id, title, start_time, end_time,
             clip_url, clip_type[full/topic/quote/short],
             platform_versions_json)
```

### Research & Books
```sql
research_projects (id, title, description, lead_researcher_id,
                   status, tags_json, created_at, published_at)

research_notes (id, project_id, author_id, note_text,
                source_ids_json, created_at)

books (id, title_hi, title_en, slug, author_id, description,
       cover_image_id, publication_date, isbn, status)

book_chapters (id, book_id, title, content_json, order_index,
               linked_articles_json, linked_interviews_json,
               linked_sources_json)
```

### Analytics
```sql
page_views (id, article_id, session_id, user_agent, 
            referrer, time_on_page, scroll_depth, timestamp)

weekly_performance (id, week_start, entity_type, entity_id,
                    views, shares, social_traffic, 
                    avg_read_time, returning_visitors, 
                    ai_analysis_json)
```

---

## 4. API ARCHITECTURE

### REST API Structure
```
Base: /api/v1/

PUBLIC:
GET  /articles                  → Article list (paginated)
GET  /articles/:slug            → Single article
GET  /articles/:slug/related    → Related articles
GET  /categories                → All categories
GET  /search?q=&type=&date=     → Search
GET  /entities/:slug            → Knowledge Core entity

PROTECTED (JWT):
POST /articles                  → Create article
PUT  /articles/:id              → Update article
POST /articles/:id/publish      → Submit for publish

ADMIN:
POST /sources                   → Add source
POST /claims                    → Add claim
POST /social/posts              → Create social post
POST /social/posts/:id/approve  → Approve social post
GET  /analytics/dashboard       → Analytics data
POST /ai/draft                  → AI draft generation
POST /ai/social-content         → AI social content
GET  /admin/audit-logs          → Audit trail
```

### WebSocket Events
```
ws://platform/newsroom
→ breaking_news_alert
→ article_status_update
→ social_post_published
→ live_stream_status
→ ai_agent_complete
```

---

## 5. AI AGENT ARCHITECTURE

```
┌─────────────────────────────────────┐
│         AI ORCHESTRATOR             │
│    (Central Agent Controller)       │
└─────────────┬───────────────────────┘
              │
    ┌─────────┼──────────┐
    ▼         ▼          ▼
Research   Discovery   Source
Agent      Agent       Agent
    │
    ▼
Fact Check Agent
    │
    ▼
Draft Agent ──→ Article Agent ──→ SEO Agent
    │
    ├──→ Social Agent ──→ Platform-specific variants
    │         │
    │         ├── Facebook Post Agent
    │         ├── Instagram Caption Agent
    │         ├── X/Twitter Thread Agent
    │         ├── Telegram Post Agent
    │         └── YouTube Description Agent
    │
    ├──→ Video Brief Agent
    │         └── Short Video Script Agent
    │
    └──→ Newsletter Agent

EACH AGENT:
- Input: Article data + Knowledge Core context
- Processing: Platform via Anthropic API (claude-sonnet-4-6)
- Output: Draft content (AI_GENERATED status)
- Human Gate: Required before publish
```

**AI Usage Policy:** AI drafts never auto-publish. All AI output requires human review → editor approval before any publication.

---

## 6. SOCIAL MEDIA INTEGRATION ARCHITECTURE

```
PLATFORM         API TYPE              INTEGRATION
─────────────────────────────────────────────────
YouTube          YouTube Data API v3   Auto-publish available
Facebook         Meta Graph API        Auto-publish available  
Instagram        Meta Graph API        Auto-publish available
X (Twitter)      X API v2              Auto-publish (with limits)
LinkedIn         LinkedIn API v2       Auto-publish available
Telegram         Telegram Bot API      Auto-publish available
Threads          Threads API           Auto-publish available
WhatsApp Channel WhatsApp Business API Manual export + CMS

MANUAL EXPORT (where API unavailable):
→ Generate formatted post
→ Copy to clipboard
→ Export images
→ Mark as manually published
```

---

## 7. EDITORIAL WORKFLOW

```
DISCOVER
  ↓ Reporter / AI Discovery Agent flags topic
RESEARCH
  ↓ Research Agent gathers background + sources
ASSIGN
  ↓ Editor assigns to Reporter
DRAFT
  ↓ Reporter writes (AI assistance available)
FACT CHECK
  ↓ Fact Checker verifies claims, labels FACT/CLAIM/etc
SOURCE VERIFY
  ↓ Source Agent validates sources
EDITOR REVIEW
  ↓ Senior Editor reviews, edits
[HIGH RISK GATE]
  ↓ Politics/Religion/Security → mandatory senior approval
LEGAL REVIEW (if needed)
  ↓ Defamation-sensitive content → legal check
FINAL APPROVAL
  ↓ Editor-in-Chief approves
PUBLISH WEBSITE
  ↓ Auto-generates social drafts
SOCIAL CONTENT REVIEW
  ↓ Social Editor reviews each platform post
SCHEDULE / PUBLISH SOCIAL
  ↓ Platform-by-platform scheduling
ANALYTICS → KNOWLEDGE CORE UPDATE
```

---

## 8. CONTENT WORKFLOW (Story Package)

```
One Article Published
        ↓
[AI Social Content Generator]
        ↓
┌───────┬────────┬──────────┬──────────┐
│  FB   │  IG    │    X     │ Telegram │
│ Post  │Caption │ Thread   │  Post    │
└───────┴────────┴──────────┴──────────┘
        ↓
[Social Editor Review]
        ↓
[Approve Each Platform]
        ↓
[Schedule in Calendar]
        ↓
[Auto-Publish via APIs]
        ↓
[Track Analytics per Platform]
```

---

## 9. TECHNOLOGY STACK

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + custom components
- **State:** Zustand + React Query
- **Rich Text:** TipTap (article editor)
- **Charts:** Recharts
- **Search:** Algolia (or Meilisearch self-hosted)

### Backend
- **Runtime:** Node.js 20 + Express / Next.js API routes
- **Database:** PostgreSQL 16 (primary) + Redis (cache/sessions)
- **ORM:** Prisma
- **Search:** Meilisearch
- **File Storage:** Cloudflare R2 / AWS S3
- **Auth:** NextAuth.js + TOTP (2FA)
- **Queue:** BullMQ (Redis-backed)
- **AI:** Anthropic API (claude-sonnet-4-6)

### Infrastructure
- **Deployment:** Vercel (frontend) + Railway/Render (backend) OR self-hosted VPS
- **CDN:** Cloudflare
- **Video:** Cloudflare Stream / Mux
- **Email:** Resend / AWS SES
- **Monitoring:** Sentry + Posthog
- **CI/CD:** GitHub Actions

### Static Deployment (Phase 1 MVP)
- **Approach:** GitHub Pages compatible HTML/JS for prototype
- **CMS:** Decap CMS (Git-based, no server needed)
- **Upgrade path:** → Next.js fullstack when ready

---

## 10. SECURITY ARCHITECTURE

```
AUTHENTICATION
├── JWT tokens (15min expiry)
├── Refresh tokens (7 days, httpOnly cookie)
├── TOTP 2FA (mandatory for Admin/Editor)
└── Rate limiting (100 req/min per IP)

AUTHORIZATION
├── Role-Based Access Control (RBAC)
├── Resource-level permissions
└── Action audit logging (all write operations)

DATA PROTECTION
├── Passwords: bcrypt (cost 12)
├── API keys: encrypted at rest (AES-256)
├── Social tokens: encrypted in DB
└── Backups: daily encrypted, 30-day retention

CONTENT SECURITY
├── CSP headers
├── XSS sanitization (DOMPurify)
├── SQL injection prevention (parameterized queries/Prisma)
├── File upload validation (type + size + virus scan)
└── HTTPS enforced (HSTS)
```

---

## 11. DEPLOYMENT ARCHITECTURE

```
USER
  ↓ HTTPS
Cloudflare (CDN + DDoS Protection + WAF)
  ↓
Vercel Edge Network (Next.js Frontend)
  ↓
Next.js App (API Routes + SSR/SSG)
  ↓          ↓           ↓
PostgreSQL  Redis      Cloudflare R2
(Supabase   (Upstash)  (Media Files)
 or Railway)
  ↓
External APIs:
  - Anthropic API (AI)
  - Social Platform APIs
  - YouTube Data API
  - Meta Graph API
  - Telegram Bot API
```

---

## 12. DEVELOPMENT PHASES

### Phase 1 — MVP (Months 1-2)
- Homepage
- Article CMS (create/edit/publish)
- Categories & Tags
- Author profiles
- Source database (basic)
- Video embed support
- Social content generator (AI-powered)
- Social content calendar
- Basic analytics
- Search
- Admin dashboard
- Role-based auth
- GitHub Pages deployable prototype

### Phase 2 — Editorial Core (Months 3-4)
- Fact Check module (FACT/CLAIM classification)
- Claim verification workflow
- Knowledge Core (entities + relationships)
- Article workflow (review → approve → publish)
- Correction/update history
- Newsletter system
- SEO schema (NewsArticle, Video, etc.)
- Social API integrations (YouTube, Telegram, Meta)

### Phase 3 — AI Newsroom (Months 5-6)
- AI Research Agent
- AI Draft Agent
- AI Social Content Agent
- AI SEO Agent
- Video transcript agent
- Story Package generator
- Content Performance AI (weekly analysis)

### Phase 4 — Advanced (Months 7-9)
- Live streaming integration
- Program/Episode system
- Research Project module
- Book & Chapter system
- Knowledge Core relationships UI
- Advanced analytics dashboard
- Membership system
- Monetization (ads, sponsorship)

---

## 13. MVP FEATURE LIST

1. ✅ Responsive homepage (Hindi-first, premium design)
2. ✅ Article page with full section structure
3. ✅ Article CMS (TipTap editor)
4. ✅ Categories navigation
5. ✅ Author profiles
6. ✅ Source database (add/view/link)
7. ✅ Basic search
8. ✅ Social content generator (AI)
9. ✅ Social calendar
10. ✅ Admin dashboard
11. ✅ Role-based auth (Admin, Editor, Reporter)
12. ✅ Image upload
13. ✅ Video embed (YouTube/iframe)
14. ✅ SEO meta (OG tags, NewsArticle schema)
15. ✅ Mobile-first responsive
16. ✅ About / Editorial Policy pages

---

## 14. INFRASTRUCTURE REQUIREMENTS (MVP)

| Resource | Spec | Monthly Cost (est.) |
|---|---|---|
| VPS / Vercel Pro | 2 vCPU, 4GB RAM | $20-40 |
| PostgreSQL (Supabase) | 8GB storage | $25 |
| Redis (Upstash) | 256MB | $10 |
| Cloudflare (Pro) | CDN + WAF | $20 |
| Media Storage (R2) | 50GB | $5 |
| Anthropic API | ~1M tokens/month | $15-30 |
| Email (Resend) | 10k/month | $0-20 |
| **Total MVP** | | **~$100-150/month** |

---

*Architecture Document v1.0 — GBSBFORYOU Publications*
