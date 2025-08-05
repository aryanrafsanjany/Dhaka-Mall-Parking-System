# 🚗 Dhaka Mall Parking Management System

A comprehensive parking management system for malls in Dhaka, featuring user booking, payment processing, admin management, and feedback systems.

## ✨ Features

### 👤 User Features
- **User Registration & Login**: Secure authentication with JWT tokens
- **First-Time User Flow**: New users are guided through area selection and booking
- **Dashboard**: View current, completed, and cancelled bookings
- **Booking Management**: 
  - Create new parking bookings
  - Cancel bookings (with 10 Taka fine)
  - Complete bookings (50 Taka charge)
  - Get directions to parking location
- **Payment System**:
  - Pay with cash or points (100 points per booking)
  - View payment history
  - Real-time payment amount tracking
- **Feedback System**: Rate and comment on completed bookings (earn 10 points)
- **Auto-Cancellation**: Bookings expire after 1 hour (10 Taka fine)
- **Dark Mode**: Toggle between light and dark themes

### 👨‍💼 Admin Features
- **Dashboard**: Overview of system statistics
- **Booking Management**: View and cancel all user bookings
- **Area Management**: Add and manage parking areas
- **Location Management**: Add and manage parking locations
- **Feedback Review**: View all user feedback and ratings
- **User Management**: Monitor user activities

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React.js** with functional components and hooks
- **React Router** for navigation
- **Context API** for state management
- **CSS3** with modern styling and animations
- **Responsive Design** for mobile and desktop

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd DhakaMallParking
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
MONGO_URI=mongodb://localhost:27017/dhaka-mall-parking
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=2h
PORT=5000
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install
```

### 4. Start the Application

#### Development Mode
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm start
```

#### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd ../backend
npm start
```

## 📱 Usage Guide

### For Users

1. **Registration**: Create a new account with email and password
2. **First Login**: Select your preferred area and make your first booking
3. **Dashboard**: View all your bookings in organized sections
4. **New Booking**: Select area → Select parking location → Confirm booking
5. **Manage Bookings**: Cancel, complete, or get directions for active bookings
6. **Payment**: Pay outstanding amounts using cash or points
7. **Feedback**: Rate and comment on completed bookings to earn points

### For Admins

1. **Login**: Use admin credentials to access admin interface
2. **Dashboard**: View system overview and statistics
3. **Manage Bookings**: View all bookings and cancel if necessary
4. **Add Areas**: Create new parking areas with descriptions
5. **Add Locations**: Create new parking locations with spot counts
6. **Review Feedback**: Monitor user feedback and ratings

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/first-login-complete` - Mark first login complete

### Areas
- `GET /api/areas` - Get all areas
- `GET /api/areas/with-locations` - Get areas with parking locations
- `GET /api/areas/:areaId/locations` - Get locations by area

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `PUT /api/bookings/cancel/:bookingId` - Cancel booking
- `PUT /api/bookings/complete/:bookingId` - Complete booking
- `GET /api/bookings/all` - Get all bookings (admin)
- `PUT /api/bookings/admin-cancel/:bookingId` - Admin cancel booking

### Payment
- `POST /api/payment/process` - Process payment
- `GET /api/payment/history` - Get payment history
- `GET /api/payment/summary` - Get payment summary

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/areas` - Get all areas
- `POST /api/admin/areas` - Add new area
- `GET /api/admin/locations` - Get all locations
- `POST /api/admin/locations` - Add new location
- `PUT /api/admin/locations/:locationId` - Update location
- `DELETE /api/admin/locations/:locationId` - Delete location

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/:bookingId` - Get feedback for booking
- `GET /api/feedback/admin/all` - Get all feedback (admin)
- `GET /api/feedback/admin/stats` - Get feedback statistics (admin)

## 🗄️ Database Schema

### User
- `name`, `email`, `password`, `points`, `isAdmin`, `firstLogin`, `paymentAmount`

### Area
- `name`, `description`

### ParkingLocation
- `mallName`, `address`, `totalSpot`, `freeSpot`, `areaId`

### Booking
- `userId`, `locationId`, `bookingTime`, `status`, `paymentAmount`, `paid`, `paymentMethod`, `fineAmount`, `rating`, `comment`

### Payment
- `userId`, `bookingId`, `paymentAmount`, `paymentDate`

## 🎨 UI/UX Features

- **Modern Design**: Clean and intuitive interface
- **Responsive Layout**: Works on all device sizes
- **Dark Mode**: Toggle between light and dark themes
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Clear success confirmations
- **Interactive Elements**: Hover effects and transitions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in .env files

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Add MongoDB Atlas connection string to environment variables
# Deploy to Heroku
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)
```bash
# Build the project
npm run build

# Deploy the build folder
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support and questions, please contact the development team.

---

**Note**: This is a complete parking management system with all the features you requested. The system includes user authentication, booking management, payment processing, admin controls, and feedback systems. All the business logic for fines, points, and auto-cancellation is implemented as specified. 