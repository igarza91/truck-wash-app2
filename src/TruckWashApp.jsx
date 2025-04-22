import { useState } from "react";
import { Card, CardContent } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";
import { format } from "date-fns";

const TRUCK_NUMBERS = [
  "123456", "123457", "123458", "123459", "123460",
  "223456", "223457", "223458", "323456", "423456"
];

export default function TruckWashApp() {
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [washedToday, setWashedToday] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("");

  const isAdmin = username.toLowerCase() === "admin";

  const matchingTrucks = TRUCK_NUMBERS.filter(tn => tn.includes(input) && !washedToday.find(w => w.number === tn));

  const handleAdd = (truckNumber) => {
    const now = new Date();
    setWashedToday([...washedToday, { number: truckNumber, time: now }]);
    setInput("");
  };

  const finalizeDay = () => {
    const today = format(new Date(), "yyyy-MM-dd HH:mm");
    setLogs([{ date: today, user: username, trucks: washedToday }, ...logs]);
    setWashedToday([]);
  };

  const deleteLog = (index) => {
    const newLogs = [...logs];
    newLogs.splice(index, 1);
    setLogs(newLogs);
  };

  const exportCSV = () => {
    let csv = "Date,User,Truck Number,Time\n";
    logs.forEach(log => {
      log.trucks.forEach(t => {
        csv += `${log.date},${log.user},${t.number},${format(t.time, "HH:mm")}\n`;
      });
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "truck_wash_logs.csv";
    a.click();
  };

  if (!loggedIn) {
    return (
      <div className="p-4 max-w-md mx-auto space-y-4">
        <h1 className="text-xl font-bold">Truck Wash Login</h1>
        <Input
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button onClick={() => setLoggedIn(true)} disabled={!username.trim()} className="w-full">Login</Button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Truck Wash Log</h1>
      <p className="text-sm">Logged in as <strong>{username}</strong>{isAdmin && " (Admin)"}</p>
      <Input
        placeholder="Enter truck #"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && matchingTrucks.length > 0) handleAdd(matchingTrucks[0]);
        }}
      />

      {input && matchingTrucks.length > 0 && (
        <div className="border rounded p-2 bg-white">
          {matchingTrucks.map((tn) => (
            <div key={tn} className="cursor-pointer hover:bg-gray-100 p-1" onClick={() => handleAdd(tn)}>
              {tn}
            </div>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="space-y-2">
          <h2 className="font-semibold">Washed Today</h2>
          {washedToday.length === 0 && <p className="text-sm text-gray-500">No trucks washed yet.</p>}
          {washedToday.map((t) => (
            <div key={t.number}>{t.number} — {format(t.time, "HH:mm")}</div>
          ))}
          {washedToday.length > 0 && (
            <Button className="mt-2 w-full" onClick={finalizeDay}>Finalize Day</Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2">
          <h2 className="font-semibold">Previous Logs</h2>
          <Input placeholder="Filter by truck or date" value={filter} onChange={(e) => setFilter(e.target.value)} className="mb-2" />
          <Button variant="outline" onClick={exportCSV} className="mb-4">Export CSV</Button>
          {logs.filter(log =>
            log.date.includes(filter) ||
            log.trucks.some(t => t.number.includes(filter))
          ).map((log, i) => (
            <div key={i} className="text-sm">
              <strong>{log.date}</strong> <em>by {log.user}</em>
              <ul className="list-disc ml-4">
                {log.trucks.map((t) => <li key={t.number}>{t.number} @ {format(t.time, "HH:mm")}</li>)}
              </ul>
              {isAdmin && (
                <Button variant="destructive" size="sm" className="mt-1" onClick={() => deleteLog(i)}>Delete</Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
