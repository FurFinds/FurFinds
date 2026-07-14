"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ISSUE_TYPES: { label: string; value: string }[] = [
  { label: "Policy Violation", value: "policy_violation" },
  { label: "False Information", value: "false_information" },
  { label: "Unwelcoming Staff", value: "unwelcoming_staff" },
  { label: "Safety Concern", value: "safety_concern" },
  { label: "Other", value: "other" },
];

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-dark-blue";

export function ReportForm() {
  const [businessName, setBusinessName] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .ilike("name", businessName.trim())
        .maybeSingle();

      const { error: insertError } = await supabase.from("reports").insert({
        business_id: business?.id ?? null,
        user_email: email,
        issue_type: issueType,
        description: business ? description : `[Business: ${businessName}] ${description}`,
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }
      setStatus("submitted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setStatus((s) => (s === "submitting" ? "idle" : s));
    }
  }

  if (status === "submitted") {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-bg-blue/40 px-6 py-16 text-center">
        <CheckCircle2 size={48} className="text-dark-blue" />
        <p className="mt-5 max-w-md text-lg font-medium text-black">
          Thank you. We&apos;ve received your report and will review it within 5-7 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="businessName" className="mb-1.5 block text-sm font-medium text-black">
          Business Name <span className="text-dark-blue">*</span>
        </label>
        <input
          id="businessName"
          required
          className={inputClass}
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="issueType" className="mb-1.5 block text-sm font-medium text-black">
          Issue Type <span className="text-dark-blue">*</span>
        </label>
        <select
          id="issueType"
          required
          className={inputClass}
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
        >
          <option value="">Select an issue type</option>
          {ISSUE_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-black">
          Description <span className="text-dark-blue">*</span>
        </label>
        <textarea
          id="description"
          required
          rows={5}
          className={inputClass}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-black">
          Your Email <span className="text-dark-blue">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="For follow-up"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-light-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-dark-blue disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}
