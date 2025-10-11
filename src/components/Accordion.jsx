import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

export default function Accordion({ sections = [], initiallyOpen }) {
  const [open, setOpen] = useState(initiallyOpen ?? sections?.[0]?.id);
  return (
    <View>
      {sections.map((sec) => (
        <View key={sec.id} style={styles.sectionWrap}>
          <TouchableOpacity onPress={() => setOpen(open === sec.id ? null : sec.id)} style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{sec.title}</Text>
            <Ionicons name={open === sec.id ? 'chevron-up' : 'chevron-down'} size={18} color={theme.colors.text} />
          </TouchableOpacity>
          {open === sec.id && (
            <View style={{ paddingHorizontal: 10 }}>
              {sec.items?.map((it, idx) => {
                const Container = it.onPress ? TouchableOpacity : View;
                return (
                  <Container key={it.id || idx} style={styles.itemRow} onPress={it.onPress}>
                    {typeof it.index !== 'undefined' ? (
                      <Text style={styles.index}>{String(it.index).padStart(2, '0')}</Text>
                    ) : null}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{it.title}</Text>
                      {it.subtitle ? <Text style={styles.itemMeta}>{it.subtitle}</Text> : null}
                    </View>
                    {it.trailing}
                  </Container>
                );
              })}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrap: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, marginTop: 12, backgroundColor: '#fff' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12 },
  sectionHeaderText: { fontWeight: '700', color: theme.colors.text },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  index: { width: 28, color: theme.colors.muted, fontWeight: '700' },
  itemTitle: { fontWeight: '600', color: theme.colors.text },
  itemMeta: { color: theme.colors.muted, fontSize: 12 },
});
