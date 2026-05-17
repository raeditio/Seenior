import { MOCK_RESPONSE } from "@/lib/mock";
import type { SectionId } from "@/lib/types";
import ReportClient from "./ReportClient";

const VALID_SECTIONS: SectionId[] = ["documentation", "diagrams", "quiz"];

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { repo, sections: sectionsParam } = await searchParams;

  const repo_str = typeof repo === "string" ? repo : "";
  const sections = (typeof sectionsParam === "string" ? sectionsParam.split(",") : []).filter(
    (s): s is SectionId => VALID_SECTIONS.includes(s as SectionId)
  );

  // TODO: replace MOCK_RESPONSE with a real API call once the crawler is ready
  // const data = await fetch(`/api/analyze`, { method: "POST", body: JSON.stringify({ repoUrl, sections, files }) }).then(r => r.json())
  const data = MOCK_RESPONSE;

  return <ReportClient repo={repo_str} sections={sections.length > 0 ? sections : VALID_SECTIONS} data={data} />;
}
