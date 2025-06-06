import type { Meta, StoryObj } from "@storybook/react";
import { AlertDialog } from "./alert-dialog";

const meta: Meta<typeof AlertDialog> = {
  title: "UI/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof AlertDialog>;

export const Default: Story = {
  args: {},
};
