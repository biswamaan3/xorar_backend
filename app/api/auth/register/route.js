// app/api/auth/register/route.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma'; 

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; 

export async function POST(req) {
  const { name, email, password } = await req.json(); 

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ message: 'All fields are required.' }), { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists.' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET
    );

    return new Response(JSON.stringify({ message: 'User registered successfully.', token }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error.' }), { status: 500 });
  }
}
