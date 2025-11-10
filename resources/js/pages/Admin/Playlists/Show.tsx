import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Edit, Video } from 'lucide-react';

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
    is_active: boolean;
    video_lessons: VideoLesson[];
    groups: Array<{
        id: number;
        name: string;
    }>;
}

interface Props {
    playlist: Playlist;
}

export default function PlaylistShow({ playlist }: Props) {
    return (
        <AppLayout>
            <Head title={playlist.title} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/admin/playlists">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Назад к плейлистам
                        </Button>
                    </Link>

                    <Link href={`/admin/playlists/${playlist.id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Редактировать
                        </Button>
                    </Link>
                </div>

                <div className="mx-auto max-w-4xl">
                    <div className="mb-6 rounded-lg bg-white p-6 shadow">
                        <div className="mb-4 flex items-start justify-between">
                            <div>
                                <h1 className="mb-2 text-2xl font-bold text-gray-900">
                                    {playlist.title}
                                </h1>

                                {playlist.description && (
                                    <p className="mb-4 text-gray-600">
                                        {playlist.description}
                                    </p>
                                )}
                            </div>

                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                                    playlist.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}
                            >
                                {playlist.is_active ? 'Активен' : 'Неактивен'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div>
                                <span className="font-medium text-gray-700">
                                    Видеоуроков:
                                </span>
                                <span className="ml-2 text-gray-900">
                                    {playlist.video_lessons.length}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">
                                    Доступно группам:
                                </span>
                                <span className="ml-2 text-gray-900">
                                    {playlist.groups
                                        .map((group) => group.name)
                                        .join(', ')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white shadow">
                        <div className="border-b px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Видеоуроки
                            </h2>
                        </div>

                        <div className="divide-y">
                            {playlist.video_lessons.map((lesson) => (
                                <div key={lesson.id} className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-2 flex items-center space-x-2">
                                                <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                                                    Урок {lesson.order_index}
                                                </span>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="mr-1 h-4 w-4" />
                                                    {new Date(
                                                        lesson.lesson_date,
                                                    ).toLocaleDateString(
                                                        'ru-RU',
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                                {lesson.title}
                                            </h3>

                                            {lesson.description && (
                                                <p className="mb-3 text-gray-600">
                                                    {lesson.description}
                                                </p>
                                            )}

                                            <div className="flex items-center text-sm text-gray-500">
                                                <Video className="mr-1 h-4 w-4" />
                                                Kinescope:{' '}
                                                {lesson.kinescope_video.title}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
