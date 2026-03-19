import styled from 'styled-components/macro';
import tw from 'twin.macro';

export default styled.div<{ $hoverable?: boolean }>`
    ${tw`flex rounded-2xl no-underline text-neutral-100 items-center border overflow-hidden`};
    background: linear-gradient(
        135deg,
        rgba(15, 23, 42, 0.9) 0%,
        rgba(17, 24, 39, 0.76) 50%,
        rgba(12, 18, 32, 0.96) 100%
    );
    border-color: rgba(148, 163, 184, 0.14);
    box-shadow: 0 22px 60px rgba(2, 6, 23, 0.32);
    backdrop-filter: blur(18px);
    transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;

    ${(props) =>
        props.$hoverable !== false &&
        `
            &:hover {
                transform: translateY(-2px);
                border-color: rgba(103, 232, 249, 0.28);
                box-shadow: 0 28px 70px rgba(8, 15, 32, 0.45);
                background: linear-gradient(135deg, rgba(8, 15, 32, 0.94) 0%, rgba(17, 24, 39, 0.8) 52%, rgba(15, 23, 42, 0.98) 100%);
            }
        `};

    & .icon {
        ${tw`rounded-2xl w-16 h-16 flex items-center justify-center p-3 border`};
        background: linear-gradient(135deg, rgba(14, 165, 233, 0.18), rgba(168, 85, 247, 0.14));
        border-color: rgba(125, 211, 252, 0.16);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }
`;
