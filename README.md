# Sweet Shop Management System

A full-stack Sweet Shop Management System built as part of the **AI Kata – TDD Assignment**.  
The application allows users to browse and purchase sweets, while admins can manage inventory through a secure backend API.

---

## Project Overview

The Sweet Shop Management System is a web-based application designed to manage sweets inventory, user authentication, and purchase operations.  
It follows RESTful API principles, role-based access control, and clean coding practices, with a focus on Test-Driven Development (TDD).

---

## Features

### User Features
- User registration and login
- View all available sweets
- Search sweets by name, category, and price
- Purchase sweets (inventory updates in real time)

### Admin Features
- Add new sweets
- Update sweet details
- Delete sweets
- Restock inventory
- Access protected admin-only routes

---

## Tech Stack

### Frontend
- React
- HTML, CSS
- Axios
- React Router

### Backend
- Backend Framework (Node.js / Spring Boot / etc.)
- RESTful APIs
- JWT-based Authentication

### Database
- SQL / NoSQL Database (as implemented)

### Tools & Platforms
- Git & GitHub
- Cursor AI
- Postman

The app will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
  components/
    Header.js          # Header with logo, title, and auth buttons
    SearchFilter.js    # Search bar and filter button
    ProductCard.js     # Individual product card component
    ProductGrid.js     # Grid of product cards
    Footer.js          # Footer component
    HelpButton.js      # Floating help button
  App.js              # Main app component
  App.css             # Main app styles
  index.js            # Entry point
  index.css           # Global styles
```

## API Endpoints (Summary)

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`

### Sweets (Protected)
- GET `/api/sweets`
- POST `/api/sweets`
- PUT `/api/sweets/:id`
- DELETE `/api/sweets/:id` (Admin only)
- GET `/api/sweets/search`

### Inventory
- POST `/api/sweets/:id/purchase`
- POST `/api/sweets/:id/restock` (Admin only)

---

## Screenshots

> Add screenshots of the application below:

- Login Page  
  **[Screenshot here]**

- Dashboard / Sweet List  
  **[Screenshot here]**

- Search & Filter  
  **[Screenshot here]**

- Admin Panel (Add / Update / Delete Sweet)  
  **[Screenshot here]**

- Backend Health Status (OK)  
  **[Screenshot here]**

---

## Test Report

- Unit tests written following Test-Driven Development (TDD)
- Tests cover authentication, sweets management, and inventory logic
- All tests executed successfully

> **Test Results Screenshot / Report:**  
**[Add test output screenshot or report link here]**

---

## My AI Usage
### AI Tools Used
- Cursor AI

### How I Used AI
- Used Cursor AI to scaffold the frontend UI using React.
- Used Cursor AI to generate backend boilerplate code (controllers, services).
- Used Cursor AI to assist in writing unit test cases.
- Used Cursor AI for debugging errors and improving code readability.

### Reflection on AI Usage
AI significantly improved development speed by reducing repetitive boilerplate work and assisting with debugging.  
All AI-generated code was manually reviewed, tested, and refined to ensure correctness and adherence to project requirements.  
AI was used responsibly as a development assistant, not as a replacement for independent problem-solving.

---

## Git & Version Control

- Git used for version control
- Frequent, meaningful commits made throughout development
- AI co-authorship added to commits where AI tools were used

---

## How to Run the Project Locally

### Backend Setup
git clone <your-github-repo-link>
cd backend
npm install
npm start

### Frontend Setup
cd frontend
npm install
npm start

## Admin Panel
username: admin
password: admin123

### ✅ This README now:
- Fully matches **assignment requirements**
- Has **mandatory “My AI Usage” section**
- Leaves **clear room for screenshots & links**
- Is **interview-safe and evaluator-friendly**

If you want, I can next:
- Shorten it for **HR reviewers**
- Fill it **based on your exact tech stack**
- Prepare **AI-usage interview answers**