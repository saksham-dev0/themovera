"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";

const ISSUE_TYPES = [
  "Damage",
  "Overcharged",
  "Delay",
  "Cancellation",
  "Movers Behaviour",
  "Other",
] as const;

type IssueType = (typeof ISSUE_TYPES)[number];

const ACCEPTED_FILES = ".jpg,.jpeg,.png,.doc,.docx,.pdf";
/** Convex storage handles far more, but a public form has no business taking 50MB. */
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-display font-semibold text-sm uppercase tracking-[1.2px] text-teal-500 border-b border-border pb-2.5">
      {children}
    </div>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1.5">
      <Label htmlFor={id} className="text-xs uppercase tracking-wide text-ink-800">
        {label}
      </Label>
      {children}
    </div>
  );
}

function GrievanceFormInner() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.grievances.generateUploadUrl);
  const submitGrievance = useMutation(api.grievances.submit);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    if (selected && selected.size > MAX_FILE_BYTES) {
      setError("That file is larger than 10MB. Please attach a smaller file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFile(null);
      return;
    }
    setError(null);
    setFile(selected);
  }

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /** Optional fields go out as undefined rather than "" so they stay unset in Convex. */
  function optional(formData: FormData, key: string) {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : undefined;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      let attachmentStorageId: Id<"_storage"> | undefined;
      if (file) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        });
        if (!result.ok) throw new Error("Upload failed");
        const { storageId } = (await result.json()) as { storageId: Id<"_storage"> };
        attachmentStorageId = storageId;
      }

      await submitGrievance({
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        altPhone: optional(formData, "altPhone"),
        address: String(formData.get("address") ?? "").trim(),
        city: String(formData.get("city") ?? "").trim(),
        state: String(formData.get("state") ?? "").trim(),
        postcode: optional(formData, "postcode"),
        pickupAddress: String(formData.get("pickupAddress") ?? "").trim(),
        dropoffAddress: String(formData.get("dropoffAddress") ?? "").trim(),
        pickupDate: String(formData.get("pickupDate") ?? "").trim(),
        deliveryDate: optional(formData, "deliveryDate"),
        bookingNumber: optional(formData, "bookingNumber"),
        issueType: String(formData.get("issueType") ?? "Other") as IssueType,
        comments: String(formData.get("comments") ?? "").trim(),
        declarationAccepted: formData.get("declaration") === "on",
        ...(attachmentStorageId ? { attachmentStorageId, attachmentName: file?.name } : {}),
      });

      setSubmitted(true);
    } catch {
      setError("Something went wrong submitting your grievance. Please try again or call 02 8503 4444.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Card className="rounded-md p-8 shadow-floating text-center max-w-[760px] mx-auto">
        <div className="w-12 h-12 rounded-pill bg-teal-100 text-teal-500 grid place-items-center text-2xl mx-auto mb-4">
          ✓
        </div>
        <div className="font-display font-bold text-2xl text-ink-800 mb-2">
          We&apos;ve received your grievance
        </div>
        <p className="m-0 text-sm text-ink-400 leading-[1.6]">
          A coordinator will review the details and get back to you. If it&apos;s urgent, call 02 8503 4444.
        </p>
      </Card>
    );
  }

  return (
    <Card className="rounded-md p-6 sm:p-8 shadow-floating max-w-[760px] mx-auto">
      <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        <SectionHeading>Customer Information</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field id="grievance-name" label="Name">
            <Input id="grievance-name" name="name" placeholder="Name" required className="bg-white" />
          </Field>
          <Field id="grievance-email" label="Email">
            <Input
              id="grievance-email"
              name="email"
              type="email"
              placeholder="Your Email"
              required
              className="bg-white"
            />
          </Field>
          <Field id="grievance-phone" label="Phone number">
            <Input
              id="grievance-phone"
              name="phone"
              type="tel"
              placeholder="Phone Number"
              required
              className="bg-white"
            />
          </Field>
          <Field id="grievance-alt-phone" label="Alternate phone (optional)">
            <Input
              id="grievance-alt-phone"
              name="altPhone"
              type="tel"
              placeholder="Alternate Phone"
              className="bg-white"
            />
          </Field>
        </div>

        <Field id="grievance-address" label="Current address">
          <Input id="grievance-address" name="address" placeholder="Current Address" required className="bg-white" />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field id="grievance-city" label="City">
            <Input id="grievance-city" name="city" placeholder="City" required className="bg-white" />
          </Field>
          <Field id="grievance-state" label="State">
            <Input id="grievance-state" name="state" placeholder="State" required className="bg-white" />
          </Field>
          <Field id="grievance-postcode" label="Post code (optional)">
            <Input id="grievance-postcode" name="postcode" placeholder="Post Code" className="bg-white" />
          </Field>
        </div>

        <SectionHeading>Information About the Move</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field id="grievance-pickup" label="Pick-up address">
            <Input
              id="grievance-pickup"
              name="pickupAddress"
              placeholder="Pick up address"
              required
              className="bg-white"
            />
          </Field>
          <Field id="grievance-dropoff" label="Drop-off address">
            <Input
              id="grievance-dropoff"
              name="dropoffAddress"
              placeholder="Drop off address"
              required
              className="bg-white"
            />
          </Field>
          <Field id="grievance-pickup-date" label="Pick-up date">
            <Input id="grievance-pickup-date" name="pickupDate" type="date" required className="bg-white" />
          </Field>
          <Field id="grievance-delivery-date" label="Delivery date (optional)">
            <Input id="grievance-delivery-date" name="deliveryDate" type="date" className="bg-white" />
          </Field>
          <Field id="grievance-booking" label="Booking number (optional)">
            <Input id="grievance-booking" name="bookingNumber" placeholder="Booking Number" className="bg-white" />
          </Field>
        </div>

        <SectionHeading>Additional Information</SectionHeading>

        <Field id="grievance-issue" label="Issue type">
          <Select id="grievance-issue" name="issueType" required defaultValue="" className="bg-white">
            <option value="" disabled>
              — Please choose an option —
            </option>
            {ISSUE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </Field>

        <Field id="grievance-comments" label="Comments">
          <Textarea
            id="grievance-comments"
            name="comments"
            rows={6}
            maxLength={2000}
            placeholder="Tell us what happened — dates, crew, items affected and what you'd like us to do"
            required
            className="bg-white"
          />
        </Field>

        <SectionHeading>Any Attachments</SectionHeading>

        <Field id="grievance-file" label="Supporting document or photo (optional)">
          <label
            htmlFor="grievance-file"
            className="flex items-center justify-between gap-3 border-[1.5px] border-dashed border-border rounded-md px-5 py-4 bg-gray-100 cursor-pointer hover:border-teal-500 transition-colors"
          >
            <span className="text-sm text-ink-400 truncate min-w-0">
              {file?.name ?? "Attach a photo, PDF or document (max 10MB)"}
            </span>
            <span className="text-sm font-display font-semibold text-teal-500 shrink-0">Browse</span>
          </label>
          <input
            ref={fileInputRef}
            id="grievance-file"
            name="attachment"
            type="file"
            accept={ACCEPTED_FILES}
            onChange={handleFileChange}
            className="hidden"
          />
          {file && (
            <button
              type="button"
              onClick={clearFile}
              className="justify-self-start text-xs text-ink-400 underline cursor-pointer bg-transparent border-0 p-0"
            >
              Remove file
            </button>
          )}
        </Field>

        <label className="flex items-start gap-3 text-sm text-ink-400 leading-[1.6]">
          <input type="checkbox" name="declaration" defaultChecked required className="mt-1 shrink-0" />
          <span>
            I verify that the replies above are true to the best of my knowledge and belief, that nothing
            untrue has been stated and that no facts have been concealed.
          </span>
        </label>

        {error && <div className="text-sm text-danger">{error}</div>}

        <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Grievance"}
        </Button>
      </form>
    </Card>
  );
}

/** Mounts the Convex client only on routes that actually render this form. */
export function GrievanceForm() {
  return (
    <ConvexClientProvider>
      <GrievanceFormInner />
    </ConvexClientProvider>
  );
}
