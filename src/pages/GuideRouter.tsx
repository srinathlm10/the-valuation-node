import { useParams } from "react-router-dom";
import { getTrack } from "@/lib/taxonomy";
import { COURSES } from "@/lib/contentIndex";
import TrackPage from "@/pages/TrackPage";
import CoursePage from "@/pages/CoursePage";
import FoundationsLeaf from "@/pages/FoundationsLeaf";

/**
 * /vault/guides/:slug serves three kinds of page from one namespace: the nine
 * track landings, the two restored courses, and the 51 topic guides. Track and
 * course slugs are reserved; no topic uses them.
 */
export default function GuideRouter() {
  const { slug = "" } = useParams<{ slug: string }>();
  if (getTrack(slug)) return <TrackPage trackId={slug} />;
  const course = COURSES.find((c) => c.slug === slug);
  if (course) return <CoursePage slug={course.slug} />;
  return <FoundationsLeaf />;
}
