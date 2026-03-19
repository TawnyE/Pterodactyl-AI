import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip, faServer, faSignal } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Spinner from '@/components/elements/Spinner';
import styled from 'styled-components/macro';
import isEqual from 'react-fast-compare';

const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const Icon = memo(
    styled(FontAwesomeIcon)<{ $alarm: boolean }>`
        ${(props) => (props.$alarm ? tw`text-red-300` : tw`text-cyan-200`)};
    `,
    isEqual
);

const IconDescription = styled.p<{ $alarm: boolean }>`
    ${tw`ml-2 text-sm font-medium`};
    ${(props) => (props.$alarm ? tw`text-white` : tw`text-neutral-200`)};
`;

const StatusIndicatorBox = styled(GreyRowBox)<{ $status: ServerPowerState | undefined }>`
    ${tw`relative grid gap-5 p-5 sm:grid-cols-12 sm:items-center sm:p-6`};

    & .status-bar {
        ${tw`absolute inset-x-0 top-0 h-[2px] opacity-90 transition-all duration-150`};
        background: ${({ $status }) =>
            !$status || $status === 'offline'
                ? 'linear-gradient(90deg, rgba(248, 113, 113, 0.15), rgba(248, 113, 113, 0.9), rgba(248, 113, 113, 0.15))'
                : $status === 'running'
                ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.15), rgba(74, 222, 128, 0.9), rgba(34, 197, 94, 0.15))'
                : 'linear-gradient(90deg, rgba(250, 204, 21, 0.15), rgba(250, 204, 21, 0.9), rgba(250, 204, 21, 0.15))'};
    }
`;

const MetricCard = styled.div`
    ${tw`rounded-2xl border px-4 py-3`};
    background: rgba(8, 15, 32, 0.46);
    border-color: rgba(148, 163, 184, 0.12);
`;

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    const diskLimit = server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : 'Unlimited';
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : 'Unlimited';
    const cpuLimit = server.limits.cpu !== 0 ? `${server.limits.cpu} %` : 'Unlimited';

    const address = server.allocations
        .filter((alloc) => alloc.isDefault)
        .map((allocation) => `${allocation.alias || ip(allocation.ip)}:${allocation.port}`)
        .join(', ');

    const statusLabel = useMemo(() => {
        if (isSuspended) {
            return server.status === 'suspended' ? 'Suspended' : 'Connection Error';
        }

        if (!stats) {
            return server.isTransferring
                ? 'Transferring'
                : server.status === 'installing'
                ? 'Installing'
                : server.status === 'restoring_backup'
                ? 'Restoring Backup'
                : 'Syncing';
        }

        return stats.status === 'running' ? 'Running' : stats.status === 'starting' ? 'Starting' : 'Offline';
    }, [isSuspended, server.isTransferring, server.status, stats]);

    const statusTone =
        stats?.status === 'running' && !isSuspended
            ? tw`text-green-200 bg-green-500/10 border-green-400/30`
            : stats?.status === 'starting' && !isSuspended
            ? tw`text-yellow-200 bg-yellow-500/10 border-yellow-400/30`
            : isSuspended
            ? tw`text-red-100 bg-red-500/10 border-red-400/30`
            : tw`text-neutral-200 bg-neutral-500/10 border-neutral-400/20`;

    return (
        <StatusIndicatorBox as={Link} to={`/server/${server.id}`} className={className} $status={stats?.status}>
            <div className={'status-bar'} />
            <div css={tw`flex items-start gap-4 sm:col-span-12 lg:col-span-5`}>
                <div className={'icon mr-0 text-cyan-100'}>
                    <FontAwesomeIcon icon={faServer} />
                </div>
                <div css={tw`min-w-0 flex-1`}>
                    <div css={tw`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}>
                        <div css={tw`min-w-0`}>
                            <p css={tw`truncate text-xl font-semibold text-white`}>{server.name}</p>
                            {!!server.description && (
                                <p css={tw`mt-1 break-words text-sm text-neutral-300 line-clamp-2`}>
                                    {server.description}
                                </p>
                            )}
                        </div>
                        <div
                            css={[
                                tw`inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em]`,
                                statusTone,
                            ]}
                        >
                            <FontAwesomeIcon icon={faSignal} css={tw`mr-2 text-[0.65rem]`} />
                            {statusLabel}
                        </div>
                    </div>
                    <div css={tw`mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-300`}>
                        <div
                            css={tw`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5`}
                        >
                            <FontAwesomeIcon icon={faEthernet} css={tw`mr-2 text-cyan-200`} />
                            <span css={tw`truncate max-w-[18rem]`}>{address || 'No default allocation'}</span>
                        </div>
                        <div
                            css={tw`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5`}
                        >
                            <span css={tw`text-xs uppercase tracking-[0.2em] text-neutral-400`}>Node-ready</span>
                        </div>
                    </div>
                </div>
            </div>
            <div css={tw`sm:col-span-12 lg:col-span-7`}>
                {!stats || isSuspended ? (
                    <div css={tw`grid gap-3 sm:grid-cols-3`}>
                        <MetricCard css={tw`sm:col-span-3`}>
                            {isSuspended ? (
                                <div css={tw`text-center`}>
                                    <span
                                        css={tw`rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-red-100`}
                                    >
                                        {server.status === 'suspended' ? 'Suspended' : 'Connection Error'}
                                    </span>
                                </div>
                            ) : server.isTransferring || server.status ? (
                                <div css={tw`flex items-center justify-center gap-2 text-sm text-neutral-300`}>
                                    <Spinner size={'small'} />
                                    <span>{statusLabel}</span>
                                </div>
                            ) : (
                                <div css={tw`flex items-center justify-center`}>
                                    <Spinner size={'small'} />
                                </div>
                            )}
                        </MetricCard>
                    </div>
                ) : (
                    <div css={tw`grid gap-3 sm:grid-cols-3`}>
                        <MetricCard>
                            <div css={tw`flex items-center justify-between`}>
                                <div css={tw`flex items-center`}>
                                    <Icon icon={faMicrochip} $alarm={alarms.cpu} />
                                    <IconDescription $alarm={alarms.cpu}>
                                        {stats.cpuUsagePercent.toFixed(2)} %
                                    </IconDescription>
                                </div>
                                <span css={tw`text-[0.65rem] uppercase tracking-[0.24em] text-neutral-500`}>CPU</span>
                            </div>
                            <p css={tw`mt-2 text-xs text-neutral-400`}>Limit: {cpuLimit}</p>
                        </MetricCard>
                        <MetricCard>
                            <div css={tw`flex items-center justify-between`}>
                                <div css={tw`flex items-center`}>
                                    <Icon icon={faMemory} $alarm={alarms.memory} />
                                    <IconDescription $alarm={alarms.memory}>
                                        {bytesToString(stats.memoryUsageInBytes)}
                                    </IconDescription>
                                </div>
                                <span css={tw`text-[0.65rem] uppercase tracking-[0.24em] text-neutral-500`}>RAM</span>
                            </div>
                            <p css={tw`mt-2 text-xs text-neutral-400`}>Limit: {memoryLimit}</p>
                        </MetricCard>
                        <MetricCard>
                            <div css={tw`flex items-center justify-between`}>
                                <div css={tw`flex items-center`}>
                                    <Icon icon={faHdd} $alarm={alarms.disk} />
                                    <IconDescription $alarm={alarms.disk}>
                                        {bytesToString(stats.diskUsageInBytes)}
                                    </IconDescription>
                                </div>
                                <span css={tw`text-[0.65rem] uppercase tracking-[0.24em] text-neutral-500`}>Disk</span>
                            </div>
                            <p css={tw`mt-2 text-xs text-neutral-400`}>Limit: {diskLimit}</p>
                        </MetricCard>
                    </div>
                )}
            </div>
        </StatusIndicatorBox>
    );
};
