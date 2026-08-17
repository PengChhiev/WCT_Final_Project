# Campus Lost & Found

React (Vite) + Firebase (Auth + Firestore) app. Public board of lost/found
items, student accounts to post and manage their own items, moderator
accounts that can manage everything.

## 1. Install

```bash
npm install
```

## 2. Set up Firebase

1. Go to https://console.firebase.google.com → Create a project.
2. In the project, add a **Web app** (</> icon) — it will show you a
   `firebaseConfig` object with your real keys.
3. Open `.env.local` in this project and replace the placeholder values
   with the real ones from step 2:

```
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
```

4. In the Firebase console: **Authentication → Sign-in method** → enable
   **Email/Password**.
5. In the Firebase console: **Firestore Database → Create database**
   (start in production mode).
6. Go to **Firestore Database → Rules**, delete the default rules, and
   paste the contents of `firestore.rules` (in this project root), then
   **Publish**.

## 3. Run it

```bash
npm run dev
```

## 4. Make yourself a moderator

Every account that registers through the app starts as `role: "student"`.
To test the moderator dashboard:

1. Register a normal account in the app.
2. In the Firebase console, go to **Firestore Database → users → (your uid)**.
3. Edit the `role` field from `"student"` to `"moderator"`.
4. Refresh the app — you'll now see the "Moderator Dashboard" link in the
   sidebar and can manage every item, not just your own.

## Project structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── Footer.jsx
│   ├── DashboardComponents.jsx   <-- StatCard + RecentItemsTable
│   ├── ItemForm.jsx              <-- create/edit item
│   └── ItemList.jsx              <-- table with claim/edit/delete
├── lib/
│   └── firebaseClient.js
├── pages/
│   ├── HomePage.jsx              <-- public board (/)
│   ├── ItemDetailPage.jsx        <-- (/item/:id)
│   ├── ItemsManager.jsx          <-- list/form toggle (/items)
│   ├── AdminDashboardPage.jsx    <-- moderator only (/admin)
│   ├── LoginPage.jsx             <-- includes forgot-password
│   └── RegisterPage.jsx
├── App.jsx
└── main.jsx
```

## Data model

**`users/{uid}`**: `{ email, role: "student" | "moderator", createdAt }`

**`items/{id}`**: `{ title, description, category, type: "lost"|"found",
status: "active"|"claimed", location, imageUrl, postedBy, createdAt }`

See `firestore.rules` for the access model: anyone can read items, only
signed-in users can create, and only the item's owner or a moderator can
edit/delete it.
