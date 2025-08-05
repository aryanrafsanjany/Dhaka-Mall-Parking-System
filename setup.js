const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Dhaka Mall Parking System...\n');

// Create .env file for backend
const envContent = `# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/dhaka-mall-parking

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=2h

# Server Configuration
PORT=5000

# Environment
NODE_ENV=development
`;

try {
  fs.writeFileSync(path.join(__dirname, 'backend', '.env'), envContent);
  console.log('✅ Created backend/.env file');
} catch (error) {
  console.log('⚠️  Could not create .env file. Please create it manually.');
}

console.log('\n📋 Setup Instructions:');
console.log('1. Install backend dependencies: cd backend && npm install');
console.log('2. Install frontend dependencies: cd frontend && npm install');
console.log('3. Start MongoDB service');
console.log('4. Start backend: cd backend && npm run dev');
console.log('5. Start frontend: cd frontend && npm start');
console.log('\n🎉 Setup complete! Follow the instructions above to run the application.'); 