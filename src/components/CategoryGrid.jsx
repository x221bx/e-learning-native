import React from 'react';
import { View, useWindowDimensions, Platform } from 'react-native';
import CategoryCard from './CategoryCard';

export default function CategoryGrid({ items = [], onPressCategory }) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  let columns = 2;
  if (isWeb) {
    if (width >= 1200) columns = 4;
    else if (width >= 800) columns = 3;
  }
  const gutter = 12;
  const itemWidthPercent = `${(100 - (columns - 1) * 2) / columns}%`;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
      {items.map((c, idx) => (
        <View key={c.id} style={{ width: itemWidthPercent, marginRight: (idx + 1) % columns === 0 ? 0 : '2%', marginBottom: gutter }}>
          <CategoryCard name={c.name} icon={c.icon} color={c.color} onPress={() => onPressCategory?.(c)} />
        </View>
      ))}
    </View>
  );
}
