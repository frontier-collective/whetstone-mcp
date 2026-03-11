// Base class for all Whetstone web components.
// Disables Shadow DOM so Tailwind utility classes work normally.
// All components extend WhetBase instead of LitElement directly.

export const BASE_COMPONENT = `
class WhetBase extends LitElement {
  createRenderRoot() {
    return this;
  }
}
`;
