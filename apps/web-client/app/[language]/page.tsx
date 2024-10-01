"use client";

import { HomePage } from "@repo/ui/components";

export default function Home({ params }: { params: { language: string } }) {
  return <HomePage language={params.language} />;
}
