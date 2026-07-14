import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireSession } from '../../../lib/requireSession';

export async function GET() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const customers = await prisma.customer.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { name: 'asc' }
  });
  return NextResponse.json(customers);
}

export async function POST(req) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const customer = await prisma.customer.create({
    data: { ...body, companyId: session.user.companyId }
  });
  return NextResponse.json(customer);
}
