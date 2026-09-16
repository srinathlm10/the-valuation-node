import { useParams } from "react-router-dom";
import ToolPage from "@/pages/ToolPage";
import DcfSensitivityPage from "@/pages/DcfSensitivityPage";
import BuildADcfPage from "@/pages/BuildADcfPage";
import ReadIncomeStatementPage from "@/pages/ReadIncomeStatementPage";
import ComputeRatiosPage from "@/pages/ComputeRatiosPage";
import CompareCompaniesPage from "@/pages/CompareCompaniesPage";
import SpotRedFlagsPage from "@/pages/SpotRedFlagsPage";

const LESSON_PAGES: Record<string, React.ComponentType> = {
  "build-a-dcf": BuildADcfPage,
  "read-an-income-statement": ReadIncomeStatementPage,
  "compute-ratios": ComputeRatiosPage,
  "compare-two-companies": CompareCompaniesPage,
  "spot-the-red-flags": SpotRedFlagsPage,
};

/** /vault/interactive/:slug serves the 13 calculators and the 5 lessons from one namespace. */
export default function InteractiveRouter() {
  const { slug = "" } = useParams<{ slug: string }>();
  if (slug === "dcf-sensitivity") return <DcfSensitivityPage />;
  const Lesson = LESSON_PAGES[slug];
  if (Lesson) return <Lesson />;
  return <ToolPage />;
}
