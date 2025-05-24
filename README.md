# MarketFit Node.js Server

A Node.js server application for MarketFit.

## Features

- Express.js REST API
- MongoDB integration with Mongoose
- JWT Authentication
- Role-based authorization
- Environment configuration
- Error handling
- Logging

## Project Structure

```
marketfit_server_node/
├── config/             # Application configuration
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── .env                # Environment variables (create this file)
├── .gitignore          # Git ignore file
├── index.js            # Application entry point
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd marketfit_server_node
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/marketfit
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   ```

### Running the Server

#### Development mode (with nodemon)
```
npm run dev
```

#### Production mode
```
npm start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - API health check

## License

ISC
