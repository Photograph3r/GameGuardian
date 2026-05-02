# Game Guardian 🛡️ — Milestone 4 Complete

Parental monitoring app built specifically for Roblox. React Native + Expo.

## Milestone 4 — Final Release (May 2026)
- Firebase Authentication with real user accounts
- Roblox OAuth 2.0 PKCE flow
- 3-step child setup wizard (real parent data on dashboard)
- Multiple children support with profile switching
- Swipe to resolve alerts (usability finding addressed)
- 22 passing unit tests (PatternService)
- Custom themed alert dialogs across all screens
- Dark mode and high contrast accessibility mode
- Live landing page: photograph3r.github.io/GameGuardian
- Beta testing program launched: forms.gle/uXYcwKd2a7yHP7y8A
- Randomized demo data per session for beta testers

## Milestone 3 (Apr 27)
- Pattern detection algorithm (6 behavioral checks, risk scoring)
- Analytics dashboard with Safety Risk Score
- Clickable group reviews with recommended actions
- Dark mode and high contrast mode (ThemeContext)
- Functional Screen Time Limits, Game Blocklist, Quiet Hours
- 12 alert types including purchase attempts and chat flagging
- Usability testing completed (2 think-aloud sessions)

## Milestone 2 (Apr 20)
- Firebase Authentication replacing mock auth
- 3-screen onboarding walkthrough
- Alert filtering by severity and sort toggle
- Login/Signup with session persistence
- React Context for global auth state

## Milestone 1 (Apr 14)
- Complete navigation system
- Dashboard with activity summary and charts
- Alert system with severity levels
- Activity tracking (games, friends, groups)
- Settings with monitoring toggles
- API service layer with AsyncStorage persistence

## Tech Stack
- Framework: React Native + Expo SDK 54
- Language: TypeScript
- Auth: Firebase Authentication + Roblox OAuth 2.0
- Database: Firestore
- Navigation: React Navigation (Stack + Bottom Tabs)
- State: React Context + AsyncStorage
- Tests: Jest + ts-jest (22 passing)
- Platform: Android (iOS compatible)

## Installation
```bash
git clone https://github.com/Photograph3r/GameGuardian.git
cd GameGuardian
npm install
npx expo start
```

## Project Structure
GameGuardian/
├── src/
│   ├── screens/          All app screens
│   ├── services/         ApiService, AuthService, StorageService,
│   │                     FirebaseService, PatternService, RobloxAuthService
│   ├── components/       CustomAlert, SharedStates
│   ├── context/          ThemeContext
│   ├── data/             Mock data (randomized per session)
│   ├── types/            TypeScript interfaces
│   └── tests/        PatternService unit tests (22 passing)
├── docs/                 Landing page (GitHub Pages)
├── App.tsx               Navigation + app state machine
└── README.md

## Links
- Landing page: https://photograph3r.github.io/GameGuardian
- Beta signup: https://forms.gle/uXYcwKd2a7yHP7y8A
- Trello: https://trello.com/b/jM7NIq9s/gameguardian-pp4-roadmap

## 🎓 Full Sail University
Course: Project & Portfolio 4 (PP4)
Student: Shinayd Pollard Joseph
Instructor: Robert Martinez
Term: C202604

## License
MIT License — Educational project for Full Sail University