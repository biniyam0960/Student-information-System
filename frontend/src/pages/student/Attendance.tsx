import React, { useEffect, useState } from "react";

interface AttendanceRecord {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  totalClasses: number;
  attendedClasses: number;
}

const Attendance: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/student/attendance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch attendance records");
        const data: AttendanceRecord[] = await res.json();
        setAttendance(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err) || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [token]);

  if (loading) return <p>Loading attendance records...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (attendance.length === 0) return <p>No attendance records available.</p>;

  const calculatePercentage = (attended: number, total: number) => {
    if (total === 0) return 0;
    return ((attended / total) * 100).toFixed(2);
  };

  return (
    <div className="attendance-page">
      <h2>My Attendance Records</h2>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Title</th>
            <th>Total Classes</th>
            <th>Attended</th>
            <th>Attendance %</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record.courseId}>
              <td>{record.courseCode}</td>
              <td>{record.courseTitle}</td>
              <td>{record.totalClasses}</td>
              <td>{record.attendedClasses}</td>
              <td>{calculatePercentage(record.attendedClasses, record.totalClasses)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
