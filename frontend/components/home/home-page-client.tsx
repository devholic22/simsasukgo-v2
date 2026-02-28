'use client';

import type { Locale } from '@simsasukgo/shared';
import { AuthSection } from './auth-section';
import { BackendProbeSection } from './backend-probe-section';
import { BaseDataSection } from './base-data-section';
import { FeedbackMessage } from './feedback-message';
import { HOME_PAGE_CLASS_NAMES } from '../../lib/home/constants';
import { useAppLocale } from '../../lib/home/use-app-locale';
import { useHomePageModel } from '../../lib/home/use-home-page-model';
import { supabase } from '../../lib/supabase';

type HomePageClientProps = {
  initialLocale: Locale;
};

export function HomePageClient(props: HomePageClientProps) {
  const locale = useAppLocale(props.initialLocale);
  const model = useHomePageModel({
    supabaseClient: supabase,
    locale,
  });

  return (
    <main className={HOME_PAGE_CLASS_NAMES.main}>
      <header>
        <h1 className={HOME_PAGE_CLASS_NAMES.title}>{model.labels.pageTitle}</h1>
        <p className={HOME_PAGE_CLASS_NAMES.description}>{model.labels.pageDescription}</p>
      </header>

      <AuthSection
        labels={model.labels}
        email={model.email}
        password={model.password}
        loading={model.isLoading}
        isAuthed={model.isAuthed}
        onEmailChange={model.handleEmailChange}
        onPasswordChange={model.handlePasswordChange}
        onSignUp={model.handleSignUp}
        onSignIn={model.handleSignIn}
        onSignOut={model.handleSignOut}
      />

      <BaseDataSection
        labels={model.labels}
        userId={model.userId}
        trip={model.trip}
        preference={model.preference}
        loading={model.isLoading}
        isAuthed={model.isAuthed}
        onInitialize={model.handleInitializeBaseData}
      />

      <BackendProbeSection
        labels={model.labels}
        loading={model.isLoading}
        isAuthed={model.isAuthed}
        status={model.backendProbeStatus}
        onProbe={model.handleBackendProbe}
      />

      <FeedbackMessage message={model.feedbackMessage} />
    </main>
  );
}
