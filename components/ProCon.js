import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import OneSideList from './OneSideList';
import Swiper from 'react-native-swiper';
import firestore from '../firebase';


export default class ProCon extends Component {
    constructor(props){
        super(props);
    }

    navigateToAnotherProCon(parent){
        //the reason for all this confusion is because I navigate to the ProCon component from two places
        //once from new tree tab and once from existing trees tab and they need to behave differently in
        //that from existing trees they need to go to the ProCon2 navigation handle so that the user
        //can properly press "back" and not go to the wrong tab. In other words, it needs to be that
        //there is separate navigation for two instances of the same component. I've acheived this
        //by passing a boolean to indicate which navigation it should be in. I pass it in both from 
        //the ProfileScreen (currently called Links Screen) and also here, I pass it along from props
        //so user can recursively go down argument tree and remain in same tab navigation.
        const fromProfile = this.props.navigation.getParam("fromProfile");
        const nextScreen = fromProfile ? "ProCon2" : "ProCon";
        this.props.navigation.push(nextScreen, {argumentSeed: parent, fromProfile: this.props.navigation.getParam("fromProfile")});
    }

    componentDidMount = async () => {
        //add root node to db if doesn't exist:
        const text = this.props.navigation.getParam("argumentSeed");
        let newNodeRef = firestore.doc('nodes/' + text);
        newNodeRef.get()
            .then( async doc => {
                if (!doc.exists) {
                    console.log("trying to create new root node")
                    const content = {text: text, parent: null, children: [], rootNode: true};
                    await newNodeRef.set(content);
                }
            })

    }
    
    render() {
        // console.log(this.props.navigation);
        const parent = this.props.navigation.getParam("argumentSeed");
        return (
            <ScrollView
                contentContainerStyle={{paddingTop: 30}}
            >
                <View >
                    <Swiper style={styles.wrapper} showsButtons={true}>
                        <OneSideList nav={this.navigateToAnotherProCon.bind(this)} argData={{side: 'Supporting', parentArg: parent}}/>
                        <OneSideList nav={this.navigateToAnotherProCon.bind(this)} argData={{side: 'Opposing', parentArg: parent}}/>
                    </Swiper>
                </View>
            </ScrollView>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    }
}
);