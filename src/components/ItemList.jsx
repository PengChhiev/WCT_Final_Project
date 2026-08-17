import { Link } from "react-router-dom";
import { db } from "../lib/firebaseClient";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function ItemList({ items, user, role, onEdit, onChanged }) {
  const canManage = (item) => item.postedBy === user?.uid || role === "moderator";

  async function toggleClaimed(item) {
    try {
      await updateDoc(doc(db, "items", item.id), {
        status: item.status === "claimed" ? "active" : "claimed",
      });
      onChanged?.();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    try {
      await deleteDoc(doc(db, "items", item.id));
      onChanged?.();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  }

  if (!items.length) {
    return <p className="text-sm text-gray-500 py-6 text-center">No items to show.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 last:border-0">
              <td className="px-4 py-3 font-medium text-gray-800">
                <Link to={`/item/${item.id}`} className="hover:text-blue-600">
                  {item.title}
                </Link>
              </td>
              <td className="px-4 py-3 capitalize">{item.type}</td>
              <td className="px-4 py-3 capitalize">{item.category?.replace("_", " ")}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    item.status === "claimed"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                {canManage(item) && (
                  <>
                    <button
                      onClick={() => toggleClaimed(item)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {item.status === "claimed" ? "Reopen" : "Mark Claimed"}
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="text-gray-600 hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
