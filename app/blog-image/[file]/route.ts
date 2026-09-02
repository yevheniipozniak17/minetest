import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

// Ілюстрації статей лежать поза репозиторієм і поза білдом. Причина: Next
// фіксує вміст public/ на етапі збірки, тому підкладений туди файл він не
// віддасть без перезбірки (перевірено — 404). Цей хендлер читає диск на кожен
// запит, тож стаття, опублікована в CMS, отримує картинку без деплою.
//
// Каталог задається BLOG_IMAGE_DIR (на сервері — /var/lib/blog-images).
// Файли названі по слагу статті: розкладає їх scripts/upload-blog-images.mjs.
export const dynamic = 'force-dynamic';

const IMAGE_DIR =
  process.env.BLOG_IMAGE_DIR ?? path.join(process.cwd(), 'public', 'blog', 'articles');

const FALLBACK_FILE = path.join(process.cwd(), 'public', 'blog', '1.webp');

// Імʼя файлу приходить з URL, тому пускаємо лише слаг із розширенням: без
// точок усередині, слешів і виходу на батьківський каталог.
const ALLOWED_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*\.webp$/;

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;

  if (!ALLOWED_NAME.test(file)) {
    return new NextResponse('Bad image name', { status: 400 });
  }

  const image = await readFile(path.join(IMAGE_DIR, file)).catch(() => null);

  if (image) {
    return new NextResponse(image, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Blog-Image': 'hit',
      },
    });
  }

  const fallback = await readFile(FALLBACK_FILE).catch(() => null);

  if (!fallback) {
    return new NextResponse('Image not found', { status: 404 });
  }

  return new NextResponse(fallback, {
    headers: {
      'Content-Type': 'image/webp',
      // Заглушка тимчасова — справжню картинку можуть залити будь-якої
      // хвилини. Довгий кеш застрягнув би і в браузерах, і в кеші
      // оптимізатора зображень, тому тримаємо його коротким.
      'Cache-Control': 'public, max-age=60, must-revalidate',
      'X-Blog-Image': 'fallback',
    },
  });
}
