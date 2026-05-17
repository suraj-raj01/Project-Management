import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

export default function ProjectView() {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data } = await API.get(`/projects/${id}`);
                setProject(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchProject();
    }, [id]);
    return (
        <div>
            <h1>Project View</h1>
            <pre>{JSON.stringify(project, null, 2)}</pre>
        </div>
    );
}