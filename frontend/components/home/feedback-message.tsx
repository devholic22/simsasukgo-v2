type FeedbackMessageProps = {
  message: string;
};

export function FeedbackMessage(props: FeedbackMessageProps) {
  const { message } = props;

  if (!message) {
    return null;
  }

  return (
    <p
      className='rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700'
      aria-live='polite'
    >
      {message}
    </p>
  );
}
