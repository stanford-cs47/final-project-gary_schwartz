import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button,
  Dimensions
} from 'react-native';

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state =
      {
        currText: ''
      }
  }

  goToList() {
    this.props.navigation.navigate("ProCon", {argumentSeed: this.state.currText});
  }

  onChangeText(newText) {
    this.setState({ currText: newText });
  }
    

// const { width, height } = Dimensions.get('window')
  render() {
    return (
      <View style={styles.contentContainer}>

        <View style={{ paddingTop: 15 }}>
          <TextInput
            style={styles.textInputStyle}
            onChangeText={this.onChangeText.bind(this)}
            value={this.state.currText}
            placeholder="Type a root for your argument tree..."
            placeholderTextColor="#686868"
          />
        </View>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => this.goToList()}>
          <Text>Start An Argument Tree!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  title: "Start a New Tree"
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems:'center',
    justifyContent:'center'
  },
  textInputStyle:{ 
    height: 40, 
    width: Dimensions.get('window').width*2/3, 
    borderColor: 'gray', 
    borderWidth: 1,
    paddingLeft: 10
  },
  buttonStyle: {
    width: Dimensions.get('window').width*2/3, 
    padding: 15,
    backgroundColor: 'green',
    borderRadius: 5,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
