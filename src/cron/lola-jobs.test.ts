import { describe, expect, it } from "vitest";
import {
  buildLolaFollowThroughJob,
  buildLolaFollowThroughPayload,
  buildLolaFollowThroughSchedule,
} from "./lola-jobs.js";

describe("lola-jobs", () => {
  it("builds cron schedules and trims timezone", () => {
    expect(buildLolaFollowThroughSchedule({ expr: "*/5 * * * *", tz: " UTC " })).toEqual({
      kind: "cron",
      expr: "*/5 * * * *",
      tz: "UTC",
    });
  });

  it("builds agent-turn payloads with optional fields", () => {
    expect(
      buildLolaFollowThroughPayload({
        message: "  ping owners  ",
        model: " openai/gpt-5 ",
        thinking: " low ",
        timeoutSeconds: 12.9,
        lightContext: true,
      }),
    ).toEqual({
      kind: "agentTurn",
      message: "ping owners",
      model: "openai/gpt-5",
      thinking: "low",
      timeoutSeconds: 12,
      lightContext: true,
    });
  });

  it("builds isolated follow-through jobs", () => {
    expect(
      buildLolaFollowThroughJob({
        name: "  follow-up ",
        schedule: { expr: "0 * * * *" },
        payload: { message: "check in" },
      }),
    ).toMatchObject({
      name: "follow-up",
      enabled: true,
      sessionTarget: "isolated",
      wakeMode: "next-heartbeat",
      schedule: { kind: "cron", expr: "0 * * * *" },
      payload: { kind: "agentTurn", message: "check in" },
    });
  });
});
