import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function PasswordInput({
  value,
  onChange,
  name,
  placeholder,
  onKeyDown,
  onFocus,
  onBlur,
}) {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);

  return (
    <InputGroup>
      <Input
        type={show ? "text" : "password"}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <InputRightElement>
        <IconButton
          size="sm"
          variant="ghost"
          aria-label={show ? "Hide password" : "Show password"}
          icon={show ? <ViewOffIcon /> : <ViewIcon />}
          onClick={toggle}
        />
      </InputRightElement>
    </InputGroup>
  );
}
