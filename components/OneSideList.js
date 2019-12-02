import React, { Component } from 'react';
import { FlatList, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import firestore from '../firebase';

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

export default class OneSideList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currText: ''
        }
    }

    componentDidMount = async () => {
        //load list with children of this parent
        let parentRef = firestore.doc('nodes/' + this.props.argData.parentArg);
        parentRef.get()
            .then(async doc => {
                if (!doc.exists) {
                    console.log("Parent doesn't exist");
                } else {
                    const data = doc.data();
                    var children = data.children;
                    var newData = [];
                    children = children.filter(child => child.side === this.props.argData.side)
                    for (var i = 0; i < children.length; i++) {
                        newData.push({ content: children[i].content });
                    }
                    this.setState({ data: newData });
                }
            })

    }


    addListItem = async () => {
        const newChildText = this.state.currText;
        var copy = JSON.parse(JSON.stringify(this.state.data));
        copy.push({ content: newChildText });
        this.setState({ data: copy, currText: '' });

        //add new node to db:
        let newNodeRef = firestore.doc('nodes/' + newChildText);
        const content =
        {
            text: newChildText,
            parent: this.props.argData.parentArg,
            children: [],
            side: this.props.argData.side,
            rootNode: false
        };
        await newNodeRef.set(content);

        //add new node as child to parent node:
        let parentNodeRef = firestore.doc('nodes/' + this.props.argData.parentArg);
        parentNodeRef.get()
            .then(async doc => {
                if (!doc.exists) {
                    console.log('Parent node of this child does not exist!');
                } else {
                    const data = doc.data();
                    let newChildren = data.children;
                    newChildren.push(
                        {
                            content: newChildText,
                            side: this.props.argData.side
                        }
                    );
                    console.log('setting parent node')
                    const content =
                    {
                        text: data.text,
                        parent: data.parent,
                        children: newChildren,
                        rootNode: data.rootNode,
                    };
                    await parentNodeRef.set(content);
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });
    }

    onChangeText(newText) {
        this.setState({ currText: newText });
    }

    render() {
        return (
            <View
                style={
                    {
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        paddingTop: 10
                    }
                }>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 1
                }}>
                    {/* <Text style={{
                            fontWeight: 'bold',
                        }}>{this.props.argData.side}:</Text> */}
                    {/* <View style={{flexDirection: 'column'}}>
                        <Text style={{
                            fontWeight: 'bold',
                        }}>{this.props.argData.side}:
                        </Text> */}
                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
                            <Text style={{ flex: 1, flexWrap: 'wrap' }}>
                            {this.props.argData.side}: "{this.props.argData.parentArg}"
                        </Text>
                        {/* </View> */}
                    </View>

                </View>
                <View style={{
                    flex: 2,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TextInput
                        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, paddingLeft: 10
                    }}
                        onChangeText={this.onChangeText.bind(this)}
                        value={this.state.currText}
                    />
                    <Button
                        title="Add item"
                        onPress={this.addListItem.bind(this)}
                    />
                </View>
                <View
                    style={{ flex: 20 }}
                >
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) => <ListItem content={item.content} nav={this.props.nav} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        )
    }
}