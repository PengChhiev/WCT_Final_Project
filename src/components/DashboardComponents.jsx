import { Link } from "react-router-dom";

export function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent || "text-gray-800"}`}>{value}</p>
    </div>
  );
}

export function RecentItemsTable({ items }) {
  if (!items.length) {
    return <p className="text-sm text-gray-500 py-6 text-center">No items yet.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 last:border-0">
              <td className="px-4 py-3 font-medium text-gray-800">{item.title}</td>
              <td className="px-4 py-3 capitalize">{item.type}</td>
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
              <td className="px-4 py-3 text-gray-500">{item.location}</td>
              <td className="px-4 py-3 text-right">
                <Link to={`/item/${item.id}`} className="text-blue-600 hover:underline font-medium">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
