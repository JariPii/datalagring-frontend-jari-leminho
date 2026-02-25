# SkillFlow – Frontend

## Overview

This is the frontend application for the SkillFlow education management system.

It provides a user interface for interacting with the SkillFlow backend API and demonstrating system functionality.

Backend repository:  
https://github.com/JariPii/datalagring-jari-leminaho

This frontend was developed as part of a Data Storage course assignment. The primary focus of the assignment was backend development.

---

## Purpose

The frontend allows users to:

- View data from the backend
- Create and manage records
- Test backend functionality

The frontend contains minimal business logic. All core logic is handled by the backend.

---

## Technologies

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

---

## Environment Variables

Create a file called:

```
.env.local
```

Add:

```
NEXT_PUBLIC_API_URL=https://localhost:7110
```

or

```
NEXT_PUBLIC_API_URL=http://localhost:5031
```

This must match the backend API URL.

---

## Running the Project

### Requirements

- Node.js 18+
- npm

---

### Clone repository

```
git clone https://github.com/JariPii/datalagring-frontend-jari-leminho.git
cd datalagring-frontend-jari-leminho
```

---

### Install dependencies

```
npm install
```

---

### Run development server

```
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Backend Dependency

The frontend requires the backend API to be running.

Start backend first:

```
dotnet run --project SkillFlow.Presentation
```

---

## Author

Jari Leminaho  
https://github.com/JariPii
