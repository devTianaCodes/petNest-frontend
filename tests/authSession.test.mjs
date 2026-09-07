import assert from "node:assert/strict";
import test from "node:test";
import { createAuthSession } from "../dist-tests/src/features/auth/authSession.js";

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

const oldSession = { user: { id: "old-user" }, accessToken: "old-session" };
const newSession = { user: { id: "new-user" }, accessToken: "new-session" };

function fixture(overrides = {}) {
  const changes = [];
  const session = createAuthSession({
    login: async () => newSession,
    demoLogin: async () => newSession,
    refreshSession: async () => oldSession,
    logout: async () => undefined,
    onChange: (value) => changes.push(value),
    ...overrides
  });
  return { session, changes };
}

test("concurrent refresh calls share one rotating-cookie request", async () => {
  const pending = deferred();
  let calls = 0;
  const { session, changes } = fixture({ refreshSession: () => { calls += 1; return pending.promise; } });
  const first = session.refresh();
  const second = session.refresh();
  assert.equal(first, second);
  pending.resolve(oldSession);
  await Promise.all([first, second]);
  assert.equal(calls, 1);
  assert.deepEqual(changes, [oldSession]);
});

test("a late startup refresh cannot replace a newer sign-in", async () => {
  const pending = deferred();
  const { session, changes } = fixture({ refreshSession: () => pending.promise });
  const refreshing = session.refresh();
  await session.signIn({ email: "test@example.test", password: "test" });
  pending.resolve(oldSession);
  await refreshing;
  assert.deepEqual(changes, [newSession]);
});

test("a failed old refresh cannot clear a newer demo sign-in", async () => {
  const pending = deferred();
  const { session, changes } = fixture({ refreshSession: () => pending.promise });
  const refreshing = session.refresh();
  await session.signInDemo();
  pending.reject(new Error("Expired"));
  await assert.rejects(refreshing);
  assert.deepEqual(changes, [newSession]);
});

test("logout clears the local session even if the network fails and ignores late sign-ins", async () => {
  const pending = deferred();
  const { session, changes } = fixture({ login: () => pending.promise, logout: async () => { throw new Error("Offline"); } });
  const signingIn = session.signIn({ email: "test@example.test", password: "test" });
  await assert.rejects(session.signOut());
  pending.resolve(oldSession);
  await signingIn;
  assert.deepEqual(changes, [null]);
});

test("failed refreshes clear the session and allow another attempt", async () => {
  let calls = 0;
  const { session, changes } = fixture({ refreshSession: async () => {
    calls += 1;
    if (calls === 1) throw new Error("Expired");
    return newSession;
  } });
  await assert.rejects(session.refresh());
  await session.refresh();
  assert.deepEqual(changes, [null, newSession]);
});
