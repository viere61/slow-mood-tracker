const API_BASE_URL = 'http://localhost:3001/api';

export interface EmailSubscription {
  subscribed: boolean;
  dailyWindowStart?: number;
  dailyWindowEnd?: number;
}

export const emailService = {
  async registerEmail(email: string, dailyWindowStart: number, dailyWindowEnd: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/email/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          dailyWindowStart,
          dailyWindowEnd,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register email');
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error registering email:', error);
      return false;
    }
  },

  async unregisterEmail(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/email/unregister`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to unregister email');
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error unregistering email:', error);
      return false;
    }
  },

  async getSubscriptionStatus(email: string): Promise<EmailSubscription> {
    try {
      const response = await fetch(`${API_BASE_URL}/email/status/${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error('Failed to get subscription status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return { subscribed: false };
    }
  },

  async sendNotification(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/email/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  },

  async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Email server health check failed:', error);
      return false;
    }
  },
}; 