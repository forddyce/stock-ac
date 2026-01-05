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
    ClipboardList,
    FileSpreadsheet,
    History,
    LayoutGrid,
    Package,
    Settings,
    ShoppingBag,
    ShoppingCart,
    UserCog,
    Users,
    UsersRound,
    Warehouse,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<{
        auth: { user: { permissions: string[]; roles: string[] } };
    }>().props;
    const permissions = auth?.user?.permissions || [];
    const roles = auth?.user?.roles || [];

    const hasPermission = (permission: string) =>
        permissions.includes(permission);

    const hasRole = (role: string) => roles.includes(role);

    const isAdmin = hasRole('admin');
    const isPurchaseOperator = hasRole('purchase_operator');
    const isSalesOperator = hasRole('sales_operator');
    const isSalesPurchaseOperator = hasRole('sales_purchase_operator');

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    // Admin can see everything
    // Purchase operator can only see purchases
    // Sales operator can only see sales
    // Sales-purchase operator can see both sales and purchases

    if (isAdmin && hasPermission('manage_warehouses')) {
        mainNavItems.push({
            title: 'Warehouses',
            href: '/warehouses',
            icon: Warehouse,
        });
    }

    if (isAdmin && hasPermission('manage_items')) {
        mainNavItems.push({
            title: 'Items',
            href: '/items',
            icon: Package,
        });
    }

    if (isAdmin && hasPermission('manage_suppliers')) {
        mainNavItems.push({
            title: 'Suppliers',
            href: '/suppliers',
            icon: Users,
        });
    }

    if (isAdmin && hasPermission('manage_customers')) {
        mainNavItems.push({
            title: 'Customers',
            href: '/customers',
            icon: Users,
        });
    }

    if (
        (hasPermission('view_purchase') || hasPermission('create_purchase')) &&
        (isAdmin || isPurchaseOperator || isSalesPurchaseOperator)
    ) {
        mainNavItems.push({
            title: 'Purchases',
            href: '/purchases',
            icon: ShoppingCart,
        });
    }

    if (
        (hasPermission('view_sale') || hasPermission('create_sale')) &&
        (isAdmin || isSalesOperator || isSalesPurchaseOperator)
    ) {
        mainNavItems.push({
            title: 'Sales',
            href: '/sales',
            icon: ShoppingBag,
        });
    }

    if (isAdmin && hasPermission('manage_sales_persons')) {
        mainNavItems.push({
            title: 'Sales Persons',
            href: '/sales-persons',
            icon: UserCog,
        });
    }

    if (
        isAdmin &&
        (hasPermission('view_transfer') || hasPermission('create_transfer'))
    ) {
        mainNavItems.push({
            title: 'Transfers',
            href: '/transfers',
            icon: ArrowLeftRight,
        });
    }

    if (isAdmin && hasPermission('create_stock_adjustment')) {
        mainNavItems.push({
            title: 'Stock Adjustments',
            href: '/stock-adjustments',
            icon: Settings,
        });
    }

    if (isAdmin && hasPermission('view_item_history')) {
        mainNavItems.push({
            title: 'Item History',
            href: '/item-history',
            icon: History,
        });
    }

    if (isAdmin && hasPermission('manage_users')) {
        mainNavItems.push({
            title: 'User Management',
            href: '/users',
            icon: UsersRound,
        });
    }

    if (isAdmin && hasPermission('view_reports')) {
        mainNavItems.push({
            title: 'Sales Report',
            href: '/reports/sales',
            icon: FileSpreadsheet,
        });
    }

    if (isAdmin && hasPermission('view_reports')) {
        mainNavItems.push({
            title: 'Stock Report',
            href: '/reports/stock',
            icon: ClipboardList,
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
