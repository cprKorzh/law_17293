import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Play } from 'lucide-react';

interface VideoLesson {
    id: number;
    title: string;
    description?: string;
    lesson_date: string;
    order_index: number;
    kinescope_video: {
        id: number;
        title: string;
    };
}

interface Props {
    videoLessons: VideoLesson[];
}

export default function VideoLessonsIndex({ videoLessons }: Props) {
    return (
        <AppLayout>
            <Head title="Видеоуроки" />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Видеоуроки</h1>

                {videoLessons.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">
                            Видеоуроки для вашей группы пока не назначены
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {videoLessons.map((lesson) => (
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
                )}
            </div>
        </AppLayout>
    );
}
