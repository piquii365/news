# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

---

Additional notes for this workspace

- The mobile app has been bootstrapped to mirror the web site's pages. New screens were added under `app/`:
   - `index.tsx` (Home), `culture.tsx`, `politics.tsx`, `memes.tsx`, `boxed.tsx`, `reviews.tsx`, `sports.tsx`.
- A simple `PostCard` UI component lives at `components/ui/post-card.tsx`.
- A small API helper was added at `services/api.ts` for future network calls to `http://localhost:3500/api`.

How to continue

- Replace the static sample data in the new screens with calls to `services/api.ts`.
- Add authentication endpoints to the backend; then implement login/register screens and store the JWT cookie.
- Optionally add bottom-tabs layout under `app/(tabs)` to match the web navigation.

If you want I can wire the real endpoints, implement post detail and comments screens, and add an authentication flow next.
