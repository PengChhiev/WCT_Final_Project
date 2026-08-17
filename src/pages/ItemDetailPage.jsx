import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../lib/firebaseClient";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ItemDetailPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "items", id));
      if (snap.exists()) setItem({ id: snap.id, ...snap.data() });
      setLoading(false);
    }
    load();
  }, [id]);

  async function toggleClaimed() {
    if (!item) return;
    const newStatus = item.status === "claimed" ? "active" : "claimed";
    await updateDoc(doc(db, "items", item.id), { status: newStatus });
    setItem({ ...item, status: newStatus });
  }

  if (loading) return <p className="text-center text-gray-500 py-12">Loading...</p>;
  if (!item) return <p className="text-center text-gray-500 py-12">Item not found.</p>;

  const canManage = user && item.postedBy === user.uid;

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 mb-4">
        ← Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                item.type === "lost" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
              }`}
            >
              {item.type}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                item.status === "claimed" ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-600"
              }`}
            >
              {item.status}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
          <p className="text-gray-600">{item.description}</p>

          <div className="text-sm text-gray-500 space-y-1">
            <p>
              <span className="font-medium text-gray-700">Category:</span> {item.category?.replace("_", " ")}
            </p>
            <p>
              <span className="font-medium text-gray-700">Location:</span> {item.location}
            </p>
          </div>

          {canManage && (
            <button
              onClick={toggleClaimed}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-semibold hover:bg-blue-700"
            >
              {item.status === "claimed" ? "Reopen Item" : "Mark as Claimed"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
