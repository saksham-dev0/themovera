"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label, Textarea } from "@/components/ui/Input";

export function FeedbackForm() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.feedback.generateUploadUrl);
  const submitFeedback = useMutation(api.feedback.submit);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) {
      setFile(null);
      setFileName(null);
      setPreviewUrl(null);
      setPreviewType(null);
      return;
    }
    setFile(selected);
    setFileName(selected.name);
    setPreviewUrl(URL.createObjectURL(selected));
    setPreviewType(selected.type.startsWith("video") ? "video" : "image");
  }

  function clearFile() {
    setFile(null);
    setFileName(null);
    setPreviewUrl(null);
    setPreviewType(null);
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
      const comment = String(formData.get("comment") ?? "");

      let mediaStorageId: Id<"_storage"> | undefined;
      let mediaType: "image" | "video" | undefined;

      if (file) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!result.ok) throw new Error("Upload failed");
        const { storageId } = (await result.json()) as { storageId: Id<"_storage"> };
        mediaStorageId = storageId;
        mediaType = file.type.startsWith("video") ? "video" : "image";
      }

      await submitFeedback({
        name,
        email,
        comment,
        ...(mediaStorageId ? { mediaStorageId, mediaType } : {}),
      });

      setSubmitted(true);
    } catch {
      setError("Something went wrong submitting your feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Card className="rounded-md p-8 shadow-floating text-center max-w-[560px] mx-auto">
        <div className="w-12 h-12 rounded-pill bg-teal-100 text-teal-500 grid place-items-center text-2xl mx-auto mb-4">
          ✓
        </div>
        <div className="font-display font-bold text-2xl text-ink-800 mb-2">Thanks for your feedback!</div>
        <p className="m-0 text-sm text-ink-400 leading-[1.6]">
          We&apos;ve received your message and will follow up if we need anything further.
        </p>
      </Card>
    );
  }

  return (
    <Card className="rounded-md p-8 shadow-floating max-w-[560px] mx-auto">
      <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-1.5">
          <Label htmlFor="feedback-name" className="text-xs uppercase tracking-wide">
            Full name
          </Label>
          <Input id="feedback-name" name="name" placeholder="Your name" required className="bg-white" />
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          <Label htmlFor="feedback-email" className="text-xs uppercase tracking-wide">
            Email
          </Label>
          <Input
            id="feedback-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="bg-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          <Label htmlFor="feedback-comment" className="text-xs uppercase tracking-wide">
            Your feedback
          </Label>
          <Textarea
            id="feedback-comment"
            name="comment"
            placeholder="Tell us about your move — what went well, what we could do better"
            rows={5}
            required
            className="bg-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          <Label htmlFor="feedback-media" className="text-xs uppercase tracking-wide">
            Photo or video (optional)
          </Label>
          <label
            htmlFor="feedback-media"
            className="flex items-center justify-between gap-3 border-[1.5px] border-dashed border-border rounded-md px-5 py-4 bg-gray-100 cursor-pointer hover:border-teal-500 transition-colors"
          >
            <span className="text-sm text-ink-400 truncate min-w-0">
              {fileName ?? "Click to upload an image or video of your feedback"}
            </span>
            <span className="text-sm font-display font-semibold text-teal-500 shrink-0">Browse</span>
          </label>
          <input
            ref={fileInputRef}
            id="feedback-media"
            name="media"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {previewUrl && (
            <div className="relative mt-2 rounded-md overflow-hidden border border-border bg-ink-900 h-[220px]">
              {previewType === "video" ? (
                <video src={previewUrl} controls playsInline className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <Image src={previewUrl} alt="Upload preview" fill className="object-cover" unoptimized />
              )}
              <button
                type="button"
                onClick={clearFile}
                className="absolute top-2 right-2 w-7 h-7 rounded-pill bg-white/95 text-ink-800 grid place-items-center text-sm font-bold cursor-pointer border-0"
                aria-label="Remove file"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {error && <div className="text-sm text-danger">{error}</div>}

        <Button type="submit" variant="primary" className="w-full mt-1" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Feedback"}
        </Button>
      </form>
    </Card>
  );
}
