import { useEffect, useState } from "react";

const WebSocketPage = () => {
  const [data, setData] = useState([]);
  const [selectedName, setSelectedName] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://10.20.6.64:80/ws");

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData((prev) => {
          // eski ma’lumotlar ichida shu unique_key bo‘lsa — yangilaymiz
          const existing = prev.filter(
            (item) => item.unique_key !== parsed.unique_key
          );
          return [...existing, parsed];
        });
      } catch (err) {
        console.warn("⚠️ Not JSON:", event.data);
      }
    };

    socket.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    return () => socket.close();
  }, []);

  // barcha name’larni unique qilib olish (tablar uchun)
  const names = [...new Set(data.map((item) => item.name))];

  // hozirgi tanlangan tab bo‘yicha filtr
  const filtered = selectedName
    ? data.filter((item) => item.name === selectedName)
    : [];

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-300">
        {names.map((name) => (
          <button
            key={name}
            onClick={() => setSelectedName(name)}
            className={`px-4 py-2 rounded-t-md transition-all ${
              selectedName === name
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Data Table */}
      {selectedName ? (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">{selectedName}</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Node Name</th>
                <th className="p-2">Value</th>
                <th className="p-2">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.unique_key} className="border-b hover:bg-gray-50">
                  <td className="p-2">{item.node_name}</td>
                  <td className="p-2 font-medium">{item.value}</td>
                  <td className="p-2 text-sm text-gray-500">
                    {new Date(item.date_app_timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">Tab tanlang ⬆️</p>
      )}
    </div>
  );
};

export default WebSocketPage;
