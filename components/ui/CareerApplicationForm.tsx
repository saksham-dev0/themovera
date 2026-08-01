"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";

type Role = "Ground Supervisor" | "Sub-Contractor" | "Other";

const roleParamMap: Record<string, Role> = {
  "ground-supervisor": "Ground Supervisor",
  "sub-contractor": "Sub-Contractor",
};

export function CareerApplicationForm() {
  const searchParams = useSearchParams();
  const defaultRole = roleParamMap[searchParams.get("role") ?? ""] ?? "Ground Supervisor";

  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.careers.generateUploadUrl);
  const submitApplication = useMutation(api.careers.submit);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) {
      setFile(null);
      setFileName(null);
      return;
    }
    setFile(selected);
    setFileName(selected.name);
  }

  function clearFile() {
    setFile(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = String(formData.get("name") ?? "");
      const email = String(formData.get("email") ?? "");
      const phone = String(formData.get("phone") ?? "");
      const role = String(formData.get("role") ?? "Ground Supervisor") as Role;
      const location = String(formData.get("location") ?? "");
      const experience = String(formData.get("experience") ?? "");
      const message = String(formData.get("message") ?? "");
      const hasOwnTruck = formData.get("hasOwnTruck") === "on";
      const hasAbn = formData.get("hasAbn") === "on";

      let resumeStorageId: Id<"_storage"> | undefined;

      if (file) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        });
        if (!result.ok) throw new Error("Upload failed");
        const { storageId } = (await result.json()) as { storageId: Id<"_storage"> };
        resumeStorageId = storageId;
      }

      await submitApplication({
        name,
        email,
        phone,
        role,
        location,
        experience,
        message,
        hasOwnTruck,
        hasAbn,
        ...(resumeStorageId ? { resumeStorageId } : {}),
      });

      setSubmitted(true);
    } catch {
      setError("Something went wrong submitting your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Card className="rounded-md p-8 shadow-floating text-center max-w-[640px] mx-auto">
        <div className="w-12 h-12 rounded-pill bg-teal-100 text-teal-500 grid place-items-center text-2xl mx-auto mb-4">
          ✓
        </div>
        <div className="font-display font-bold text-2xl text-ink-800 mb-2">Application received!</div>
        <p className="m-0 text-sm text-ink-400 leading-[1.6]">
          Thanks for applying to Movera. Our HR team will review your details and get in touch.
        </p>
      </Card>
    );
  }

  return (
    <Card className="rounded-md p-8 shadow-floating max-w-[640px] mx-auto">
      <div className="font-display font-bold text-2xl text-ink-800 mb-1.5">Apply now</div>
      <p className="m-0 mb-6 text-sm text-ink-400 leading-[1.5]">
        Tell us a bit about yourself and we'll get back to you.
      </p>
      <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="app-name" className="text-xs uppercase tracking-wide">
              Full name
            </Label>
            <Input id="app-name" name="name" placeholder="Your name" required className="bg-white" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="app-role" className="text-xs uppercase tracking-wide">
              Role applying for
            </Label>
            <Select id="app-role" name="role" defaultValue={defaultRole} className="bg-white">
              <option value="Ground Supervisor">Ground Supervisor</option>
              <option value="Sub-Contractor">Sub-Contractor</option>
              <option value="Other">Other</option>
            </Select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="app-email" className="text-xs uppercase tracking-wide">
              Email
            </Label>
            <Input id="app-email" name="email" type="email" placeholder="you@example.com" required className="bg-white" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="app-phone" className="text-xs uppercase tracking-wide">
              Phone number
            </Label>
            <Input id="app-phone" name="phone" type="tel" placeholder="04XX XXX XXX" required className="bg-white" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="app-location" className="text-xs uppercase tracking-wide">
              Suburb / area based
            </Label>
            <Input id="app-location" name="location" placeholder="e.g. Cheltenham" required className="bg-white" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="app-experience" className="text-xs uppercase tracking-wide">
              Years of experience
            </Label>
            <Input id="app-experience" name="experience" placeholder="e.g. 3 years" required className="bg-white" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input type="checkbox" name="hasOwnTruck" className="w-4 h-4 accent-teal-500" />
            I have my own truck
          </label>
          <label className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input type="checkbox" name="hasAbn" className="w-4 h-4 accent-teal-500" />
            I have an ABN
          </label>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="app-message" className="text-xs uppercase tracking-wide">
            Tell us about yourself
          </Label>
          <Textarea
            id="app-message"
            name="message"
            placeholder="Relevant experience, availability, why you'd be a good fit"
            rows={4}
            required
            className="bg-white"
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="app-resume" className="text-xs uppercase tracking-wide">
            Resume / CV (optional)
          </Label>
          <label
            htmlFor="app-resume"
            className="flex items-center justify-between gap-3 border-[1.5px] border-dashed border-border rounded-md px-5 py-4 bg-gray-100 cursor-pointer hover:border-teal-500 transition-colors"
          >
            <span className="text-sm text-ink-400 truncate min-w-0">
              {fileName ?? "Click to upload your resume (PDF or Word)"}
            </span>
            <span className="text-sm font-display font-semibold text-teal-500 shrink-0">Browse</span>
          </label>
          <input
            ref={fileInputRef}
            id="app-resume"
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
          />
          {fileName && (
            <button
              type="button"
              onClick={clearFile}
              className="justify-self-start text-xs font-display font-semibold text-ink-400 hover:text-teal-500 bg-transparent border-0 cursor-pointer p-0"
            >
              Remove file
            </button>
          )}
        </div>

        {error && <div className="text-sm text-danger">{error}</div>}

        <Button type="submit" variant="primary" className="w-full mt-1" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Application"}
        </Button>
      </form>
    </Card>
  );
}
