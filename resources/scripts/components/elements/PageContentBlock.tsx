import React, { useEffect } from 'react';
import ContentContainer from '@/components/elements/ContentContainer';
import { CSSTransition } from 'react-transition-group';
import tw from 'twin.macro';
import FlashMessageRender from '@/components/FlashMessageRender';

export interface PageContentBlockProps {
    title?: string;
    className?: string;
    showFlashKey?: string;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, showFlashKey, className, children }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <CSSTransition timeout={150} classNames={'fade'} appear in>
            <>
                <ContentContainer css={tw`my-5 sm:my-8`} className={className}>
                    {showFlashKey && <FlashMessageRender byKey={showFlashKey} css={tw`mb-4`} />}
                    {children}
                </ContentContainer>
                <ContentContainer css={tw`mb-6 px-1`}>
                    <div
                        css={tw`rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-center shadow-xl backdrop-blur-lg`}
                    >
                        <p css={tw`text-xs uppercase tracking-[0.28em] text-cyan-300/75`}>
                            Performance-first hosting UX
                        </p>
                        <p css={tw`mt-2 text-xs text-neutral-400`}>
                            Crafted on top of Pterodactyl&reg; for a faster, more premium control panel experience.
                        </p>
                    </div>
                </ContentContainer>
            </>
        </CSSTransition>
    );
};

export default PageContentBlock;
