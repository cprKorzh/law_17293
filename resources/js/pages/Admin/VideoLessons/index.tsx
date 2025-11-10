import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface VideoLesson {
    id: number;
    title: string;
    description?: string;
    lesson_date: string;
    order_index: number;
    is_active: boolean;
    kinescope_video: {
        id: number;
        title: string;
    };
    groups: Array<{
        id: number;
        name: string;
    }>;
}

interface Props {
    videoLessons: VideoLesson[];
}

export default function VideoLessonsIndex({ videoLessons }: Props) {
    return (
        <AppLayout>
            <Head title="Управление видеоуроками" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Видеоуроки</h1>
                    <Link href="/admin/video-lessons/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Добавить урок
                        </Button>
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Порядок
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Название
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Дата занятия
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Группы
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Статус
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {videoLessons.map((lesson) => (
                                <tr key={lesson.id}>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                        {lesson.order_index}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {lesson.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {lesson.kinescope_video.title}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                        {new Date(
                                            lesson.lesson_date,
                                        ).toLocaleDateString('ru-RU')}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                        {lesson.groups
                                            .map((group) => group.name)
                                            .join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                lesson.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {lesson.is_active
                                                ? 'Активен'
                                                : 'Неактивен'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                        <div className="flex justify-end space-x-2">
                                            <Link
                                                href={`/admin/video-lessons/${lesson.id}/edit`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            'Удалить видеоурок?',
                                                        )
                                                    ) {
                                                        // Implement delete
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
