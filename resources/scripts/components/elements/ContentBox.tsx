import React from 'react';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import tw from 'twin.macro';

type Props = Readonly<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        title?: string;
        borderColor?: string;
        showFlashes?: string | boolean;
        showLoadingOverlay?: boolean;
    }
>;

const ContentBox = ({ title, borderColor, showFlashes, showLoadingOverlay, children, ...props }: Props) => (
    <div {...props}>
        {title && <h2 css={tw`mb-4 px-2 text-2xl text-white`}>{title}</h2>}
        {showFlashes && (
            <FlashMessageRender byKey={typeof showFlashes === 'string' ? showFlashes : undefined} css={tw`mb-4`} />
        )}
        <div
            css={[
                tw`relative rounded-[1.5rem] border p-4 shadow-2xl backdrop-blur-xl sm:p-5`,
                !!borderColor && tw`border-t-4`,
            ]}
            style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(17, 24, 39, 0.92))',
                borderColor: borderColor || 'rgba(148, 163, 184, 0.12)',
                boxShadow: '0 22px 70px rgba(2, 6, 23, 0.24)',
            }}
        >
            <SpinnerOverlay visible={showLoadingOverlay || false} />
            {children}
        </div>
    </div>
);

export default ContentBox;
