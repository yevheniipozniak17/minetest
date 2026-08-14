'use client';

import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { readHasStoredAccount } from '@/lib/client/storedAccount';
import { getDashboardPlayHref, getOpenStoreHref } from '@/lib/data/servers';

type AuthAwareLinkProps = {
  isAuthed: boolean;
  intent: 'play' | 'store';
  className?: string;
  children: React.ReactNode;
};

function resolveHref(intent: AuthAwareLinkProps['intent'], isAuthed: boolean, hasAccount: boolean) {
  return intent === 'play'
    ? getDashboardPlayHref(isAuthed, hasAccount)
    : getOpenStoreHref(isAuthed, hasAccount);
}

export default function AuthAwareLink({
  isAuthed,
  intent,
  className,
  children,
}: AuthAwareLinkProps) {
  const [href, setHref] = useState(() => resolveHref(intent, isAuthed, false));

  useEffect(() => {
    setHref(resolveHref(intent, isAuthed, readHasStoredAccount()));
  }, [isAuthed, intent]);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
