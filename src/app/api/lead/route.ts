import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, whatsapp, email, service, budget, message } = body;

    // Validate required fields (Full Name and WhatsApp)
    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { error: 'Full Name is required.' },
        { status: 400 }
      );
    }

    if (!whatsapp || !whatsapp.trim()) {
      return NextResponse.json(
        { error: 'WhatsApp Number is required.' },
        { status: 400 }
      );
    }

    const webhookUrl =
      process.env.GOOGLE_SHEET_LEAD_WEBHOOK_URL ||
      process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;

    // If webhook is configured, forward lead to Google Apps Script Web App
    if (webhookUrl && webhookUrl.trim() !== '') {
      try {
        const sheetResponse = await fetch(webhookUrl.trim(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            whatsapp: whatsapp.trim(),
            email: email?.trim() || 'N/A',
            service: service?.trim() || 'General Inquiry',
            budget: budget?.trim() || 'Not specified',
            message: message?.trim() || 'No message provided',
            submittedAt: new Date().toISOString(),
          }),
        });

        if (!sheetResponse.ok) {
          console.error(
            '[Google Sheets Webhook Error] HTTP Status:',
            sheetResponse.status
          );
        }
      } catch (sheetErr) {
        console.error('[Google Sheets Forwarding Failed]:', sheetErr);
        // Log error but still acknowledge receipt so the user isn't blocked
      }
    } else {
      console.warn(
        '[Google Sheets Webhook Notice] GOOGLE_SHEET_LEAD_WEBHOOK_URL is not yet configured in .env.local. Lead received:',
        { fullName, whatsapp, email, service, budget }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry received successfully. Our team will contact you shortly.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Lead API Route Exception]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error processing inquiry.' },
      { status: 500 }
    );
  }
}
