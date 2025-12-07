import { Accordion, Box, Span } from "@chakra-ui/react";

export type AcordionOptionsProps = {
  value: string;
  title: React.ReactNode;
  text: React.ReactNode[];
};
export interface AcordionOptionsComponentProps {
  items: AcordionOptionsProps[];
}
export default function AcordionOptions({
  items,
}: AcordionOptionsComponentProps) {
  //   const defaultOpenValues = items.map((item) => item.value);

  return (
    <Accordion.Root multiple defaultValue={[]}>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.value}>
          <Accordion.ItemTrigger>
            <Span flex="1">{item.title}</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              {item.text.map((t, index) => (
                <Box key={index}>{t}</Box>
              ))}
            </Accordion.ItemBody>
            {/* <Accordion.ItemBody>{item.text}</Accordion.ItemBody> */}
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
