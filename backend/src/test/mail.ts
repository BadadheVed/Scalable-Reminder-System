import { transporter } from "../services/transporter";

export async function SendMail(
  email: string,
  name: string
): Promise<{ success: boolean; message: string }> {
  try {
    // const name = "helo";
    if (!email) {
      return { success: false, message: "Please provide a recipient email" };
    }

    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Session Reminder</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300;">Quiet Hours</h1>
          <p style="color: #e8ecf3; margin: 8px 0 0 0; font-size: 16px;">Session Reminder</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          
          <!-- Alert Banner -->
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 30px; text-align: center;">
            <div style="color: #856404; font-size: 18px; font-weight: 600; margin-bottom: 5px;">⏰ Session Starting Soon!</div>
            <div style="color: #856404; font-size: 14px;">Only 10 minutes remaining</div>
          </div>

          <!-- Main Message -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 15px; font-weight: 500;">
              Hi there! 👋
            </h2>
            <p style="color: #555555; font-size: 16px; margin-bottom: 20px;">
              This is a friendly reminder that your session
            </p>
            
            <!-- Session Name Highlight -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 15px 25px; border-radius: 25px; display: inline-block; font-size: 18px; font-weight: 600; margin-bottom: 20px;">
              "${name}"
            </div>
            
            <p style="color: #555555; font-size: 16px; margin-bottom: 25px;">
              is scheduled to begin in <strong style="color: #e74c3c;">10 minutes</strong>.
            </p>
            
            <p style="color: #555555; font-size: 16px;">
              Please be ready and ensure you're in a quiet environment for the best experience.
            </p>
          </div>

          <!-- Preparation Tips -->
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; text-align: center;">Quick Preparation Tips</h3>
            <ul style="color: #555555; padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 8px;">Find a quiet, comfortable space</li>
              <li style="margin-bottom: 8px;">Turn off notifications on your devices</li>
              <li style="margin-bottom: 8px;">Have water nearby to stay hydrated</li>
              <li>Take a few deep breaths to center yourself</li>
            </ul>
          </div>

          <!-- Call to Action -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #27ae60; color: #ffffff; padding: 12px 30px; border-radius: 25px; display: inline-block; font-size: 16px; font-weight: 600; text-decoration: none;">
              ✨ Get Ready for Your Session ✨
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #2c3e50; padding: 25px 30px; text-align: center;">
          <p style="color: #bdc3c7; margin: 0; font-size: 14px;">
            Thank you for choosing Quiet Hours
          </p>
          <p style="color: #95a5a6; margin: 10px 0 0 0; font-size: 12px;">
            Wishing you a peaceful and productive session 🧘‍♀️
          </p>
        </div>

      </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: `"Quiet Hours" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `🔔 Reminder: "${name}" starts in 10 minutes`,
      text: `Hi! Your session "${name}" is scheduled to begin in 10 minutes. Please be ready and ensure you're in a quiet environment. Thank you for choosing Quiet Hours!`,
      html: htmlTemplate,
    });

    return { success: true, message: "Reminder email sent successfully" };
  } catch (error: any) {
    console.error("Email error:", error);
    return { success: false, message: error.message || "Failed to send email" };
  }
}
