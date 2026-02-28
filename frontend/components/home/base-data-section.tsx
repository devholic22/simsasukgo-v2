import type { Trip, UserPreference } from '@simsasukgo/shared';
import type { HomePageLabels } from '../../lib/home/constants';

type BaseDataSectionProps = {
  labels: Pick<
    HomePageLabels,
    | 'baseDataTitle'
    | 'currentUserPrefix'
    | 'initializeButton'
    | 'tripTitle'
    | 'preferenceTitle'
    | 'emptyValue'
    | 'guestUser'
  >;
  userId: string | null;
  trip: Trip | null;
  preference: UserPreference | null;
  loading: boolean;
  isAuthed: boolean;
  onInitialize: () => void;
};

function stringifyOrEmpty(value: Trip | UserPreference | null, emptyValue: string): string {
  if (value == null) {
    return emptyValue;
  }

  return JSON.stringify(value, null, 2);
}

export function BaseDataSection(props: BaseDataSectionProps) {
  const { labels, userId, trip, preference, loading, isAuthed, onInitialize } = props;

  return (
    <section className='space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
      <h2 className='text-sm font-semibold text-slate-700'>{labels.baseDataTitle}</h2>
      <p className='text-xs text-slate-500'>
        {labels.currentUserPrefix} {userId ?? labels.guestUser}
      </p>
      <button
        className='w-full rounded-lg bg-brand-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60'
        onClick={onInitialize}
        disabled={loading || !isAuthed}
        type='button'
      >
        {labels.initializeButton}
      </button>

      <div className='rounded-lg bg-slate-50 p-3 text-xs text-slate-700'>
        <p className='mb-1 font-semibold'>{labels.tripTitle}</p>
        <pre className='whitespace-pre-wrap break-words'>
          {stringifyOrEmpty(trip, labels.emptyValue)}
        </pre>
      </div>

      <div className='rounded-lg bg-slate-50 p-3 text-xs text-slate-700'>
        <p className='mb-1 font-semibold'>{labels.preferenceTitle}</p>
        <pre className='whitespace-pre-wrap break-words'>
          {stringifyOrEmpty(preference, labels.emptyValue)}
        </pre>
      </div>
    </section>
  );
}
