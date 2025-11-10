import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

interface KinescopeVideo {
    id: number;
    title: string;
}

interface Group {
    id: number;
    name: string;
}

interface Props {
    kinescopeVideos: KinescopeVideo[];
    groups: Group[];
}

export default function CreateVideoLesson({ kinescopeVideos, groups }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        lesson_date: '',
        order_index: 0,
        kinescope_video_id: '',
        group_ids: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/video-lessons');
    };

    const handleGroupChange = (groupId: number, checked: boolean) => {
        if (checked) {
            setData('group_ids', [...data.group_ids, groupId]);
        } else {
            setData(
                'group_ids',
                data.group_ids.filter((id) => id !== groupId),
            );
        }
    };

    return (
        <AppLayout>
            <Head title="Создать видеоурок" />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Создать видеоурок</h1>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    <div>
                        <Label htmlFor="title">Название урока</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            error={errors.title}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Описание</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            error={errors.description}
                        />
                    </div>

                    <div>
                        <Label htmlFor="lesson_date">Дата занятия</Label>
                        <Input
                            id="lesson_date"
                            type="date"
                            value={data.lesson_date}
                            onChange={(e) =>
                                setData('lesson_date', e.target.value)
                            }
                            error={errors.lesson_date}
                        />
                    </div>

                    <div>
                        <Label htmlFor="order_index">Порядковый номер</Label>
                        <Input
                            id="order_index"
                            type="number"
                            min="0"
                            value={data.order_index}
                            onChange={(e) =>
                                setData('order_index', parseInt(e.target.value))
                            }
                            error={errors.order_index}
                        />
                    </div>

                    <div>
                        <Label htmlFor="kinescope_video_id">
                            Видео Kinescope
                        </Label>
                        <select
                            id="kinescope_video_id"
                            value={data.kinescope_video_id}
                            onChange={(e) =>
                                setData('kinescope_video_id', e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            <option value="">Выберите видео</option>
                            {kinescopeVideos.map((video) => (
                                <option key={video.id} value={video.id}>
                                    {video.title}
                                </option>
                            ))}
                        </select>
                        {errors.kinescope_video_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.kinescope_video_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Доступные группы</Label>
                        <div className="mt-2 space-y-2">
                            {groups.map((group) => (
                                <div
                                    key={group.id}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={`group-${group.id}`}
                                        checked={data.group_ids.includes(
                                            group.id,
                                        )}
                                        onCheckedChange={(checked) =>
                                            handleGroupChange(
                                                group.id,
                                                checked as boolean,
                                            )
                                        }
                                    />
                                    <Label htmlFor={`group-${group.id}`}>
                                        {group.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {errors.group_ids && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.group_ids}
                            </p>
                        )}
                    </div>

                    <div className="flex space-x-4">
                        <Button type="submit" disabled={processing}>
                            Создать
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Отмена
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
