import { useState } from "react";
import { getUserFromStorage } from "../helpers/GetUserInfo";
import { GetPlan } from "../../components/GetPlan";
import { Link, useParams } from "react-router-dom";

export default function Payment() {
    const [activeTab, setActiveTab] = useState<string>("userinfo");
    const [formData, setFormData] = useState({
        _id: "",
        name: "",
        email: "",
        password: ""
    })
    const [hidePass, setHidePass] = useState(false);
    const { plan } = useParams();
    const user = getUserFromStorage();
    const useCurrentInfo = () => {
        setFormData({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: ""
        })
        setHidePass(true)
    }

    return (
        <section className="max-w-7xl mx-auto p-2 pt-15">
            <div className="flex md:flex-row flex-col items-start gap-2 justify-between">
                {/* tabs */}
                <div className="flex flex-col w-full">
                    <h1 className="font-bold text-teal-800 text-2xl">Payment Section</h1>
                    <p className="mt-4 text-gray-500 max-w-2xl">
                        Unlock powerful features and manage
                        your projects efficiently with our
                        premium plans.
                    </p>
                    <div className="mt-10 h-fit md:min-w-70 w-fit md:mt-2 mb-3 flex gap-2 bg-teal-50 py-2 px-4 rounded-sm">
                        <button
                            onClick={() => setActiveTab("userinfo")}
                            className={`px-2 py-1 cursor-pointer text-sm font-medium border-b-2 transition-all duration-200
                            ${activeTab === "userinfo" ? "border-teal-500 rounded-sm bg-teal-500 text-white" : "border-transparent text-gray-600 hover:bg-teal-100 rounded-sm hover:text-gray-700"
                                }`}
                        >
                            User Information
                        </button>
                        <button
                            onClick={() => setActiveTab("subscription")}
                            className={`px-2 py-1 cursor-pointer text-sm font-medium border-b-2 transition-all duration-200
                            ${activeTab === "subscription" ? "border-teal-500 rounded-sm bg-teal-500 text-white" : "border-transparent text-gray-600 hover:bg-teal-100 rounded-sm hover:text-gray-700"
                                }`}
                        >
                            Subscription
                        </button>
                    </div>
                </div>
                {/* contents */}
                <div className="w-full mt-2">
                    {activeTab === "userinfo" && (
                        <section className="w-full">
                            <div className="mx-auto ring-4 ring-teal-100 shadow-2xl shadow-gray-200 max-w-xl space-y-4 p-6 rounded-xl border border-gray-300">
                                <h1 className="text-center font-bold text-teal-700">USER INFORMATION</h1>
                                <form action="" className="space-y-2 w-full">
                                    <div className="flex flex-col">
                                        <label htmlFor="">Full Name</label>
                                        <input
                                            placeholder="Full name"
                                            value={formData.name}
                                            type="text"
                                            name="name"
                                            className="border border-gray-200 px-5 py-3 rounded-md bg-teal-50/40"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="">Email</label>
                                        <input
                                            placeholder="Email"
                                            value={formData.email}
                                            type="email"
                                            name="email"
                                            className="border border-gray-200 px-5 py-3 rounded-md bg-teal-50/40"
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    {hidePass ? (
                                        ""
                                    ) : (
                                        <div className="flex flex-col">
                                            <label htmlFor="">Password</label>
                                            <input
                                                placeholder="Password"
                                                value={formData.password}
                                                type="password"
                                                name="password"
                                                className="border border-gray-200 px-5 py-3 rounded-md bg-teal-50/40"
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                    )}
                                    <button onClick={() => { setActiveTab("subscription") }} className="bg-teal-500 w-full p-3 rounded-md mt-5 mb-5 text-white font-semibold">Save & Next</button>
                                    {user._id ? (
                                        <p onClick={useCurrentInfo} className="cursor-pointer text-center font-semibold text-teal-600">Use Current Information</p>
                                    ):(
                                        <div className="flex items-center justify-center">
                                            <Link to="/login" className="text-sm text-center font-semibold text-teal-600">If don't have any account, please Login or Register</Link>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </section>
                    )}

                    {activeTab === "subscription" && (
                        <div>
                            <GetPlan plan_name={plan || "Free"} userInfo={formData} status={false}/>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}