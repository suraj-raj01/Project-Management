import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserFromStorage } from "../../pages/helpers/GetUserInfo";
import { MessageCircle, ThumbsUp, Reply, Edit, Trash, Plus } from "lucide-react";

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

    return (
        <div className="flex flex-col">

            {loading ? (
                <div className="space-y-4">
                    <div className="fixed w-90 rounded-md right-5 top-50 flex items-center flex-col p-5 border border-gray-200 h-fit">
                        <div className="h-25 w-25 bg-gray-200 rounded-full animate-pulse mb-4"/>
                        <div className="h-13 w-48 bg-gray-100 rounded animate-pulse mb-4"></div>
                        <div className="h-22 w-full bg-gray-200 rounded animate-pulse mb-4" />
                        <div className="w-full">
                            <div className="h-4 w-45 bg-gray-200 rounded animate-pulse mb-4" />
                            <div className="h-8 w-70 bg-gray-100 rounded animate-pulse mb-4" />
                            <div className="h-8 w-60 bg-gray-200 rounded animate-pulse mb-4" />
                            <div className="h-8 w-70 bg-gray-100 rounded animate-pulse mb-4" />
                        </div>
                    </div>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="border-b max-w-3xl border-gray-200 rounded-sm p-5 animate-pulse"
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
                discussions.length === 0 ? (
                    <div className="p-10 max-w-4xl flex flex-col gap-3 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 flex items-center justify-center text-gray-600 shadow-sm">
                        <p className="text-lg font-bold">No discussions yet. Create a new topic 🚀</p>
                        <Link className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors flex items-center justify-center gap-2" to="/dashboard/create-discussion">
                            <Plus size={16} /> Create New Topic
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col-reverse relative lg:flex-row justify-between gap-4">
                        <div className="w-full lg:w-4/5">
                            {discussions.map((discussion) => (
                                <div
                                    key={discussion._id}
                                    className="group bg-white mt-5 rounded-md max-w-3xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-300 p-4"
                                >
                                    <section className="flex gap-4 max-w-full items-center justify-between">
                                        <div className="flex items-center justify-between flex-wrap w-fit gap-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                                {discussion?.createdBy?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <h3 title="View Profile" onClick={() => navigate(`/dashboard/discussion/profile/${discussion?.createdBy._id}`)} className="cursor-pointer hover:text-teal-600 font-semibold text-gray-800 uppercase tracking-wide text-sm">
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
                                            <div className="rounded-sm p-1 hover:bg-teal-50 hover:text-teal-600 cursor-pointer"
                                                onClick={() => { updateTopic(discussion._id) }} >
                                                <Edit size={15} className="text-teal-500" />
                                            </div>
                                            <div className="rounded-sm p-1 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                                onClick={() => { deleteTopic(discussion._id) }} >
                                                <Trash size={15} className="text-red-500" />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Top */}
                                    <div className="md:max-w-4xl mt-1 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-semibold text-gray-900 text-teal-900 transition-colors">
                                                {discussion.title}
                                            </h3>

                                            <p className="text-md text-gray-600">
                                                {discussion.description}
                                            </p>
                                        </div>

                                        {/* <div className="flex flex-col items-start md:items-end md:min-w-50 gap-2">
                                <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-sm">
                                    Active Discussion
                                </span>
                            </div> */}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex max-w-4xl bg-teal-50/50 rounded-sm flex-wrap items-center md:justify-end gap-6 mt-5 px-2 py-4">
                                        {/* Comments */}
                                        <Link
                                            to={`/dashboard/discussion/comments/${discussion._id}`}
                                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors"
                                        >
                                            <MessageCircle size={18} />
                                            <span className="font-semibold">
                                                {discussion.replies.length} Comments
                                            </span>
                                        </Link>

                                        {/* Likes */}
                                        <button
                                            onClick={() => handleLike(discussion._id)}
                                            disabled={likeLoading === discussion._id}
                                            className={`flex items-center cursor-pointer     gap-2 text-sm transition-all ${likeLoading === discussion._id
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-gray-600 hover:text-teal-600 font-semibold"
                                                }`}>
                                            <ThumbsUp size={18} className={discussion.likes.length > 0 ? "text-teal-500" : "text-teal-600"} />

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
                                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors"
                                        >
                                            <Reply size={18} />
                                            <span className="font-semibold">Reply</span>
                                        </Link>
                                    </div>
                                </div>

                            ))}
                        </div>
                        {/* profile */}
                        <div className="md:w-100 pb-5 w-full flex flex-col rounded-md text-gray-600 shadow-md border border-teal-100 sticky top-38 h-fit">
                            <div className="sticky top-20 self-start z-20 w-full">
                                <div className="w-full rounded-b-none rounded-md py-5 px-3 bg-gradient-to-r from-teal-100 to-teal-50">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-25 h-25 mb-3 rounded-full bg-white text-teal-500 flex items-center justify-center shadow-md border-2 font-bold text-6xl">
                                            {user?.name?.charAt(0)?.toUpperCase()}
                                        </div>

                                        <h3 className="font-extrabold text-teal-900 text-3xl uppercase">
                                            {user.name}
                                        </h3>

                                    </div>
                                    <div className="flex px-3 py-3 mt-5 flex-col items-start justify-start w-full bg-white">
                                        <h3 className="font-semibold text-teal-800 md:text-md">
                                            Role : {user.role}
                                        </h3>

                                        <h3 className="font-semibold text-teal-800 md:text-md">
                                            Email : {user.email}
                                        </h3>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="px-3 py-5">
                                    <h3 className="font-semibold text-gray-700 pb-2">
                                        Recent Activity
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-50 text-teal-600">
                                                <MessageCircle size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800">
                                                    {discussions.length} discussion{discussions.length !== 1 ? "s" : ""} created
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {discussions.length === 1 ? "Started" : "Started"} {discussions.length} topics
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-50 text-teal-600">
                                                <ThumbsUp size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800">
                                                    {discussions.reduce((acc, discussion) => acc + discussion.likes.length, 0)} likes
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Received across all topics
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-50 text-teal-600">
                                                <Reply size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800">
                                                    {discussions.reduce((acc, discussion) => acc + discussion.replies.length, 0)} replies
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Engagements on your topics
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
}