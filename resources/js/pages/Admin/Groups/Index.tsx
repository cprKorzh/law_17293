import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type Group } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface Props {
    groups: (Group & { users_count: number })[];
}

export default function Index({ groups }: Props) {
    const handleDelete = (group: Group) => {
        if (confirm(`Удалить группу "${group.name}"?`)) {
            router.delete(`/admin/groups/${group.id}`);
        }
    };

    return (
        <AppSidebarLayout>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading>Управление группами</Heading>
                    <Button asChild>
                        <Link href="/admin/groups/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Создать группу
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Список групп</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Название</TableHead>
                                    <TableHead>Описание</TableHead>
                                    <TableHead>Пользователей</TableHead>
                                    <TableHead>Дата создания</TableHead>
                                    <TableHead className="w-32">
                                        Действия
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {groups.map((group) => (
                                    <TableRow key={group.id}>
                                        <TableCell>{group.id}</TableCell>
                                        <TableCell className="font-medium">
                                            {group.name}
                                        </TableCell>
                                        <TableCell>
                                            {group.description || '—'}
                                        </TableCell>
                                        <TableCell>
                                            {group.users_count}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                group.created_at,
                                            ).toLocaleDateString('ru-RU')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/admin/groups/${group.id}/edit`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleDelete(group)
                                                    }
                                                    disabled={
                                                        group.users_count > 0
                                                    }
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
