import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EventBoothsRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    select: { id: true },
  });

  if (event) {
    redirect(`/booths/${event.id}`);
  }

  redirect(`/booths/${slug}`);
}
