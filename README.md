![Math Problem Generator interface](math%20generator%20image.png)

  ## Features
  - Grade-aware curriculum covering arithmetic through calculus, plus focused Money and Clock problem generators.
  - Smart difficulty mixes that balance easy, medium, and hard questions and progressively toughen the quiz.
  - Step-by-step support with contextual hints, dynamic feedback, and optional visual aids (number lines, triangles, coin layouts, and more).
  - Rich UI theming with 20+ palettes, rounded controls, and animated feedback banners.
  - End-of-quiz dashboard that scores points, tracks first-try solves, and recommends subjects to revisit.

  ## Requirements
  - Python 3.8+ (tested with the standard CPython build).
  - Tkinter (included with most desktop Python installations).
  - Optional: Pillow (`pip install pillow`) for crisper icon rendering and GIF support; the app falls back gracefully if it is missing.

  ## Getting Started
  1. Ensure the dependencies above are available on your system.
  2. From this directory, launch the app:
     ```bash
     python3 math-problem-generator.py

  3. A desktop window titled “Math Practice” will open with the start screen.

  ## Using the App

  - Pick a theme, grade, and focus mode (General, single subject, or Money/Clock drills). When applicable, choose specific subjects.
  - Configure a difficulty mix and number of questions, then press Start Practice. The generator builds a question bank tuned to your selections.
  - Answer each prompt in the input field and press Enter. Immediate feedback shows points earned, progress dots change color, and hints unlock after incorrect attempts.
  - Use Give Up to reveal the answer and proceed. Certain topics render supporting visuals in the explanation panel.
  - When the set finishes, the results screen summarizes points, accuracy, first-try streaks, and suggests topics worth another round.

  ## Tips

  - Clock problems accept 24-hour times (HH:MM) and can be answered with AM/PM suffixes.
  - Money questions expect answers in cents; the hints panel reminds you of coin values.
  - Keyboard shortcuts: Enter submits answers, g gives up, and the arrow icons become animated on correct streaks.
