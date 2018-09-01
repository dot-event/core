import DotEvent from "../dist/core"

describe("multi", () => {
  describe("on", () => {
    test.only("one emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on([["create", fn]])

      await event.create().catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: [":create:"],
          op: "create",
          prep: undefined,
          props: undefined,
        },
      }

      expect(fn.mock.calls).toEqual([[payload]])
    })

    test.only("two emit", async () => {
      const event = new DotEvent()
      const fn = jest.fn()

      event.op("create")
      event.on([["create", fn], ["create", "hello", fn]])

      await event.create().catch(console.error)
      await event.create("hello").catch(console.error)

      const payload = {
        event: {
          emitter: expect.any(DotEvent),
          keys: [":create:"],
          op: "create",
          prep: undefined,
          props: undefined,
        },
      }

      const payload2 = {
        event: {
          emitter: expect.any(DotEvent),
          keys: [":create:hello"],
          op: "create",
          prep: undefined,
          props: "hello",
        },
      }

      expect(fn.mock.calls).toEqual([[payload], [payload2]])
    })
  })
})
