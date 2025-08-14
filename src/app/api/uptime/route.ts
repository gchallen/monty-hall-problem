import { NextResponse } from 'next/server'

const serverStartTime = Date.now()

export async function GET() {
  const uptimeMs = Date.now() - serverStartTime
  
  return NextResponse.json({
    uptimeMs,
    startTime: serverStartTime
  })
}