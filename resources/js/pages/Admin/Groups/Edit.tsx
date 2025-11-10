import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type Group } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    group: Group;
}

export default function Edit({ group }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: group.name,
        description: group.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/groups/${group.id}`);
    };

    return (
        <AppSidebarLayout>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/groups">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading>Редактировать группу</Heading>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Группа: {group.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Название группы</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Введите название группы"
                                    className={
                                        errors.name ? 'border-red-500' : ''
                                    }
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="description">
                                    Описание (необязательно)
                                </Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Введите описание группы"
                                    className={
                                        errors.description
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    Сохранить
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/groups">Отмена</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
