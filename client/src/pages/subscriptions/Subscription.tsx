import { useEffect, useState } from "react";
import API from "../../services/api";
import { getUserFromStorage } from "../helpers/GetUserInfo";
import { GetPlan } from "../../components/GetPlan";
import {
    Crown,
    CalendarDays,
    Loader2,
    MailIcon,
    UserCircle2Icon,
} from "lucide-react";

export default function Subscription() {

    const [loading, setLoading] =
        useState(false);

    const [user, setUser] =
        useState<any>(null);

    const userInfo = getUserFromStorage();

    // FETCH USER
    const fetchUser = async () => {

        try {

            setLoading(true);

            const { data } = await API.get(
                `/dashboard/users/${userInfo?._id}`
            );

            setUser(data?.user);

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

    return (
        <section className="min-h-screen px-4">

            <div className="max-w-full mx-auto">
                {/* HEADER */}
                <div className="bg-white rounded-md shadow-md border border-gray-100 p-6 md:p-8 mb-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                        {/* LEFT */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-linear-to-r from-teal-500 to-teal-200 p-3 rounded-sm shadow-md">
                                    <Crown className="text-white w-7 h-7" />
                                </div>

                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                                    Subscription Dashboard
                                </h1>
                            </div>

                            <p className="text-gray-500 max-w-2xl">
                                Manage your active subscription,
                                billing details, and premium
                                features from one place.
                            </p>
                        </div>

                        {/* ACTIVE PLAN BADGE */}
                        <div className="bg-linear-to-r from-teal-500 to-teal-200 text-white px-6 py-4 rounded-sm shadow-lg w-fit">

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

                        {/* NAME */}
                        <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-md flex items-center gap-4">

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

                        <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-md flex items-center gap-4">

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
                        <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-md flex items-center gap-4">

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
                )}

                {/* PLAN CARD */}
                <div className="flex justify-center">
                    {loading ? (
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-teal-500" />
                            <p className="text-gray-500 font-medium">
                                Loading subscription...
                            </p>
                        </div>

                    ) : (

                        <GetPlan
                            plan_name={user?.subscription}
                            userInfo={userInfo}
                            status={true}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}