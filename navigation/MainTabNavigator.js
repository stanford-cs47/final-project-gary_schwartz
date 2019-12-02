import React from 'react';
import { Platform, Text, View } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ExistingTreesScreen from '../screens/ExistingTreesScreen';
import ProCon from '../components/ProCon';
import { AntDesign, Entypo } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    ProCon: { screen: ProCon },
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'New Tree',
  tabBarIcon: ({ focused }) => (
    // <TabBarIcon
    //   focused={focused}
    //   name={
    //     Platform.OS === 'ios'
    //       ? `ios-information-circle${focused ? '' : '-outline'}`
    //       : 'md-information-circle'
    //   }
    // />
    <Entypo
      name={"flow-tree"}
      size={26}
      style={{ marginBottom: -3 }}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  ),
};

HomeStack.path = '';

const ExistingTreesStack = createStackNavigator(
  {
    ExistingTrees: ExistingTreesScreen,
    Random: () => <View><Text>RANDOM TEXT</Text></View>,
    ProCon2: { screen: ProCon },
  },
  config
);

ExistingTreesStack.navigationOptions = {
  tabBarLabel: 'Existing Trees',
  tabBarIcon: ({ focused }) => (
    // Platform.OS 
    // ? 
    <AntDesign
      name={"profile"}
      size={26}
      style={{ marginBottom: -3 }}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
    // : 
    // <TabBarIcon focused={focused} name={'md-link'} />
  ),
};

ExistingTreesStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  ExistingTreesStack,
});

tabNavigator.path = '';

export default tabNavigator;
