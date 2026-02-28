import { useCallback, useEffect, useState } from 'react';
import type { Locale, Trip, UserPreference } from '@simsasukgo/shared';
import { getErrorMessage, loadBaseData } from '../auth-data';

type SessionUser = { id: string };
type SessionData = { user: SessionUser; access_token?: string | null } | null;

type SupabaseAuthLike = {
  signUp: (input: { email: string; password: string }) => Promise<{
    error: { message: string } | null;
    data: { user: { identities?: unknown[] | null } | null } | null;
  }>;
  signInWithPassword: (input: {
    email: string;
    password: string;
  }) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<{ error: { message: string } | null }>;
  getSession: () => Promise<{
    data: { session: SessionData };
    error: { message: string } | null;
  }>;
  onAuthStateChange: (callback: (_event: string, session: SessionData) => void | Promise<void>) => {
    data: {
      subscription: {
        unsubscribe: () => void;
      };
    };
  };
};

export type SupabaseSessionClient = {
  auth: SupabaseAuthLike;
};

export function useSupabaseAuthSession(input: {
  supabaseClient: SupabaseSessionClient;
  locale: Locale;
  onError: (message: string) => void;
}) {
  const { supabaseClient, locale, onError } = input;
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [preference, setPreference] = useState<UserPreference | null>(null);

  const clearBaseData = useCallback(() => {
    setTrip(null);
    setPreference(null);
    setAccessToken(null);
  }, []);

  const refreshBaseData = useCallback(async (nextAccessToken: string) => {
    const data = await loadBaseData({ accessToken: nextAccessToken });
    setTrip(data.trip);
    setPreference(data.preference);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        const { data, error } = await supabaseClient.auth.getSession();

        if (error) {
          if (isMounted) {
            onError(error.message);
          }
          return;
        }

        const uid = data.session?.user.id ?? null;
        const nextAccessToken = data.session?.access_token ?? null;

        if (!isMounted) {
          return;
        }

        setUserId(uid);
        setAccessToken(nextAccessToken);

        if (uid && nextAccessToken) {
          await refreshBaseData(nextAccessToken);
          return;
        }

        clearBaseData();
      } catch (error) {
        if (isMounted) {
          onError(getErrorMessage(error, locale));
        }
      }
    };

    void initSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      try {
        const uid = session?.user.id ?? null;
        const nextAccessToken = session?.access_token ?? null;

        if (!isMounted) {
          return;
        }

        setUserId(uid);
        setAccessToken(nextAccessToken);

        if (uid && nextAccessToken) {
          await refreshBaseData(nextAccessToken);
          return;
        }

        clearBaseData();
      } catch (error) {
        if (isMounted) {
          onError(getErrorMessage(error, locale));
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [clearBaseData, locale, onError, refreshBaseData, supabaseClient]);

  return {
    userId,
    accessToken,
    trip,
    preference,
    refreshBaseData,
  };
}
