import { Drawer, Button, Portal, CloseButton, Icon } from "@chakra-ui/react";

import AcordionOptions, { AcordionOptionsProps } from "./acordionOptions";
import MenuIcon from "@mui/icons-material/Menu";
import { DrawerRootProps } from "@chakra-ui/react";
import { ButtonProps } from "@chakra-ui/react";

interface MobileLateralMenuProps {
  title: React.ReactNode;
  placement?: DrawerRootProps["placement"];
  items: AcordionOptionsProps[];
  triggerSize?: ButtonProps["size"];
  open: boolean;
  setOpen: (open: boolean) => void;
  onTitleClick?: () => void;
}

export default function MobileLateralMenu({
  title,
  placement = "start",
  items,
  triggerSize = "sm",
  open,
  setOpen,
  onTitleClick,
}: MobileLateralMenuProps) {
  return (
    <Drawer.Root
      placement={placement}
      open={open}
      onOpenChange={() => setOpen(!open)}
    >
      <Drawer.Trigger asChild>
        <Button variant="outline" size={triggerSize}>
          <Icon>
            <MenuIcon />
          </Icon>
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title
                cursor={onTitleClick ? "pointer" : "default"}
                onClick={onTitleClick}
                _hover={onTitleClick ? { color: "blue.500" } : {}}
                transition="color 0.2s"
              >
                {title}
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <AcordionOptions items={items} />
            </Drawer.Body>
            <Drawer.Footer>
              {/* <Button variant="outline">Cancel</Button>
                  <Button>Save</Button> */}
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
