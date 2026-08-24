# Quiz App

A modern, interactive Quiz Application built with Next.js 16, React 19, and Tailwind CSS. The app features level-based quizzes, a leaderboard, and Supabase integration.

## Features

- **Interactive Quizzes**: Take quizzes with varying levels of difficulty.
- **Level Selection**: Choose your difficulty level before starting.
- **Real-time Leaderboard**: See how you stack up against others (powered by Supabase).
- **Results & Feedback**: Get instant feedback and view your final results.
- **Document Parsing**: Built-in support for processing Word documents (`docx` & `mammoth` integration).
- **Modern UI**: Styled with Tailwind CSS v4 for a responsive and sleek design.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: [React](https://react.dev/) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Database / Backend**: [Supabase](https://supabase.com/) & local database (`leaderboard.db`)
- **Document Processing**: `docx`, `mammoth`

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd quiz-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Configure your environment variables in `.env.local` (e.g., Supabase keys).
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *(Note: You can run the `supabase-setup.sql` script in your Supabase project to initialize the required tables).*

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the application running.

## Project Structure

- `/src/app`: Contains all Next.js App Router pages (`/quiz`, `/level`, `/results`, `/leaderboard`, etc.).
- `/src/components`: Reusable React components.
- `/src/context`: React Context providers for global state management.
- `/src/api`: Next.js API routes.
- `/src/lib`: Utility functions and database client configurations.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## License

This project is open-source and available under the MIT License.
