import React, { useEffect, useState } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
}

const Profile: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/profile") // Replace with your backend API endpoint
      .then(res => res.json())
      .then(data => {
        setStudent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!student) return <p>No profile found.</p>;

  return (
    <div>
      <h2>Welcome, {student.name}!</h2>
      <p>Here’s your profile information:</p>
      <p><strong>ID:</strong> {student.id}</p>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Major:</strong> {student.major}</p>
    </div>
  );
};

export default Profile;
