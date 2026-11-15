import { useState } from "react";
import { Button } from "@hashti/react";
import { Icon } from "@hashti/react";

interface AssetCard {
  name: string;
  tagline: string;
  filename: string;
  path: string;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
}

const ASSETS: AssetCard[] = [
  {
    name: "Hashti Mark",
    tagline: "Iconic Concentric Ogival Arch",
    filename: "hashti-mark.svg",
    path: "/hashti-mark.svg",
    width: 256,
    height: 256,
    aspectRatio: "1:1",
    description: "Favicon, app bar emblem, social avatar, navigation mark.",
  },
  {
    name: "Horizontal Lockup",
    tagline: "Mark + Satoshi Typography",
    filename: "hashti-horizontal.svg",
    path: "/hashti-horizontal.svg",
    width: 600,
    height: 120,
    aspectRatio: "5:1",
    description: "Documentation header, navigation bar, pitch deck titles.",
  },
  {
    name: "Vertical Stack",
    tagline: "Monumental Poster Layout",
    filename: "hashti-vertical.svg",
    path: "/hashti-vertical.svg",
    width: 400,
    height: 500,
    aspectRatio: "4:5",
    description: "Splash screens, poster merchandise, conference banners.",
  },
  {
    name: "App Icon",
    tagline: "Squircle PWA & Desktop Icon",
    filename: "hashti-app-icon.svg",
    path: "/hashti-app-icon.svg",
    width: 512,
    height: 512,
    aspectRatio: "1:1",
    description: "macOS Dock, iOS homescreen, Android adaptive launcher.",
  },
];

export function BrandbookAssets() {
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const handleDownload = (path: string, filename: string) => {
    const link = document.createElement("a");
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(filename);
    setTimeout(() => setDownloaded(null), 1200);
  };

  return (
    <div className="not-prose my-8 grid grid-cols-1 gap-5 md:grid-cols-2">
      {ASSETS.map((asset) => (
        <div
          key={asset.filename}
          className="flex flex-col rounded-[var(--hashti-group-radius)] border border-[var(--hashti-border-subtle)] bg-[var(--hashti-layer-01)]"
        >
          <div className="relative flex min-h-[180px] items-center justify-center border-b border-[var(--hashti-border-subtle)] bg-[var(--hashti-background)] p-6 [background-image:radial-gradient(var(--hashti-border-subtle)_1px,transparent_1px)] [background-size:16px_16px]">
            <img src={asset.path} alt={asset.name} className="max-h-24 max-w-full object-contain" />
            <span className="absolute end-3 top-3 rounded-full border border-[var(--hashti-border-subtle)] bg-[var(--hashti-layer-01)] px-2 py-0.5 text-[11px] text-[var(--hashti-text-secondary)]">
              {asset.aspectRatio}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="m-0 text-[var(--hashti-label-01-font-size)] font-semibold text-[var(--hashti-text-primary)]">
                  {asset.name}
                </h4>
                <span className="text-[var(--hashti-helper-text-01-font-size)] text-[var(--hashti-text-secondary)]">
                  {asset.width}×{asset.height}
                </span>
              </div>
              <p className="m-0 text-[var(--hashti-helper-text-01-font-size)] text-[var(--hashti-text-secondary)]">
                {asset.description}
              </p>
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[var(--hashti-border-subtle)] pt-3">
              <span className="text-[var(--hashti-helper-text-01-font-size)] text-[var(--hashti-text-secondary)]">
                {asset.filename}
              </span>
              <Button
                variant="secondary"
                size="md"
                onPress={() => handleDownload(asset.path, asset.filename)}
              >
                <Icon name={downloaded === asset.filename ? "check" : "download"} />
                {downloaded === asset.filename ? "Downloaded" : "Download SVG"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
