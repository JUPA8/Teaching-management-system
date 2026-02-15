import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schema matching frontend payload
const studentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  age: z.string().min(1, 'Age is required'),
});

const probestundeSchema = z.object({
  numStudents: z.number().int().min(1).max(10),
  students: z.array(studentSchema).min(1).max(10),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required').max(30),
  contactMethod: z.enum(['whatsapp', 'email', 'call']),
  teacherPreference: z.enum(['male', 'female', 'no-preference']),
  timestamp: z.string().optional(),
});

type ProbestundeRequest = z.infer<typeof probestundeSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = probestundeSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Map frontend values to Prisma enum values
    const contactMethodMap: Record<string, 'WHATSAPP' | 'EMAIL' | 'CALL'> = {
      whatsapp: 'WHATSAPP',
      email: 'EMAIL',
      call: 'CALL',
    };

    const teacherPreferenceMap: Record<string, 'MALE' | 'FEMALE' | 'NO_PREFERENCE'> = {
      male: 'MALE',
      female: 'FEMALE',
      'no-preference': 'NO_PREFERENCE',
    };

    // Save to database
    const probestundeRequest = await prisma.probestundeRequest.create({
      data: {
        numStudents: data.numStudents,
        students: data.students, // JSON field
        email: data.email,
        phone: data.phone,
        contactMethod: contactMethodMap[data.contactMethod],
        teacherPreference: teacherPreferenceMap[data.teacherPreference],
      },
    });

    // TODO: Send email notification to admin
    // await sendAdminNotification(probestundeRequest);
    
    console.log('New Probestunde Request saved:', probestundeRequest.id);

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      data: {
        id: probestundeRequest.id,
        createdAt: probestundeRequest.createdAt,
      },
    });
  } catch (error) {
    console.error('Error processing Probestunde form:', error);
    
    // Handle specific errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit form. Please try again.',
      },
      { status: 500 }
    );
  }
}
