import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { settings } from '@/routes/training';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Статус обучения',
        href: settings().url,
    },
];

interface TrainingStatus {
    suspended: boolean;
    suspensionReason?: string;
    daysRemaining: number;
    isActive: boolean;
    isExpired: boolean;
    startedAt: string;
    groupName: string;
}

interface Props {
    trainingStatus: TrainingStatus;
    [key: string]: unknown;
}

export default function Training() {
    const { trainingStatus } = usePage<Props>().props;

    const getTrainingStatusContent = () => {
        if (trainingStatus.suspended) {
            return (
                <div className="p-6 text-center">
                    <div className="mb-2 text-lg font-semibold text-red-600 dark:text-red-400">
                        ⚠️ Обучение приостановлено
                    </div>
                    {trainingStatus.suspensionReason && (
                        <p className="mb-2 text-sm text-muted-foreground">
                            Причина: {trainingStatus.suspensionReason}
                        </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                        Обратитесь к администратору для возобновления обучения
                    </p>
                </div>
            );
        }

        if (trainingStatus.isExpired) {
            return (
                <div className="p-6 text-center">
                    <div className="mb-2 text-lg font-semibold text-orange-600 dark:text-orange-400">
                        📅 Срок обучения истек
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Начало обучения: {trainingStatus.startedAt}
                    </p>
                </div>
            );
        }

        return (
            <div className="p-6 text-center">
                <div className="mb-2 text-lg font-semibold text-green-600 dark:text-green-400">
                    📚 Обучение активно
                </div>
                <p className="mb-1 text-sm text-muted-foreground">
                    Осталось дней:{' '}
                    <span className="font-semibold">
                        {trainingStatus.daysRemaining}
                    </span>
                </p>
                <p className="mb-1 text-sm text-muted-foreground">
                    Группа: {trainingStatus.groupName}
                </p>
                <p className="text-sm text-muted-foreground">
                    Начало обучения: {trainingStatus.startedAt}
                </p>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <Head title="Статус обучения" />

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium">Статус обучения</h3>
                        <p className="text-sm text-muted-foreground">
                            Информация о вашем текущем обучении
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Информация об обучении</CardTitle>
                            <CardDescription>
                                Текущий статус и прогресс обучения
                            </CardDescription>
                        </CardHeader>
                        <CardContent>{getTrainingStatusContent()}</CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
