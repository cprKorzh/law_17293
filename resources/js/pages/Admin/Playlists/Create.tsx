import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ChevronRight, Folder, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface KinescopeVideo {
    id: string;
    title: string;
}

interface KinescopeFolder {
    id: string;
    name: string;
    children?: KinescopeFolder[];
    videos?: KinescopeVideo[];
}

interface FoldersByProject {
    project: {
        id: string;
        name: string;
    };
    folders: KinescopeFolder[];
}

interface Group {
    id: number;
    name: string;
}

interface VideoLessonData {
    title: string;
    description: string;
    lesson_date: string;
    order_index: number;
    kinescope_video_id: string;
}

interface Props {
    foldersByProject: FoldersByProject[];
    groups: Group[];
}

function VideoSelector({
    onSelect,
    foldersByProject,
}: {
    onSelect: (video: KinescopeVideo) => void;
    foldersByProject: FoldersByProject[];
}) {
    const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

    const toggleFolder = (folderId: string) => {
        const newOpen = new Set(openFolders);
        if (newOpen.has(folderId)) {
            newOpen.delete(folderId);
        } else {
            newOpen.add(folderId);
        }
        setOpenFolders(newOpen);
    };

    const FolderItem = ({
        folder,
        level = 0,
    }: {
        folder: KinescopeFolder;
        level?: number;
    }) => {
        const isOpen = openFolders.has(folder.id);
        const hasChildren = folder.children && folder.children.length > 0;
        const hasVideos = folder.videos && folder.videos.length > 0;

        return (
            <div>
                <div
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
                    style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
                    onClick={() =>
                        (hasChildren || hasVideos) && toggleFolder(folder.id)
                    }
                >
                    {hasChildren || hasVideos ? (
                        <ChevronRight
                            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                        />
                    ) : (
                        <div className="h-4 w-4" />
                    )}
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{folder.name}</span>
                    {hasVideos && (
                        <span className="ml-2 text-xs text-muted-foreground">
                            ({folder.videos!.length} видео)
                        </span>
                    )}
                </div>
                {isOpen && (hasChildren || hasVideos) && (
                    <div>
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
                                        className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50"
                                        onClick={() => onSelect(video)}
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
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-h-64 overflow-y-auto rounded-md border">
            {foldersByProject.map((item) => (
                <div key={item.project.id} className="border-b last:border-b-0">
                    <div className="bg-muted/50 px-4 py-2">
                        <h4 className="text-sm font-medium">
                            {item.project.name}
                        </h4>
                    </div>
                    <div className="p-2">
                        {item.folders.map((folder) => (
                            <FolderItem key={folder.id} folder={folder} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function CreatePlaylist({ foldersByProject, groups }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        group_ids: [] as number[],
        video_lessons: [
            {
                title: '',
                description: '',
                lesson_date: '',
                order_index: 1,
                kinescope_video_id: '',
            },
        ] as VideoLessonData[],
    });

    const [showVideoSelector, setShowVideoSelector] = useState<number | null>(
        null,
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/playlists');
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

    const addVideoLesson = () => {
        setData('video_lessons', [
            ...data.video_lessons,
            {
                title: '',
                description: '',
                lesson_date: '',
                order_index: data.video_lessons.length + 1,
                kinescope_video_id: '',
            },
        ]);
    };

    const removeVideoLesson = (index: number) => {
        const newLessons = data.video_lessons.filter((_, i) => i !== index);
        setData('video_lessons', newLessons);
    };

    const updateVideoLesson = (
        index: number,
        field: keyof VideoLessonData,
        value: VideoLessonData[keyof VideoLessonData],
    ) => {
        const newLessons = [...data.video_lessons];
        newLessons[index] = { ...newLessons[index], [field]: value };
        setData('video_lessons', newLessons);
    };

    const handleVideoSelect = (index: number, video: KinescopeVideo) => {
        updateVideoLesson(index, 'kinescope_video_id', video.id);
        if (!data.video_lessons[index].title) {
            updateVideoLesson(index, 'title', video.title);
        }
        setShowVideoSelector(null);
    };

    const getSelectedVideoTitle = (videoId: string) => {
        for (const project of foldersByProject) {
            for (const folder of project.folders) {
                const findVideo = (
                    f: KinescopeFolder,
                ): KinescopeVideo | null => {
                    if (f.videos) {
                        const video = f.videos.find((v) => v.id === videoId);
                        if (video) return video;
                    }
                    if (f.children) {
                        for (const child of f.children) {
                            const video = findVideo(child);
                            if (video) return video;
                        }
                    }
                    return null;
                };
                const video = findVideo(folder);
                if (video) return video.title;
            }
        }
        return 'Видео не найдено';
    };

    return (
        <AppLayout>
            <Head title="Создать повтор занятий" />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">
                    Создать повтор занятий
                </h1>

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <Label htmlFor="title">Название повтора</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                error={errors.title}
                            />
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
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                Видеоуроки
                            </h3>
                            <Button
                                type="button"
                                onClick={addVideoLesson}
                                variant="outline"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Добавить видео
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {data.video_lessons.map((lesson, index) => (
                                <div
                                    key={index}
                                    className="space-y-4 rounded-lg border p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">
                                            Видео {index + 1}
                                        </h4>
                                        {data.video_lessons.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    removeVideoLesson(index)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label>Название урока</Label>
                                            <Input
                                                value={lesson.title}
                                                onChange={(e) =>
                                                    updateVideoLesson(
                                                        index,
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Видео Kinescope</Label>
                                            <div className="space-y-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full justify-start"
                                                    onClick={() =>
                                                        setShowVideoSelector(
                                                            showVideoSelector ===
                                                                index
                                                                ? null
                                                                : index,
                                                        )
                                                    }
                                                >
                                                    {lesson.kinescope_video_id
                                                        ? getSelectedVideoTitle(
                                                              lesson.kinescope_video_id,
                                                          )
                                                        : 'Выберите видео'}
                                                </Button>
                                                {showVideoSelector ===
                                                    index && (
                                                    <VideoSelector
                                                        foldersByProject={
                                                            foldersByProject
                                                        }
                                                        onSelect={(video) =>
                                                            handleVideoSelect(
                                                                index,
                                                                video,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Дата занятия</Label>
                                            <Input
                                                type="date"
                                                value={lesson.lesson_date}
                                                onChange={(e) =>
                                                    updateVideoLesson(
                                                        index,
                                                        'lesson_date',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Порядковый номер</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={lesson.order_index}
                                                onChange={(e) =>
                                                    updateVideoLesson(
                                                        index,
                                                        'order_index',
                                                        parseInt(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Описание</Label>
                                        <Textarea
                                            value={lesson.description}
                                            onChange={(e) =>
                                                updateVideoLesson(
                                                    index,
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <Button type="submit" disabled={processing}>
                            Создать повтор
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
