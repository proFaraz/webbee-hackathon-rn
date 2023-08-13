import React from 'react';
import {StyleSheet, Text, View, SectionList} from 'react-native';
import {useHookstate} from '@hookstate/core';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {DrawerScreenProps} from '@react-navigation/drawer';

import {store} from '../../store';
import {GapView} from '../../components';
import {ParamList} from '../../types';

type DashboardNavigationProps = DrawerScreenProps<ParamList, 'Dashboard'>;

export default function Dashboard() {
  const navigation = useNavigation<DashboardNavigationProps['navigation']>();
  const allCategories = useHookstate(store.category);
  console.log('cats', allCategories);
  const DATA = [
    {
      title: 'Main dishes',
      data: ['Pizza', 'Burger', 'Risotto'],
    },
    {
      title: 'Sides',
      data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
    },
    {
      title: 'Drinks',
      data: ['Water', 'Coke', 'Beer'],
    },
    {
      title: 'Desserts',
      data: ['Cheese Cake', 'Ice Cream'],
    },
  ];
  return (
    <View style={styles.container}>
      <SectionList
        sections={[]}
        contentContainerStyle={{flexGrow: 1}}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item}</Text>
          </View>
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={styles.header}>No Categories Found</Text>
            <GapView />
            <Button
              icon="plus"
              mode="contained"
              style={{borderRadius: 5}}
              onPress={() => navigation.navigate('Manage Category')}>
              Add Category
            </Button>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
  },
});
