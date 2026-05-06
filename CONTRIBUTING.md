# Contributing to Machine Learning Mini Challenges

First off, thank you for considering contributing to Machine Learning Mini
Challenges! It's people like you who make this a great resource for the
community.

## 🌈 How Can I Contribute?

### 1. Adding a New Challenge

We are always looking for new interactive ML challenges! Whether it's a new
algorithm, a different visualization, or a classic game, your contribution is
welcome.

**To add a new challenge:**

1. Create a new folder in `src/challenges/[challenge-name]`.
2. Structure your challenge folder as follows:
   ```text
   src/challenges/[challenge-name]/
   ├── index.tsx         # Main component
   ├── components/      # Local UI components
   └── helpers/         # Logic, math utilities, and data
   ```
3. Register your challenge in `src/helpers/challengesList.ts`:
   - Add your main component to the imports.
   - Add a new object to the `challenges` array with `name`, `title`,
     `description`, `component`, `creationDate`, and `tags`.

### 2. Improving Existing Challenges

- Fix bugs (e.g., convergence issues, UI glitches).
- Improve visualizations (better charts, smoother animations).
- Enhance documentation or explanations within the challenge.

### 3. Reporting Bugs

- Use the GitHub Issues tracker to report bugs.
- Include steps to reproduce and environment details (Node version, browser).

---

## 🛠️ Development Setup

For detailed instructions on setting up your local environment and running the
project, please refer to our [**Development Guide**](DEVELOPING.md).

---

## 🔗 Related Documents

- [**README**](README.md)
- [**Development Guide**](DEVELOPING.md)

---

## 🎨 Coding Standards

- **TypeScript**: Use TypeScript for all new code. Ensure proper typing for
  props and state.
- **Styling**: We use **Tailwind CSS 4** and **daisyUI 5**. Favor utility
  classes and daisyUI components over custom CSS.
- **Charts**: Use **Plotly** for visualizations to maintain consistency across
  challenges.

---

## 🚀 Pull Request Process

1. Create a new branch for your feature or fix:
   `git switch -c feature/your-feature-name`.
2. Commit your changes with descriptive messages.
3. Push to your fork and submit a Pull Request.
4. Ensure your PR description clearly explains what you've added or changed.
5. Wait for review and address any feedback.

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the
[MIT License](./LICENSE).
