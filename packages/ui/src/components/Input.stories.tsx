import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Theme, TextField, Flex } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

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
      <TextField.Root variant="surface">
        <Input placeholder="Surface variant" />
      </TextField.Root>
      <TextField.Root variant="classic">
        <Input placeholder="Classic variant" />
      </TextField.Root>
      <TextField.Root variant="soft">
        <Input placeholder="Soft variant" />
      </TextField.Root>
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex direction="column" gap="3">
      <TextField.Root size="1">
        <Input placeholder="Size 1" />
      </TextField.Root>
      <TextField.Root size="2">
        <Input placeholder="Size 2" />
      </TextField.Root>
      <TextField.Root size="3">
        <Input placeholder="Size 3" />
      </TextField.Root>
    </Flex>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <TextField.Root>
      <TextField.Slot>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
      <Input placeholder="Search..." />
    </TextField.Root>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};
