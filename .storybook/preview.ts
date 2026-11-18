import "../src/styles/index.scss";

const setAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function (name: string, value: string) {
  const fixed =
    this instanceof HTMLScriptElement &&
    name === "src" &&
    /^[A-Za-z]:\//.test(value)
      ? `/@fs/${value}`
      : value;
  setAttribute.call(this, name, fixed);
};

export default {
  parameters: { layout: "fullscreen" },
};

export const decorators = [];
