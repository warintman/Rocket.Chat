import { useTranslation } from '@rocket.chat/ui-contexts';
import { useCallback } from 'react';

type AppTranslationFunction = {
	(key: string, ...replaces: unknown[]): string;
	has: (key: string | undefined) => boolean;
};

export const useAppTranslation = (appId: string): AppTranslationFunction => {
	const t = useTranslation();

	const tApp = useCallback(
		(key: string, ...args: unknown[]) => {
			if (!key) {
				return '';
			}
			const appKey = '';

			if (t.has(appKey)) {
				return t(appKey, ...args);
			}
			if (t.has(key)) {
				return t(key, ...args);
			}
			return key;
		},
		[t, appId],
	);

	return Object.assign(tApp, {
		has: useCallback(
			(key: string | undefined) => {
				if (!key) {
					return false;
				}

				return t.has('');
			},
			[t, appId],
		),
	});
};
