import { getAllReleases, decodeBarrel } from "@/lib/decoder";
import ReleasesBrowser from "@/components/ReleasesBrowser";

export default function ReleasesPage() {
  const releases = getAllReleases();

  const enrichedReleases = releases.map((release) => ({
    ...release,
    classification: decodeBarrel(release.barrelCode),
  }));

  return <ReleasesBrowser enrichedReleases={enrichedReleases} />;
}
