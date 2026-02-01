GameGuardian - Parental Monitoring for Roblox

A React Native mobile application that helps parents monitor their children's Roblox gaming activity with real-time alerts and pattern detection.

Project Status
Assignment 8 - Proof of Concept  
Foundation complete, ready for PP4 full development.

 Features Built (Assignment 5 R&D)
- Complete navigation system (6 screens)
- Dashboard with activity summary
- Alert system with severity levels
- Activity tracking (games, friends, groups)
- Settings with monitoring toggles
- Animated splash screen
- TypeScript type safety
- Mock data architecture

Tech Stack
- Framework: React Native 0.83.1
- Build System: Expo SDK
- Navigation: React Navigation (Stack + Bottom Tabs)
- Language: TypeScript
- Platform: Android (iOS compatible)

Installation

bash
Clone repository
git clone https://github.com/Photograph3r/GameGuardian.git
cd GameGuardian

Install dependencies
npm install

Run on Android emulator
npx expo start --android


Project Structure


GameGuardian/
├── src/
│   ├── screens/          # All app screens
│   ├── data/            # Mock data
│   └── types/           # TypeScript interfaces
├── App.tsx              # Navigation setup
├── package.json         # Dependencies
└── README.md


🎓 Full Sail University
Course: SDV4116-O Wearable Computing  
Student: Shinayd Pollard Joseph  
Instructor: Robert Martinez  
Term: C202601 Section 01

Next Steps (PP4)
1. Integrate Roblox OAuth API
2. Replace mock data with real API calls
3. Add Firebase push notifications
4. Implement data persistence
5. Build authentication system
6. Add multi-child support
7. Create automated tests
8. Deploy to app stores

MIT License
Educational project for Full Sail University
