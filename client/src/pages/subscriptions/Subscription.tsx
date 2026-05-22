import { useEffect, useState } from "react";
import API from "../../services/api";
import { getUserFromStorage } from "../helpers/GetUserInfo";
import { GetPlan } from "../../components/GetPlan";
import {
    Crown,
    CalendarDays,
    MailIcon,
    UserCircle2Icon,
} from "lucide-react";

export default function Subscription() {

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const userInfo = getUserFromStorage();

    // FETCH USER
    const fetchUser = async () => {
        try {
            setLoading(true);
            const { data } = await API.get(`/dashboard/users/${userInfo?._id}`);
            setUser(data?.user);
            // console.log(data, 'data')
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userInfo?._id) {
            fetchUser();
        }
    }, [userInfo?._id]);

    if (loading) return(
        <div className="min-h-130 flex items-center justify-center">
            <div className="animate-pulse text-teal-600 text-lg font-semibold">
                Loading subscription...
            </div>
        </div>
    )

    return (
        <section className="px-4">
            <div className="max-w-full mx-auto">
                {/* HEADER */}
                <div className="border-b border-gray-200 py-2 mb-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                        {/* LEFT */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-linear-to-r from-teal-500 to-teal-200 p-3 rounded-sm shadow-md">
                                    <Crown className="text-white w-6 h-6" />
                                </div>

                                <h1 className="text-2xl md:text-3xl font-extrabold text-teal-800">
                                    Subscription Dashboard
                                </h1>
                            </div>

                            <p className="text-gray-500 max-w-2xl">
                                Manage your active subscription,
                                billing details, and premium
                                features from one place.
                            </p>
                            <p className="font-semibold text-red-800">Plan will expire on {user?.subscriptionEndDate.split("T")[0]}</p>
                        </div>

                        {/* ACTIVE PLAN BADGE */}
                        <div className="bg-linear-to-r from-teal-500 to-teal-200 min-w-50 text-white px-6 py-4 rounded-sm shadow-lg w-fit">

                            <p className="text-sm opacity-90">
                                Current Plan
                            </p>

                            <h2 className="text-2xl font-bold uppercase">
                                {user?.subscription || "No Plan"}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* USER INFO */}
                {user && (
                    <section className="grid md:grid-cols-2 gap-5">
                        <div className="grid grid-cols-1 h-fit gap-5">

                            {/* NAME */}
                            <div className="bg-white flex items-center gap-4">

                                <div className="bg-teal-100 p-3 rounded-sm">
                                    <UserCircle2Icon className="text-teal-600 w-6 h-6" />
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm">
                                        User Name
                                    </p>

                                    <h3 className="text-lg font-bold text-gray-800">
                                        {user?.name}
                                    </h3>
                                </div>
                            </div>
                            {/* EMAIL */}

                            <div className="bg-white flex items-center gap-4">

                                <div className="bg-teal-100 p-3 rounded-sm">
                                    <MailIcon className="text-teal-600 w-6 h-6" />
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm">
                                        User Email
                                    </p>

                                    <h3 className="text-lg font-bold text-gray-800">
                                        {user?.email}
                                    </h3>
                                </div>
                            </div>

                            {/* EXPIRY */}
                            <div className="bg-white flex items-center gap-4">

                                <div className="bg-teal-100 p-3 rounded-sm">
                                    <CalendarDays className="text-teal-600 w-6 h-6" />
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm">
                                        Subscription Ends
                                    </p>

                                    <h3 className="text-lg font-bold text-gray-800">
                                        {user?.subscriptionEndDate
                                            ? new Date(
                                                user.subscriptionEndDate
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })
                                            : "No Plan"}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <GetPlan
                            plan_name={user?.subscription}
                            userInfo={userInfo}
                            status={true}
                        />
                    </section>
                )}
            </div>

        </section>
    );
}