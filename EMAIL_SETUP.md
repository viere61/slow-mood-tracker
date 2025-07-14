# Email Notification Setup Guide

This guide will help you set up email notifications for your Slow Sonic Mood Tracker.

## Prerequisites

1. A Gmail account
2. Node.js installed on your system
3. The backend server running

## Step 1: Set up Gmail App Password

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to "Security" → "2-Step Verification" (enable if not already enabled)
3. Go to "Security" → "App passwords"
4. Select "Mail" as the app and "Other" as the device
5. Generate the app password and copy it

## Step 2: Configure Environment Variables

1. Navigate to the `backend` folder
2. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```
3. Edit the `.env` file with your Gmail credentials:
   ```
   GMAIL_USER=your.email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password-here
   PORT=3001
   ```

## Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 4: Start the Backend Server

```bash
npm start
```

The server should start on port 3001. You should see:
```
Email notification server running on port 3001
Health check: http://localhost:3001/api/health
```

## Step 5: Test the Setup

1. Open your browser and go to: http://localhost:3001/api/health
2. You should see: `{"status":"OK","message":"Email notification service is running"}`

## Step 6: Configure Email Notifications in the App

1. Start your frontend app: `npm run dev`
2. Go to Settings
3. Enter your email address
4. Enable email notifications
5. Save your settings

## How It Works

- The app will send you an email notification when your daily logging window opens
- The notification window is randomly selected within your specified daily window
- Emails are sent using Gmail's SMTP service
- All email subscriptions are stored in memory (for production, consider using a database)

## Troubleshooting

### Server won't start
- Check that port 3001 is not in use
- Verify your `.env` file exists and has correct credentials
- Make sure all dependencies are installed

### Email sending fails
- Verify your Gmail app password is correct
- Check that 2-Step Verification is enabled
- Ensure your Gmail account allows "less secure app access" or use app passwords

### Frontend can't connect to backend
- Make sure the backend server is running on port 3001
- Check that CORS is properly configured
- Verify the API_BASE_URL in `src/utils/emailService.ts` matches your backend URL

## Security Notes

- Never commit your `.env` file to version control
- Use app passwords instead of your regular Gmail password
- Consider using environment variables in production
- The current setup stores email subscriptions in memory - for production use, implement a proper database

## Production Considerations

For production deployment:
1. Use a proper email service (SendGrid, AWS SES, etc.)
2. Implement a database for email subscriptions
3. Add rate limiting for email sending
4. Use environment variables for all sensitive data
5. Implement proper error handling and logging
6. Add email verification before sending notifications 