import React, { useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";

export default function TableList({ navigation }) {
  const [tables, setTables] = useState([]);

  const addTable = () => {
    const newTable = {
      id: tables.length + 1,
      name: `Table ${tables.length + 1}`,
    };
    setTables([...tables, newTable]);
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <FlatList
        data={tables}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TableDetail", { tableId: item.id })
            }
          >
            <Text className="text-lg">{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Add Table" onPress={addTable} />
    </View>
  );
}
