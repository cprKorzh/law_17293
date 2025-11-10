import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, List, Users, UsersRound, Video } from 'lucide-react';
import AppLogo from './app-logo';

const userNavItems: NavItem[] = [
    {
        title: 'Повтор занятий',
        href: '/playlists',
        icon: List,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Панель управления',
        href: '/admin/users',
        icon: LayoutGrid,
    },
    {
        title: 'Пользователи',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Группы',
        href: '/admin/groups',
        icon: UsersRound,
    },
    {
        title: 'Видео Kinescope',
        href: '/admin/videos',
        icon: Video,
    },
    {
        title: 'Повтор занятий',
        href: '/admin/playlists',
        icon: List,
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const isAdmin = auth?.user?.role === 'admin';
    const isUser = auth?.user?.role === 'user';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {isUser && <NavMain items={userNavItems} />}
                {isAdmin && <NavMain items={adminNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                {/*<NavFooter items={footerNavItems} className="mt-auto" />*/}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
