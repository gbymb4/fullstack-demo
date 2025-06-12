import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET - Fetch users with optional filtering
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nameFilter = searchParams.get('name');
    const emailFilter = searchParams.get('email');

    // Build the where clause for filtering
    const where: any = {};
    if (nameFilter) {
      where.name = {
        contains: nameFilter,
        mode: 'insensitive', // Case-insensitive search
      };
    }
    if (emailFilter) {
      where.email = {
        contains: emailFilter,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: {
        id: 'desc', // Most recent first (assuming auto-incrementing ID)
      },
    });

    return NextResponse.json({ 
      status: 'ok', 
      data: users 
    });
  } catch (error: any) {
    console.error('GET users error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch users', 
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Create a new user
export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    
    if (!name || !email) {
      return NextResponse.json({ 
        error: 'Name and email are required.' 
      }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: { 
        name: name.trim(), 
        email: email.trim().toLowerCase() 
      },
    });

    return NextResponse.json({ 
      success: true, 
      user 
    });
  } catch (error: any) {
    console.error('POST user error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Email already exists.' 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create user', 
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE - Delete a user by ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        error: 'User ID is required.' 
      }, { status: 400 });
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ 
        error: 'Invalid user ID.' 
      }, { status: 400 });
    }

    // Check if user exists before attempting to delete
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ 
        error: 'User not found.' 
      }, { status: 404 });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ 
      status: 'ok', 
      message: 'User deleted successfully',
      deletedUser: existingUser
    });
  } catch (error: any) {
    console.error('DELETE user error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        error: 'User not found.' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to delete user', 
      details: error.message 
    }, { status: 500 });
  }
}