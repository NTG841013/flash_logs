# UI Rules

Concise rules for building Flash Logs UI. These rules cover the most important patterns and constraints to keep the UI consistent, mirroring the premium dark aesthetic of the original OneMinute Logs design.

---

## Fonts

Flash Logs uses a combination of high-quality fonts to balance readability and a technical feel:

- **Primary Sans**: Inter (via `next/font/google`). Used for general UI text.
- **Heading Font**: Satoshi (local font). Used for major headlines and section titles to give a premium look.
- **Mono Font**: JetBrains Mono. **Mandatory** for all log messages, payloads, code snippets, and terminal views.

---

## Layout

- **Maximum Width**: 1440px for main content areas, centered.
- **Sidebar**: Standard left sidebar (280px wide) for navigation within the dashboard.
- **Padding**: 24px (p-6) or 32px (p-8) standard padding for main content panels.
- **Theme**: Strictly Dark. No light mode is supported or planned.

---

## Navigation (Sidebar)

- **Top Section**: Project selector.
- **Main Links**: Dashboard, Live Logs, Alerts, Integrations, API Keys.
- **Bottom Section**: Settings, Support, User Profile.
- **Active State**: Primary blue background (`bg-primary`) or accent text (`text-accent`) depending on the component.

---

## Cards (Panels)

Every content section lives in a card. Flash Logs uses a "Glassmorphism" effect for cards to maintain depth on the dark background.

```css
.glass {
  background: hsla(228, 70%, 8%, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid hsla(217, 91%, 60%, 0.2);
  border-radius: 12px; /* rounded-xl */
}
```

---

## Typography Hierarchy

1. **Main Headlines**: 32px - 48px, Satoshi Bold, `text-foreground`.
2. **Section Headings**: 18px - 24px, Satoshi Bold, `text-foreground`.
3. **Body Text**: 14px, Inter Medium, `text-foreground`.
4. **Muted Text**: 12px - 14px, Inter Regular, `text-muted-foreground`.
5. **Log Text**: 13px, JetBrains Mono, varies by log level (see ui-tokens.md).

---

## Buttons

- **Primary**: `bg-primary`, `text-primary-foreground`, `rounded-lg`, with a subtle blue glow on hover.
- **Secondary**: `bg-secondary` or `bg-muted`, `text-foreground`, `rounded-lg`.
- **Outline**: `border border-border`, `bg-transparent`, `hover:bg-muted`.

---

## Live Log Stream

- **New Entries**: Should animate in from the top or bottom (depending on sort) with a subtle fade-in and slide.
- **Interaction**: Clicking a log row expands it to show the full JSON payload in a formatted mono view.
- **Search Bar**: Sticky at the top of the live logs view.

---

## Do Nots

- **No Light Mode**: Never use white or light gray backgrounds for main surfaces.
- **No System Fonts**: Always use the defined font stack.
- **No Gradients on Text**: Unless specifically used for "Hero" headlines.
- **No Raw Colors**: Never use `bg-blue-500` or `#hex` codes. Always use theme tokens.
- **No Clutter**: Keep the UI focused on the logs. Avoid unnecessary borders or decorations.
