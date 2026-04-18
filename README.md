GameGuardian 🛡️ - Parental Monitoring for Roblox



A React Native mobile application that helps parents monitor their children's Roblox gaming activity with real-time alerts, pattern detection, and parental controls.



&#x20;Project Status



\*\*Milestone 2 — Functionally Complete\*\*

Authentication, onboarding, alert filtering, and full app flow integrated.



Features



Authentication \& Onboarding

\- Login/Signup with email and password validation

\- Session persistence via AsyncStorage (stay logged in across restarts)

\- 3-screen swipeable onboarding walkthrough (first-time users only)

\- Logout with confirmation dialog

\- React Context for global auth state management



Dashboard

\- Time-of-day greeting (Good Morning/Afternoon/Evening)

\- Child monitoring card with Roblox username

\- Weekly stats (total playtime, new friends)

\- Daily activity bar chart

\- High priority alert banner

\- Pull-to-refresh

\- Last sync timestamp

\- Quick access navigation



Alerts

\- Color-coded severity (High/Medium/Low)

\- Filter by severity (All, High, Medium, Low)

\- Sort toggle (Newest/Oldest)

\- Mark-as-read persistence via AsyncStorage

\- Alert detail with type-specific recommendations

\- Resolve and Remind Me Later actions



Activity

\- Functional tabs: Games, Friends, Groups

\- Game cards with genre tags and age ratings (13+ flagged)

\- Friend list with NEW/FRIEND badges

\- Group safety: risky groups flagged with keyword detection



Settings \& Parental Controls

\- Child profile information

\- Monitoring toggles (persist across sessions)

\- Parental Controls: Screen Time Limits, Game Blocklist, Quiet Hours

\- Privacy \& Safety notice

\- Log Out button



Architecture

\- API service layer (ApiService.ts) — abstracts all data access for easy Roblox API swap

\- Storage service (StorageService.ts) — typed AsyncStorage wrapper

\- Auth service (AuthService.ts) — mock auth ready for Firebase/OAuth integration

\- Reusable Loading, Error, and Empty state components

\- App state machine: Onboarding → Login → Splash → Dashboard



Tech Stack



\- \*\*Framework:\*\* React Native 0.81.5

\- \*\*Build System:\*\* Expo SDK 54

\- \*\*Navigation:\*\* React Navigation (Stack + Bottom Tabs)

\- \*\*Language:\*\* TypeScript

\- \*\*State:\*\* React Context + AsyncStorage

\- \*\*Platform:\*\* Android (iOS compatible)



Installation



```bash

Clone repository

git clone https://github.com/Photograph3r/GameGuardian.git

cd GameGuardian



Install dependencies

npm install



Run on Android emulator

npx expo start --android

```



&#x20;Demo Credentials



\- \*\*Email:\*\* demo@gameguardian.com

\- \*\*Password:\*\* demo1234



Project Structure



GameGuardian/

├── src/

│   ├── screens/           All app screens (9 total)

│   ├── services/          API, Auth, and Storage services

│   ├── components/        Reusable UI components

│   ├── data/              Mock data

│   └── types/             TypeScript interfaces

├── App.tsx                Navigation + auth state machine

├── package.json           Dependencies

└── README.md



UX Design



Nielsen's 10 Usability Heuristics applied throughout:

\- Visibility of system status (loading states, sync indicators)

\- Error prevention (form validation, confirmation dialogs)

\- Consistency (unified styling across all screens)

\- Recognition over recall (tab counts, severity badges)



Competitor analysis: Bark, Qustodio, Google Family Link



🎓 Full Sail University



\*\*Course:\*\* Project \& Portfolio 4 (PP4)

\*\*Student:\*\* Shinayd Pollard Joseph

\*\*Instructor:\*\* Robert Martinez



Roadmap



Milestone 3 (Apr 27)

\- Dark mode with Theme Context

\- Pattern detection algorithm

\- UI/UX polish pass

\- Usability testing (2 think-aloud sessions)



Milestone 4 (May 3)

\- Unit and component tests

\- End-to-end testing

\- Usability findings addressed

\- Final polish



&#x20;Future

\- Roblox OAuth 2.0 integration

\- Firebase push notifications

\- Multi-child profile support

\- Email digest reports

\- Analytics dashboard



&#x20;License



MIT License - Educational project for Full Sail University

