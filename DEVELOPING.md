# Development Guide

This document provides instructions for setting up the project locally and details about the technical stack.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version `>= 24.14.0` is recommended.
- **npm**: Comes with Node.js.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sadanandpai/ml-mini-challenges.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd ml-mini-challenges
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```

## 🛠️ Development Commands

### Run Development Server
Starts a local development server with Hot Module Replacement (HMR).
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
Creates a production-ready bundle in the `docs/` directory.
```bash
npm run build
```

### Preview Production Build
Locally preview the production build.
```bash
npm run preview
```

---

## 🏗️ Project Structure

- `src/challenges/`: Individual ML challenges.
- `src/components/`: Shared UI components.
- `src/helpers/`: Shared utilities and data.
- `src/pages/`: Main application pages.

---

## 🔗 Related Documents

- [README](README.md)
- [Contributing Guide](CONTRIBUTING.md)
