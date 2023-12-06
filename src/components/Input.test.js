import { it, expect } from "vitest";
import Input from "./Input.vue";
import { mount } from "@vue/test-utils";

it("has is-invalid class for input when help is set", () => {
  const wrapper = mount(Input, {
    props: { help: { message: "Error message" } },
  });
  const input = wrapper.find("input");
  expect(input.classes().includes("is-invalid")).toBeTruthy();
});

it("has invalid-feedback class for error div when help is set", () => {
  const wrapper = mount(Input, {
    props: { help: { message: "Error message" } },
  });
  const errorDiv = wrapper.find("#error");
  expect(errorDiv.classes().includes("invalid-feedback")).toBeTruthy();
});

it("should not have invalid-feedback class for error div when help is not set", () => {
    const wrapper = mount(Input);
    const input = wrapper.find("input");
    expect(input.classes().includes("is-invalid")).toBeFalsy();
  });