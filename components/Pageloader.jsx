import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import {styles} from "../assets/styles/home.styles"
import { COLORS } from '../constants/colors'

const Pageloader = () => {
  return (
    <View style={styles.loadingContainer} >
     <ActivityIndicator size='large' style={COLORS.primary}/>
    </View>
  )
}

export default Pageloader