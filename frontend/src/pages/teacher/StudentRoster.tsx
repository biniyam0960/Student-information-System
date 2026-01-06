import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Student {
    id: string;
    name: string;
    email?: string;
}

const StudentRoster: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchStudents = async () => {
            if (!token || !courseId) return;

            try {
                const res = await fetch(`/api/teacher/course/${courseId}/students`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch students");

                const data: Student[] = await res.json();
                setStudents(data);
            } catch (err: unknown) {
                console.error(err);
                setError(err instanceof Error ? err.message : String(err) || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [courseId, token]);

    if (loading) return <p>Loading students...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (students.length === 0) return <p>No students enrolled in this course.</p>;

    return (
        <div className="student-roster-page">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate("/teacher/courses")}>
                    ← Back to Courses
                </button>
                <h2>Student Roster - Course {courseId}</h2>
            </div>

            <table className="roster-table">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((s) => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.name}</td>
                            <td>{s.email || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="roster-summary">
                <p><strong>Total Students:</strong> {students.length}</p>
            </div>
        </div>
    );
};

export default StudentRoster;
