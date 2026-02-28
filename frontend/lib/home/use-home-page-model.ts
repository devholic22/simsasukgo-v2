import { useCallback, useMemo, useState } from 'react';
import type { Locale } from '@simsasukgo/shared';
import { getErrorMessage } from '../auth-data';
import {
  runBackendSearchProbeAction,
  runInitializeBaseDataAction,
  runSignInAction,
  runSignOutAction,
  runSignUpAction,
} from './auth-actions';
import { getHomePageLabels } from './constants';
import { useSupabaseAuthSession, type SupabaseSessionClient } from './use-supabase-auth-session';

export function useHomePageModel(input: { supabaseClient: SupabaseSessionClient; locale: Locale }) {
  const { supabaseClient, locale } = input;
  const labels = useMemo(() => getHomePageLabels(locale), [locale]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [backendProbeStatus, setBackendProbeStatus] = useState('');

  const handleSessionError = useCallback((nextMessage: string) => {
    setFeedbackMessage(nextMessage);
  }, []);

  const { userId, accessToken, trip, preference, refreshBaseData } = useSupabaseAuthSession({
    supabaseClient,
    locale,
    onError: handleSessionError,
  });

  const runAsyncAction = useCallback(
    async (action: () => Promise<void>) => {
      setIsLoading(true);

      try {
        await action();
      } catch (error) {
        setFeedbackMessage(getErrorMessage(error, locale));
      } finally {
        setIsLoading(false);
      }
    },
    [locale]
  );

  const handleSignUp = useCallback(() => {
    void runAsyncAction(async () => {
      setFeedbackMessage('');
      const result = await runSignUpAction({
        authApi: supabaseClient.auth,
        email,
        password,
        locale,
      });
      setFeedbackMessage(result.message);
    });
  }, [email, locale, password, runAsyncAction, supabaseClient.auth]);

  const handleSignIn = useCallback(() => {
    void runAsyncAction(async () => {
      setFeedbackMessage('');
      const result = await runSignInAction({
        authApi: supabaseClient.auth,
        email,
        password,
        locale,
      });
      setFeedbackMessage(result.message);
    });
  }, [email, locale, password, runAsyncAction, supabaseClient.auth]);

  const handleSignOut = useCallback(() => {
    void runAsyncAction(async () => {
      setFeedbackMessage('');
      const result = await runSignOutAction({
        authApi: supabaseClient.auth,
        locale,
      });
      setFeedbackMessage(result.message);

      if (result.ok) {
        setBackendProbeStatus('');
      }
    });
  }, [locale, runAsyncAction, supabaseClient.auth]);

  const handleInitializeBaseData = useCallback(() => {
    if (!userId || !accessToken) {
      return;
    }

    void runAsyncAction(async () => {
      setFeedbackMessage('');
      const result = await runInitializeBaseDataAction({
        accessToken,
        locale,
      });

      setFeedbackMessage(result.message);

      if (result.ok) {
        await refreshBaseData(accessToken);
      }
    });
  }, [accessToken, locale, refreshBaseData, runAsyncAction, userId]);

  const handleBackendProbe = useCallback(() => {
    void runAsyncAction(async () => {
      setBackendProbeStatus('');
      const result = await runBackendSearchProbeAction({
        locale,
        accessToken: accessToken ?? undefined,
      });
      setBackendProbeStatus(result.message);
    });
  }, [accessToken, locale, runAsyncAction]);

  return {
    labels,
    email,
    password,
    isLoading,
    isAuthed: userId != null && accessToken != null,
    userId,
    trip,
    preference,
    backendProbeStatus,
    feedbackMessage,
    handleEmailChange: setEmail,
    handlePasswordChange: setPassword,
    handleSignUp,
    handleSignIn,
    handleSignOut,
    handleInitializeBaseData,
    handleBackendProbe,
  };
}
