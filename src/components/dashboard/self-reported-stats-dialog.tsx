"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useApiMutation } from "@/lib/query";
import { handleFormError } from "@/lib/form-errors";
import { formatPercent } from "@/lib/utils";
import { updateSelfReportedStats } from "@/services/social.service";
import type { SocialAccount } from "@/types/creator";
import {
  selfReportedStatsSchema,
  type SelfReportedStatsValues,
} from "@/validations/social.schema";
import { Alert, Button, Dialog, FormField, Input } from "@/components/ui";

interface Props {
  account: SocialAccount | null;
  onClose: () => void;
  onSaved: () => void | Promise<unknown>;
}

/** "" → undefined so optional number inputs can be left empty */
const toNumber = (v: unknown) =>
  v === "" || v === null || v === undefined ? undefined : Number(v);

const FIELDS = [
  "profileUrl",
  "followers",
  "avgViews",
  "avgLikes",
  "avgComments",
  "postsCount",
];

/**
 * Stats form for platforms whose API doesn't share profile numbers (Facebook).
 * Login already proved the creator owns the account; these numbers are shown as "Self-reported".
 */
export function SelfReportedStatsDialog({ account, onClose, onSaved }: Props) {
  return (
    <Dialog
      open={!!account}
      onClose={onClose}
      title="Your Facebook stats"
      description="Facebook doesn’t share profile stats with apps, so add them from your Professional dashboard. Brands will see them labelled “Self-reported”."
      className="max-w-xl"
    >
      {/* key: reset the form when a different account opens */}
      {account && (
        <StatsForm
          key={account.id}
          account={account}
          onClose={onClose}
          onSaved={onSaved}
        />
      )}
    </Dialog>
  );
}

function StatsForm({
  account,
  onClose,
  onSaved,
}: {
  account: SocialAccount;
  onClose: () => void;
  onSaved: Props["onSaved"];
}) {
  const hasStats = Boolean(account.statsReportedAt);
  const { register, handleSubmit, setError, control, formState } =
    useForm<SelfReportedStatsValues>({
      resolver: zodResolver(selfReportedStatsSchema),
      defaultValues: {
        profileUrl: account.profileUrl ?? "",
        followers: hasStats ? account.followers : undefined,
        avgViews: hasStats && account.avgViews ? account.avgViews : undefined,
        avgLikes: hasStats ? account.avgLikes : undefined,
        avgComments: hasStats ? account.avgComments : undefined,
        postsCount:
          hasStats && account.postsCount ? account.postsCount : undefined,
        confirm: undefined as unknown as true,
      },
    });
  const { errors } = formState;

  // Live engagement preview (same formula as the server: (reactions + comments) / followers)
  const [followers, avgLikes, avgComments] = useWatch({
    control,
    name: ["followers", "avgLikes", "avgComments"],
  });
  const engagement =
    followers > 0
      ? ((Number(avgLikes || 0) + Number(avgComments || 0)) / followers) * 100
      : null;

  const save = useApiMutation({
    mutationFn: ({ confirm: _confirm, ...values }: SelfReportedStatsValues) =>
      updateSelfReportedStats(account.id, values),
    onSuccess: async () => {
      toast.success("Facebook stats saved");
      await onSaved();
      onClose();
    },
    onError: (e) => handleFormError(e, setError, FIELDS),
  });

  const numberField = (
    name: "followers" | "avgViews" | "avgLikes" | "avgComments" | "postsCount"
  ) => register(name, { setValueAs: toNumber });

  return (
    <form
      onSubmit={handleSubmit((v) => save.mutate(v))}
      className="space-y-4"
      noValidate
    >
      <FormField
        label="Facebook profile link"
        htmlFor="fb-url"
        required
        error={errors.profileUrl?.message}
        hint="On your profile tap ⋯ → Copy profile link, or copy the address from your browser."
      >
        <Input
          id="fb-url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://www.facebook.com/yourname"
          invalid={!!errors.profileUrl}
          {...register("profileUrl")}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Followers"
          htmlFor="fb-followers"
          required
          error={errors.followers?.message}
        >
          <Input
            id="fb-followers"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            invalid={!!errors.followers}
            {...numberField("followers")}
          />
        </FormField>
        <FormField
          label="Avg views per Reel / video"
          htmlFor="fb-views"
          error={errors.avgViews?.message}
          hint="Optional"
        >
          <Input
            id="fb-views"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            invalid={!!errors.avgViews}
            {...numberField("avgViews")}
          />
        </FormField>
        <FormField
          label="Avg reactions per post"
          htmlFor="fb-likes"
          required
          error={errors.avgLikes?.message}
        >
          <Input
            id="fb-likes"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            invalid={!!errors.avgLikes}
            {...numberField("avgLikes")}
          />
        </FormField>
        <FormField
          label="Avg comments per post"
          htmlFor="fb-comments"
          required
          error={errors.avgComments?.message}
        >
          <Input
            id="fb-comments"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            invalid={!!errors.avgComments}
            {...numberField("avgComments")}
          />
        </FormField>
        <FormField
          label="Total posts"
          htmlFor="fb-posts"
          error={errors.postsCount?.message}
          hint="Optional"
        >
          <Input
            id="fb-posts"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            invalid={!!errors.postsCount}
            {...numberField("postsCount")}
          />
        </FormField>
        <div className="flex flex-col justify-center rounded-xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-200/70">
          <span className="text-xs text-zinc-500">Engagement rate</span>
          <span className="text-lg font-semibold text-zinc-950 tabular-nums">
            {engagement === null
              ? "—"
              : formatPercent(Math.min(engagement, 999.99))}
          </span>
        </div>
      </div>

      <Alert tone="info" title="Where to find these">
        Facebook → your profile → <strong>Professional dashboard</strong> →
        Insights. Use the last 28 days: divide total views, reactions and
        comments by the number of posts to get the averages.
      </Alert>

      <div>
        <label className="flex items-start gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded accent-brand-600"
            {...register("confirm")}
          />
          These numbers are accurate and come from my own Facebook profile.
        </label>
        {errors.confirm && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {errors.confirm.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={save.isPending}>
          {hasStats ? "Update stats" : "Save stats"}
        </Button>
      </div>
    </form>
  );
}
