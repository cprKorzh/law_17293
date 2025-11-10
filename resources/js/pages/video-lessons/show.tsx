import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import KinescopePlayer from '@kinescope/react-kinescope-player';
import { ArrowLeft, Calendar } from 'lucide-react';

interface VideoLesson {
    id: number;
    title: string;
    description?: string;
    lesson_date: string;
    order_index: number;
    kinescope_video_id: string;
    playlist: {
        id: number;
        title: string;
    };
}

interface Props {
    videoLesson: VideoLesson;
    auth: {
        user: {
            tel: string;
        };
    };
}

export default function VideoLessonShow({ videoLesson, auth }: Props) {
    console.log('video lesson:', videoLesson);
    return (
        <AppLayout>
            <Head title={videoLesson.title} />

            <div className="p-6">
                <div className="mb-6">
                    <Link href={`/playlists/${videoLesson.playlist.id}`}>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Назад
                        </Button>
                    </Link>
                </div>

                <div className="mx-auto max-w-4xl">
                    <div className="mb-6">
                        <div className="mb-2 flex items-center space-x-2">
                            <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Урок {videoLesson.order_index}
                            </span>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-4 w-4" />
                                <div className="mr-1">Занятие за</div>
                                {new Date(
                                    videoLesson.lesson_date,
                                ).toLocaleDateString('ru-RU')}
                            </div>
                        </div>

                        <h1 className="mb-4 text-2xl font-bold text-foreground">
                            {videoLesson.title}
                        </h1>

                        {videoLesson.description && (
                            <p className="mb-6 text-muted-foreground">
                                {videoLesson.playlist.title}
                            </p>
                        )}
                    </div>

                    <div className="mb-6 overflow-hidden rounded-2xl">
                        <div className="relative aspect-video w-full">
                            <KinescopePlayer
                                videoId={videoLesson.kinescope_video_id}
                                width="100%"
                                height="100%"
                                language="ru"
                                controls={true}
                                autoPause={true}
                                localStorage={true}
                                watermark={{
                                    text: auth.user.tel,
                                    mode: 'stripes',
                                    scale: 0.3,
                                    displayTimeout: {
                                        visible: 3000,
                                        hidden: 1000,
                                    },
                                }}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg bg-muted p-4">
                        <h3 className="mb-2 font-semibold text-foreground">
                            Информация о видео
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {videoLesson.description}
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
