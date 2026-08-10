# Cart: знятий payment UI (архів для повернення)

Новий чекаут-UI прибраний зі сторінки `/dashboard/cart` на прохання ПМ.
`app/dashboard/_sections/Cart/Cart.tsx` зараз **байт-у-байт** такий, як до коміту
`0886321 add payment UI` (тобто як у `7be11e9`). Перевірено: `git diff 0886321~1 -- app/dashboard/_sections/Cart/Cart.tsx` порожній.

## Найшвидший спосіб повернути все

```bash
git show 0886321:app/dashboard/_sections/Cart/Cart.tsx > app/dashboard/_sections/Cart/Cart.tsx
```

Це вертає одразу всі чотири елементи нижче. Нижче — те саме вручну, якщо треба
повернути щось окремо.

## Що прибрано

| # | Елемент | CSS-клас | Що показував |
| --- | --- | --- | --- |
| 1 | Панель способу оплати | `.panel .panelPayment` | PAYMENT METHOD: CARD, OPEN BANKING, VOLT, PAYID, INTERAC, BLIK |
| 2 | Панель даних клієнта | `.panel .panelClientInfo` | CLIENT INFO: first/last name, email, phone, address, city, zip |
| 3 | Стрічка іконок оплати | `.paymentStrip` | Рядок логотипів платіжок під Order Summary |
| 4 | Модалка чекауту | — | `CheckoutModal` після кліку PROCEED TO PAY |

Зараз PROCEED TO PAY знову веде **прямо** на оплату: `attemptPay()` викликає
`handlePay()`, платіж створюється й користувача редіректить на платіжку — як було
до payment UI.

Компоненти на диску **не видалені** й повністю робочі, просто ніхто їх не
імпортує: `CheckoutModal/`, `ClientInfoForm/`, `PaymentMethods/`,
`paymentMethods.ts`, `CheckoutModal/clientInfo.ts`.

CSS-класи в `Cart.module.css` (`.panelPayment`, `.paymentHint`, `.panelClientInfo`,
`.clientInfoHint`, `.panelClientInfoHighlight`, `.paymentStrip`, `.paymentStripIcon`)
і ключі перекладів **навмисно залишені** — без JSX вони нічого не рендерять, зате
повернення не вимагатиме правок у стилях і локалях. Перевірено, що ці 68 рядків
CSS не переоприділяють жодного існуючого правила, тож на розміри й відступи
поточної сторінки не впливають.

---

## 1. Панель способу оплати

Місце вставки: у `<div className={styles.mainPrimary}>`, **після** секції
`panelDelivery` (`aria-labelledby="delivery-heading"`).

```tsx
<section
  className={`${styles.panel} ${styles.panelPayment}`}
  aria-labelledby="payment-heading"
>
  <div className={styles.panelHead}>
    <h2 id="payment-heading" className={styles.panelTitle}>
      {t('paymentTitle')}
    </h2>
  </div>
  <p className={styles.paymentHint}>{t('paymentHint')}</p>
  <PaymentMethods value={paymentMethod} onChange={setPaymentMethod} variant="inline" />
</section>
```

## 2. Панель даних клієнта

Місце вставки: там же, одразу після панелі способу оплати — остання секція
всередині `mainPrimary`.

```tsx
<section
  ref={clientInfoRef}
  className={`${styles.panel} ${styles.panelClientInfo} ${clientInfoErrors.length > 0 ? styles.panelClientInfoHighlight : ''}`}
  aria-labelledby="client-info-heading"
>
  <div className={styles.panelHead}>
    <h2 id="client-info-heading" className={styles.panelTitle}>
      {t('clientInfoTitle')}
    </h2>
    <span className={styles.requiredBadge}>{t('requiredBadge')}</span>
  </div>
  <p className={styles.clientInfoHint}>{t('clientInfoHint')}</p>
  <ClientInfoForm
    value={clientInfo}
    onChange={setClientInfo}
    fieldErrors={clientInfoErrors}
    onClearFieldError={clearClientInfoFieldError}
    idPrefix="cart-client"
    showValidationNote
  />
</section>
```

## 3. Стрічка іконок оплати

Місце вставки: у `<div className={styles.sidebarColumn}>`, між `{summaryBlock}`
і `<p className={styles.pciNote}>`.

```tsx
<div className={styles.paymentStrip} aria-label={t('paymentTitle')}>
  {ALL_PAYMENT_ICONS.map(icon => (
    <Image
      key={icon}
      src={icon}
      alt=""
      width={56}
      height={38}
      className={styles.paymentStripIcon}
      aria-hidden
    />
  ))}
</div>
```

## 4. Модалка чекауту

Місце вставки: у кінці JSX, після блоку `{consentToast && ...}`, перед
закривальним `</div>`.

```tsx
<CheckoutModal
  isOpen={checkoutOpen}
  onClose={() => setCheckoutOpen(false)}
  onConfirm={confirmCheckout}
  paymentMethod={paymentMethod}
  onPaymentMethodChange={setPaymentMethod}
  clientInfo={clientInfo}
  onClientInfoChange={setClientInfo}
  fieldErrors={clientInfoErrors}
  onFieldErrorsChange={setClientInfoErrors}
  onClearFieldError={clearClientInfoFieldError}
  totalLabel={formatMoney(effectiveTotal, cartCurrency)}
  confirming={paying}
/>
```

---

## Обв'язка, яку треба повернути разом

### Імпорти

```tsx
import { CheckoutModal } from './CheckoutModal/CheckoutModal';
import {
  EMPTY_CLIENT_INFO,
  validateClientInfo,   // тільки для панелі №2
  type ClientInfo,
  type ClientInfoField,
} from './CheckoutModal/clientInfo';
import { ClientInfoForm } from './ClientInfoForm/ClientInfoForm';   // панель №2
import { PaymentMethods } from './PaymentMethods/PaymentMethods';   // панель №1
import {
  ALL_PAYMENT_ICONS,    // стрічка №3
  DEFAULT_PAYMENT_METHOD,
  type PaymentMethodId,
} from './paymentMethods';
```

### Стани та ref

```tsx
const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>(DEFAULT_PAYMENT_METHOD);
const [checkoutOpen, setCheckoutOpen] = useState(false);
const [clientInfo, setClientInfo] = useState<ClientInfo>(EMPTY_CLIENT_INFO);
const [clientInfoErrors, setClientInfoErrors] = useState<ClientInfoField[]>([]);
const clientInfoRef = useRef<HTMLElement>(null);   // тільки для панелі №2
```

### Префіл даних клієнта з профілю

```tsx
useEffect(() => {
  if (!profile) return;
  const username = profile.username?.trim() ?? '';
  const nameParts = username ? username.split(/\s+/) : [];
  setClientInfo(prev => ({
    ...prev,
    email: prev.email || profile.email || '',
    firstName: prev.firstName || nameParts[0] || '',
    lastName: prev.lastName || nameParts.slice(1).join(' ') || '',
  }));
}, [profile]);

const clearClientInfoFieldError = useCallback((field: ClientInfoField) => {
  setClientInfoErrors(prev => prev.filter(key => key !== field));
}, []);
```

> Цей ефект дає ESLint-помилку `react-hooks/set-state-in-effect` — вона прийшла
> разом із payment UI і зникла після його зняття. Якщо вертаєш — варто переписати
> префіл без `setState` в ефекті (напр. через `useMemo` як початкове значення).

### `attemptPay` з модалкою

Замість прямого `void handlePay()`:

```tsx
function attemptPay() {
  if (belowMinimum) return;
  if (!purchaseAgreed || !policiesAgreed) {
    nudgeConsents();
    return;
  }
  // ↓ тільки якщо повертаєш панель №2: не пускати в модалку з незаповненими полями
  const missing = validateClientInfo(clientInfo);
  if (missing.length > 0) {
    setClientInfoErrors(missing);
    clientInfoRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    return;
  }
  setClientInfoErrors([]);
  setCheckoutOpen(true);
}

function confirmCheckout() {
  void handlePay();
}
```

> Прескрин-валідацію можна вмикати **лише разом із панеллю №2**. Без панелі на
> сторінці немає де заповнити поля, тож вона блокувала б кнопку оплати без жодного
> видимого повідомлення. Саму валідацію все одно робить `CheckoutModal.handleConfirm`.

---

## Окремо: іконки Visa та Mastercard (теж відкочені)

Коміт `0886321` не лише додав нові іконки, а й **перезаписав** дві існуючі:
`public/icons/payment/Visa.svg` і `Mastercard.svg`. Вони використовуються не лише
в кошику, а й у футері (`app/_components/Footer/Footer.tsx`, `PAYMENT_ICONS`), тож
кольорові версії ламали однорідність рядка платіжок. За рішенням ПМ відкочені до
напівпрозорих — зараз усі чотири іконки футера в одному стилі.

| | Напівпрозорі (зараз) | Кольорові з `0886321` |
| --- | --- | --- |
| Розмір | 44×30 / 45×30 | 56×38 |
| Фон | `white` @ 12% + рамка @ 8% | суцільний `#FFFFFF` |
| Лоґо | білий монохром | бренд (Visa `#1434CB`, MC `#EB001B`/`#F79E1B`) |

Якщо колись знадобляться кольорові:

```bash
git show 0886321:public/icons/payment/Visa.svg > public/icons/payment/Visa.svg
git show 0886321:public/icons/payment/Mastercard.svg > public/icons/payment/Mastercard.svg
```

При поверненні стрічки №3 напівпрозорі іконки відрендеряться нормально: розмір їм
задає `.paymentStripIcon` (`height: 24px; max-width: 44px`), а не власний
`width`/`height` файлу.
