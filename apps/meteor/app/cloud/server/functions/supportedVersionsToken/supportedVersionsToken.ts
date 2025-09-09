import type { SettingValue } from '@rocket.chat/core-typings';
// import { License } from '@rocket.chat/license';
import { Settings } from '@rocket.chat/models';
import type { SignedSupportedVersions } from '@rocket.chat/server-cloud-communication';
import type { Response } from '@rocket.chat/server-fetch';

import { supportedVersionsChooseLatest } from './supportedVersionsChooseLatest';
import { SystemLogger } from '../../../../../server/lib/logger/system';
import { updateAuditedBySystem } from '../../../../../server/settings/lib/auditedSettingUpdates';
import { notifyOnSettingChangedById } from '../../../../lib/server/lib/notifyListener';
import { settings } from '../../../../settings/server';
import { supportedVersions as supportedVersionsFromBuild } from '../../../../utils/rocketchat-supported-versions.info';

declare module '@rocket.chat/core-typings' {
	interface ILicenseV3 {
		supportedVersions?: SignedSupportedVersions;
	}
}

/** HELPERS */

export const wrapPromise = <T>(
	promise: Promise<T>,
): Promise<
	| {
			success: true;
			result: T;
	  }
	| {
			success: false;
			error: any;
	  }
> =>
	promise
		.then((result) => ({ success: true, result }) as const)
		.catch((error) => ({
			success: false,
			error,
		}));

export const handleResponse = async <T>(promise: Promise<Response>) => {
	return wrapPromise<T>(
		(async () => {
			const request = await promise;
			if (!request.ok) {
				if (request.size > 0) {
					throw new Error((await request.json()).error);
				}
				throw new Error(request.statusText);
			}

			return request.json();
		})(),
	);
};

const cacheValueInSettings = <T extends SettingValue>(
	key: string,
	fn: (retry?: number) => Promise<T>,
): (() => Promise<T>) & {
	reset: (retry?: number) => Promise<T>;
} => {
	const reset = async (retry?: number) => {
		SystemLogger.debug(`Resetting cached value ${key} in settings`);
		const value = await fn(retry);

		if (
			(
				await updateAuditedBySystem({
					reason: 'cacheValueInSettings reset',
				})(Settings.updateValueById, key, value)
			).modifiedCount
		) {
			void notifyOnSettingChangedById(key);
		}

		return value;
	};

	return Object.assign(
		async () => {
			const storedValue = settings.get<T>(key);

			if (storedValue) {
				return storedValue;
			}

			return reset();
		},
		{
			reset,
		},
	);
};

const getSupportedVersionsToken = async () => {
	/**
	 * Gets the supported versions from the license
	 * Gets the supported versions from the cloud
	 * Gets the latest version
	 * return the token
	 */
	// const [versionsFromLicense, cloudResponse] = await Promise.all([License.getLicense(), getSupportedVersionsFromCloud()]);

	const supportedVersions = await supportedVersionsChooseLatest(supportedVersionsFromBuild);

	SystemLogger.debug({
		msg: 'Supported versions',
		supportedVersionsFromBuild: supportedVersionsFromBuild.timestamp,
	});

	switch (supportedVersions) {
		case supportedVersionsFromBuild:
			SystemLogger.info({
				msg: 'Using supported versions from build',
			});
			break;
	}

	// to avoid a possibly wrong message, we only send the message if the cloud response was successful

	return supportedVersions?.signed;
};

export const getCachedSupportedVersionsToken = cacheValueInSettings('Cloud_Workspace_Supported_Versions_Token', getSupportedVersionsToken);
