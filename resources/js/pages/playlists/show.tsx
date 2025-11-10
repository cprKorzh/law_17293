import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Play } from 'lucide-react';

interface VideoLesson {
    id: number;
    title: string;
    description?: string;
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
    playlist: Playlist;
}

export default function PlaylistShow({ playlist }: Props) {
    return (
        <AppLayout>
            <Head title={playlist.title} />

            <div className="p-6">
                <div className="mb-6">
                    <Link href="/playlists">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Назад
                        </Button>
                    </Link>
                </div>

                <div className="mx-auto max-w-4xl">
                    <div className="mb-8">
                        <h1 className="mb-4 text-3xl font-bold text-foreground">
                            {playlist.title}
                        </h1>

                        {playlist.description && (
                            <p className="mb-6 text-lg text-muted-foreground">
                                {playlist.description}
                            </p>
                        )}

                        <div className="text-sm text-muted-foreground">
                            {playlist.video_lessons.length} видеоуроков
                        </div>
                    </div>

                    <div className="space-y-4">
                        {playlist.video_lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className="rounded-lg border bg-card p-6 shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-2 flex items-center space-x-2">
                                            <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                Урок {lesson.order_index}
                                            </span>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Calendar className="mr-1 h-4 w-4" />
                                                {new Date(
                                                    lesson.lesson_date,
                                                ).toLocaleDateString('ru-RU')}
                                            </div>
                                        </div>

                                        <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                                            {lesson.title}
                                        </h3>

                                        {lesson.description && (
                                            <p className="mb-4 text-muted-foreground">
                                                {lesson.description}
                                            </p>
                                        )}
                                    </div>

                                    <Link href={`/video-lessons/${lesson.id}`}>
                                        <Button>
                                            <Play className="mr-2 h-4 w-4" />
                                            Смотреть
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
