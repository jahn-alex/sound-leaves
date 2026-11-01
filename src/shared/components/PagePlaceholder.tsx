import { Stack, Text, Title } from '@mantine/core';

type PagePlaceholderProps = {
  title: string;
  description: string;
};

export default function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <Stack gap="xs">
      <Title order={2}>{title}</Title>
      <Text c="dimmed">{description}</Text>
    </Stack>
  );
}
