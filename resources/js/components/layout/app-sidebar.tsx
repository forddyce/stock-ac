import { NavFooter } from '@/components/layout/nav-footer';
import { NavMain } from '@/components/layout/nav-main';
import { NavUser } from '@/components/layout/nav-user';
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
import {
    ArrowLeftRight,
    History,
    LayoutGrid,
    Package,
    Settings,
    ShoppingBag,
    ShoppingCart,
    UserCog,
    Users,
    Warehouse,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<{
        auth: { user: { permissions: string[]; roles: string[] } };
    }>().props;
    const permissions = auth?.user?.permissions || [];

    const hasPermission = (permission: string) =>
        permissions.includes(permission);

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    if (hasPermission('manage_warehouses')) {
        mainNavItems.push({
            title: 'Warehouses',
            href: '/warehouses',
            icon: Warehouse,
        });
    }

    if (hasPermission('manage_items')) {
        mainNavItems.push({
            title: 'Items',
            href: '/items',
            icon: Package,
        });
    }

    if (hasPermission('manage_suppliers')) {
        mainNavItems.push({
            title: 'Suppliers',
            href: '/suppliers',
            icon: Users,
        });
    }

    if (hasPermission('manage_customers')) {
        mainNavItems.push({
            title: 'Customers',
            href: '/customers',
            icon: Users,
        });
    }

    if (hasPermission('manage_sales_persons')) {
        mainNavItems.push({
            title: 'Sales Persons',
            href: '/sales-persons',
            icon: UserCog,
        });
    }

    if (hasPermission('view_purchase') || hasPermission('create_purchase')) {
        mainNavItems.push({
            title: 'Purchases',
            href: '/purchases',
            icon: ShoppingCart,
        });
    }

    if (hasPermission('view_sale') || hasPermission('create_sale')) {
        mainNavItems.push({
            title: 'Sales',
            href: '/sales',
            icon: ShoppingBag,
        });
    }

    if (hasPermission('view_transfer') || hasPermission('create_transfer')) {
        mainNavItems.push({
            title: 'Transfers',
            href: '/transfers',
            icon: ArrowLeftRight,
        });
    }

    if (hasPermission('create_stock_adjustment')) {
        mainNavItems.push({
            title: 'Stock Adjustments',
            href: '/stock-adjustments',
            icon: Settings,
        });
    }

    if (hasPermission('view_item_history')) {
        mainNavItems.push({
            title: 'Item History',
            href: '/item-history',
            icon: History,
        });
    }

    const footerNavItems: NavItem[] = [];

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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {footerNavItems.length > 0 && (
                    <NavFooter items={footerNavItems} className="mt-auto" />
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
