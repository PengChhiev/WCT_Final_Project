import { useEffect, useState } from "react";
import { db } from "../lib/firebaseClient";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";

export default function ItemsManager({ user, role }) {
  const [items, setItems] = useState([]);
  const [view, setView] = useState("list"); // "list" | "form"
  const [editingItem, setEditingItem] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    // Moderators see everything; students see only their own posts here.
    const base = collection(db, "items");
    // Combining a `postedBy` filter with `createdAt` ordering requires a
    // composite Firestore index. Sort a student's own records locally instead.
    const q =
      role === "moderator"
        ? query(base, orderBy("createdAt", "desc"))
        : query(base, where("postedBy", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const nextItems = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (role !== "moderator") {
          nextItems.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        }
        setItems(nextItems);
        setLoadError(null);
      },
      (err) => {
        console.error("Error loading items:", err);
        setLoadError("Could not load your items. Please refresh and try again.");
      }
    );
    return () => unsubscribe();
  }, [user.uid, role]);

  function startCreate() {
    setEditingItem(null);
    setView("form");
  }

  function startEdit(item) {
    setEditingItem(item);
    setView("form");
  }

  function handleSaved() {
    setView("list");
    setEditingItem(null);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          {role === "moderator" ? "All Items" : "My Items"}
        </h1>
        {view === "list" ? (
          <button
            onClick={startCreate}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-semibold hover:bg-blue-700"
          >
            + Post New Item
          </button>
        ) : (
          <button
            onClick={() => setView("list")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            ← Back to list
          </button>
        )}
      </div>

      {loadError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p>}

      {view === "list" ? (
        <ItemList
          items={items}
          user={user}
          role={role}
          onEdit={startEdit}
          onChanged={() => {}}
        />
      ) : (
        <ItemForm user={user} existingItem={editingItem} onSaved={handleSaved} />
      )}
    </div>
  );
}
