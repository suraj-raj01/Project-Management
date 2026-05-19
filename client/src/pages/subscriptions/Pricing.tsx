import { CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
    {
        name: "Free",
        price: "$0",
        description:
            "Perfect for individuals and small teams getting started.",
        features: [
            "5 Projects",
            "20 Tasks",
            "Basic Reporting",
            "Community Support",
        ],
        button: "Start Free",
        popular: false,
    },
    {
        name: "Basic",
        price: "$49",
        description:
            "Best for growing teams managing multiple projects efficiently.",
        features: [
            "20 Projects",
            "100 Tasks",
            "Advanced Reporting",
            "Team Collaboration",
            "Priority Support",
        ],
        button: "Subscribe Now",
        popular: true,
    },
    {
        name: "Pro",
        price: "$99",
        description:
            "For enterprises needing advanced analytics and unlimited access.",
        features: [
            "Unlimited Projects",
            "Unlimited Tasks",
            "AI Insights",
            "Dedicated Support",
            "Custom Integrations",
        ],
        button: "Get Started",
        popular: false,
    },
];

export default function Pricing() {
    return (
        <section className="relative -mt-15 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-100 py-30">
            {/* Background Blur */}
            <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-teal-300/30 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-4">
                {/* Heading */}
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700">
                        <Sparkles className="h-4 w-4" />
                        Flexible Pricing Plans
                    </div>

                    <h2 className="mb-4 text-4xl font-extrabold text-gray-800 md:text-5xl">
                        Simple pricing for every team
                    </h2>

                    <p className="text-lg text-gray-500">
                        Choose the perfect plan for your workflow and boost
                        productivity with powerful project management tools.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:gap-8 gap-12 md:grid-cols-3">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-3xl border bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                                plan.popular
                                    ? "border-teal-500 ring-4 ring-teal-100 scale-105"
                                    : "border-gray-100"
                            }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-2 text-sm font-bold text-white shadow-md">
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            {/* Plan Name */}
                            <div className="mb-6 text-center">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {plan.name}
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    {plan.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mb-8 text-center">
                                <div className="flex items-end justify-center gap-1">
                                    <span className="text-5xl font-extrabold text-gray-800">
                                        {plan.price}
                                    </span>
                                    <span className="mb-1 text-lg text-gray-500">
                                        /month
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-gray-400">
                                    Billed monthly
                                </p>
                            </div>

                            {/* Features */}
                            <ul className="mb-8 space-y-4">
                                {plan.features.map((feature, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-3 text-gray-600"
                                    >
                                        <div className="rounded-full bg-teal-100 p-1">
                                            <CheckCircle2 className="h-4 w-4 text-teal-600" />
                                        </div>

                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Button */}
                            <Link
                                to="/login"
                                className={`block w-full rounded-2xl px-6 py-4 text-center text-sm font-bold transition-all duration-300 ${plan.popular
                                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg hover:opacity-90"
                                    : "border-2 border-teal-500 bg-white text-teal-600 hover:bg-teal-500 hover:text-white"
                                }`}
                            >
                                {plan.button}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}