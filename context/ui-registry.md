# UI Registry

Living document for Flash Logs UI components. Read this before building any new component — match existing patterns exactly.

---

## Dashboard Components

### Stat Card
- **Path**: `apps/main-dashboard/components/dashboard/StatCard.tsx`
- **Classes**: `bg-card/50 border-border p-6 rounded-xl hover:bg-card transition-colors`, `text-2xl font-bold text-foreground`, `text-xs text-muted-foreground`
- **Tokens**: `--card`, `--foreground`, `--muted-foreground`

### Log Table
- **Path**: `apps/main-dashboard/app/live-logs/page.tsx` (Internal component)
- **Classes**: `w-full text-left font-mono text-sm`, `border-b border-border/50 hover:bg-muted/30 transition-colors`, `px-4 py-2`
- **Tokens**: `--border`, `--muted`, `--font-mono`

### Flash Logs High-Fidelity Layout
- **Sidebar**: `w-64`, `bg-sidebar` (HSL 228 70% 8%). Icons `h-4 w-4`, text `text-xs font-semibold`.
- **Topbar**: `h-14`, `bg-background/80`, backdrop-blur. Breadcrumbs and utility icons (`Search`, `Bell`).
- **Cards**: `bg-card`, `rounded-xl`, `p-4`, `border-white/5`.
- **Primary Color**: `hsl(217 91% 60%)` (Premium Blue).
- **Typography**: `font-satoshi` for headers, `font-geist-sans` for UI text. Smaller font sizes (xs/11px) used for metadata and sub-labels to match high-density spec.

### Integration Step
- **Path**: `apps/landing-page/components/landing/LandingSetup.tsx`
- **Classes**: `bg-slate-900/50 border-sky-500/30 rounded-xl p-5`, `text-sky-400 font-semibold`, `text-slate-400 text-sm`
- **Tokens**: Based on Landing Page theme (Slate/Sky)

### Terminal View
- **Path**: `apps/landing-page/components/landing/LandingSetup.tsx`
- **Classes**: `bg-slate-950 border-slate-800 rounded-2xl overflow-hidden shadow-2xl`, `font-mono text-sm text-slate-300`
- **Tokens**: `--font-mono`

## Common Components

### Button
- **Path**: `app/components/ui/button.tsx`
- **Classes**: `inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all`, `bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-95`
- **Tokens**: `--primary`, `--primary-foreground`

### Landing Navbar
- **Path**: `app/components/landing/LandingNavbar.tsx`
- **Classes**: `fixed top-0 w-full border-b border-white/5 bg-background/50 backdrop-blur-xl h-16`, `flex items-center justify-between`
- **Centered Menu**: Using `absolute left-1/2 -translate-x-1/2` for desktop navigation.
- **Tokens**: `--background`, `--foreground`

### Logo Cloud (Carousel)
- **Path**: `app/components/landing/LogoCloud.tsx`
- **Classes**: `py-12 border-y border-white/5 bg-white/2 overflow-hidden`, `flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]`
- **Animation**: `framer-motion` infinite loop with `useAnimationControls`. Pauses on hover.
- **Interactivity**: Mouse-following offset shift on hover for depth effect.
- **Sizing**: Uniform `w-32 h-12` containers with individual `scale` factors and `max-h-6` constraint for perfect visual balance.
- **Inversion**: Conditional `brightness-0 invert` for dark SVG logos to ensure visibility on dark background.
- **Tokens**: `--muted-foreground`, `grayscale`, `brightness-[1.5]`

### Landing Integrations
- **Path**: `app/components/landing/LandingIntegrations.tsx`
- **Design**: Framework integration grid using `app/assets/frameworks`.
- **Sizing**: Consistent `h-12 w-12` logo containers with `grayscale brightness-[1.2]` filters.
- **Interactivity**: `group-hover:grayscale-0` for focal highlights.

### Landing Footer
- **Path**: `app/components/landing/LandingFooter.tsx`
- **Classes**: `bg-background border-t border-white/5 pt-24 pb-12`, `glass rounded-3xl p-8 md:p-16`
- **Interactivity**: CTA with `Button` hover effects, social links with `.glass` hover lift.
- **Tokens**: `--primary`, `--glass-bg`, `--glass-border`, `--muted-foreground`

### Terminal Setup
- **Path**: `app/components/landing/LandingSetup.tsx`
- **Classes**: `bg-slate-950 border border-white/10 rounded-2xl overflow-hidden`, `font-mono text-sm text-emerald-400`
- **Tokens**: `--font-mono`

### Typography (Custom)
- **Token**: `--font-satoshi` (Satoshi-Bold)
- **Application**: Applied to `h1` through `h6` in `globals.css` base layer.
- **Classes**: `.font-satoshi`, `.font-bold`

### Settings Tabs
- **Path**: `apps/main-dashboard/app/settings/page.tsx`
- **Tabs**: Profile, Organization, Billing
- **Component**: `apps/main-dashboard/components/ui/tabs.tsx` (Radix-based)
- **Usage Indicators**: Vertical bars showing usage vs limits (Pro/Free).

### Dynamic Sidebar User Profile
- **Path**: `apps/main-dashboard/components/dashboard/Sidebar.tsx`
- **Dynamic Fields**: Organization name, User full name, Email, Profile Image, Plan Badge (via Clerk metadata).

### Animations
- **Marquee**: Used in `LogoCloud` and `Testimonials`.
- **Classes**: `animate-marquee`, `animate-marquee-reverse` (40s linear).
- **Control**: `framer-motion` `useAnimationControls` for interactive pause/resume and mouse displacement.

---

### Testimonials Carousel
- **Path**: `app/components/landing/Testimonials.tsx`
- **Classes**: `w-[350px] p-6 rounded-2xl glass border border-white/10`, `flex overflow-hidden py-4`
- **Animation**: Dual-row `framer-motion` carousel. Row 1: R to L, Row 2: L to R.
- **Interactivity**: Pauses on hover, mouse-following displacement.
- **Tokens**: `--glass-bg`, `--glass-border`, `--muted-foreground`

## Common Patterns

### Glass Panels
- **Class**: `.glass` (defined in `globals.css`)
- **Properties**: `background: hsla(228, 70%, 8%, 0.4)`, `backdrop-filter: blur(12px)`, `border: 1px solid hsla(217, 91%, 60%, 0.2)`

### Gradient Text
- **Class**: `.gradient-text`
- **Properties**: `background: linear-gradient(135deg, hsl(217 91% 60%), hsl(263 70% 50%))`, `-webkit-background-clip: text`

### Hover Lift
- **Class**: `.hover-lift`
- **Properties**: `transition: all 0.3s`, `hover:translate-y-[-4px]`, `hover:shadow-glow-primary`

### Glow Effects
- **Classes**: `.glow-primary`, `.glow-secondary`
- **Properties**: `box-shadow: var(--shadow-glow-primary)` or `var(--shadow-glow-secondary)`.
