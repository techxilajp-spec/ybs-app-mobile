import { ToastConfigParams } from "react-native-toast-message";
import ErrorToast from "../components/ErrorToast";

export const toastConfig = {
  customError: ({ text1, text2 }: ToastConfigParams<any>) => (
    <ErrorToast
      title={text1 ?? ""}
      message={text2 ?? ""}
    />
  ),
};
