import { uniqueId } from "lodash-es";

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

// Post data to parent thread
ctx.postMessage({ foo: "foo" });

// Respond to message from parent thread
ctx.addEventListener("message", event => console.log(event));

console.log("testing", uniqueId());
