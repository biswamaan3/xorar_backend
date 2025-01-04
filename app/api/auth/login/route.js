import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma'; 
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET; 
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid email or password.' }),
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid email or password.' }),
        { status: 401 }
      );
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Login successful.',
        data: { token, user: { id: user.id, email: user.email, name: user.name } },
      }),
      { status: 200 }
    );
  } catch (error) {
    if (error.name === 'ZodError') {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid input.', errors: error.errors }),
        { status: 400 }
      );
    }

    console.error('Login Error:', error); 
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error.' }),
      { status: 500 }
    );
  }
}
