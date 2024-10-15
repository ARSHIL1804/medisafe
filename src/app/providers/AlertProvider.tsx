import {} from "@radix-ui/react-alert-dialog";
import { createContext, useState, useContext, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createHook } from "async_hooks";
type AlertContent = {
  title: string;
  content: string;
  visible: boolean;
  positiveLable?: string;
  negativeLable?: string;
  positiveAction?: () => void;
  negativeAction?: () => void;
};
type AlertContext = {
  showAlert: (
    title: string,
    content: string,
    positiveLable?: string,
    positiveAction?: () => void,
    negativeLable?: string,
    negativeAction?: () => void
  ) => void;
  hideAlert: () => void;
};

const defaultAlertContent = {
  title: "",
  content: "",
  visible: false,
};
export const AlertContext = createContext<AlertContext>({
  showAlert: (
    title: string,
    content: string,
    positiveLable?: string,
    positiveAction?: () => void,
    negativeLable?: string,
    negativeAction?: () => void
  ) => {},
  hideAlert: () => {},
});
export default function AlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alertContent, setAlertContent] =
    useState<AlertContent>(defaultAlertContent);

  function showAlert(
    title: string,
    content: string,
    positiveLable?: string,
    positiveAction?: () => void,
    negativeLable?: string,
    negativeAction?: () => void
  ) {
    setAlertContent({
      title: title,
      content: content,
      visible: true,
      positiveLable,
      negativeLable,
      positiveAction,
      negativeAction,
    });
  }
  function hideAlert() {
    setAlertContent(defaultAlertContent);
  }
  useEffect(() => {
    const showEventHandler = (event: Event) => {
      const showAlertEvent = event as CustomEvent<string>;
      showAlert("Error", showAlertEvent.detail, "Close", hideAlert);
    }

    document.addEventListener("showAlert", showEventHandler);

    return () => {
      document.removeEventListener("showAlert", showEventHandler);
    };
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      <AlertDialog open={alertContent.visible}>
        <AlertDialogContent className="w-[350px] px-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              {alertContent.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-md text-center">
              {alertContent.content}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alertContent.negativeLable && (
              <AlertDialogCancel onClick={alertContent.negativeAction}>
                {alertContent.negativeLable}
              </AlertDialogCancel>
            )}
            {alertContent.positiveLable && (
              <AlertDialogAction onClick={alertContent.positiveAction}>
                {alertContent.positiveLable}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  return useContext(AlertContext);
};
