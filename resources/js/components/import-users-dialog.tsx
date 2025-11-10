import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { Upload } from 'lucide-react';
import { useState } from 'react';

export function ImportUsersDialog() {
    const [file, setFile] = useState<File | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        router.post('/admin/users-import', formData, {
            onSuccess: () => {
                setIsOpen(false);
                setFile(null);
                setIsUploading(false);
            },
            onError: () => {
                setIsUploading(false);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Импорт
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Импорт пользователей</DialogTitle>
                    <DialogDescription>
                        Загрузите CSV файл с данными пользователей. Формат: name, surname, patronimic, username, email, tel, role, group_name, training_suspended, suspension_reason, created_at
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="file">CSV файл</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".csv,.txt"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Отмена
                        </Button>
                        <Button type="submit" disabled={!file || isUploading}>
                            {isUploading ? 'Загрузка...' : 'Импортировать'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
