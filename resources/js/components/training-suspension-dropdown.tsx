import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { Pause, Play } from 'lucide-react';

interface Props {
    user: {
        id: number;
        training_suspended: boolean;
        suspension_reason?: string;
        role: string;
    };
}

export default function TrainingSuspensionDropdown({ user }: Props) {
    if (user.role === 'admin') return null;

    const getSuspensionReasonText = (reason?: string) => {
        if (!reason) return '';
        return (
            {
                theory_completed: 'Обучение теории окончено',
                user_request: 'По инициативе пользователя',
                expired: 'Окончен срок обучения',
            }[reason] || ''
        );
    };

    const handleToggleTraining = (suspended: boolean, reason?: string) => {
        router.patch(`/admin/users/${user.id}/toggle-training`, {
            training_suspended: suspended,
            suspension_reason: reason,
        });
    };

    if (user.training_suspended) {
        return (
            <div className="flex flex-col gap-1">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleTraining(false)}
                    className="text-green-600 hover:text-green-700"
                >
                    <Play className="mr-1 h-4 w-4" />
                    Приостановлено
                </Button>
                {user.suspension_reason && (
                    <span className="text-xs text-muted-foreground">
                        {getSuspensionReasonText(user.suspension_reason)}
                    </span>
                )}
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                >
                    <Pause className="mr-1 h-4 w-4" />
                    Приостановить
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    onClick={() =>
                        handleToggleTraining(true, 'theory_completed')
                    }
                >
                    Обучение теории окончено
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleToggleTraining(true, 'user_request')}
                >
                    По инициативе пользователя
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleToggleTraining(true, 'expired')}
                >
                    Окончен срок обучения
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
