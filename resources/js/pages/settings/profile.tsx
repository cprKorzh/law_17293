import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Настройки профиля',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Настройки профиля" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Информация профиля"
                        description="Обновите ваши личные данные"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Имя</Label>
                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name || ''}
                                        name="name"
                                        autoComplete="given-name"
                                        placeholder="Имя"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="surname">Фамилия</Label>
                                    <Input
                                        id="surname"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.surname || ''}
                                        name="surname"
                                        autoComplete="family-name"
                                        placeholder="Фамилия"
                                    />
                                    <InputError message={errors.surname} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="patronimic">Отчество</Label>
                                    <Input
                                        id="patronimic"
                                        className="mt-1 block w-full"
                                        defaultValue={
                                            auth.user.patronimic || ''
                                        }
                                        name="patronimic"
                                        autoComplete="additional-name"
                                        placeholder="Отчество"
                                    />
                                    <InputError message={errors.patronimic} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="username">Логин</Label>
                                    <Input
                                        id="username"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.username}
                                        name="username"
                                        required
                                        autoComplete="username"
                                        placeholder="Логин"
                                    />
                                    <InputError message={errors.username} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email || ''}
                                        name="email"
                                        autoComplete="email"
                                        placeholder="Email"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {auth.user.role === 'admin' && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="tel">Телефон</Label>
                                        <Input
                                            id="tel"
                                            type="tel"
                                            className="mt-1 block w-full"
                                            defaultValue={auth.user.tel}
                                            name="tel"
                                            required
                                            autoComplete="tel"
                                            placeholder="+7 900 123 45 67"
                                        />
                                        <InputError message={errors.tel} />
                                    </div>
                                )}

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Ваш email не подтвержден.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Нажмите здесь для повторной
                                                    отправки письма
                                                    подтверждения.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    Новая ссылка подтверждения
                                                    отправлена на ваш email.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Сохранить
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Сохранено
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
