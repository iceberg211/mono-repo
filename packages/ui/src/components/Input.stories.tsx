import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Theme, Flex } from '@radix-ui/themes';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Theme>
        <div style={{ width: '300px' }}>
          <Story />
        </div>
      </Theme>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Variants: Story = {
  render: () => (
    <Flex direction="column" gap="3">
      <Input variant="surface" placeholder="Surface variant" />
      <Input variant="classic" placeholder="Classic variant" />
      <Input variant="soft" placeholder="Soft variant" />
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex direction="column" gap="3">
      <Input size="1" placeholder="Size 1" />
      <Input size="2" placeholder="Size 2" />
      <Input size="3" placeholder="Size 3" />
    </Flex>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};
