# Ticket_Place_Management

This repository is an exam project for WEB3 about an application that handles tickets and places for an event.

# Installation of Tapakila Dependencies (NEXT.JS / REACT.JS / EXPRESS)

## Steps with React for the Admin Role

**Admin** aim to have an administrator controls on the app.
To ensure the **Admin** interface located in the `/dashboard` folder works correctly, follow the steps below to install the necessary dependencies.
It is built with **React.js** and **Vite** for fast development.

1. Navigate to the `/dashboard` folder:
   ```bash
   cd dashboard
   ```
2. Install the dependencies, including the latest compatible version of Vite in `/dashboard`
   ```bash
   npm install vite@latest
   ```
3. In `/dashboard`, run:

```bash
   npm run dev
```

## Steps with Next for the User Role

**User** is mainly the interface for app user in order to separate user for admin Page
To ensure the User user interface located in the `/user` folder works correctly, follow the steps below to install the necessary dependencies.

It is built with Next.js for server-side rendering and better performance.

1. Navigate to the `/user` folder :

   ```bash
   cd user
   ```

   ```bash
   npx create-next-app@latest
   ```

2. In `/user` directory, run :

```bash
   npm run dev
```

## Steps with Node/Express for the Backend

1. Install the dependencies, including the latest compatible version of Nodemon in `/backend`directory to run in live server mode:

   ```bash
   npm install nodemon
   ```

   ```bash
   npm run devstart
   ```

   without nodemon

   ```bash
   node app.js
   ```

## Why Use Nodemon?

Nodemon automatically restarts the server whenever changes are made to the code, making development faster and more efficient.
It is especially useful during backend development to avoid manually stopping and restarting the server.

## Next step for the database with PostgreSQL, Tailwind CSS for the styles and Zustand for state management library for Admin

This section will guide you through setting up the PostgreSQL database for the project.

## To secure access to the **Admin** and **User** roles, implement authentication using :

- **JWT (JSON Web Tokens):**
