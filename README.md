# Study Quiz Generator

A React app that takes a topic or pasted notes, sends it to Gemini, and turns
the response into an interactive multiple-choice quiz. The AI
returns structured JSON that the app parses into a real quiz UI, with a
retest-wrong-answers flow, session persistence, and dark mode.

## Demo video

Video Link- https://drive.google.com/file/d/1fzyOOzHWUkF0zwjB7OqH1T5KLtPb_z9G/view?usp=sharing

## What it does

- Type or paste a topic/notes into the form
- The app asks Gemini for exactly 5 multiple choice questions as structured JSON
- Take the quiz one question at a time (mouse or keyboard: press 1-4 to
  select an option, Enter to move to the next question)
- See a results screen with your score and which answers were right/wrong
- Retest just the questions you got wrong
- Progress is saved to the browser automatically — refreshing the page
  won't lose your quiz
- Toggle dark mode any time

## Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node + Express, acting as a proxy so the Gemini API key never
  reaches the browser
- **AI:** Google Gemini (gemini-flash-lite-latest)

## Setup

### Server

```
cd server
npm install
```

Create a `.env` file inside `server/` with:

```
GEMINI_API_KEY=your_key_here
PORT=5000
```

Then run:

```
npm start
```

The server should print `Server running on port 5000`.

### Client

In a separate terminal:

```
cd client
npm install
npm start
```

Open the localhost URL it prints (usually `http://localhost:5173`).

**Both the server and client need to be running at the same time.**

## Usage

1. Type a topic or paste your notes into the text box (e.g. "Photosynthesis" or a full paragraph of notes)
2. Click "Generate Quiz" and wait a few seconds
3. Answer each question — click an option or press 1-4 on your keyboard, then click Next or press Enter
4. After the last question, see your score and a breakdown of right/wrong answers
5. Click "Retest wrong questions" to only redo the ones you missed, or "New Quiz" to start over
6. Use the toggle in the top-right corner to switch dark mode on or off

## AI usage note

I used an AI assistant to help scaffold the initial Express server structure,
design the Gemini prompt/JSON schema, and think through some of the trickier
edge cases — particularly the stale-response race condition and validating
that Gemini's output actually matched the shape I expected before trusting it.

Most of the actual debugging along the way was hands-on:fixing a hook-ordering bug where
some state ended up outside the component function. I also made the core
product calls myself — going quiz-only instead of building a forced flashcard
view, and picking gemini-flash-lite-latest after hitting rate limits on the
default model.

I understand the full flow end to end and can walk through or modify any
part of it.

## Known limitations

- Fixed at exactly 5 multiple-choice questions per quiz — not currently configurable
- Session is saved per-browser via localStorage, not synced across devices
  or accounts
- No backend persistence — clearing browser data loses saved progress
- Occasionally Gemini's API returns a temporary 503 (high demand) error;
  the app surfaces this as a retryable error rather than auto-retrying

## Time spent

~8 hours total, roughly:

- 1h — project scaffold, server setup, Tailwind config
- 1.5h — Gemini API integration, prompt/schema design, testing responses
- 2h — client UI: input form, quiz-taking view, results and retest flow
- 1.5h — error handling: response validation, stale-response guard, retry flow
- 1h — dark mode, keyboard navigation, localStorage session persistence
- 1h — Bug fixes, README, and recording the demo


