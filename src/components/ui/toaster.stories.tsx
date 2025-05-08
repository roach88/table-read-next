import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "./toaster";

const meta: Meta<typeof Toaster> = {
  title: "UI/Toaster",
  component: Toaster,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  args: {},
};
