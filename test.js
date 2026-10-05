// Logic self-check: node test.js  (exits non-zero on failure)
const assert = require("assert");
const { parseDur, fmt } = require("./content.js");

assert.equal(parseDur("10:23"), 623);
assert.equal(parseDur("1:02:33"), 3753);
assert.equal(parseDur("0:59"), 59);
assert.equal(parseDur("4K"), null);
assert.equal(parseDur("LIVE"), null);
assert.equal(parseDur(""), null);

const eur30 = { rate: 30, currency: "EUR" };
assert.equal(fmt(3600, eur30), "€30.00"); // 1h at 30/h
assert.equal(fmt(623, eur30), "€5.19"); // 10:23
assert.equal(fmt(60, { rate: 60, currency: "USD" }), "$1.00");

console.log("ok");
