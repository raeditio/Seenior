# Seenior

This project was developed as part of the IBM Bob Hackathon Event.

**Rapid Onboarding Toolkit for GitHub Repositories**

Transform any GitHub repository into comprehensive onboarding materials with AI-powered analysis, interactive diagrams, and educational quizzes.

---

## Overview

Seenior is an intelligent onboarding platform that helps developers quickly understand and get up to speed with new codebases. Simply paste a GitHub repository URL, and Seenior will analyze the code to generate:

- **Comprehensive Documentation** - AI-generated explanations of code structure, patterns, and functionality
- **Interactive UML Diagrams** - Visual class and sequence diagrams with detailed descriptions
- **Comprehension Quizzes** - Educational quizzes to test understanding of the codebase
- **Modern UI/UX** - Beautiful, animated interface built with Next.js and Framer Motion

Perfect for new team members, open-source contributors, or anyone exploring unfamiliar codebases.

---

## Features

### GitHub Repository Analysis
- Fetches repository metadata, README, languages, and contributors
- Supports public repositories with optional GitHub token for higher rate limits
- Comprehensive error handling and validation

### AI-Powered Documentation Generation
- Leverages Google Gemini 2.5 Flash for intelligent code analysis
- Generates detailed explanations of code structure and patterns
- Identifies key components, design patterns, and architectural decisions

### Interactive UML Diagrams
- **Class Diagrams** - Visualize code structure with classes, interfaces, and relationships
- **Sequence Diagrams** - Understand interaction flows and method calls
- **Interactive Elements** - Click on diagram components to view detailed descriptions
- **Color-Coded Categories** - Easy identification of different component types
- Powered by Mermaid.js for clean, professional diagrams

### Comprehension Quizzes
- Auto-generated multiple-choice questions based on the codebase
- Tests understanding of architecture, patterns, and implementation details
- Immediate feedback and explanations for learning

### Modern UI/UX
- Smooth animations with Framer Motion
- Responsive design with Tailwind CSS 4.x
- Clean, intuitive interface
- Export functionality for documentation and diagrams

---

## Technology Stack

### Frontend
- **[Next.js](https://nextjs.org/)** 16.2.6 - React framework with App Router
- **[React](https://react.dev/)** 19.2.4 - UI library
- **[Tailwind CSS](https://tailwindcss.com/)** 4.x - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** 12.38.0 - Animation library
- **[Mermaid](https://mermaid.js.org/)** 11.15.0 - Diagram generation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **[Google Generative AI](https://ai.google.dev/)** - Gemini 2.5 Flash for AI analysis
- **[Octokit](https://github.com/octokit/rest.js)** 22.0.1 - GitHub API client

### Language & Tools
- **[TypeScript](https://www.typescriptlang.org/)** 5.x - Type-safe JavaScript
- **Node.js** 20+ - JavaScript runtime

---

## Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn** package manager
- **Google Gemini API Key** (required)
- **GitHub Personal Access Token** (optional, but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/seenior.git
   cd seenior
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root:
   ```env
   # Required: Google Gemini API Key
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Optional: GitHub Personal Access Token (recommended for higher rate limits)
   GITHUB_TOKEN=your_github_token_here
   ```

   **Getting API Keys:**
   
   - **Gemini API Key**: 
     1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
     2. Create a new API key
     3. Copy and paste into `.env.local`
   
   - **GitHub Token** (optional):
     1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
     2. Generate new token (classic)
     3. Select scope: `public_repo`
     4. Copy and paste into `.env.local`
     
     **Rate Limits:**
     - Without token: 60 requests/hour
     - With token: 5,000 requests/hour

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Usage

1. **Enter GitHub Repository URL**
   - Paste any public GitHub repository URL (e.g., `https://github.com/vercel/next.js`)
   - Supported formats: `https://github.com/owner/repo`, `github.com/owner/repo`, or with `.git` extension

2. **Select Analysis Options**
   - Generate Documentation
   - Generate UML Diagrams
   - Generate Quiz

3. **Analyze Repository**
   - Click "Analyze Repository" button
   - Wait for AI analysis to complete (may take 30-60 seconds)

4. **View Results**
   - **Documentation Tab**: Read AI-generated explanations
   - **UML Diagrams Tab**: Interact with class and sequence diagrams
   - **Quiz Tab**: Test your understanding with generated questions

5. **Export Results**
   - Use export buttons to save documentation and diagrams
   - Share with team members or save for reference

---

## API Endpoints

### `POST /api/github`
Fetches comprehensive repository information from GitHub.

**Request:**
```json
{
  "url": "https://github.com/owner/repository"
}
```

**Response:**
```json
{
  "repository": { /* metadata */ },
  "readme": "markdown content",
  "languages": { "TypeScript": 50000, "JavaScript": 30000 },
  "contributors": [ /* contributor list */ ]
}
```

### `POST /api/analyze`
Generates onboarding materials using AI analysis.

**Request:**
```json
{
  "url": "https://github.com/owner/repository",
  "generateDocs": true,
  "generateUml": true,
  "generateQuizData": true
}
```

**Response:**
```json
{
  "documentation": "AI-generated documentation",
  "uml": {
    "classDiagram": { /* mermaid diagram data */ },
    "sequenceDiagram": { /* mermaid diagram data */ }
  },
  "quiz": [ /* quiz questions */ ]
}
```

**Detailed API Documentation**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete endpoint specifications, examples, and error handling.

---

## Project Structure

```
seenior/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts          # AI analysis endpoint
│   │   └── github/
│   │       ├── route.ts          # GitHub API endpoint
│   │       └── lib.ts            # GitHub utilities
│   ├── components/
│   │   ├── MermaidDiagram.tsx    # Diagram renderer
│   │   └── uml/
│   │       ├── InteractiveDiagram.tsx  # Interactive UML viewer
│   │       ├── DescriptionPanel.tsx    # Component descriptions
│   │       └── categoryColors.ts       # Color scheme
│   ├── quiz/
│   │   └── page.tsx              # Quiz interface
│   ├── results/
│   │   └── page.tsx              # Results display
│   ├── utils/
│   │   └── export.ts             # Export utilities
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── public/                       # Static assets
├── .env.local                    # Environment variables (create this)
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
└── README.md                     # This file
```

---

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

### Development Guidelines

- **Code Style**: Follow TypeScript best practices and ESLint rules
- **Components**: Use functional components with TypeScript interfaces
- **API Routes**: Implement proper error handling and validation
- **Styling**: Use Tailwind CSS utility classes
- **State Management**: Use React hooks and context where appropriate

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Implement changes with proper TypeScript types
3. Test thoroughly with different repositories
4. Update documentation if needed
5. Submit pull request with clear description

---

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Follow existing code style and conventions
- Ensure all tests pass before submitting PR

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

Built with amazing open-source technologies:

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Google Gemini AI](https://ai.google.dev/) - Advanced AI for code analysis
- [Octokit](https://github.com/octokit/rest.js) - GitHub API client
- [Mermaid](https://mermaid.js.org/) - Diagram generation
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

Special thanks to all contributors and the open-source community.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/seenior/issues)
- **Documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/seenior/discussions)

---

## Key Contributors:
- **[raeditio](https://github.com/raeditio)**
- **[jinhoyon](https://github.com/jinhoyon)**

**Made with care for developers by developers**

Star this repo if you find it helpful!
