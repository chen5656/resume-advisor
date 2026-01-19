# Web Reviewer

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)
![Convex](https://img.shields.io/badge/convex-%23FF4155.svg?style=flat&logo=convex&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

Web Reviewer is a browser-based review workspace for public web pages. Paste a URL to open a dedicated review tab, annotate with drawings and notes, and share a saved link.

## Features

- Review external web pages in an embedded view while preserving original CSS, layout, and structure.
- Annotation toolkit with pen, highlighter, line, text, and eraser tools plus undo/redo.
- Persistent storage and shareable links powered by Convex.
- Frame-aware UX that detects pages that block embedding and offers a direct-open fallback.

## Quick Start

1. Prerequisites: Node.js 18+ and npm or yarn.
2. Install dependencies:

```bash
git clone <repository-url>
cd web-reviewer
npm install
```

3. Start Convex in a separate terminal:

```bash
npx convex dev
```

4. Run the app:

```bash
npm run dev
```

Visit `http://localhost:5173`.

## Usage

- Use the landing page to enter a public URL and open a review tab.
- Or open a page directly:
  `http://localhost:5173/?page=https://example.com`
- If a site blocks embedding, use the in-app "Open page directly" link.

## Tech Stack

- React 18 and TypeScript
- Convex for real-time persistence
- Vite
- Vanilla CSS

## Project Structure

```text
resume-advisor/
├── convex/              # Backend (schema and mutations)
├── src/
│   ├── assets/          # Static assets and Resume.md
│   ├── components/      # Toolbar, overlays, viewers
│   ├── utils/           # Parsing and annotation logic
│   ├── App.tsx          # App entry and routing
│   └── App.css          # UI styles
└── index.html           # Root HTML template
```

## Customization

To tweak resume rendering, edit `src/config.json` and update fonts, spacing, and layout values.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
