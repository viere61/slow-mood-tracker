const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// In-memory storage for email subscriptions (in production, use a database)
let emailSubscriptions = [];

// Track which emails have been notified today to avoid duplicates
let notifiedToday = new Set();

// Helper function to get today's logging window for a user
function getTodayLoggingWindow(startHour, endHour) {
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('-').join('');
  const num = parseInt(seed, 10);
  const range = endHour - startHour;
  const randomIndex = num % range;
  const randomHour = startHour + randomIndex;
  return {
    start: randomHour,
    end: randomHour + 1
  };
}

// Helper function to check if current time is within a logging window
function isInLoggingWindow(startHour, endHour) {
  const now = new Date();
  const currentHour = now.getHours();
  const todayWindow = getTodayLoggingWindow(startHour, endHour);
  return currentHour >= todayWindow.start && currentHour < todayWindow.end;
}

// Helper function to get today's date string for tracking notifications
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

// Function to send notification email
async function sendNotificationEmail(email, dailyWindowStart, dailyWindowEnd) {
  const todayWindow = getTodayLoggingWindow(dailyWindowStart, dailyWindowEnd);
  const startTime = new Date();
  startTime.setHours(todayWindow.start, 0, 0, 0);
  const endTime = new Date();
  endTime.setHours(todayWindow.end, 0, 0, 0);

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: '🌙 Time to Reflect - Your Mood Logging Window is Open',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3B82F6; margin: 0;">Slow Sonic</h1>
          <p style="color: #6B7280; margin: 5px 0;">Mood Tracker</p>
        </div>
        
        <div style="background-color: #F8FAFC; padding: 30px; border-radius: 12px; text-align: center;">
          <h2 style="color: #1F2937; margin-bottom: 20px;">Time to Reflect</h2>
          <p style="color: #4B5563; line-height: 1.6; margin-bottom: 25px;">
            Your daily mood logging window is now open. Take a moment to pause, 
            reflect on how you're feeling, and choose a song that captures your mood.
          </p>
          
          <div style="background-color: #DBEAFE; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="color: #1E40AF; margin: 0; font-weight: 500;">
              "The slow technology approach invites us to pause, reflect, and find meaning 
              in the spaces between our digital interactions."
            </p>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
            This invitation is open until ${endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}. 
            If you miss it, there's always tomorrow.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
          <p style="color: #9CA3AF; font-size: 12px;">
            Slow Sonic Mood Tracker - A mindful approach to emotional reflection
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Notification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending email to ${email}:`, error);
    return false;
  }
}

// Function to check and send notifications for all active subscriptions
async function checkAndSendNotifications() {
  const today = getTodayString();
  
  // Reset notifications for new day
  if (notifiedToday.size > 0) {
    const firstNotification = Array.from(notifiedToday)[0];
    if (!firstNotification.startsWith(today)) {
      notifiedToday.clear();
      console.log('🔄 New day - resetting notification tracking');
    }
  }

  for (const subscription of emailSubscriptions) {
    if (!subscription.active) continue;

    const { email, dailyWindowStart, dailyWindowEnd } = subscription;
    const notificationKey = `${today}:${email}`;

    // Check if we already notified this user today
    if (notifiedToday.has(notificationKey)) continue;

    // Check if current time is within their logging window
    if (isInLoggingWindow(dailyWindowStart, dailyWindowEnd)) {
      console.log(`📧 Sending notification to ${email} - window is open`);
      const success = await sendNotificationEmail(email, dailyWindowStart, dailyWindowEnd);
      if (success) {
        notifiedToday.add(notificationKey);
      }
    }
  }
}

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD // Gmail App Password (not your regular password)
  }
});

// Start the notification checker (runs every minute)
setInterval(checkAndSendNotifications, 60000); // Check every minute

// Also check immediately when server starts
setTimeout(checkAndSendNotifications, 5000); // Check after 5 seconds

// Routes

// Register email for notifications
app.post('/api/email/register', (req, res) => {
  const { email, dailyWindowStart, dailyWindowEnd } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  // Check if email already exists
  const existingIndex = emailSubscriptions.findIndex(sub => sub.email === email);
  
  if (existingIndex >= 0) {
    // Update existing subscription
    emailSubscriptions[existingIndex] = {
      email,
      dailyWindowStart: dailyWindowStart || 9,
      dailyWindowEnd: dailyWindowEnd || 21,
      active: true,
      createdAt: new Date()
    };
  } else {
    // Add new subscription
    emailSubscriptions.push({
      email,
      dailyWindowStart: dailyWindowStart || 9,
      dailyWindowEnd: dailyWindowEnd || 21,
      active: true,
      createdAt: new Date()
    });
  }

  console.log(`📝 Email registered: ${email} (${dailyWindowStart}:00-${dailyWindowEnd}:00)`);

  res.json({ 
    success: true, 
    message: 'Email registered successfully for notifications' 
  });
});

// Unregister email from notifications
app.post('/api/email/unregister', (req, res) => {
  const { email } = req.body;
  
  const index = emailSubscriptions.findIndex(sub => sub.email === email);
  if (index >= 0) {
    emailSubscriptions[index].active = false;
    res.json({ success: true, message: 'Email unregistered successfully' });
  } else {
    res.status(404).json({ error: 'Email not found' });
  }
});

// Send notification email (called when logging window opens)
app.post('/api/email/notify', async (req, res) => {
  const { email } = req.body;
  
  const subscription = emailSubscriptions.find(sub => sub.email === email && sub.active);
  if (!subscription) {
    return res.status(404).json({ error: 'Email not registered for notifications' });
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: '🌙 Time to Reflect - Your Mood Logging Window is Open',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3B82F6; margin: 0;">Slow Sonic</h1>
          <p style="color: #6B7280; margin: 5px 0;">Mood Tracker</p>
        </div>
        
        <div style="background-color: #F8FAFC; padding: 30px; border-radius: 12px; text-align: center;">
          <h2 style="color: #1F2937; margin-bottom: 20px;">Time to Reflect</h2>
          <p style="color: #4B5563; line-height: 1.6; margin-bottom: 25px;">
            Your daily mood logging window is now open. Take a moment to pause, 
            reflect on how you're feeling, and choose a song that captures your mood.
          </p>
          
          <div style="background-color: #DBEAFE; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="color: #1E40AF; margin: 0; font-weight: 500;">
              "The slow technology approach invites us to pause, reflect, and find meaning 
              in the spaces between our digital interactions."
            </p>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
            This invitation is open for one hour. If you miss it, there's always tomorrow.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
          <p style="color: #9CA3AF; font-size: 12px;">
            Slow Sonic Mood Tracker - A mindful approach to emotional reflection
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Notification email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send notification email' });
  }
});

// Get subscription status
app.get('/api/email/status/:email', (req, res) => {
  const { email } = req.params;
  const subscription = emailSubscriptions.find(sub => sub.email === email);
  
  if (subscription) {
    res.json({ 
      subscribed: subscription.active,
      dailyWindowStart: subscription.dailyWindowStart,
      dailyWindowEnd: subscription.dailyWindowEnd
    });
  } else {
    res.json({ subscribed: false });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Email notification service is running' });
});

// Manual test endpoint - send notification immediately
app.post('/api/email/test', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const subscription = emailSubscriptions.find(sub => sub.email === email && sub.active);
  if (!subscription) {
    return res.status(404).json({ error: 'Email not registered for notifications' });
  }

  console.log(`🧪 Manual test - sending notification to ${email}`);
  const success = await sendNotificationEmail(email, subscription.dailyWindowStart, subscription.dailyWindowEnd);
  
  if (success) {
    res.json({ success: true, message: 'Test notification sent successfully' });
  } else {
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

// Debug endpoint - show current subscriptions and notification status
app.get('/api/email/debug', (req, res) => {
  const now = new Date();
  const currentHour = now.getHours();
  
  const debugInfo = emailSubscriptions.map(sub => {
    const todayWindow = getTodayLoggingWindow(sub.dailyWindowStart, sub.dailyWindowEnd);
    const isWindowOpen = isInLoggingWindow(sub.dailyWindowStart, sub.dailyWindowEnd);
    const today = getTodayString();
    const notificationKey = `${today}:${sub.email}`;
    const alreadyNotified = notifiedToday.has(notificationKey);
    
    return {
      email: sub.email,
      active: sub.active,
      dailyWindow: `${sub.dailyWindowStart}:00-${sub.dailyWindowEnd}:00`,
      todayWindow: `${todayWindow.start}:00-${todayWindow.end}:00`,
      currentHour,
      isWindowOpen,
      alreadyNotified,
      createdAt: sub.createdAt
    };
  });
  
  res.json({
    currentTime: now.toISOString(),
    currentHour,
    subscriptions: debugInfo,
    totalSubscriptions: emailSubscriptions.length,
    activeSubscriptions: emailSubscriptions.filter(s => s.active).length,
    notifiedToday: Array.from(notifiedToday)
  });
});

app.listen(PORT, () => {
  console.log(`Email notification server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 