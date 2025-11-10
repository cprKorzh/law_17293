import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type Group } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    groups?: Group[];
}

export default function Create({ groups = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        surname: '',
        patronimic: '',
        username: '',
        email: '',
        tel: '',
        role: 'user',
        group_id: '',
        created_at: new Date().toISOString().split('T')[0],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AppSidebarLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading>Создание пользователя</Heading>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Новый пользователь</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="surname">Фамилия</Label>
                                    <Input
                                        id="surname"
                                        value={data.surname}
                                        onChange={(e) =>
                                            setData('surname', e.target.value)
                                        }
                                        placeholder="Фамилия"
                                    />
                                    <InputError message={errors.surname} />
                                </div>
                                <div>
                                    <Label htmlFor="name">Имя</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Имя"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div>
                                    <Label htmlFor="patronimic">Отчество</Label>
                                    <Input
                                        id="patronimic"
                                        value={data.patronimic}
                                        onChange={(e) =>
                                            setData(
                                                'patronimic',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Отчество"
                                    />
                                    <InputError message={errors.patronimic} />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="username">Логин *</Label>
                                <Input
                                    id="username"
                                    value={data.username}
                                    onChange={(e) =>
                                        setData('username', e.target.value)
                                    }
                                    required
                                    placeholder="Логин"
                                />
                                <InputError message={errors.username} />
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Label htmlFor="tel">Телефон *</Label>
                                <Input
                                    id="tel"
                                    type="tel"
                                    value={data.tel}
                                    onChange={(e) =>
                                        setData('tel', e.target.value)
                                    }
                                    required
                                    placeholder="+7 900 123 45 67"
                                />
                                <InputError message={errors.tel} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="role">Роль *</Label>
                                    <Select
                                        value={data.role}
                                        onValueChange={(value) =>
                                            setData('role', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">
                                                Пользователь
                                            </SelectItem>
                                            <SelectItem value="admin">
                                                Администратор
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role} />
                                </div>

                                <div>
                                    <Label htmlFor="group_id">Группа *</Label>
                                    <Select
                                        value={data.group_id}
                                        onValueChange={(value) =>
                                            setData('group_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите группу" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {groups.map((group) => (
                                                <SelectItem
                                                    key={group.id}
                                                    value={group.id.toString()}
                                                >
                                                    {group.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.group_id} />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="created_at">
                                    Дата добавления *
                                </Label>
                                <Input
                                    id="created_at"
                                    type="date"
                                    value={data.created_at}
                                    onChange={(e) =>
                                        setData('created_at', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.created_at} />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    Создать пользователя
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/users">Отмена</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
