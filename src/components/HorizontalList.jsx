import React from 'react';
import { FlatList } from 'react-native';

export default function HorizontalList({
  data,
  keyExtractor,
  renderItem,
  paddingBottom = 8,
  onEndReached,
  onEndReachedThreshold = 0.5,
  refreshing,
  onRefresh,
  ListFooterComponent,
}) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom }}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListFooterComponent={ListFooterComponent}
    />
  );
}
