import React, {useState} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {useHookstate, ImmutableObject} from '@hookstate/core';
import {Button, Card, TextInput, Switch, Divider} from 'react-native-paper';
import {useNavigation, useTheme} from '@react-navigation/native';
import {DrawerScreenProps} from '@react-navigation/drawer';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {Field, FieldType, Machine, store} from '../../store';
import {GapView} from '../../components';
import {ParamList} from '../../types';

type DashboardNavigationProps = DrawerScreenProps<ParamList, 'Dashboard'>;

export default function Dashboard() {
  const navigation = useNavigation<DashboardNavigationProps['navigation']>();
  const allCategories = useHookstate(store.category);
  console.log('cats', allCategories);

  const addNewItem = (index: number) => {
    allCategories[index].set(cats => {
      const newFields = cats.fields.map((attribute: Field) => ({
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

  const data = [
    {
      id: '1691913265577-1471',
      name: 'New Tes',
      fields: [
        {name: 'key1', value: '', type: 'Text'},
        {name: 'key 2', value: '', type: 'Date'},
        {name: 'key 3', value: '', type: 'Checkbox'},
        {name: 'key 4', value: '', type: 'Number'},
      ],
      machines: [
        {
          name: '',
          fields: [
            {name: 'key1', value: 'test 1', type: 'Text'},
            {
              name: 'key 2',
              value: '2023-08-15T07:55:24.362Z',
              type: 'Date',
            },
            {name: 'key 3', value: true, type: 'Checkbox'},
            {name: 'key 4', value: '500', type: 'Number'},
          ],
        },
      ],
    },
    {
      id: '1691913265577-1472',
      name: 'New Te1',
      fields: [
        {name: 'key1', value: '', type: 'Text'},
        {name: 'key 2', value: '', type: 'Date'},
        {name: 'key 3', value: '', type: 'Checkbox'},
        {name: 'key 4', value: '', type: 'Number'},
      ],
      machines: [
        {
          name: '',
          fields: [
            {name: 'key1', value: 'test 1', type: 'Text'},
            {
              name: 'key 2',
              value: '2023-08-15T07:55:24.362Z',
              type: 'Date',
            },
            {name: 'key 3', value: true, type: 'Checkbox'},
            {name: 'key 4', value: '500', type: 'Number'},
          ],
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={allCategories.get()}
        ItemSeparatorComponent={() => <GapView />}
        contentContainerStyle={{flexGrow: 1}}
        keyExtractor={(item, index) => item.id}
        renderItem={({item, index}) => (
          <View style={styles.item}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.title}>{item.name}</Text>
              <Button
                mode="contained"
                style={{borderRadius: 5}}
                onPress={() => addNewItem(index)}>
                Add New Item
              </Button>
            </View>
            <GapView />
            <Divider />
            <GapView />
            {item?.machines?.length! > 0 ? (
              item.machines?.map((mach, machIndex) => {
                return <Item item={mach} catIndex={index} index={machIndex} />;
              })
            ) : (
              <View style={{alignItems: 'center'}}>
                <Text>No items to Display</Text>
              </View>
            )}
          </View>
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

const renderTypeFields = (
  item: Field,
  index: number,
  index2: number,
  catIndex: number,
) => {
  const allCategories = useHookstate(store.category);
  const [showPicker, setShowPicker] = useState(false);

  const updateField = (
    index: number,
    index2: number,
    catIndex: number,
    value: string | boolean,
  ) => {
    allCategories[catIndex].machines.set(prevFields => {
      const temp = [...prevFields!];
      temp[index].fields[index2].value = value;
      temp[index].name = temp[index].fields[0].value as string;
      return temp;
    });
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    value: string | boolean | Date | undefined,
    index: number,
    index2: number,
    catIndex: number,
    selected?: Date,
  ) => {
    const currentDate = selected || value;
    setShowPicker(false);
    allCategories[catIndex].machines.set(prevFields => {
      const temp = [...prevFields!];
      temp[index].fields[index2].value = currentDate;
      return temp;
    });
  };

  if (item.type == 'Text') {
    return (
      <Card.Content>
        <TextInput
          label={item.name}
          value={item.value as string}
          mode="outlined"
          onChangeText={text => updateField(index, index2, catIndex, text)}
        />
      </Card.Content>
    );
  }
  if (item.type == 'Date') {
    return (
      <Card.Content>
        {showPicker && (
          <DateTimePicker
            value={
              item.value ? new Date(item.value as string) : (new Date() as Date)
            }
            mode="date" // You can set 'date', 'time', or 'datetime'
            onChange={(event, date) =>
              handleDateChange(event, item.value, index, index2, catIndex, date)
            }
          />
        )}
        <TextInput
          label={item.name}
          value={!item.value ? '' : (item.value?.toString() as string)}
          onFocus={() => setShowPicker(true)}
          mode="outlined"
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
          keyboardType="number-pad"
          mode="outlined"
          onChangeText={text => updateField(index, index2, catIndex, text)}
        />
      </Card.Content>
    );
  }
  if (item.type == 'Checkbox') {
    return (
      <Card.Content>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Switch
            value={item.value as boolean}
            onValueChange={value => updateField(index, index2, catIndex, value)}
          />
          <Text>{item.name}</Text>
        </View>
      </Card.Content>
    );
  }
};

const Item = ({
  item,
  index,
  catIndex,
}: {
  item: ImmutableObject<Machine>;
  index: number;
  catIndex: number;
}) => {
  const allCategories = useHookstate(store.category);
  const {colors} = useTheme();

  const removeItem = (index: number) => {
    allCategories[catIndex].machines.set(prevFields => {
      const newFields = [...prevFields!];
      newFields.splice(index, 1);
      return newFields;
    });
  };

  return (
    <>
      <Card
        key={index}
        mode="contained"
        style={{borderRadius: 2, backgroundColor: colors.card}}>
        <Card.Title
          titleStyle={{fontSize: 20}}
          title={item.name.length > 0 ? item.name : 'Unnamed Field'}
        />
        {item.fields.map((item2, index2) => {
          return renderTypeFields(item2, index, index2, catIndex);
        })}
        <Card.Actions>
          <Button
            icon="delete"
            mode="outlined"
            style={{borderRadius: 5}}
            onPress={() => removeItem(index)}>
            Remove
          </Button>
        </Card.Actions>
      </Card>
      <GapView />
    </>
  );
};

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
    marginVertical: 8,
  },
  header: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
  },
});
