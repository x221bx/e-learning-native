import React from 'react';
import Accordion from '../../components/Accordion';
import theme from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export default function LessonsSection({ course, navigation }) {
  const sections = course.curriculum?.map((sec) => ({
    id: sec.id,
    title: sec.title,
    items: sec.items.map((it, idx) => ({
      id: it.id,
      index: idx + 1,
      title: it.title,
      subtitle: `${it.duration} mins`,
      trailing: (
        <Ionicons name={it.isFree ? 'checkmark' : 'play-circle'} size={18} color={theme.colors.primary} />
      ),
      onPress: () => navigation?.navigate?.('CoursePlay', { courseId: course.id, lessonId: it.id }),
    })),
  }));
  return <Accordion sections={sections} initiallyOpen={sections?.[0]?.id} />;
}

