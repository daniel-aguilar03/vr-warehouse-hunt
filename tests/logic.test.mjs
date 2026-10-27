import test from "node:test";
import assert from "node:assert/strict";
import { Hunt, TARGETS, validSettings } from "../src/hunt.js";
test("hunt counts distinct correct items, penalizes errors and freezes final time", () => {
  const h = new Hunt();
  h.tick(2);
  assert.equal(h.elapsed, 0);
  h.select("AX-140");
  h.tick(10);
  h.select(TARGETS[0]);
  h.select(TARGETS[0]);
  assert.equal(h.found.size, 1);
  assert.equal(h.errors, 1);
  TARGETS.slice(1).forEach((c) => h.select(c));
  assert.equal(h.complete, true);
  const time = h.elapsed;
  h.tick(30);
  assert.equal(h.elapsed, time);
  assert.equal(h.score, 955);
});
test("completed hunt freezes score and selections until reset", () => {
  const h = new Hunt();
  h.select("AX-140");
  h.tick(10);
  TARGETS.forEach((code) => h.select(code));
  const final = {
    found: [...h.found],
    elapsed: h.elapsed,
    errors: h.errors,
    score: h.score,
    started: h.started,
  };
  for (const code of ["AX-140", TARGETS[0], "UNKNOWN"]) {
    assert.match(h.select(code), /Hunt complete/);
  }
  h.tick(30);
  assert.deepEqual(
    {
      found: [...h.found],
      elapsed: h.elapsed,
      errors: h.errors,
      score: h.score,
      started: h.started,
    },
    final,
  );
  h.reset();
  assert.equal(h.complete, false);
  assert.equal(h.started, false);
  assert.equal(h.score, 1000);
  assert.equal(h.found.size, 0);
  assert.match(h.select(TARGETS[0]), /Collected/);
  assert.equal(h.found.size, 1);
});
test("saved settings reject invalid modes and clamp unsafe speed values", () => {
  assert.deepEqual(
    validSettings({ locomotion: "bad", turn: "bad", speed: 99 }),
    {
      locomotion: "teleport",
      turn: "snap",
      speed: 3,
      seated: false,
      vignette: true,
    },
  );
  assert.equal(validSettings({ speed: -8 }).speed, 0.5);
  assert.equal(
    validSettings({ locomotion: "smooth", seated: true }).seated,
    true,
  );
});
