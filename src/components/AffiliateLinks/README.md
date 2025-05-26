# Affiliate Links Tracking System

This system provides comprehensive tracking for affiliate link clicks with MongoDB Atlas integration.

## Features

- ✅ 16 Affiliate Links with tracking
- ✅ MongoDB Atlas cloud storage
- ✅ User click tracking
- ✅ Real-time analytics dashboard
- ✅ Top performing users identification
- ✅ Reward system integration
- ✅ Beautiful UI matching your design

## Setup Instructions

### 1. MongoDB Atlas Configuration

Your MongoDB connection string:
```mongodb+srv://trobitscommunity:<db_password>@cluster-user-track.sulb3n5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-user-track
```

Replace `<db_password>` with your actual password.

### 2. Environment Variables

Create a `.env` file in your tracking service with:
```env
MONGODB_URI=mongodb+srv://trobitscommunity:YOUR_PASSWORD@cluster-user-track.sulb3n5.mongodb.net/affiliate-tracking?retryWrites=true&w=majority&appName=Cluster-user-track
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Install Dependencies

In the tracking service folder:
```bash
cd ../trobits-affiliate-tracking
npm install uuid
npm run dev
```

### 4. Frontend Integration

The affiliate links are now available at:
- **Public Page**: `/rewards` - Shows all 16 affiliate links
- **Admin Dashboard**: `/admin/affiliate-dashboard` - Analytics and user tracking

## How It Works

### User Flow
1. User visits `/rewards` page
2. User must be logged in to click affiliate links
3. Click is tracked in MongoDB with user details
4. User is redirected to affiliate site
5. Admin can view analytics and reward top users

### Data Tracked
- User ID and details
- Affiliate link clicked
- Timestamp
- User agent, IP, referrer
- Device and browser info
- Session information

### Analytics Available
- Total clicks and unique users
- Top performing affiliates
- Click trends over time
- User activity rankings
- Reward candidates identification

## Affiliate Links Included

1. **Preply** - Language Learning
2. **Coinbase** - Crypto Exchange
3. **Stock Market Guides** - Trading Education
4. **SafeShell VPN** - VPN Service
5. **NordVPN** - Premium VPN
6. **Go** - Travel & Booking
7. **Bitcoin IRA** - Crypto Retirement
8. **PrintRendy** - Print Services
9. **Fanatics** - Sports Merchandise
10. **Wine Express** - Wine Delivery
11. **Ursime** - Digital Services
12. **Gemini** - Crypto Exchange
13. **TikTok** - Social Media
14. **Golf Partner** - Golf Equipment
15. **OKX** - Crypto Exchange
16. **Gate.io** - Crypto Exchange

## Usage

### For Users
1. Login to your account
2. Visit `/rewards` page
3. Click on any affiliate link
4. Get tracked for potential rewards

### For Admins
1. Visit `/admin/affiliate-dashboard`
2. View real-time analytics
3. Identify top performing users
4. Send rewards to active users

## API Endpoints

The tracking system provides these endpoints:
- `POST /affiliate/track-click` - Track a click
- `GET /affiliate/analytics` - Get analytics data
- `GET /affiliate/user-history/:userId` - Get user's click history
- `GET /affiliate/top-users` - Get top performing users
- `POST /affiliate/update-rewards` - Update user rewards

## Database Schema

### AffiliateClick Collection
```javascript
{
  userId: String,
  affiliateId: String,
  affiliateName: String,
  affiliateUrl: String,
  userAgent: String,
  ipAddress: String,
  referrer: String,
  timestamp: Date,
  sessionId: String,
  clickId: String (unique),
  conversionTracked: Boolean,
  conversionValue: Number,
  userEmail: String,
  userName: String,
  country: String,
  device: String,
  browser: String
}
```

## Next Steps

1. Set up your MongoDB password
2. Start the tracking service
3. Test the affiliate links
4. Monitor the dashboard
5. Set up reward distribution system

## Support

For any issues with the tracking system, check:
1. MongoDB connection
2. Environment variables
3. CORS settings
4. API endpoints
5. Frontend integration 