import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useHookstate} from '@hookstate/core';
import {
  NavigationContainer,
  DefaultTheme,
  Theme,
} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {PaperProvider, DefaultTheme as DTheme} from 'react-native-paper';

import {Category, Dashboard, ManageCategory} from '../screens';
import {store} from '../store';
import {ParamList} from '../types';

const MyTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    primary: 'rgb(0, 122, 255)',
    background: 'rgb(240,238,240)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  },
};

export default function RootNav() {
  const Drawer = createDrawerNavigator();
  const category = useHookstate(store.category);

  function MyDrawer() {
    return (
      <Drawer.Navigator>
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        {category.get().length > 0 &&
          category.get().map((item, index) => {
            return (
              <Drawer.Screen
                key={item.id}
                name={Boolean(item?.name) ? item?.name : "invalid name" + index}
                component={Category}
                initialParams={{item, index}}
              />
            );
          })}
        <Drawer.Screen name="Manage Category" component={ManageCategory} />
      </Drawer.Navigator>
    );
  }

  return (
    <NavigationContainer theme={MyTheme}>
      <PaperProvider theme={DTheme}>
        <MyDrawer />
      </PaperProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
