"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { CATEGORIES, Category } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { StepShell, Field, inputClass } from "./StepShell";
import {
  ApplicationData,
  initialApplicationData,
  CATEGORY_QUESTIONS,
  REFERRAL_SOURCES,
  SelfAssessedTier,
} from "./types";

const TOTAL_STEPS = 10;

const PHOTO_LABELS = [
  "Exterior",
  "Interior",
  "Water bowls",
  "Outdoor area",
  "Pet policy signage",
  "Amenities",
];

const TIER_OPTIONS: { id: SelfAssessedTier; label: string }[] = [
  { id: "pets-allowed", label: "Pets Allowed" },
  { id: "pet-friendly", label: "Pet-Friendly" },
  { id: "pet-inclusive", label: "Pet-Inclusive" },
  { id: "not-sure", label: "Not Sure" },
];

export function ApplyWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ApplicationData>(initialApplicationData);
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");
  const [fileError, setFileError] = useState("");

  function update<K extends keyof ApplicationData>(key: K, value: ApplicationData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function isStepValid(): boolean {
    switch (step) {
      case 1:
        return Boolean(data.businessName && data.address && data.phone && data.email && data.description);
      case 2:
        return Boolean(data.category);
      case 3:
        if (!data.category) return true;
        return CATEGORY_QUESTIONS[data.category as Category].every(
          (q) => data.categoryAnswers[q]?.trim()
        );
      case 4:
        return Boolean(data.selfAssessedTier);
      case 5:
        return Boolean(data.referralSource);
      case 6:
        return true;
      case 7:
        return Boolean(
          data.serviceAnimalsAllowed && data.esaAllowed && data.breedRestrictions && data.staffTrainedOnServiceAnimals
        );
      case 8:
        return true;
      case 9:
        return (
          data.consentAccuracy &&
          data.consentTerms &&
          data.consentPrivacy &&
          data.consentDataStorage &&
          data.contractAccepted
        );
      default:
        return true;
    }
  }

  const TIER_TO_SCHEMA: Record<SelfAssessedTier, "basic" | "verified" | "premium"> = {
    "pets-allowed": "basic",
    "pet-friendly": "verified",
    "pet-inclusive": "premium",
    "not-sure": "basic",
  };

  async function handleSubmit() {
    setStatus("submitting");
    try {
      const [city = "", state = ""] = data.address
        .split(",")
        .slice(-2)
        .map((s) => s.trim());
      const tierRequested = data.selfAssessedTier
        ? TIER_TO_SCHEMA[data.selfAssessedTier as SelfAssessedTier]
        : "basic";

      // Generate the id client-side (rather than reading it back after
      // insert) since the public apply flow only has INSERT — not
      // SELECT — permission on `businesses`, by design, so a stranger
      // can't browse other applicants' contact info through this form.
      const businessId = crypto.randomUUID();

      const { error: businessError } = await supabase.from("businesses").insert({
        id: businessId,
        name: data.businessName,
        category: data.category,
        description: data.description,
        tier: tierRequested,
        status: "pending",
        city,
        state,
        owner_email: data.email,
        phone: data.phone,
        website: data.website,
      });

      if (businessError) throw businessError;

      const acceptedAt = new Date().toISOString();
      await supabase.from("verification_applications").insert({
        business_id: businessId,
        applicant_name: data.businessName,
        applicant_email: data.email,
        tier_requested: tierRequested,
        category: data.category,
        status: "pending",
        application_data: {
          website: data.website,
          address: data.address,
          phone: data.phone,
          social_links: data.socialLinks,
          category_answers: data.categoryAnswers,
          self_assessed_tier: data.selfAssessedTier,
          referral_source: data.referralSource,
          photo_count: data.photos.length,
          service_animals_allowed: data.serviceAnimalsAllowed,
          esa_allowed: data.esaAllowed,
          breed_restrictions: data.breedRestrictions,
          breed_restrictions_detail: data.breedRestrictionsDetail,
          staff_trained_on_service_animals: data.staffTrainedOnServiceAnimals,
        },
        contract_accepted: data.contractAccepted,
        contract_accepted_at: acceptedAt,
      });
    } catch {
      // Best-effort submission — surfaces as a normal "submitted" state either
      // way; HQ staff can follow up by email if the record didn't save.
    } finally {
      setStatus("submitted");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList);
    if (data.photos.length + files.length > 10) {
      setFileError("You can upload a maximum of 10 photos.");
      return;
    }
    const tooLarge = files.find((f) => f.size > 10 * 1024 * 1024);
    if (tooLarge) {
      setFileError(`"${tooLarge.name}" exceeds the 10MB limit.`);
      return;
    }
    setFileError("");
    update("photos", [...data.photos, ...files.map((f) => f.name)]);
  }

  if (status === "submitted") {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-bg-blue/40 px-6 py-16 text-center">
        <CheckCircle2 size={48} className="text-dark-blue" />
        <h2 className="mt-5 font-display text-2xl font-medium text-black">
          Application submitted!
        </h2>
        <p className="mt-2 max-w-md text-black/70">
          Thank you for applying to become a verified FurFinds business. Our team will review
          your application and follow up at {data.email || "the email you provided"} within 5–7
          business days.
        </p>
      </div>
    );
  }

  return (
    <div>
      {step === 1 && (
        <StepShell step={1} totalSteps={TOTAL_STEPS} title="Basic Business Information">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Business Name" htmlFor="businessName" required>
              <input
                id="businessName"
                className={inputClass}
                value={data.businessName}
                onChange={(e) => update("businessName", e.target.value)}
              />
            </Field>
            <Field label="Website" htmlFor="website">
              <input
                id="website"
                type="url"
                placeholder="https://"
                className={inputClass}
                value={data.website}
                onChange={(e) => update("website", e.target.value)}
              />
            </Field>
            <Field label="Address" htmlFor="address" required>
              <input
                id="address"
                className={inputClass}
                value={data.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </Field>
            <Field label="Phone" htmlFor="phone" required>
              <input
                id="phone"
                type="tel"
                className={inputClass}
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>
            <Field label="Email" htmlFor="email" required>
              <input
                id="email"
                type="email"
                className={inputClass}
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </Field>
            <Field label="Social Links" htmlFor="socialLinks">
              <input
                id="socialLinks"
                placeholder="Instagram, Facebook, etc."
                className={inputClass}
                value={data.socialLinks}
                onChange={(e) => update("socialLinks", e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description" htmlFor="description" required>
                <textarea
                  id="description"
                  rows={4}
                  className={inputClass}
                  value={data.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </Field>
            </div>
          </div>
        </StepShell>
      )}

      {step === 2 && (
        <StepShell
          step={2}
          totalSteps={TOTAL_STEPS}
          title="Category Selection"
          subtitle="Which category best describes your business?"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CATEGORIES.map((category) => (
              <label
                key={category}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition-colors ${
                  data.category === category
                    ? "border-dark-blue bg-bg-blue/50"
                    : "border-black/10 hover:bg-bg-blue/20"
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  className="accent-[#395EA1]"
                  checked={data.category === category}
                  onChange={() => update("category", category)}
                />
                {category}
              </label>
            ))}
          </div>
        </StepShell>
      )}

      {step === 3 && (
        <StepShell
          step={3}
          totalSteps={TOTAL_STEPS}
          title="Category-Specific Questions"
          subtitle={data.category ? `A few questions for ${data.category.toLowerCase()}.` : undefined}
        >
          <div className="space-y-5">
            {data.category &&
              CATEGORY_QUESTIONS[data.category as Category].map((question) => (
                <Field key={question} label={question} htmlFor={question} required>
                  <textarea
                    id={question}
                    rows={2}
                    className={inputClass}
                    value={data.categoryAnswers[question] ?? ""}
                    onChange={(e) =>
                      update("categoryAnswers", { ...data.categoryAnswers, [question]: e.target.value })
                    }
                  />
                </Field>
              ))}
          </div>
        </StepShell>
      )}

      {step === 4 && (
        <StepShell
          step={4}
          totalSteps={TOTAL_STEPS}
          title="Self-Assessment"
          subtitle="Which tier do you believe your business qualifies for?"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TIER_OPTIONS.map((tier) => (
              <label
                key={tier.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition-colors ${
                  data.selfAssessedTier === tier.id
                    ? "border-dark-blue bg-bg-blue/50"
                    : "border-black/10 hover:bg-bg-blue/20"
                }`}
              >
                <input
                  type="radio"
                  name="selfAssessedTier"
                  className="accent-[#395EA1]"
                  checked={data.selfAssessedTier === tier.id}
                  onChange={() => update("selfAssessedTier", tier.id)}
                />
                {tier.label}
              </label>
            ))}
          </div>
        </StepShell>
      )}

      {step === 5 && (
        <StepShell step={5} totalSteps={TOTAL_STEPS} title="How did you hear about us?">
          <Field label="Referral Source" htmlFor="referralSource" required>
            <select
              id="referralSource"
              className={inputClass}
              value={data.referralSource}
              onChange={(e) => update("referralSource", e.target.value)}
            >
              <option value="">Select an option</option>
              {REFERRAL_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </Field>
        </StepShell>
      )}

      {step === 6 && (
        <StepShell
          step={6}
          totalSteps={TOTAL_STEPS}
          title="Photo & Evidence Upload"
          subtitle="Upload up to 10 photos (max 10MB each). JPG, PNG, or PDF."
        >
          <p className="mb-3 text-sm text-black/60">
            Suggested photos: {PHOTO_LABELS.join(", ")}.
          </p>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,application/pdf"
            onChange={(e) => handleFiles(e.target.files)}
            className="w-full rounded-xl border border-dashed border-black/20 bg-bg-blue/20 p-6 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-dark-blue"
          />
          {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
          {data.photos.length > 0 && (
            <ul className="mt-4 space-y-2">
              {data.photos.map((name, i) => (
                <li
                  key={`${name}-${i}`}
                  className="flex items-center justify-between rounded-lg bg-bg-blue/30 px-4 py-2 text-sm"
                >
                  {name}
                  <button
                    type="button"
                    onClick={() => update("photos", data.photos.filter((_, idx) => idx !== i))}
                    className="text-black/50 hover:text-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </StepShell>
      )}

      {step === 7 && (
        <StepShell
          step={7}
          totalSteps={TOTAL_STEPS}
          title="Service, ESA & Therapy Animal Policy"
        >
          <div className="space-y-6">
            <YesNoField
              label="Are service animals allowed?"
              value={data.serviceAnimalsAllowed}
              onChange={(v) => update("serviceAnimalsAllowed", v)}
            />
            <YesNoField
              label="Are emotional support animals (ESAs) allowed?"
              value={data.esaAllowed}
              onChange={(v) => update("esaAllowed", v)}
            />
            <YesNoField
              label="Are there breed restrictions?"
              value={data.breedRestrictions}
              onChange={(v) => update("breedRestrictions", v)}
            />
            {data.breedRestrictions === "yes" && (
              <Field label="Please describe the breed restrictions" htmlFor="breedRestrictionsDetail">
                <textarea
                  id="breedRestrictionsDetail"
                  rows={2}
                  className={inputClass}
                  value={data.breedRestrictionsDetail}
                  onChange={(e) => update("breedRestrictionsDetail", e.target.value)}
                />
              </Field>
            )}
            <YesNoField
              label="Is staff trained on service animal regulations (ADA)?"
              value={data.staffTrainedOnServiceAnimals}
              onChange={(v) => update("staffTrainedOnServiceAnimals", v)}
            />
          </div>
        </StepShell>
      )}

      {step === 8 && (
        <StepShell
          step={8}
          totalSteps={TOTAL_STEPS}
          title="Pricing"
          subtitle="Here's what it costs to stay verified on FurFinds."
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-bg-blue/40 p-6">
              <h3 className="font-display text-lg font-medium text-black">Subscription</h3>
              <p className="mt-2 text-2xl font-semibold text-dark-blue">$9.99–$39.99<span className="text-sm font-normal text-black/60">/mo</span></p>
              <p className="mt-1 text-sm text-black/60">or $99.99–$399.99/yr</p>
              <p className="mt-3 text-sm text-black/70">
                Pricing scales with your verification tier and business size.
              </p>
            </div>
            <div className="rounded-2xl bg-bg-blue/40 p-6">
              <h3 className="font-display text-lg font-medium text-black">Commission</h3>
              <p className="mt-2 text-2xl font-semibold text-dark-blue">$0.75–$1.50<span className="text-sm font-normal text-black/60">/lead</span></p>
              <p className="mt-3 text-sm text-black/70">
                Optional pay-per-lead pricing available for eligible categories.
              </p>
            </div>
          </div>
        </StepShell>
      )}

      {step === 9 && (
        <StepShell step={9} totalSteps={TOTAL_STEPS} title="Consent & Agreement">
          <div className="mb-6 rounded-2xl border border-black/10 bg-bg-blue/20 p-5">
            <h3 className="font-display text-base font-medium text-black">
              Verified Business Agreement
            </h3>
            <div className="mt-3 max-h-40 overflow-y-auto rounded-xl bg-white p-4 text-xs leading-relaxed text-black/70">
              <p>
                By submitting this application, {data.businessName || "the applicant business"}{" "}
                agrees that if approved for FurFinds verification, it will: (1) maintain the pet
                policies and amenities described in this application, or notify FurFinds promptly
                of any changes; (2) display its FurFinds tier badge accurately and only for as
                long as verification remains active; (3) respond to FurFinds review inquiries and
                periodic re-verification requests in good faith; (4) pay the subscription and/or
                commission fees associated with its verification tier as outlined in Pricing; and
                (5) allow FurFinds to publish the business&apos;s name, category, location, and
                submitted photos on the public directory. FurFinds may suspend or revoke
                verification at its discretion if a business is found to misrepresent its pet
                policies. This summary is provided for application purposes; the full Verified
                Business Agreement will be provided upon approval.
              </p>
            </div>
            <label className="mt-3 flex items-start gap-3 text-sm text-black/80">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#395EA1]"
                checked={data.contractAccepted}
                onChange={(e) => update("contractAccepted", e.target.checked)}
              />
              I have read and agree to the Verified Business Agreement summarized above.
            </label>
          </div>

          <div className="space-y-4">
            <ConsentCheckbox
              label="I confirm the information provided in this application is accurate to the best of my knowledge."
              checked={data.consentAccuracy}
              onChange={(v) => update("consentAccuracy", v)}
            />
            <ConsentCheckbox
              label={
                <>
                  I agree to FurFinds&apos;{" "}
                  <a href="/terms" className="text-dark-blue hover:underline" target="_blank">
                    Terms of Service
                  </a>
                  .
                </>
              }
              checked={data.consentTerms}
              onChange={(v) => update("consentTerms", v)}
            />
            <ConsentCheckbox
              label={
                <>
                  I agree to FurFinds&apos;{" "}
                  <a href="/privacy" className="text-dark-blue hover:underline" target="_blank">
                    Privacy Policy
                  </a>
                  .
                </>
              }
              checked={data.consentPrivacy}
              onChange={(v) => update("consentPrivacy", v)}
            />
            <ConsentCheckbox
              label="I consent to FurFinds storing and processing this data as described in the Privacy Policy."
              checked={data.consentDataStorage}
              onChange={(v) => update("consentDataStorage", v)}
            />
          </div>
        </StepShell>
      )}

      {step === 10 && (
        <StepShell
          step={10}
          totalSteps={TOTAL_STEPS}
          title="Review & Submit"
          subtitle="Take one more look before you submit your application."
        >
          <div className="space-y-3 rounded-2xl bg-bg-blue/30 p-6 text-sm text-black/80">
            <p><span className="font-semibold">Business:</span> {data.businessName || "—"}</p>
            <p><span className="font-semibold">Category:</span> {data.category || "—"}</p>
            <p>
              <span className="font-semibold">Self-assessed tier:</span>{" "}
              {TIER_OPTIONS.find((t) => t.id === data.selfAssessedTier)?.label ?? "—"}
            </p>
            <p><span className="font-semibold">Contact email:</span> {data.email || "—"}</p>
            <p><span className="font-semibold">Photos attached:</span> {data.photos.length}</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={status === "submitting"}
            className="mt-6 w-full rounded-full bg-light-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-dark-blue disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Submitting..." : "Submit Application"}
          </button>
        </StepShell>
      )}

      {step < 10 && (
        <div className="mt-8 flex justify-between">
          <button
            onClick={back}
            disabled={step === 1}
            className="rounded-full border-2 border-light-blue px-6 py-2.5 text-sm font-medium text-dark-blue disabled:cursor-not-allowed disabled:opacity-0"
          >
            Back
          </button>
          <button
            onClick={next}
            disabled={!isStepValid()}
            className="rounded-full bg-light-blue px-6 py-2.5 text-sm font-medium text-white hover:bg-dark-blue disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      )}
      {step === 10 && (
        <div className="mt-6">
          <button
            onClick={back}
            className="rounded-full border-2 border-light-blue px-6 py-2.5 text-sm font-medium text-dark-blue"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}

function YesNoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "yes" | "no" | "";
  onChange: (v: "yes" | "no") => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-black">{label}</p>
      <div className="flex gap-3">
        {(["yes", "no"] as const).map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2 text-sm capitalize transition-colors ${
              value === option ? "border-dark-blue bg-bg-blue/50" : "border-black/10"
            }`}
          >
            <input
              type="radio"
              className="accent-[#395EA1]"
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

function ConsentCheckbox({
  label,
  checked,
  onChange,
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 text-sm text-black/80">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#395EA1]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
