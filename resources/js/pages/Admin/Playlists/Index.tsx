import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';

interface Playlist {
    id: number;
    title: string;
    description?: string;
    is_active: boolean;
    video_lessons_count: number;
    groups: Array<{
        id: number;
        name: string;
    }>;
}

interface Props {
    playlists: Playlist[];
}

export default function PlaylistsIndex({ playlists }: Props) {
    const handleDelete = (playlistId: number) => {
        if (confirm('Удалить повтор занятий?')) {
            router.delete(`/admin/playlists/${playlistId}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Управление повтором занятий" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Повтор занятий</h1>
                    <Link href="/admin/playlists/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Создать повтор
                        </Button>
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Название
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Видео
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
                            {playlists.map((playlist) => (
                                <tr key={playlist.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {playlist.title}
                                            </div>
                                            {playlist.description && (
                                                <div className="text-sm text-gray-500">
                                                    {playlist.description}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                        {playlist.video_lessons_count} видео
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                        {playlist.groups
                                            .map((group) => group.name)
                                            .join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                playlist.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {playlist.is_active
                                                ? 'Активен'
                                                : 'Неактивен'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                        <div className="flex justify-end space-x-2">
                                            <Link
                                                href={`/admin/playlists/${playlist.id}`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link
                                                href={`/admin/playlists/${playlist.id}/edit`}
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
                                                onClick={() =>
                                                    handleDelete(playlist.id)
                                                }
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
