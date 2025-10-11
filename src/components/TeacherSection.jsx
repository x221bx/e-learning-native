import React from 'react';
import SectionHeader from './SectionHeader';
import HorizontalList from './HorizontalList';
import TeacherCard from './TeacherCard';

export default function TeacherSection({ title = 'Top teachers', data, onMore, onTeacherPress }) {
  return (
    <>
      <SectionHeader title={title} onPress={onMore} />
      <HorizontalList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TeacherCard teacher={item} onPress={() => onTeacherPress?.(item)} />
        )}
      />
    </>
  );
}
