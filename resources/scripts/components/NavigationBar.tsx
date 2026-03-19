import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faRocket, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';

const NavigationShell = styled.div`
    ${tw`w-full sticky top-0 z-30 px-3 pt-3 sm:px-4 sm:pt-4`};
`;

const NavigationCard = styled.div`
    ${tw`mx-auto flex w-full max-w-[1280px] items-center overflow-x-auto rounded-[1.5rem] border px-3 py-3 shadow-2xl sm:px-5`};
    background: linear-gradient(
        135deg,
        rgba(8, 15, 32, 0.88) 0%,
        rgba(15, 23, 42, 0.8) 55%,
        rgba(17, 24, 39, 0.92) 100%
    );
    border-color: rgba(125, 211, 252, 0.14);
    backdrop-filter: blur(20px);
    box-shadow: 0 24px 90px rgba(2, 6, 23, 0.34);
`;

const BrandMark = styled.div`
    ${tw`mr-3 flex h-11 w-11 flex-none items-center justify-center rounded-2xl border text-sm text-cyan-100`};
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.22), rgba(59, 130, 246, 0.22), rgba(168, 85, 247, 0.18));
    border-color: rgba(103, 232, 249, 0.18);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
`;

const RightNavigation = styled.div`
    ${tw`flex h-full items-center justify-center gap-1 sm:gap-2`};

    & > a,
    & > button,
    & > .navigation-link {
        ${tw`flex items-center justify-center h-11 min-w-[2.75rem] rounded-xl border px-3 text-neutral-200 cursor-pointer transition-all duration-150`};
        background: rgba(15, 23, 42, 0.52);
        border-color: rgba(148, 163, 184, 0.12);

        &:active,
        &:hover {
            ${tw`text-white`};
            background: rgba(8, 15, 32, 0.82);
            border-color: rgba(103, 232, 249, 0.28);
            transform: translateY(-1px);
            box-shadow: 0 12px 28px rgba(8, 15, 32, 0.28);
        }

        &:active,
        &:hover,
        &.active {
            box-shadow: inset 0 -2px ${theme`colors.cyan.500`.toString()}, 0 12px 28px rgba(8, 15, 32, 0.24);
        }
    }
`;

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <NavigationShell>
            <SpinnerOverlay visible={isLoggingOut} />
            <NavigationCard>
                <div id={'logo'} css={tw`flex min-w-0 flex-1 items-center`}>
                    <BrandMark>
                        <FontAwesomeIcon icon={faRocket} />
                    </BrandMark>
                    <Link to={'/'} css={tw`min-w-0 no-underline`}>
                        <p css={tw`text-[0.65rem] uppercase tracking-[0.38em] text-cyan-300/80`}>Hosting control</p>
                        <span
                            css={tw`block truncate pr-3 text-xl font-header font-semibold text-white transition-colors duration-150 hover:text-cyan-100 sm:text-2xl`}
                        >
                            {name}
                        </span>
                    </Link>
                </div>
                <RightNavigation>
                    <SearchContainer />
                    <Tooltip placement={'bottom'} content={'Dashboard'}>
                        <NavLink to={'/'} exact>
                            <FontAwesomeIcon icon={faLayerGroup} />
                        </NavLink>
                    </Tooltip>
                    {rootAdmin && (
                        <Tooltip placement={'bottom'} content={'Admin'}>
                            <a href={'/admin'} rel={'noreferrer'}>
                                <FontAwesomeIcon icon={faCogs} />
                            </a>
                        </Tooltip>
                    )}
                    <Tooltip placement={'bottom'} content={'Account Settings'}>
                        <NavLink to={'/account'}>
                            <span className={'flex items-center justify-center w-5 h-5'}>
                                <Avatar.User />
                            </span>
                        </NavLink>
                    </Tooltip>
                    <Tooltip placement={'bottom'} content={'Sign Out'}>
                        <button onClick={onTriggerLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </Tooltip>
                </RightNavigation>
            </NavigationCard>
        </NavigationShell>
    );
};
