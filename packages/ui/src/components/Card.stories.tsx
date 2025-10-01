import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Theme, Text, Flex, Heading } from '@radix-ui/themes';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Theme>
        <div style={{ width: '400px' }}>
          <Story />
        </div>
      </Theme>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <Flex direction="column" gap="3">
        <Heading size="3">Card Title</Heading>
        <Text>This is a card component based on Radix UI themes.</Text>
      </Flex>
    ),
  },
};

export const Variants: Story = {
  render: () => (
    <Flex direction="column" gap="3">
      <Card variant="surface">
        <Text>Surface variant</Text>
      </Card>
      <Card variant="classic">
        <Text>Classic variant</Text>
      </Card>
    </Flex>
  ),
};

export const WithPadding: Story = {
  render: () => (
    <Flex direction="column" gap="3">
      <Card size="1">
        <Text>Size 1 padding</Text>
      </Card>
      <Card size="2">
        <Text>Size 2 padding</Text>
      </Card>
      <Card size="3">
        <Text>Size 3 padding</Text>
      </Card>
    </Flex>
  ),
};
