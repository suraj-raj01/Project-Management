import { useEffect, useState } from "react";
import API from "../../services/api";
import { useParams } from "react-router-dom";
import {
    CalendarDays,
    MessageCircle,
    User2,
} from "lucide-react";

export default function Comments() {
    const [discussion, setDiscussion] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const { id } = useParams();

    const fetchDiscussion = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/discussion/${id}`);
            setDiscussion(response.data.discussion);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscussion();
    }, []);

    if (loading) return <div className="space-y-4 md:p-8">
        <div>
            <div className="animate-pulse h-6 w-50 bg-gray-200 rounded mb-3" />
            <div className="animate-pulse h-10 md:w-150 bg-gray-200 rounded mb-3" />
            <div className="animate-pulse h-4 w-full bg-gray-200 rounded mb-3" />
        </div>
        <div className="animate-pulse h-8 w-40 bg-gray-200 rounded mb-3" />
        <div className="flex items-center gap-2">
            <div className="animate-pulse h-6 w-40 bg-gray-200 rounded mb-3" />
            <div className="animate-pulse h-6 w-40 bg-gray-200 rounded mb-3" />
        </div>
        <div>

        </div>

        <div className="h-8 w-40 bg-gray-200 animate-pulse rounded mb-3 mt-5" />
        {Array.from({ length: 3 }).map((_, index) => (
            <div
                key={index}
                className="animate-pulse border border-gray-200 rounded-sm p-4"
            >
                <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
                <div className="h-3 w-full bg-gray-200 rounded mb-2" />
                <div className="h-3 w-3/4 bg-gray-200 rounded mb-3" />
                <div className="h-2 w-24 bg-gray-200 rounded" />
            </div>
        ))}
    </div>

    return (
        <section className="min-h-screen">
            <div className="max-w-full">
                {/* Main Discussion Card */}
                <div className="bg-white rounded-md overflow-hidden">
                    {/* Header */}
                    <div className="md:p-8">
                        <div className="flex bg-green-200/50 text-green-700 w-fit px-3.5 py-1.5 text-xs md:text-sm rounded-sm items-center gap-2">
                            <MessageCircle size={22} />
                            <span className="text-xs uppercase tracking-wider font-semibold">
                                Discussion Topic
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl pt-2 font-semibold leading-tight uppercase text-green-600">
                            {discussion?.title}
                        </h1>
                        <p className="text-gray-600 text-md md:text-lg mt-2 leading-snug">
                            {discussion?.description}
                        </p>

                        {/* Meta */}
                        <div className="flex flex-col pt-2">
                            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-xs">
                                <div className="flex items-center gap-2 font-semibold uppercase">
                                    <User2 size={20} className="border rounded-full bg-green-500 text-white p-1" />
                                    <span className="text-xs font-medium">Author :</span>
                                    <span className="hover:text-green-500 cursor-pointer">
                                        {discussion?.createdBy?.name || "Unknown"}
                                    </span>
                                </div>

                                <div className="flex items-center font-semibold gap-2">
                                    <CalendarDays size={16} className="text-green-500" />
                                    <span>
                                        {discussion?.createdAt
                                            ? new Date(
                                                discussion.createdAt
                                            ).toLocaleString()
                                            : ""}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Replies Section */}
                    <div className="md:p-8 py-5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-500">
                                Comments ({discussion?.replies?.length})
                            </h2>
                        </div>

                        {/* Empty Replies */}
                        {!loading &&
                            discussion?.replies?.length === 0 && (
                                <div className="border border-dashed border-gray-300 rounded-md py-14 text-center">
                                    <MessageCircle
                                        size={50}
                                        className="mx-auto text-gray-300 mb-4"
                                    />

                                    <h3 className="text-lg font-semibold text-gray-700">
                                        No replies yet
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-2">
                                        Be the first person to comment on this
                                        discussion.
                                    </p>
                                </div>
                            )}

                        {/* Replies */}
                        <div className="space-y-3 md:max-w-3xl w-full">
                            {discussion?.replies?.map((reply: any) => (
                                <div
                                    key={reply._id}
                                    className="group border-b border-gray-50 bg-white py-2 transition-all duration-300 "
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                                {reply?.user?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}
                                            </div>
                                            <div className="flex flex-col items-start gap-0">
                                                <h3 className="font-semibold text-gray-800 uppercase tracking-wide text-sm">
                                                    {reply?.user?.name}
                                                </h3>
                                                <span className="text-xs font-semibold text-gray-500">
                                                    {new Date(
                                                        reply.createdAt
                                                    ).toLocaleString()}
                                                </span>
                                            </div>

                                        </div>

                                        {/* Content */}
                                    </div>
                                    <h2 className="text-gray-700 mt-3 font-semibold leading-relaxed">COMMENT</h2>
                                    <div className="flex-1">
                                        <p className="text-gray-700 -mt-1 leading-5">
                                            {reply.comment}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}