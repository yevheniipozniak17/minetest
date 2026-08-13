import { NextResponse } from 'next/server';
import { fetchBlogArticleImage } from '@/lib/server/blog';

// Публічний проксі бінарника картинки статті блогу.
//
// Бекенд віддає картинки лише під Basic auth (401 без нього), тому тягнути їх
// напряму з браузера ми не можемо. Ходимо серверно, а браузеру віддаємо байти
// з довгим immutable-кешем: контент статті може змінюватися, але зображення
// прив'язане до slug'а, і при заміні контентник дає нову статтю з іншим slug'ом.
//
// next/image під капотом сам оптимізує/ресайзить те, що приходить з цього URL,
// і кешує оптимізовані версії у себе. Ми ж рятуємо бекенд від навантаження.

export const runtime = 'nodejs';
// Роут кешується Next-ом, ключем є slug. Оскільки картинки immutable за slug'ом,
// маємо велике вікно ревалідації — 24 години (86400 сек).
// ВАЖЛИВО: Next вимагає числовий літерал у сегмент-конфігах, не вираз.
export const revalidate = 86400;

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const safeSlug = decodeURIComponent(slug);

  try {
    const image = await fetchBlogArticleImage(safeSlug);
    if (!image) {
      return NextResponse.json({ detail: 'Image not found' }, { status: 404 });
    }
    return new NextResponse(image.buffer, {
      status: 200,
      headers: {
        'Content-Type': image.contentType,
        // Довгий публічний кеш: браузери, CDN і next/image кешують агресивно.
        // Якщо картинку колись зміняться — робимо ?v=<hash> на клієнті.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ detail: 'Failed to load image' }, { status: 502 });
  }
}
