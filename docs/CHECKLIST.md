# Checklist QAPI e-shop (živý plán)

## Hotovo (nedávno)

- [x] Obchodní podmínky, GDPR, cookies — stránky + odkazy v patičce
- [x] Souhlas v pokladně (OP + osobní údaje)
- [x] Lišta cookies (nezbytné vs. souhlas)
- [x] Potvrzovací stránka: VS + blok platebních údajů (z `PAYMENT_*` env)
- [x] Odesílání e-mailů po objednávce (zákazník + interní), pokud je nastaveno SMTP
- [x] Admin: přihlášení přes formulář + cookie session, horní lišta (Objednávky / AR / Odhlásit)
- [x] Export objednávek CSV + ochrana `/api/admin/*`
- [x] **Audit změny stavu objednávky**: ukládá se e-mail ze session (nebo `basic:uživatel`), FK na `AdminUser` pokud existuje; zobrazení v historii. SQL: `database/007_order_status_history_actor.sql`
- [x] RBAC (role z DB) u admin API + přehled aktivit + nápověda rolí v UI
- [x] **E-maily při změně stavu objednávky** — interně na `ORDER_NOTIFY_EMAIL`; volitelně zákazníkovi (`ORDER_STATUS_NOTIFY_CUSTOMER=true`)
- [x] Stránka **/admin/tym** — přehled `AdminUser`, úprava rolí (jen **owner**); API `GET /api/admin/team`, `PATCH .../roles`
- [x] **Vytvoření admin účtu** z UI (`POST /api/admin/team`) — bcrypt, volitelné vygenerované heslo
- [x] **Životní cyklus účtu na /admin/tym** — aktivace/deaktivace (`isActive`), reset hesla (vygenerovat / ručně), `PATCH /api/admin/team/[id]`; vlastní účet nelze deaktivovat; neaktivní admin se nepřihlásí (`verifyAdminDatabasePassword`)
- [x] **Reference** — galerie z `src/data/references.ts` + karty s fallbackem při chybějícím obrázku; vlastní **404** (`app/not-found.tsx`)
- [x] **Loading / Error** — `app/loading.tsx`, `app/admin/loading.tsx`, `app/error.tsx`, `app/admin/error.tsx`; **sitemap** doplněn o URL produktů z fallback katalogu; **metadataBase** + Open Graph v root layoutu
- [x] **A11y & PWA light** — odkaz „Přeskočit na obsah“ (`#main-content`), **manifest** (`app/manifest.ts`), **themeColor** + `appleWebApp`; **JSON-LD** Organization + WebSite (globálně), **Product** na stránkách produktu; sdílené `getSiteUrl()` v `lib/site.ts`
- [x] **UI/UX redesign storefrontu (fáze 0-7)** — dokončen design system, premium hlavička/patička + Shadeon branding, homepage revamp, discovery flow s inline Quick View, 3D/AR wow upgrade, product detail revamp, checkout trust polish, performance/SEO/a11y final pass.
- [x] **Release gate UI/UX** — finální validace `npm run lint` + `npm run build` + `npm run test` proběhla úspěšně.

## Další kroky (doporučené pořadí)

### A. Provoz e-mailů a plateb

- [ ] Vyplnit `.env` / produkční proměnné: `SMTP_*`, `MAIL_FROM`, `ORDER_NOTIFY_EMAIL`
- [ ] Vyplnit `PAYMENT_*` (účet, IBAN, poznámka)
- [ ] Otestovat reálné odeslání z produkční/staging domény (SPF/DKIM dle poskytovatele)

### B. Právní a obsah

- [ ] Nechat projít texty OP / GDPR právníkem, doplnit IČ, sídlo, identitu správce
- [ ] Finální kontakty (telefon, e-mail) vs. testovací údaje
- [ ] Reference: fotky, města, typ realizace

### C. Admin a bezpečnost

- [ ] (volitelně) E-mail uživateli při resetu hesla z admin Tým (zatím se heslo zobrazí jen v UI)
- [x] Přihlášení přes **session cookie** (`/admin/prihlaseni`, HMAC podpis, httpOnly). Volitelně účet z DB `AdminUser` (bcrypt) nebo `ADMIN_EMAIL`/`ADMIN_PASSWORD`.
- [x] **ADMIN_SESSION_SECRET** povinný (min. 16 znaků). Pro přechod: `ADMIN_ALLOW_BASIC_FALLBACK=true`.
- [x] **RBAC v admin API** — owner/manager: export objednávek, AR zápis/import/export; support: změna stavu objednávky + test AR URL. Volitelně `ADMIN_RBAC_DISABLED=true`.
- [x] Přehled **posledních změn stavů** na stránce objednávek + role v horní liště (`/api/admin/auth/me`)
- [x] Export objednávek (CSV) pro účetnictví — `/api/admin/orders/export` (souhrn) a `?mode=lines` (řádky položek)
- [x] Ochrana `/api/admin/*` v proxy (session / volitelně Basic fallback)

**Bcrypt pro `AdminUser` v DB:**  
`node -e "console.log(require('bcryptjs').hashSync('VASE_HESLO', 12))"` → výsledek uložit do `passwordHash` (UPDATE v PostgreSQL).

### D. Go-live

- [ ] Produkční `DATABASE_URL`, zálohy
- [ ] Monitoring chyb (např. Sentry)
- [ ] E2E test: konfigurace → košík → pokladna → DB → e-mail

---

_Při dokončení položky ji označte `[x]` a případně doplňte datum v commit zprávě._
