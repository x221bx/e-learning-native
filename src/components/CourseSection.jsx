import React from 'react';
import SectionHeader from './SectionHeader';
import HorizontalList from './HorizontalList';
import { CourseCardHorizontal } from './CourseCard';

export default function CourseSection({ title, data, onMore, onPressItem, onEndReached, loading, hasMore }) {
  return (
    <>
      <SectionHeader title={title} onPress={onMore} />
      <HorizontalList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CourseCardHorizontal course={item} onPress={() => onPressItem?.(item)} />}
        onEndReached={hasMore ? onEndReached : undefined}
        ListFooterComponent={loading ? (() => null) : undefined}
      />
    </>
  );
}
