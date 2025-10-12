import React from 'react';
import { View, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';

import { t } from '../i18n';

export default function CustomDrawerContent(props) {
  const user = useSelector((s) => s.user.user);
  const name = (user?.name && String(user.name).trim()) || 'Learner';

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontWeight: '800', fontSize: 16 }}>{t('hello_name', { name })} 👋</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

