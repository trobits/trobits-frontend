"use client";

import React, { useMemo, useState } from "react";
import {
  useClaimDailyRewardMutation,
  useGetDailyRewardsStatusQuery,
} from "@/redux/features/api/dailyRewardsApi";
import { Gift } from "lucide-react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { HoverEffect } from "@/components/ui/card-hover-effect";

const MAX_DAYS = 7;

const pointsForDay = (day: number) => {
  const table = [10, 10, 20, 20, 30, 30, 30];
  const safe = Math.max(1, Math.min(day, 7));
  return table[safe - 1];
};

type CardState = "CLAIMED" | "ACTIVE" | "NEXT" | "LOCKED";

export default function DailyRewardsPage() {
  const { data, isLoading, isError, refetch } = useGetDailyRewardsStatusQuery();
  const [claimDailyReward, { isLoading: isClaiming }] =
    useClaimDailyRewardMutation();

  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const streakDayToClaim = data?.streakDayToClaim ?? 1;
  const canClaim = data?.canClaim ?? false;
  const pointsBalance = data?.pointsBalance ?? 0;
  const nextResetAtUtc = data?.nextResetAtUtc ?? null;

  const cards = useMemo(() => {
    const claimedUpTo = Math.max(0, streakDayToClaim - 1);

    return Array.from({ length: MAX_DAYS }, (_, i) => {
      const day = i + 1;

      let state: CardState = "LOCKED";
      if (day <= claimedUpTo) state = "CLAIMED";
      else if (day === streakDayToClaim && canClaim) state = "ACTIVE";
      else if (day === streakDayToClaim && !canClaim) state = "NEXT";
      else state = "LOCKED";

      return { day, state };
    });
  }, [streakDayToClaim, canClaim]);

  // Decorative hover-effect dataset (not used for logic; just subtle background flair)
  const hoverProjects = useMemo(
    () =>
      cards.map((c) => ({
        title: `Day ${c.day}`,
        description:
          c.state === "CLAIMED"
            ? "Claimed"
            : c.state === "ACTIVE"
            ? `Available now (+${data?.pointsIfClaimNow ?? pointsForDay(c.day)} pts)`
            : c.state === "NEXT"
            ? "Next cycle"
            : "Locked",
        link: "#",
      })),
    [cards, data?.pointsIfClaimNow]
  );

  const handleClaim = async () => {
    if (!data) return;
    if (!data.canClaim) return;

    setToast(null);
    try {
      const res = await claimDailyReward().unwrap();
      setToast({
        type: "success",
        msg: `Claimed Day ${res.awarded.dayNumber} (+${res.awarded.points} pts). New balance: ${res.pointsBalance}`,
      });
      refetch();
    } catch (e: any) {
      setToast({
        type: "error",
        msg:
          e?.data?.message ||
          "Already claimed for this cycle (or something went wrong).",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6">
          <p className="text-gray-300">Loading daily rewards...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6">
          <p className="text-red-400">Failed to load daily rewards status.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 w-full rounded-xl bg-white/10 hover:bg-white/15 text-white py-3 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-[5vw] 3xl:px-[1vw] py-10">
<div className="mx-auto w-full max-w-7xl relative min-h-[calc(100vh-5rem)] flex flex-col py-8">


        {/* Header */}
        <div className="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 relative overflow-hidden mb-6">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white/90" />
                </div>
                <h1 className="text-2xl font-bold text-white">Daily Rewards</h1>
              </div>

              <p className="text-gray-300 mt-2 text-sm">
                Reset at{" "}
                <span className="text-gray-200 font-medium">
                  {nextResetAtUtc
                    ? new Date(nextResetAtUtc).toUTCString()
                    : "—"}
                </span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-400 text-xs">Points Balance</p>
              <p className="text-white text-2xl font-bold">{pointsBalance}</p>
            </div>
          </div>

          {toast && (
            <div
              className={`mt-4 rounded-xl p-3 text-sm border ${
                toast.type === "success"
                  ? "bg-green-900/20 border-green-700/40 text-green-200"
                  : "bg-red-900/20 border-red-700/40 text-red-200"
              }`}
            >
              {toast.msg}
            </div>
          )}
        </div>

        {/* ✅ Cards: one horizontal line (side-by-side), narrow but presentable */}
<div className="relative flex-1 flex items-center">
<div className="flex gap-4 overflow-x-auto py-6 snap-x snap-mandatory w-full">
            {cards.map((c) => {
              const isActive = c.state === "ACTIVE";
              const isClaimed = c.state === "CLAIMED";
              const isNext = c.state === "NEXT";
              const isLocked = c.state === "LOCKED";

              const borderClass = isActive
                ? "border-yellow-500/60"
                : isClaimed
                ? "border-green-600/60"
                : isNext
                ? "border-blue-500/50"
                : "border-gray-700/60";

              const tintBgClass = isActive
                ? "bg-yellow-500/10"
                : isClaimed
                ? "bg-green-500/10"
                : isNext
                ? "bg-blue-500/10"
                : "bg-gray-900/40";

              const pointsShown = isActive
                ? data.pointsIfClaimNow
                : pointsForDay(c.day);

              const label = isActive
                ? `Claim +${data.pointsIfClaimNow} pts`
                : isClaimed
                ? "Claimed"
                : isNext
                ? "Next"
                : "Locked";

              const iconTint = isActive
                ? "text-yellow-200"
                : isClaimed
                ? "text-green-200"
                : isNext
                ? "text-blue-200"
                : "text-gray-300";

              const badge = isClaimed
                ? {
                    text: "Claimed",
                    cls: "bg-green-900/30 border-green-700/30 text-green-200",
                  }
                : isNext
                ? {
                    text: "Next",
                    cls: "bg-blue-900/30 border-blue-700/30 text-blue-200",
                  }
                : isLocked
                ? {
                    text: "Locked",
                    cls: "bg-gray-800/40 border-gray-700/40 text-gray-300",
                  }
                : {
                    text: "Today",
                    cls: "bg-yellow-900/30 border-yellow-700/30 text-yellow-200",
                  };

              return (
                <div
                  key={c.day}
                  className={[
                    "relative overflow-visible rounded-2xl border",
                    borderClass,
                    tintBgClass,
                    // ✅ hover effects preserved + enhanced
                    "transition-all duration-300",
                    "hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/10",
                    "group",
                    // ✅ width tuned (narrow, but not ugly)
"w-[170px] sm:w-[205px] lg:w-[195px] shrink-0",
                    // ✅ top padding because icon floats in
                    "pt-12 px-4 pb-5",
  "min-h-[320px]",
  "snap-start",
                  ].join(" ")}
                >
                  {/* Floating Gift Icon: centered, larger, half outside card */}
                  <div className="absolute left-1/2 -top-7 -translate-x-1/2 z-20">
                    <div className="w-14 h-14 rounded-2xl bg-gray-950/70 border border-white/10 shadow-xl flex items-center justify-center">
                      <Gift className={`w-8 h-8 ${iconTint}`} />
                    </div>
                  </div>

                  {/* Dotted glow background (masked, on hover) */}
                  <DottedGlowBackground
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mask-radial-to-90% mask-radial-at-center rounded-2xl"
                    opacity={1}
                    gap={10}
                    radius={1.6}
                    colorLightVar="--color-neutral-500"
                    glowColorLightVar="--color-neutral-600"
                    colorDarkVar="--color-neutral-500"
                    glowColorDarkVar="--color-sky-800"
                    backgroundOpacity={0}
                    speedMin={0.3}
                    speedMax={1.6}
                    speedScale={1}
                  />

                  {/* Minimal content */}
                  <div className="relative z-10">
                    <div className="text-center space-y-2">
                      <p className="text-white font-semibold">Day {c.day}</p>

                      <span
                        className={`inline-flex items-center justify-center text-xs px-2 py-1 rounded-full border ${badge.cls}`}
                      >
                        {badge.text}
                      </span>

                      <div className="mt-2">
                        <p className="text-gray-400 text-xs">Reward</p>
                        <p className="text-white text-lg font-bold">
                          {pointsShown} pts
                        </p>
                      </div>
                    </div>

                    {/* Claim button at end + broader */}
                    <button
                      disabled={!isActive || isClaiming}
                      onClick={handleClaim}
                      className={[
                        "mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition",
                        isActive && !isClaiming
                          ? "bg-white text-black hover:bg-white/90 hover:scale-[1.02]"
                          : "bg-white/10 text-gray-400 cursor-not-allowed",
                      ].join(" ")}
                    >
                      {isClaiming && isActive ? "Claiming..." : label}
                    </button>

                    {/* tiny helper (kept minimal) */}
                    <p className="mt-2 text-[11px] text-center text-gray-500">
                      {isActive
                        ? "Available now"
                        : isClaimed
                        ? "Already claimed"
                        : isNext
                        ? "After reset"
                        : "Keep streak"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fade edges as scroll cue */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/20 to-transparent rounded-2xl" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/20 to-transparent rounded-2xl" />
        </div>

        {/* Footer note */}
        <div className="text-center text-xs text-gray-500">
          Only the current cycle’s reward can be claimed. Come back after reset
          for the next day.
        </div>
      </div>
    </div>
  );
}
