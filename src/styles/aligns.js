import {
    StyleSheet
} from 'react-native'

export const aligns = StyleSheet.create({
    alignCenter: {
        alignItems: 'center'
    },
    alignEnd: {
        alignItems: 'flex-end'
    },
    alignStart: {
        alignItems: 'flex-start'
    },
    justifyCenter: {
        justifyContent: 'center'
    },
    justifyEnd: {
        justifyContent: 'flex-end'
    },
    justifyStart: {
        justifyContent: 'flex-start'
    },
    fillHeight: {
        height: '100%'
    },
    row: {
        flexDirection: 'row'
    },
    column: {
        flexDirection: 'column'
    },
})
