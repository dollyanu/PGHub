# PGHub --- Student Accommodation Platform

PGHub is a web application designed to help students explore paying
guest (PG) and hostel accommodation options. It presents property
information such as images, location, pricing, gender type, and
amenities.

## Features

-   Browse PG/hostel property listings.
-   View property details including location, price, gender type,
    images, and amenities.
-   Explore popular cities and featured properties.
-   React-based responsive user interface.
-   PHP API backend with MySQL database integration.
-   User authentication endpoints for login and related user operations.

> Note: List only the features that are implemented and working in your
> current deployment. Update this section as the project evolves.

## Tech Stack

**Frontend** - React.js - Vite - JavaScript - Tailwind CSS

**Backend** - PHP - MySQLi - REST-style API endpoints

**Database** - MySQL

## Project Structure

``` text
PG-Hub/
├── client/                 # React + Vite frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── server/                 # PHP backend
    ├── api/
    │   ├── auth/
    │   └── properties/
    ├── config/
    └── uploads/
```

## Live Demo

-   Frontend / website: https://anupama1411.infinityfree.me/
-   Previous Netlify deployment: https://anupama-pghub.netlify.app/

## Getting Started

### Prerequisites

-   Node.js and npm
-   XAMPP (or another local Apache + PHP + MySQL environment)
-   MySQL database

### 1. Clone the repository

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd PG-Hub
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your repository URL.

### 2. Set up the database

1.  Create a MySQL database for PGHub.
2.  Import your project's SQL backup into the database.
3.  Configure the database connection in `server/config/db.php`.
4.  Do not commit database passwords or other secrets to GitHub.

For local XAMPP development, the configuration commonly uses
`localhost`, the local database username, and the local database name.

### 3. Start the backend

1.  Place the project folder inside your XAMPP `htdocs` directory.
2.  Start Apache and MySQL from the XAMPP Control Panel.
3.  Ensure the PHP backend is accessible under your local server.
4.  Update the frontend API base URL in `client/src/services/api.js` to
    point to your local API, for example:

``` js
baseURL: "http://localhost/PG-Hub/server/api/"
```

### 4. Start the frontend

Open a terminal in the `client` directory and run:

``` bash
npm install
npm run dev
```

Vite will print the local development URL in the terminal, commonly
`http://localhost:5173`.

### 5. Create a production build

From the `client` directory, run:

``` bash
npm run build
```

The production-ready files will be generated in the `client/dist`
directory.

## API Endpoints

The following endpoints have been referenced in the project setup:

-   `GET /server/api/properties/getFeaturedProperties.php` --- retrieves
    featured properties.
-   `GET /server/api/properties/getPopularCities.php` --- retrieves
    popular cities.
-   `POST /server/api/auth/login.php` --- accepts login credentials as
    JSON.

Exact response formats and other endpoints depend on the current PHP
implementation.

## Security Notes

-   Never commit real database credentials, passwords, API keys, or
    private environment settings.
-   Use prepared statements for SQL queries involving user input.
-   Store passwords as secure hashes and verify them with
    `password_verify()` on login.
-   Restrict CORS to trusted frontend origins.
-   Keep production and local database configurations separate.

## Future Improvements

-   Add automated tests for API endpoints.
-   Improve error handling and loading states.
-   Document all API routes and response formats.
-   Add deployment and database backup instructions.

## Author

**Anupama Maurya**

-   GitHub: https://github.com/dollyanu
-   Live project: https://anupama1411.infinityfree.me/

------------------------------------------------------------------------

If you find an issue or have a suggestion, please open an issue in the
repository.
