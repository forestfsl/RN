import React  from "react";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from "@/pages/Home";
import Listen from "@/pages/Listen";
import Account from "@/pages/Account";
import Found from "@/pages/Found";
import {RootStackNavigation, RootStackParamList} from "@/navigator/index";
import {RouteProp, TabNavigationState} from "@react-navigation/native";


export type BottomTabParamList = {
    Home: undefined;
    Listen: undefined;
    Found: undefined;
    Account:undefined;
};
const Tab = createBottomTabNavigator<BottomTabParamList>();
type Route = RouteProp<RootStackParamList,'BottomTabs'> & {
    state?: TabNavigationState;
}

function getHeaderTitle(route: Route){
    const routeName = route.state ? route.state.routes[route.state.index].name : route.params?.screen || 'Home';
    switch (routeName){
        case 'Home':
            return '首页22';
        case 'Listen':
            return '我听';
        case 'Found':
            return '发现';
        case 'Account':
            return '账户';
        default:
            return '首页12';
    }
}
interface IProps {
    navigation: RootStackNavigation;
    route:RouteProp<RootStackParamList,'BottomTabs'>
}

class BottomTabs extends  React.Component<IProps> {
    componentDidUpdate() {
        const { navigation ,route} = this.props;
        navigation.setOptions({
            headerTitle:getHeaderTitle(route),
        })
    }

    render(){
        return(
                <Tab.Navigator screenOptions={{
                    tabBarActiveTintColor:'#f86442',
                    headerShown:false,
                }}>
                    <Tab.Screen name="Home" component={Home} options={{tabBarLabel:'首页'}}/>
                    <Tab.Screen name="Listen" component={Listen} options={{tabBarLabel:'我听'}}/>
                    <Tab.Screen name="Found" component={Found} options={{tabBarLabel:'发现'}}/>
                    <Tab.Screen name="Account" component={Account} options={{tabBarLabel:'我的'}}/>
                </Tab.Navigator>
        );
    }
}

export default BottomTabs;
