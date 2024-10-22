import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TableList from "../screens/TableList";
import TableDetail from "../screens/TableDetail";

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="TableList">
      <Stack.Screen name="TableList" component={TableList} />
      <Stack.Screen name="TableDetail" component={TableDetail} />
    </Stack.Navigator>
  );
}
