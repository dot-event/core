import Events from "../dist/core"

describe("props", () => {
  describe("on", () => {
    test("one emit", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.on("hello.world", fn)

      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("one wildcard emit", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.on("hello.*", fn)

      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "*"],
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("one wildcard variable emit", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.on("hello.{place}", fn)

      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "{place}"],
          options: {
            place: "world",
          },
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
        place: "world",
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("two emits", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.on("hello.world", fn)

      await events.emit("hello.world").catch(console.error)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload]])
    })

    test("no emits", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.on("hello.world", fn)

      await events.emit("hello").catch(console.error)

      expect(fn.mock.calls.length).toBe(0)
    })
  })

  describe("onAny", () => {
    test("two emits", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.onAny("hello.world", fn)

      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)
      await events
        .emit("hello.world.again")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "world"],
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "world"],
          props: ["hello", "world", "again"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("two wildcard emits", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.onAny("*", fn)

      await events.emit().catch(console.error)
      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)

      const payload = {
        event: {
          listenProps: ["*"],
          props: ["hello"],
          signal: {},
        },
        events: expect.any(Events),
      }

      const payload2 = {
        event: {
          listenProps: ["*"],
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })

    test("two wildcard variable emits", async () => {
      const events = new Events()
      const fn = jest.fn()

      events.onAny("hello.{place}", fn)

      await events.emit("hello").catch(console.error)
      await events.emit("hello.world").catch(console.error)
      await events
        .emit("hello.world.peace")
        .catch(console.error)

      const payload = {
        event: {
          listenProps: ["hello", "{place}"],
          options: { place: "world" },
          props: ["hello", "world"],
          signal: {},
        },
        events: expect.any(Events),
        place: "world",
      }

      const payload2 = {
        event: {
          listenProps: ["hello", "{place}"],
          options: { place: "world" },
          props: ["hello", "world", "peace"],
          signal: {},
        },
        events: expect.any(Events),
        place: "world",
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })
  })

  describe("onceAnyEmitted", () => {
    test("one emit", async () => {
      const events = new Events()
      const fn = jest.fn()

      await events.emit("hello.world").catch(console.error)

      events.onceAnyEmitted("hello", fn)

      const payload = {
        event: {
          listenProps: ["hello"],
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test("one emit wildcard", async () => {
      const events = new Events()
      const fn = jest.fn()

      await events
        .emit("hello.world.peace")
        .catch(console.error)

      events.onceAnyEmitted("hello.*", fn)

      const payload = {
        event: {
          listenProps: ["hello", "*"],
        },
        events: expect.any(Events),
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })
  })
})
