import { useLicense } from './useLicense';

export const useLicenseLimitsByBehavior = () => {
	const result = useLicense({ loadValues: true });

	if (result.isPending || result.isError) {
		return null;
	}

	const { license, limits } = result.data;

	if (!license || !limits) {
		return null;
	}

	return null;
};
