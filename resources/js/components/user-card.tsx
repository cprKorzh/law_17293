import TrainingSuspensionDropdown from '@/components/training-suspension-dropdown';
import { Button } from '@/components/ui/button';
import { type User } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    Copy,
    Edit,
    ExternalLink,
    Mail,
    Phone,
    RefreshCw,
    Shield,
    Trash2,
    User as UserIcon,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    user: User & {
        pendingToken?: { id: number; expires_at: string; url: string };
        needsActivation?: boolean;
        isActivated?: boolean;
        isInactive?: boolean;
    };
    isSelected: boolean;
    onSelect: (id: number) => void;
}

export function UserCard({ user, isSelected, onSelect }: Props) {
    const [copied, setCopied] = useState(false);
    const { auth } = usePage<{ auth: { user: { role: string; id: number } } }>()
        .props;

    const fullName =
        [user.surname, user.name, user.patronimic].filter(Boolean).join(' ') ||
        user.username;

    const isCurrentUser = auth.user.id === user.id;

    const handleDelete = () => {
        if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            router.delete(`/admin/users/${user.id}`);
        }
    };

    const handleReissueToken = () => {
        if (
            confirm(
                'Создать новую ссылку для регистрации? Старая ссылка будет отозвана.',
            )
        ) {
            router.post(`/admin/users/${user.id}/reissue-registration-link`);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Ошибка копирования:', err);
        }
    };

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
        <div
            className={`rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-blue-500' : ''
            }`}
        >
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelect(user.id)}
                        disabled={isCurrentUser}
                        className="rounded border-gray-300"
                        title={
                            isCurrentUser
                                ? 'Нельзя выбрать самого себя'
                                : undefined
                        }
                    />
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <UserIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-gray-900">
                            {fullName}
                        </h3>
                        <p className="truncate text-sm text-gray-500">
                            @{user.username}
                        </p>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className="mb-6 space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    {getStatusBadge()}
                </div>
                {user.email && (
                    <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <div className="min-w-0 flex-1">
                            <span className="truncate">{user.email}</span>
                            <span
                                className={`ml-2 rounded px-2 py-1 text-xs ${
                                    user.email_verified_at
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}
                            >
                                {user.email_verified_at
                                    ? 'Подтвержден'
                                    : 'Не подтвержден'}
                            </span>
                        </div>
                    </div>
                )}
                <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <span className="truncate">{user.tel}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <span className="truncate">{user.group?.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <UserIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <span
                        className={`rounded px-2 py-1 text-xs ${
                            user.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                        {user.role === 'admin'
                            ? 'Администратор'
                            : 'Пользователь'}
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <span>
                        {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </span>
                </div>
                {user.role === 'user' && (
                    <div className="flex items-center space-x-3">
                        <div className="h-4 w-4 flex-shrink-0 rounded-full bg-gray-400"></div>
                        <div className="flex items-center space-x-2">
                            <span
                                className={`rounded px-2 py-1 text-xs ${
                                    user.training_suspended
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                }`}
                            >
                                {user.training_suspended
                                    ? 'Приостановлено'
                                    : 'Активно'}
                            </span>
                            {user.training_suspended &&
                                user.suspension_reason && (
                                    <span className="text-xs text-gray-500">
                                        (
                                        {user.suspension_reason ===
                                        'theory_completed'
                                            ? 'Теория завершена'
                                            : user.suspension_reason ===
                                                'user_request'
                                              ? 'По запросу'
                                              : user.suspension_reason ===
                                                  'expired'
                                                ? 'Истек срок'
                                                : user.suspension_reason}
                                        )
                                    </span>
                                )}
                        </div>
                    </div>
                )}
            </div>

            {/* Token Info */}
            {user.pendingToken && (
                <div className="mb-6 rounded-lg bg-blue-50 p-4">
                    <p className="mb-2 text-sm font-medium text-blue-800">
                        Ссылка для активации
                    </p>
                    <p className="mb-3 text-xs text-blue-600">
                        Истекает: {user.pendingToken.expires_at}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                copyToClipboard(user.pendingToken!.url)
                            }
                        >
                            <Copy className="mr-2 h-3 w-3" />
                            {copied ? 'Скопировано!' : 'Копировать'}
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                            <a
                                href={user.pendingToken.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="mr-2 h-3 w-3" />
                                Открыть
                            </a>
                        </Button>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/users/${user.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Редактировать
                    </Link>
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isCurrentUser}
                    title={
                        isCurrentUser ? 'Нельзя удалить самого себя' : undefined
                    }
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить
                </Button>
                {!user.pendingToken &&
                    (user.needsActivation || user.isInactive) && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReissueToken}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Создать ссылку
                        </Button>
                    )}
                <TrainingSuspensionDropdown user={user} />
            </div>
        </div>
    );
}
