import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {},
};
