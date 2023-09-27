
## Project Overview

The Natours App API is a Node.js application that provides a RESTful API for managing tours and users. It includes features for user authentication, tour management, and various endpoints for interacting with tour data.

## Prerequisites

Before running the project, ensure you have the following prerequisites:

- Node.js installed
- MongoDB installed and running
- NPM packages installed (you can install them using `npm install`)

## Getting Started

To run the project locally, follow these steps:

1. Clone the project repository: `git clone <repository-url>`
2. Change into the project directory: `cd natours-app-api`
3. Install dependencies: `npm install`
4. Start the server: `npm start`

## API Endpoints

### Tours

- `GET /api/v1/tours`: Get a list of all tours.
- `GET /api/v1/tours/:id`: Get details of a specific tour.
- `POST /api/v1/tours`: Create a new tour (authentication required).
- `PATCH /api/v1/tours/:id`: Update a tour (authentication required).
- `DELETE /api/v1/tours/:id`: Delete a tour (authentication required).

### Users

- `POST /api/v1/users/signup`: Sign up as a new user.
- `POST /api/v1/users/login`: Log in with an existing user account.
- `POST /api/v1/users/forgetPassword`: Request a password reset token.
- `POST /api/v1/users/resetPassword`: Reset the user's password.
- `PATCH /api/v1/users/updatePassword`: Update the user's password (authentication required).
- `GET /api/v1/users`: Get a list of all users (authentication required).
- `POST /api/v1/users`: Create a new user (authentication required).
- `GET /api/v1/users/:id`: Get details of a specific user (authentication required).
- `PATCH /api/v1/users/:id`: Update a user (authentication required).
- `DELETE /api/v1/users/:id`: Delete a user (authentication required).

## Authentication and Authorization

- Authentication is required for creating, updating, and deleting tours and users.
- Authorization is enforced to ensure only authorized users can perform certain actions (e.g., admin or lead-guide roles).

## Folder Structure

- `controllers/`: Contains controller functions for handling requests.
- `models/`: Defines the data models for tours and users.
- `routes/`: Defines API routes and their corresponding handlers.
- `utils/`: Contains utility functions, error handling, and middleware.
- `app.js`: Main application file with middleware setup and route handling.


