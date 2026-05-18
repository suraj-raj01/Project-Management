import { useState } from "react";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";
const UserTopics = lazy(() => import("./UserTopics"))
const AllTopics = lazy(() => import("./AllTopics"))
import { Plus } from "lucide-react";

export default function Discussion() {
    const [activeTab, setActiveTab] = useState<string>("all");

    function Loader() {
        return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div></div>
    }
    return (
        <Suspense fallback={<Loader />}>
            <section className="w-full">
                <div className="w-full rounded-sm overflow-hidden">
                    {/* Header */}
                    <div className="pb-2 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-3 justify-between">
                        <div className="text-gray-800">
                            <h2 className="text-3xl font-bold">Team Discussion</h2>
                            <p className="text-sm text-gray-600">Share your thoughts and ideas with the team</p>
                        </div>
                        <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors flex items-center justify-center gap-2">
                            <Plus size={16} /> <Link to="/dashboard/create-discussion">Create New Topic</Link>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="mt-10 md:mt-2 mb-3 flex gap-4 bg-teal-50 py-2 px-4 rounded-sm w-full md:w-fit">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-2 py-1 cursor-pointer text-sm font-medium border-b-2 transition-all duration-200
                            ${activeTab === "all" ? "border-teal-500 rounded-sm bg-teal-500 text-white" : "border-transparent text-gray-600 hover:bg-teal-100 rounded-sm hover:text-gray-700"
                                }`}
                        >
                            All Discussions
                        </button>
                        <button
                            onClick={() => setActiveTab("my")}
                            className={`px-2 py-1 cursor-pointer text-sm font-medium border-b-2 transition-all duration-200
                            ${activeTab === "my" ? "border-teal-500 rounded-sm bg-teal-500 text-white" : "border-transparent text-gray-600 hover:bg-teal-100 rounded-sm hover:text-gray-700"
                                }`}
                        >
                            Your Profile
                        </button>
                    </div>
                    {activeTab === "all" && (
                        <AllTopics />
                    )}

                    {activeTab === "my" && (
                        <UserTopics />
                    )}
                </div>
            </section>
        </Suspense>
    )
}