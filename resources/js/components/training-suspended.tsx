import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { settings } from '@/routes/training';
import { Link } from '@inertiajs/react';
import { AlertCircle, Settings } from 'lucide-react';

interface Props {
    suspensionReason?: string;
}

export function TrainingSuspended({ suspensionReason }: Props) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <CardTitle className="text-xl">Обучение приостановлено</CardTitle>
                    <CardDescription>
                        Доступ к материалам временно ограничен
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {suspensionReason && (
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm">
                                <strong>Причина:</strong> {suspensionReason}
                            </p>
                        </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground text-center">
                        Для возобновления обучения обратитесь к администратору или проверьте статус в настройках.
                    </p>

                    <Button asChild variant="outline" className="w-full">
                        <Link href={settings().url}>
                            <Settings className="mr-2 h-4 w-4" />
                            Проверить статус обучения
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
