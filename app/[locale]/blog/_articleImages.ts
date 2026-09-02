// ЗГЕНЕРОВАНО scripts/sync-article-images.mjs — не редагувати вручну.
//
// Слаги статей, для яких у public/blog/articles лежить картинка. Адаптер
// звіряється з цим списком, щоб не віддавати <Image> шлях до неіснуючого
// файлу: доки бекенд і наш репозиторій розʼїжджаються за складом статей,
// без такої перевірки на карточках зʼявляються биті плейсхолдери.

export const ARTICLE_IMAGE_SLUGS: ReadonlySet<string> = new Set([
  'how-craft-boat-minecraft',
  'how-craft-bricks-minecraft',
  'how-do-i-make-anvil-minecraft',
  'how-do-i-make-bed-minecraft',
  'how-do-i-make-book-minecraft',
  'how-do-i-make-door-minecraft',
  'how-do-i-make-furnace-minecraft',
  'how-do-i-make-lead-minecraft',
  'how-do-i-make-saddle-minecraft',
  'how-do-i-put-mods-minecraft',
  'how-do-i-tame-cat-minecraft',
  'how-do-i-tame-horse-minecraft',
  'how-do-you-get-command-block-minecraft',
  'how-do-you-make-armor-stand-minecraft',
  'how-do-you-make-fence-minecraft',
  'how-do-you-make-paper-minecraft',
  'how-do-you-make-potion-minecraft',
  'how-make-ladder-minecraft',
  'how-make-map-minecraft',
  'how-make-minecraft-server',
  'how-make-torch-minecraft',
]);
