# WalletApp - Personal Finance Management

A full-stack web application for managing personal finances with transaction tracking, statistics, and user authentication.

![Wallet App](./frontend/public/logo.svg)

## 🌐 Live Demo

**🚀 [Try the Live App](https://wallet-app-project.netlify.app)**

- **Frontend**: Deployed on Netlify
- **Backend**: Deployed on Heroku
- **Demo Account**: Click "Try Demo" or use `demo@example.com` / `password123`

---

## 🚀 Features

- **User Authentication** with JWT tokens and refresh token system
- **Transaction Management** - Add, edit, and categorize income/expenses
- **Interactive Charts** - Visualize spending patterns with Recharts
- **Live Currency Exchange** - Real-time EUR and GBP exchange rates
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Real-time Balance** - Track your account balance
- **Monthly/Yearly Statistics** - Analyze your financial data
- **Demo Mode** - Try the app without registration

## 🛠️ Tech Stack

### Frontend
- **React** 18+ with Create React App
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Formik + Yup** for form handling
- **Recharts** for data visualization
- **Axios** for API calls
- **OpenExchangeRates API** for currency data
- **CSS Modules** for styling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication with refresh tokens
- **bcrypt** for password hashing
- **Swagger** for API documentation
- **CORS** enabled
- **Token blacklisting** for security

## 📁 Project Structure

```
WalletApp-react-node/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── ...
│   └── public/
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/WalletApp-react-node.git
   cd WalletApp-react-node
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create `.env` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   PORT=3001
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   
   Create `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_OPEN_EXCHANGE_API_KEY=your_openexchangerates_api_key
   ```

   **Get your OpenExchangeRates API key:**
   - Sign up at [https://openexchangerates.org/](https://openexchangerates.org/)
   - Free tier provides 1,000 requests/month
   - Copy your API key to the `.env` file

### 🏃‍♂️ Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:3001

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   App runs on http://localhost:3000

3. **Seed Demo Data (Optional)**
   ```bash
   cd backend
   npm run seed-demo
   ```

## 📚 API Documentation

Visit http://localhost:3001/api-docs for Swagger API documentation when the backend is running.

## 🔐 Authentication

The app uses JWT tokens with refresh token rotation:
- **Access tokens**: Short-lived (1 hour)
- **Refresh tokens**: Long-lived (7 days)
- **Token blacklisting**: For secure logout
- **Automatic token refresh**: Seamless user experience

## 🎨 Demo Account

Try the app with the demo account:
- Click "Try Demo" on the login page
- Or use: `demo@example.com` / `password123`

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1279px  
- Desktop: ≥ 1280px

## 🚀 Deployment

### Live Deployment
- **Frontend**: [View live app](https://wallet-app-project.netlify.app)
- **Backend API**: [View backend API](https://wallet-project-app-195afaf0a0a1.herokuapp.com/)
- **API Documentation**: [View API documentation](https://wallet-project-app-195afaf0a0a1.herokuapp.com/api-docs/)

### Deploy Your Own Instance

#### Backend (Heroku)
```bash
cd backend
git init
heroku create your-app-name
git add .
git commit -m "Deploy backend"
git push heroku main
```

Set environment variables on Heroku:
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set REFRESH_TOKEN_SECRET=your_refresh_secret
heroku config:set REFRESH_TOKEN_SECRET=your_refresh_token_secret
heroku config:set SWAGGER_SERVER_URL=https://your-heroku-app-name.herokuapp.com
```

#### Frontend (Netlify)
1. Build the project:
   ```bash
   cd frontend
   npm run build
   ```
2. Drag the `build` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Or connect your GitHub repository for automatic deployments

Set environment variables in Netlify:
- `REACT_APP_API_URL=https://your-heroku-app-name.herokuapp.com`
- `REACT_APP_OPEN_EXCHANGE_API_KEY=your_api_key`

## 🧪 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed-demo` - Seed database with demo data

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Author

Hanna Kaczyńska - [hanna.kaczynska.dev@gmail.com](mailto:hanna.kaczynska.dev@gmail.com)

Project Link: [Source code](https://github.com/hannakaczynska/wallet-app-fullstack)
