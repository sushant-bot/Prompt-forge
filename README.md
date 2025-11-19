# ✨ PromptForge

<div align="center">

![PromptForge Banner](https://img.shields.io/badge/PromptForge-AI%20Prompt%20Generator-blueviolet?style=for-the-badge)

**A beautiful, modern AI prompt generator with glassmorphism design and smooth animations**

[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Demo](#) • [Features](#features) • [Installation](#installation) • [Usage](#usage)

</div>

---

## 🎯 Overview

PromptForge is a cutting-edge web application designed to help you craft perfect AI prompts with ease. Whether you're working on general tasks or coding projects, PromptForge provides an intuitive interface with advanced customization options.

## ✨ Features

### 🎨 Beautiful UI/UX
- **Glassmorphism Design** - Modern frosted glass aesthetics with backdrop blur effects
- **Vibrant Gradients** - Eye-catching radial and linear gradients throughout
- **Smooth Animations** - Powered by Framer Motion for buttery-smooth transitions
- **Responsive Layout** - Fully optimized for desktop, tablet, and mobile devices

### 🛠️ Dual Mode System

#### 📝 General Mode
- **Persona Definition** - Define the AI's role and expertise
- **Use Case Selection** - Choose from various predefined scenarios
- **Tone Control** - Professional, casual, creative, or technical
- **Output Format** - Paragraph, bullet points, step-by-step, or code
- **Topic & Constraints** - Fine-tune your prompt requirements

#### 💻 Coding Mode
- **Multi-Language Support** - JavaScript, TypeScript, Python, Java, C++, Go, Rust, and more
- **Code Snippet Input** - Paste existing code for analysis or improvement
- **Error Message Handler** - Get help debugging specific errors
- **Context-Aware Prompts** - Specialized for development tasks

### 🎯 Smart Features
- **Real-time Preview** - See your generated prompt instantly
- **Character Counter** - Track prompt length with visual feedback
- **One-Click Copy** - Copy prompts to clipboard with success animation
- **Loading States** - Beautiful loading animations during generation
- **Dark Mode** - Eye-friendly dark theme by default

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/sushant-bot/Prompt.git
   cd Prompt
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Creating a General Prompt

1. Select the **General** tab
2. Fill in the following fields:
   - **Persona:** Define who the AI should be (e.g., "Expert Marketing Strategist")
   - **Use Case:** Select your scenario (e.g., "Content Creation")
   - **Tone:** Choose your desired tone (e.g., "Professional")
   - **Output Format:** Select format (e.g., "Paragraph")
   - **Topic:** Enter your main subject
   - **Constraints:** Add any specific requirements

3. Click **Generate Prompt**
4. Review the generated prompt in the preview panel
5. Click **Copy Prompt** to use it

### Creating a Coding Prompt

1. Select the **Coding** tab
2. Configure your coding prompt:
   - **Language:** Select programming language
   - **Topic:** Describe what you need
   - **Code Snippet:** (Optional) Paste existing code
   - **Error Message:** (Optional) Add error details
   - **Constraints:** Specify requirements

3. Click **Generate Prompt**
4. Copy and use with your favorite AI coding assistant

## 🎨 Customization

### Modifying Themes

Edit `app/globals.css` to customize colors:

```css
@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* Add your custom colors */
  }
}
```

### Adding New Options

Modify the dropdown options in `app/page.tsx`:

```typescript
const tones = ["Professional", "Casual", "Creative", "Technical", "Your Custom Tone"];
```

## 📁 Project Structure

```
Prompt/
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Main application page
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── prompt-forge/         # Custom prompt components
│   │   ├── general-mode-form.tsx
│   │   ├── coding-mode-form.tsx
│   │   └── prompt-preview.tsx
│   └── theme-provider.tsx    # Dark mode provider
├── lib/
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## 🔧 Build & Deploy

### Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sushant-bot/Prompt)

Or manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Vercel](https://vercel.com/) for the Next.js framework
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 📧 Contact

Sushant - [@sushant-bot](https://github.com/sushant-bot)

Project Link: [https://github.com/sushant-bot/Prompt](https://github.com/sushant-bot/Prompt)

---

<div align="center">

Made with ❤️ by [Sushant](https://github.com/sushant-bot)

⭐ Star this repo if you find it helpful!

</div>
