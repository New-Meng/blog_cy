import { NextResponse } from 'next/server'

export async function GET() {
    const data = "{msg: 200}"

    return NextResponse.json({ data })
}