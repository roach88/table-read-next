import type { Meta, StoryObj } from "@storybook/react";
import { Menubar } from "./menubar";

const meta: Meta<typeof Menubar> = {
  title: "UI/Menubar",
  component: Menubar,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  args: {},
};
