/* eslint-disable global-require */
import React from 'react';
import { ExpoRoot } from 'expo-router';

export default function App() {
  const context = require.context('./app');
  return <ExpoRoot context={context} />;
}
