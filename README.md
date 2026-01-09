# 📄 Resume Advisor

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)
![Convex](https://img.shields.io/badge/convex-%23FF4155.svg?style=flat&logo=convex&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

**Resume Advisor** is a premium, interactive platform for reviewing resumes. It transforms static Markdown content into a stunning visual document, providing experts and candidates with a powerful toolset for real-time feedback and design iteration.

---

## ✨ Features

### 🎨 Professional Rendering
- **Markdown-to-UI Architecture**: Automatically converts standard `Resume.md` files into a polished, production-ready layout using modern CSS.
- **Dynamic Styling**: Configure typography (Heading, Body, Mono) and section spacing via a simple `config.json` file.

### ✏️ Advanced Annotation Suite
A full suite of tools to mark up resumes with precision:
- **🖋️ Pen Tool**: Freehand drawing for emphasis and circling.
- **🖍️ Highlighter**: Emphasize key skills or achievements with bright overlays.
- **📏 Line Tool**: Draw straight lines for clean underlining or structural feedback.
- **🔤 Text Tool**: Drop comments and text notes directly onto the document.
- **🧽 Eraser**: Easily correct or remove specific annotations.

### 🔄 Workflow Efficiency
- **Undo/Redo History**: Accidents happen! Navigate through your entire annotation history with ease.
- **Real-time Persistence**: Powered by **Convex**, all annotations are saved instantly to the cloud.
- **Shareable Links**: Generate unique URLs to share your suggestions with others instantly.

### 🖨️ Production Ready
- **Print Optimization**: A dedicated print mode ensures the resume looks perfect on paper, automatically hiding all UI toolbars and controls.
- **Responsive Viewer**: Designed for clarity across all desktop screens.

---

## 🛠️ Tech Stack

- **Core**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **State & Backend**: [Convex](https://www.convex.dev/) (Real-time Cloud Database)
- **Styling**: Vanilla CSS with CSS Variables & Glassmorphism
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (Lucide)
- **Feedback**: [Sonner](https://sonner.emilkowal.ski/)
- **Build**: [Vite](https://vitejs.dev/)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Installation
```bash
git clone <repository-url>
cd resume-advisor
npm install
```

### 3. Start Backend (Convex)
Resume Advisor uses Convex for real-time data. Run this in a separate terminal:
```bash
npx convex dev
```

### 4. Launch Application
```bash
npm run dev
```
Visit `http://localhost:5173` to start advising!

---

## 📂 Project Structure

```text
resume-advisor/
├── convex/              # Backend (Schema & API)
│   ├── schema.ts        # Data definitions
│   └── annotations.ts   # CRUD operations for shapes
├── src/
│   ├── assets/          # Static assets & Resume.md
│   ├── components/      # UI Components (Toolbar, ResumeRender)
│   ├── utils/           # Parser & Annotation logic
│   ├── config.json      # Design system configuration
│   └── App.tsx          # Application entry
└── index.html           # Root HTML template
```

---

## ⚙️ Customization

Customize your resume's look and feel without writing code. Edit `src/config.json`:

```json
{
  "layout": {
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "mono": "JetBrains Mono"
    },
    "header": {
      "paddingTop": "1.5rem",
      "marginBottom": "0.75rem"
    }
  }
}
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to open issues or submit pull requests to improve the rendering engine or annotation tools.

## 📄 License

This project is licensed under the MIT License.
