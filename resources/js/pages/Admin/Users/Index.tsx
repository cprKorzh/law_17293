import TrainingSuspensionDropdown from '@/components/training-suspension-dropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { UserCard } from '@/components/user-card';
import { ImportUsersDialog } from '@/components/import-users-dialog';
import { UserDetails, UserDetailsRow } from '@/components/user-details';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type Group, type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Download, Grid3X3, List, Plus, Search, Trash2, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Props {
    users: (User & {
        pendingToken?: { id: number; expires_at: string; url: string };
        needsActivation?: boolean;
        isActivated?: boolean;
        isInactive?: boolean;
    })[];
    groups: Group[];
}

export default function UsersIndex({ users, groups }: Props) {
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [groupFilter, setGroupFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'cards' | 'table'>(() => {
        const saved = localStorage.getItem('usersViewMode');
        return saved === 'cards' || saved === 'table' ? saved : 'table';
    });
    const [expandedUser, setExpandedUser] = useState<number | null>(null);
    const itemsPerPage = viewMode === 'cards' ? 12 : 20;

    const toggleViewMode = () => {
        const newMode = viewMode === 'cards' ? 'table' : 'cards';
        setViewMode(newMode);
        localStorage.setItem('usersViewMode', newMode);
    };

    const filteredAndSortedUsers = useMemo(() => {
        const filtered = users.filter((user) => {
            const matchesSearch =
                user.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.surname
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole =
                roleFilter === 'all' || user.role === roleFilter;
            const matchesGroup =
                groupFilter === 'all' ||
                user.group_id.toString() === groupFilter;

            let matchesStatus = true;
            if (statusFilter !== 'all') {
                if (statusFilter === 'activated')
                    matchesStatus = !!user.isActivated;
                else if (statusFilter === 'pending')
                    matchesStatus = !!user.pendingToken;
                else if (statusFilter === 'inactive')
                    matchesStatus = !!user.isInactive;
                else if (statusFilter === 'needs_activation')
                    matchesStatus = !!user.needsActivation;
            }

            return (
                matchesSearch && matchesRole && matchesGroup && matchesStatus
            );
        });

        filtered.sort((a, b) => {
            let aValue: unknown = a[sortBy as keyof User];
            let bValue: unknown = b[sortBy as keyof User];

            if (sortBy === 'name') {
                aValue =
                    [a.surname, a.name, a.patronimic]
                        .filter(Boolean)
                        .join(' ') || a.username;
                bValue =
                    [b.surname, b.name, b.patronimic]
                        .filter(Boolean)
                        .join(' ') || b.username;
            }

            const aStr =
                typeof aValue === 'string'
                    ? aValue.toLowerCase()
                    : String(aValue ?? '');
            const bStr =
                typeof bValue === 'string'
                    ? bValue.toLowerCase()
                    : String(bValue ?? '');

            if (aStr < bStr) return sortOrder === 'asc' ? -1 : 1;
            if (aStr > bStr) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [
        users,
        searchTerm,
        roleFilter,
        groupFilter,
        statusFilter,
        sortBy,
        sortOrder,
    ]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedUsers.slice(
            startIndex,
            startIndex + itemsPerPage,
        );
    }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

    const handleSelectUser = (userId: number) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId],
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === paginatedUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(paginatedUsers.map((user) => user.id));
        }
    };

    const handleMassDelete = () => {
        if (selectedUsers.length === 0) return;

        if (confirm(`Удалить ${selectedUsers.length} пользователей?`)) {
            router.post('/admin/users/mass-delete', {
                user_ids: selectedUsers,
            });
        }
    };

    const toggleUserExpansion = (userId: number) => {
        setExpandedUser(expandedUser === userId ? null : userId);
    };

    return (
        <AppSidebarLayout>
            <div className="space-y-8 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Пользователи
                    </h1>
                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="flex rounded-lg border p-1">
                            <Button
                                variant={
                                    viewMode === 'table' ? 'default' : 'ghost'
                                }
                                size="sm"
                                onClick={toggleViewMode}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={
                                    viewMode === 'cards' ? 'default' : 'ghost'
                                }
                                size="sm"
                                onClick={toggleViewMode}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                        </div>

                        {selectedUsers.length > 0 && (
                            <Button
                                variant="destructive"
                                onClick={handleMassDelete}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Удалить выбранные ({selectedUsers.length})
                            </Button>
                        )}
                        <Button asChild>
                            <Link href="/admin/users/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Добавить пользователя
                            </Link>
                        </Button>
                        
                        <Button asChild variant="outline">
                            <a href="/admin/users-export">
                                <Download className="mr-2 h-4 w-4" />
                                Экспорт
                            </a>
                        </Button>

                        <ImportUsersDialog />
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
                        <div className="lg:col-span-2">
                            <Label htmlFor="search">Поиск</Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Поиск по имени, логину, email..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Роль</Label>
                            <Select
                                value={roleFilter}
                                onValueChange={setRoleFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Все роли
                                    </SelectItem>
                                    <SelectItem value="admin">
                                        Администратор
                                    </SelectItem>
                                    <SelectItem value="user">
                                        Пользователь
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Группа</Label>
                            <Select
                                value={groupFilter}
                                onValueChange={setGroupFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Все группы
                                    </SelectItem>
                                    {groups.map((group) => (
                                        <SelectItem
                                            key={group.id}
                                            value={group.id.toString()}
                                        >
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Статус</Label>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Все статусы
                                    </SelectItem>
                                    <SelectItem value="activated">
                                        Активирован
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Ожидает активации
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Неактивный
                                    </SelectItem>
                                    <SelectItem value="needs_activation">
                                        Требует активации
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Сортировка</Label>
                            <Select
                                value={`${sortBy}-${sortOrder}`}
                                onValueChange={(value) => {
                                    const [field, order] = value.split('-');
                                    setSortBy(field);
                                    setSortOrder(order as 'asc' | 'desc');
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name-asc">
                                        Имя (А-Я)
                                    </SelectItem>
                                    <SelectItem value="name-desc">
                                        Имя (Я-А)
                                    </SelectItem>
                                    <SelectItem value="username-asc">
                                        Логин (А-Я)
                                    </SelectItem>
                                    <SelectItem value="username-desc">
                                        Логин (Я-А)
                                    </SelectItem>
                                    <SelectItem value="created_at-desc">
                                        Дата создания (новые)
                                    </SelectItem>
                                    <SelectItem value="created_at-asc">
                                        Дата создания (старые)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Select All */}
                {paginatedUsers.length > 0 && (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={
                                selectedUsers.length === paginatedUsers.length
                            }
                            onChange={handleSelectAll}
                            className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600">
                            Выбрать все на странице ({paginatedUsers.length})
                        </span>
                    </div>
                )}

                {/* User Cards or Table */}
                {viewMode === 'cards' ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {paginatedUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                isSelected={selectedUsers.includes(user.id)}
                                onSelect={handleSelectUser}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border bg-white shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedUsers.length ===
                                                    paginatedUsers.length &&
                                                paginatedUsers.length > 0
                                            }
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300"
                                        />
                                    </TableHead>
                                    <TableHead>Телефон</TableHead>
                                    <TableHead>Роль</TableHead>
                                    <TableHead>Группа</TableHead>
                                    <TableHead>Статус</TableHead>
                                    <TableHead>Дата создания</TableHead>
                                    <TableHead>Управление</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedUsers.map((user) => {
                                    // const fullName =
                                    //     [
                                    //         user.surname,
                                    //         user.name,
                                    //         user.patronimic,
                                    //     ]
                                    //         .filter(Boolean)
                                    //         .join(' ') || user.username;

                                    const getStatusBadge = () => {
                                        if (user.isActivated) {
                                            return (
                                                <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                                                    Активирован
                                                </span>
                                            );
                                        } else if (user.pendingToken) {
                                            return (
                                                <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                                    Ожидает активации
                                                </span>
                                            );
                                        } else if (user.isInactive) {
                                            return (
                                                <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">
                                                    Неактивный
                                                </span>
                                            );
                                        } else {
                                            return (
                                                <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                                    Требует активации
                                                </span>
                                            );
                                        }
                                    };

                                    return (
                                        <>
                                            <TableRow
                                                key={user.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <TableCell>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(
                                                            user.id,
                                                        )}
                                                        onChange={() =>
                                                            handleSelectUser(
                                                                user.id,
                                                            )
                                                        }
                                                        className="rounded border-gray-300"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {user.tel}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`rounded px-2 py-1 text-xs ${
                                                            user.role ===
                                                            'admin'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}
                                                    >
                                                        {user.role === 'admin'
                                                            ? 'Администратор'
                                                            : 'Пользователь'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {user.group?.name}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge()}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleDateString(
                                                        'ru-RU',
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <TrainingSuspensionDropdown
                                                        user={user}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <UserDetails
                                                        user={user}
                                                        isOpen={
                                                            expandedUser ===
                                                            user.id
                                                        }
                                                        onToggle={() =>
                                                            toggleUserExpansion(
                                                                user.id,
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                            {expandedUser === user.id && (
                                                <UserDetailsRow user={user} />
                                            )}
                                        </>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Empty State */}
                {filteredAndSortedUsers.length === 0 && (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 py-16 text-center">
                        <p className="text-lg text-gray-500">
                            Пользователи не найдены
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                            Попробуйте изменить параметры поиска или фильтры
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                        >
                            Предыдущая
                        </Button>
                        <span className="text-sm text-gray-600">
                            Страница {currentPage} из {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(totalPages, prev + 1),
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            Следующая
                        </Button>
                    </div>
                )}

                {/* Results Info */}
                <div className="text-center text-sm text-gray-600">
                    Показано {paginatedUsers.length} из{' '}
                    {filteredAndSortedUsers.length} пользователей
                    {filteredAndSortedUsers.length !== users.length &&
                        ` (всего: ${users.length})`}
                </div>
            </div>
        </AppSidebarLayout>
    );
}
