import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET all motorcycle parts
export async function GET(req: Request) {
  try {
    const { data, error } = await supabase.from('motorcycle_parts').select('*')
    if (error) throw error
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST a new motorcycle part
export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body.name || !body.price) {
      return NextResponse.json({ error: 'Missing name or price' }, { status: 400 })
    }

    const { data, error } = await supabase.from('motorcycle_parts').insert([body])
    if (error) throw error

    return NextResponse.json({ message: 'Part added!', data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
