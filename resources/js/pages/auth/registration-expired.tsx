import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';

export default function RegistrationExpired() {
    return (
        <AuthLayout title="Rus-Korea Driving Center" description="">
            <Head title="Ссылка недействительна" />

            <div className="space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Ссылка недействительна
                    </h1>
                    <p className="text-muted-foreground">
                        Ссылка для регистрации истекла или уже была
                        использована. Обратитесь к администратору для получения
                        новой ссылки.
                    </p>
                </div>

                <Button asChild>
                    <Link href={login()}>Вернуться к входу</Link>
                </Button>
            </div>
        </AuthLayout>
    );
}
