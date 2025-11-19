import { Image, StyleSheet, View } from "react-native";

// custom component
import AppText from "../../AppText";

export default function RouteCard() {
    return (
        <View style={styles.container}>
            <View style={styles.routeNo}>
                <AppText size={20} style={{ color: '#FFF', fontWeight: 'semibold'}}>
                    1
                </AppText>
            </View>
            <View style={styles.routeDetailContainer}>
                <Image source={require('@/assets/icons/bus.png')} style={styles.busIcon}/>
                <View style={styles.ypsBadge}>
                    <AppText size={10} style={{ fontWeight: 'bold' }}>YPS</AppText>
                </View>
                <AppText size={16} style={styles.routeTitle}>လှည်းကူးဈေး - ဇဝန</AppText>
                <AppText 
                    size={14} 
                    style={styles.routeDescription}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >(လှည်းကူးတာဆုံ - ပေါက်ကုန်းရွာလယ် -အမှတ်(၂)လမ်း- ဆားတလင်း ... )</AppText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D0D5DD',

        flexDirection: 'row',
        alignItems: 'center',

        position: 'relative'
    },
    busIcon: {
        width: 22,
        height: 22,
        position: 'absolute',
        top: 0,
        right: 0
    },
    ypsBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,

        backgroundColor: '#F4D159',
        paddingVertical: 2,
        paddingHorizontal: 8,

        borderRadius: 6
    },
    routeNo: {
        width: 54,
        height: 54,
        backgroundColor: '#2B6CB0',
        borderRadius: 27,

        justifyContent: 'center',
        alignItems: 'center'
    },
    routeDetailContainer: {
        flex: 1,
        marginLeft: 15,
        paddingRight: 40
    },
    routeTitle: {
        color: '#1F2937',
        fontWeight: 800,
        marginBottom: 5
    },
    routeDescription: {
        color: '#4B5563'
    }
})