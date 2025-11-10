import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ChevronRight, Folder, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Админ панель', href: '/admin/users' },
    { title: 'Видео', href: '/admin/videos' },
];

interface KinescopeFolder {
    id: string;
    name: string;
    project_id: string;
    parent_id?: string | null;
    children?: KinescopeFolder[];
    videos?: KinescopeVideo[];
    created_at: string;
}

interface KinescopeVideo {
    id: string;
    title: string;
    duration: number;
    status: string;
}

interface FoldersByProject {
    project: {
        id: string;
        name: string;
    };
    folders: KinescopeFolder[];
}

interface Props {
    foldersByProject: FoldersByProject[];
    [key: string]: unknown;
}

function FolderItem({
    folder,
    level = 0,
}: {
    folder: KinescopeFolder;
    level?: number;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = folder.children && folder.children.length > 0;
    const hasVideos = folder.videos && folder.videos.length > 0;

    return (
        <div>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
                    style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
                >
                    {hasChildren || hasVideos ? (
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                            >
                                <ChevronRight
                                    className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                                />
                            </Button>
                        </CollapsibleTrigger>
                    ) : (
                        <div className="h-6 w-6" />
                    )}
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{folder.name}</span>
                    {hasVideos && (
                        <span className="ml-2 text-xs text-muted-foreground">
                            ({folder.videos!.length} видео)
                        </span>
                    )}
                </div>
                {(hasChildren || hasVideos) && (
                    <CollapsibleContent>
                        {hasVideos && (
                            <div
                                className="space-y-1"
                                style={{
                                    paddingLeft: `${(level + 1) * 1.5 + 0.75}rem`,
                                }}
                            >
                                {folder.videos!.map((video) => (
                                    <div
                                        key={video.id}
                                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50"
                                    >
                                        📹 {video.title}
                                    </div>
                                ))}
                            </div>
                        )}
                        {hasChildren &&
                            folder.children?.map((child) => (
                                <FolderItem
                                    key={child.id}
                                    folder={child}
                                    level={level + 1}
                                />
                            ))}
                    </CollapsibleContent>
                )}
            </Collapsible>
        </div>
    );
}

export default function VideosIndex() {
    const { foldersByProject } = usePage<Props>().props;
    const [syncing, setSyncing] = useState(false);

    const handleSync = () => {
        setSyncing(true);
        router.post(
            '/admin/videos/sync',
            {},
            {
                onFinish: () => setSyncing(false),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Видео" />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading>Структура папок Kinescope</Heading>
                    <Button onClick={handleSync} disabled={syncing}>
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`}
                        />
                        Синхронизировать
                    </Button>
                </div>

                {foldersByProject.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                        <p className="text-muted-foreground">
                            Папки не найдены
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {foldersByProject.map((item) => (
                            <div
                                key={item.project.id}
                                className="rounded-lg border bg-card"
                            >
                                <div className="border-b bg-muted/50 px-4 py-3">
                                    <h3 className="font-semibold">
                                        {item.project.name}
                                    </h3>
                                </div>
                                <div className="p-2">
                                    {item.folders.length === 0 ? (
                                        <p className="px-3 py-2 text-sm text-muted-foreground">
                                            Папки отсутствуют
                                        </p>
                                    ) : (
                                        item.folders.map((folder) => (
                                            <FolderItem
                                                key={folder.id}
                                                folder={folder}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
