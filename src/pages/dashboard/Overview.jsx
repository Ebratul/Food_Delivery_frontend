import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Banknote, ClipboardList, Clock, Mail, Package, Star, Store, Users, Wallet } from "lucide-react";
import { ChartCard, DonutChart, SimpleBarChart, TrendLineChart } from "../../components/dashboard/Charts.jsx";
import PageTitle from "../../components/dashboard/PageTitle.jsx";
import StatCard from "../../components/dashboard/StatCard.jsx";
import Badge, { STATUS_TONE } from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import Table from "../../components/ui/Table.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { get } from "../../lib/api.js";
import { formatDate, formatNumber, formatPrice, STATUS_LABELS } from "../../lib/utils.js";

const ChartSkeleton = () => <Skeleton className="h-[380px]" />;

const orderColumns = (showCustomer) => [
  { key: "orderNumber", header: "Order", render: (o) => <Link to={`/dashboard/orders/${o.id}`} className="font-medium text-brand-600 hover:underline dark:text-brand-300">{o.orderNumber}</Link> },
  ...(showCustomer ? [{ key: "user", header: "Customer", render: (o) => o.user?.name }] : []),
  { key: "restaurant", header: "Restaurant", render: (o) => o.restaurant?.name },
  { key: "createdAt", header: "Date", render: (o) => formatDate(o.createdAt) },
  { key: "total", header: "Total", render: (o) => formatPrice(o.total) },
  { key: "status", header: "Status", render: (o) => <Badge tone={STATUS_TONE[o.status]}>{STATUS_LABELS[o.status]}</Badge> },
];

function UserOverview({ name }) {
  const { data, isLoading } = useQuery({ queryKey: ["dashboard", "user"], queryFn: () => get("/dashboard/user") });
  const d = data?.data;
  return (
    <>
      <PageTitle title={`Hi, ${name.split(" ")[0]} 👋`} description="Here's what's happening with your orders and restaurants." action={<Button to="/explore">Order food</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package} label="Total orders" value={formatNumber(d?.cards.totalOrders)} hint={`${d?.cards.activeOrders ?? 0} in progress`} loading={isLoading} />
        <StatCard icon={Wallet} label="Total spent" value={formatPrice(d?.cards.totalSpent)} tone="accent" hint="Excludes cancelled orders" loading={isLoading} />
        <StatCard icon={Store} label="My restaurants" value={formatNumber(d?.cards.myRestaurants)} tone="success" hint={`${d?.cards.pendingRestaurants ?? 0} awaiting approval`} loading={isLoading} />
        <StatCard icon={Banknote} label="Restaurant revenue (6 mo)" value={formatPrice(d?.cards.partnerRevenue)} hint={`${d?.cards.reviewsWritten ?? 0} reviews written`} loading={isLoading} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {isLoading ? <><ChartSkeleton /><ChartSkeleton /></> : (
          <>
            <ChartCard title="Your spending" description="Orders and amount spent over the last 6 months (line chart)">
              <TrendLineChart data={d.charts.spending} lines={[{ key: "revenue", label: "Spent", money: true }, { key: "orders", label: "Orders" }]} />
            </ChartCard>
            <ChartCard title="Orders by cuisine" description="What you order most (pie chart)">
              {d.charts.cuisines.length ? <DonutChart data={d.charts.cuisines} /> : <EmptyState title="No orders yet" className="h-full border-0" />}
            </ChartCard>
            <ChartCard title="Orders received by your restaurants" description="Last 6 months, per restaurant (bar chart)" className="xl:col-span-2">
              {d.charts.restaurantOrders.length ? <SimpleBarChart data={d.charts.restaurantOrders} dataKey="orders" label="Orders" color="#ff6a2b" />
                : <EmptyState icon={Store} title="No restaurant orders yet" description="List a restaurant to start receiving orders." action={<Button to="/dashboard/restaurants/new">Add restaurant</Button>} className="h-full border-0" />}
            </ChartCard>
          </>
        )}
      </div>
      <h2 className="t-h4 mb-4 mt-10">Recent orders</h2>
      <Table columns={orderColumns(false)} rows={d?.recentOrders} loading={isLoading} empty="You haven't placed any orders yet." caption="Recent orders" />
    </>
  );
}

function AdminOverview() {
  const { data, isLoading } = useQuery({ queryKey: ["dashboard", "admin"], queryFn: () => get("/dashboard/admin") });
  const d = data?.data;
  return (
    <>
      <PageTitle title="Platform overview" description="Live numbers across all restaurants, customers and orders." action={<Button to="/dashboard/admin/restaurants">Review restaurants</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Banknote} label="Total revenue" value={formatPrice(d?.cards.revenue)} hint="All non-cancelled orders" loading={isLoading} />
        <StatCard icon={ClipboardList} label="Total orders" value={formatNumber(d?.cards.totalOrders)} tone="accent" hint={`Average rating ${d?.cards.averageRating ?? "–"} ★`} loading={isLoading} />
        <StatCard icon={Users} label="Users" value={formatNumber(d?.cards.users)} tone="success" hint={`${d?.cards.newUsers ?? 0} joined in the last 30 days`} loading={isLoading} />
        <StatCard icon={Store} label="Live restaurants" value={formatNumber(d?.cards.restaurants)} hint={<Link to="/dashboard/admin/restaurants" className="text-brand-600 hover:underline dark:text-brand-300">{d?.cards.pendingRestaurants ?? 0} pending approval</Link>} loading={isLoading} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {isLoading ? <><ChartSkeleton /><ChartSkeleton /><ChartSkeleton /></> : (
          <>
            <ChartCard title="Revenue & orders" description="Last 6 months (line chart)" className="xl:col-span-2">
              <TrendLineChart data={d.charts.monthly} lines={[{ key: "revenue", label: "Revenue", money: true }, { key: "orders", label: "Orders" }]} />
            </ChartCard>
            <ChartCard title="Order status" description="Last 6 months (pie chart)"><DonutChart data={d.charts.orderStatus} /></ChartCard>
            <ChartCard title="Restaurants per cuisine" description="Approved listings (bar chart)" className="xl:col-span-2">
              <SimpleBarChart data={d.charts.cuisines} dataKey="restaurants" label="Restaurants" />
            </ChartCard>
            <section className="surface rounded-[var(--radius-ui)] p-6">
              <h2 className="t-h4">Top restaurants</h2>
              <p className="mt-1 text-sm text-muted">By revenue, all time</p>
              <ol className="mt-4 space-y-3">
                {d.topRestaurants.map((r, i) => (
                  <li key={r.id} className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-ui)] bg-brand-50 text-sm font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <Link to={`/restaurants/${r.slug}`} className="block truncate font-medium hover:underline">{r.name}</Link>
                      <p className="text-xs text-muted">{r.orders} orders · <Star className="inline h-3 w-3 fill-accent-500 text-accent-500" /> {r.rating}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(r.revenue)}</span>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <StatCard icon={Mail} label="New contact messages" value={formatNumber(d?.cards.newMessages)} tone="accent" hint={<Link to="/dashboard/admin/messages" className="text-brand-600 hover:underline dark:text-brand-300">Open inbox</Link>} loading={isLoading} />
        <StatCard icon={Clock} label="Pending restaurant approvals" value={formatNumber(d?.cards.pendingRestaurants)} tone="success" hint="Listings waiting for review" loading={isLoading} />
      </div>
      <h2 className="t-h4 mb-4 mt-10">Latest orders</h2>
      <Table columns={orderColumns(true)} rows={d?.recentOrders} loading={isLoading} caption="Latest orders" />
    </>
  );
}

export default function Overview() {
  const { user, isAdmin } = useAuth();
  useDocumentTitle("Dashboard");
  return isAdmin ? <AdminOverview /> : <UserOverview name={user.name} />;
}

