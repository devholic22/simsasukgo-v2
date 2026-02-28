import type { HomePageLabels } from '../../lib/home/constants';

type BackendProbeSectionProps = {
  labels: Pick<HomePageLabels, 'backendProbeTitle' | 'backendProbeButton'>;
  loading: boolean;
  isAuthed: boolean;
  status: string;
  onProbe: () => void;
};

export function BackendProbeSection(props: BackendProbeSectionProps) {
  const { labels, loading, isAuthed, status, onProbe } = props;

  return (
    <section className='space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
      <h2 className='text-sm font-semibold text-slate-700'>{labels.backendProbeTitle}</h2>
      <button
        className='w-full rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60'
        onClick={onProbe}
        disabled={loading || !isAuthed}
        type='button'
      >
        {labels.backendProbeButton}
      </button>
      {status ? (
        <p className='rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700' aria-live='polite'>
          {status}
        </p>
      ) : null}
    </section>
  );
}
