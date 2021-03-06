import dotEvent, { Events } from "../../"

describe("multi", () => {
  describe("on", () => {
    test("one emit", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      events.on({ "emit.hello": fn })

      await events.emit("hello").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello"],
          op: "emit",
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello"],
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("one emit w/ multiple listeners", async () => {
      const events = dotEvent()
      const out = []

      const fn = () => out.push("a")
      const fn2 = () => out.push("b")

      events.on({ "emit.hello": [fn, fn2] })

      await events.emit("hello").catch(console.error)

      expect(out).toEqual(["a", "b"])
    })

    test("one emit w/ multiple listeners and condition", async () => {
      const events = dotEvent()
      const out = []

      const fn = () => out.push("a")
      const fn2 = () => out.push("b")

      const if1 = async () => true
      const if2 = async () => false

      events.on({
        "emit.hello": [
          { if: [if1, () => fn] },
          { if: [if2, () => fn2] },
        ],
      })

      await events.emit("hello").catch(console.error)

      expect(out).toEqual(["a"])
    })

    test("one emit w/ multiple nested listeners", async () => {
      const events = dotEvent()
      const out = []

      const fn = () => out.push("a")
      const fn2 = () => out.push("b")
      const fn3 = () => out.push("c")

      events.on({
        "emit.hello": { hi: [{ fn }, [fn2, fn3]] },
      })

      await events.emit("hello").catch(console.error)

      expect(out).toEqual(["a", "b", "c"])
    })

    test("two emit", async () => {
      const events = dotEvent()
      const fn = jest.fn()
      const fn2 = jest.fn()

      events.on({
        "emit.hello": fn,
        "emit.hello.world": fn2,
      })

      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello"],
          op: "emit",
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello"],
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "world"],
          op: "emit",
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
        props: ["hello", "world"],
      }

      expect(fn.mock.calls).toEqual([[payload]])
      expect(fn2.mock.calls).toEqual([[payload2]])
    })

    test("off", async () => {
      const events = dotEvent()
      const fn = jest.fn()

      const off = events.on({
        "emit.hello": fn,
        "emit.hello.world": fn,
      })

      off()

      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })

    test("off w/ multiple listeners", async () => {
      const events = dotEvent()
      const fn = jest.fn()
      const fn2 = jest.fn()

      const off = events.on({
        "emit.hello.world": [fn, fn2],
      })

      off()

      await events.emit("hello.world").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
      expect(fn2.mock.calls.length).toBe(0)
    })
  })
})
