import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useHookstate} from '@hookstate/core';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {Category, Dashboard, ManageCategory} from '../screens';
import {store} from '../store';

export default function RootNav() {
  const Drawer = createDrawerNavigator();
  const category = useHookstate(store.category);

  function MyDrawer() {
    return (
      <Drawer.Navigator>
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        {category.get().length > 0 &&
          category.get().map(item => {
            return <Drawer.Screen name={item.name} component={Category} />;
          })}
        <Drawer.Screen name="Manage Category" component={ManageCategory} />
      </Drawer.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
