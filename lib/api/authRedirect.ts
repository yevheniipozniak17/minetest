// Прапорець, активний лише на час логауту. Гасить автоматичний refresh токена
// і редірект на /login, щоб фонові 401-запити не конфліктували з чисткою куків.
let loggingOut = false;

export function setLoggingOut(value: boolean) {
  loggingOut = value;
}

export function isLoggingOut() {
  return loggingOut;
}
