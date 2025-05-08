import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {},
};
