import { Dialog, Portal, CloseButton, Heading } from "@chakra-ui/react";

interface ModalNotificationProps {
  open: boolean;
  onOpenChange: () => void;
  content: string;
  notifiTitle: string;
}

export default function ModalNotification({
  open,
  onOpenChange,
  notifiTitle,
  content,
}: ModalNotificationProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Context>
              {() => (
                <Dialog.Body pt="6" spaceY="3">
                  <Heading as={"h2"}>{notifiTitle}</Heading>
                  <p>{content}</p>
                </Dialog.Body>
              )}
            </Dialog.Context>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
