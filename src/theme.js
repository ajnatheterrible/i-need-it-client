import { extendTheme } from "@chakra-ui/react";

const sharedDisabledStyle = {
  cursor: "default",
  opacity: 0.5,
  color: "gray.500",
  _placeholder: {
    color: "gray.500",
  },
};

const theme = extendTheme({
  components: {
    Input: {
      baseStyle: {
        field: {
          _disabled: sharedDisabledStyle,
        },
      },
    },
    Select: {
      parts: ["field", "icon"],
      baseStyle: {
        field: {
          _disabled: sharedDisabledStyle,
        },
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          _disabled: {
            cursor: "default",
          },
        },
        label: {
          _disabled: {
            cursor: "default",
          },
        },
        container: {
          _disabled: {
            cursor: "default",
            pointerEvents: "auto",
          },
        },
      },
    },
    Switch: {
      baseStyle: {
        track: {
          _disabled: {
            cursor: "default",
          },
        },
        thumb: {
          _disabled: {
            cursor: "default",
          },
        },
        label: {
          _disabled: {
            cursor: "default",
          },
        },
        container: {
          _disabled: {
            cursor: "default",
            pointerEvents: "auto",
          },
        },
      },
    },
  },
});

export default theme;
