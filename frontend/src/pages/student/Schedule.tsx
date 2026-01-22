import React, { useEffect, useState } from "react";

interface ScheduleItem {
  day: string;
  course: string;
  time: string;
}

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/student/schedule")
      .then(res => res.json())
      .then(data => {
        setSchedule(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading schedule...</p>;
  if (schedule.length === 0) return <p>No schedule available.</p>;

  return (
    <div>
      <h2>My Schedule</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Course</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index}>
              <td>{item.day}</td>
              <td>{item.course}</td>
              <td>{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;