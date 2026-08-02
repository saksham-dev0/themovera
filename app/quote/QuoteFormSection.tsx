"use client";

import { useSearchParams } from "next/navigation";
import { QuoteForm } from "@/components/ui/QuoteForm";

export function QuoteFormSection() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "";

  return <QuoteForm defaultLocation={from} />;
}
