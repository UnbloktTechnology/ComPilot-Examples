import {
  type Config,
  isAuthSessionExpired,
  setAuthSession,
  useAuthenticate,
  waitForWidgetAppLoaded,
  watchAuthSession,
  type AuthSession,
} from "@compilot/react-sdk";

// save the session to local storage to reload it on page refresh
const storageKey = "compilot-authsession";
const store: {
  save: (session: AuthSession) => void;
  load: () => AuthSession | null;
  remove: () => void;
} = {
  save: (session) => {
    localStorage.setItem(storageKey, JSON.stringify(session));
  },
  load: () => {
    const session = localStorage.getItem(storageKey);
    const parsedSession = session ? (JSON.parse(session) as AuthSession) : null;
    if (!parsedSession) return null;
    if (isAuthSessionExpired(parsedSession)) return null;
    return parsedSession;
  },
  remove: () => {
    localStorage.removeItem(storageKey);
  },
};

export const bindCompilotConfigToLocalStorage = async (
  compilotConfig: Config,
) => {
  const unwatch = watchAuthSession(compilotConfig, {
    onSessionChange: (session) => {
      if (session !== null) {
        store.save(session);
      } else if (session === null) {
        store.remove();
      }
    },
  });

  await waitForWidgetAppLoaded(compilotConfig, {});
  const session = store.load();
  if (session) {
    await setAuthSession(compilotConfig, session);
  }

  return unwatch;
};

export const useIsLoadingStoredSession = () => {
  const { data: isKycAuthenticated } = useAuthenticate();
  const session = store.load();

  if (isKycAuthenticated) return false;
  if (!session) return false;
  return true;
};
