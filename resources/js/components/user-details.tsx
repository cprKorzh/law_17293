import { Button } from '@/components/ui/button';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronRight,
    Copy,
    Edit,
    ExternalLink,
    RefreshCw,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    user: User & {
        pendingToken?: {
            id: number;
            expires_at: string;
            url: string;
        };
    };
    isOpen: boolean;
    onToggle: () => void;
}

export function UserDetails({ isOpen, onToggle }: Props) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1"
            onClick={onToggle}
        >
            {isOpen ? (
                <ChevronDown className="h-4 w-4" />
            ) : (
                <ChevronRight className="h-4 w-4" />
            )}
        </Button>
    );
}

export function UserDetailsRow({
    user,
}: {
    user: User & {
        pendingToken?: { id: number; expires_at: string; url: string };
        needsActivation?: boolean;
        isActivated?: boolean;
        isInactive?: boolean;
    };
}) {
    const [copied, setCopied] = useState(false);

    const fullName =
        [user.surname, user.name, user.patronimic].filter(Boolean).join(' ') ||
        user.username;

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

    return (
        <tr className="bg-muted/30">
            <td colSpan={8} className="p-6">
                <div className="flex items-start justify-between gap-8">
                    {/* User Information */}
                    <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <div className="mb-1 font-medium text-gray-500">
                                    ФИО
                                </div>
                                <div className="text-gray-900">{fullName}</div>
                            </div>
                            <div>
                                <div className="mb-1 font-medium text-gray-500">
                                    Логин
                                </div>
                                <div className="text-gray-900">
                                    {user.username}
                                </div>
                            </div>
                            {user.email && (
                                <div>
                                    <div className="mb-1 font-medium text-gray-500">
                                        Email
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-900">
                                            {user.email}
                                        </span>
                                        <span
                                            className={`rounded px-2 py-1 text-xs ${
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

                            {/* Статус аккаунта - показываем только один статус по приоритету */}
                            <div>
                                <div className="mb-1 font-medium text-gray-500">
                                    Статус аккаунта
                                </div>
                                <div className="flex items-center gap-2">
                                    {user.isActivated ? (
                                        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                                            Активирован
                                        </span>
                                    ) : user.pendingToken ? (
                                        <>
                                            <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                                Ожидает активации
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Истекает:{' '}
                                                {user.pendingToken.expires_at}
                                            </span>
                                        </>
                                    ) : user.isInactive ? (
                                        <>
                                            <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">
                                                Неактивный
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Ссылка истекла, создайте новую
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                                Требует активации
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Создайте ссылку для установки
                                                пароля
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {user.pendingToken && (
                                <div>
                                    <div className="mb-1 font-medium text-gray-500">
                                        Ссылка для регистрации
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        user.pendingToken!.url,
                                                    )
                                                }
                                            >
                                                <Copy className="mr-1 h-3 w-3" />
                                                {copied
                                                    ? 'Скопировано!'
                                                    : 'Копировать ссылку'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                asChild
                                            >
                                                <a
                                                    href={user.pendingToken.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="mr-1 h-3 w-3" />
                                                    Открыть
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/users/${user.id}/edit`}>
                                        <Edit className="mr-1 h-4 w-4" />
                                        Редактировать
                                    </Link>
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="mr-1 h-4 w-4" />
                                    Удалить
                                </Button>
                            </div>
                            {!user.pendingToken &&
                                (user.needsActivation || user.isInactive) && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleReissueToken}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        <RefreshCw className="mr-1 h-4 w-4" />
                                        Создать ссылку
                                    </Button>
                                )}
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    );
}
