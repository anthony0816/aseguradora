import { Field, Input, InputGroup } from "@chakra-ui/react";

interface AuthInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  invalid?: boolean;
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  value?: string;
  required?: boolean;
  type?:
    | "number"
    | "color"
    | "date"
    | "time"
    | "button"
    | "search"
    | "image"
    | "text"
    | "hidden"
    | "checkbox"
    | "datetime-local"
    | "email"
    | "file"
    | "month"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "submit"
    | "tel"
    | "url"
    | "week"
    | undefined;
  onChange?: (value: string) => void;
}

export default function AuthInput({
  label,
  placeholder,
  error,
  invalid,
  startElement,
  endElement,
  value,
  type,
  required,
  onChange,
}: AuthInputProps) {
  return (
    <Field.Root invalid={invalid}>
      <Field.Label>{label}</Field.Label>
      <InputGroup startElement={startElement} endElement={endElement}>
        <Input
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          type={type}
          placeholder={placeholder}
          required={required}
        />
      </InputGroup>
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  );
}
