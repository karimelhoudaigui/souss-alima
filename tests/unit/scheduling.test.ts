import { describe, expect, it } from "vitest";
import { isScheduledInsideAvailability, validateAvailabilityWindow } from "../../src/lib/scheduling";

describe("scheduling rules", () => {
  it("accepts a proposed session inside a recurring availability", () => {
    expect(
      isScheduledInsideAvailability(
        { dayOfWeek: 1, date: null, startTime: "18:00", endTime: "20:00", isRecurring: true },
        "2026-07-20T16:30:00.000Z",
        20
      )
    ).toBe(true);
  });

  it("rejects a session that overflows the availability", () => {
    expect(
      isScheduledInsideAvailability(
        { dayOfWeek: 1, date: null, startTime: "18:00", endTime: "19:00", isRecurring: true },
        "2026-07-20T18:50:00.000Z",
        20
      )
    ).toBe(false);
  });

  it("validates start/end time order", () => {
    expect(validateAvailabilityWindow("09:00", "10:00")).toBe(true);
    expect(validateAvailabilityWindow("10:00", "09:00")).toBe(false);
  });
});
