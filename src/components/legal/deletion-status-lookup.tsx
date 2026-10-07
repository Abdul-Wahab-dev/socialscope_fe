'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApiQuery } from '@/lib/query';
import { CheckCircle2, Clock, SearchCheck, XCircle } from 'lucide-react';
import { getDeletionStatus } from '@/services/social.service';
import { formatDate } from '@/lib/utils';
import { Button, Input } from '@/components/ui';

const CODE_RE = /^[A-Za-z0-9_-]{6,40}$/;

export function DeletionStatusLookup() {
  const initial = useSearchParams().get('code') ?? '';
  const [draft, setDraft] = useState(initial);
  const [code, setCode] = useState(CODE_RE.test(initial) ? initial : '');
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Arriving from a deletion link (?code=…): bring the result into view
  useEffect(() => {
    if (initial) boxRef.current?.scrollIntoView({ block: 'center' });
  }, [initial]);

  const status = useApiQuery({ queryKey: ['deletion-status', code], queryFn: () => getDeletionStatus(code), enabled: Boolean(code), retry: 0 });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = draft.trim();
    if (!CODE_RE.test(v)) return setError('Enter the confirmation code you received (letters and numbers).');
    setError(null);
    setCode(v);
  };

  return (
    <div ref={boxRef} className="not-prose mt-5 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-zinc-200/70">
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row" noValidate>
        <Input aria-label="Confirmation code" placeholder="Confirmation code, e.g. EHQGKK2REGKU" value={draft} onChange={(e) => setDraft(e.target.value)} invalid={!!error} maxLength={40} />
        <Button type="submit" variant="dark" loading={status.isFetching}>
          <SearchCheck className="h-4 w-4" /> Check status
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {code && status.isError && (
        <p className="mt-4 flex items-center gap-2 text-sm text-red-700">
          <XCircle className="h-4 w-4" /> {status.error.message}
        </p>
      )}
      {status.data && (
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200/70">
          {status.data.status === 'received' ? <Clock className="mt-0.5 h-5 w-5 text-amber-500" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />}
          <div className="text-sm text-zinc-700">
            <p className="font-semibold text-zinc-950">
              {status.data.status === 'received' ? 'Request received, in progress' : status.data.status === 'completed' ? 'Data deleted' : 'Completed: no data was stored for this account'}
            </p>
            <p>
              Code {status.data.confirmationCode} · requested {formatDate(status.data.requestedAt, { dateStyle: 'medium', timeStyle: 'short' })}
              {status.data.completedAt && ` · completed ${formatDate(status.data.completedAt, { dateStyle: 'medium', timeStyle: 'short' })}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
