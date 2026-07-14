import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireSession } from '../../../lib/requireSession';

export async function GET() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const products = await prisma.product.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { name: 'asc' }
  });
  return NextResponse.json(products);
}

export async function POST(req) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const product = await prisma.product.create({
    data: {
      companyId: session.user.companyId,
      name: body.name,
      hsn: body.hsn || null,
      rate: Number(body.rate) || 0,
      gstRate: Number(body.gstRate) || 0,
      unit: body.unit || 'Nos'
    }
  });
  return NextResponse.json(product);
}
