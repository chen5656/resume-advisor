# Resume Advisor

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)
![Convex](https://img.shields.io/badge/convex-%23FF4155.svg?style=flat&logo=convex&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

**Resume Advisor** is a powerful, interactive tool designed for reviewing, styling, and annotating resumes. By bridging the gap between raw functional Markdown content and visual presentation, it allows users to render resumes with precision, customize layouts dynamically, and leave persistent visual feedback directly on the document.

Whether you are refining your own resume or reviewing a candidate's, Resume Advisor provides a seamless workflow for feedback and iteration.

## ✨ Key Features

- **📄 Markdown-to-UI Rendering**: Seamlessly parses `Resume.md` files into a structured, professional HTML/CSS layout.
- **✏️ Interactive Annotation Tools**:
  - **Pen Tool**: Freehand drawing for quick circles, arrows, or emphasis.
  - (**More tools planned/available**)
  - Annotations are overlayed precisely on top of the resume content.
- **☁️ Cloud Persistence**: Integrated with **Convex** to automatically save and sync annotations in real-time. Feedback is never lost.
- **🎨 Configurable Design System**:
  - Control typography (Headings, Body, Monospace fonts).
  - Fine-tune spacing, padding, and margins for every section (Header, Experience, Education, etc.) via `config.json`.
- **⚡ Fast & Responsive**: Built on Vite for instant feedback and optimized for performance.

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend & Database**: [Convex](https://www.convex.dev/) (Real-time database and backend functions)
- **Styling**: Modern CSS with CSS Variables and JSON-based configuration
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Alerts**: [SweetAlert2](https://sweetalert2.github.io/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd resume-advisor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize Convex:**
   This project uses Convex for the backend. You need to set it up to handle data persistence.
   ```bash
   npx convex dev
   ```
   *This command will prompt you to log in to Convex and configure a project if you haven't already. It will then keep running to sync your schema and functions.*

4. **Run the Development Server:**
   In a new terminal window:
   ```bash
   npm run dev
   ```

5. **Open the App:**
   Visit `http://localhost:5173` (or the URL provided in the terminal) to view the application.

## ⚙️ Configuration

You can customize the resume layout without touching the code by editing `src/config.json`.

```json
{
  "layout": {
    "typography": {
      "heading": "Outfit",
      "body": "Inter",
      "mono": "JetBrains Mono"
    },
    "header": {
      "paddingTop": "1rem",
      "marginBottom": "0.5rem"
    },
    ...
  }
}
```

## 📂 Project Structure

```
resume-advisor/
├── convex/              # Backend functions and schema (Convex)
│   ├── schema.ts        # Database schema definition
│   └── annotations.ts   # API endpoints for saving/loading annotations
├── src/
│   ├── assets/          # Static assets (including Resume.md)
│   ├── components/      # React components (ResumeRender, Toolbar, etc.)
│   ├── utils/           # Utility functions (resumeParser, annotation types)
│   ├── App.tsx          # Main application logic
│   ├── config.json      # Layout and style configuration
│   └── main.tsx         # Entry point
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
