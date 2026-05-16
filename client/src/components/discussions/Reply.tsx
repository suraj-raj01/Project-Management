import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getUserFromStorage } from "../../pages/helpers/GetUserInfo";
import { SendHorizonal } from "lucide-react";

export default function Reply() {
    const [loading, setLoading] = useState(false);
    const [discussion, setDiscussion] = useState<any>({});
    const [reply, setReply] = useState("");

    const { id } = useParams();
    const user = getUserFromStorage();

    const fetchDiscussion = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/discussion/${id}`);
            // console.log(response.data);
            setDiscussion(response.data.discussion);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDiscussion();
    }, []);

    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await API.post(`/discussion/${id}/comments`, { comment: reply, userId: user?._id });
            toast.success(response.data?.message || "Reply added successfully");
            setReply("");
            navigate("/dashboard/discussions");
            setLoading(false);
        } catch (error:any) {
            toast.error(error.response.data?.message || "Failed to add reply");
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-130">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
    )

    return (
        <section>
            <div className="flex flex-col gap-4 max-w-5xl md:p-3 rounded-md">
                <h2 className="font-semibold text-md text-gray-500">Posted By-</h2>
                <div className="flex items-center justify-between w-fit flex-wrap gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {discussion?.createdBy?.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </div>
                    <div className="flex flex-col items-start gap-0">
                        <h3 onClick={() => navigate(`/dashboard/discussion/profile/${discussion?.createdBy._id}`)} className="font-semibold text-gray-800 hover:text-green-600 cursor-pointer uppercase tracking-wide text-sm">
                            {discussion?.createdBy?.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                            {new Date(
                                discussion.createdAt
                            ).toLocaleString()}
                        </span>
                    </div>

                </div>
                <div>
                    <h1 className="md:text-3xl uppercase text-green-600 text-xl font-semibold">{discussion?.title}</h1>
                    <p className="text-md md:text-xl py-1 text-gray-500 md:max-w-4xl">{discussion?.description}</p>
                </div>
                <div>
                    <p className="rounded-md flex items-center text-lg text-gray-600">Hi, <span className="text-green-600 px-2 font-bold uppercase">{user?.name}</span></p>
                    <p className="text-md text-gray-500">You can drop your thought on this topic here...</p>
                </div>
                <form onSubmit={handleSubmit} className="flex gap-3 flex-col items-start justify-center w-full">
                    <textarea rows={5} required value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply..." className="w-full bg-gray-50 border border-gray-300 rounded-sm px-4 py-3 outline-none focus:ring-2" />
                    <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-6 py-2 rounded-sm transition-all disabled:opacity-50">
                        {loading ? ("Sending...") : (
                            <div className=" flex items-center justify-center gap-1">
                                SEND REPLY <SendHorizonal className="h-5" />
                            </div>
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
}