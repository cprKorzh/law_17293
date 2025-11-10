import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string | null;
    surname: string | null;
    patronimic: string | null;
    username: string;
    email: string | null;
    tel: string;
    role: 'admin' | 'user';
    group_id: number;
    group?: Group;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    training_suspended: boolean;
    suspension_reason?: 'theory_completed' | 'user_request' | 'expired';
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Group {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}
