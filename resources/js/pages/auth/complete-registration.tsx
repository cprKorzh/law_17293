import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    token: string;
    userData?: {
        name?: string;
        surname?: string;
        patronimic?: string;
        username: string;
        email?: string;
        tel: string;
    };
    user?: {
        name?: string;
        surname?: string;
        patronimic?: string;
        username: string;
        email?: string;
        tel: string;
    };
}

export default function CompleteRegistration({ token, userData, user }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/register/${token}`);
    };

    // Используем данные пользователя или userData в зависимости от сценария
    const currentUser = user || userData;
    const isPasswordReset = !!user;

    const fullName = currentUser
        ? [currentUser.surname, currentUser.name, currentUser.patronimic]
              .filter(Boolean)
              .join(' ')
        : '';

    const title = isPasswordReset
        ? 'Установка пароля'
        : 'Завершение регистрации';
    const subtitle = isPasswordReset
        ? 'Создайте пароль для вашего аккаунта'
        : 'Создайте пароль для завершения регистрации';
    const accountLabel = isPasswordReset
        ? 'Ваш аккаунт:'
        : 'Данные пользователя:';
    const buttonText = isPasswordReset
        ? 'Установить пароль'
        : 'Завершить регистрацию';
    const processingText = isPasswordReset
        ? 'Сохранение...'
        : 'Создание аккаунта...';

    return (
        <AuthLayout title={title} description={subtitle}>
            <Head title={title} />

            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {title}
                    </h1>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>

                <div className="space-y-4">
                    {currentUser && (
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <h3 className="mb-2 font-medium">{accountLabel}</h3>
                            <div className="space-y-1 text-sm">
                                {fullName && (
                                    <p>
                                        <strong>ФИО:</strong> {fullName}
                                    </p>
                                )}
                                <p>
                                    <strong>Логин:</strong>{' '}
                                    {currentUser.username}
                                </p>
                                {currentUser.email && (
                                    <p>
                                        <strong>Email:</strong>{' '}
                                        {currentUser.email}
                                    </p>
                                )}
                                <p>
                                    <strong>Телефон:</strong> {currentUser.tel}
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="password">
                                {isPasswordReset ? 'Новый пароль' : 'Пароль'}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder="Введите пароль"
                                required
                                className={
                                    errors.password ? 'border-red-500' : ''
                                }
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password_confirmation">
                                Подтверждение пароля
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                placeholder="Повторите пароль"
                                required
                                className={
                                    errors.password_confirmation
                                        ? 'border-red-500'
                                        : ''
                                }
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? processingText : buttonText}
                        </Button>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
}
