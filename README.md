# 🚀 Next.js + Tailwind CSS + shadcn/ui Projekt

Detta projekt är byggt med moderna webbteknologier för att skapa en snabb, skalbar och snygg webbapplikation.

## 📖 Om projektet

Detta är en enkel frontend byggd med Next.js.

Projektet fungerar som ett användargränssnitt för ett separat backend-repository utvecklat i C# som en del av en skoluppgift inom datalagring.

Frontend hanterar endast presentation och kommunicerar med backend via API.
Majoriteten av logiken och datalagringen finns i backend-projektet.

https://github.com/JariPii/datalagring-jari-leminaho

## 🧱 Teknologier

- [Next.js](https://nextjs.org/) – React framework
- [React](https://react.dev/) – UI library
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) – Återanvändbara UI komponenter
- [TypeScript](https://www.typescriptlang.org/) – Typning för JavaScript (om aktiverat)

---

## 📦 Installation

Klona repositoryt:

```bash
git clone <repo-url>
cd <project-name>
```

Installera dependencies:

```bash
npm install
```

Alternativt:

```bash
pnpm install
# eller
yarn install
```

---

## 💻 Starta development server

Starta projektet lokalt:

```bash
npm run dev
```

Öppna i webbläsaren:

```
http://localhost:3000
```

Applikationen uppdateras automatiskt när du ändrar filer.

---

## 🛠 Tillgängliga scripts

I projektet kan du köra:

```bash
npm run dev
```

Startar development server.

```bash
npm run build
```

Bygger applikationen för produktion.

```bash
npm run start
```

Startar produktionsservern.

```bash
npm run lint
```

Kör ESLint för att hitta problem i koden.

---

## 📁 Projektstruktur

```
.
├── app/                # Next.js App Router (pages, layouts)
├── components/        # React komponenter
│   └── ui/            # shadcn/ui komponenter
├── lib/               # Utilities och helpers
├── public/            # Statiska filer (bilder, icons)
├── styles/            # Globala styles
├── tailwind.config.ts # Tailwind konfiguration
├── components.json    # shadcn/ui konfiguration
├── package.json
└── README.md
```

---

## 🎨 UI Komponenter (shadcn/ui)

För att lägga till nya komponenter:

```bash
npx shadcn-ui@latest add button
```

Exempel:

```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
```

Komponenterna sparas i:

```
components/ui/
```

---

## 🎯 Styling

Projektet använder Tailwind CSS för styling.

Exempel:

```tsx
export default function Example() {
  return (
    <button className='bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800'>
      Klicka mig
    </button>
  );
}
```

---

## 🏗 Bygg för produktion

Bygg projektet:

```bash
npm run build
```

Starta produktion:

```bash
npm run start
```

---

## 🌐 Deployment

Rekommenderad deployment:

- [Vercel](https://vercel.com/) (rekommenderas för Next.js)

Alternativ:

- Netlify
- Docker
- VPS

---

## ⚙️ Krav

- Node.js 18 eller senare
- npm, pnpm eller yarn

Kontrollera version:

```bash
node -v
```

---

## 🧑‍💻 Utveckling

Development server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

---

## 📄 Licens

MIT License

---

## 👤 Författare

Jari Leminaho
GitHub: https://github.com/JariPii
