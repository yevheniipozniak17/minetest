// ЗГЕНЕРОВАНО scripts/sync-article-images.mjs — не редагувати вручну.
//
// Слаги статей, для яких у public/blog/articles лежить картинка. Адаптер
// звіряється з цим списком, щоб не віддавати <Image> шлях до неіснуючого
// файлу: доки бекенд і наш репозиторій розʼїжджаються за складом статей,
// без такої перевірки на карточках зʼявляються биті плейсхолдери.

export const ARTICLE_IMAGE_SLUGS: ReadonlySet<string> = new Set([
  'how-craft-bricks-minecraft',
  'how-do-i-make-anvil-minecraft',
  'how-do-i-make-book-minecraft',
  'how-do-i-make-saddle-minecraft',
  'how-do-you-make-fence-minecraft',
]);
