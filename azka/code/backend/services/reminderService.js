import cron from 'node-cron';
import JobApplication from '../models/JobApplication.js';

// Check for due reminders every hour
export const startReminderService = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Checking for due follow-up reminders...');
    
    try {
      const now = new Date();
      
      // Find all applications with reminders due
      const dueReminders = await JobApplication.find({
        'followUpReminder.enabled': true,
        'followUpReminder.date': { $lte: now },
        'followUpReminder.notified': false
      }).populate('user', 'email name');

      for (const job of dueReminders) {
        // In a production app, you would send email/push notifications here
        console.log(`Reminder due: ${job.company} - ${job.position} for user ${job.user.email}`);
        
        // Mark as notified
        job.followUpReminder.notified = true;
        await job.save();
      }

      if (dueReminders.length > 0) {
        console.log(`Processed ${dueReminders.length} reminders`);
      }
    } catch (error) {
      console.error('Error processing reminders:', error);
    }
  });

  console.log('Reminder service started');
};
