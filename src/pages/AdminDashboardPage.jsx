import { useEffect, useState } from "react";
import { db } from "../lib/firebaseClient";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { StatCard, RecentItemsTable } from "../components/DashboardComponents";

export default function AdminDashboardPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const activeCount = items.filter((i) => i.status === "active").length;
  const claimedCount = items.filter((i) => i.status === "claimed").length;
  const lostCount = items.filter((i) => i.type === "lost").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Moderator Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Active Items" value={activeCount} accent="text-blue-600" />
        <StatCard label="Claimed" value={claimedCount} accent="text-green-600" />
        <StatCard label="Reported Lost" value={lostCount} accent="text-red-600" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">All Items</h2>
        <RecentItemsTable items={items} />
      </div>
    </div>
  );
}
