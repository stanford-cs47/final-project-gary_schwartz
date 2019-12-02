import React from 'react';
import { ScrollView, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import firestore from '../firebase';

export default class ExistingTreesScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            existingTreeRootNames: [],
            unsubscribe: null,
        }
    }

    goToList(rootArg) {
        //the reason for all this confusion is because I navigate to the ProCon component from two places
        //once from new tree tab and once from existing trees tab and they need to behave differently in
        //that from existing trees they need to go to the ProCon2 navigation handle so that the user
        //can properly press "back" and not go to the wrong tab. In other words, it needs to be that
        //there is separate navigation for two instances of the same component. I've acheived this
        //by passing a boolean to indicate which navigation it should be in. I pass it in both from 
        //the ProfileScreen (currently called Links Screen) and also here, I pass it along from props
        //so user can recursively go down argument tree and remain in same tab navigation.
        this.props.navigation.navigate("ProCon2", { argumentSeed: rootArg, fromProfile: true });
    }

    getAllTrees = async () => {
        let nodesCollectionRef = firestore.collection("nodes").where('rootNode', '==', true);
        var rootNodes = await nodesCollectionRef.get();
        var newRoots = [];
        rootNodes.forEach(single => {
            const data = single.data();
            newRoots.push(data);
        })
        this.setState({ existingTreeRootNames: newRoots });
    }

    componentDidMount = async () => {
        let nodesCollectionRef = firestore.collection("nodes").where('rootNode', '==', true);
        let unsubscribe = nodesCollectionRef.onSnapshot(() => {
            this.getAllTrees();
        });
        this.setState({unsubscribe});
        this.getAllTrees();
    }

    componentWillUnmount() {
        this.state.unsubscribe();
      }

    render() {
        return (
            <ScrollView style={styles.container}>
                {/* <View>
                    {this.state.existingTreeRootNames.map((item, index) => {
                        return <Text key={index}>{item.text}</Text>
                    })}
                </View> */}

                <FlatList
                    data={this.state.existingTreeRootNames}
                    renderItem={({ item }) => <ListItem content={item.text} nav={(() => this.goToList(item.text)).bind(this)} />}
                    keyExtractor={(item, index) => index.toString()}
                />

            </ScrollView>
        );
    }
}

ExistingTreesScreen.navigationOptions = {
    title: 'Your Existing Trees',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },
});


function ListItem({ content, nav }) {

    return (
        <TouchableOpacity onPress={() => nav(content)}
            style={
                {
                    flex: 1,
                    flexDirection: 'row',
                    padding: 15,
                    backgroundColor: 'green',
                    borderRadius: 5,
                    margin: 5,
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }>
            <Text>{content}</Text>
        </TouchableOpacity>
    )
}