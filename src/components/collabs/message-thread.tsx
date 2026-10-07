'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiQuery, useApiMutation, useQueryCache } from '@/lib/query';
import { Send } from 'lucide-react';
import { queryKeys } from '@/constants/query-keys';
import { handleFormError } from '@/lib/form-errors';
import { cn, formatDate } from '@/lib/utils';
import { getCollabMessages, sendCollabMessage } from '@/services/collab.service';
import type { Message } from '@/types/collab';
import { messageSchema, type MessageValues } from '@/validations/collab.schema';
import { Button, ErrorState, Skeleton, Textarea } from '@/components/ui';

export function MessageThread({ collabId, currentUserId, disabled }: { collabId: string; currentUserId: string; disabled?: boolean }) {
  const queryCache = useQueryCache();
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = useApiQuery({
    queryKey: queryKeys.collabs.messages(collabId),
    queryFn: () => getCollabMessages(collabId),
    refetchInterval: 15_000, // simple polling; swap for websockets later
  });

  const { register, handleSubmit, reset, setError, formState } = useForm<MessageValues>({ resolver: zodResolver(messageSchema), defaultValues: { body: '' } });

  const send = useApiMutation({
    mutationFn: (v: MessageValues) => sendCollabMessage(collabId, v.body),
    onSuccess: (msg) => {
      queryCache.setData<Message[]>(queryKeys.collabs.messages(collabId), (old = []) => [...old, msg]);
      queryCache.invalidate(queryKeys.collabs.all);
      reset();
    },
    onError: (e) => handleFormError(e, setError, ['body']),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // Opening the thread marks messages as read server-side
    queryCache.invalidate(queryKeys.collabs.unread);
  }, [messages.data?.length, queryCache]);

  return (
    <div className="flex flex-col">
      <div className="max-h-[420px] min-h-40 space-y-3 overflow-y-auto p-5">
        {messages.isPending ? (
          <Skeleton className="h-24" />
        ) : messages.isError ? (
          <ErrorState message={messages.error.message} onRetry={() => messages.refetch()} />
        ) : messages.data.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500">No messages yet. Say hello 👋</p>
        ) : (
          messages.data.map((m) => {
            const mine = m.senderUserId === currentUserId;
            return (
              <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                <div className={cn('max-w-[80%] rounded-2xl px-4 py-2 text-sm', mine ? 'bg-brand-600 text-white' : 'bg-zinc-100 text-zinc-900')}>
                  <p className="whitespace-pre-line">{m.body}</p>
                  <p className={cn('mt-1 text-[11px]', mine ? 'text-brand-100' : 'text-zinc-500')}>
                    {mine ? 'You' : m.sender.fullName} · {formatDate(m.createdAt, { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit((v) => send.mutate(v))} className="flex items-end gap-2 border-t border-zinc-100 p-4" noValidate>
        <div className="flex-1">
          <Textarea
            rows={2}
            placeholder={disabled ? 'Messaging is closed for this request' : 'Write a message…'}
            disabled={disabled}
            aria-label="Message"
            invalid={!!formState.errors.body}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit((v) => send.mutate(v))();
              }
            }}
            {...register('body')}
          />
          {formState.errors.body && <p className="mt-1 text-xs text-red-600">{formState.errors.body.message}</p>}
        </div>
        <Button type="submit" loading={send.isPending} disabled={disabled} aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
