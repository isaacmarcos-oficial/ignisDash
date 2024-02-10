import { ComponentProps, ReactNode } from "react";

export interface BubbleButtonProps extends ComponentProps<"button"> {
  children: ReactNode;
}

export function BubbleButton(props: BubbleButtonProps) {
  return (
    <button className="p-2 text-sm flex items-center gap-1.5 font-medium leading-none hover:text-zinc-600 data-[active=true]:text-zinc-600 data-[active=true]:bg-zinc-200" {...props}>
      {/* {props.children} */}
    </button>
  );
}
