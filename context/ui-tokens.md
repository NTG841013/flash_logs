# UI Tokens

Design tokens for Flash Logs. All colors, typography, spacing, and component values extracted from the project design. Use these exact values throughout the codebase — never hardcode colors or use raw Tailwind color classes in components.

---

## How to Use

This project uses **Tailwind CSS v4**. All design tokens are defined using the `@theme` directive in `app/globals.css`.

Tailwind v4 automatically generates utility classes from `@theme` variables:

- `--color-primary` → `bg-primary`, `text-primary`, `border-primary`
- `--color-background` → `bg-background`

```tsx
// Correct — uses generated utility classes
className="bg-card text-foreground border-border"

// Also correct — references CSS variable directly
style={{ color: 'var(--foreground)' }}

// Never — hardcoded hex values
className="bg-[#05070A] text-[#F8FAFC]"

// Never — raw Tailwind color classes
className="bg-blue-500 text-gray-400"
```

---

## globals.css — Complete Token Definition (HSL)

```css
:root {
  /* Premium Dark Theme - OneMinuteLogs (HSL) */
  --radius: 0.75rem;

  --background: hsl(228 84% 5%);
  --foreground: hsl(210 40% 98%);

  --card: hsl(228 70% 8%);
  --card-foreground: hsl(210 40% 98%);

  --popover: hsl(228 70% 8%);
  --popover-foreground: hsl(210 40% 98%);

  --primary: hsl(217 91% 60%);
  --primary-foreground: hsl(210 40% 98%);

  --secondary: hsl(263 70% 50%);
  --secondary-foreground: hsl(210 40% 98%);

  --muted: hsl(228 40% 15%);
  --muted-foreground: hsl(215 20% 65%);

  --accent: hsl(271 91% 65%);
  --accent-foreground: hsl(210 40% 98%);

  --destructive: hsl(0 84% 60%);
  --destructive-foreground: hsl(210 40% 98%);

  --border: hsl(228 40% 18%);
  --input: hsl(228 40% 18%);
  --ring: hsl(217 91% 60%);

  /* Sidebar */
  --sidebar: hsl(228 70% 8%);
  --sidebar-foreground: hsl(210 40% 98%);
  --sidebar-primary: hsl(217 91% 60%);
  --sidebar-primary-foreground: hsl(210 40% 98%);
  --sidebar-accent: hsl(271 91% 65%);
  --sidebar-accent-foreground: hsl(210 40% 98%);
  --sidebar-border: hsl(228 40% 18%);
  --sidebar-ring: hsl(217 91% 60%);

  /* Chart palette */
  --chart-1: hsl(217 91% 60%);
  --chart-2: hsl(263 70% 50%);
  --chart-3: hsl(271 91% 65%);
  --chart-4: hsl(221 83% 70%);
  --chart-5: hsl(215 20% 65%);
}
```

---

## Color Usage Guide

### Page Layout

| Element           | Token             |
| ----------------- | ----------------- |
| Page background   | `bg-background`   |
| Card / Surface    | `bg-card`         |
| Default border    | `border-border`   |
| Muted background  | `bg-muted`        |

### Typography

| Element                | Token                  |
| ---------------------- | ---------------------- |
| Headings, primary text | `text-foreground`      |
| Muted / Secondary text | `text-muted-foreground`|
| Accent text            | `text-accent`          |

### Accent Colors

- **Primary (Blue)**: Main buttons, primary actions.
- **Secondary (Purple)**: Secondary accents, decorative elements.
- **Accent (Lavender)**: Highlights, special states.

### Log Level Colors

| Level   | Color  | Token / HSL                           |
| ------- | ------ | ------------------------------------- |
| info    | Blue   | `text-primary`                        |
| success | Green  | `text-emerald-400`                    |
| warning | Amber  | `text-amber-400`                      |
| error   | Red    | `text-destructive`                    |
| debug   | Slate  | `text-slate-400`                      |

---

## Typography

- **Font Family**: Inter (Sans), JetBrains Mono (Code/Logs), Satoshi (Headings).
- **Log Text**: Always use `font-mono` for log messages and payloads.

---

## Spacing

| Token       | Value | Usage                 |
| ----------- | ----- | --------------------- |
| `gap-4`     | 16px  | Standard internal gap |
| `gap-6`     | 24px  | Between sections      |
| `p-6`       | 24px  | Card padding          |

---

## Component Tokens

### Cards (Glass Effect)

```css
.glass {
  background: hsla(228, 70%, 8%, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid hsla(217, 91%, 60%, 0.2);
}
```

### Buttons

**Primary:**
```
background: bg-primary
text: text-primary-foreground
radius: rounded-lg (radius-md)
```

---

## Invariants

- Never use hex values directly in components.
- Use `font-mono` for all log-related data.
- Maintain the high-contrast dark theme (hsl(228 84% 5%) background).
