import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Settings } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="bg-card p-6 text-center">
                            <div className="mb-4">
                                <BookOpen className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">Добро пожаловать!</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Начните изучение материалов или проверьте статус обучения
                            </p>
                            <div className="space-y-2">
                                <Button asChild className="w-full">
                                    <Link href="/playlists">
                                        Перейти к урокам
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/settings/training">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Статус обучения
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
