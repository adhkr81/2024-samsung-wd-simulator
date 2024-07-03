/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { forwardRef } from "react";

export const IconButton = forwardRef(
  ({ title, label, Icon, onClick, cls, onMouseEnter, onMouseLeave, objsize }, ref) => {
    const props = Object.fromEntries(
      Object.entries({ title, label, onClick, className: cls, onMouseEnter, onMouseLeave }).filter(
        // eslint-disable-next-line no-unused-vars
        ([_, value]) => value !== undefined
      )
    );
    return (
      <object ref={ref} style={{ ...objsize }} {...props}>
        <Icon />
      </object>
    );
  }
);
