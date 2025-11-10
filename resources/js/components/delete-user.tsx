import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, usePage } from '@inertiajs/react';
import { useRef } from 'react';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    
    // Скрываем для обычных пользователей
    if (auth?.user?.role === 'user') {
        return null;
    }

    return (
        <div className="space-y-6">
            <HeadingSmall
                title="Удалить аккаунт"
                description="Удалить аккаунт и все его ресурсы"
            />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">Внимание!</p>
                    <p className="text-sm">
                        Пожалуйста, действуйте осторожно, это действие нельзя
                        будет отменить.
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            Удалить аккаунт
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            Вы уверены, что хотите удалить свой аккаунт?
                        </DialogTitle>
                        <DialogDescription>
                            После удаления вашей учётной записи все её ресурсы и
                            данные также будут удалены безвозвратно. Пожалуйста,
                            введите пароль, чтобы подтвердить, что вы хотите
                            безвозвратно удалить свою учётную запись.
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Пароль
                                        </Label>

                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Пароль"
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                Отмена
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                Удалить аккаунт
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
