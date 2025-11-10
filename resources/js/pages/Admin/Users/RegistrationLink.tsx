import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface Props {
    registrationUrl: string;
    userData: {
        name?: string;
        surname?: string;
        patronimic?: string;
        username: string;
        email?: string;
        tel: string;
    };
    expiresAt: string;
}

export default function RegistrationLink({
    registrationUrl,
    userData,
    expiresAt,
}: Props) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(registrationUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Ошибка копирования:', err);
        }
    };

    const fullName = [userData.surname, userData.name, userData.patronimic]
        .filter(Boolean)
        .join(' ');

    return (
        <AppSidebarLayout>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading>Ссылка для регистрации создана</Heading>
                </div>

                <div className="max-w-2xl space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-green-600">
                                ✅ Ссылка успешно создана
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-lg border bg-muted/50 p-4">
                                <h3 className="mb-2 font-medium">
                                    Данные пользователя:
                                </h3>
                                <div className="space-y-1 text-sm">
                                    {fullName && (
                                        <p>
                                            <strong>ФИО:</strong> {fullName}
                                        </p>
                                    )}
                                    <p>
                                        <strong>Логин:</strong>{' '}
                                        {userData.username}
                                    </p>
                                    {userData.email && (
                                        <p>
                                            <strong>Email:</strong>{' '}
                                            {userData.email}
                                        </p>
                                    )}
                                    <p>
                                        <strong>Телефон:</strong> {userData.tel}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="registration-url">
                                    Ссылка для регистрации
                                </Label>
                                <div className="mt-1 flex gap-2">
                                    <Input
                                        id="registration-url"
                                        value={registrationUrl}
                                        readOnly
                                        className="font-mono text-sm"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={copyToClipboard}
                                        className="shrink-0"
                                    >
                                        <Copy className="h-4 w-4" />
                                        {copied ? 'Скопировано!' : 'Копировать'}
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/50">
                                <div className="flex items-start gap-2">
                                    <div className="text-amber-600 dark:text-amber-400">
                                        ⚠️
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium text-amber-800 dark:text-amber-200">
                                            Важная информация:
                                        </p>
                                        <ul className="mt-1 space-y-1 text-amber-700 dark:text-amber-300">
                                            <li>
                                                • Ссылка действительна до:{' '}
                                                <strong>{expiresAt}</strong>
                                            </li>
                                            <li>
                                                • Ссылка может быть использована
                                                только один раз
                                            </li>
                                            <li>
                                                • Передайте ссылку пользователю
                                                любым удобным способом
                                            </li>
                                            <li>
                                                • При необходимости можно
                                                создать новую ссылку
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button asChild>
                                    <a
                                        href={registrationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Открыть ссылку
                                    </a>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/users">
                                        Вернуться к списку
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
