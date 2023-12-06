import {describe,expect,test,beforeEach,beforeAll,afterAll,afterEach, it} from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import App from "./App.vue";
import router from "./router/index";

import { setupServer } from "msw/node";
import { rest } from "msw";

let counter;
const server = setupServer(
  rest.post("/api/users/token/:token", (req, res, ctx) => {
    if (req.params.token === "1234") {
      return res(ctx.status(200), ctx.json({message: "Account is activated"}));
    }
    return res(ctx.status(400), ctx.json({message: "Activation failure"}));
  })
);
// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  location.replace(`http://127.0.0.1`);
});
// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
//  Close server after all tests
afterAll(() => server.close());

let wrapper;
const setup = async (path) => {
  wrapper = mount(App, {
    global: {
      plugins: [router],
    },
  });
  router.replace(path);
  await router.isReady();
};
describe("Routing", () => {
  it.each`
    path                | pageTestId
    ${"/"}              | ${"home-page"}
    ${"/signup"}        | ${"signup-page"}
    ${"/activate/1234"} | ${"activation-page"}
    ${"/activate/5678"} | ${"activation-page"}
  `(
    "should be display $pageTestId when path is $path",
    async ({ path, pageTestId }) => {
      setup(path);
      await flushPromises();
      expect(
        wrapper.find(`[data-testid = ${pageTestId}]`).exists()
      ).toBeTruthy();
    }
  );
});
