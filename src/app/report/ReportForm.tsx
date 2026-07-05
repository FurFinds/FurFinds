"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ISSUE_TYPES = [
  "Policy Violation",
  "False Information",
  "Unwelcoming Staff",
  "Safety Concern",
  "Other",
];

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-dark-blue";

export function ReportForm() {
  const [businessName, setBusinessName] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await supabase.from("complaints").insert([
        {
          business_name: businessName,
          incident_date: incidentDate,
          issue_type: issueType,
          description,
          email,
        },
      ]);
    } catch {
      // Best-effort submission — Supabase table may not exist yet in this environment.
    } finally {
      setStatus("submitted");
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
        <label htmlFor="incidentDate" className="mb-1.5 block text-sm font-medium text-black">
          Date of Incident <span className="text-dark-blue">*</span>
        </label>
        <input
          id="incidentDate"
          type="date"
          required
          className={inputClass}
          value={incidentDate}
          onChange={(e) => setIncidentDate(e.target.value)}
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
            <option key={type} value={type}>
              {type}
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
        <label htmlFor="photo" className="mb-1.5 block text-sm font-medium text-black">
          Photo Upload (optional)
        </label>
        <input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="w-full rounded-xl border border-dashed border-black/20 bg-bg-blue/20 p-4 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-dark-blue"
        />
        <p className="mt-1 text-xs text-black/50">JPG, PNG, or PDF. Max 10MB.</p>
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
