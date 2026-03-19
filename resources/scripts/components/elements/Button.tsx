import React from 'react';
import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';

interface Props {
    isLoading?: boolean;
    size?: 'xsmall' | 'small' | 'large' | 'xlarge';
    color?: 'green' | 'red' | 'primary' | 'grey';
    isSecondary?: boolean;
}

const ButtonStyle = styled.button<Omit<Props, 'isLoading'>>`
    ${tw`relative inline-flex items-center justify-center rounded-xl px-4 py-2 uppercase tracking-[0.16em] text-xs font-semibold transition-all duration-150 border overflow-hidden`};
    min-height: 2.75rem;
    backdrop-filter: blur(16px);
    box-shadow: 0 12px 30px rgba(2, 6, 23, 0.16);

    &::before {
        content: '';
        position: absolute;
        inset: 1px;
        border-radius: 0.7rem;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0));
        opacity: 0.85;
        pointer-events: none;
    }

    ${(props) =>
        ((!props.isSecondary && !props.color) || props.color === 'primary') &&
        css<Props>`
            ${(props) =>
                !props.isSecondary &&
                css`
                    color: #eff6ff;
                    border-color: rgba(14, 165, 233, 0.62);
                    background: linear-gradient(
                        135deg,
                        rgba(14, 165, 233, 0.95),
                        rgba(59, 130, 246, 0.96) 52%,
                        rgba(99, 102, 241, 0.94)
                    );
                `};

            &:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 18px 34px rgba(14, 165, 233, 0.24);
                filter: saturate(1.08);
            }
        `};

    ${(props) =>
        props.color === 'grey' &&
        css`
            ${tw`text-neutral-50`};
            border-color: rgba(148, 163, 184, 0.2);
            background: linear-gradient(135deg, rgba(51, 65, 85, 0.95), rgba(30, 41, 59, 0.94));

            &:hover:not(:disabled) {
                transform: translateY(-1px);
                border-color: rgba(148, 163, 184, 0.34);
            }
        `};

    ${(props) =>
        props.color === 'green' &&
        css<Props>`
            color: #f0fdf4;
            border-color: rgba(34, 197, 94, 0.46);
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(34, 197, 94, 0.92));

            &:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 18px 34px rgba(34, 197, 94, 0.2);
            }

            ${(props) =>
                props.isSecondary &&
                css`
                    &:active:not(:disabled) {
                        box-shadow: 0 18px 34px rgba(34, 197, 94, 0.2);
                    }
                `};
        `};

    ${(props) =>
        props.color === 'red' &&
        css<Props>`
            color: #fff1f2;
            border-color: rgba(248, 113, 113, 0.46);
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.94), rgba(220, 38, 38, 0.94));

            &:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 18px 34px rgba(239, 68, 68, 0.2);
            }

            ${(props) =>
                props.isSecondary &&
                css`
                    &:active:not(:disabled) {
                        box-shadow: 0 18px 34px rgba(239, 68, 68, 0.2);
                    }
                `};
        `};

    ${(props) => props.size === 'xsmall' && tw`px-2.5 py-1.5 text-2xs rounded-lg min-h-0`};
    ${(props) => (!props.size || props.size === 'small') && tw`px-4 py-2`};
    ${(props) => props.size === 'large' && tw`px-5 py-4 text-sm`};
    ${(props) => props.size === 'xlarge' && tw`px-5 py-4 w-full text-sm`};

    ${(props) =>
        props.isSecondary &&
        css<Props>`
            background: rgba(15, 23, 42, 0.56);
            border-color: rgba(148, 163, 184, 0.18);
            ${tw`text-neutral-100`};

            &:hover:not(:disabled) {
                ${tw`text-white`};
                border-color: rgba(103, 232, 249, 0.3);
                background: rgba(15, 23, 42, 0.84);
                ${(props) =>
                    props.color === 'red' &&
                    'background: linear-gradient(135deg, rgba(239, 68, 68, 0.94), rgba(220, 38, 38, 0.94)); border-color: rgba(248, 113, 113, 0.46);'};
                ${(props) =>
                    props.color === 'primary' &&
                    'background: linear-gradient(135deg, rgba(14, 165, 233, 0.95), rgba(59, 130, 246, 0.96) 52%, rgba(99, 102, 241, 0.94)); border-color: rgba(14, 165, 233, 0.62);'};
                ${(props) =>
                    props.color === 'green' &&
                    'background: linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(34, 197, 94, 0.92)); border-color: rgba(34, 197, 94, 0.46);'};
            }
        `};

    &:disabled {
        opacity: 0.55;
        cursor: default;
        transform: none;
        box-shadow: none;
    }
`;

type ComponentProps = Omit<JSX.IntrinsicElements['button'], 'ref' | keyof Props> & Props;

const Button: React.FC<ComponentProps> = ({ children, isLoading, ...props }) => (
    <ButtonStyle {...props}>
        {isLoading && (
            <div css={tw`flex absolute justify-center items-center w-full h-full left-0 top-0`}>
                <Spinner size={'small'} />
            </div>
        )}
        <span css={isLoading ? tw`text-transparent` : tw`relative z-10`}>{children}</span>
    </ButtonStyle>
);

type LinkProps = Omit<JSX.IntrinsicElements['a'], 'ref' | keyof Props> & Props;

const LinkButton: React.FC<LinkProps> = (props) => <ButtonStyle as={'a'} {...props} />;

export { LinkButton, ButtonStyle };
export default Button;
