import Toast from 'react-native-toast-message';

export function showErrorToast(
    title: string,
    message: string,
) {
    Toast.show({
        type : "customError",
        position: "top",
        text1: title,
        text2: message
    })
}