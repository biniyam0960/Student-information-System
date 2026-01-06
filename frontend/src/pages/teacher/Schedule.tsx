import React, { useEffect, useState } from "react";

interface ScheduleItem {
  day: string;
  course: string;
  section: string;
  time: string;
}

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/teacher/schedule", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch schedule");

        const data: ScheduleItem[] = await res.json();
        setSchedule(data);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : String(err) || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [token]);

  if (loading) return <p>Loading schedule...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (schedule.length === 0) return <p>No schedule available.</p>;

  return (
    <div className="schedule-page">
      <h2>My Schedule</h2>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Course</th>
            <th>Section</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index}>
              <td>{item.day}</td>
              <td>{item.course}</td>
              <td>{item.section}</td>
              <td>{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;
