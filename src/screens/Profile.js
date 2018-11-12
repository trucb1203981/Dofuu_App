import React, { Component } from 'react'

import { View, Text } from 'react-native'

import { 
    Left,
    Body,
    Right,
    Header,
    Item,
    Title,
    Input,
    Button,
    Icon, 
    Card, 
    CardItem,
    List,
    ListItem,
    Separator, 
    Thumbnail
} from 'native-base'

import { styles, aligns, text, colors, spacing } from '../styles'
import { Searchbar } from 'react-native-paper';

export default class Profile extends Component {
    
    static navigationOptions = ({ navigation, navigationOptions }) => ({
        header     : null,
        title      : `Tài Khoản`,
        tabBarLabel: 'Tài Khoản',
        tabBarIcon : ({ tintColor, focused }) => (
			<Icon type="MaterialCommunityIcons" name={focused ? "account" : "account-outline"}  style={{ color: tintColor, fontSize: 25 }} />
		)
    })
    
    render() {
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <Header searchBar rounded style={colors.white}>
                    <Item rounded style={colors.greyLighten4}>
                        <Icon name="ios-search" />
                        <Input placeholder="Tìm kiếm món, quán ăn..." onFocus  = {() => navigation.state.routeName != 'Search' ? navigation.navigate('Search') : null}/>
                    </Item>
                </Header>
                
                <Card transparent>
                    <CardItem button onPress={() => alert('ok')} style={[aligns.column, aligns.justifyCenter]}>
                        <Thumbnail large source={{uri: 'https://www.dofuu.com/storage/100000055/av/dofuu-620181001-6100000055-61538399936.jpeg'}} />
                        <Text style={[text.textDark, text.fontWeightBold, text.headline]}>Nguyễn Trung Trực</Text>
                    </CardItem>                    
                </Card>

                <Card transparent>
                    <List style={colors.white}>
                        <ListItem icon button onPress={() => alert('bộ sưu tập')}>
                            <Left>
                                <Button style={[colors.blue, styles.circle]}>
                                    <Icon type="MaterialCommunityIcons" name="bookmark" />
                                </Button>
                            </Left>
                            <Body><Text>Bộ sưu tập</Text></Body> 
                        </ListItem>
                        <ListItem icon button onPress={() => alert('Lịch sử đặt món')} last>
                            <Left>
                                <Button style={[colors.redDarken3, styles.circle]}>
                                    <Icon type="MaterialCommunityIcons" name="history" />
                                </Button>                               
                            </Left>
                            <Body><Text>Lịch sử đặt món</Text></Body>
                        </ListItem>
                        <Separator bordered  style={colors.greyLighten4} />
                        <ListItem last>
                            <Body>
                                <Button block style={[colors.redDarken1, styles.rounded]} small hasText onPress={() => alert('Đăng xuất')}>
                                    <Text style={text.textWhite}>ĐĂNG XUẤT</Text>
                                </Button>   
                            </Body>
                        </ListItem>
                    </List>                    
                </Card>
            </View>
        )
    }
}

