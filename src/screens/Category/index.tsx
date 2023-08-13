import React, {useState} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {useRoute, useTheme} from '@react-navigation/native';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {Button, Card, TextInput, Switch, Divider} from 'react-native-paper';
import {ImmutableObject, useHookstate} from '@hookstate/core';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {ParamList} from '../../types';
import {GapView} from '../../components';
import {Field, FieldType, Machine, store} from '../../store';

type Props = DrawerScreenProps<ParamList, string>;

export default function CategoryScreen() {
  const allCategories = useHookstate(store.category);
  const {params} = useRoute<Props['route']>();
  console.log('route', JSON.stringify(params));

  const addNewItem = () => {
    allCategories.set(category => {
      const cat = [...category];
      cat[params?.index!].machines?.push({
        name: '',
        fields: cat[params?.index!].fields,
      });
      return cat;
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

  const DATA = [
    {
      name: '',
      fields: [
        {name: 'Model', value: '', type: 'Number'},
        {name: 'Model', value: '', type: 'Date'},
        {name: 'Model', value: '', type: 'Checkbox'},
      ],
    },
    // {
    //   name: '',
    //   fields: [{name: 'Model', value: '', type: 'Checkbox'}],
    // },
    // {
    //   name: '',
    //   fields: [{name: 'Model', value: '', type: 'Checkbox'}],
    // },
  ];

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
        renderItem={({item, index}) => (
          <Item item={item} index={index} catIndex={params?.index!} />
        )}
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

const renderTypeFields = (
  item: Field,
  index: number,
  index2: number,
  catIndex: number,
) => {
  const allCategories = useHookstate(store.category);
  const [showPicker, setShowPicker] = useState(false);

  const updateValue = (
    type: FieldType,
    index: number,
    value?: string | boolean,
  ) => {
    // if (type != 'Checkbox') {
    //   allCategories[]
    // }
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
          onChangeText={text => updateValue(item.type, index, text)}
        />
      </Card.Content>
    );
  }
  if (item.type == 'Date') {
    return (
      <Card.Content>
        {showPicker && (
          <DateTimePicker
            value={item.value as Date}
            mode="date" // You can set 'date', 'time', or 'datetime'
            onChange={(event, date) =>
              handleDateChange(event, item.value, index, index2, catIndex, date)
            }
          />
        )}
        <TextInput
          label={item.name}
          value={item.value as string}
          onFocus={() => setShowPicker(true)}
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
          keyboardType="number-pad"
          mode="outlined"
          onChangeText={text => updateValue(item.type, index, text)}
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
            onValueChange={value => updateValue(item.type, index, value)}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
