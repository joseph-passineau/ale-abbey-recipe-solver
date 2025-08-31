# 🍺 Ale Abbey Recipe Solver

A powerful web-based tool to optimize beer recipes for the game [Ale Abbey - Monastery Brewery Tycoon](https://store.steampowered.com/app/2789460/Ale_Abbey__Monastery_Brewery_Tycoon/).

## 🚀 Try it out

[![Launch Recipe Solver](https://img.shields.io/badge/🚀_Launch_Recipe_Solver-Click_Here-blue?style=for-the-badge&logo=github)](https://joseph-passineau.github.io/ale-abbey-recipe-solver/)

## ✨ Features

- **Smart Recipe Optimization**: Uses advanced linear programming algorithms to find the best ingredient combinations
- **Multiple Objectives**: Optimize for lowest cost or fewest ingredients
- **Virtue Requirements**: Set specific requirements for Flavor, Colour, Strength, and Foam
- **Flexible Constraints**: Set maximum ingredients, required ingredients, and minimum good virtues
- **Wizard Interface**: Step-by-step guided recipe creation process
- **Real-time Results**: Instant feedback on recipe costs and virtue outcomes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ale-abbey-recipe-solver.git
   cd ale-abbey-recipe-solver
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## 📖 How to Use

1. **Choose Your Style**: Select from various European beer styles (Ale, Lager, Stout, etc.)
2. **Set Constraints**: Configure maximum ingredients, optimization objective, and virtue requirements
3. **Select Ingredients**: Choose from available brewing ingredients and their quantities
4. **Review Results**: Get optimized recipes with cost breakdowns and virtue outcomes

### Optimization Options

- **Cheapest**: Minimize total ingredient cost
- **Fewest Ingredients**: Use the smallest number of different ingredients
- **Virtue Targets**: Specify desired outcomes (Bad, Neutral, Good) for each virtue
- **Required Ingredients**: Force certain ingredients to be included
- **Minimum Good Virtues**: Ensure at least N virtues are rated as "Good"

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Optimization**: JavaScript Linear Programming Solver
- **Build Tool**: Vite
- **Testing**: Jest
- **Icons**: Heroicons

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── display/        # Result display components
│   ├── layout/         # Layout and UI components
│   ├── ui/            # Reusable UI components
│   └── wizard/        # Multi-step wizard components
├── constants/          # App constants and constraints
├── data/              # Game data (ingredients, styles)
├── hooks/             # Custom React hooks
├── solver/            # Core optimization logic
├── types.ts           # TypeScript type definitions
└── App.tsx            # Main application component
```

## 🎯 Core Algorithm

The solver uses linear programming to optimize recipes under multiple constraints:

- **Variables**: Ingredient quantities (integer values)
- **Objective**: Minimize cost or ingredient count
- **Constraints**:
  - Maximum ingredients limit
  - Virtue range requirements
  - Required ingredient inclusion
  - Minimum good virtues threshold

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run the linter: `npm run lint`
5. Format code: `npm run format`
6. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built for the amazing game [Ale Abbey - Monastery Brewery Tycoon](https://store.steampowered.com/app/2789460/Ale_Abbey__Monastery_Brewery_Tycoon/)
- Uses the [javascript-lp-solver](https://github.com/JWally/jsLPSolver) library for optimization
- Inspired by the brewing mechanics and community discussions around the game

## 🎮 About Ale Abbey

**Ale Abbey - Monastery Brewery Tycoon** is a unique brewery management simulation where you build and expand a monastery while crafting perfect beer recipes. Experiment with different ingredients, brewing techniques, and equipment to create the ultimate holy ales. The game features deep brewing mechanics with virtues that affect your beer's quality and market value.

_Developed by Hammer & Ravens, published by Shiro Unlimited_

---

Made with ❤️ for the Ale Abbey brewing community
