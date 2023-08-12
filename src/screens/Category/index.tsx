import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {useRoute, useTheme} from '@react-navigation/native';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {Button, Card, TextInput, Switch, Divider} from 'react-native-paper';
import {ImmutableObject, useHookstate} from '@hookstate/core';

import {ParamList} from '../../types';
import {GapView} from '../../components';
import {Field, FieldType, Machine, store} from '../../store';

type Props = DrawerScreenProps<ParamList, string>;

export default function CategoryScreen() {
  const allCategories = useHookstate(store.category);
  const {params} = useRoute<Props['route']>();
  console.log('route', JSON.stringify(params));

  const addNewItem = () => {
    allCategories[params?.index!].set(cats => {
      const selectedCategory = cats[params?.index!];

      const newFields = selectedCategory.fields.map((attribute: Field) => ({
        name: attribute.name,
        value: '',
        type: attribute.type,
      }));

      const newMachine = {
        name: '',
        fields: newFields,
      };

      const newMachines = [...(cats.machines || []), newMachine];

      return {...cats, machines: newMachines};
    });
  };

  const updateField = (value: string, catIndex: number, fieldIndex: number) => {
    allCategories[catIndex].fields.set(prevFields => {
      const newFields = prevFields.map((field, index) => {
        if (index === fieldIndex) {
          return {...field, name: value};
        }
        return field;
      });
      return newFields;
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={styles.title}>{params?.item.name}</Text>
        <Button
          mode="contained"
          style={{borderRadius: 5}}
          onPress={() => addNewItem()}>
          Add New Item
        </Button>
      </View>
      <GapView />
      <Divider />
      <FlatList
        data={params?.item.machines}
        contentContainerStyle={{flexGrow: 1}}
        renderItem={({item, index}) => <Item item={item} index={index} />}
        ItemSeparatorComponent={() => <GapView />}
        // keyExtractor={item => item.id}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text>No Categories to Display</Text>
          </View>
        )}
      />
    </View>
  );
}

const renderTypeFields = (item: Field, index: number) => {
  const allCategories = useHookstate(store.category);

  const updateValue = (
    type: FieldType,
    index: number,
    value?: string | boolean,
  ) => {
    // if (type != 'Checkbox') {
    //   allCategories[]
    // }
  };

  if (item.type == 'Text') {
    return (
      <Card.Content>
        <TextInput
          label={item.name}
          value={item.value as string}
          mode="outlined"
          onChangeText={text => updateValue(item.type, index, text)}
        />
      </Card.Content>
    );
  }
  if (item.type == 'Date') {
    return (
      <Card.Content>
        <TextInput
          label={item.name}
          value={item.value as string}
          mode="outlined"
          onChangeText={text => updateValue(item.type, index, text)}
        />
      </Card.Content>
    );
  }
  if (item.type == 'Number') {
    return (
      <Card.Content>
        <TextInput
          label={item.name}
          value={item.value as string}
          mode="outlined"
          onChangeText={text => updateValue(item.type, index, text)}
        />
      </Card.Content>
    );
  }
  if (item.type == 'Checkbox') {
    return (
      <Card.Content>
        <Switch
          value={item.value as boolean}
          onValueChange={value => updateValue(item.type, index, value)}
        />
      </Card.Content>
    );
  }
};

const Item = ({
  item,
  index,
}: {
  item: ImmutableObject<Machine>;
  index: number;
}) => {
  // const allCategories = useHookstate(store.category);
  const {colors} = useTheme();

  return (
    <Card
      key={index}
      mode="contained"
      style={{borderRadius: 2, backgroundColor: colors.card}}>
      <Card.Title titleStyle={{fontSize: 20}} title={'Name'} />
      {item.fields.map((item2, index2) => {
        return renderTypeFields(item2, index2);
      })}
      <Card.Actions>
        <Button
          icon="delete"
          mode="outlined"
          style={{borderRadius: 5}}
          // onPress={() => removeCategory(index)}
        >
          Remove
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
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
    fontSize: 22,
    fontWeight: 'bold',
  },
});
