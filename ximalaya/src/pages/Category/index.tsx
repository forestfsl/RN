/* eslint-disable @typescript-eslint/no-unused-vars */
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {RootState} from '@/models/index';
import {connect, ConnectedProps} from 'react-redux';
import {ICategory} from '@/models/category';
import {viewportWidth} from '@/utils/';
import _ from 'lodash';
import Item from './item';
import React from 'react';
import {RootStackNavigation} from '@/navigator/index';
import HeaderRightBtn from './HeaderRightBtn';
import Touchable from '@/components/Touchable';
import {DragSortableView} from 'react-native-drag-sort';

const mapStateToProps = ({category}: RootState) => {
  return {
    myCategorys: category.myCategorys,
    categorys: category.categorys,
    isEdit: category.isEdit,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  navigation: RootStackNavigation;
}

interface IState {
  myCategorys: ICategory[];
}

const fixedItems = [0, 1];

export const parentWidth = viewportWidth - 10;
export const itemWidth = parentWidth / 4;
export const itemHeight = 48;
export const margin = 5;
// console.log('xxxxxxxxxxxxxxxxxxxxx');
// console.log(viewportHeight);

class Category extends React.Component<IProps, IState> {
  state = {
    myCategorys: this.props.myCategorys,
  };
  constructor(props: IProps) {
    super(props);
    props.navigation.setOptions({
      headerRight: () => <HeaderRightBtn onSubmit={this.onSubmit} />,
    });
  }
  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'category/setState',
      payload: {
        isEdit: false,
      },
    });
  }
  onSubmit = () => {
    const {dispatch, navigation, isEdit} = this.props;
    const {myCategorys} = this.state;
    dispatch({
      type: 'category/toggle',
      payload: {
        myCategorys,
      },
    });
    if (isEdit) {
      navigation.goBack();
    }
  };
  onLongPress = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'category/toggle',
      payload: {
        isEdit: true,
      },
    });
  };
  onPress = (item: ICategory, index: number, selected: boolean) => {
    const {isEdit} = this.props;
    const {myCategorys} = this.state;
    const disabled = fixedItems.indexOf(index) > -1;
    if (disabled) {
      return;
    }
    // console.log('yyyyyyyyyyyy');
    // console.log(myCategorys);
    if (isEdit) {
      if (selected) {
        this.setState({
          myCategorys: myCategorys.filter(
            selectedItem => selectedItem.id !== item.id,
          ),
        });
      } else {
        this.setState({
          myCategorys: myCategorys.concat([item]),
        });
      }
    } else {
    }
  };
  onClickItem = (data: ICategory[], item: ICategory) => {
    this.onPress(item, data.indexOf(item), true);
  };
  onDataChange = (data: ICategory[]) => {
    const {dispatch} = this.props;
    // console.log('zzzzz');
    // console.log(data);
    dispatch({
      type: 'category/setState',
      payload: {
        myCategorys: data.concat(),
      },
    });
  };
  renderItem = (item: ICategory, index: number) => {
    const {isEdit} = this.props;
    const disabled = fixedItems.indexOf(index) > -1;
    return (
      <Item data={item} disabled={disabled} isEdit={isEdit} selected={true} />
    );
  };
  renderUnSelectedItem = (item: ICategory, index: number) => {
    const {isEdit} = this.props;
    return (
      <Touchable
        key={item.id}
        onPress={() => this.onPress(item, index, false)}
        onLongPress={this.onLongPress}>
        <Item data={item} disabled={false} isEdit={isEdit} selected={false} />
      </Touchable>
    );
  };
  render() {
    const {categorys, isEdit} = this.props;
    const {myCategorys} = this.state;
    /*
    {
        '推荐': []
    }
    */
    const classifyGroup = _.groupBy(categorys, item => item.classify);
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.classifyName}>我的分类</Text>
        <View style={styles.classifyView}>
          <DragSortableView
            dataSource={myCategorys}
            renderItem={this.renderItem}
            sortable={isEdit}
            keyExtractor={item => item.id}
            onDataChange={this.onDataChange}
            parentWidth={parentWidth}
            childrenWidth={itemWidth}
            childrenHeight={itemHeight}
            marginChildrenTop={margin}
            onClickItem={this.onClickItem}
          />
        </View>
        <View>
          {Object.keys(classifyGroup).map(classify => {
            return (
              <View key={classify}>
                <Text style={styles.classifyName}>{classify}</Text>
                <View style={styles.classifyView}>
                  {classifyGroup[classify].map((item, index) => {
                    if (
                      myCategorys.find(
                        selectedItem => selectedItem.id === item.id,
                      )
                    ) {
                      return null;
                    }
                    return this.renderUnSelectedItem(item, index);
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6f6',
  },
  classifyName: {
    fontSize: 16,
    marginTop: 14,
    marginBottom: 8,
    marginLeft: 10,
  },
  classifyView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  itemWrapper: {
    width: itemWidth,
    height: 48,
  },
  item: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
});

export default connector(Category);
