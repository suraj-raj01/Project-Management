// src/pages/discussions/CreateDiscussion.tsx

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import API from "../../services/api";
import { getUserFromStorage } from "../../pages/helpers/GetUserInfo";
import { useNavigate, useParams } from "react-router-dom";

const schema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters long"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters long"),
});

type FormDataType = {
    title: string;
    description: string;
};

type ErrorType = {
    title?: string[];
    description?: string[];
};

export default function CreateDiscussion() {
    const [formData, setFormData] = useState<FormDataType>({
        title: "",
        description: "",
    });
    const [errors, setErrors] = useState<ErrorType>({});
    const [loading, setLoading] = useState(false);

    const user = getUserFromStorage();
    const { id } = useParams();

    const fetchDiscussion = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/discussion/${id}`);
            // console.log(response.data,'data')
            setFormData({
                title: response.data?.discussion?.title,
                description: response?.data?.discussion?.description
            })
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchDiscussion();
        }
    }, [id]);

    const validateForm = (data: FormDataType) => {
        const result = schema.safeParse(data);

        if (result.success) {
            return {};
        }

        return result.error.flatten().fieldErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const updatedData = {
            ...formData,
            [e.target.name]: e.target.value,
        };
        setFormData(updatedData);
    };

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix the errors above");
            return;
        }

        try {
            setLoading(true);
            let res = null;
            if (id) {
                res = await API.put(`/discussion/${id}`, formData);
            } else {
                res = await API.post("/discussion", {
                    ...formData,
                    postedBy: user._id
                });
            }
            toast.success(
                res.data.message || "Discussion created successfully"
            );

            setFormData({
                title: "",
                description: "",
            });
            navigate("/dashboard/discussions");
            setErrors({});
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-3xl mx-auto md:p-8">
            <div className="bg-white shadow-lg rounded-md border border-gray-200 md:p-6 p-3">
                <h1 className="text-2xl text-green-500 font-bold mb-6">
                  {id?"Update Discussion":"Create Discussion"}  
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter discussion title"
                            className={`w-full bg-gray-50 border rounded-sm px-4 py-3 outline-none focus:ring-2 resize-none
                                ${errors.title
                                    ? "border-red-500 focus:ring-red-300"
                                    : "border-gray-200 focus:ring-green-500"
                                }`}
                        />

                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title[0]}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={6}
                            placeholder="Write your discussion..."
                            className={`w-full bg-gray-50 border rounded-sm px-4 py-3 outline-none focus:ring-2 resize-none
                                ${errors.description
                                    ? "border-red-500 focus:ring-red-300"
                                    : "border-gray-200 focus:ring-green-500"
                                }`}
                        />

                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description[0]}
                            </p>
                        )}
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 w-full md:w-auto cursor-pointer text-white px-6 py-2 rounded-sm transition-all disabled:opacity-50"
                    >
                        {loading
                            ? "Submitting..."
                            : id ? "Update Discussion Topic" : "Create Discussion Topic"}
                    </button>
                </form>
            </div>
        </section>
    );
}