import { Stack } from "expo-router";

import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="favourite_test.db" onInit={async (db: SQLiteDatabase) => {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;

        -- Create favourite stops table
        CREATE TABLE IF NOT EXISTS favourite_stops (
          id INTEGER PRIMARY KEY NOT NULL, 
          name_mm TEXT NOT NULL, 
          name_en TEXT NOT NULL 
        );  

        -- Create favourite routes table
        CREATE TABLE IF NOT EXISTS favourite_routes (
          route_no INTEGER PRIMARY KEY NOT NULL, 
          title TEXT NOT NULL, 
          description TEXT NOT NULL 
        );
      `);
    }}>
      <Stack />
    </SQLiteProvider>
  );
}
