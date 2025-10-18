// Stub module to prevent Webpack from bundling legacy Drawer that relies on Reanimated v1 APIs
// This file is only aliased on web builds via webpack.config.js
export default function LegacyDrawerStub() {
  console.warn('[Stub] legacy Drawer should not be used on web build');
  return null;
}

