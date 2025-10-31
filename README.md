## Task Manager - Next.js 14 Project

## Overview

Task Manager is a task and project management web application built with Next.js 14 using the new App Router architecture. It allows users to register, login, manage projects, and organize tasks securely using Firebase Authentication and Firestore. State management is handled by Redux Toolkit, and the UI is built with Material UI components for a polished user experience.

## Features

- User Authentication with Firebase Email/Password via secure Next.js API routes.
- Protected routes ensuring only authenticated users access the Dashboard.
- Dashboard showing a list of Projects, each with:
- Project Name
- Description
- List of Tasks with title, status, and optional due date
- Full CRUD operations for Tasks, supporting:
- Adding new tasks to projects
- Updating task status and details
- Deleting tasks
- Secure communication with Firebase Firestore via API routes.
- Responsive and accessible UI components built with Material UI.
- State management with Redux Toolkit.

## Tech Stack

- Next.js 14 with App Router
- React 18
- Firebase Admin SDK (server-side)
- Firebase Client SDK
- Firestore Database
- Redux Toolkit for state management
- Material UI for UI components
- Tailwind CSS for utility styling

## Project Structure

- src/app/api/ - Contains Next.js API routes in App Router style.
- src/lib/firebaseAdmin.js - Initializes Firebase Admin SDK for secure backend operations.
- src/store/ - Redux Toolkit slices and store configuration.
- src/app/ - Contains UI components and pages structured as route segments.
- Global styles and font definitions are under src/app/globals.css.

## Setup and Installation

- Clone the repository.
- Install dependencies:
- Configure Firebase:
- Create a Firebase project and enable Email/Password Authentication and Firestore.
- Generate a Firebase service account private key and configure the environment variables in .env.local:

## Notes

- API routes use Firebase Admin SDK for server-side security.
- Authentication state is managed centrally with Redux Toolkit.
- UI is fully responsive and styled with Material UI components.
- Firestore data layout uses collections for projects and nested sub-collections for tasks.


