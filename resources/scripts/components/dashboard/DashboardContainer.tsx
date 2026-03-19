import React, { useEffect, useMemo, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';

const Hero = styled.section`
    ${tw`relative overflow-hidden rounded-[2rem] border p-5 shadow-2xl sm:p-8`};
    background: linear-gradient(
        135deg,
        rgba(8, 15, 32, 0.92) 0%,
        rgba(14, 116, 144, 0.24) 48%,
        rgba(17, 24, 39, 0.96) 100%
    );
    border-color: rgba(125, 211, 252, 0.16);
    box-shadow: 0 30px 120px rgba(2, 6, 23, 0.32);

    &::before,
    &::after {
        content: '';
        position: absolute;
        border-radius: 9999px;
        filter: blur(22px);
        pointer-events: none;
    }

    &::before {
        top: -4rem;
        right: -2rem;
        width: 14rem;
        height: 14rem;
        background: rgba(56, 189, 248, 0.16);
    }

    &::after {
        bottom: -5rem;
        left: -3rem;
        width: 16rem;
        height: 16rem;
        background: rgba(168, 85, 247, 0.14);
    }
`;

const StatGrid = styled.div`
    ${tw`mt-6 grid gap-3 md:grid-cols-3`};
`;

const StatCard = styled.div`
    ${tw`rounded-2xl border p-4 backdrop-blur-md`};
    background: rgba(8, 15, 32, 0.54);
    border-color: rgba(148, 163, 184, 0.12);
`;

const FilterCard = styled.div`
    ${tw`mt-5 flex flex-col gap-3 rounded-2xl border p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between`};
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.74), rgba(17, 24, 39, 0.9));
    border-color: rgba(148, 163, 184, 0.12);
`;

export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        setPage(1);
    }, [showOnlyAdmin]);

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    const summary = useMemo(() => {
        const items = servers?.items || [];

        return {
            total: servers?.pagination.total || items.length,
            visible: items.length,
            suspended: items.filter((server) => server.status === 'suspended').length,
            installing: items.filter((server) => server.status === 'installing' || server.isTransferring).length,
        };
    }, [servers]);

    return (
        <PageContentBlock title={'Dashboard'} showFlashKey={'dashboard'}>
            <Hero>
                <div css={tw`relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between`}>
                    <div css={tw`max-w-3xl`}>
                        <p css={tw`text-xs uppercase tracking-[0.36em] text-cyan-300/80`}>Premium hosting control</p>
                        <h1 css={tw`mt-4 text-3xl font-semibold leading-tight text-white sm:text-5xl`}>
                            A sharper, faster panel designed to feel like a serious hosting brand.
                        </h1>
                        <p css={tw`mt-4 max-w-2xl text-sm leading-6 text-neutral-300 sm:text-base`}>
                            Enjoy a cleaner dashboard, stronger visual hierarchy, smoother glassmorphism, and responsive
                            cards built to stay fluid on mobile and desktop without heavy effects.
                        </p>
                    </div>
                    <div css={tw`grid grid-cols-2 gap-3 sm:min-w-[22rem]`}>
                        <div css={tw`rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-4`}>
                            <p css={tw`text-xs uppercase tracking-[0.25em] text-cyan-200/80`}>Visible now</p>
                            <p css={tw`mt-2 text-3xl font-semibold text-white`}>{summary.visible}</p>
                        </div>
                        <div css={tw`rounded-2xl border border-purple-300/20 bg-purple-400/10 px-4 py-4`}>
                            <p css={tw`text-xs uppercase tracking-[0.25em] text-purple-100/80`}>Total fleet</p>
                            <p css={tw`mt-2 text-3xl font-semibold text-white`}>{summary.total}</p>
                        </div>
                    </div>
                </div>
                <StatGrid>
                    <StatCard>
                        <p css={tw`text-xs uppercase tracking-[0.28em] text-cyan-200/80`}>Suspended nodes</p>
                        <div css={tw`mt-3 flex items-end justify-between`}>
                            <p css={tw`text-3xl font-semibold text-white`}>{summary.suspended}</p>
                            <p css={tw`text-xs text-neutral-400`}>Needs review</p>
                        </div>
                    </StatCard>
                    <StatCard>
                        <p css={tw`text-xs uppercase tracking-[0.28em] text-green-200/80`}>Provisioning</p>
                        <div css={tw`mt-3 flex items-end justify-between`}>
                            <p css={tw`text-3xl font-semibold text-white`}>{summary.installing}</p>
                            <p css={tw`text-xs text-neutral-400`}>Installing / transfer</p>
                        </div>
                    </StatCard>
                    <StatCard>
                        <p css={tw`text-xs uppercase tracking-[0.28em] text-neutral-300/80`}>Experience</p>
                        <div css={tw`mt-3 flex items-end justify-between`}>
                            <p css={tw`text-xl font-semibold text-white`}>Mobile + desktop</p>
                            <p css={tw`text-xs text-neutral-400`}>Optimized layout</p>
                        </div>
                    </StatCard>
                </StatGrid>
            </Hero>
            {rootAdmin && (
                <FilterCard>
                    <div>
                        <p css={tw`text-xs uppercase tracking-[0.3em] text-cyan-300/75`}>Visibility mode</p>
                        <p css={tw`mt-2 text-sm text-neutral-300`}>
                            {showOnlyAdmin
                                ? 'Showing servers you administrate for others.'
                                : 'Showing only servers tied to your account.'}
                        </p>
                    </div>
                    <Switch
                        name={'show_all_servers'}
                        defaultChecked={showOnlyAdmin}
                        onChange={() => setShowOnlyAdmin((s) => !s)}
                        label={showOnlyAdmin ? "Show everyone else's servers" : 'Show only my servers'}
                    />
                </FilterCard>
            )}
            {!servers ? (
                <Spinner centered size={'large'} />
            ) : (
                <div css={tw`mt-5`}>
                    <Pagination data={servers} onPageSelect={setPage}>
                        {({ items }) =>
                            items.length > 0 ? (
                                <div css={tw`grid gap-4`}>
                                    {items.map((server) => (
                                        <ServerRow key={server.uuid} server={server} />
                                    ))}
                                </div>
                            ) : (
                                <div
                                    css={tw`rounded-[1.5rem] border border-white/10 bg-black/20 px-6 py-16 text-center shadow-xl backdrop-blur-lg`}
                                >
                                    <p css={tw`text-base font-medium text-white`}>
                                        {showOnlyAdmin
                                            ? 'There are no other servers to display.'
                                            : 'There are no servers associated with your account.'}
                                    </p>
                                    <p css={tw`mt-2 text-sm text-neutral-400`}>
                                        Once servers are provisioned they will show up here with live usage and quick
                                        status cues.
                                    </p>
                                </div>
                            )
                        }
                    </Pagination>
                </div>
            )}
        </PageContentBlock>
    );
};
