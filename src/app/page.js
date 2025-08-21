"use client";
import React from "react";
import Hero from "../components/Hero";
import NavBar from "../components/NavBar";
import WelcomeBox from "../components/WelcomeBox";

export default function Page() {
  return (
    <Hero
      interval={5000}
      mode="auto"
      layoutRangeMs={[9000, 16000]}
      darkenBg={true}
      darkenFactor={0.5}
      colors={[
        "#0ea5e9",
        "#6366f1",
        "#a78bfa",
        "#f472b6",
        "#fb7185",
        "#34d399",
        "#f59e0b",
      ]}
    >
      <NavBar brand="FollowingNYC" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="pointer-events-auto select-none px-4 text-4xl font-semibold tracking-tight text-white drop-shadow md:text-6xl"></h1>
      </div>
      <WelcomeBox />
    </Hero>
  );
}
