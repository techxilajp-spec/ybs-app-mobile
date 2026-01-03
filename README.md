# Welcome to Bus Pin App

Bus Pin App is a mobile application for searching bus routes and stops, and for viewing route details on an interactive map.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up environment variables

   Create a .env.local file in the project root and add the following configuration

   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Start the app

   ```bash
   npm start
   ```

After starting the app, you can run it using:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## React Query Devtools

The React Query Devtools plugin lets you explore queries and cached data, check cache status, and refetch or remove queries from the TanStack Query cache.

### How to open the Devtools
- Press `Shift` + `M` to open the list of developer tools
- Select the React Query plugin

This will open the plugin’s web interface and display queries as they are used in your app.