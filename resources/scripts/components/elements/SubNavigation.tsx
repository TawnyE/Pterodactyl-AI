import styled from 'styled-components/macro';
import tw, { theme } from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full px-3 pt-3 sm:px-4`};

    & > div {
        ${tw`mx-auto flex max-w-[1280px] items-center overflow-x-auto rounded-[1.25rem] border px-2 py-2 text-sm shadow-xl`};
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.68), rgba(17, 24, 39, 0.78));
        border-color: rgba(148, 163, 184, 0.12);
        backdrop-filter: blur(16px);

        & > a,
        & > div {
            ${tw`inline-flex items-center rounded-xl px-4 py-3 text-neutral-300 no-underline whitespace-nowrap transition-all duration-150`};

            &:not(:first-of-type) {
                ${tw`ml-2`};
            }

            &:hover {
                ${tw`text-white`};
                background: rgba(8, 15, 32, 0.62);
            }

            &:active,
            &.active {
                ${tw`text-white`};
                background: rgba(8, 15, 32, 0.82);
                box-shadow: inset 0 -2px ${theme`colors.cyan.500`.toString()};
            }
        }
    }
`;

export default SubNavigation;
