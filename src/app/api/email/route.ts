import { NextRequest, NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const { name, email, project_type, description, budget } = await req.json()

  if (!name || !email || !project_type || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: `New quote request — ${project_type}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; color: #fafaf9; padding: 32px; border-radius: 8px;">
          <h2 style="color: #f59e0b; margin-bottom: 24px;">New Quote Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #a1a1aa; width: 140px;">Name</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #a1a1aa;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #f59e0b;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #a1a1aa;">Project type</td>
              <td style="padding: 8px 0;">${project_type}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #a1a1aa;">Budget</td>
              <td style="padding: 8px 0;">${budget || 'Not specified'}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #27272a;">
            <p style="color: #a1a1aa; margin-bottom: 8px;">Description</p>
            <p style="line-height: 1.6; white-space: pre-wrap;">${description}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
