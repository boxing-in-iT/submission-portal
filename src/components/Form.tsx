"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  assignment_description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  github_repo_url: z.string().url("Invalid URL"),
  candidate_level: z.string().min(1, "Select a level"),
});

// Define a type for the form data
type FormData = z.infer<typeof schema>;

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [levels, setLevels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://tools.qa.public.ale.ai/api/tools/candidates/levels")
      .then((res) => res.json())
      .then((data) => setLevels(data.levels))
      .catch(() => alert("Failed to load levels"));
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://tools.qa.public.ale.ai/api/tools/candidates/assignments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (res.ok) {
        window.location.href = "/thank-you";
      } else {
        alert("Submission failed!");
      }
    } catch {
      alert("An error occurred!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Name"
        {...register("name")}
        className="border p-2 w-full"
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <input
        type="email"
        placeholder="Email"
        {...register("email")}
        className="border p-2 w-full"
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <textarea
        placeholder="Assignment Description"
        {...register("assignment_description")}
        className="border p-2 w-full"
      ></textarea>
      {errors.assignment_description && (
        <p className="text-red-500">{errors.assignment_description.message}</p>
      )}

      <input
        type="url"
        placeholder="GitHub Repository URL"
        {...register("github_repo_url")}
        className="border p-2 w-full"
      />
      {errors.github_repo_url && (
        <p className="text-red-500">{errors.github_repo_url.message}</p>
      )}

      <select {...register("candidate_level")} className="border p-2 w-full">
        <option value="">Select a level</option>
        {levels.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
      {errors.candidate_level && (
        <p className="text-red-500">{errors.candidate_level.message}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
