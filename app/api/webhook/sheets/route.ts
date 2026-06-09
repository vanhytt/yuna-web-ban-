import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL;
    if (!webhookUrl || webhookUrl.includes('YOUR_GOOGLE_APPS_SCRIPT')) {
      return NextResponse.json(
        { error: 'Webhook URL chưa được cấu hình' },
        { status: 400 }
      );
    }

    // Gửi từ server-side (không bị CORS)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script error: ${response.status}`);
    }

    const responseData = await response.json();

    return NextResponse.json({
      status: 'success',
      message: 'Dữ liệu đã được lưu',
      data: responseData,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMsg || 'Lỗi kết nối' },
      { status: 500 }
    );
  }
}