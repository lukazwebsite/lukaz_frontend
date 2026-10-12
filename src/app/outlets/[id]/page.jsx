import { getOutlet, getOutlets } from "@/utils/actions";
import OutletDetail from "@/components/Outlets/OutletDetail";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const res = await getOutlets();
  const outlets = res?.data ?? [];
  return outlets.map((o) => ({ id: String(o.id) }));
}

export async function generateMetadata({ params }) {
  const outlet = await getOutlet(params.id);
  if (!outlet) return { title: "Outlet Not Found" };
  return {
    title: `${outlet.name} — Lukaz Outlets`,
    description: outlet.address || `Visit our ${outlet.name} outlet.`,
  };
}

export default async function OutletDetailPage({ params }) {
  const outlet = await getOutlet(params.id);
  if (!outlet) notFound();

  return <OutletDetail outlet={outlet} />;
}
