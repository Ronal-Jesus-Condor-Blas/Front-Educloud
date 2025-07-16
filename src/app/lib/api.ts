import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, tenantId } = await request.json()
    
    // Aquí harías la llamada a tu microservicio de usuarios
    const response = await fetch(`${process.env.USER_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, tenantId }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      token: data.token,
      user: data.user
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}