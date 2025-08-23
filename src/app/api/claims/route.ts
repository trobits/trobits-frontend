import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, affiliateName, dateCompleted, city, value } = body;

        // Validate required fields
        if (!email || !affiliateName || !dateCompleted || !city || !value) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Create transporter using Gmail SMTP - FIXED: createTransport not createTransporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER || 'trobitscommunity@gmail.com',
                pass: process.env.EMAIL_PASS || 'dxow wbph klfv jkcb',
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER || 'trobitscommunity@gmail.com',
            to: 'trobitscommunity@gmail.com',
            subject: `New Claim Submission - ${affiliateName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px; border-radius: 10px;">
            <h2 style="color: #00d4ff; margin-bottom: 20px; text-align: center;">New Claim Submission</h2>
            
            <div style="background-color: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #ffffff; margin-bottom: 15px; border-bottom: 2px solid #00d4ff; padding-bottom: 5px;">Claim Details</h3>
              
              <table style="width: 100%; color: #ffffff;">
                <tr style="margin-bottom: 10px;">
                  <td style="padding: 8px 0; font-weight: bold; color: #00d4ff; width: 150px;">Email:</td>
                  <td style="padding: 8px 0;">${email}</td>
                </tr>
                <tr style="margin-bottom: 10px;">
                  <td style="padding: 8px 0; font-weight: bold; color: #00d4ff; width: 150px;">Affiliate Name:</td>
                  <td style="padding: 8px 0;">${affiliateName}</td>
                </tr>
                <tr style="margin-bottom: 10px;">
                  <td style="padding: 8px 0; font-weight: bold; color: #00d4ff; width: 150px;">Date Completed:</td>
                  <td style="padding: 8px 0;">${dateCompleted}</td>
                </tr>
                <tr style="margin-bottom: 10px;">
                  <td style="padding: 8px 0; font-weight: bold; color: #00d4ff; width: 150px;">City:</td>
                  <td style="padding: 8px 0;">${city}</td>
                </tr>
                <tr style="margin-bottom: 10px;">
                  <td style="padding: 8px 0; font-weight: bold; color: #00d4ff; width: 150px;">Value:</td>
                  <td style="padding: 8px 0; font-size: 18px; font-weight: bold; color: #00ff88;">${value}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #2a2a2a; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
              <p style="margin: 0; color: #cccccc; font-size: 14px;">
                Submitted on: ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666666; font-size: 12px;">
            <p>This email was automatically generated from the Trobits Claims system.</p>
          </div>
        </div>
      `,
            text: `
        New Claim Submission
        
        Email: ${email}
        Affiliate Name: ${affiliateName}
        Date Completed: ${dateCompleted}
        City: ${city}
        Value: ${value}
        
        Submitted on: ${new Date().toLocaleString()}
      `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: 'Claim submitted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending claim email:', error);
        return NextResponse.json(
            { error: 'Failed to submit claim' },
            { status: 500 }
        );
    }
}