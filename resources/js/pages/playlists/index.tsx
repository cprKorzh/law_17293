import { Button } from '@/components/ui/button';
import { TrainingSuspended } from '@/components/training-suspended';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, Play, Video } from 'lucide-react';

interface VideoLesson {
    id: number;
    title: string;
    lesson_date: string;
    order_index: number;
    kinescope_video: {
        id: string;
        title: string;
    };
}

interface Playlist {
    id: number;
    title: string;
    description?: string;
    video_lessons: VideoLesson[];
}

interface Props {
    playlists: Playlist[];
    trainingSuspended: boolean;
    suspensionReason?: string;
    [key: string]: unknown;
}

export default function PlaylistsIndex() {
    const { playlists, trainingSuspended, suspensionReason } = usePage<Props>().props;

    return (
        <AppLayout>
            <Head title="Повтор занятий" />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Повтор занятий</h1>

                {trainingSuspended ? (
                    <TrainingSuspended suspensionReason={suspensionReason} />
                ) : playlists.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">
                            Повторы занятий для вашей группы пока не назначены
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {playlists.map((playlist) => (
                            <div
                                key={playlist.id}
                                className="rounded-lg border bg-card shadow"
                            >
                                <div className="p-6">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                                                {playlist.title}
                                            </h3>

                                            {playlist.description && (
                                                <p className="mb-4 text-muted-foreground">
                                                    {playlist.description}
                                                </p>
                                            )}

                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Video className="mr-1 h-4 w-4" />
                                                {playlist.video_lessons.length}{' '}
                                                видео
                                            </div>
                                        </div>

                                        <Link
                                            href={`/playlists/${playlist.id}`}
                                        >
                                            <Button>
                                                <Play className="mr-2 h-4 w-4" />
                                                Открыть
                                            </Button>
                                        </Link>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h4 className="mb-3 font-medium text-card-foreground">
                                            Содержание:
                                        </h4>
                                        <div className="space-y-2">
                                            {playlist.video_lessons
                                                .slice(0, 3)
                                                .map((lesson) => (
                                                    <div
                                                        key={lesson.id}
                                                        className="flex items-center justify-between text-sm"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                                                                {
                                                                    lesson.order_index
                                                                }
                                                            </span>
                                                            <span className="text-card-foreground">
                                                                {lesson.title}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center text-muted-foreground">
                                                            <Calendar className="mr-1 h-3 w-3" />
                                                            {new Date(
                                                                lesson.lesson_date,
                                                            ).toLocaleDateString(
                                                                'ru-RU',
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            {playlist.video_lessons.length >
                                                3 && (
                                                <div className="text-sm text-muted-foreground">
                                                    ... и еще{' '}
                                                    {playlist.video_lessons
                                                        .length - 3}{' '}
                                                    видео
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
