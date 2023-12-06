import {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  afterEach,
} from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import AccountActivationPage from "./AccountActivationPage.vue";
import { setupServer } from "msw/node";
import { rest } from "msw";

let counter;
const server = setupServer();
// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  location.replace(`http://127.0.0.1`);
});
// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
//  Close server after all tests
afterAll(() => server.close());

describe("Account Activation Page", () => {
  let wrapper;
  const setup = (token) => {
    wrapper = mount(AccountActivationPage, {
      propsData: {
        token: token 
      }
    });
  };

  let counter;
  beforeEach(() => {
    counter = 0;
    server.use(
      rest.post("/api/users/token/:token", (req, res, ctx) => {
        counter += 1;
        if (req.params.token === "1234") {
          return res(
            ctx.status(200),
            ctx.json({ message: "Account is activated" })
          );
        }
        return res(
          ctx.status(400),
          ctx.json({ message: "Activation failure" })
        );
      })
    );
  });

  it("should be display activation success message when token is correct", async () => {
    setup("1234");
    await flushPromises();
    const page = await wrapper.html();
    expect(page).toContain("Account is activated");
  });

  it("should be send activation request to backend", async () => {
    setup("5678");
    await flushPromises();
    expect(counter).toBe(1);
  });

  it("should be display activation failure message when token is incorrect", async () => {
    setup("5678");
    await flushPromises();
    const page = await wrapper.html();
    expect(page).toContain("Activation failure");
  });
});
