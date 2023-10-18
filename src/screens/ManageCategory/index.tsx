import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import {useHookstate, ImmutableObject, none} from '@hookstate/core';
import {Button, Card, TextInput, IconButton, Menu} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {Category, FieldType, store} from '../../store';
import {GapView} from '../../components';

export default function ManageCategory() {
  const allCategories = useHookstate(store?.category);
  const {colors} = useTheme();

  console.log('check1', allCategories.get());
  const addNewCategory = () => {
    allCategories.set(category => {
      return [
        ...category,
        {
          id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          name: 'New Category',
          fields: [{name: '', value: '', type: 'Text'}],
          machines: [],
        },
      ];
    });
  };
  function renderItem({item, index}: {item: Category; index: number}) {
    return <Item item={item} index={index} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={allCategories.get() as Category[]}
        contentContainerStyle={{flexGrow: 1}}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <GapView />}
        keyExtractor={item => item?.id}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text>No Categories to Display</Text>
          </View>
        )}
      />
      <View style={{backgroundColor: colors.background, paddingTop: 5}}>
        <Button
          icon="plus"
          mode="contained"
          style={{borderRadius: 5}}
          onPress={() => addNewCategory()}>
          Add New Category
        </Button>
      </View>
    </View>
  );
}

const Item = ({
  item,
  index,
}: {
  item: ImmutableObject<Category>;
  index: number;
  onUpdateCategory?: () => void;
}) => {
  const allCategories = useHookstate(store.category);

  const {colors} = useTheme();
  const [visible, setVisible] = useState(false);

  const [title, setTitle] = useState('');

  const openMenu = (index: number) => setVisible(true);
  const closeMenu = () => setVisible(false);

  const addNewField = (index: number, type: FieldType) => {
    allCategories.set(category => {
      const cat = [...category];
      cat[index].fields.push({name: '', value: '', type});
      return cat;
    });
  };

  const updateField = (value: string, catIndex: number, fieldIndex: number) => {
    allCategories[catIndex].fields.set(prevFields => {
      const newFields = prevFields?.map((field, index) => {
        if (index === fieldIndex) {
          return {...field, name: value};
        }
        return field;
      });
      return newFields;
    });
  };

  const removeField = ({
    categoryIndex,
    fieldIndex,
  }: {
    categoryIndex: number;
    fieldIndex: number;
  }) => {
    allCategories[categoryIndex].fields.set(prevFields => {
      const newFields = [...prevFields];
      if (newFields.length > 1) newFields.splice(fieldIndex, 1);
      return newFields;
    });
  };

  /**
   *
   * @param itemID
   * @description splice option
   */
  // const removeCategory = (index: number) => {
  //   setTimeout(() => allCategories[index].set(none), 5);
  //   // allCategories.set(category => {
  //   //   const newCategories = [...category];
  //   //   newCategories.splice(index, 1);
  //   //   return newCategories;
  //   // });
  // };

  /**
   *
   * @param itemID
   * @description Filter option
   */
  const removeCategory2 = async (itemID: string) => {
    const newCategories = JSON.parse(JSON.stringify(allCategories.get()));
    const arr = await newCategories.filter((item: Category) => {
      return item.id !== itemID;
    });
    allCategories?.set(none);
    setTimeout(() => {
      allCategories?.set(arr);
    }, 0);
  };

  const updateCategory = (catIndex: number, value: string) => {
    allCategories.set(cat => {
      const newArr = [...cat]; // Create a new array based on the current state
      newArr[catIndex].name = value; // Update the specific category's name
      return newArr; // Return the updated array
    });
    setTitle('');
  };

  return (
    <KeyboardAvoidingView
      behavior="padding" // Adjust behavior as needed
      style={{flex: 1}}>
      <View>
        <Card
          key={index}
          mode="contained"
          style={{borderRadius: 2, backgroundColor: colors.card}}>
          <Card.Title titleStyle={{fontSize: 20}} title={item.name} />
          <Card.Content>
            <TextInput
              label="Category Name"
              value={title}
              mode="outlined"
              onFocus={() => setTitle(item?.name || '')}
              onChangeText={text => setTitle(text)}
              onBlur={() => updateCategory(index, title)}
            />
            {item?.fields?.map((item2, index2) => {
              const [temp, setTemp] = useState(item2?.name ?? '');

              return (
                <View
                  key={index2}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    label="Field"
                    style={{flex: 1}}
                    value={temp}
                    mode="outlined"
                    // onChangeText={text => updateField(text, index, index2)}
                    onChangeText={text => setTemp(text)}
                    onBlur={() => updateField(temp, index, index2)}
                  />

                  <Button onPress={() => console.log('Pressed')}>
                    {item2?.type}
                  </Button>
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() =>
                      removeField({categoryIndex: index, fieldIndex: index2})
                    }
                  />
                </View>
              );
            })}
            <GapView />
            <Button
              mode="contained"
              style={{borderRadius: 5}}
              onPress={() => console.log('Pressed')}>
              Title Field:{' '}
              {item?.fields[0]?.name?.length! > 0
                ? item?.fields[0]?.name
                : 'Unnamed Field'}
            </Button>
          </Card.Content>
          <Card.Actions>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Button
                  icon="plus"
                  mode="contained"
                  style={{borderRadius: 5}}
                  onPress={() => openMenu(index)}>
                  Add New Field
                </Button>
              }>
              {['Text', 'Date', 'Checkbox', 'Number'].map(item => (
                <Menu.Item
                  key={item}
                  onPress={() => {
                    addNewField(index, item as FieldType);
                  }}
                  title={item}
                />
              ))}
            </Menu>

            <Button
              icon="delete"
              mode="outlined"
              style={{borderRadius: 5}}
              onPress={() => removeCategory2(item?.id)}>
              Remove
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </KeyboardAvoidingView>
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
  header: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
  },
});

{
  /* <TextInput
                label="Field"
                style={{flex: 1}}
                value={item2.name}
                mode="outlined"
                onChangeText={text => updateField(text, index, index2)}>
                {<Button icon="pencil">""</Button>}
              </TextInput> */
}
