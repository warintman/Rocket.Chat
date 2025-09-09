import { PaletteStyleTag } from '@rocket.chat/fuselage';
// import { useThemeMode } from '@rocket.chat/ui-theming';

import { codeBlock } from '../lib/codeBlockStyles';

export const MainLayoutStyleTags = () => {
	//

	return (
		<>
			<PaletteStyleTag theme='dark' selector='.rcx-sidebar--main, .rcx-navbar' tagId='sidebar-palette' />
			<PaletteStyleTag selector='.rcx-content--main' palette={codeBlock} tagId='codeBlock-palette' />
		</>
	);
};
