import { CheckCircle2Icon } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
    {
        name: "Free",
        price: "0",
        description:
            "Perfect for individuals and small teams getting started.",
        features: [
            "Able to add only 5 Projects",
            "Able to add only 5 Users",
            "Able to add only 20 Tasks",
            "Basic Reporting",
            "Community Support",
        ],
        button: "Start Free",
        link: "/login",
        popular: false,
    },
    {
        name: "Basic",
        price: "49",
        description:
            "Best for growing teams managing multiple projects efficiently.",
        features: [
            "Able to add 20 Projects",
            "Able to add 20 Users",
            "Able to add 100 Tasks",
            "Advanced Reporting",
            "Team Collaboration",
            "Priority Support",
        ],
        button: "Subscribe Now",
        link: "/payment",
        popular: true,
    },
    {
        name: "Pro",
        price: "99",
        description:
            "For enterprises needing advanced analytics and unlimited access.",
        features: [
            "Able to add Unlimited Projects",
            "Able to add Unlimited Users",
            "Able to add Unlimited Tasks",
            "Able to add AI Insights",
            "Dedicated Support",
            "Custom Integrations",
        ],
        button: "Subscribe Now",
        link: "/payment",
        popular: false,
    },
];

declare global {
    interface Window {
        Razorpay: any;
    }
}

type GetPlanProps = {
    plan_name: string;
    userInfo: UserInfo;
    status: boolean;
};

type UserInfo = {
    _id: string;
    name: string;
    email: string;
    password?: string;
};

export function GetPlan({ plan_name, userInfo, status }: GetPlanProps) {
    // find matching plan
    const [payLoading, setPayLoading] = useState(false);
    const newplan = plans.find((data) => data?.name?.toLowerCase() === plan_name?.toLowerCase());
    // if no plan found
    if (!newplan) {
        return (
            <section className="text-center py-10 text-red-500 font-semibold">
                Plan not found
            </section>
        );
    }
    const navigate = useNavigate();

    const loadRazorpay = () => {
        return new Promise<boolean>((resolve) => {

            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const initPay = (order: any) => {

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Task Management",
            description: "Subscription Payment",
            order_id: order.id,
            handler: async (response: any) => {
                try {
                    const res = await API.post("/payment/verify",
                        {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: userInfo?._id,
                        }
                    );

                    if (res.data.success) {
                        toast.success(res.data.message);
                        navigate("/success");
                    } else {
                        toast.error(res.data.message);
                        navigate("/failed");
                    }

                } catch (error) {
                    console.log(error);
                    toast.error("Payment verification failed");
                }
            },

            prefill: {
                name: userInfo.name,
                email: userInfo.email,
            },

            theme: {
                color: "#14b8a6",
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    const handlePay = async () => {
        try {
            setPayLoading(true);
            const sdkLoaded = await loadRazorpay();
            if (!sdkLoaded) {
                toast.error("Razorpay SDK failed to load");
                return;
            }

            const { data } = await API.post("/payment/plans",
                {
                    newplan,
                    userInfo,
                }
            );

            console.log(data);
            if (!data?.order?.id) {
                toast.error("Invalid order response");
                return;
            }
            initPay(data.order);
        } catch (error) {
            console.log(error);
            toast.error("Payment failed to start");
        } finally {
            setPayLoading(false);
        }
    };

    return (
        <section className="bg-white rounded-2xl ring-4 ring-teal-100 shadow-lg border border-gray-200 p-6 max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center pb-3 text-gray-800 mb-2">
                {newplan.name}
            </h2>

            <p className="text-gray-500 text-center mb-6">
                {newplan.description}
            </p>

            <div className="mb-6 text-center">
                <span className="text-5xl font-extrabold text-teal-600">
                    {newplan.price}{"$"}
                </span>

                <span className="text-gray-500 text-lg">
                    /month
                </span>
            </div>

            <h2 className="py-2 font-bold text-teal-700">All Features :</h2>
            <div className="space-y-3 mb-6">
                {newplan.features.map((feature, index) => (
                    <div
                        key={index}
                        className="rounded-xl px-4 flex gap-2"
                    >
                        <CheckCircle2Icon className="text-teal-500" />{feature}
                    </div>
                ))}
            </div>
            {status ? ("") : (
                <button disabled={status} onClick={handlePay} className="w-full bg-linear-to-r from-teal-500 to-emerald-500 text-white py-3 rounded-full font-bold hover:opacity-90 transition">
                    {payLoading ? "Loading...." : newplan.button}
                </button>
            )}

        </section>
    );
}