// Helpers
import { buildKeys } from "./keys"
import { buildPayload } from "./payload"
import { emit, on, once } from "./emitter"
import { emitTypes } from "./build"

export async function emitBase({ payload, prep, state }) {
  await Promise.all(
    emitTypes.map(
      emitTypesMap.bind({ payload, prep, state })
    )
  )
}

function emitTypesMap(type) {
  const { payload, prep, state } = this
  return emitType({ payload, prep, state, type })
}

export async function emitType({
  payload,
  prep,
  state,
  type,
}) {
  const { events } = state
  const map = events.maps[type]
  const set = events.sets[type]
  const keys = buildKeys({ prep, state, type })

  await Promise.all(
    keys.map(emitMap, { map, payload, set })
  )
}

async function emitMap(key) {
  const { map, payload, set } = this
  await emit(map, key, payload)
  set.add(key)
}

export function onBase({ state, type }) {
  const { events, fn } = state
  const map = events.maps[type]

  const keys = buildKeys({
    state,
    subscribe: true,
    type,
  })

  const offs = keys.map(onMap, { fn, map, state })

  return onOff.bind({ offs })
}

function onMap(key) {
  const { fn, map, state } = this
  return on(map, key, onMapBase.bind({ fn, state }))
}

function onMapBase(opts) {
  const { fn, state } = this
  return fn(buildPayload({ opts, state }))
}

function onOff() {
  const { offs } = this
  for (const off of offs) {
    off()
  }
}

export async function onceBase({ state, type }) {
  const { events, fn } = state
  const map = events.maps[type]

  const keys = buildKeys({
    state,
    subscribe: true,
    type,
  })

  await Promise.all(keys.map(onceMap, { fn, map, state }))

  return buildPayload({ state })
}

function onceMap(key) {
  const { fn, map, state } = this
  const promise = once(map, key)

  if (fn) {
    return promise.then(onceMapFn.bind({ fn, state }))
  } else {
    return promise
  }
}

async function onceMapFn(opts) {
  const { fn, state } = this
  const payload = buildPayload({ opts, state })
  await fn(payload)
}

export function onEmittedBase({ state, type }) {
  const { events } = state

  const keys = buildKeys({
    state,
    subscribe: true,
    type,
  })

  return keys.find(emittedFind, { events, type })
}

function emittedFind(key) {
  const { events, type } = this
  return events.sets[type].has(key)
}
