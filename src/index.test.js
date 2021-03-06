import { applyMiddleware, createStore } from 'redux'
import dynamicMiddlewares, { addMiddleware, removeMiddleware, resetMiddlewares } from './'

const reducer = (state = {}, action) => {
  if (action.type === 'foo') return { foo: 'bar' }
  return state
}

test('redux should work without error', () => {
  // eslint-disable-next-line no-console
  console.error = jest.fn()
  const store = createStore(reducer, applyMiddleware(dynamicMiddlewares))
  expect(store.getState()).toEqual({})
  store.dispatch({ type: 'foo' })
  // eslint-disable-next-line no-console
  expect(console.error).not.toBeCalled()
  expect(store.getState()).toEqual({ foo: 'bar' })
})

test('middleware should be called', () => {
  const store = createStore(reducer, applyMiddleware(dynamicMiddlewares))
  const middlewareWork = jest.fn()
  const middleware = () => next => (action) => {
    middlewareWork(action)
    return next(action)
  }
  addMiddleware(middleware)

  store.dispatch({ type: 'foo' })
  expect(middlewareWork).toBeCalledWith({ type: 'foo' })
})

test('all middlewares by single add should be called', () => {
  const store = createStore(reducer, applyMiddleware(dynamicMiddlewares))
  const firstMiddlewareWork = jest.fn()
  const firstMiddleware = () => next => (action) => {
    firstMiddlewareWork(action)
    return next(action)
  }
  const secondMiddlewareWork = jest.fn()
  const secondMiddleware = () => next => (action) => {
    secondMiddlewareWork(action)
    return next(action)
  }
  addMiddleware(firstMiddleware, secondMiddleware)

  store.dispatch({ type: 'foo' })
  expect(firstMiddlewareWork).toBeCalledWith({ type: 'foo' })
  expect(secondMiddlewareWork).toBeCalledWith({ type: 'foo' })
})

test('all middlewares by separate add should be called', () => {
  const store = createStore(reducer, applyMiddleware(dynamicMiddlewares))
  const firstMiddlewareWork = jest.fn()
  const firstMiddleware = () => next => (action) => {
    firstMiddlewareWork(action)
    return next(action)
  }
  const secondMiddlewareWork = jest.fn()
  const secondMiddleware = () => next => (action) => {
    secondMiddlewareWork(action)
    return next(action)
  }
  addMiddleware(firstMiddleware)
  addMiddleware(secondMiddleware)

  store.dispatch({ type: 'foo' })
  expect(firstMiddlewareWork).toBeCalledWith({ type: 'foo' })
  expect(secondMiddlewareWork).toBeCalledWith({ type: 'foo' })
})

test('removed middlewares should not be called', () => {
  const store = createStore(reducer, applyMiddleware(dynamicMiddlewares))
  const firstMiddlewareWork = jest.fn()
  const firstMiddleware = () => next => (action) => {
    firstMiddlewareWork(action)
    return next(action)
  }
  const secondMiddlewareWork = jest.fn()
  const secondMiddleware = () => next => (action) => {
    secondMiddlewareWork(action)
    return next(action)
  }
  addMiddleware(firstMiddleware, secondMiddleware)
  removeMiddleware(secondMiddleware)

  store.dispatch({ type: 'foo' })
  expect(firstMiddlewareWork).toBeCalledWith({ type: 'foo' })
  expect(secondMiddlewareWork).not.toBeCalled()
})

test('reset middlewares should work', () => {
  const store = createStore(reducer, applyMiddleware(dynamicMiddlewares))
  const firstMiddlewareWork = jest.fn()
  const firstMiddleware = () => next => (action) => {
    firstMiddlewareWork(action)
    return next(action)
  }
  const secondMiddlewareWork = jest.fn()
  const secondMiddleware = () => next => (action) => {
    secondMiddlewareWork(action)
    return next(action)
  }
  addMiddleware(firstMiddleware, secondMiddleware)
  resetMiddlewares()

  store.dispatch({ type: 'foo' })
  expect(firstMiddlewareWork).not.toBeCalled()
  expect(secondMiddlewareWork).not.toBeCalled()
})
