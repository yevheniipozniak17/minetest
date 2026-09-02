#!/usr/bin/env bash
#
# Деплой/оновлення додатка на сервері (Hetzner VPS).
# Запускати НА СЕРВЕРІ з кореня проєкту:  ./deploy.sh
#
# Робить: git pull -> npm install -> npm run build -> pm2 reload
# Налаштування первинного оточення — див. DEPLOY.md
#
set -euo pipefail

# З GitHub Actions скрипт запускається по SSH без TTY. Без цієї змінної git на
# 401 від GitHub намагається спитати логін, не може відкрити /dev/tty і падає з
# незрозумілим "could not read Username: No such device or address".
export GIT_TERMINAL_PROMPT=0

APP_NAME="minecraftsgame"
BRANCH="${DEPLOY_BRANCH:-main}"

# Перейти в каталог скрипта (корінь проєкту), де б його не викликали
cd "$(dirname "$0")"

echo "==> [1/4] Забираю свіжий код (origin/$BRANCH)..."
if ! git fetch origin "$BRANCH"; then
  echo "" >&2
  echo "git fetch не пройшов. Поточний origin:" >&2
  git remote get-url origin >&2 || echo "  origin не налаштований" >&2
  echo "" >&2
  echo "Репозиторій публічний, анонімний fetch по HTTPS працює без кредів. Якщо" >&2
  echo "GitHub усе одно просить авторизацію — origin вказує не на нього:" >&2
  echo "старий/перейменований шлях, інший репозиторій або вшитий у URL username." >&2
  echo "Виправити:  git remote set-url origin <правильний-url>" >&2
  echo "УВАГА: спершу звір remote -v — підміна URL на інший репозиторій призведе" >&2
  echo "до того, що git reset --hard нижче затре сервер чужою історією." >&2
  exit 1
fi
# Жорстко вирівнюємо до remote. УВАГА: локальні зміни на сервері будуть стерті.
git reset --hard "origin/$BRANCH"

echo "==> [2/4] Встановлюю залежності (npm install)..."
# npm install (а не npm ci): package-lock.json згенеровано на Windows і не містить
# Linux-специфічних optional-залежностей (напр. @emnapi/core), через що npm ci падає.
npm install --no-audit --no-fund

echo "==> [3/4] Збираю продакшн-білд..."
npm run build

echo "==> [4/4] Перезапускаю через pm2..."
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 reload "$APP_NAME" --update-env
else
  pm2 start npm --name "$APP_NAME" -- start
  pm2 save
fi

echo ""
echo "==> Готово. Стан:"
pm2 status "$APP_NAME"
