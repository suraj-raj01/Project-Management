import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserFromStorage } from "../../pages/helpers/GetUserInfo";
import { MessageCircle, ThumbsUp, Reply, Edit, Trash } from "lucide-react";

export default function UserTopics() {
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // track loading per discussion
    const [likeLoading, setLikeLoading] = useState<string | null>(null);

    const user = getUserFromStorage();

    const fetchDiscussions = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/discussion/user/${user._id}`);
            // console.log(response?.data?.discussion)
            setDiscussions(response.data?.discussion || []);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch discussions");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (id: string) => {
        try {
            setLikeLoading(id);

            const response = await API.post(
                `/discussion/${id}/like`,
                { userId: user._id }
            );

            setDiscussions((prev) =>
                prev.map((discussion) =>
                    discussion._id === id
                        ? {
                            ...discussion,
                            likes: response.data.likes,
                        }
                        : discussion
                )
            );

        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLikeLoading(null);
        }
    };

    const navigate = useNavigate();

    const updateTopic = (id: string) => {
        navigate(`/dashboard/create-discussion/${id}`)
    }

    const deleteTopic = async (id: string) => {
        toast((t) => (
            <div className="flex flex-col gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                        Delete Discussion Topic
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Are you sure you want to delete this discussion topic?
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-sm hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={async () => {
                            try {
                                await API.delete(`/discussion/${id}`);
                                toast.dismiss(t.id);
                                toast.success("Discussion Deleted Successfully");
                                fetchDiscussions();
                            } catch (error) {
                                console.log(error);
                                toast.error("Failed to delete discussion topic");
                            }
                        }}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-sm hover:bg-red-600 transition">
                        Delete
                    </button>
                </div>
            </div>
        ), {
            duration: 10000,
            style: {
                borderRadius: "4px",
                background: "#fff",
                color: "#111827",
                padding: "12px",
            },
        });
    };

    useEffect(() => {
        fetchDiscussions();
    }, []);

    if (!loading && discussions.length === 0) {
        return (
            <div className="p-10 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 flex items-center justify-center rounded-2xl text-gray-600 shadow-sm">
                No discussions yet. Create a new topic 🚀
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="border-b border-gray-200 rounded-sm p-5 animate-pulse"
                        >
                            <div className="h-5 w-52 bg-gray-200 rounded mb-4" />
                            <div className="h-4 w-full bg-gray-100 rounded mb-2" />
                            <div className="h-4 w-3/4 bg-gray-100 rounded mb-4" />

                            <div className="flex gap-4">
                                <div className="h-4 w-20 bg-gray-200 rounded" />
                                <div className="h-4 w-20 bg-gray-200 rounded" />
                                <div className="h-4 w-20 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                discussions.map((discussion) => (
                    <div
                        key={discussion._id}
                        className="group bg-white hover:border-green-200 hover:shadow-lg transition-all duration-300 md:p-5 p-2"
                    >
                        <section className="flex w-full items-center justify-between">
                            <div className="flex items-center justify-between flex-wrap w-fit gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                    {discussion?.createdBy?.name
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>
                                <div className="flex flex-col items-start gap-0">
                                    <h3 title="View Profile" onClick={() => navigate(`/dashboard/discussion/profile/${discussion?.createdBy._id}`)} className="cursor-pointer hover:text-green-600 font-semibold text-gray-800 uppercase tracking-wide text-sm">
                                        {discussion?.createdBy?.name}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        {new Date(
                                            discussion.createdAt
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3 border px-2 py-1 rounded-sm border-gray-100">
                                <div className="rounded-sm p-1 hover:bg-green-50 hover:text-green-600 cursor-pointer"
                                    onClick={() => { updateTopic(discussion._id) }} >
                                    <Edit size={15} className="text-green-500" />
                                </div>
                                <div className="rounded-sm p-1 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                    onClick={() => { deleteTopic(discussion._id) }} >
                                    <Trash size={15} className="text-red-500" />
                                </div>
                            </div>
                        </section>

                        {/* Top */}
                        <div className="md:max-w-5xl mt-1 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                                    {discussion.title}
                                </h3>

                                <p className="text-md text-gray-600">
                                    {discussion.description}
                                </p>
                            </div>

                            {/* <div className="flex flex-col items-start md:items-end md:min-w-50 gap-2">
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-sm">
                                    Active Discussion
                                </span>
                            </div> */}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap border-b pb-5 items-center gap-6 mt-5 pt-4 border-t border-gray-100">
                            {/* Comments */}
                            <Link
                                to={`/dashboard/discussion/comments/${discussion._id}`}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <MessageCircle size={18} />
                                <span className="font-semibold">
                                    {discussion.replies.length} Comments
                                </span>
                            </Link>

                            {/* Likes */}
                            <button
                                onClick={() =>
                                    handleLike(discussion._id)
                                }
                                disabled={
                                    likeLoading === discussion._id
                                }
                                className={`flex items-center gap-2 text-sm transition-all ${likeLoading === discussion._id
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-gray-600 hover:text-green-600 font-semibold"
                                    }`}
                            >
                                <ThumbsUp size={18} className={discussion.likes.length > 0 ? "text-green-500" : "text-green-600"} />

                                {likeLoading === discussion._id ? (
                                    <span className="animate-pulse font-semibold">
                                        Updating...
                                    </span>
                                ) : (
                                    <span>
                                        {discussion.likes.length} Likes
                                    </span>
                                )}
                            </button>

                            {/* Reply */}
                            <Link
                                to={`/dashboard/discussion/reply/${discussion._id}`}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <Reply size={18} />
                                <span className="font-semibold">Reply</span>
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}