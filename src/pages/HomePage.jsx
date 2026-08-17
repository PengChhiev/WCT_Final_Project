import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../lib/firebaseClient";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all"); // all | lost | found

  useEffect(() => {
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const visible = items.filter((item) => filter === "all" || item.type === filter);
  const active = visible.filter((i) => i.status !== "claimed");
  const resolved = visible.filter((i) => i.status === "claimed");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Campus Lost &amp; Found</h1>
        <p className="text-gray-500 mt-2">Lost something? Found something? Post it here.</p>
      </section>

      <div className="flex justify-center gap-2">
        {["all", "lost", "found"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
              filter === f ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Active ({active.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {active.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
          {active.length === 0 && <p className="text-sm text-gray-500">Nothing here yet.</p>}
        </div>
      </section>

      {resolved.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Recently Resolved</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 opacity-60">
            {resolved.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ItemCard({ item }) {
  return (
    <Link
      to={`/item/${item.id}`}
      className="block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.title} className="w-full h-36 object-cover" />
      ) : (
        <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No image
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              item.type === "lost" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
            }`}
          >
            {item.type}
          </span>
          <span className="text-xs text-gray-400 capitalize">{item.category?.replace("_", " ")}</span>
        </div>
        <h3 className="font-semibold text-gray-800">{item.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{item.location}</p>
      </div>
    </Link>
  );
}
